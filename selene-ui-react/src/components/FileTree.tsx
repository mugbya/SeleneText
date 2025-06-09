// components/FileTree.tsx
import { useState } from "react";
import {
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileNode } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

export default function FileTree({
  nodes,
  onFileClick,
  selectedPath,
}: {
  nodes: FileNode[];
  onFileClick: (filePath: string) => void;
  selectedPath?: string;
}) {
  return (
    <ul className="pl-2 text-sm space-y-1">
      {nodes.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          onFileClick={onFileClick}
          selectedPath={selectedPath}
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
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const isSelected = node.path === selectedPath;

  return (
    <li>
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

        <ContextMenuContent>
          {isDir && (
            <>
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
            </>
          )}
          <ContextMenuItem onClick={() => {
            setRenameValue(node.name);
            setRenameDialogOpen(true);
          }}>
            重命名
          </ContextMenuItem>
          <ContextMenuItem
            className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900"
            onClick={() => setConfirmDelete(true)}
          >
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

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

      {/* 新建文件/文件夹弹窗 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建</DialogTitle>
          </DialogHeader>
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

      {/* 重命名弹窗 */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重命名</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              取消
            </Button>

            <Button onClick={async () => {
              const trimmed = renameValue.trim();
              if (!trimmed || trimmed === node.name) {
                toast.warning("请输入有效名称");
                return;
              }
              const res = await window.electronAPI.renamePath(node.path, trimmed);
            //   const res = await window.electronAPI.renamePath(oldPath, newName, folders.map(f => f.basePath));;
              if (res.success) {
                toast.success("重命名成功, 触发..");
                // 🚨 不再触发 refresh-folder，改由后端主动发 replace-folder(s)
                // window.electronAPI.send("refresh-folder", node.path.substring(0, node.path.lastIndexOf("/")));
              } else {
                toast.error("重命名失败");
              }
              setRenameDialogOpen(false);
            }}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div>确定要删除「{node.name}」吗？此操作不可恢复。</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={async () => {
              const res = await window.electronAPI.deletePath(node.path);
              if (res.success) {
                toast.success("已删除");
                window.electronAPI.send("refresh-folder", node.path.substring(0, node.path.lastIndexOf("/")));
              } else {
                toast.error("删除失败");
              }
              setConfirmDelete(false);
            }}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
