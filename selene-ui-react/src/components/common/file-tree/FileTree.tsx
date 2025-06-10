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
  nodes,
  onFileClick,
  selectedPath,
}: {
  nodes: FileNode[];
  onFileClick: (filePath: string) => void;
  selectedPath?: string;
}) {
  return (
    <ul className="pl-2 text-sm space-y-1">
      {nodes.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          onFileClick={onFileClick}
          selectedPath={selectedPath}
        />
      ))}
    </ul>
  );
}