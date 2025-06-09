const fs = require('fs');
const path = require('path');
// const { dialog } = require('electron');
// const { BrowserWindow } = require('electron'); // ✅ 引入
const { dialog, BrowserWindow, ipcMain } = require('electron');
const {readDirRecursive} = require(path.join(__dirname, '../utils/fsUtils'));
const {addRoot, getRoots} = require(path.join(__dirname, '../ipc/modules/state'));

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
            console.log("打开文件夹:", dirPath)

           addRoot(dirPath);

            win.webContents.send('replace-folders', [{
              basePath: dirPath,
              contents
            }]);
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

            addRoot(dirPath);

            win.webContents.send('append-folder', {
              basePath: dirPath,
              contents
            });
          }
        }
      },
      { type: 'separator' },
      {
        label: '保存',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          if (win){
            win.webContents.send('file-save');
          }
        },
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


module.exports = { createFileMenu };
