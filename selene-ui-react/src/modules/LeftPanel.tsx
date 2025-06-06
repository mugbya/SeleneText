import { useEffect, useState } from "react";
import FileTree from "@/components/FileTree";


interface LeftPanelProps {
  selectedPath: string | null;
  onFileSelect: (filePath: string) => void;
}


function LeftPanel({ selectedPath, onFileSelect }: LeftPanelProps) {
  const [folders, setFolders] = useState<FolderTree[]>([]);

    useEffect(() => {
    if (window.electronAPI?.on) {
        window.electronAPI.on("replace-folders", ({ basePath, contents }) => {
        setFolders([{ basePath, contents }]);
        });

        window.electronAPI.on("append-folder", ({ basePath, contents }) => {
        setFolders((prev) => [...prev, { basePath, contents }]);
        });
    } else {
        console.warn('⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置');
    }

    return () => {
        window.electronAPI?.removeAllListeners?.("replace-folders");
        window.electronAPI?.removeAllListeners?.("append-folder");
    };
    }, []);

  return (
    <div className="left-panel p-2 space-y-2 overflow-auto text-sm">
      {folders.map((folder) => {
        const rootName = folder.basePath.split("/").filter(Boolean).pop();

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