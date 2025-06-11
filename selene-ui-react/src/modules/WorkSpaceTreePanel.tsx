// import { useEffect, useState } from "react";
// import { WorkspaceTreeProps, FileNode, FolderTree } from "@/types";
// import FileTree from "@/components/common/file-tree/FileTree";

// function WorkSpaceTreePanel({ selectedPath,  onFileSelect }: WorkspaceTreeProps) {
//   const [folders, setFolders] = useState<FolderTree[]>([]);

//   useEffect(() => {
//     const api = window.electronAPI;

//     if (!api || !api.on) {
//       console.warn(
//         "⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置"
//       );
//       return;
//     }

//     // 监听主程序发送的 replace-folders 事件。 刷新整个工作区域 放置 打开的文件夹
//     api.on("replace-folders", (foldersList) => {
//       if (Array.isArray(foldersList)) {
//         setFolders(foldersList);
//       } else {
//         console.warn("replace-folders payload 应该是数组:", foldersList);
//       }
//     });

//     // 监听主程序发送的 append-folder 事件。 追加 打开的文件夹
//     api.on("append-folder", ({ basePath, contents }) => {
//       const normalizedNew = api.resolvePath(basePath);
//       setFolders((prev) => {
//         const exists = prev.some(
//           (f) => api.resolvePath(f.basePath) === normalizedNew
//         );
//         if (exists) return prev; // ❌ 已存在就跳过
//         return [...prev, { basePath, contents }]; // ✅ 新文件夹
//       });
//     });

//     api.on("replace-folder", ({ basePath, contents }) => {
//       setFolders((prev) =>
//         prev.map((folder) =>
//           api.resolvePath(folder.basePath) === api.resolvePath(basePath)
//             ? { basePath, contents }
//             : folder
//         )
//       );
//     });

//     return () => {
//       api.removeAllListeners("replace-folders");
//       api.removeAllListeners("append-folder");
//       api.removeAllListeners("replace-folder");
//     };
//   }, []);

//   // ✅ 创建文件/文件夹逻辑
//   const handleNewFile = async (dirPath: string) => {
//     const res = await window.electronAPI.createFile(dirPath, "新建文件.txt");
//     if (res.success) {
//       // 简单做法：重新加载整个目录
//       window.electronAPI.send("refresh-folder", dirPath);
//     }
//   };

//   const handleNewFolder = async (dirPath: string) => {
//     const res = await window.electronAPI.createFolder(dirPath, "新建文件夹");
//     if (res.success) {
//       window.electronAPI.send("refresh-folder", dirPath);
//     }
//   };

//   return (
//     <div className="left-panel p-2 space-y-2  text-sm h-full overflow-y-auto">
//       {folders.map((folder) => {
//         const rootName =
//           folder.basePath.split("/").filter(Boolean).pop() || folder.basePath;

//         const treeRoot: FileNode = {
//           name: rootName || folder.basePath,
//           path: folder.basePath,
//           isDirectory: true,
//           children: folder.contents,
//         };

//         return (
//           <FileTree
//             key={folder.basePath}
//             nodes={[treeRoot]}
//             onFileClick={onFileSelect}
//             selectedPath={selectedPath || ""}
//             // onNewFile={handleNewFile}
//             // onNewFolder={handleNewFolder}
//           />
//         );
//       })}
//     </div>
//   );
// }

// export default WorkSpaceTreePanel;

import { useEffect, useState } from "react";
import { WorkspaceTreeProps, FileNode, FolderTree } from "@/types";
import FileTree from "@/components/common/file-tree/FileTree";

function WorkSpaceTreePanel({
  selectedPath,
  rootPath,
  onFileSelect,
}: WorkspaceTreeProps) {
  const [folders, setFolders] = useState<FolderTree[]>([]);

  // 当rootPath变化时，加载对应项目的文件目录
  useEffect(() => {
    // 清除当前显示的文件夹
    setFolders([]);

    if (rootPath) {
      console.log("Loading folder for rootPath:", rootPath);
      // 请求主进程打开该文件夹
      window.electronAPI.send("open-folder", rootPath);
    }
  }, [rootPath]);

  useEffect(() => {
    const api = window.electronAPI;

    if (!api || !api.on) {
      console.warn(
        "⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置"
      );
      return;
    }

    // 监听主程序发送的 replace-folders 事件。 刷新整个工作区域 放置 打开的文件夹
    const replaceFoldersHandler = (foldersList) => {
      if (Array.isArray(foldersList)) {
        console.log("Received folders:", foldersList);
        setFolders(foldersList);
      } else {
        console.warn("replace-folders payload 应该是数组:", foldersList);
      }
    };

    // 监听主程序发送的 append-folder 事件。 追加 打开的文件夹
    const appendFolderHandler = ({ basePath, contents }) => {
      const normalizedNew = api.resolvePath(basePath);
      setFolders((prev) => {
        const exists = prev.some(
          (f) => api.resolvePath(f.basePath) === normalizedNew
        );
        if (exists) return prev; // ❌ 已存在就跳过
        return [...prev, { basePath, contents }]; // ✅ 新文件夹
      });
    };

    const replaceFolderHandler = ({ basePath, contents }) => {
      setFolders((prev) =>
        prev.map((folder) =>
          api.resolvePath(folder.basePath) === api.resolvePath(basePath)
            ? { basePath, contents }
            : folder
        )
      );
    };

    api.on("replace-folders", replaceFoldersHandler);
    api.on("append-folder", appendFolderHandler);
    api.on("replace-folder", replaceFolderHandler);

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
