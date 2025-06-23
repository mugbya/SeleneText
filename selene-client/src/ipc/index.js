const path = require('path')
const { registerFileHandlers } =  require(path.join(global.__root, 'src/ipc/modules/fileHandlers'));
const { registerLanguageHandlers } =  require(path.join(global.__root, 'src/ipc/modules/languageHandler'));
const { registerCommonHandlers } =  require(path.join(global.__root, 'src/ipc/modules/commonHandler'));
const { registerDataHandlers } =  require(path.join(global.__root, 'src/ipc/modules/dataHandler'));


function registerAllIpcHandlers() {
  registerFileHandlers();
  registerLanguageHandlers();
  registerCommonHandlers();
  registerDataHandlers();
}

module.exports = {
  registerAllIpcHandlers,
};
