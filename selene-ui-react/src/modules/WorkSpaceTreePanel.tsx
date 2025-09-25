import FileTree from "@/components/common/file-tree/FileTree";
import { useRef } from "react";
import { useProjectsStore } from "@/store/useProjectStore";
import { getFileType } from "@/utils/fileUtil";

function WorkSpaceTreePanel() {
  // Get all state needed for conditions first
  const projectId = useProjectsStore((s) => s.activeProjectId);
  const activeProject = useProjectsStore((s) => s.getActiveProject());
  const folderTree = activeProject?.folderTree;
  const projectRootPath = activeProject?.rootPath ?? null;
  const projectActiveFilePath = activeProject?.lastActiveFile;
  
  // All hooks must be called before any conditional returns
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("[WorkSpaceTreePanel] 渲染次数:", renderCount.current);

  // All condition checks AFTER all hooks
  if (!projectId || !folderTree || !projectRootPath) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        加载中...
      </div>
    );
  }

  // const switchProject = useProjectsStore((s) => s.switchProject);
  // const closeProject = useProjectsStore((s) => s.closeProject); // 如果你在用

  if (!projectId || !folderTree || !projectRootPath) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        加载中...
      </div>
    );
  }
  // console.log("[WorkSpaceTreePanel] 项目folderTree:", folderTree);

  const handlerOpenFile = async (projectId: string, filePath: string) => {
      // console.log("读取文件内容：", filePath);
      const fileType = getFileType(filePath);

      const { addOpenFileForProject, setActiveFileForProject } = useProjectsStore.getState();

      console.log('[DEBUG] handlerOpenFile 打开文件:', filePath);
      // 标记文件为打开状态
      if (window.electronAPI) {
        try {
          console.log('[DEBUG] handlerOpenFile 打开文件:', filePath);
          await window.electronAPI.markFileOpen(filePath);
        } catch (error) {
          console.error('标记文件打开状态失败:', error);
        }
      }

      setActiveFileForProject(projectId, filePath); // ✅ 激活新文件
      addOpenFileForProject(projectId, {
        path: filePath,
        projectRootPath: projectRootPath,
        // content: "",
      });

      // if (fileType === "image") {
      //     // 如果是图片类型，直接添加到 openFiles 中
      //     addOpenFileForProject(projectId, {
      //       path: filePath,
      //       // content: "",
      //     });
      //     setActiveFileForProject(projectId, filePath); // ✅ 激活新文件
      //     return;
      // }

      // window.electronAPI.readFile(filePath).then(({ success, content }) => {
      //   if (!success) {
      //     console.error("读取文件失败！");
      //     return;
      //   }
        
      //   setActiveFileForProject(projectId, filePath); // ✅ 激活新文件
      //   if (fileType === "markdown") {
      //     addOpenFileForProject(projectId, {
      //       path: filePath,
      //       // content,
      //       // markdown: content,
      //       // content: null
      //     });
      //   } else{
      //     addOpenFileForProject(projectId, {
      //       path: filePath,
      //       // content,
      //       // content: "", // 懒加载数据
      //     });
      //   }
      // });
  };

  return (
    <div className="flex-1 left-panel p-2 space-y-2 text-sm h-full overflow-y-auto overflow-x-auto whitespace-nowrap">
      <div className="w-max">
      <FileTree
        projectId={projectId}
        folderPath={projectRootPath}
        folderTree={folderTree}
        onFileClick={handlerOpenFile}
        activeFilePath={projectActiveFilePath || ""}
      />
      </div>
    </div>
  );
}

export default WorkSpaceTreePanel;
