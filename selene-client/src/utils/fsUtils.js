const fs = require("fs");
const path = require("path");

const EXCLUDED_FILES = ['.DS_Store'];
const EXCLUDED_DIRS = ['node_modules', '.git'];

const allowedTextExtensions = [
  // 文本 & 配置类
  '.txt', '.md', '.json', '.yml', '.yaml', '.xml', '.csv', '.env',
  '.ini', '.conf', '.cfg', '.log', '.properties',

  // Web 前端
  '.html', '.css', '.scss', '.js', '.ts', '.jsx', '.tsx',

  // 后端语言
  '.py',     // Python
  '.rs',     // Rust
  '.go',     // Go
  '.java',   // Java
  '.c', '.h',           // C
  '.cpp', '.hpp',       // C++
  '.cs',                // C# (如果涉及 .NET)
  '.php',               // PHP
  '.rb',                // Ruby
  '.kt', '.kts',        // Kotlin

  // Shell & 脚本
  '.sh', '.bash', '.zsh', '.bat', '.ps1', '.cmd',

  // 数据库相关
  '.sql',

  // Makefile & 构建工具
  '.make', '.mk', 'Makefile', 'Dockerfile', 'CMakeLists.txt',

  // Markdown 相关
  '.md',

  // 图片预览（如果需要 inline 预览）
  '.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico',
  '.webp', '.bmp', '.tif', '.tiff', '.psd', '.eps', '.raw', '.indd',
];

function isHidden(name) {
  return name.startsWith('.');
}

function isTextFile(filePath) {
  return allowedTextExtensions.includes(path.extname(filePath).toLowerCase());
}

function readDirRecursive(dirPath, depth = 0, maxDepth = 10) {
  if (depth > maxDepth) return [];

  // if (!fs.statSync(dirPath).isDirectory()) {
  //   console.log("给的是文件: ", dirPath);
  //   return [];
  // }
  if (!fs.existsSync(dirPath)) {
    console.log("文件夹不存在: ", dirPath);
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  const dirs = [];
  const files = [];

  for (const entry of entries) {
    const name = entry.name;

    if (
      EXCLUDED_FILES.includes(name) ||
      EXCLUDED_DIRS.includes(name) ||
      isHidden(name)
    ) {
      continue;
    }

    const fullPath = path.join(dirPath, name);
    const isDir = entry.isDirectory();

    // 文件过滤
    if (!isDir && !isTextFile(fullPath)) {
      continue;
    }

    const node = {
      name,
      path: fullPath,
      isDirectory: isDir,
    };

    if (isDir) {
      node.children = readDirRecursive(fullPath, depth + 1, maxDepth);
      dirs.push(node);
      // console.log("目录: ", fullPath, " 深度: ", depth);
    } else {
      // console.log("文件: ", fullPath);
      files.push(node);
    }
  }

  return [...dirs, ...files];
}

module.exports = {
  readDirRecursive,
};