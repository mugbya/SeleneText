import { useEffect, useState } from "react";
import FileTree from "@/components/FileTree";

interface LeftPanelProps {
  selectedPath: string | null;
  onFileSelect: (filePath: string) => void;
}

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

    api.on("replace-folders", ({ basePath, contents }) => {
      setFolders([{ basePath, contents }]);
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

    return () => {
      api.removeAllListeners("replace-folders");
      api.removeAllListeners("append-folder");
    };
  }, []);

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
          <FileTree
            key={folder.basePath}
            nodes={[treeRoot]}
            onFileClick={onFileSelect}
            selectedPath={selectedPath || ""}
          />
        );
      })}
    </div>
  );
}

export default LeftPanel;
