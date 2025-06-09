const fs = require("fs");
const path = require("path");


// 实现一个白名单文件类型后缀，只允许打开 这些文件，目前支持   .txt .md
const EXCLUDED_FILES = ['.DS_Store'];
const EXCLUDED_DIRS = ['node_modules', '.git'];

// const allowedTextExtensions = ['.txt', '.md', '.js', '.ts', '.json', '.html', '.css'];
const allowedTextExtensions = ['.txt', '.md', '.json', '.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.yml', '.yaml', '.xml', '.csv', '.env']; // 可自行扩展

function isHidden(name) {
    return name.startsWith('.');
}

function isTextFile(filePath) {
    return allowedTextExtensions.includes(path.extname(filePath).toLowerCase());
}

// 递归读取文件夹
function readDirRecursive(dirPath, depth = 0, maxDepth = 10) {
    if (depth > maxDepth) return [];

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const result = [];

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

        // ✅ 文件类型过滤
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
        }

        result.push(node);
    }

    return result;
}

module.exports = {
  readDirRecursive,
};