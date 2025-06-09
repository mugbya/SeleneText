// src/ipc/state.js
// const currentRoots = new Set();

// /** 添加根目录（打开文件夹或添加工作区） */
// function addRoot(path) {
//   currentRoots.add(path);
// }

// /** 删除根目录（关闭工作区） */
// function removeRoot(path) {
//   currentRoots.delete(path);
// }

// /** 获取所有当前根目录 */
// function getRoots() {
//   return Array.from(currentRoots);
// }

// const path = require("path");

// let roots = new Set();

// function addRoot(p: string) {
//   roots.add(path.resolve(p));
// }

// function getRoots() {
//   return [...roots];
// }

// function setRoots(list: string[]) {
//   roots.clear();
//   list.forEach(p => roots.add(path.resolve(p)));
// }


// module.exports = {
//   addRoot,
//   removeRoot,
//   getRoots,
// };

const path = require("path");

let roots = new Set();

function addRoot(p) {
  roots.add(path.resolve(p));
}

function getRoots() {
  return [...roots];
}

function setRoots(list) {
  roots.clear();
  list.forEach(p => roots.add(path.resolve(p)));
}

// 如果需要删除根目录
function removeRoot(p) {
  roots.delete(path.resolve(p));
}

module.exports = {
  addRoot,
  removeRoot,
  getRoots,
  setRoots,
};
