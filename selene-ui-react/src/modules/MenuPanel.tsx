import { Home, Search, Settings } from 'lucide-react';

interface MenuPanelProps {
    openSettings: () => void;
}

export default function MenuPanel({ openSettings }: MenuPanelProps) {

    return (
        <div className="p-0 space-y-2 border-r ">
            <button
                onClick={openSettings}
                className="flex items-center gap-2  px-4 py-2 rounded border-2 bg-[var(--card-bg)]"
            >
                <Settings className="w-6 h-6" />
                {/*设置*/}
            </button>
        </div>

    )
}