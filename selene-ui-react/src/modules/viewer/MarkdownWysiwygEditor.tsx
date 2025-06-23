// // import React, { useEffect, useRef } from 'react'
// // import { Milkdown, useEditor } from '@milkdown/react'
// // import { commonmark } from '@milkdown/preset-commonmark'
// // import { nord } from '@milkdown/theme-nord'
// // import { getMarkdown } from '@milkdown/utils'
// // // import { commandsCtx } from "@milkdown/core"
// // import { commandsCtx } from '@milkdown/core'
// // import { replaceAll } from '@milkdown/plugin-history'
// // // import { replaceAll } from '@milkdown/commands'
// // import { Textarea } from '@/components/ui/textarea'


// // interface MarkdownEditorProps {
// //   mode: 'markdown' | 'wysiwyg'
// //   currentFile: { content: string }
// //   handleChange: (value: string) => void
// // }

// // // 用于避免无限循环
// // function usePrevious<T>(value: T) {
// //   const ref = useRef<T>()
// //   useEffect(() => {
// //     ref.current = value
// //   }, [value])
// //   return ref.current
// // }

// // const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ mode, currentFile, handleChange }) => {
// //   const { editor } = useEditor((root) => ({
// //     root,
// //     defaultValue: currentFile.content,
// //     editable: mode === 'wysiwyg',
// //     plugins: [commonmark, nord]
// //   }))

// //   const prevContent = usePrevious(currentFile.content)

// //   // 1. 代码模式切换到所见即所得时，将当前内容同步到编辑器
// //   useEffect(() => {
// //     if (mode === 'wysiwyg' && editor && prevContent !== currentFile.content) {
// //       editor.action((ctx) => {
// //         const commands = ctx.get(commandsCtx)
// //         commands.call(replaceAll(currentFile.content))
// //       })
// //     }
// //     // eslint-disable-next-line
// //   }, [mode, editor])

// //   // 2. 编辑器内容变化时，实时同步到 handleChange
// //   useEffect(() => {
// //     if (!editor) return
// //     return editor.onUpdate(() => {
// //       editor.action(getMarkdown()).then((md) => {
// //         if (md !== currentFile.content) {
// //           handleChange(md)
// //         }
// //       })
// //     })
// //     // eslint-disable-next-line
// //   }, [editor, currentFile.content])

// //   if (mode === "markdown") {
// //     return (
// //       <div className="w-full h-[70vh] resize-none font-mono text-sm">
// //         <Textarea
// //           value={currentFile.content}
// //           onChange={(e) => {
// //             handleChange(e.target.value)
// //           }}
// //         />
// //       </div>
// //     )
// //   }

// //   // 所见即所得
// //   return (
// //     <div className="w-full h-[70vh]">
// //       <Milkdown />
// //     </div>
// //   )
// // }

// // export default MarkdownEditor


// // components/MarkdownEditor.tsx
// import React, { useRef } from 'react';
// import { useEditor } from '@milkdown/react';
// import { Editor} from '@milkdown/core';
// import { commonmark } from '@milkdown/preset-commonmark';
// import { defaultValueCtx, editorViewCtx, rootCtx } from '@milkdown/core';
// import { listener, listenerCtx } from '@milkdown/plugin-listener';
// import type { Editor as MilkdownEditor } from '@milkdown/core';
// // import type { EditorView } from '@milkdown/prose/view';

// interface MarkdownEditorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
//     value,
//     onChange,
//   }) => {
//     const editor = useEditor((root) =>
//       Editor.make()
//         .config((ctx) => {
//           ctx.set(rootCtx, root);
//           ctx.set(defaultValueCtx, value);
//           ctx.get(listenerCtx).markdownUpdated((_, md) => {
//             onChange(md);
//           });
//         })
//         .use(commonmark)
//         .use(listener)
//         .create()
//     );
  
//     return <ReactEditor editor={editor} className="w-full h-full" />;
//   };
  

// export default MarkdownEditor;