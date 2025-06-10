import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * 新建文件/文件夹弹窗
 *  逻辑外提、UI内聚
 * @param param
 * @returns 
 */
export default function CreateDialog({
    open,
    type,
    value,
    onChange,
    onClose,
    onConfirm,
  }: {
    open: boolean;
    type: "file" | "folder";
    value: string;
    onChange: (v: string) => void;
    onClose: () => void;
    onConfirm: () => void;
  }) {
    return (
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建{type === "file" ? "文件" : "文件夹"}</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder={`请输入${type === "file" ? "文件" : "文件夹"}名称`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={onConfirm}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
