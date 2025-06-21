import React from "react";
import MarkdownViewer from "./viewer/MarkdownViewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // ✅ 用于简单编辑器
import type { FileTab } from "@/types";
import { useProjectsStore } from "@/store/projectsStore";
import { useUnifiedFileChangeHandler } from "@/store/useUnifiedFileChangeHandler";
import CodeMirrorViewer from "./viewer/CodeMirrorViewer";

function getFileType(filePath: string): "markdown" | "code" | "plain" {
  if (!filePath) return "plain";
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (!ext) return "plain";
  if (["md", "markdown"].includes(ext)) return "markdown";
  if (["ts", "tsx", "js", "jsx", "json", "css", "html"].includes(ext))
    return "code";
  return "plain";
}

export default function MainContentTabs({
  projectId,
  // openFiles,
  // activeFile,
  onSwitchFile,
  // onCloseFile,
  onAddFile,
}: // onChangeFileContent, // ✅ 新增：当用户编辑内容时触发
{
  projectId: string | null;
  // openFiles: FileTab[];
  // activeFile: string | null;
  onSwitchFile: (path: string) => void;
  // onSwitchFile: (projectId: string | null, path: string | null) => void;
  // onCloseFile: (projectId: string | null, path: string | null) => void;
  // onCloseFile: (path: string) => void;
  onAddFile: () => void;
  // onChangeFileContent: (path: string, newContent: string) => void;
}) {
  // const currentFile = openFiles.find((f) => f.path === activeFile);

  const changeFileContentForProject = useProjectsStore(
    (s) => s.changeFileContentForProject
  );
  const getActiveProject = useProjectsStore((s) => s.getActiveProject);
  const addOpenFileForProject = useProjectsStore(
    (s) => s.addOpenFileForProject
  );

  const createNewFileForProject = useProjectsStore(
    (s) => s.createNewFileForProject
  );
  const activeProjectId = useProjectsStore((s) => s.activeProjectId);
  const orphanFiles = useProjectsStore((s) => s.orphanFiles);
  const activeOrphanFile = useProjectsStore((s) => s.activeOrphanFile);
  const changeOrphanFileContent = useProjectsStore(
    (s) => s.changeOrphanFileContent
  );
  const createOrphanFile = useProjectsStore((s) => s.createOrphanFile);
  const closeFileForProject = useProjectsStore((s) => s.closeFileForProject);

  const activeProject = useProjectsStore((s) => s.getActiveProject());
  // const orphanFiles = useProjectsStore((s) => s.orphanFiles);
  // const activeOrphanFile = useProjectsStore((s) => s.activeOrphanFile);

  console.log("[useElectronEvents] project: ", activeProject, "orphanFiles: ", orphanFiles);
  const openFiles = activeProject?.openFiles ?? orphanFiles;
  const activeFile = activeProject?.lastActiveFile ?? activeOrphanFile;

  const project = getActiveProject();
  // const content = useProjectsStore(() => {
  //   return project?.openFiles[project.lastActiveFile || ""] ?? "";
  // }, [project]);
  // const currentFile = project?.openFiles.find((f) => f.path === activeFile);
  // console.log("当前文件：", currentFile);

  console.log("当前文件 openFiles：", openFiles);
  // console.log("当前文件：", currentFile);

  const currentFile =
    project?.openFiles.find((f) => f.path === project.lastActiveFile) ||
    orphanFiles.find((f) => f.path === activeOrphanFile);

  const handleChange = useUnifiedFileChangeHandler({
    project,
    projectId,
    activeOrphanFile,
    orphanFiles,
    changeFileContentForProject,
    changeOrphanFileContent,
  });

  const handleAddFile = () => {
    console.log("handleAddFile 新建文件");
    if (activeProjectId && project) {
      // 有项目，新增项目下的文件
      console.log("handleAddFile 有项目，新增项目下的文件");
      createNewFileForProject(activeProjectId);
    } else {
      console.log("handleAddFile 无项目，新建孤立文件");
      // 无项目，新建孤立文件
      createOrphanFile();
    }
  };

  const renderEditableContent = () => {
    if (!currentFile) return null;

    const fileType = getFileType(currentFile.path);
    console.log("文件类型：", fileType);
    switch (fileType) {
      case "markdown":
        return (
          <Textarea
            value={currentFile.content}
            // onChange={(e) => onChangeFileContent(currentFile.path, e.target.value)}
            onChange={(e) => {
              // if (project && project.lastActiveFile) {
              //   changeFileContentForProject(
              //     projectId,
              //     project.lastActiveFile,
              //     e.target.value
              //   );
              // }
              handleChange(e.target.value);
            }}
            className="w-full h-[60vh] resize-none font-mono text-sm"
          />
        );
      case "code":
        return (
          // <CodeViewer
          //   code={currentFile.content}
          //   language={currentFile.path.split(".").pop() || "txt"}
          //   editable={true}
          //   onChange={(newCode) => onChangeFileContent(currentFile.path, newCode)}
          // />
          <CodeMirrorViewer 
            code={currentFile.content}
            language={currentFile.path.split(".").pop() || "txt"}
            editable={true}
            onChange={(newCode) => {
              // console.log("CodeEditor onChange: ", newCode)
              const store = useProjectsStore.getState();

              if (project?.id && project?.lastActiveFile) {
                store.changeFileContentForProject(
                  project.id,
                  project.lastActiveFile,
                  newCode
                );
              } else if (activeOrphanFile) {
                store.changeOrphanFileContent(activeOrphanFile, newCode);
              }
            }}
          />

         
        );
      default:
        return (
          // <Textarea
          //   value={currentFile.content}
          //   onChange={(e) => onChangeFileContent(currentFile.path, e.target.value)}
          //   className="w-full h-[60vh] resize-none font-mono text-sm"
          // />
          <Textarea
            autoFocus
            // onClick={(e) => e.currentTarget.focus()}
            value={currentFile.content}
            onChange={(e) => {
              // if (project && project.lastActiveFile) {
              //   changeFileContentForProject(
              //     projectId,
              //     project.lastActiveFile,
              //     e.target.value
              //   );
              // }
              const content = e.target.value;
              const store = useProjectsStore.getState();

              if (project?.id && project?.lastActiveFile) {
                store.changeFileContentForProject(
                  project.id,
                  project.lastActiveFile,
                  content
                );
              } else if (activeOrphanFile) {
                store.changeOrphanFileContent(activeOrphanFile, content);
              }
            }}
            className="w-full h-[60vh] resize-none font-mono text-sm"
          />
        );
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* 标签页 */}
      <Tabs
        value={activeFile || ""}
        onValueChange={onSwitchFile}
        className="h-full flex flex-col"
      >
        <TabsList className="flex overflow-x-auto border-b bg-muted/40 px-2 py-1 space-x-2 rounded-t-md">
          {openFiles.map((file) => (
            <div key={file.path} className="relative mr-2">
              <TabsTrigger
                value={file.path}
                className="pl-2 pr-6 py-1 max-w-[128px] truncate rounded-md text-sm font-medium text-muted-foreground
                  data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow transition-all"
              >
                {(file.path.split("/").pop() || "").slice(0, 10)}
                {(file.path.split("/").pop() || "").length > 10 ? "…" : ""}
              </TabsTrigger>

              <X
                className="w-4 h-4 absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation(); // 防止点击触发 tab 切换
                  closeFileForProject(projectId, file.path);
                }}
              />
            </div>
          ))}

          <button
            onClick={() => handleAddFile()}
            className="ml-2 p-1 text-muted-foreground hover:text-foreground"
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
