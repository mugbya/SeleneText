import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { marked, Renderer } from "marked";

// ---- Mermaid 初始化 ----
mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "default",
});

// ---- 自定义渲染器（兼容 marked v12+） ----
const mermaidRenderer = {
  code({ text, lang }: { text: string; lang?: string }) {
    const l = (lang ?? "").trim().toLowerCase();
    if (l === "mermaid") {
      // Mermaid 代码块 -> 占位 div
      return `<div class="mermaid">${text}</div>`;
    }
    // 普通代码块直接返回 HTML
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre><code class="language-${l}">${escaped}</code></pre>`;
  },
} as const;

// 注册自定义 renderer
marked.use({ renderer: mermaidRenderer });

interface MermaidPreviewProps {
  markdown: string;
}

export default function MermaidPreview({ markdown }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!containerRef.current) return;

      // 兼容 marked v12 的 Promise 返回
      const html = (await marked.parse(markdown, { breaks: true })) as string;

      if (!containerRef.current || cancelled) return;
      containerRef.current.innerHTML = html;

      // 让 Mermaid 渲染所有占位
      //   mermaid.init(undefined, containerRef.current.querySelectorAll('.mermaid'));

      const mermaidElements = containerRef.current.querySelectorAll(".mermaid");
      if (mermaidElements.length > 0) {
        try {
          // 转换为 HTMLElement 数组
          const htmlElements = Array.from(mermaidElements) as HTMLElement[];

          mermaid.run({
            querySelector: ".mermaid",
            nodes: htmlElements,
          });
        } catch (error) {
          console.error("Mermaid rendering error:", error);
          mermaidElements.forEach((el) => {
            const errorDiv = document.createElement("div");
            errorDiv.className =
              "mermaid-error bg-red-50 text-red-700 p-4 rounded-lg";
            errorDiv.textContent = `Mermaid Error: ${(error as Error).message}`;
            el.parentNode?.replaceChild(errorDiv, el);
          });
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [markdown]);

  return <div ref={containerRef} className="markdown-body" />;
}
