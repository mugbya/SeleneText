// import { X } from "lucide-react";
// import clsx from "clsx";
import { ProjectTab } from "@/types";
import { cn } from "@/lib/utils";

export default function ProjectTabs({
  projects,
  activeProjectId,
  onSwitch,
  onClose,
}: {
  projects: Record<string, ProjectTab>;
  activeProjectId: string;
  onSwitch: (id: string) => void;
  onClose: (id: string) => void;
}) {
  // 如果不超过2个项目，就不显示标签栏
  // console.log("[ProjectTabs] 当前项目数量：%s", projects.length);
  // if (projects.length <= 1) {
  //   return null;
  // }
  return (
    // <div className="flex border-b border-zinc-300 bg-zinc-50 px-2 py-1 space-x-1">
    //   {Object.values(projects).map((project) => (
    //     <div
    //       key={project.id}
    //       onClick={() => onSwitch(project.id)}
    //       className={cn(
    //         "flex items-center px-4 h-8 rounded-t-lg text-sm cursor-pointer",
    //         activeProjectId === project.id
    //           ? "bg-white text-black border border-b-transparent shadow-sm"
    //           : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
    //       )}
    //     >
    //       <span className="truncate max-w-[120px]">{project.name}</span>
    //       <button
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           onClose(project.id);
    //         }}
    //         className="ml-2 text-xs text-zinc-400 hover:text-red-500"
    //       >
    //         ✕
    //       </button>
    //     </div>
    //   ))}
    // </div>
<div className="flex border-b border-zinc-300 bg-zinc-50 px-2 py-1 space-x-1">
  {Object.values(projects).map((project) => (
    <div
      key={project.id}
      onClick={() => onSwitch(project.id)}
      className={cn(
        "flex items-center h-8 rounded-t-lg text-sm cursor-pointer px-2", // 缩小内边距
        activeProjectId === project.id
          ? "bg-white text-black border border-b-transparent shadow-sm"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      )}
    >
      <div className="flex items-center justify-between w-full space-x-2 max-w-[160px]">
        <span className="truncate">{project.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose(project.id);
          }}
          className="text-xs text-zinc-400 hover:text-red-500 "
          style={{ padding: 2 }}
        >
          ✕
        </button>
      </div>
    </div>
  ))}
</div>
  );
}
