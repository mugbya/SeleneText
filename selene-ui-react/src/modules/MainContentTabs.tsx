import React, { useRef } from "react";
import MarkdownViewer from "./viewer/MarkdownViewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // ✅ 用于简单编辑器
import { useUnifiedFileChangeHandler } from "@/store/useUnifiedFileChangeHandler";
import CodeMirrorViewer from "./viewer/CodeMirrorViewer";
import { useProjectsStore } from "@/store/useProjectStore";
import { MilkdownEditorWrapper } from "./viewer/MarkdownEditor";
import { ImagePreview } from "@/components/common/ImagePreview";
import { getFileType } from "@/utils/fileUtil";
// import { MilkdownEditorWrapper } from "./viewer/MilkdownEditorViewer";
// import { MilkdownEditorWrapper } from "./viewer/MilkdownEditorViewer";



export default function MainContentTabs({
  projectId,
  // openFiles,
  // activeFile,
  onSwitchFile,
}: // onCloseFile,
// onAddFile,
// onChangeFileContent, // ✅ 新增：当用户编辑内容时触发
{
  projectId: string | null;
  // openFiles: FileTab[];
  // activeFile: string | null;
  onSwitchFile: (path: string) => void;
  // onSwitchFile: (projectId: string | null, path: string | null) => void;
  // onCloseFile: (projectId: string | null, path: string | null) => void;
  // onCloseFile: (path: string) => void;
  // onAddFile: () => void;
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

  console.log(
    "[useElectronEvents] project: ",
    activeProject,
    "orphanFiles: ",
    orphanFiles
  );
  const openFiles = activeProject?.openFiles ?? orphanFiles;
  const activeFile = activeProject?.lastActiveFile ?? activeOrphanFile;

  const project = getActiveProject();

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

  // 文件标签页左右滑动
  const tabScrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    tabScrollContainerRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  };
  const scrollRight = () => {
    tabScrollContainerRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  };

  const renderEditableContent = () => {
    if (!currentFile) return null;

    const fileType = getFileType(currentFile.path);
    console.log("文件类型：", fileType);
    switch (fileType) {
      case "markdown":
        return (
          <div className="w-full h-[70vh] resize-none font-mono text-sm text-left">
            {/* <Textarea
              value={currentFile.content}
              onChange={(e) => {
                handleChange(e.target.value);
              }}
            /> */}
            {/* <MarkdownEditor
              mode={mode} // 'markdown' 或 'wysiwyg'
              currentFile={currentFile}
              handleChange={val => {
                // setState 或 dispatch 更新 currentFile.content
              }}
            /> */}
            {/* <MilkdownEditorWrapper
              value={currentFile.content}
              onChange={(newCode) => {
                console.log("handleChange", newCode);
                handleChange(newCode);
              }}
            /> */}

          <MilkdownEditorWrapper
            value={currentFile.content}
            onChange={(newCode) => {
              // console.log("handleChange", newCode);
              handleChange(newCode);
            }}
            // onFocus={() => console.log("聚焦")}
            // onBlur={() => console.log("失焦")}
          />
          </div>
        );
      case "code":
        return (
          // <div className="flex-1 overflow-auto w-full h-full">
          <div className="w-full h-[70vh] resize-none font-mono text-sm">
            <CodeMirrorViewer
              code={currentFile.content}
              language={currentFile.path.split(".").pop() || "txt"}
              editable={true}
              onChange={(newCode) => {
                handleChange(newCode);
              }}
            />
          </div>
        );
        break
    case "image":
      console.log("这是图片类型");
      return (
        <div className="w-full h-[90vh] resize-none font-mono text-sm">
          <ImagePreview path={currentFile.path} />
         </div>
      );
    default:
        return (
          // <Textarea
          //   value={currentFile.content}
          //   onChange={(e) => onChangeFileContent(currentFile.path, e.target.value)}
          //   className="w-full h-[60vh] resize-none font-mono text-sm"
          // />
          // <Textarea
          //   autoFocus
          //   // onClick={(e) => e.currentTarget.focus()}
          //   value={currentFile.content}
          //   onChange={(e) => {
          //     handleChange(e.target.value);
          //   }}
          //   className="w-full h-[70vh] resize-none font-mono text-sm"
          // />

          // <div className="w-full h-[70vh] resize-none font-mono text-sm">
          <div className="flex-1 flex flex-col h-full overflow-y-auto text-left">
            <CodeMirrorViewer
              code={currentFile.content}
              language={currentFile.path.split(".").pop() || "txt"}
              editable={true}
              onChange={(newCode) => {
                handleChange(newCode);
              }}
            />
          </div>
        );
    }
  };

  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("[MainContentTabs] 渲染次数:", renderCount.current);
  console.log(
    "[MainContentTabs] 当前文件：",
    currentFile,
    "openFiles: ",
    openFiles
  );

  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* 标签页 */}
      <Tabs
        value={activeFile || ""}
        onValueChange={onSwitchFile}
        className="h-full flex flex-col"
      >
        <div className="relative border-b-0 bg-muted/40 rounded-t-md overflow-hidden">
          {/* 滚动按钮 - 左 */}
          {/*<button*/}
          {/*    className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-muted/40 to-transparent flex items-center justify-center"*/}
          {/*    onClick={scrollLeft}*/}
          {/*>*/}
          {/*    <ChevronLeft className="w-4 h-4" />*/}
          {/*</button>*/}

          {/* ✅ 真正的滚动容器 */}
          <div
            className="overflow-x-auto no-scrollbar"
            ref={tabScrollContainerRef}
          >
            <TabsList className="flex w-max items-center space-x-2 h-12">
              {openFiles.map((file) => (
                <div key={file.path} className="relative mr-2">
                  <TabsTrigger
                    value={file.path}
                    className="pl-2 pr-6 py-1 max-w-[160px] truncate rounded-md text-sm font-medium text-muted-foreground
              data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow transition-all"
                  >
                    {(file.path.split("/").pop() || "").slice(0, 10)}
                    {(file.path.split("/").pop() || "").length > 10 ? "…" : ""}
                  </TabsTrigger>
                  <X
                    className="w-4 h-4 absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
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
          </div>

          {/* 滚动按钮 - 右 */}
          {/*<button*/}
          {/*    className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-muted/40 to-transparent flex items-center justify-center"*/}
          {/*    onClick={scrollRight}*/}
          {/*>*/}
          {/*    <ChevronRight className="w-4 h-4" />*/}
          {/*</button>*/}
        </div>

        {/* 标签页内容 */}
        {openFiles.map((file) => (
          <TabsContent
            key={file.path}
            value={file.path}
            // className="flex-1 overflow-auto p-4 bg-muted rounded"
            className="flex-1 flex-col h-full overflow-auto p-4 bg-muted rounded"
          >
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {/* <h2 className="text-base font-semibold text-muted-foreground"> */}
                {/* <h2 className="w-full text-base font-semibold text-muted-foreground text-center"> */}
                <h2 className="w-full text-base font-semibold text-muted-foreground text-left">
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
