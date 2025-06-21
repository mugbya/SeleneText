// electron/main.js
const { app } = require('electron')
const path = require('path')
const fs = require('fs');
const { spawn } = require('child_process')

// 定义全局根路径变量
global.__root = app.getAppPath(); // 一般返回项目根目录，放到导入其他模块前面

// const { registerAllIpcHandlers } = require(path.join(__dirname, 'src/ipc'));        // 所有 ipc 处理器
// const { createMainWindow } = require(path.join(__dirname, 'src/view/windowManager'));
const { registerAllIpcHandlers } = require(path.join(global.__root, 'src/ipc'));        // 所有 ipc 处理器
const { createMainWindow } = require(path.join(global.__root, 'src/view/windowManager'));


let pythonProcess

// 避免  Electron / Chromium 在初始化图形（GPU）渲染环境时的 OpenGL 或 EGL 报错
app.disableHardwareAcceleration(); // 👈 加这一行


app.whenReady().then(() => {
  console.log('✅ Electron App Ready');

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

  // createWindow()

  const win = createMainWindow('zh');
});


app.on('will-quit', () => {
  // pythonProcess.kill()
});
