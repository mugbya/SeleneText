// components/file-tree/useTreeNode.ts
import { useState } from "react";
import { FileNode } from "@/types";
import { toast } from "sonner";
import {useProjectsStore} from "@/store/useProjectStore";

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
      toast.warning("名称不能为空");
      return;
    }

    const exists = node.children?.some((child) => child.name === trimmed);
    if (exists) {
      toast.error("已存在同名项");
      return;
    }

    const res =
      newType === "file"
        ? await window.electronAPI.createFile(node.path, trimmed)
        : await window.electronAPI.createFolder(node.path, trimmed);

    if (res?.success) {
      toast.success(`${newType === "file" ? "文件" : "文件夹"}创建成功`);
      window.electronAPI.send("refresh-folder", rootPath ); // 刷新文件夹需要给项目的根路径
      closeDialog();
    } else {
      toast.error("创建失败");
    }
  };

  const handleRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === node.name) {
      toast.warning("请输入有效名称");
      return;
    }

    const res = await window.electronAPI.renamePath(node.path, trimmed);
    if (res.success) {
      toast.success("重命名成功");
    } else {
      toast.error("重命名失败");
    }
    closeDialog();
  };

  const handleDelete = async () => {
    console.log("[useTreeNode] handleDelete ....", node)
    const res = await window.electronAPI.deletePath(node.path);
    if (res.success) {
      toast.success("已删除");
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
      toast.error("删除失败");
    }
    closeDialog();
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
  };
}