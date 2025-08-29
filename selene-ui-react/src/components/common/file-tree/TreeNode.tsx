import { FileNode } from "@/types";
import React, { useState } from "react";
import { useTreeNode } from "./useTreeNode";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import NodeContextMenu from "./NodeContextMenu";
import { cn } from "@/lib/utils";
import { File, Folder, FolderOpen } from "lucide-react";
import CreateDialog from "./dialogs/CreateDialog";
import RenameDialog from "./dialogs/RenameDialog";
import DeleteDialog from "./dialogs/DeleteDialog";
import MoveDialog from "./dialogs/MoveDialog";
import { useProjectsStore } from "@/store/useProjectStore";
import { smartToast } from "@/utils/commonUtil";

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
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedNode, setDraggedNode] = useState<FileNode | null>(null);
  
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
    handleMove,
  } = useTreeNode(rootPath, node, activeFilePath);
  
  const handleMoveClick = () => {
    setShowMoveDialog(true);
  };
  
  const handleMoveConfirm = (targetDir: string) => {
    handleMove(targetDir);
    setShowMoveDialog(false);
  };
  
  // 拖拽开始
  const handleDragStart = (e: React.DragEvent) => {
    // 存储被拖拽节点的信息
    setDraggedNode(node);
    e.dataTransfer.setData('application/json', JSON.stringify({ 
      nodeId: node.path, 
      isDir: node.isDirectory, 
      nodeName: node.name 
    }));
    
    // 设置拖拽时的视觉效果
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
    }
  };
  
  // 拖拽结束
  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedNode(null);
    setIsDragOver(false);
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('opacity-50');
    }
  };
  
  // 拖拽悬停
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // 必须阻止默认行为，才能触发drop事件
    
    if (!node.isDirectory) return; // 只有目录才能接收拖拽
    
    // 如果拖拽的是目录，不能拖拽到自身或其子目录
    const dragData = e.dataTransfer.getData('application/json');
    if (dragData) {
      try {
        const { nodeId, isDir } = JSON.parse(dragData);
        
        // 不能拖拽到自身
        if (nodeId === node.path) return;
        
        // 如果拖拽的是目录，不能拖拽到其子目录
        if (isDir && node.path.startsWith(nodeId)) return;
        
        setIsDragOver(true);
      } catch (error) {
        console.error('解析拖拽数据失败:', error);
      }
    }
  };
  
  // 拖拽离开
  const handleDragLeave = (e: React.DragEvent) => {
    setIsDragOver(false);
  };
  
  // 释放拖拽
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!node.isDirectory) return; // 只有目录才能接收拖拽
    
    const dragData = e.dataTransfer.getData('application/json');
    if (dragData) {
      try {
        const { nodeId, isDir, nodeName } = JSON.parse(dragData);
        
        // 不能拖拽到自身
        if (nodeId === node.path) return;
        
        // 如果拖拽的是目录，不能拖拽到其子目录
        if (isDir && node.path.startsWith(nodeId)) return;
        
        // 执行移动操作
        const res = await window.electronAPI.moveFile(nodeId, node.path);
        if (res.success) {
          smartToast("移动成功", "success");
          
          const { removeOrphanFile, closeFileForProject, activeProjectId } = useProjectsStore.getState();
          
          if (activeProjectId && res.newPath) {
            closeFileForProject(activeProjectId, nodeId);
          } else if (res.newPath) {
            removeOrphanFile(nodeId);
          }
        } else {
            // 与useTreeNode.ts中的错误处理保持一致
            smartToast("移动失败", "error");
          }
      } catch (error) {
        console.error('处理拖拽释放失败:', error);
        smartToast("移动操作发生错误", "error");
      }
    }
    
    // 重置拖拽状态
    setDraggedNode(null);
  };

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
            draggable="true"
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              isSelected && "bg-zinc-200 dark:bg-zinc-700 font-semibold",
              isDragOver && node.isDirectory && "bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700"
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
          onMove={handleMoveClick}
        />
      </ContextMenu>

      {isDir && isExpanded && node.children && (
        <ul className="ml-5 mt-0.5 space-y-0.5">
          {node.children.map((child) => (
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
      
      <MoveDialog
        open={showMoveDialog}
        onClose={() => setShowMoveDialog(false)}
        onSelect={handleMoveConfirm}
        currentPath={node.path}
        isDir={isDir}
      />
    </li>
  );
});
export default TreeNode;
