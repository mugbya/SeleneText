import { useEffect, useState } from "react";
import { WorkspaceTreeProps, FileNode, FolderTree } from "@/types";
import FileTree from "@/components/common/file-tree/FileTree";
import { useFileTreeStore } from "@/store/fileTreeStore";

function WorkSpaceTreePanel({
  selectedPath,
  rootPath,
  onFileSelect,
}: WorkspaceTreeProps) {
 
  useEffect(() => {
    const api = window.electronAPI;

    if (!api || !api.on) {
      console.warn(
        "⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置"
      );
      return;
    }

    return () => {
      api.removeAllListeners("replace-folders");
      api.removeAllListeners("append-folder");
      api.removeAllListeners("replace-folder");
    };
  }, []);

  // ✅ 创建文件/文件夹逻辑
  const handleNewFile = async (dirPath: string) => {
    const res = await window.electronAPI.createFile(dirPath, "新建文件.txt");
    if (res.success) {
      // 简单做法：重新加载整个目录
      window.electronAPI.send("refresh-folder", dirPath);
    }
  };

  const handleNewFolder = async (dirPath: string) => {
    const res = await window.electronAPI.createFolder(dirPath, "新建文件夹");
    if (res.success) {
      window.electronAPI.send("refresh-folder", dirPath);
    }
  };
  const folders = Object.values(useFileTreeStore((state) => state.trees));
  // 只取当前项目的 tree
  // const tree = useFileTreeStore((state) => state.trees[projectId]);
  console.log("[WorkSpaceTreePanel] 执行渲染")
  console.log("[WorkSpaceTreePanel] rootPath: %s, folders:%o", rootPath, folders)

  return (
    <div className="left-panel p-2 space-y-2 text-sm h-full overflow-y-auto">
      {rootPath && folders.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500">
          加载中...
        </div>
      )}

      {folders.map((folder) => {
        const rootName =
          folder.basePath.split(/[/\\]/).filter(Boolean).pop() ||
          folder.basePath;

        const treeRoot: FileNode = {
          name: rootName || folder.basePath,
          path: folder.basePath,
          isDirectory: true,
          children: folder.contents,
        };

        return (
          <FileTree
            key={folder.basePath}
            nodes={[treeRoot]}
            onFileClick={onFileSelect}
            selectedPath={selectedPath || ""}
            // onNewFile={handleNewFile}
            // onNewFolder={handleNewFolder}
          />
        );
      })}
    </div>
  );
}

export default WorkSpaceTreePanel;
