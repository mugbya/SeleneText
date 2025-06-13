const path = require('path')
const { registerFileHandlers } =  require(path.join(global.__root, 'src/ipc/modules/fileHandlers'));
const { registerLanguageHandlers } =  require(path.join(global.__root, 'src/ipc/modules/languageHandler'));
const { registerCommonHandlers } =  require(path.join(global.__root, 'src/ipc/modules/commonHandler'));
// 如果你还有 appHandlers.js、windowHandlers.js 等，也可以在这里导入

function registerAllIpcHandlers() {
  registerFileHandlers();
  registerLanguageHandlers();
  registerCommonHandlers();
  // registerAppHandlers();
  // ...
}

module.exports = {
  registerAllIpcHandlers,
};
