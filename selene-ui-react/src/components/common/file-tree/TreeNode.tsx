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
                                                  node,
                                                  selectedPath,
                                                  onFileClick,
                                                  // expanded,
                                                  // onToggle
                                              }: {
    node: FileNode;
    selectedPath?: string;
    onFileClick: (filePath: string) => void;
    // expanded: boolean;
    // onToggle: () => void;
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
    } = useTreeNode(node, selectedPath, onFileClick);

    // console.log("TreeNode: ", node);

    const isExpanded = useProjectsStore((s) => s.expandedDirs[node.path]);
    const toggleExpanded = () => useProjectsStore.getState().toggleExpanded(node.path);

    return (
        <li>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div
                        onClick={toggleExpanded}
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
                            key={child.path}
                            node={child}
                            selectedPath={selectedPath}
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