import CodeMirrorViewer from "@/components/common/content-viewer/sub-viewer/CodeMirrorViewer";
import { MilkdownEditorWrapper } from "@/components/common/markdown/MarkdownEditor";
import { FileTab } from "@/types";
import { getFileType } from "@/utils/fileUtil";
import React from "react";
import { ImagePreview } from "./sub-viewer/ImagePreview";
import { useMarkdownStore } from "@/store/userMarkdownStore";
import { useProjectsStore } from "@/store/useProjectStore";
import MermaidPreview from "../MermaidPreview";

interface FileContentViewerProps {
  filePath: string;
  currentFile: FileTab | null;
  handleChange: (newContent: string) => void;
}

export const FileContentViewer: React.FC<FileContentViewerProps> = ({
  filePath,
  currentFile,
  handleChange,
}) => {
  if (!filePath) return null;
  if (!currentFile) return null;

  const fileType = getFileType(currentFile.path);
  const language = currentFile.path.split(".").pop() || "txt";

  switch (fileType) {
    case "markdown":
      const { switchToSource, switchToWysiwyg } = useMarkdownStore(
        currentFile.content
      );
      const { activeProjectId, setFileModeForProject } = useProjectsStore();
      const mode = currentFile?.mode ?? "wysiwyg";

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
                setFileModeForProject(activeProjectId, currentFile.path, mode === 'wysiwyg' ? 'source' : 'wysiwyg');
              }}
            >
              切换到 {mode === "wysiwyg" ? "源码" : "即时"} 模式
            </button>
            <div className="p-1 h-7 w-7" />
          </div>

          <div className="flex-1 flex flex-col h-full overflow-y-auto text-left">
            <MilkdownEditorWrapper
              mode={mode}
              value={currentFile.content}
              onChange={handleChange}
            />
          </div>
        </>
      );
      // return (
      //   <>
      //     {/* <MermaidPreview markdown={currentFile.content} /> */}
      //     <div style={{ padding: 16 }}>
      //       <MermaidPreview markdown={currentFile.content} />
      //     </div>
      //   </>
      // );
    case "code":
      return (
        <>
          <div className="flex items-center p-2 pl-12 border-b border-b-[var(--color-border)] rounded-[var(--radius)]">
            <h2 className="text-base font-semibold text-muted-foreground text-left">
              {filePath}
            </h2>
          </div>
          <div className="flex flex-col flex-1 overflow-auto resize-none font-mono text-sm">
            <CodeMirrorViewer
              code={currentFile.content}
              language={language}
              editable={true}
              onChange={handleChange}
            />
          </div>
        </>
      );

    case "image":
      return (
        <>
        <div className="flex items-center p-2 border-b border-b-[var(--color-border)] rounded-[var(--radius)]">
            <h2 className="text-base font-semibold text-muted-foreground text-left">
              {filePath}
            </h2>
          </div>
        <div className="flex-1 flex flex-col h-full w-full overflow-auto">
          <ImagePreview path={currentFile.path} />
        </div>
        </>
      );

    default:
      return (
        <>
          <div className="flex items-center p-2 pl-12 border-b border-b-[var(--color-border)] rounded-[var(--radius)]">
            <h2 className="text-base font-semibold text-muted-foreground text-left">
              {filePath}
            </h2>
          </div>
          <div className="flex-1 flex flex-col h-full overflow-y-auto text-left">
            <CodeMirrorViewer
              code={currentFile.content}
              language={language}
              editable={true}
              onChange={handleChange}
            />
          </div>
        </>
      );
  }
};
