const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');

// 实现一个白名单文件类型后缀，只允许打开 这些文件，目前支持   .txt .md
const EXCLUDED_FILES = ['.DS_Store'];
const EXCLUDED_DIRS = ['node_modules', '.git'];

function isHidden(name) {
  return name.startsWith('.');
}

const allowedTextExtensions = ['.txt', '.md', '.js', '.ts', '.json', '.html', '.css'];

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

/**
 * 文件菜单配置
 * @param {BrowserWindow} win
 * @returns {Electron.MenuItemConstructorOptions}
 */
function createFileMenu(win) {
  return {
    label: '文件',
    submenu: [
      {
        label: '新建文本文件',
        click: () => {
          console.log('新建文本文件');
          // TODO: 发 IPC 给渲染进程处理
        },
      },
      {
        label: '新建目录',
        click: () => {
          console.log('新建目录');
        },
      },
      { type: 'separator' },
      {
        label: '打开文件',
        click: async () => {
          const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Text Files', extensions: allowedTextExtensions.map(e => e.replace('.', '')) }]
          });

          if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];

            if (!isTextFile(filePath)) {
              dialog.showErrorBox('无效文件', '只能打开文本类型文件。');
              return;
            }

            const content = fs.readFileSync(filePath, 'utf-8');
            win.webContents.send('open-text-file', {
              path: filePath,
              content
            });
          }
        }
      },
      {
        // label: '打开文件夹',
        // click: async () => {
        //   const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        //     properties: ['openDirectory'],
        //   });
        //   if (!canceled) {
        //     console.log('打开文件夹:', filePaths);
        //   }
        // },
        label: '打开文件夹',
        click: async () => {
          const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
          });

          if (!result.canceled && result.filePaths.length > 0) {
            const dirPath = result.filePaths[0];
            const contents = readDirRecursive(dirPath);
            win.webContents.send('replace-folders', {
              basePath: dirPath,
              contents
            });
          }
        }
      },
      {
        label: '打开最新的文件',
        click: () => {
          console.log('打开最新的文件');
        },
      },
      { type: 'separator' },
      {
        // label: '将文件夹添加到工作区',
        // click: () => {
        //   console.log('添加文件夹到工作区');
        // },
        label: '添加文件夹到工作区',
        click: async () => {
          const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
          });

          if (!result.canceled && result.filePaths.length > 0) {
            const dirPath = result.filePaths[0];
            const contents = readDirRecursive(dirPath);
            win.webContents.send('append-folder', {
              basePath: dirPath,
              contents
            });
          }
        }
      },
      { type: 'separator' },
      {
        label: '关闭文件夹',
        click: () => {
          console.log('关闭文件夹');
        },
      },
    ],
  };
}

// 读取文件夹下所有文件/文件夹（可根据需要简化）
// function readDirRecursive(dirPath) {
//   const items = fs.readdirSync(dirPath);
//   return items.map(name => {
//     const fullPath = path.join(dirPath, name);
//     const isDirectory = fs.statSync(fullPath).isDirectory();
//     return {
//       name,
//       path: fullPath,
//       isDirectory,
//     };
//   });
// }

module.exports = { createFileMenu };
