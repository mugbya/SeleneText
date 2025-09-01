import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, ChevronLeft, ChevronRight, MoreHorizontal, FolderOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUnifiedFileChangeHandler } from "@/store/useUnifiedFileChangeHandler";
import { useProjectsStore } from "@/store/useProjectStore";
import { FileContentViewer } from "@/components/common/content-viewer/FileContentViewer";

export default function MainContentTabs() {
  // 首先获取所有需要用于条件判断的状态
  const projectId = useProjectsStore((s) => s.activeProjectId);

  // console.log("[MainContentTabs] 项目ID:", projectId);

  const changeFileContentForProject = useProjectsStore(
    (s) => s.changeFileContentForProject
  );
  const setActiveFileForProject = useProjectsStore(
    (s) => s.setActiveFileForProject
  );

  // const { orphanFiles, activeOrphanFile, getActiveProject } =
  //   useProjectsStore.getState();

  const getActiveProject = useProjectsStore((s) => s.getActiveProject);
  const orphanFiles = useProjectsStore((s) => s.orphanFiles);
  const activeOrphanFile = useProjectsStore((s) => s.activeOrphanFile);

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
  const updateProject = useProjectsStore((s) => s.updateProject);
  const removeOrphanFile = useProjectsStore((s) => s.removeOrphanFile);

  // const activeProject = useProjectsStore((s) => s.getActiveProject());
  // const orphanFiles = useProjectsStore((s) => s.orphanFiles);
  // const activeOrphanFile = useProjectsStore((s) => s.activeOrphanFile);

  // 下面写法才能及时获取store 的变更，才能触发当前组件的刷新
  const activeFile = useProjectsStore((s) => s.projects[projectId ?? ""]?.lastActiveFile);
  const openFiles = useProjectsStore((s) => s.projects[projectId ?? ""]?.openFiles);

  const activeProject = getActiveProject();
  // const openFiles = activeProject?.openFiles ?? orphanFiles;
  // const activeFile = activeProject?.lastActiveFile ?? activeOrphanFile;

  const openFilesMerge = openFiles ?? orphanFiles;
  const activeFileMerge = activeFile ?? activeOrphanFile;

  console.log("[MainContentTabs] openFilesMerge %o", openFilesMerge);
  console.log("[MainContentTabs] activeFileMerge %o", activeFileMerge);

  // const currentFile =
  //   activeProject?.openFiles.find(
  //     (f) => f.path === activeProject.lastActiveFile
  //   ) || orphanFiles.find((f) => f.path === activeOrphanFile);

    // useEffect(() => {
    //   console.log('[DEBUG] MainContentTabs 组件渲染');

    // }, []);

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

  // 关闭全部文件
  const handleCloseAllFiles = () => {
    if (activeProjectId && activeProject) {
      // 项目文件
      updateProject(activeProjectId, (p) => ({
        openFiles: [],
        lastActiveFile: null
      }));
    } else {
      // 孤立文件 - 使用逐个移除的方式
      orphanFiles.forEach(file => {
        removeOrphanFile(file.path);
      });
    }
  };

  // 关闭其他文件
  const handleCloseOtherFiles = (currentFilePath: string) => {
    if (activeProjectId && activeProject) {
      // 项目文件
      const currentFile = activeProject.openFiles.find(f => f.path === currentFilePath);
      if (currentFile) {
        updateProject(activeProjectId, (p) => ({
          openFiles: [currentFile],
          lastActiveFile: currentFilePath
        }));
      }
    } else {
      // 孤立文件 - 使用逐个移除的方式
      orphanFiles.forEach(file => {
        if (file.path !== currentFilePath) {
          removeOrphanFile(file.path);
        }
      });
    }
  };

  // 在文件系统中打开文件
  const handleOpenInFileSystem = (filePath: string) => {
    if (window.electronAPI && window.electronAPI.send) {
      window.electronAPI.send('open-in-file-system', filePath);
    }
  };

  // 右键菜单状态管理
  const [contextMenuState, setContextMenuState] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    filePath: ''
  });

  // 打开文件标签的右键菜单
  const handleFileTabContextMenu = (e: React.MouseEvent, filePath: string) => {
    e.preventDefault();
    setContextMenuState({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      filePath
    });
  };

  // 打开全局右键菜单（全部关闭）
  // const handleGlobalContextMenu = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   setContextMenuState({
  //     isOpen: true,
  //     x: e.clientX,
  //     y: e.clientY,
  //     filePath: 'global'
  //   });
  // };

  // 关闭右键菜单
  React.useEffect(() => {
    const handleClick = () => setContextMenuState({ ...contextMenuState, isOpen: false });
    if (contextMenuState.isOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenuState.isOpen]);

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
    // currentFile,
    "openFiles: ",
    openFiles
  );

    // 最后再判断渲染内容 在Hook调用之后进行所有条件判断
  if (!projectId && orphanFiles.length === 0) {
    return null;
  }
    // if (!openFiles || openFiles.length === 0) return null;

  return (
    <main className="flex flex-col flex-1 h-full pr-1.5">
      {/* 标签页 */}
      <Tabs
        value={activeFileMerge || ""}
        onValueChange={(filepath) => {
          setActiveFileForProject(projectId, filepath);
        }}
        className="h-full flex flex-col"
      >
        <div className="relative border-b-0 bg-muted/40 rounded-t-md overflow-hidden">
          {/* ✅ 真正的滚动容器 */}
          <div
            className="overflow-x-auto no-scrollbar"
            ref={tabScrollContainerRef}
          >
            <div className="tabs-header border-b-0 flex items-center"> {/* 确保包含flex items-center */}
              {openFilesMerge.map((file) => (
                <div key={file.path} className="relative mr-0 group">
                  <div
                    className={`tab-button ${activeFileMerge === file.path ? 'tab-button--active' : ''}`}
                    onClick={() => setActiveFileForProject(projectId, file.path)}
                    onContextMenu={(e) => handleFileTabContextMenu(e, file.path)}
                  >
                    <div className="flex items-center justify-between w-full space-x-2 max-w-[160px]">
                      <span className="truncate">
                        {(file.path.split("/").pop() || "").slice(0, 6)}
                        {(file.path.split("/").pop() || "").length > 10 ? "…" : ""}
                      </span>
                      <X
                        className="w-4 h-4 text-zinc-400 hover:text-red-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeFileForProject(projectId, file.path);
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* 文件标签的更多操作按钮 */}
                  <div className="absolute -right-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-1 rounded-full hover:bg-muted/50"
                      onContextMenu={(e) => handleFileTabContextMenu(e, file.path)}
                    >
                      {/* <MoreHorizontal className="w-4 h-4 text-muted-foreground hover:text-foreground" /> */}
                    </button>
                  </div>
                </div>
              ))}
              
              {/* 新建文件按钮 */}
              <button
                onClick={() => handleAddFile()}
                className="ml-2 p-3 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                title="新建文件"
              >
                <Plus className="w-6 h-6" />
              </button>
            {/* </TabsList> */}
            </div>
            
            {/* 右键菜单 */}
            {contextMenuState.isOpen && (
              <div 
                className="fixed z-50 bg-background border rounded-md shadow-lg p-1 text-sm"
                style={{ top: contextMenuState.y, left: contextMenuState.x }}
              >
                {contextMenuState.filePath === 'global' ? (
                  <button
                    className="flex items-center w-full px-3 py-1.5 text-sm rounded-md hover:bg-muted/50"
                    onClick={handleCloseAllFiles}
                  >
                    全部关闭
                  </button>
                ) : (
                  <>
                    <button
                      className="flex items-center w-full px-3 py-1.5 text-sm rounded-md hover:bg-muted/50"
                      onClick={() => handleCloseOtherFiles(contextMenuState.filePath)}
                    >
                      关闭其他
                    </button>
                    <button
                      className="flex items-center w-full px-3 py-1.5 text-sm rounded-md hover:bg-muted/50"
                      onClick={handleCloseAllFiles}
                    >
                      全部关闭
                    </button>
                    <button
                      className="flex items-center w-full px-3 py-1.5 text-sm rounded-md hover:bg-muted/50"
                      onClick={() => handleOpenInFileSystem(contextMenuState.filePath)}
                    >
                      {/* <FolderOpen className="mr-2 w-4 h-4" /> */}
                      在文件系统中打开
                    </button>
                  </>
                )}
              </div>
            )}
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
        {openFilesMerge.map((file) => (
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
                  activeProject={activeProject}
                  filePath={file.path}
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
