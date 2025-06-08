const path = require('path')
const { registerFileHandlers } =  require(path.join(__dirname, 'modules/fileHandlers'));
// 如果你还有 appHandlers.js、windowHandlers.js 等，也可以在这里导入

function registerAllIpcHandlers() {
  registerFileHandlers();
  // registerAppHandlers();
  // ...
}

module.exports = {
  registerAllIpcHandlers,
};
