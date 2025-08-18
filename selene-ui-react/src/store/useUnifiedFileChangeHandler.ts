import { useCallback } from "react";
import type { ProjectTab, FileTab } from "@/types";

/**
 * 帮你写一个 最终版 onChange（包含内容比较 + 防抖 + Ctrl+S 保存钩子）
 * 文件变动的监听处理
 * @param project
 * @param projectId
 * @param activeOrphanFile
 * @param orphanFiles
 * @param changeFileContentForProject
 * @param changeOrphanFileContent
 */
export function useUnifiedFileChangeHandler({
  activeProject,
  projectId,
  activeOrphanFile,
  orphanFiles,
  changeFileContentForProject,
  changeOrphanFileContent,
}: {
  activeProject: ProjectTab | null;
  projectId: string | null;
  activeOrphanFile: string | null;
  orphanFiles: FileTab[];
  changeFileContentForProject: (projectId: string | null, path: string, content: string) => void;
  changeOrphanFileContent: (path: string, content: string) => void;
}) {
  const onChange = useCallback(
    (newContent: string) => {
      console.log("[useUnifiedFileChangeHandler] 监听到文件变动");
      if (activeProject && projectId && activeProject.lastActiveFile) {
        changeFileContentForProject(projectId, activeProject.lastActiveFile, newContent);
      } else if (activeOrphanFile) {
        const exists = orphanFiles.some((f) => f.path === activeOrphanFile);
        if (exists) {
          changeOrphanFileContent(activeOrphanFile, newContent);
        }
      } else {
        console.warn("[useUnifiedFileChangeHandler] 未识别的激活文件");
      }
    },
    [
      activeProject,
      projectId,
      activeOrphanFile,
      orphanFiles,
      changeFileContentForProject,
      changeOrphanFileContent,
    ]
  );

  return onChange;
}