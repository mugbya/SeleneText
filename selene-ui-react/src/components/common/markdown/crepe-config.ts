import { Crepe } from '@milkdown/crepe';
import { codeBlockConfig } from '@milkdown/kit/component/code-block';

// 扩展 Crepe 代码块语言选项，添加 mermaid 支持
export const configureCrepe = (crepe: Crepe): Crepe => {
  // 通过 Milkdown 编辑器实例配置代码块语言选项
  crepe.editor.config((ctx) => {
    // 获取当前的代码块配置
    const config = ctx.get(codeBlockConfig.key);
    
    // 检查 mermaid 是否已经在语言列表中
    const languages = config.languages || [];
    const hasMermaid = languages.some((lang: string | { name: string }) => 
      typeof lang === 'string' 
        ? lang === 'mermaid' 
        : lang.name === 'mermaid'
    );
    
    // 如果 mermaid 不在列表中，添加它
    if (!hasMermaid) {
      // 更新代码块配置，添加 mermaid 语言选项
      ctx.update(codeBlockConfig.key, (prev) => ({
        ...prev,
        languages: [
          ...languages,
          {
            name: 'mermaid',
            alias: ['mermaid-diagram'],
            display: 'Mermaid'
          }
        ]
      }));
      
      console.log('Mermaid language added to code block options');
    }
  });
  
  return crepe;
};