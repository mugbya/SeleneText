import { useRef, useState } from 'react';

export interface CrepeEditorHandle {
    replaceContent: (content: string) => void;
}


export function useMarkdownStore(value: string) {
    // 切换模式状态
    const [mode, setMode] = useState<"wysiwyg" | "source">("wysiwyg");
    // 编辑器实例引用，方便外部调用同步方法
    const crepeRef = useRef<CrepeEditorHandle>(null);

    // Markdown 源码字符串（作为数据源）
    const [markdown, setMarkdown] = useState(value);

    // 切换到源码模式时，不需要额外操作（内容已实时同步）
    const switchToSource = () => {
        setMode("source");
    };

    const switchToWysiwyg = async () => {
        if (crepeRef.current) {
            await crepeRef.current.replaceContent(markdown);
        }
        setMode("wysiwyg");
    };

    return {
        mode,
        markdown,
        setMarkdown,
        switchToSource,
        switchToWysiwyg,
        crepeRef,
    };

}