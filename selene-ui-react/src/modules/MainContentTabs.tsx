import React from "react";
import MarkdownViewer from "./viewer/MarkdownViewer";
import CodeViewer from "./viewer/CodeViewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // ✅ 用于简单编辑器
import type { FileTab } from '@/types';


function getFileType(filePath: string): "markdown" | "code" | "plain" {
  if (!filePath) return "plain";
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (!ext) return "plain";
  if (["md", "markdown"].includes(ext)) return "markdown";
  if (["ts", "tsx", "js", "jsx", "json", "css", "html"].includes(ext)) return "code";
  return "plain";
}

export default function MainContentTabs({
  openFiles,
  activeFile,
  onSwitchFile,
  onCloseFile,
  onAddFile,
  onChangeFileContent, // ✅ 新增：当用户编辑内容时触发
}: {
  openFiles: FileTab[];
  activeFile: string | null;
  onSwitchFile: (path: string) => void;
  onCloseFile: (path: string) => void;
  onAddFile: () => void;
  onChangeFileContent: (path: string, newContent: string) => void;
}) {
  const currentFile = openFiles.find((f) => f.path === activeFile);

  const renderEditableContent = () => {
    if (!currentFile) return null;

    const fileType = getFileType(currentFile.path);
    switch (fileType) {
      case "markdown":
        return (
          <Textarea
            value={currentFile.content}
            onChange={(e) => onChangeFileContent(currentFile.path, e.target.value)}
            className="w-full h-[60vh] resize-none font-mono text-sm"
          />
        );
      case "code":
        return (
          <CodeViewer
            code={currentFile.content}
            language={currentFile.path.split(".").pop() || "txt"}
            // editable={true}
            // onChange={(newCode) => onChangeFileContent(currentFile.path, newCode)}
          />
        );
      default:
        return (
          <Textarea
            value={currentFile.content}
            onChange={(e) => onChangeFileContent(currentFile.path, e.target.value)}
            className="w-full h-[60vh] resize-none font-mono text-sm"
          />
        );
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* 标签页 */}
      <Tabs value={activeFile || ""} onValueChange={onSwitchFile} className="h-full flex flex-col">
        <TabsList className="flex overflow-x-auto border-b rounded-none">
          {openFiles.map((file) => (
            <div key={file.path} className="relative flex items-center">
              <TabsTrigger value={file.path} className="px-3 truncate max-w-[200px]">
                {file.path.split("/").pop()}
              </TabsTrigger>
              <X
                className="w-4 h-4 absolute -right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => onCloseFile(file.path)}
              />
            </div>
          ))}
          <button
            onClick={onAddFile}
            className="ml-2 px-2 text-sm text-muted-foreground hover:text-foreground"
            title="新建文件"
          >
            <Plus className="w-4 h-4" />
          </button>
        </TabsList>

        {openFiles.map((file) => (
          <TabsContent
            key={file.path}
            value={file.path}
            className="flex-1 overflow-auto p-4 bg-muted rounded"
          >
            <ScrollArea className="h-full">
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-muted-foreground">
                  {file.path}
                </h2>
                {renderEditableContent()}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}