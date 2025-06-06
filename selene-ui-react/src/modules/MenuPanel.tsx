import { Home, Search, Settings, Folder } from 'lucide-react';

interface MenuPanelProps {
    openSettings: () => void;
    toggleLeft: () => void;
}


export default function MenuPanel({ openSettings, toggleLeft }: MenuPanelProps) {
    // const { setShowLeftPanel } = useLayoutContext();

    return (
        <>
            {/*<div className="w-12 bg-muted h-full flex flex-col items-center py-2 space-y-4">*/}
            {/*    /!* 文件夹按钮 *!/*/}
            {/*    <button*/}
            {/*        // onClick={() => setShowLeftPanel(true)}*/}
            {/*        title="打开文件夹"*/}
            {/*        className="hover:bg-accent p-2 rounded"*/}
            {/*    >*/}
            {/*        <Folder className="w-5 h-5" />*/}
            {/*    </button>*/}

            {/*    /!* 其他按钮... *!/*/}
            {/*</div>*/}


            {/* <div className="p-0 space-y-2 border-r "> */}
            <div className="p-0 space-y-2">
                <button
                    // onClick={() => setShowLeftPanel(true)}
                    onClick={toggleLeft}
                    title="打开文件夹"
                    className="hover:bg-accent p-2 rounded"
                >
                    <Folder className="w-6 h-6" />
                </button>

                <button
                    onClick={openSettings}
                    className="flex items-center gap-2  px-4 py-2 rounded border-2"
                >
                    <Settings className="w-6 h-6" />
                    {/*设置*/}
                </button>
            </div>


        </>

    )
}