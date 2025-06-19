import { WorkspaceTreeProps, FileNode } from "@/types";
import FileTree from "@/components/common/file-tree/FileTree";
// import { useFileTreeStore } from "@/store/fileTreeStore";
import { useRef } from "react";
// import { useProjectsStore } from "@/store/projectsStore";

function WorkSpaceTreePanel({
  selectedPath,
  name,
  rootPath,
  folderTree,
  onFileSelect,
}: WorkspaceTreeProps) {
  
  // const folder = useFileTreeStore((state) =>
  //   rootPath ? state.trees[rootPath] : undefined
  // );

  // const folder = useFileTreeStore((state) => {
  //   return state.tree
  // });
  // const project = useProjectsStore((state) => {
  //   return state.getActiveProject
  // });

  // const rootName = project?.name;
  // const basePath = project?.rootPath;


  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("[WorkSpaceTreePanel] 渲染次数:", renderCount.current);

  if (!folderTree) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        加载中...
      </div>
    );
  }

  // const rootName = folder.basePath.split(/[/\\]/).filter(Boolean).pop() || folder.basePath;

  // const treeRoot: FileNode = {
  //   name: name,
  //   path: rootPath,
  //   isDirectory: true,
  //   children: folderTree,
  // };

  return (
    <div className="left-panel p-2 space-y-2 text-sm h-full overflow-y-auto">
      <FileTree
        key={rootPath}
        nodes={[folderTree]}
        onFileClick={onFileSelect}
        selectedPath={selectedPath || ""}
      />
    </div>
  );
}

export default WorkSpaceTreePanel;
