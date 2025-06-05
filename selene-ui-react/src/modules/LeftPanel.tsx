import { useEffect, useState } from 'react';
// import {FileTree} from "./components/";
import FileTree from "@/components/FileTree";
const { ipcRenderer } = window.require('electron');

function LeftPanel() {
  const [folders, setFolders] = useState<any[]>([]);

  useEffect(() => {
    ipcRenderer.on('replace-folders', (event, { basePath, contents }) => {
      setFolders([{ basePath, contents }]);
    });

    ipcRenderer.on('append-folder', (event, { basePath, contents }) => {
      setFolders(prev => [...prev, { basePath, contents }]);
    });

    return () => {
      ipcRenderer.removeAllListeners('replace-folders');
      ipcRenderer.removeAllListeners('append-folder');
    };
  }, []);

  return (
    <div className="left-panel">
      {folders.map((folder, i) => (
        <div key={i} className="folder">
          <h4>{folder.basePath}</h4>
          <FileTree  nodes={folder.contents} />
          {/*<ul>*/}
          {/*  {folder.contents.map(item => (*/}
          {/*    <li key={item.path}>{item.name}{item.isDirectory ? '/' : ''}</li>*/}
          {/*  ))}*/}
          {/*</ul>*/}
        </div>
      ))}
    </div>
  );
}

export default LeftPanel;