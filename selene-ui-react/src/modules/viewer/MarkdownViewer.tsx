// components/MarkdownViewer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

export default function MarkdownViewer({ content }: { content: string }) {
    return (
        <div className="prose max-w-none dark:prose-invert">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
