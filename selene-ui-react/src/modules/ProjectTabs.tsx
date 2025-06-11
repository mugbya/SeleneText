import { X } from "lucide-react";
import clsx from "clsx";
import { ProjectTab } from "@/types";
import { cn } from "@/lib/utils";


export default function ProjectTabs({
  projects,
  activeProjectId,
  onSwitch,
  onClose,
}: {
  projects: ProjectTab[];
  activeProjectId: string;
  onSwitch: (id: string) => void;
  onClose: (id: string) => void;
}) {

    // 如果没有项目，就不显示标签栏
    if (projects.length <= 1) {
      return null;
    }

  return (
    // <div className="flex items-center h-9 bg-muted border-b border-border px-2 space-x-2 space-y-4">
    //   {projects.map((project) => (
    //     <button
    //       key={project.id}
    //       className={clsx(
    //         "flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors",
    //         activeProjectId === project.id
    //           ? "bg-accent text-accent-foreground"
    //           : "hover:bg-accent hover:text-accent-foreground"
    //       )}
    //       onClick={() => onSwitch(project.id)}
    //     >
    //       <span className="truncate max-w-[150px]">{project.name}</span>
    //       <X
    //         className="w-4 h-4 ml-2 text-muted-foreground hover:text-red-500"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           onClose(project.id);
    //         }}
    //       />
    //     </button>
    //   ))}
    // </div>

    // <div className="flex items-center h-9 bg-muted border-b border-border px-2 space-x-2">
    //   {projects.map((project) => (
    //     <button
    //       key={project.id}
    //       className={clsx(
    //         "flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors",
    //         activeProjectId === project.id
    //           ? "bg-accent text-accent-foreground"
    //           : "hover:bg-accent hover:text-accent-foreground"
    //       )}
    //       onClick={() => onSwitch(project.id)}
    //     >
    //       <span className="truncate max-w-[150px]">{project.name}</span>
    //       <X
    //         className="w-4 h-4 ml-2 text-muted-foreground hover:text-red-500"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           // 如果只有一个项目，防止关闭
    //           if (projects.length > 1) {
    //             onClose(project.id);
    //           } else {
    //             // 可选：显示提示信息
    //             console.log("Cannot close the only project tab");
    //           }
    //         }}
    //       />
    //     </button>
    //   ))}
    // </div>

    <div className="flex border-b border-zinc-300 bg-zinc-50 px-2 py-1 space-x-1">
  {projects.map((project) => (
    <div
      key={project.id}
      onClick={() => onSwitch(project.id)}
      className={cn(
        "flex items-center px-4 h-8 rounded-t-lg text-sm cursor-pointer",
        activeProjectId === project.id
          ? "bg-white text-black border border-b-transparent shadow-sm"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
      )}
    >
      <span className="truncate max-w-[120px]">{project.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose(project.id);
        }}
        className="ml-2 text-xs text-zinc-400 hover:text-red-500"
      >
        ✕
      </button>
    </div>
  ))}

</div>
  );
}