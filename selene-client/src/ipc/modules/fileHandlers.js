// 💡 主进程接收渲染进程请求并保存文件内容 - 新增保存
const { dialog, ipcMain, BrowserWindow, shell, app } = require('electron');
const fs = require('fs');
const path = require('path');
const { readDirRecursive } = require(path.join(global.__root, 'src/utils/fsUtils'));

const isDev = !app.isPackaged;
// 提前设置！⚠️一定在其他任何地方用 app.getPath 之前调用！
const userDataDir = isDev
  ? path.join(app.getPath("appData"), "SeleneText-dev")
  : path.join(app.getPath("appData"), "SeleneText");

// 备份文件管理器
class BackupManager {
  constructor() {
    this.backupDir = path.join(userDataDir, 'bak');
    // this.openFiles = new Set(); // 跟踪打开的文件
    // this.maxBackupsPerFile = 3; // 每个文件最多保留3个备份
  }

  // 获取备份目录路径
  getBackupDir() {
    return this.backupDir;
  }

  // 创建备份目录
  async ensureBackupDir() {
    try {
      await fs.promises.mkdir(this.backupDir, { recursive: true });
    } catch (err) {
      console.error('❌ 创建备份目录失败:', err);
    }
  }

  // // 生成备份文件路径
  // getBackupPath(filePath) {
  //   const fileName = path.basename(filePath);
  //   const fileHash = this.getFileHash(filePath);
  //   const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  //   return path.join(this.backupDir, `${fileHash}_${timestamp}_${fileName}`);
  // }
  //
  // // 获取文件哈希（用于标识同一文件）
  // getFileHash(filePath) {
  //   // 简单的哈希函数：使用文件路径的哈希
  //   let hash = 0;
  //   const str = path.resolve(filePath);
  //   for (let i = 0; i < str.length; i++) {
  //     const char = str.charCodeAt(i);
  //     hash = ((hash << 5) - hash) + char;
  //     hash = hash & hash; // 转换为32位整数
  //   }
  //   return Math.abs(hash).toString(36);
  // }
  //
  // // 获取文件的所有备份
  // async getFileBackups(filePath) {
  //   try {
  //     await this.ensureBackupDir();
  //     const fileHash = this.getFileHash(filePath);
  //     const files = await fs.promises.readdir(this.backupDir);
  //
  //     return files
  //       .filter(f => f.startsWith(`${fileHash}_`))
  //       .map(f => path.join(this.backupDir, f))
  //       .sort()
  //       .reverse(); // 最新的在前
  //   } catch (err) {
  //     console.error('❌ 获取文件备份列表失败:', err);
  //     return [];
  //   }
  // }
  //
  // // 清理旧的备份文件（保留最新的maxBackupsPerFile个）
  // async cleanupOldBackups(filePath) {
  //   try {
  //     const backups = await this.getFileBackups(filePath);
  //     if (backups.length > this.maxBackupsPerFile) {
  //       const toDelete = backups.slice(this.maxBackupsPerFile);
  //       for (const backupPath of toDelete) {
  //         try {
  //           await fs.promises.unlink(backupPath);
  //           console.log(`🗑️ 删除旧备份: ${backupPath}`);
  //         } catch (err) {
  //           console.error(`❌ 删除备份失败: ${backupPath}`, err);
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.error('❌ 清理旧备份失败:', err);
  //   }
  // }
  //
  // // 清理文件的所有备份
  // async cleanupAllBackups(fileDir) {
  //   try {
  //     const backups = await fs.promises.readdir(fileDir);
  //     // const backups = await this.getFileBackups(filePath);
  //     for (const itemFile of backups) {
  //       try {
  //         const backupPath = path.join(fileDir, itemFile);
  //         await fs.promises.unlink(backupPath);
  //         console.log(`🗑️ 删除备份: ${backupPath}`);
  //       } catch (err) {
  //         console.error(`❌ 删除备份失败: ${backupPath}`, err);
  //       }
  //     }
  //   } catch (err) {
  //     console.error('❌ 清理所有备份失败:', err);
  //   }
  // }
  //
  // // 标记文件为打开状态
  // async markFileAsOpen(filePath) {
  //   const resolvedPath = path.resolve(filePath);
  //   this.openFiles.add(resolvedPath);
  //
  //   // 对于打开的文件，清理旧的备份，只保留最近的3个
  //   await this.cleanupOldBackups(resolvedPath);
  // }
  //
  // // 标记文件为关闭状态
  // async markFileAsClosed(fileDir) {
  //   console.log('[BackupManager] markFileAsClosed fileDir:', fileDir);
  //   // const resolvedPath = path.resolve(filePath);
  //   // console.log('[BackupManager] markFileAsClosed resolvedPath:', resolvedPath);
  //   // this.openFiles.delete(resolvedPath);
  //
  //   // 对于关闭的文件，清理该文件的所有备份
  //   await this.cleanupAllBackups(fileDir);
  // }
  //
  // // 检查文件是否打开
  // isFileOpen(filePath) {
  //   return this.openFiles.has(path.resolve(filePath));
  // }
}

