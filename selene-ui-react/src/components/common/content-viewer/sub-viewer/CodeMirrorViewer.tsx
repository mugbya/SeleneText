import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import React, { useRef, useEffect, useState } from 'react';

/**
 * CodeMirror 组件
 *  里面增加的逻辑是解决：
 *    我打了字：每次保存时写临时文件，然后刚打完，然后变成每次保存时写临时we，然后光标还移动到第一行行首。 
 *    补充，这个问题只有在 CodeMirrorViewer 才会出现， MilkdownEditorWrapper 组件目前还没出现该问题
 *  
 * 问题原因：
 *  - 1.内容重置循环 ：当父组件重新渲染时，CodeMirror组件会接收到新的 code 属性，导致编辑器状态重置
 *  - 2.光标位置丢失 ：每次内容更新都会重置光标到行首
 * 
 * ## 修复方案
    ### 1. 引入内部状态管理
    - 使用 useState 创建 internalValue 状态来管理编辑器内容
    - 避免直接使用外部传入的 code 属性，防止不必要的内容重置
    ### 2. 智能内容同步
    - 使用 isUserTypingRef 标记用户输入状态
    - 只有在用户没有输入时才同步外部内容变化
    - 用户输入时立即更新内部状态并通知父组件
    ### 3. 光标位置保护
    - 通过内部状态管理，确保用户输入时光标位置不会丢失
    - 短暂延迟后重置用户输入状态，避免误判
    ## 修复后的工作流程
    1. 1.
      用户输入 → CodeMirror检测变化 → 标记为用户输入 → 更新内部状态 → 通知父组件
    2. 2.
      外部内容变化 → 检查用户是否在输入 → 如果没有输入则同步内容 → 保持光标位置
 * 
 * @param param0 
 * @returns 
 */
export default function CodeMirrorViewer({
                                           code,
                                           language,
                                           editable,
                                           onChange,
                                         }: {
  code: string;
  language: string;
  editable: boolean;
  onChange: (newCode: string) => void;
}) {
  const extensions = language === 'javascript' ? [javascript()] : [];
  const [internalValue, setInternalValue] = useState<string>(code);
  const lastCodeRef = useRef<string>(code);
  const isUserTypingRef = useRef<boolean>(false);
  
  // 同步外部内容变化，但避免在用户输入时重置
  useEffect(() => {
    if (!isUserTypingRef.current && code !== lastCodeRef.current) {
      setInternalValue(code);
      lastCodeRef.current = code;
    }
  }, [code]);

  const handleChange = (value: string) => {
    isUserTypingRef.current = true;
    setInternalValue(value);
    onChange(value);
    
    // 短暂延迟后重置用户输入状态
    setTimeout(() => {
      isUserTypingRef.current = false;
    }, 100);
  };

  return (
      <CodeMirror
          className="text-left"  // Tailwind 用户
          value={internalValue}
          height="100%"
          basicSetup={true}
          editable={editable}
          extensions={extensions}
          onChange={handleChange}
      />
  );
}