// 💡 主进程接收渲染进程请求并保存文件内容 - 新增保存
const { dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path')


function registerFileHandlers() {

  ipcMain.handle('save-file-as', async (event, { path, content }) => {

    // 文件另存为
    const result = await dialog.showSaveDialog({
      title: '保存文件',
      path: path || 'untitled.txt',
      filters: [
        { name: 'Text Files', extensions: ['txt', 'md', 'json', 'js', 'ts'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (!result.canceled && result.filePath) {
      await fs.promises.writeFile(result.filePath, content, 'utf-8');
      return { success: true, filePath: result.filePath };
    }

    return { success: false };
  });

  // 写入文件（覆盖内容）
  ipcMain.handle('save-file', async (event, { path, content }) => {
    try {
      await fs.promises.writeFile(path, content, 'utf-8');
      return { success: true };
    } catch (err) {
      console.error('❌ 写入文件失败:', err);
      return { success: false, error: err.message };
    }
  });


  ipcMain.handle('create-file', async (event, { dir, name }) => {
    const target = path.join(dir, name);
    try {
      await fs.promises.writeFile(target, '');
      return { success: true, path: target };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('create-folder', async (event, { dir, name }) => {
    const target = path.join(dir, name);
    try {
      await fs.promises.mkdir(target, { recursive: true });
      return { success: true, path: target };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

}

module.exports = {
  registerFileHandlers,
};
