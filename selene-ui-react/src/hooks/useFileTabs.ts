// hooks/useFileTabs.ts
import { useState } from "react";
import type { FileTab } from "@/types";

/**
 * 文件操作相关逻辑（打开/关闭/保存）
 * @returns 
 */
export default function useFileTabs() {
  const [openFiles, setOpenFiles] = useState<FileTab[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [newFileCounter, setNewFileCounter] = useState(1);  // 文件编号

  const addFile = () => {
    const newPath = `Untitled-${newFileCounter}.txt`;
    setOpenFiles((prev) => [...prev, { path: newPath, content: "" }]);
    setActiveFile(newPath);
    setNewFileCounter((c) => c + 1);
  };

  const closeFile = (path: string) => {
    setOpenFiles((prev) => prev.filter((f) => f.path !== path));
    if (activeFile === path) setActiveFile(null);
  };

  const changeFileContent = (path: string, content: string) => {
    setOpenFiles((files) =>
      files.map((f) => (f.path === path ? { ...f, content } : f))
    );
  };

  return {
    openFiles,
    activeFile,
    setActiveFile,
    addFile,
    closeFile,
    changeFileContent,
    setOpenFiles,
  };
}