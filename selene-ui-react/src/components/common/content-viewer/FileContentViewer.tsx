import CodeMirrorViewer from "@/components/common/content-viewer/sub-viewer/CodeMirrorViewer";
import { MilkdownEditorWrapper } from "@/components/common/content-viewer/sub-viewer/MarkdownEditor";
import { FileTab } from "@/types";
import { getFileType } from "@/utils/fileUtil";
import React from "react";
import { ImagePreview } from "./sub-viewer/ImagePreview";


interface FileContentViewerProps {
  currentFile: FileTab | null;
  handleChange: (newContent: string) => void;
}

export const FileContentViewer: React.FC<FileContentViewerProps> = ({
  currentFile,
  handleChange,
}) => {
  if (!currentFile) return null;

  const fileType = getFileType(currentFile.path);
  const language = currentFile.path.split(".").pop() || "txt";

  switch (fileType) {
    case "markdown":
      return (
        <div className="w-full h-[70vh] resize-none font-mono text-sm text-left">
          <MilkdownEditorWrapper
            value={currentFile.content}
            onChange={handleChange}
          />
        </div>
      );

    case "code":
      return (
        <div className="w-full h-[70vh] resize-none font-mono text-sm">
          <CodeMirrorViewer
            code={currentFile.content}
            language={language}
            editable={true}
            onChange={handleChange}
          />
        </div>
      );

    case "image":
      return (
        <div className="w-full h-[90vh] resize-none font-mono text-sm">
          <ImagePreview path={currentFile.path} />
        </div>
      );

    default:
      return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto text-left">
          <CodeMirrorViewer
            code={currentFile.content}
            language={language}
            editable={true}
            onChange={handleChange}
          />
        </div>
      );
  }
};