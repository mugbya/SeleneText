import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import React, { useRef } from "react";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { replaceAll } from "@milkdown/kit/utils";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

interface CrepeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const CrepeEditor: React.FC<CrepeEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
}) => {
  useEditor(
    (root) => {
      const crepe = new Crepe({ root });

      crepe.editor
        .use(listener)
        .config((ctx) => {
          // 内容变化
          ctx.get(listenerCtx).markdownUpdated((_, md) => {
            onChange(md);
          });

          // 强制绕过类型校验监听聚焦/失焦
          const lm = ctx.get(listenerCtx) as any;
          if (lm.focusChanged) {
            lm.focusChanged((ctx: any, isFocused: boolean) => {
              if (isFocused) onFocus?.();
              else onBlur?.();
            });
          }
        })
        .create()
        .then(() => {
          crepe.editor.action(replaceAll(value));
        });

      return crepe;
    },
    []
  );
  return <Milkdown />;
};

export const MilkdownEditorWrapper: React.FC<CrepeEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
}) => {
  return (
    <MilkdownProvider>
      <CrepeEditor value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
    </MilkdownProvider>
  );
};