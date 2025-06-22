// file-tree/FileTree.tsx
import { FileNode } from "@/types";
import TreeNode from "./TreeNode";
import {useProjectsStore} from "@/store/useProjectStore";

/**
 * 仅遍历渲染 TreeNode
 *  支持多个文件夹的树形结构
 * @param param
 * @returns
 */
export default function FileTree({
                                   folderPath,
                                   folderTree,
                                   onFileClick,
                                   selectedPath,
                                 }: {
  folderPath: string;
  folderTree: FileNode;
  onFileClick: (filePath: string) => void;
  selectedPath?: string;
}) {

  // const isExpanded = useProjectsStore((s) => s.expandedDirs[folderPath]);
  // const toggleExpanded = useProjectsStore((s) => s.toggleExpanded);

  return (
      <ul className="pl-2 text-sm space-y-1">
        {/*{nodes.map((node) => (*/}
        <TreeNode
            key={folderPath}
            node={folderTree}
            onFileClick={onFileClick}
            selectedPath={selectedPath}
            // expanded={isExpanded}
            // onToggle={() => toggleExpanded(folderPath)}
        />
        {/*))}*/}
      </ul>
  );
}