// components/file-tree/NodeContextMenu.tsx
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

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
}: {
  isDir: boolean;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <ContextMenuContent>
      {isDir && (
        <>
          <ContextMenuItem onClick={onCreateFile}>新建文件</ContextMenuItem>
          <ContextMenuItem onClick={onCreateFolder}>新建文件夹</ContextMenuItem>
        </>
      )}
      <ContextMenuItem onClick={onRename}>重命名</ContextMenuItem>
      <ContextMenuItem
        onClick={onDelete}
        className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900"
      >
        删除
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
