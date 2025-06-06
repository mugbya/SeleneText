import React from "react";
import MarkdownViewer from "./viewer/MarkdownViewer";
import CodeViewer from "./viewer/CodeViewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function getFileType(filePath: string): "markdown" | "code" | "plain" {
    if (!filePath) return "plain";
    const ext = filePath.split(".").pop()?.toLowerCase();
    if (!ext) return "plain";
    if (["md", "markdown"].includes(ext)) return "markdown";
    if (["ts", "tsx", "js", "jsx", "json", "css", "html"].includes(ext)) return "code";
    return "plain";
}

type FileTab = {
    path: string;
    content: string;
};

export default function MainContentTabs({
    openFiles,
    activeFile,
    onSwitchFile,
    onCloseFile,
    onAddFile,
}: {
    openFiles: FileTab[];
    activeFile: string | null;
    onSwitchFile: (path: string) => void;
    onCloseFile: (path: string) => void;
    onAddFile: () => void;
}) {
    const currentFile = openFiles.find(f => f.path === activeFile);

    const renderContent = () => {
        if (!currentFile) return null;

        const fileType = getFileType(currentFile.path);
        switch (fileType) {
            case "markdown":
                return <MarkdownViewer content={currentFile.content} />;
            case "code":
                const ext = currentFile.path.split(".").pop() || "txt";
                return <CodeViewer code={currentFile.content} language={ext} />;
            default:
                return (
                    <pre className="text-left bg-muted p-4 rounded whitespace-pre-wrap text-sm font-mono overflow-auto">
                        {currentFile.content}
                    </pre>
                );
        }
    };

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            {/* 标签页 */}
            <Tabs value={activeFile || ""} onValueChange={onSwitchFile} className="h-full flex flex-col">
      <TabsList className="flex overflow-x-auto border-b">
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
          <pre className="whitespace-pre-wrap text-sm font-mono">{file.content}</pre>
        </TabsContent>
      ))}
    </Tabs>
            {/* <div className="flex items-center space-x-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-900 border-b overflow-x-auto">
                {openFiles.map(file => {
                    const fileName = file.path.split("/").pop();
                    const isActive = file.path === activeFile;

                    return (
                        <div
                            key={file.path}
                            className={`flex items-center px-3 py-1 rounded-md text-sm cursor-pointer whitespace-nowrap ${
                                isActive
                                    ? "bg-white dark:bg-zinc-800 font-semibold"
                                    : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                            onClick={() => onSwitchFile(file.path)}
                        >
                            {fileName}
                            <X
                                className="ml-2 w-3 h-3 hover:text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCloseFile(file.path);
                                }}
                            />
                        </div>
                    );
                })}
            </div> */}

            {/* 内容区域 */}
            <ScrollArea className="flex-1 p-4">
                {currentFile ? (
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold text-muted-foreground">
                            {currentFile.path}
                        </h2>
                        {renderContent()}
                    </div>
                ) : (
                    <div className="text-zinc-400 text-sm">未打开任何文件</div>
                )}
            </ScrollArea>
        </main>
    );
}