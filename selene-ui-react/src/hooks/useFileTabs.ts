// hooks/useFileTabs.ts
import { useState } from "react";
import type { FileTab } from "@/types";
import { useEffect } from "react";

/**
 * 按照打开的项目纬度管理 文件操作相关逻辑（打开/关闭/保存）
 * @param activeProjectPath 激活的项目路径
 * @returns 
 */
export default function useFileTabs(activeProjectPath: string | null) {
  const [openFiles, setOpenFiles] = useState<FileTab[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [newFileCounter, setNewFileCounter] = useState(1);  // 文件编号

  const addFile = () => {
    console.log("[useFileTabs] addFile ... ");
    const newPath = `Untitled-${newFileCounter}.txt`;
    setOpenFiles((prev) => [...prev, { path: newPath, content: "" }]);
    setActiveFile(newPath);
    setNewFileCounter((c) => c + 1);
  };

  const closeFile = (path: string) => {
    console.log("[useFileTabs] closeFile ... ");
    setOpenFiles((prev) => prev.filter((f) => f.path !== path));
    if (activeFile === path) setActiveFile(null);
  };

  const changeFileContent = (path: string, content: string) => {
    console.log("[useFileTabs] changeFileContent ...path: ", path, ", content: ", content);
    setOpenFiles((files) =>
      files.map((f) => (f.path === path ? { ...f, content } : f))
    );
  };

  const openFile = async (filePath: string) => {
    if (!filePath.startsWith(activeProjectPath || "")) return;

    const existing = openFiles.find((f) => f.path === filePath);
    if (existing) {
      setActiveFile(existing.path);
      return;
    }

    const res = await window.electronAPI.readFile(filePath);
    console.log("[useFileTabs] openFile...res: ", res);
    if (res?.success) {
      const newFile = { path: filePath, content: res.content };
      setOpenFiles((prev) => [...prev, newFile]);
      setActiveFile(newFile.path);
    }
  };

  return {
    openFiles,
    activeFile,
    setActiveFile,
    addFile,
    openFile,
    closeFile,
    changeFileContent,
    setOpenFiles,
  };
}