import { useEffect, useState } from "react";
import FileTree from "@/components/FileTree";
import { LeftPanelProps, FileNode, FolderTree } from '@/types';


function LeftPanel({ selectedPath, onFileSelect }: LeftPanelProps) {
  const [folders, setFolders] = useState<FolderTree[]>([]);

  useEffect(() => {
    const api = window.electronAPI;

    if (!api || !api.on) {
      console.warn(
        "⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置"
      );
      return;
    }

    // api.on("replace-folders", ({ basePath, contents }) => {
    //   setFolders([{ basePath, contents }]);
    // });
    // api.on("replace-folders", (foldersList) => {
    //   setFolders(foldersList);
    // });
    api.on("replace-folders", (foldersList) => {
      if (Array.isArray(foldersList)) {
        setFolders(foldersList);
      } else {
        console.warn("replace-folders payload 应该是数组:", foldersList);
      }
    });

    api.on("append-folder", ({ basePath, contents }) => {
      const normalizedNew = api.resolvePath(basePath);

      setFolders((prev) => {
        const exists = prev.some(
          (f) => api.resolvePath(f.basePath) === normalizedNew
        );
        if (exists) return prev; // ❌ 已存在就跳过
        return [...prev, { basePath, contents }]; // ✅ 新文件夹
      });
    });

    api.on("replace-folder", ({ basePath, contents }) => {
      setFolders((prev) =>
        prev.map((folder) =>
          api.resolvePath(folder.basePath) === api.resolvePath(basePath)
            ? { basePath, contents }
            : folder
        )
      );
    });

    return () => {
      api.removeAllListeners("replace-folders");
      api.removeAllListeners("append-folder");
      api.removeAllListeners("replace-folder");
    };
  }, []);

    // ✅ 创建文件/文件夹逻辑
    const handleNewFile = async (dirPath: string) => {
      // const res = await window.electronAPI.invoke("create-file", {
      //   dir: dirPath,
      //   name: "新建文件.txt",
      // });
      const res = await window.electronAPI.createFile(dirPath, "新建文件.txt");
      if (res.success) {
        // 简单做法：重新加载整个目录
        window.electronAPI.send("refresh-folder", dirPath);
      }
    };
  
    const handleNewFolder = async (dirPath: string) => {
      // const res = await window.electronAPI.invoke("create-folder", {
      //   dir: dirPath,
      //   name: "新建文件夹",
      // });
      const res = await window.electronAPI.createFolder(dirPath, "新建文件夹");
      if (res.success) {
        window.electronAPI.send("refresh-folder", dirPath);
      }
    };

  return (
    <div className="left-panel p-2 space-y-2  text-sm h-full overflow-y-auto">
      {folders.map((folder) => {
        // const rootName = folder.basePath.split("/").filter(Boolean).pop();
        const rootName =
          folder.basePath.split("/").filter(Boolean).pop() || folder.basePath;

        const treeRoot: FileNode = {
          name: rootName || folder.basePath,
          path: folder.basePath,
          isDirectory: true,
          children: folder.contents,
        };

        return (
          // <FileTree
          //   key={folder.basePath}
          //   nodes={[treeRoot]}
          //   onFileClick={onFileSelect}
          //   selectedPath={selectedPath || ""}
          // />
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

export default LeftPanel;
