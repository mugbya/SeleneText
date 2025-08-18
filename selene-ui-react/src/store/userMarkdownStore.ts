import { useEffect, useRef, useState } from 'react';
import { useProjectsStore } from './useProjectStore';

export interface CrepeEditorHandle {
    replaceContent: (content: string) => void;
}

export function useMarkdownStore(value: string) {
    // 切换模式状态
    const [mode, setMode] = useState<"wysiwyg" | "source">("wysiwyg");
    // 编辑器实例引用，方便外部调用同步方法
    const crepeRef = useRef<CrepeEditorHandle>(null);

    // Markdown 源码字符串（作为数据源）
    // const [markdown, setMarkdown] = useState(value);

    // // ✅ 每次外部 value 变化，更新 markdown 内部状态
    // useEffect(() => {
    //     setMarkdown(value);
    // }, [value]);

    // console.log("[useMarkdownStore] markdown", markdown)

    // 切换到源码模式时，不需要额外操作（内容已实时同步）
    const switchToSource = () => {
        setMode("source");
    };
    const getCurrentFileMarkdown = () => {
        const { activeProjectId, projects } = useProjectsStore.getState();
        if (!activeProjectId) return '';
        const project = projects[activeProjectId];
        const file = project.openFiles.find(f => f.path === project.lastActiveFile);
        return file?.markdown ?? file?.content ?? '';
    };

    const switchToWysiwyg = async () => {
        // const latestMarkdown = getCurrentFileMarkdown(); // 从 store 或 props 获取
        const latestMarkdown = value
        console.log("[switchToWysiwyg] latestMarkdown: ", latestMarkdown);
        if (crepeRef.current) {
            await crepeRef.current.replaceContent(latestMarkdown);
        }
        setMode("wysiwyg");
    };

    return {
        // mode,
        // markdown,
        // setMarkdown,
        switchToSource,
        switchToWysiwyg,
        crepeRef,
    };

}