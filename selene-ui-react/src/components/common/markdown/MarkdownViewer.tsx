import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
// import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css'; // 推荐用于深色主题

export default function MarkdownViewer({ content }: { content: string }) {
    return (
        <div className="text-left prose prose-sm max-w-none dark:prose-invert prose-pre:bg-zinc-900 prose-pre:text-white prose-table:border prose-th:border prose-td:border">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

// export default function MarkdownViewer({ content }: { content: string }) {
//     return (
//         <div className="text-left prose dark:prose-invert max-w-none">
//             <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 rehypePlugins={[rehypeHighlight]}
//             >
//                 {content}
//             </ReactMarkdown>
//         </div>
//     );
// }

// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css"; // or another theme like 'github.css'

// interface MarkdownViewerProps {
//   content: string;
// }

// export default function MarkdownViewer({ content }: MarkdownViewerProps) {
//   return (
//     <div className="prose dark:prose-invert max-w-none prose-pre:bg-zinc-900 prose-table:border prose-th:border prose-td:border prose-th:px-2 prose-td:px-2">
//       <ReactMarkdown
//         remarkPlugins={[remarkGfm]}
//         rehypePlugins={[rehypeHighlight]}
//       >
//         {content}
//       </ReactMarkdown>
//     </div>
//   );
// }