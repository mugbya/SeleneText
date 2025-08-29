// 💡 主进程接收渲染进程请求并保存文件内容 - 新增保存
const { dialog, ipcMain, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const { readDirRecursive } = require(path.join(global.__root, 'src/utils/fsUtils'));
// const { addRoot, removeRoot, getRoots } = require(path.join(global.__root, 'src/data/state'));

// 加一个 delay 函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function registerFileHandlers() {

  ipcMain.handle('read-file', async (event, {filePath}) => {
    console.log("[registerFileHandlers] read-file filePath: %s", filePath);
    const result = await fs.promises.readFile(filePath, 'utf-8');
    return { success: true, content: result };
  });

  // ipcMain.handle("read-file", async (event, { filePath }) => {
  //   console.log("[read-file] filePath:", filePath);

  //   try {
  //     const stream = fs.createReadStream(filePath, { encoding: "utf-8", highWaterMark: 1024 * 1024 }); // 每次读取 1MB
  //     let content = "";

  //     for await (const chunk of stream) {
  //       content += chunk;
  //       // 可选：如果文件太大，可以按块发送给渲染进程
  //       // event.sender.send("read-file-chunk", chunk);
  //     }
  //     return { success: true, content };
  //   } catch (err) {
  //     console.error("读取文件失败:", err);
  //     return { success: false, error: err.message };
  //   }
  // });

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
  ipcMain.handle('rename-path', async (event, {rootPath, oldPath, newName }) => {
    try {
      const parentDir = path.dirname(oldPath);
      const newPath = path.join(parentDir, newName);

      if (!fs.existsSync(oldPath)) {
        return { success: false, error: "原路径不存在" };
      }

      await fs.promises.rename(oldPath, newPath);
      await delay(100); // 等待文件系统同步

      const win = BrowserWindow.getAllWindows()[0];
      // const currentRoots = getRoots();

      // const isRoot = currentRoots.some(root =>
      //   path.resolve(root) === path.resolve(oldPath)
      // );
      const isRoot = rootPath === oldPath;
      console.log("\n------------");
      console.log(`[重命名] 当前根目录:`, rootPath);
      console.log(`[重命名] oldPath: ${oldPath}, newPath: ${newPath}`);
      console.log(`[重命名] 是否根目录:`, isRoot);

      if (isRoot) {

        const contents = readDirRecursive(newPath);
        console.log("重命名根目录，刷新整个工作区, 重新调用 addRoot: %s, 且删除：%s", newPath, oldPath);

        // removeRoot(oldPath);
        // addRoot(newPath);

        win?.webContents.send("replace-folders", [
          { basePath: newPath, contents }
        ]);
      } else {
        // const rootBase = currentRoots.find(root =>
        //   path.resolve(oldPath).startsWith(path.resolve(root))
        // );
        console.log("🔄 重命名子目录:%s, 仅刷新所属根目录%s", newName, rootPath);

        if (rootPath && fs.existsSync(rootPath)) {

          const rootContents = readDirRecursive(rootPath);

          // addRoot(rootBase);

          win?.webContents.send("replace-folder", {
            basePath: rootPath,
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

  // 响应UI发起的请求刷新文件夹
  ipcMain.on("refresh-folder", (event, dirPath) => {
    const contents = readDirRecursive(dirPath);
    const win = BrowserWindow.getAllWindows()[0];
    win?.webContents.send("folder-changed", { basePath: dirPath, contents });
  });

  // 响应UI发起的请求打开文件夹
  ipcMain.on("load-folder", (event, dirPath) => {
    const contents = readDirRecursive(dirPath);
    const win = BrowserWindow.getAllWindows()[0];
    win?.webContents.send("load-folder", { basePath: dirPath, contents });
  });

  ipcMain.on("replace-folders", (event, folders) => {
    // currentFolders = folders.map(f => f.basePath);
    const basePaths = folders.map(f => f.basePath);
    setRoots(basePaths); // ✅ 正确更新全局共享的根目录状态
  });

  // 处理打开文件夹事件
  ipcMain.on('open-folder', (event, folderPath) => {
    console.log('Received request to open folder:', folderPath);

    // 检查路径是否存在
    if (!fs.existsSync(folderPath)) {
      console.error('Folder path does not exist:', folderPath);
      return;
    }

    // 读取文件夹结构
    const folderContents = readDirRecursive(folderPath);

    // 发送回渲染进程
    event.sender.send('replace-folders', [
      {
        basePath: folderPath,
        contents: folderContents
      }
    ]);
  });

  // 移动文件/文件夹
  ipcMain.handle('move-file', async (event, { sourcePath, targetDir }) => {
    try {
      // 检查源路径是否存在
      if (!fs.existsSync(sourcePath)) {
        return { success: false, error: "源路径不存在" };
      }
      
      // 检查目标目录是否存在
      if (!fs.existsSync(targetDir)) {
        return { success: false, error: "目标目录不存在" };
      }
      
      // 获取源文件/文件夹名称
      const sourceName = path.basename(sourcePath);
      // 构建目标路径
      const targetPath = path.join(targetDir, sourceName);
      
      // 检查目标路径是否已存在
      if (fs.existsSync(targetPath)) {
        return { success: false, error: "目标路径已存在同名文件/文件夹" };
      }
      
      // 执行移动操作
      await fs.promises.rename(sourcePath, targetPath);
      await delay(100); // 等待文件系统同步
      
      const win = BrowserWindow.getAllWindows()[0];
      
      // 刷新源目录和目标目录
      const sourceDir = path.dirname(sourcePath);
      const sourceContents = readDirRecursive(sourceDir);
      const targetContents = readDirRecursive(targetDir);
      
      // 发送刷新事件
      win?.webContents.send("folder-changed", { basePath: sourceDir, contents: sourceContents });
      win?.webContents.send("folder-changed", { basePath: targetDir, contents: targetContents });
      
      return { success: true, newPath: targetPath };
    } catch (err) {
      console.error("❌ 移动失败", err);
      return { success: false, error: err.message };
    }
  });

  // ipcMain.handle('show-save-dialog', async (event, options) => {
  //   const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), options);
  //   return result;
  // });
  //
  // ipcMain.handle('write-file', async (event, filePath, content) => {
  //   fs.writeFileSync(filePath, content, 'utf-8');
  // });

}

module.exports = {
  registerFileHandlers,
};
