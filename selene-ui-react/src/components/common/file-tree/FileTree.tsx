// file-tree/FileTree.tsx
import { FileNode } from "@/types";
import TreeNode from "./TreeNode";

/**
 * 仅遍历渲染 TreeNode
 *  支持多个文件夹的树形结构
 * @param param
 * @returns
 */
export default function FileTree({
  projectId,
  folderPath,
  folderTree,
  onFileClick,
  activeFilePath,
}: {
  projectId: string;
  folderPath: string;
  folderTree: FileNode;
  onFileClick: (projectId: string, filePath: string) => void;
  activeFilePath?: string;
}) {
  return (
    <ul className="pl-2 text-sm space-y-1">
      {/*{nodes.map((node) => (*/}
      <TreeNode
        projectId={projectId}
        rootPath={folderPath}
        node={folderTree}
        onFileClick={onFileClick}
        activeFilePath={activeFilePath}
      />
      {/*))}*/}
    </ul>
  );
}
