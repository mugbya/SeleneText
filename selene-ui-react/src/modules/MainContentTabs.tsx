import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUnifiedFileChangeHandler } from "@/store/useUnifiedFileChangeHandler";
import { useProjectsStore } from "@/store/useProjectStore";
import { FileContentViewer } from "@/components/common/content-viewer/FileContentViewer";

export default function MainContentTabs({
  projectId,
}: {
  projectId: string | null;
}) {
  const changeFileContentForProject = useProjectsStore(
    (s) => s.changeFileContentForProject
  );
  const setActiveFileForProject = useProjectsStore(
    (s) => s.setActiveFileForProject
  );

  const { orphanFiles, activeOrphanFile, getActiveProject } =
    useProjectsStore.getState();

  const createNewFileForProject = useProjectsStore(
    (s) => s.createNewFileForProject
  );
  const activeProjectId = useProjectsStore((s) => s.activeProjectId);
  // const orphanFiles = useProjectsStore((s) => s.orphanFiles);
  // const activeOrphanFile = useProjectsStore((s) => s.activeOrphanFile);
  const changeOrphanFileContent = useProjectsStore(
    (s) => s.changeOrphanFileContent
  );
  const createOrphanFile = useProjectsStore((s) => s.createOrphanFile);
  const closeFileForProject = useProjectsStore((s) => s.closeFileForProject);

  // const activeProject = useProjectsStore((s) => s.getActiveProject());
  // const orphanFiles = useProjectsStore((s) => s.orphanFiles);
  // const activeOrphanFile = useProjectsStore((s) => s.activeOrphanFile);

  const activeProject = getActiveProject();
  const openFiles = activeProject?.openFiles ?? orphanFiles;
  const activeFile = activeProject?.lastActiveFile ?? activeOrphanFile;

  const currentFile =
    activeProject?.openFiles.find(
      (f) => f.path === activeProject.lastActiveFile
    ) || orphanFiles.find((f) => f.path === activeOrphanFile);

  // 处理文件内容变化
  const handleChange = useUnifiedFileChangeHandler({
    activeProject,
    projectId,
    activeOrphanFile,
    orphanFiles,
    changeFileContentForProject,
    changeOrphanFileContent,
  });

  // 从文件标签页的 +图标 新增文件
  const handleAddFile = () => {
    if (activeProjectId && activeProject) {
      // 有项目，新增项目下的文件
      // console.log("handleAddFile 有项目，新增项目下的文件");
      createNewFileForProject(activeProjectId);
    } else {
      // console.log("handleAddFile 无项目，新建孤立文件");
      // 无项目，新建孤立文件
      createOrphanFile();
    }
  };

  // 文件标签页左右滑动
  const tabScrollContainerRef = useRef<HTMLDivElement>(null);

  // ✅ 左右滑动按钮 目前不用
  // const scrollLeft = () => {
  //   tabScrollContainerRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  // };
  // const scrollRight = () => {
  //   tabScrollContainerRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  // };

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
    <main className="flex flex-col flex-1 h-full pr-1.5">
      {/* 标签页 */}
      <Tabs
        value={activeFile || ""}
        onValueChange={(filepath) => {
          setActiveFileForProject(projectId, filepath);
        }}
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
            className="flex-1 flex flex-col h-full overflow-auto  border border-[var(--color-border)] rounded-[var(--radius)]"
            // className="flex-1 flex flex-col h-full overflow-auto bg-muted rounded"
          >
            {/* <div className="p-3 pl-12">
                <h2 className="w-full text-base font-semibold text-muted-foreground text-left">
                  {file.path}
                </h2>
            </div> */}
                
            {/* <ScrollArea className="h-full"> */}
              {/* <div className="space-y-4 overflow-auto"> */}
        
                {/* 文件内容展示区域 */}
                <FileContentViewer
                  filePath={file.path}
                  currentFile={currentFile ?? null}
                  handleChange={handleChange}
                />
              {/* </div> */}
            {/* </ScrollArea> */}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
