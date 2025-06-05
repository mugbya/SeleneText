import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function MainContent() {
    return (
        <main className="flex-1 overflow-auto p-4">
            <ScrollArea className="h-full">
                <Card className="bg-[var(--card-bg)]">
                    <CardContent>
                        <div className="text-xl font-semibold">Main Content</div>
                        <p className="mt-4">这里是中间主体内容区。</p>
                    </CardContent>
                </Card>
            </ScrollArea>
        </main>
    )
}