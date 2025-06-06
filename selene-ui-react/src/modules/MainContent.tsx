// components/MainContent.tsx
import React from 'react';
import MarkdownViewer from './viewer/MarkdownViewer';
import CodeViewer from './viewer/CodeViewer';
import { ScrollArea } from '@/components/ui/scroll-area';

function getFileType(filePath: string): 'markdown' | 'code' | 'plain' {
    if (!filePath) return 'plain';
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (!ext) return 'plain';

    if (['md', 'markdown'].includes(ext)) return 'markdown';
    if (['ts', 'tsx', 'js', 'jsx', 'json', 'css', 'html'].includes(ext)) return 'code';

    return 'plain';
}

export default function MainContent({
                                        filePath,
                                        content,
                                    }: {
    filePath: string | null;
    content: string;
}) {
    const fileType = filePath ? getFileType(filePath) : 'plain';
    // console.log("file content");
    //  console.log(content);

    const renderContent = () => {
        switch (fileType) {
            case 'markdown':
                return <MarkdownViewer content={content} />;
            case 'code':
                const ext = filePath?.split('.').pop() || 'txt';
                return <CodeViewer code={content} language={ext} />;
            default:
                return (
                    <pre className="text-left bg-muted p-4 rounded whitespace-pre-wrap text-sm font-mono overflow-auto">
                        {content}
                    </pre>
                );
        }
    };

    return (
        <main className="flex-1 overflow-auto">
            <ScrollArea className="h-full p-4">
                {filePath ? (
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold text-muted-foreground">
                            {filePath}
                        </h2>
                        {renderContent()}
                    </div>
                ) : (
                    <div className="text-zinc-400 text-sm">未打开任何文件</div>
                )}
            </ScrollArea>
        </main>

    );
}
