import mermaid from 'mermaid';
import { $node, $view, $remark } from '@milkdown/utils';
import type { Node as PMNode } from '@milkdown/prose/model';
import type { NodeView } from '@milkdown/prose/view';
import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';
// import type { Ctx } from '@milkdown/core';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'default',
  themeCSS: '',       // 禁止 Mermaid 自动插入 CSS
});

/** remark 预处理：把 ```mermaid``` 变成 { type: 'mermaid', value: string } */
// 定义一个 remark 插件
// remark 插件：接收 AST (tree)，修改节点
export const remarkMermaid = $remark(
  'remark-mermaid', // ✅ id 必须有
  (_ctx: unknown) => {
    // 返回一个 remark 插件
    return () => (tree: Root) => {
      visit(tree, 'code', (node: Code, index, parent) => {
        if (!parent || index == null) return;
        if (String(node.lang || '').toLowerCase() === 'mermaid') {
          parent.children[index] = {
            type: 'mermaid',
            value: node.value ?? '',
          } as any;
        }
      });
    };
  }
);


/** schema：叶子块节点，代码存在 attrs.value 里 */
export const mermaidNode = $node('mermaid', () => ({
  group: 'block',
  atom: true,
  selectable: true,
  attrs: { value: { default: '' } },
  parseDOM: [
    {
      tag: 'div.mermaid',
      getAttrs: (dom) => {
        const el = dom as HTMLElement;
        return { value: el.dataset.value ?? el.textContent ?? '' };
      },
    },
  ],
  toDOM: (node) => ['div', { class: 'mermaid', 'data-value': node.attrs.value }, node.attrs.value],

  // markdown -> doc
  parseMarkdown: {
    match: (node) => (node as any).type === 'mermaid',
    runner: (state, node, type) => {
      state.addNode(type, { value: (node as any).value ?? '' });
    },
  },

  // doc -> markdown
  toMarkdown: {
    match: (node) => node.type.name === 'mermaid',
    runner: (state, node) => {
      state.addNode('code', undefined, (node as any).attrs.value ?? '', { lang: 'mermaid' });
    },
  },
}));

/** node view：把 attrs.value 用 mermaid 渲染成 SVG */
// export const mermaidView = $view(mermaidNode, () => {
//   return (node: PMNode): NodeView => {
//     const dom = document.createElement('div');
//     dom.className = 'mermaid-node';

//     let last = (node as any).attrs.value as string;

//     const render = async (code: string) => {
//       try {
//         const { svg } = await mermaid.render(
//           `merm-${Math.random().toString(36).slice(2)}`,
//           code ?? '',
//         );
//         dom.innerHTML = svg;
//       } catch (e) {
//         dom.innerHTML = `<pre class="mermaid-error">${(e as Error).message}</pre>`;
//       }
//     };

//     render(last);

//     return {
//       dom,
//       update(next) {
//         if (next.type !== node.type) return false;
//         const cur = (next as any).attrs.value as string;
//         if (cur !== last) {
//           last = cur;
//           render(cur);
//         }
//         return true;
//       },
//     };
//   };
// });

function sanitizeSvg(svg: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const styleTag = doc.createElementNS('http://www.w3.org/2000/svg', 'style');

    // 收集所有 style 属性
    const elements = doc.querySelectorAll('[style]');
    elements.forEach((el, index) => {
        const style = el.getAttribute('style');
        if (style) {
            const className = `csp-safe-${index}`;
            el.removeAttribute('style');
            el.classList.add(className);
            styleTag.textContent += `.${className} { ${style} }\n`;
        }
    });

    // 插入到 <svg>
    doc.documentElement.insertBefore(styleTag, doc.documentElement.firstChild);

    return new XMLSerializer().serializeToString(doc);
}

export const mermaidView = $view(mermaidNode, () => {
  return (node: PMNode): NodeView => {
    const dom = document.createElement('div');
    dom.className = 'mermaid-node';

    let last = (node as any).attrs.value as string;

    const render = async (code: string) => {
      try {
        const { svg } = await mermaid.render(
          `merm-${Math.random().toString(36).slice(2)}`,
          code ?? '',
        );

        // ✅ 在这里调用 sanitizeSvg，把内联 style 迁移到 <style>
        const safeSvg = sanitizeSvg(svg);

        // 转成 DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(safeSvg, 'image/svg+xml');
        const svgEl = doc.documentElement;

        dom.innerHTML = '';
        dom.appendChild(svgEl);
      } catch (e) {
        dom.innerHTML = `<pre class="mermaid-error">${(e as Error).message}</pre>`;
      }
    };

    render(last);

    return {
      dom,
      update(next) {
        if (next.type !== node.type) return false;
        const cur = (next as any).attrs.value as string;
        if (cur !== last) {
          last = cur;
          render(cur);
        }
        return true;
      },
    };
  };
});

// 统一导出，供 .use(...)
export const mermaidRemarkPlugin = remarkMermaid;
export const mermaidNodePlugin   = mermaidNode;
export const mermaidViewPlugin   = mermaidView;