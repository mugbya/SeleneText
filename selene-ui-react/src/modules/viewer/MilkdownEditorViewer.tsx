import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import React, { useEffect, useRef } from "react";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { replaceAll } from "@milkdown/kit/utils";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

interface CrepeEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const CrepeEditor: React.FC<CrepeEditorProps> = ({
  value,
  onChange,
}) => {
  const crepeRef = useRef<Crepe | null>(null);

  useEditor(
    (root) => {
      const crepe = new Crepe({ root });

    crepe.editor
      .use(listener)
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((_, md) => {
          // ✅ 只向上暴露编辑结果，不写入回去
          console.log("markdownUpdated", md);
          onChange(md);
        });
      })
      .create()
      .then(() => {
        // ✅ 仅首次注入初始值，避免之后被父组件 override
        crepe.editor.action(replaceAll(value));
      });


      crepeRef.current = crepe;
      return crepe;
    },
    [] // 👈 不依赖 value，避免 replaceAll 造成覆盖
    // [value] // ⚠️ 添加 value 做依赖，防止反复创建
  ); 

  return <Milkdown />;
};

// export const MilkdownEditorWrapper: React.FC = () => {
export const MilkdownEditorWrapper: React.FC<CrepeEditorProps> = ({
  value,
  onChange,
}) => {
  return (
    <MilkdownProvider>
      <CrepeEditor value={value} onChange={onChange} />
    </MilkdownProvider>
  );
};
