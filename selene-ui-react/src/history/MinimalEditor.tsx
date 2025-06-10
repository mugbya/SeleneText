import { useEffect, useRef } from "react";

export default function MinimalEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     // 强制聚焦 textarea
//     textareaRef.current?.focus();
//   }, []);
//   useEffect(() => {
//     setTimeout(() => {
//       textareaRef.current?.focus(); // 确保窗口已激活后再聚焦
//     }, 200); // 延迟一点点
//   }, []);

//   useEffect(() => {
//     window.addEventListener("keydown", (e) => {
//       console.log("keydown", e.key, "ctrl:", e.ctrlKey, "meta:", e.metaKey);
//     });
//   }, []);
useEffect(() => {
    const handler = (e: KeyboardEvent) => {
        console.log("keydown", e.key, "ctrl:", e.ctrlKey, "meta:", e.metaKey);
      const isMac = navigator.platform.includes("Mac");
      const isSelectAll =
        (isMac && e.metaKey && e.key === "a") ||
        (!isMac && e.ctrlKey && e.key === "a");
        
        console.log("isSelectAll", isSelectAll);
      if (isSelectAll) {
        const active = document.activeElement as HTMLElement;
        
        console.log("active", active);

        if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
          // ✅ 允许默认行为
          return;
        }
  
        // ❌ 没有聚焦 input/textarea，阻止默认并手动触发
        e.preventDefault();
  
        const textarea = document.querySelector("textarea");
        if (textarea instanceof HTMLTextAreaElement) {
          textarea.focus();
          textarea.select(); // ✅ 手动全选
        }
      }
    };
  
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <textarea
      ref={textareaRef}
      defaultValue="测试 Ctrl+A 是否能选中全部内容"
      className="w-full h-[200px] border p-2"
    />
  );
}