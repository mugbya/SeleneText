import { FileNode } from "@/types";
import React from "react";
import { useTreeNode } from "./useTreeNode";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import NodeContextMenu from "./NodeContextMenu";
import { cn } from "@/lib/utils";
import { File, Folder, FolderOpen } from "lucide-react";
import CreateDialog from "./dialogs/CreateDialog";
import RenameDialog from "./dialogs/RenameDialog";
import DeleteDialog from "./dialogs/DeleteDialog";
import { useProjectsStore } from "@/store/useProjectStore";

/**
 * 单文件树型结构
 * @param param
 * @returns
 */
const TreeNode = React.memo(function TreeNode({
  projectId,
  rootPath,
  node,
  activeFilePath,
  onFileClick,
}: {
  projectId: string;
  rootPath:string;
  node: FileNode;
  activeFilePath?: string;
  onFileClick: (projectId: string, filePath: string) => void;
}) {
  const {
    // expanded,
    isDir,
    isSelected,
    // toggle,

    dialog,
    openDialog,
    closeDialog,

    newType,
    setNewType,
    newFileName,
    setNewFileName,
    handleCreate,

    renameValue,
    setRenameValue,
    handleRename,

    handleDelete,
  } = useTreeNode(rootPath, node, activeFilePath);

  // console.log("TreeNode: ", node);

  // React 渲染中用（响应式）
  const isExpanded = useProjectsStore((s) => s.expandedDirs[node.path]);

  // 非 React 渲染流程中调用动作（非响应式）
  const toggleExpanded = () =>
    useProjectsStore.getState().toggleExpanded(node.path);

  // console.log("isDir: %o", isDir, "isExpanded: %o", isExpanded);

  return (
    <li>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            onClick={() => {
              if (isDir) {
                toggleExpanded(); // 目录点击展开/折叠
              } else {
                onFileClick(projectId, node.path); // 文件点击，打开文件
              }
            }}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              isSelected && "bg-zinc-200 dark:bg-zinc-700 font-semibold"
            )}
            title={node.path}
          >
            {isDir ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-yellow-500" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-500" />
              )
            ) : (
              <File className="w-4 h-4 text-zinc-500" />
            )}
            <span className="truncate">{node.name}</span>
          </div>
        </ContextMenuTrigger>

        <NodeContextMenu
          isDir={isDir}
          // node={node}
          onCreateFile={() => {
            setNewType("file");
            openDialog("create");
          }}
          onCreateFolder={() => {
            setNewType("folder");
            openDialog("create");
          }}
          onRename={() => openDialog("rename")}
          onDelete={() => openDialog("delete")}
        />
      </ContextMenu>

      {isDir && isExpanded && node.children && (
        <ul className="pl-4 border-l border-zinc-300 dark:border-zinc-700 ml-1">
          {node.children.map((child) => (
            // <li key={child.path}>{child.path} - {child.name}</li>
            <TreeNode
              projectId={projectId}
              rootPath={rootPath}
              key={child.path}
              node={child}
              activeFilePath={activeFilePath}
              onFileClick={onFileClick}
            />
          ))}
        </ul>
      )}

      <CreateDialog
        open={dialog === "create"}
        type={newType}
        value={newFileName}
        onChange={setNewFileName}
        onClose={closeDialog}
        onConfirm={handleCreate}
      />

      <RenameDialog
        open={dialog === "rename"}
        value={renameValue}
        onChange={setRenameValue}
        onClose={closeDialog}
        onConfirm={handleRename}
      />

      <DeleteDialog
        open={dialog === "delete"}
        name={node.name}
        onClose={closeDialog}
        onConfirm={handleDelete}
      />
    </li>
  );
});
export default TreeNode;