// 创建备份管理器实例
const backupManager = new BackupManager();
// const { addRoot, removeRoot, getRoots } = require(path.join(global.__root, 'src/data/state'));

// 加一个 delay 函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function registerFileHandlers() {

  ipcMain.handle('read-file', async (event, { filePath }) => {
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

  ipcMain.handle('save-file-as', async (event, { filePath, content }) => {
    // 文件另存为
    const result = await dialog.showSaveDialog({
      title: '保存文件',
      path: filePath || 'untitled.txt',
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
  ipcMain.handle('save-file', async (event, { filePath, content }) => {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
      }

      await fs.promises.writeFile(filePath, content, 'utf-8');
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
  ipcMain.handle('rename-path', async (event, { rootPath, oldPath, newName }) => {
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

  // 在文件系统中打开文件所在目录
  ipcMain.on('open-in-file-system', (event, filePath) => {
    try {
      // 检查文件是否存在
      if (fs.existsSync(filePath)) {
        // 获取文件所在目录
        const dirPath = path.dirname(filePath);
        // 使用shell.openPath打开文件所在目录
        shell.openPath(dirPath);
      }
    } catch (err) {
      console.error('❌ 在文件系统中打开失败:', err);
    }
  });

  // 移动文件/文件夹
  ipcMain.handle('move-file', async (event, { rootPath, sourcePath, targetDir }) => {
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
      // const sourceDir = path.dirname(sourcePath);
      // const sourceContents = readDirRecursive(sourceDir);
      // const targetContents = readDirRecursive(targetDir);
      const contents = readDirRecursive(rootPath);

      // 发送刷新事件
      // win?.webContents.send("folder-changed", { basePath: sourceDir, contents: sourceContents });
      win?.webContents.send("folder-changed", { basePath: rootPath, contents: contents });

      return { success: true, newPath: targetPath };
    } catch (err) {
      console.error("❌ 移动失败", err);
      return { success: false, error: err.message };
    }
  });
  //
  // // 备份文件
  // ipcMain.handle('backup-file', async (event, filePath) => {
  //   try {
  //     // 检查文件是否存在
  //     if (!fs.existsSync(filePath)) {
  //       return { success: false, error: "文件不存在" };
  //     }
  //
  //     // 确保备份目录存在
  //     await backupManager.ensureBackupDir();
  //
  //     // 生成备份文件路径
  //     const backupPath = backupManager.getBackupPath(filePath);
  //
  //     // 复制文件到备份位置
  //     await fs.promises.copyFile(filePath, backupPath);
  //
  //     // 检查文件是否处于打开状态
  //     const resolvedPath = path.resolve(filePath);
  //     const isFileOpen = backupManager.openFiles.has(resolvedPath);
  //
  //     if (isFileOpen) {
  //       // 对于打开的文件，只保留最近的3个备份
  //       await backupManager.cleanupOldBackups(filePath);
  //     } else {
  //       // 对于未打开的文件，清理所有备份
  //       // await backupManager.cleanupAllBackups(filePath);
  //     }
  //
  //     console.log(`✅ 文件备份成功: ${backupPath} (文件状态: ${isFileOpen ? '打开' : '关闭'})`);
  //     return { success: true, backupPath };
  //   } catch (err) {
  //     console.error("❌ 文件备份失败", err);
  //     return { success: false, error: err.message };
  //   }
  // });

  // 安全保存文件（先备份再保存）
  ipcMain.handle('save-file-safely', async (event, { filePath, originFilePath, data }) => {
    const sizeInBytes = Buffer.byteLength(data, 'utf8');
    const sizeInMB = sizeInBytes / (1024 * 1024);

    console.log(`写入文件data 大小: ${sizeInMB.toFixed(2)} MB`);

    try {
      if (sizeInMB > 10) {
        // 大文件直接覆盖
        console.warn('⚠️ 文件内容超过 10MB，可能保存很慢！');
        await fs.promises.writeFile(originFilePath, data, 'utf-8');
        return { success: true };
      }

      // 小文件 走安全写方式
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
      }

      // 写入新内容
      await fs.promises.writeFile(filePath, data, 'utf-8');
      console.log(`✅ 临时文件安全保存成功: ${filePath}`);

      // 使用rename原子性覆盖原文件
      await fs.promises.rename(filePath, originFilePath);
      console.log(`✅ 安全写 rename 执行成功`);
      return { success: true };
    } catch (err) {
      console.error("❌ 文件安全保存失败", err);
      return { success: false, error: err.message };
    }
  });
  //
  // // 从备份恢复文件
  // ipcMain.handle('restore-from-backup', async (event, filePath) => {
  //   try {
  //     // 检查文件是否存在
  //     if (!fs.existsSync(filePath)) {
  //       return { success: false, error: "文件不存在" };
  //     }
  //
  //     // 查找最近的备份文件
  //     const backups = await backupManager.getFileBackups(filePath);
  //
  //     if (backups.length === 0) {
  //       return { success: false, error: "未找到备份文件" };
  //     }
  //
  //     // 使用最新的备份文件恢复
  //     const latestBackup = backups[0];
  //     await fs.promises.copyFile(latestBackup, filePath);
  //
  //     console.log(`✅ 文件恢复成功: ${latestBackup} -> ${filePath}`);
  //     return { success: true };
  //   } catch (err) {
  //     console.error("❌ 文件恢复失败", err);
  //     return { success: false, error: err.message };
  //   }
  // });
  //
  // // 标记文件为打开状态
  // ipcMain.handle('mark-file-open', async (event, filePath) => {
  //   try {
  //     await backupManager.markFileAsOpen(filePath);
  //     console.log(`📂 标记文件为打开状态: ${filePath}`);
  //     return { success: true };
  //   } catch (err) {
  //     console.error("❌ 标记文件打开状态失败", err);
  //     return { success: false, error: err.message };
  //   }
  // });
  //
  // // 标记文件为关闭状态
  // ipcMain.handle('mark-file-closed', async (event, projectRootPath, filePath) => {
  //   try {
  //     const projectName = path.basename(projectRootPath); // 项目名
  //     const relative = path.relative(projectRootPath, filePath); // 去掉根路径，得到相对路径
  //     const withoutExt = relative.replace(/\.[^.]+$/, '');
  //
  //     const tmpPath = path.join(backupManager.getBackupDir(), projectName, withoutExt);
  //
  //     await backupManager.markFileAsClosed(tmpPath);
  //     console.log(`📂 标记文件为关闭状态: ${tmpPath}`);
  //     return { success: true };
  //   } catch (err) {
  //     console.error("❌ 标记文件关闭状态失败", err);
  //     return { success: false, error: err.message };
  //   }
  // });

  // 获取用户数据目录下的文件备份路径的根路径
  ipcMain.handle('get-user-date-file-back-path', async (event) => {
    try {
      const backupPath = backupManager.getBackupDir();
      // 确保备份目录存在
      await backupManager.ensureBackupDir();
      // console.log(`✅ 获取文件备份路径成功: ${backupPath}`);
      return backupPath;
    } catch (err) {
      console.error("❌ 获取文件备份路径失败", err);
      return err.message;
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
