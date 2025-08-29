// components/file-tree/dialogs/MoveDialog.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileNode } from '@/types';
import { useProjectsStore } from '@/store/useProjectStore';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';

interface MoveDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (targetDir: string) => void;
  currentPath: string;
  isDir: boolean;
}

const MoveDialog = ({ open, onClose, onSelect, currentPath, isDir }: MoveDialogProps) => {
  const activeProject = useProjectsStore((state) => state.getActiveProject());
  const folderTree = activeProject?.folderTree;
  const [selectedDir, setSelectedDir] = useState<string>('');
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  
  // 初始化展开节点
  useEffect(() => {
    if (open && folderTree && folderTree.isDirectory) {
      setExpandedNodes([folderTree.path]);
    }
  }, [open, folderTree]);
  
  // 收集所有目录路径并过滤掉不允许移动到的目录
  const collectValidDirectories = (node: FileNode, pathList: string[] = []): string[] => {
    if (node.isDirectory) {
      // 过滤条件：
      // 1. 不能移动到自身
      // 2. 不能移动到自身的子目录
      const isValid = !(node.path === currentPath || 
                      (isDir && node.path.startsWith(currentPath)));
      
      if (isValid) {
        pathList.push(node.path);
      }
      
      if (node.children) {
        node.children.forEach(child => collectValidDirectories(child, pathList));
      }
    }
    return pathList;
  };
  
  const validDirectories = folderTree ? collectValidDirectories(folderTree) : [];
  
  // 递归渲染目录树
  const renderCustomTree = (node: FileNode, level = 0) => {
    if (!node.isDirectory) return null;
    
    // 检查是否是有效的目标目录
    const isValidTarget = validDirectories.includes(node.path);
    
    return (
      <div key={node.path} className="w-full">
        <div 
          className={`flex items-center gap-1 p-1.5 cursor-pointer rounded ${selectedDir === node.path ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={(e) => {
            e.stopPropagation();
            if (isValidTarget) {
              setSelectedDir(node.path);
            }
          }}
        >
          <FolderOpen className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <span className="truncate">{node.name}</span>
        </div>
        {node.children && (
          <div className="mt-1">
            {node.children.map(child => renderCustomTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  const handleConfirm = () => {
    if (selectedDir) {
      onSelect(selectedDir);
      onClose();
    }
  };
  
  const handleCancel = () => {
    onClose();
  };
  
  if (!folderTree) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>移动 {isDir ? '文件夹' : '文件'}</DialogTitle>
          <DialogDescription>
            选择目标目录来移动 "{currentPath.split('/').pop()}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {validDirectories.length > 0 ? (
            <div className="h-[300px] overflow-y-auto border rounded-md p-2">
              {renderCustomTree(folderTree)}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              没有可用的目标目录
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedDir}>
            移动到此处
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDialog;