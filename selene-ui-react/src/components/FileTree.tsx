// components/FileTree.tsx
import { useState } from "react";
import { File, Folder, FolderOpen, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FileNode } from "@/types";

export default function FileTree({
  nodes,
  onFileClick,
  selectedPath,
  onNewFile,
  onNewFolder,
}: {
  nodes: FileNode[];
  onFileClick: (filePath: string) => void;
  selectedPath?: string;
  onNewFile: (dirPath: string) => void;
  onNewFolder: (dirPath: string) => void;
}) {
  return (
    <ul className="pl-2 text-sm space-y-1">
      {nodes.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          onFileClick={onFileClick}
          selectedPath={selectedPath}
          onNewFile={onNewFile}
          onNewFolder={onNewFolder}
        />
      ))}
    </ul>
  );
}

function TreeNode({
  node,
  onFileClick,
  selectedPath,
  onNewFile,
  onNewFolder,
}: {
  node: FileNode;
  onFileClick: (filePath: string) => void;
  selectedPath?: string;
  onNewFile: (dirPath: string) => void;
  onNewFolder: (dirPath: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isDir = node.isDirectory;
  const isSelected = node.path === selectedPath;

  const handleToggle = () => {
    if (isDir) setExpanded((prev) => !prev);
    else onFileClick(node.path);
  };

  return (
    <li>
      <div
        className={cn(
          "flex items-center justify-between gap-1 px-2 py-1 rounded-md cursor-pointer",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800",
          isSelected && "bg-zinc-200 dark:bg-zinc-700 font-semibold"
        )}
        title={node.path}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          {isDir ? (
            expanded ? <FolderOpen className="w-4 h-4 text-yellow-500" /> : <Folder className="w-4 h-4 text-yellow-500" />
          ) : (
            <File className="w-4 h-4 text-zinc-500" />
          )}
          <span className="truncate">{node.name}</span>
        </div>

        {isDir && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical
                className="w-4 h-4 text-zinc-400 hover:text-zinc-600"
                onClick={(e) => {
                  e.stopPropagation(); // 不触发展开/关闭
                }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onNewFile(node.path)}>📄 新建文件</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNewFolder(node.path)}>📁 新建文件夹</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isDir && expanded && node.children && (
        <ul className="pl-4 border-l border-zinc-300 dark:border-zinc-700 ml-1">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              onFileClick={onFileClick}
              selectedPath={selectedPath}
              onNewFile={onNewFile}
              onNewFolder={onNewFolder}
            />
          ))}
        </ul>
      )}
    </li>
  );
}