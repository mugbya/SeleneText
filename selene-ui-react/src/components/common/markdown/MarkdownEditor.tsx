import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider } from "@milkdown/react";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { replaceAll } from "@milkdown/kit/utils";
import { cursor } from "@milkdown/plugin-cursor";
import { block, blockConfig } from "@milkdown/plugin-block";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { useMarkdownStore } from "@/store/userMarkdownStore";
import { useProjectsStore } from "@/store/useProjectStore";
import CodeMirrorViewer from "@/components/common/content-viewer/sub-viewer/CodeMirrorViewer";
import { headingIdGenerator } from "@milkdown/preset-commonmark";
import { textToId } from "@/utils/stringUtil";
import { debounce } from "lodash";
import { normalizeForCompare } from "@/utils/stringUtil";
import {
  mermaidRemarkPlugin,
  mermaidNodePlugin,
  mermaidViewPlugin,
} from "@/components/plugin/milkdown-mermaid-plugin";
import { FileTab } from "@/types";

interface CrepeEditorProps {
  filePath: string;
  currentFile: FileTab;
  mode: "wysiwyg" | "source";
  value: string;
  onChange: (val: string) => void;
}

export interface CrepeEditorHandle {
  replaceContent: (content: string) => void;
}

export const CrepeEditor = forwardRef<CrepeEditorHandle, CrepeEditorProps>(
  ({ filePath, currentFile, value, onChange }, ref) => {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);
    const [ready, setReady] = useState(false);

    // const setMarkdownForFile = useProjectsStore((s) => s.setMarkdownForFile);
    // const activeProjectId = useProjectsStore((s) => s.activeProjectId);
    // if (!activeProjectId) return null;

    // const currentProject = useProjectsStore((s) => s.getActiveProject());
    // const currentFile = currentProject?.openFiles.find(
    //     (f) => f.path === currentProject.lastActiveFile
    // );
    if (!currentFile) return null;

    const handleMarkdownUpdate = debounce((md: string) => {
      console.log("[CrepeEditor] md: ", md);
      console.log("[CrepeEditor] origin value: ", value);
      // const currentMarkdown = currentFile?.markdown ?? '';
      if (normalizeForCompare(md) !== normalizeForCompare(value)) {
        console.log("[CrepeEditor] handleMarkdownUpdate");
        // setMarkdownForFile(activeProjectId, currentFile.path, md);
        onChange(md);
      }
    }, 300);

    useEffect(() => {

      const root = editorContainerRef.current;
      if (!root) return;

      const crepe = new Crepe({ root });

      crepe.editor
        // 先挂 remark，把 ```mermaid``` 改成自定义 mdast 节点
        .use(mermaidRemarkPlugin)
        // 再注册 schema & view
        .use(mermaidNodePlugin)
        .use(mermaidViewPlugin)

        .use(listener)
        .use(cursor)
        .use(block)
        .config((ctx) => {
          ctx.get(listenerCtx).markdownUpdated((_, md) => {
            // console.log("[CrepeEditor] markdownUpdated: ", md);
            handleMarkdownUpdate(md);
          });

          // 自定义标题 ID 生成器
          ctx.set(headingIdGenerator.key, (node) => {
            // console.log("[markdown] node", node);
            const text = (node as any).content?.content?.[0]?.text || ""; // 提取标题内容
            const level = (node as any).attrs?.level ?? 1;
            // console.log("[markdown] text: ", text, "level: ", level);
            const cleanId = textToId(text);
            return cleanId || `heading-${level}`;
          });
        })
        .create()
        .then(() => {
          // console.log("[CrepeEditor] create: ", value);
          crepe.editor.action(replaceAll(value));
          crepeRef.current = crepe;
          setReady(true);
        });

      return () => {
        crepeRef.current = null;
        setReady(false);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      replaceContent: (content: string) => {
        if (ready && crepeRef.current) {
          crepeRef.current.editor.action(replaceAll(content));
        }
      },
    }));

    return <div ref={editorContainerRef} className="milkdown-editor-root" />;
  }
);

export const MilkdownEditorWrapper: React.FC<CrepeEditorProps> = ({
  filePath,
  currentFile,
  mode,
  value,
  onChange,
}) => {
  // const { crepeRef } = useMarkdownStore(value);
  const { crepeRef } = useMarkdownStore();

//   const { projects, activeProjectId, setMarkdownForFile } = useProjectsStore();
//   const currentProject = projects[activeProjectId!];
  // const currentFile = currentProject?.openFiles.find(
  //     (f) => f.path === currentProject.lastActiveFile
  // );
  if (!currentFile) return null;

//   useEffect(() => {
//     if (!currentFile || filePath !== currentFile.path) {
//       // filePath 和 currentFile 不一致时，不做处理。 避免切换时不要渲染旧文件内容 !!!!!
//       return;
//     }
//     // console.log("[MilkdownEditorWrapper] filePath: ", filePath);
//     // console.log("[MilkdownEditorWrapper] currentFile: ", currentFile);
//     // console.log(`[MilkdownEditorWrapper] 切换到 ${filePath}, 内容:`, value);
//   }, [filePath, value]);

  if (!currentFile || filePath !== currentFile.path) {
      // filePath 和 currentFile 不一致时，不做处理。 避免切换时不要渲染旧文件内容 !!!!!
      return null;
  }   

  // const markdown = currentFile?.markdown ?? currentFile?.content ?? "";
//   console.log("[MilkdownEditorWrapper] value: ", value);

  return (
    <MilkdownProvider>
      <div className="pl-10 items-center"></div>

      {mode === "wysiwyg" ? (
        <CrepeEditor
          mode={mode}
          filePath={filePath}
          currentFile={currentFile}
          value={value}
          onChange={onChange}
          ref={crepeRef}
        />
      ) : (
        <CodeMirrorViewer
          code={value}
          language="markdown"
          editable={true}
          onChange={(content) => {
            // 保存markdown
            // setMarkdownForFile(
            //     activeProjectId,
            //     currentFile.path,
            //     content
            // );
            // 调用文件保存函数 保存centent
            onChange(content);
          }}
        />
        // <CodeViewer code={markdown} language="markdown" editable={true} />
      )}
    </MilkdownProvider>
  );
};
