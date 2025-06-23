const fs = require("fs");
const path = require("path");

const EXCLUDED_FILES = ['.DS_Store'];
const EXCLUDED_DIRS = ['node_modules', '.git'];

const allowedTextExtensions = [
  '.txt', '.md', '.json', '.js', '.ts', '.jsx', '.tsx',
  '.html', '.css', '.scss', '.yml', '.yaml', '.xml', '.csv', '.env'
];

function isHidden(name) {
  return name.startsWith('.');
}

function isTextFile(filePath) {
  return allowedTextExtensions.includes(path.extname(filePath).toLowerCase());
}

function readDirRecursive(dirPath, depth = 0, maxDepth = 10) {
  if (depth > maxDepth) return [];

  if (!fs.statSync(dirPath).isDirectory()) {
    console.log("给的是文件: ", dirPath);
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
    } else {
      files.push(node);
    }
  }

  return [...dirs, ...files];
}

module.exports = {
  readDirRecursive,
};