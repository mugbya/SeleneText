import { useState } from "react";
import { File, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn 推荐的 class 合并函数

type FileNode = {
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileNode[];
};

export default function FileTree({ nodes }: { nodes: FileNode[] }) {
    return (
        <ul className="pl-2 text-sm space-y-1">
            {nodes.map((node) => (
                <TreeNode key={node.path} node={node} />
            ))}
        </ul>
    );
}

function TreeNode({ node }: { node: FileNode }) {
    const [expanded, setExpanded] = useState(false);
    const isDir = node.isDirectory;

    const handleToggle = () => {
        if (isDir) setExpanded((prev) => !prev);
    };

    return (
        <li>
            <div
                onClick={handleToggle}
                className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
                title={node.path}
            >
                {isDir ? (
                    expanded ? <FolderOpen className="w-4 h-4 text-yellow-500" /> : <Folder className="w-4 h-4 text-yellow-500" />
                ) : (
                    <File className="w-4 h-4 text-zinc-500" />
                )}
                <span className="truncate">{node.name}</span>
            </div>

            {isDir && expanded && node.children && (
                <ul className="pl-4 border-l border-zinc-300 dark:border-zinc-700 ml-1">
                    {node.children.map((child) => (
                        <TreeNode key={child.path} node={child} />
                    ))}
                </ul>
            )}
        </li>
    );
}