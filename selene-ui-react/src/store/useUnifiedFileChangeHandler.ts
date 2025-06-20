import { useCallback } from "react";
import type { ProjectTab, FileTab } from "@/types";

export function useUnifiedFileChangeHandler({
  project,
  projectId,
  activeOrphanFile,
  orphanFiles,
  changeFileContentForProject,
  changeOrphanFileContent,
}: {
  project: ProjectTab | null;
  projectId: string | null;
  activeOrphanFile: string | null;
  orphanFiles: FileTab[];
  changeFileContentForProject: (projectId: string | null, path: string, content: string) => void;
  changeOrphanFileContent: (path: string, content: string) => void;
}) {
  const onChange = useCallback(
    (newContent: string) => {
      if (project && projectId && project.lastActiveFile) {
        changeFileContentForProject(projectId, project.lastActiveFile, newContent);
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
      project,
      projectId,
      activeOrphanFile,
      orphanFiles,
      changeFileContentForProject,
      changeOrphanFileContent,
    ]
  );

  return onChange;
}