import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  export default function DeleteDialog({
    open,
    onClose,
    onConfirm,
    name,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    name: string;
  }) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              <div>确定要删除「{name}」吗？此操作不可恢复。</div>
            </DialogDescription>
          </DialogHeader>
          {/* <div>确定要删除「{name}」吗？此操作不可恢复。</div> */}
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }