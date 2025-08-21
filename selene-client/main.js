// electron/main.js
const { spawn } = require('child_process');
const { app } = require('electron')
const path = require('path')
// 定义全局根路径变量
global.__root = app.getAppPath(); // 一般返回项目根目录，放到导入其他模块前面
const { registerAllIpcHandlers } = require(path.join(global.__root, 'src/ipc'));        // 所有 ipc 处理器
const { createMainWindow } = require(path.join(global.__root, 'src/view/windowManager'));
const { restoreWatchedFolders } = require(path.join(global.__root, 'src/data/state'));
const { cleanupWatchers } = require(path.join(global.__root, 'src/utils/nativeWatchFolder'));

let pythonProcess

// 避免  Electron / Chromium 在初始化图形（GPU）渲染环境时的 OpenGL 或 EGL 报错
app.disableHardwareAcceleration(); // 👈 加这一行

const isDev = !app.isPackaged;
// 提前设置！⚠️一定在其他任何地方用 app.getPath 之前调用！
const userDataDir = isDev
  ? path.join(app.getPath("appData"), "SeleneText-dev")
  : path.join(app.getPath("appData"), "SeleneText");
// 隔离不同环境的 localStorage / 渲染进程缓存
app.setPath("userData", userDataDir);

app.whenReady().then(() => {
  console.log('✅ Electron App Ready');
  console.log("实际使用的 userData 路径:", app.getPath("userData"));
  registerAllIpcHandlers();
  // const venvPythonPath = path.join(__dirname, '../selene-server/.venv/bin/python')  // ⬅️ macOS/Linux

  // 启动 Python 子进程（开发时）
  // pythonProcess = spawn(venvPythonPath, ['../selene-server/main.py'])

  // pythonProcess.stdout.on('data', data => {
  //   console.log(`[python]: ${data}`)
  // })

  // pythonProcess.stderr.on('data', data => {
  //   console.error(`[python error]: ${data}`)
  // })

  const win = createMainWindow('zh');

  // 窗口 ready 后恢复监听的文件夹
  restoreWatchedFolders(win);
});

// 引入 restoreWatchedFolders 后，软件退出会很慢，需要等待所有文件夹监听都关闭后才会退出。这里做了强制退出，确保软件退出及时。
app.on('before-quit', (event) => {
  console.log('[ELECTRON] 清理中...');
  
  // 不再阻止默认退出，让应用自然退出
  // 但仍然尝试清理资源
  try {
    // 同步清理，不等待异步操作完成
    cleanupWatchers();
  } catch (err) {
    console.error('[ELECTRON] 清理过程出错:', err);
  }
  
  // 设置强制退出定时器，确保应用不会卡住
  setTimeout(() => {
    console.log('[ELECTRON] 强制退出...');
    process.exit(0);
  }, 500); // 最多等待500毫秒就强制退出
});

app.on('quit', cleanupWatchers);

app.on('will-quit', () => {
  // pythonProcess.kill()
});
