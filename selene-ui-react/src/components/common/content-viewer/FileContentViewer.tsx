import CodeMirrorViewer from "@/components/common/content-viewer/sub-viewer/CodeMirrorViewer";
import { MilkdownEditorWrapper } from "@/components/common/markdown/MarkdownEditor";
import { FileTab, ProjectTab } from "@/types";
import { getFileType } from "@/utils/fileUtil";
import React, { useEffect, useState } from "react";
import { ImagePreview } from "./sub-viewer/ImagePreview";
import { useMarkdownStore } from "@/store/userMarkdownStore";
import { useProjectsStore } from "@/store/useProjectStore";
import MermaidPreview from "../MermaidPreview";

interface FileContentViewerProps {
  activeProject: ProjectTab | null;
  filePath: string;
  handleChange: (newContent: string) => void;
}

export const FileContentViewer: React.FC<FileContentViewerProps> = ({
  activeProject,
  filePath,
  handleChange,
}) => {
  const [currentFileContent, setCurrentFileContent] = useState<string | null>(null);

  const orphanFiles = useProjectsStore((s) => s.orphanFiles);
  const activeOrphanFile = useProjectsStore((s) => s.activeOrphanFile);

  const currentFile =
    activeProject?.openFiles.find(
      (f) => f.path === activeProject.lastActiveFile
    ) || orphanFiles.find((f) => f.path === activeOrphanFile);


  // 切换文件时重置内容
  useEffect(() => {
    
    if (!filePath) return;
    if (!currentFile) return;


    if (currentFile.path === filePath) {
      setCurrentFileContent(null); // ✅ 重置内容，第一次 render 显示加载中

      if (currentFile?.content){
        setCurrentFileContent(currentFile.content);
        return
      }
      
      window.electronAPI.readFile(filePath).then(({ success, content }) => {
        if (!success) {
          console.error("读取文件失败！");
          return;
        }
        setCurrentFileContent(content);
      });
    }
  }, [currentFile, filePath]);

  // useEffect(() => {
  //   console.log("[FileContentViewer] mounted", filePath);
  //   return () => {
  //     console.log("[FileContentViewer] unmounted", filePath);
  //   };
  // }, [filePath]);

  useEffect(() => {
    if (!currentFileContent || !currentFile) return;
    // 只打印当前激活的文件

    if (currentFile.path === filePath) {
      // console.log(
      //   "[FileContentViewer]",
      //   new Date().toISOString(),
      //   "fileId:", filePath,
      //   "content length:", currentFileContent.length,
      //   "\ncontent:", currentFileContent
      // );
    }
  }, [currentFileContent, currentFile, filePath]);

        // ✅ hooks 必须放顶层
  // const { switchToSource, switchToWysiwyg } = useMarkdownStore(currentFileContent || '');
  // const { switchToSource, switchToWysiwyg, crepeRef, mode } = useMarkdownStore(currentFileContent || '');
  const { switchToSource, switchToWysiwyg, crepeRef, mode } = useMarkdownStore();
  const { activeProjectId, setFileModeForProject } = useProjectsStore();
  

  if (!currentFile || currentFileContent === null) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        加载中...
      </div>
    );
  }

  console.log(
    "[FileContentViewer]",
    new Date().toISOString(),
    "fileId:", filePath,
    "content length:", currentFileContent.length,
    "\ncontent:", currentFileContent
  );

  const fileType = getFileType(currentFile.path);
  const language = currentFile.path.split(".").pop() || "txt";

      //   console.log(
      //   "[FileContentViewer]",
      //   new Date().toISOString(),
      //   "fileId:", filePath,
      //   "content length:", currentFileContent.length,
      //   "\ncontent:", currentFileContent
      // );

  if (fileType === "markdown") {
    // const mode = currentFile?.mode ?? "wysiwyg";

    return (
      <>
        <div className="flex items-center pl-4 border-b border-b-[var(--color-border)] rounded-[var(--radius)]">
          <h2 className="text-base font-semibold text-muted-foreground text-left">
            {filePath}
          </h2>
          <button
            className="ml-auto px-4 py-2 text-black bg-gray-50 hover:bg-orange-400 rounded shadow"
            onClick={() => {
              if (mode === "wysiwyg") switchToSource();
              else switchToWysiwyg();
              setFileModeForProject(
                activeProjectId,
                currentFile.path,
                mode === "wysiwyg" ? "source" : "wysiwyg"
              );
            }}
          >
            切换到 {mode === "wysiwyg" ? "源码" : "即时"} 模式
          </button>
          <div className="p-1 h-7 w-7" />
        </div>

        <div className="flex-1 flex flex-col h-full overflow-y-auto text-left">
          <MilkdownEditorWrapper
            key={filePath}
            filePath={filePath}
            currentFile={currentFile}
            mode={mode}
            value={currentFileContent}
            onChange={handleChange}
          />
          {/* <MermaidPreview markdown={currentFileContent} /> */}
        </div>
      </>
    );
  }

  if (fileType === "code") {
    return (
      <>
        <div className="flex items-center p-2 pl-12 border-b border-b-[var(--color-border)] rounded-[var(--radius)]">
          <h2 className="text-base font-semibold text-muted-foreground text-left">
            {filePath}
          </h2>
        </div>
        <div className="flex flex-col flex-1 overflow-auto resize-none font-mono text-sm">
          <CodeMirrorViewer
            key={filePath}
            code={currentFileContent}
            language={language}
            editable={true}
            onChange={handleChange}
          />
        </div>
      </>
    );
  }

  if (fileType === "image") {
    return (
      <>
        <div className="flex items-center p-2 border-b border-b-[var(--color-border)] rounded-[var(--radius)]">
          <h2 className="text-base font-semibold text-muted-foreground text-left">
            {filePath}
          </h2>
        </div>
        <div className="flex-1 flex flex-col h-full w-full overflow-auto">
          <ImagePreview key={filePath} path={currentFile.path} />
        </div>
      </>
    );
  }

  // 默认 fallback
  return (
    <>
      <div className="flex items-center p-2 pl-12 border-b border-b-[var(--color-border)] rounded-[var(--radius)]">
        <h2 className="text-base font-semibold text-muted-foreground text-left">
          {filePath}
        </h2>
      </div>
      <div className="flex-1 flex flex-col h-full overflow-y-auto text-left">
        <CodeMirrorViewer
          key={filePath}
          code={currentFileContent}
          language={language}
          editable={true}
          onChange={handleChange}
        />
      </div>
    </>
  );
};