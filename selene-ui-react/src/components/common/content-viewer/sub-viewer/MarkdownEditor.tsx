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

interface CrepeEditorProps {
  mode: "wysiwyg" | "source";
  value: string;
  onChange: (val: string) => void;
}

export interface CrepeEditorHandle {
  replaceContent: (content: string) => void;
}

export const CrepeEditor = forwardRef<CrepeEditorHandle, CrepeEditorProps>(
  ({ value, onChange }, ref) => {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);
    const [ready, setReady] = useState(false);

    const {
      projects,
      activeProjectId,
      setMarkdownForFile,
    } = useProjectsStore();
    const currentProject = projects[activeProjectId!];
    const currentFile = currentProject?.openFiles.find(
      (f) => f.path === currentProject.lastActiveFile
    );
    if (!currentFile) return null;

    useEffect(() => {
      const root = editorContainerRef.current;
      if (!root) return;

      const crepe = new Crepe({ root });

      crepe.editor
        .use(listener)
        .use(cursor)
        .use(block)
        .config((ctx) => {
          ctx.set(blockConfig.key, {
            filterNodes: () => true,
          });
          ctx.get(listenerCtx).markdownUpdated((_, md) => {
            console.log("[CrepeEditor] markdownUpdated: ", md);
            setMarkdownForFile(activeProjectId, currentFile.path, md);
            onChange(md);
          });
        })
        .create()
        .then(() => {
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
  mode,
  value,
  onChange,
}) => {
  const { crepeRef } = useMarkdownStore(value);

  const { projects, activeProjectId, setMarkdownForFile } = useProjectsStore();
  const currentProject = projects[activeProjectId!];
  const currentFile = currentProject?.openFiles.find(
    (f) => f.path === currentProject.lastActiveFile
  );
  if (!currentFile) return null;

  const markdown = currentFile?.markdown ?? currentFile?.content ?? "";

  return (
    <MilkdownProvider>
      <div className="pl-10 items-center"></div>

      {mode === "wysiwyg" ? (
        <CrepeEditor
          mode={mode}
          value={value}
          onChange={onChange}
          ref={crepeRef}
        />
      ) : (
        <textarea
          value={markdown}
          onChange={(e) => {

            // 保存markdown
            setMarkdownForFile(
              activeProjectId,
              currentFile.path,
              e.target.value
            ); 
            // 调用文件保存函数 保存centent
            onChange(e.target.value); 
          }}
          className="w-full h-full resize-none font-mono text-sm text-left pl-5 pt-5 rounded-[var(--radius)]"
        />
      )}
    </MilkdownProvider>
  );
};
