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

    return (
      <div
        ref={editorContainerRef}
        className="milkdown-editor-root"
        // style={{ minHeight: 400, border: "1px solid #ccc", padding: 8 }}
      />
    );
  }
);

export const MilkdownEditorWrapper: React.FC<CrepeEditorProps> = ({
  mode,
  value,
  onChange,
}) => {
  // 切换模式状态
  // const [mode, setMode] = useState<"wysiwyg" | "source">("wysiwyg");
  // // 编辑器实例引用，方便外部调用同步方法
  // const crepeRef = useRef<CrepeEditorHandle>(null);
  // // Markdown 源码字符串（作为数据源）
  // const [markdown, setMarkdown] = useState(value);

  // // 切换到源码模式时，不需要额外操作（内容已实时同步）
  // const switchToSource = () => {
  //   setMode("source");
  // };

  // const switchToWysiwyg = async () => {
  //   if (crepeRef.current) {
  //     await crepeRef.current.replaceContent(markdown);
  //   }
  //   setMode("wysiwyg");
  // };
  const {markdown, setMarkdown, crepeRef} = useMarkdownStore(value);
  return (
    <MilkdownProvider>
      <div className="pl-10 items-center">
      {/* <button
        onClick={() => {
          if (mode === "wysiwyg") switchToSource();
          else switchToWysiwyg();
        }}
      >
        切换到 {mode === "wysiwyg" ? "源码" : "即时"} 模式
      </button> */}
      </div>

      {mode === "wysiwyg" ? (
        <CrepeEditor mode={mode} value={value} onChange={onChange} ref={crepeRef} />
      ) : (
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-full resize-none font-mono text-sm text-left pl-5 pt-5 rounded-[var(--radius)]"
          // style={{ width: "100%", height: 400, fontFamily: "monospace" }}
        />
      )}
    </MilkdownProvider>
  );
};
