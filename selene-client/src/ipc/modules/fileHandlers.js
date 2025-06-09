// 💡 主进程接收渲染进程请求并保存文件内容 - 新增保存
const { dialog, ipcMain, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path')
const { readDirRecursive } = require(path.join(__dirname, '../../utils/fsUtils'));
const { addRoot, getRoots } = require(path.join(__dirname, './state'));

// 加一个 delay 函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function registerFileHandlers() {

  // main.js 或全局变量中
  // let currentFolders = [];

  ipcMain.handle('read-file', async (event, filePath) => {
    return fs.promises.readFile(filePath, 'utf-8');
  });

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

  // 重命名
  ipcMain.handle('rename-path', async (event, { oldPath, newName }) => {
    try {
      const parentDir = path.dirname(oldPath);
      const newPath = path.join(parentDir, newName);

      if (!fs.existsSync(oldPath)) {
        return { success: false, error: "原路径不存在" };
      }

      await fs.promises.rename(oldPath, newPath);
      await delay(100); // 等待文件系统同步

      const win = BrowserWindow.getAllWindows()[0];
      const currentRoots = getRoots();

      const isRoot = currentRoots.some(root =>
        path.resolve(root) === path.resolve(oldPath)
      );

      console.log(`[重命名] 当前根目录:`, getRoots());
      console.log(`[重命名] oldPath: ${oldPath}, newPath: ${newPath}`);
      console.log(`[重命名] 是否根目录:`, isRoot);

      if (isRoot) {
        console.log("🔄 重命名根目录，刷新整个工作区");

        const contents = readDirRecursive(newPath);
        console.log("重命名根目录，刷新整个工作区, 重新调用 addRoot", newPath);

        addRoot(newPath);

        win?.webContents.send("replace-folders", [
          { basePath: newPath, contents }
        ]);
      } else {
        console.log("🔄 重命名子目录:", newName);

        const rootBase = currentRoots.find(root =>
          path.resolve(oldPath).startsWith(path.resolve(root))
        );

        if (rootBase && fs.existsSync(rootBase)) {
          console.log("🔄 仅刷新所属根目录:", rootBase);

          const rootContents = readDirRecursive(rootBase);

          console.log("仅刷新所属根目录, 重新调用 addRoot", rootBase);
          addRoot(rootBase);

          win?.webContents.send("replace-folder", {
            basePath: rootBase,
            contents: rootContents,
          });
        } else {
          console.warn("⚠️ 未找到所属根目录，刷新新路径");
          const contents = readDirRecursive(newPath);
          win?.webContents.send("replace-folder", {
            basePath: newPath,
            contents,
          });
        }
      }

      return { success: true, newPath };
    } catch (err) {
      console.error("❌ 重命名失败", err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('delete-path', async (event, { targetPath }) => {
    try {
      const stat = await fs.promises.stat(targetPath);
      if (stat.isDirectory()) {
        await fs.promises.rm(targetPath, { recursive: true });
      } else {
        await fs.promises.unlink(targetPath);
      }
      return { success: true };
    } catch (err) {
      console.error("删除失败", err);
      return { success: false, error: err.message };
    }
  });

  // ✅ 刷新目录结构
  ipcMain.on("refresh-folder", (event, dirPath) => {
    const contents = readDirRecursive(dirPath);
    const win = BrowserWindow.getAllWindows()[0];
    win?.webContents.send("replace-folder", { basePath: dirPath, contents });
  });


  ipcMain.on("replace-folders", (event, folders) => {
    // currentFolders = folders.map(f => f.basePath);
    const basePaths = folders.map(f => f.basePath);
    setRoots(basePaths); // ✅ 正确更新全局共享的根目录状态
  });





}

module.exports = {
  registerFileHandlers,
};
