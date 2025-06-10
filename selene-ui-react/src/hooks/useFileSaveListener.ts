// hooks/useFileSaveListener.ts
import { useEffect } from "react";
import { handleFileSave } from "@/logic/fileSaver";
import type { FileTab } from "@/types";

/**
 * 文件保存监听器
 * @param openFiles 
 * @param activeFile 
 * @param setOpenFiles 
 * @param setActiveFile 
 */
export function useFileSaveListener(openFiles: FileTab[], activeFile: string | null, setOpenFiles: (files: FileTab[]) => void, setActiveFile: (file: string) => void) {
  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.on) {
      console.warn("⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置");
      return;
    }

    const handler = async () => {
      const current = openFiles.find((f) => f.path === activeFile);
      await handleFileSave(current, (oldPath, updated) => {
        setOpenFiles((prev) =>
          prev.map((f) => (f.path === oldPath ? updated : f))
        );
        setActiveFile(updated.path);
      });
    };

    api.on("file-save", handler);

    return () => {
      api.removeAllListeners?.("file-save");
    };
  }, [openFiles, activeFile, setOpenFiles, setActiveFile]);
}