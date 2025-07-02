import { WorkspaceTreeProps } from "@/types";
import FileTree from "@/components/common/file-tree/FileTree";
import { useRef } from "react";
import { useProjectsStore } from "@/store/useProjectStore";
import { getFileType } from "@/utils/fileUtil";

function WorkSpaceTreePanel({
  projectId,
  activeFilePath,
  rootPath,
  folderTree,
}: WorkspaceTreeProps) {

  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("[WorkSpaceTreePanel] 渲染次数:", renderCount.current);

  if (!projectId || !folderTree) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        加载中...
      </div>
    );
  }

  const handlerOpenFile = (projectId: string, filePath: string) => {
    // console.log("读取文件内容：", filePath);
    const fileType = getFileType(filePath);
    if (fileType === "image"){
        // 如果是图片类型，直接添加到 openFiles 中
        useProjectsStore.getState().addOpenFileForProject(projectId, {
          path: filePath,
          content: "",
        });
        return
    }

    window.electronAPI.readFile(filePath).then(({ success, content }) => {
      if (!success) {
        console.error("读取文件失败！");
        return;
      }
      useProjectsStore.getState().addOpenFileForProject(projectId, {
        path: filePath,
        content: content,
      });
    });
  };

  return (
    <div className="flex-1 left-panel p-2 space-y-2 text-sm h-full overflow-y-auto overflow-x-auto whitespace-nowrap">
      <div className="w-max">
      <FileTree
        projectId={projectId}
        folderPath={rootPath}
        folderTree={folderTree}
        onFileClick={handlerOpenFile}
        activeFilePath={activeFilePath || ""}
      />
      </div>
    </div>
  );
}

export default WorkSpaceTreePanel;
