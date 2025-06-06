// components/CodeViewer.tsx
import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function CodeViewer({
                                       code,
                                       language,
                                   }: {
    code: string;
    language: string;
}) {
    return (
        <SyntaxHighlighter language={language} style={github} customStyle={{ padding: '1rem', borderRadius: '8px' }}>
            {code}
        </SyntaxHighlighter>
    );
}
