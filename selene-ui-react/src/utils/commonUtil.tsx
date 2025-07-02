import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";


export function smartToast(
  message: string,
  type: ToastType = "info",
  duration = 30000
) {
  const isLong = message.length > 200;
  const content = (
    <div
      className={
        isLong
          ? "max-w-[1000px] overflow-hidden whitespace-nowrap text-ellipsis"
          : "max-w-[1000px]"
      }
      title={message}
    >
      {message}
    </div>
  );

  toast[type](content, {
    duration,
    dismissible: true,
    closeButton: true // 显示关闭按钮
  });
}
