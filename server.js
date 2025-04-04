const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const sanitize = require('sanitize-filename');

const app = express();
const port = 3000;

// 配置
const CDN_FOLDER = path.resolve(__dirname, 'cdn_files');
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

// 终端颜色常量
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m"
};

// 确保cdn_files目录存在
if (!fs.existsSync(CDN_FOLDER)) {
    fs.mkdirSync(CDN_FOLDER, { recursive: true });
    console.log(`${colors.green}✓${colors.reset} 创建文件存储目录: ${colors.yellow}${CDN_FOLDER}${colors.reset}`);
}

// 安全中间件
app.use(cors({
    origin: ['http://localhost:3000']
}));
app.use(express.json());
app.use(express.static('public'));

// 安全防护 - 防止路径遍历攻击
const resolveSafePath = (relativePath) => {
    const normalizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(CDN_FOLDER, normalizedPath);
    
    if (!absolutePath.startsWith(CDN_FOLDER)) {
        throw new Error('非法路径访问');
    }
    
    return absolutePath;
};

// 文件上传配置 (带安全限制)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const userPath = req.body.path ? sanitize(req.body.path) : '';
            const uploadPath = resolveSafePath(userPath);
            
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true, mode: 0o755 });
                console.log(`${colors.cyan}⚡${colors.reset} 创建上传目录: ${colors.yellow}${uploadPath}${colors.reset}`);
            }
            
            cb(null, uploadPath);
        } catch (error) {
            console.error(`${colors.red}⚠${colors.reset} 目录创建错误: ${error.message}`);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const cleanName = sanitize(file.originalname);
        if (!cleanName) {
            return cb(new Error('无效的文件名'));
        }
        cb(null, cleanName);
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 10
    },
    fileFilter: (req, file, cb) => {
        const forbiddenTypes = [
            '.exe', '.msi', '.bat', '.cmd', '.sh', 
            '.php', '.phtml', '.htaccess', '.jar'
        ];
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (forbiddenTypes.includes(ext)) {
            console.log(`${colors.red}⚠${colors.reset} 拦截危险文件: ${colors.yellow}${file.originalname}${colors.reset}`);
            return cb(new Error('禁止上传此类型文件'));
        }
        
        cb(null, true);
    }
});

// 获取客户端IP
const getClientIp = (req) => {
    return req.ip || 
           req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           req.connection.socket.remoteAddress;
};

// API路由

// 获取文件列表
app.get('/api/list', (req, res) => {
    const clientIP = getClientIp(req);
    const requestPath = req.query.path || '根目录';
    
    console.log(`${colors.blue}${colors.bright}[访问]${colors.reset} ${colors.yellow}${clientIP}${colors.reset} 访问路径: ${colors.cyan}${requestPath}${colors.reset}`);
    
    try {
        const relativePath = req.query.path ? sanitize(req.query.path) : '';
        const dirPath = resolveSafePath(relativePath);
        
        if (!fs.existsSync(dirPath)) {
            console.log(`${colors.red}⚠${colors.reset} 目录不存在: ${colors.yellow}${dirPath}${colors.reset}`);
            return res.status(404).json({ error: '目录不存在' });
        }
        
        const stat = fs.statSync(dirPath);
        if (!stat.isDirectory()) {
            return res.status(400).json({ error: '路径不是目录' });
        }
        
        const files = fs.readdirSync(dirPath).map(file => {
            const filePath = path.join(dirPath, file);
            const fileStat = fs.statSync(filePath);
            
            return {
                name: file,
                isDirectory: fileStat.isDirectory(),
                size: fileStat.size,
                mtime: fileStat.mtime
            };
        });
        
        files.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return a.name.localeCompare(b.name);
        });
        
        res.json({ files });
    } catch (error) {
        console.error(`${colors.red}⚠${colors.reset} 列表错误: ${error.message}`);
        res.status(400).json({ error: '获取文件列表失败' });
    }
});

// 上传文件
app.post('/api/upload', upload.array('files'), (req, res) => {
    const clientIP = getClientIp(req);
    const totalSize = (req.files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(2);
    const fileCount = req.files.length;
    const uploadPath = req.body.path || '根目录';
    
    console.log(`${colors.green}${colors.bright}[上传]${colors.reset} ${colors.cyan}${clientIP}${colors.reset} 上传了 ${colors.yellow}${fileCount}个文件${colors.reset} (${totalSize}MB) 到 ${colors.cyan}${uploadPath}${colors.reset}`);
    
    res.json({ 
        uploadedCount: req.files.length,
        path: req.body.path || ''
    });
}, (error, req, res, next) => {
    const clientIP = getClientIp(req);
    console.error(`${colors.red}⚠${colors.reset} 上传错误 [${clientIP}]: ${error.message}`);
    
    res.status(400).json({ 
        error: error.message || '文件上传失败',
        details: error.code === 'LIMIT_FILE_SIZE' ? '文件大小超过限制(200MB)' : null
    });
});

// 预览文件
app.get('/api/preview', (req, res) => {
    const clientIP = getClientIp(req);
    
    try {
        const relativePath = req.query.path ? sanitize(req.query.path) : '';
        if (!relativePath) {
            return res.status(400).json({ error: '缺少路径参数' });
        }
        
        const filePath = resolveSafePath(relativePath);
        
        if (!fs.existsSync(filePath)) {
            console.log(`${colors.red}⚠${colors.reset} 文件不存在 [${clientIP}]: ${colors.yellow}${filePath}${colors.reset}`);
            return res.status(404).json({ error: '文件不存在' });
        }
        
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            return res.status(400).json({ error: '无法预览目录' });
        }
        
        if (stat.size > 2 * 1024 * 1024) {
            console.log(`${colors.yellow}⚠${colors.reset} 文件过大 [${clientIP}]: ${colors.yellow}${filePath} (${(stat.size/(1024*1024)).toFixed(2)}MB)${colors.reset}`);
            return res.status(400).json({ error: '文件过大，请下载查看' });
        }
        
        const ext = path.extname(filePath).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
        const isText = ['.txt', '.json', '.js', '.css', '.md', '.log'].includes(ext);
        const isHTML = ['.html', '.htm'].includes(ext);
        
        let content = '';
        if ((isText || isHTML) && stat.size <= 200 * 1024) {
            content = fs.readFileSync(filePath, 'utf-8');
        }
        
        console.log(`${colors.blue}${colors.bright}[预览]${colors.reset} ${colors.cyan}${clientIP}${colors.reset} 预览文件: ${colors.yellow}${filePath}${colors.reset}`);
        
        res.json({
            isImage,
            isText,
            isHTML,
            content
        });
    } catch (error) {
        console.error(`${colors.red}⚠${colors.reset} 预览错误 [${clientIP}]: ${error.message}`);
        res.status(400).json({ error: '预览文件失败' });
    }
});

// 静态文件服务
app.use('/cdn_files', (req, res, next) => {
    const clientIP = getClientIp(req);
    
    try {
        const requestPath = req.path;
        const filePath = resolveSafePath(requestPath);
        
        if (!fs.existsSync(filePath)) {
            console.log(`${colors.red}⚠${colors.reset} 静态文件不存在 [${clientIP}]: ${colors.yellow}${filePath}${colors.reset}`);
            return res.status(404).send('文件不存在');
        }
        
        if (path.basename(filePath).startsWith('.')) {
            console.log(`${colors.red}⚠${colors.reset} 尝试访问隐藏文件 [${clientIP}]: ${colors.yellow}${filePath}${colors.reset}`);
            return res.status(403).send('禁止访问');
        }
        
        console.log(`${colors.green}✓${colors.reset} 文件访问 [${clientIP}]: ${colors.cyan}${filePath}${colors.reset}`);
        
        express.static(CDN_FOLDER, {
            dotfiles: 'ignore',
            index: false,
            setHeaders: (res, path) => {
                const ext = path.extname(path).toLowerCase();
                if (ext === '.html' || ext === '.htm') {
                    res.setHeader('X-Content-Type-Options', 'nosniff');
                }
            }
        })(req, res, next);
    } catch (error) {
        console.error(`${colors.red}⚠${colors.reset} 静态文件错误 [${clientIP}]: ${error.message}`);
        res.status(400).send('非法请求');
    }
});

// 错误处理
app.use((err, req, res, next) => {
    const clientIP = getClientIp(req);
    console.error(`${colors.red}⚠${colors.bright}[错误]${colors.reset} [${clientIP}] ${err.stack || err.message}`);
    res.status(500).json({ error: '服务器错误' });
});

// 启动服务器
app.listen(port, 'localhost', () => {
    console.log(`${colors.magenta}${colors.bright}
    ███╗   ██╗███████╗ ██████╗ ███╗   ██╗ ██████╗ ███╗   ██╗
    ████╗  ██║██╔════╝██╔═══██╗████╗  ██║██╔═══██╗████╗  ██║
    ██╔██╗ ██║█████╗  ██║   ██║██╔██╗ ██║██║   ██║██╔██╗ ██║
    ██║╚██╗██║██╔══╝  ██║   ██║██║╚██╗██║██║   ██║██║╚██╗██║
    ██║ ╚████║███████╗╚██████╔╝██║ ╚████║╚██████╔╝██║ ╚████║
    ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═══╝
    ${colors.reset}`);
    console.log(`${colors.green}✓${colors.reset} CDN服务已启动 ${colors.cyan}http://localhost:${port}${colors.reset}`);
    console.log(`${colors.green}✓${colors.reset} 文件存储目录: ${colors.yellow}${CDN_FOLDER}${colors.reset}`);
    console.log(`${colors.green}✓${colors.reset} 上传大小限制: ${colors.yellow}200MB${colors.reset}`);
    console.log(`${colors.green}✓${colors.reset} 安全模式: ${colors.yellow}已启用${colors.reset}`);
    console.log(`${colors.blue}⚡${colors.reset} 等待文件上传和访问...\n`);
});