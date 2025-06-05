import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function RightPanel() {
    return (
        <aside className="w-60  overflow-auto">
            <ScrollArea className="h-full p-4">
                <Card className="bg-[var(--card-bg)]">
                    <CardContent>Right Panel</CardContent>
                </Card>
            </ScrollArea>
        </aside>
    )
}