// components/FileTree.tsx
import { useState } from "react";
import { File, Folder, FolderOpen, Plus, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FileNode } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // ✅ 用于提示
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
          //   onNewFile={onNewFile}
          //   onNewFolder={onNewFolder}
        />
      ))}
    </ul>
  );
}

function TreeNode({
  node,
  onFileClick,
  selectedPath,
}: {
  node: FileNode;
  onFileClick: (filePath: string) => void;
  selectedPath?: string;
}) {
  const [newType, setNewType] = useState<"file" | "folder">("file");
  const [expanded, setExpanded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const isDir = node.isDirectory;

  const handleToggle = () => {
    if (isDir) setExpanded((prev) => !prev);
    else onFileClick(node.path);
  };

  const handleCreate = async () => {
    const trimmed = newFileName.trim();
    if (!trimmed) {
      toast.warning("名称不能为空");
      return;
    }

    const exists = node.children?.some((child) => child.name === trimmed);
    if (exists) {
      toast.error("已存在同名项");
      return;
    }

    const res =
      newType === "file"
        ? await window.electronAPI.createFile(node.path, trimmed)
        : await window.electronAPI.createFolder(node.path, trimmed);

    if (res?.success) {
      toast.success(`${newType === "file" ? "文件" : "文件夹"}创建成功`);
      window.electronAPI.send("refresh-folder", node.path);
      setShowDialog(false);
      setNewFileName("");
    } else {
      toast.error("创建失败");
    }
  };

  // const handleCreateFile = async () => {
  //   const trimmed = newFileName.trim();
  //   if (!trimmed) {
  //     toast.warning("文件名不能为空");
  //     return;
  //   }

  //   const exists = node.children?.some(child => child.name === trimmed);
  //   if (exists) {
  //     toast.error("该目录下已有同名文件");
  //     return;
  //   }

  //   const res = await window.electronAPI.createFile(node.path, trimmed);
  //   if (res.success) {
  //     toast.success("文件创建成功");
  //     window.electronAPI.send("refresh-folder", node.path);
  //     setShowDialog(false);
  //     setNewFileName("");
  //   } else {
  //     toast.error("文件创建失败");
  //   }
  // };

  const isSelected = node.path === selectedPath;

  return (
    <li>
      {/* <div
          onClick={handleToggle}
          onDoubleClick={() => {
            if (isDir) setShowDialog(true); // ✅ 双击直接弹出创建弹窗
          }}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
            isSelected && "bg-zinc-200 dark:bg-zinc-700 font-semibold"
          )}
          title={node.path}
        >
          {isDir ? (
            expanded ? <FolderOpen className="w-4 h-4 text-yellow-500" /> : <Folder className="w-4 h-4 text-yellow-500" />
          ) : (
            <File className="w-4 h-4 text-zinc-500" />
          )}
          <span className="truncate">{node.name}</span>
          {isDir && (
            <Plus
              className="w-4 h-4 text-muted-foreground ml-auto hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setShowDialog(true);
              }}
            />
          )}
        </div> */}
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            onClick={handleToggle}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer",
              "hover:bg-zinc-100 dark:hover:bg-zinc-800",
              isSelected && "bg-zinc-200 dark:bg-zinc-700 font-semibold"
            )}
            title={node.path}
          >
            {isDir ? (
              expanded ? (
                <FolderOpen className="w-4 h-4 text-yellow-500" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-500" />
              )
            ) : (
              <File className="w-4 h-4 text-zinc-500" />
            )}
            <span className="truncate">{node.name}</span>
          </div>
        </ContextMenuTrigger>

        {isDir && (
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => {
                setNewType("file");
                setShowDialog(true);
              }}
            >
              新建文件
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                setNewType("folder");
                setShowDialog(true);
              }}
            >
              新建文件夹
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>

      {/* 子目录 */}
      {isDir && expanded && node.children && (
        <ul className="pl-4 border-l border-zinc-300 dark:border-zinc-700 ml-1">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              onFileClick={onFileClick}
              selectedPath={selectedPath}
            />
          ))}
        </ul>
      )}

      {/* 新建文件弹窗 */}
      {/* <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建文件</DialogTitle>
            </DialogHeader>
            <Input
              autoFocus
              placeholder="请输入文件名，如 example.txt"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                取消
              </Button>
              <Button onClick={handleCreateFile}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建</DialogTitle>
          </DialogHeader>

          {/* <RadioGroup
            value={newType}
            onValueChange={(val) => setNewType(val as "file" | "folder")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="file" id="file" />
              <label htmlFor="file">文件</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="folder" id="folder" />
              <label htmlFor="folder">文件夹</label>
            </div>
          </RadioGroup> */}

          <Input
            autoFocus
            placeholder={`请输入${newType === "file" ? "文件" : "文件夹"}名称`}
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreate}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
