// src/components/common/MermaidPreview.tsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { marked } from 'marked';

mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'default',
});

const renderer = {
    code(code: string, lang?: string) {
        if (lang === 'mermaid') {
            return `<div class="mermaid">${code}</div>`;
        }
        return `<pre><code>${code}</code></pre>`;
    }
} as any;

marked.use({ renderer });

interface MermaidPreviewProps {
    markdown: string;
}

export default function MermaidPreview({ markdown }: MermaidPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderMarkdown = async () => {
            if (!containerRef.current) return;
            
            const html = await marked.parse(markdown);
            containerRef.current.innerHTML = html;
            
            // 渲染所有 Mermaid 图表
            const mermaidElements = containerRef.current.querySelectorAll('.mermaid');
            if (mermaidElements.length > 0) {
                try {
                    // mermaid.init(undefined, mermaidElements);
                    // 将元素转换为 HTMLElement 数组
                    const htmlElements = Array.from(mermaidElements) as HTMLElement[];

                    // 使用 run 替代 init
                    mermaid.run({
                        querySelector: '.mermaid',
                        nodes: htmlElements,
                    });
                } catch (error) {
                    console.error("Mermaid rendering error:", error);
                }
            }
        };

        renderMarkdown();
    }, [markdown]);

    return <div ref={containerRef} className="markdown-body" />;
}