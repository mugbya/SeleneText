import { useEffect, useState } from "react";
import FileTree from "@/components/FileTree";

const { ipcRenderer } = window.require("electron");

function LeftPanel() {
  const [folders, setFolders] = useState<
      { basePath: string; contents: any[] }[]
  >([]);

  useEffect(() => {
    ipcRenderer.on("replace-folders", (event, { basePath, contents }) => {
      setFolders([{ basePath, contents }]);
    });

    ipcRenderer.on("append-folder", (event, { basePath, contents }) => {
      setFolders((prev) => [...prev, { basePath, contents }]);
    });

    return () => {
      ipcRenderer.removeAllListeners("replace-folders");
      ipcRenderer.removeAllListeners("append-folder");
    };
  }, []);

  return (
      <div className="left-panel p-2 space-y-2">
        {folders.map((folder, i) => {
          const rootName = folder.basePath.split("/").filter(Boolean).pop();

          const treeRoot = {
            name: rootName,
            path: folder.basePath,
            isDirectory: true,
            children: folder.contents,
          };

          return <FileTree key={folder.basePath} nodes={[treeRoot]} />;
        })}
      </div>
  );
}

export default LeftPanel;