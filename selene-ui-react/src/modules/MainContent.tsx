import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from 'react';

export default function MainContent({ filePath, content }: { filePath: string | null; content: string }) {

    // const [content, setContent] = useState('');

    return (
        <main className="flex-1 overflow-auto p-4">
            <ScrollArea className="h-full">
                <div className="flex-1 p-4 overflow-auto">
                    {filePath ? (
                        <>
                            <h2 className="text-base font-semibold mb-2">{filePath}</h2>
                            <pre className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded whitespace-pre-wrap text-sm">{content}</pre>
                        </>
                    ) : (
                        <div className="text-zinc-500"></div>
                    )}
                </div>
            </ScrollArea>
        </main>
    )
}