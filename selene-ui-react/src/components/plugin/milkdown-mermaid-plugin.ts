// src/plugins/mermaid.ts
// import { $node, $view } from "@milkdown/utils";
import { $node, $view, $prose } from "@milkdown/utils";
// import type { Ctx } from "@milkdown/ctx";
import { Node } from "@milkdown/prose/model";
import { Plugin } from "@milkdown/prose/state";
import { NodeView } from "@milkdown/prose/view";
import mermaid from "mermaid";
import { MilkdownPlugin } from "@milkdown/kit/ctx";

// 初始化 Mermaid
mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "default",
});

export const mermaidNode = $node("mermaid", () => (console.log('[DEBUG] Mermaid node factory called'), {
    group: "block",
    code: true,
    attrs: {
        value: { default: "" },
    },
    parseDOM: [
        {
            tag: "div[class=mermaid]",
            getAttrs: (dom) => {
                if (dom instanceof HTMLElement) {
                    return { value: dom.textContent };
                }
                return {};
            },
        },
    ],
    toDOM: (node) => [
        "div",
        { class: "mermaid", "data-value": node.attrs.value },
        node.attrs.value,
    ],
    parseMarkdown: {
        match: (node) => node.type === "code" && node.lang === "mermaid",
        runner: (state, node, type) => {
            state.addNode(type, {
                value: node.value,
            });
        },
    },
    toMarkdown: {
        match: (node) => node.type.name === "mermaid",
        runner: (state, node) => {
            // 修正后的 addNode 调用
            state.addNode("code", undefined, node.attrs.value, {
                lang: "mermaid",
            });
        },
    },
}));

export const mermaidView = $view(mermaidNode, (ctx) => {
    console.log('[DEBUG] Mermaid view factory called');
    return (node: Node): NodeView => {
        const container = document.createElement("div");
        container.className = "mermaid-container relative";

        const renderMermaid = async (code: string) => {
            container.innerHTML = "";
            const pre = document.createElement("pre");
            pre.className = "mermaid bg-gray-100 p-4 rounded-lg";
            pre.textContent = code;
            container.appendChild(pre);

            try {
                const { svg } = await mermaid.render(
                    `mermaid-${Date.now()}`,
                    code
                );
                container.innerHTML = svg;
                console.log("[mermaidView] Mermaid SVG rendered successfully");
            } catch (error) {
                const errorDiv = document.createElement("div");
                errorDiv.className = "mermaid-error bg-red-50 text-red-700 p-4 rounded-lg";
                errorDiv.textContent = `Mermaid Error: ${(error as Error).message}`;
                container.appendChild(errorDiv);
                console.error("[mermaidView] Mermaid rendering error:", error);
            }
        };

        renderMermaid(node.attrs.value);

        return {
            dom: container,
            update: (updatedNode: Node) => {
                if (updatedNode.type !== node.type) return false;
                if (updatedNode.attrs.value !== node.attrs.value) {
                    renderMermaid(updatedNode.attrs.value);
                }
                return true;
            },
        };
    };
});

// export const mermaidProsePlugin = (ctx: any) => {
//     return new Plugin({
//         props: {
//             handleDOMEvents: {
//                 // 在编辑器渲染后初始化 Mermaid
//                 focus: (view) => {
//                     setTimeout(() => {
//                         const mermaidElements = view.dom.querySelectorAll(
//                             ".mermaid:not([data-processed])"
//                         );
//                         if (mermaidElements.length > 0) {
//                             mermaid.init();
//                         }
//                     }, 100);
//                     return false;
//                 },
//             },
//         },
//     });
// };

// 修正后的扩展导出
// export const mermaidExtension = [
//     mermaidNode, 
//     mermaidView, 
//     mermaidPlugin
// ];

// export const mermaidProsePlugin = $prose((ctx: any) => {
//     return new Plugin({
//         props: {
//             handleDOMEvents: {
//                 focus: (view) => {
//                     setTimeout(() => {
//                         const mermaidElements = view.dom.querySelectorAll(
//                             ".mermaid:not([data-processed])"
//                         );
//                         if (mermaidElements.length > 0) {
//                             mermaid.init();
//                         }
//                     }, 100);
//                     return false;
//                 },
//             },
//         },
//     });
// });

export const mermaidProsePlugin = $prose((ctx: any) => {
    console.log('[DEBUG] Mermaid prose plugin factory called');
    return new Plugin({
        props: {
            handleDOMEvents: {
                focus: (view) => {
                    setTimeout(() => {
                        const mermaidElements = view.dom.querySelectorAll(
                            ".mermaid:not([data-processed])"
                        );
                        console.log("[mermaidProsePlugin] Found mermaid elements:", mermaidElements);
                        if (mermaidElements.length > 0) {
                            // 将元素转换为 HTMLElement 数组
                            const htmlElements = Array.from(mermaidElements) as HTMLElement[];

                            // 使用 run 替代 init
                            mermaid.run({
                                querySelector: '.mermaid',
                                nodes: htmlElements,
                            });
                        }
                    }, 100);
                    return false;
                },
            },
        },
    });
});

// 分别导出插件
export const mermaidNodePlugin: MilkdownPlugin = mermaidNode;
export const mermaidViewPlugin: MilkdownPlugin = mermaidView;
export const mermaidProse: MilkdownPlugin = mermaidProsePlugin;