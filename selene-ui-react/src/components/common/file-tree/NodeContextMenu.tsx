// components/file-tree/NodeContextMenu.tsx
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { useProjectsStore } from "@/store/useProjectStore";
import { FileNode } from "@/types";

/**
 * 封装可复用的右键菜单组件
 *  用于对文件/文件夹执行操作（如新建、重命名、删除等）
 * @param param 
 * @returns 
 */
export default function NodeContextMenu({
  isDir,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onMove,
  onOpenInFileSystem,
}: {
  isDir: boolean;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onRename: () => void;
  onDelete: () => void;
  onMove: () => void;
  onOpenInFileSystem: () => void;
}) {
  // const activeProject = useProjectsStore((state) => state.getActiveProject());
  // const folderTree = activeProject?.folderTree;
  
  // 收集所有目录路径
  // const collectDirectories = (node: FileNode, pathList: string[] = []): string[] => {
  //   if (node.isDirectory) {
  //     pathList.push(node.path);
  //     if (node.children) {
  //       node.children.forEach(child => collectDirectories(child, pathList));
  //     }
  //   }
  //   return pathList;
  // };
  
  // const directories = folderTree ? collectDirectories(folderTree) : [];
  
  return (
    <ContextMenuContent>
      {isDir && (
        <>
          <ContextMenuItem onClick={onCreateFile}>新建文件</ContextMenuItem>
          <ContextMenuItem onClick={onCreateFolder}>新建文件夹</ContextMenuItem>
        </>
      )}
      <ContextMenuItem onClick={onRename}>重命名</ContextMenuItem>
      <ContextMenuItem onClick={onMove}>移动</ContextMenuItem>
      <ContextMenuItem onClick={onOpenInFileSystem}>在文件系统中打开</ContextMenuItem>
      <ContextMenuItem
        onClick={onDelete}
        className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900"
      >
        删除
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
