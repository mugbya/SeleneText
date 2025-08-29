// components/file-tree/useTreeNode.ts
import { useState } from "react";
import { FileNode } from "@/types";
import { toast } from "sonner";
import { useProjectsStore } from "@/store/useProjectStore";
import { smartToast } from "@/utils/commonUtil";
import { t } from "i18next";

type DialogType = "create" | "rename" | "delete" | null;

/**
 * 	•	管理节点的状态（是否展开、选中、对话框状态等）；
	•	提供 UI 组件使用的行为方法（如 toggle、重命名、新建、删除等）；
	•	屏蔽复杂逻辑，使 TreeNode 更关注结构和样式。
 * @param node 
 * @param selectedPath 
 * @param onFileClick 
 * @returns 
 */
// export function useTreeNode(node: FileNode, selectedPath?: string, onFileClick?: (path: string) => void) {
export function useTreeNode(rootPath: string, node: FileNode, selectedPath?: string) {
  const [expanded, setExpanded] = useState(false);
  const [dialog, setDialog] = useState<DialogType>(null);
  const [newType, setNewType] = useState<"file" | "folder">("file");
  const [newFileName, setNewFileName] = useState("");
  const [renameValue, setRenameValue] = useState(node.name);

  const isDir = node.isDirectory;
  const isSelected = node.path === selectedPath;

    const {
      getActiveProject,
    } = useProjectsStore.getState(); // 💥 get 最新状态

    const project = getActiveProject();

  // const toggle = () => {
  //   if (isDir) {
  //     setExpanded((prev) => !prev);
  //   } else {
  //     onFileClick?.(node.path);
  //   }
  // };

  const openDialog = (type: DialogType) => {
    setDialog(type);
    if (type === "rename") setRenameValue(node.name);
  };

  const closeDialog = () => {
    setDialog(null);
    setNewFileName("");
  };

  const handleCreate = async () => {
    const trimmed = newFileName.trim();
    if (!trimmed) {
      smartToast("名称不能为空", "warning");
      return;
    }

    const exists = node.children?.some((child) => child.name === trimmed);
    if (exists) {
      smartToast("已存在同名项", "error");
      return;
    }

    const res =
      newType === "file"
        ? await window.electronAPI.createFile(node.path, trimmed)
        : await window.electronAPI.createFolder(node.path, trimmed);

    if (res?.success) {
      smartToast(`${newType === "file" ? "文件" : "文件夹"}创建成功`, "success");
      window.electronAPI.send("refresh-folder", rootPath ); // 刷新文件夹需要给项目的根路径
      closeDialog();
    } else {
      smartToast("创建失败", "error");
    }
  };

  const handleRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === node.name) {
      // toast.warning("请输入有效名称");
      smartToast("请输入有效名称", "warning");
      return;
    }

    if (!project?.rootPath) {
      smartToast("项目根路径不存在", 'error');
      return;
    }

    const res = await window.electronAPI.renamePath(project?.rootPath, node.path, trimmed);
    if (res.success) {
      smartToast("重命名成功", "success");
    } else {
      smartToast("重命名失败", "error");
    }
    closeDialog();
  };

  const handleDelete = async () => {
    console.log("[useTreeNode] handleDelete ....", node)
    const res = await window.electronAPI.deletePath(node.path);
    if (res.success) {
      smartToast("删除成功", "success");
      // const parentPath = node.path.substring(0, node.path.lastIndexOf("/"));
      // console.log("[useTreeNode] parentPath", parentPath)
      window.electronAPI.send("refresh-folder", rootPath ); // 刷新文件夹需要给项目的根路径

      const {
        removeOrphanFile,
        closeFileForProject,
        activeProjectId
      } = useProjectsStore.getState(); // 💥 get 最新状态
      
      if (activeProjectId) {
        closeFileForProject(activeProjectId, node.path);
      } else{
        removeOrphanFile(node.path);
      }
    } else {
      smartToast("删除失败", "error");
    }
    closeDialog();
  };
  
  // 移动文件或文件夹
  const handleMove = async (targetDir: string) => {
    if (!targetDir) {
      smartToast("请选择目标目录", "warning");
      return;
    }
    
    // 不能移动到自身
    if (targetDir === node.path && isDir) {
      smartToast("不能移动到自身", "warning");
      return;
    }
    
    // 不能移动到自身的子目录
    if (isDir && targetDir.startsWith(node.path)) {
      smartToast("不能移动到自身的子目录", "warning");
      return;
    }
    
    const res = await window.electronAPI.moveFile(node.path, targetDir);
    if (res.success) {
      smartToast("移动成功", "success");
      
      const {
        removeOrphanFile,
        closeFileForProject,
        activeProjectId
      } = useProjectsStore.getState();
      
      if (activeProjectId && res.newPath) {
        // 更新项目中已打开的文件路径
        closeFileForProject(activeProjectId, node.path);
        // 如果需要，可以在这里打开新路径的文件
      } else if (res.newPath) {
        removeOrphanFile(node.path);
      }
    } else {
      smartToast(`移动失败`, "error");
    }
  };

  return {
    expanded,
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
  };
}