// // components/CodeViewer.tsx
// // 如需编辑，请使用：
// // •	✅ @uiw/react-codemirror → 轻量、适合多语言、体验好
// // •	✅ @monaco-editor/react → VS Code 编辑体验，重量级，但强大
//
// import React from 'react';
// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
//
// export default function CodeViewer({
//                                        code,
//                                        language,
//                                        editable
//                                    }: {
//     code: string;
//     language: string;
//     editable: boolean;
// }) {
//     return (
//         <SyntaxHighlighter language={language} style={github} customStyle={{ padding: '1rem', borderRadius: '8px' }}>
//             {code}
//         </SyntaxHighlighter>
//     );
// }
