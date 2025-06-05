import React from "react";
import { Button } from "@/components/ui/button";

interface HeadProps {
    toggleLeft: () => void;
    toggleRight: () => void;
}


export default function Head({ toggleLeft, toggleRight }: HeadProps) {

    return (
        <div className="flex items-center justify-between px-4 h-14">

            <div>头部信息</div>
            <div >

            </div>

            <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={toggleLeft}>
                    切换左侧栏
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleRight}>
                    切换右侧栏
                </Button>
            </div>

        </div>
    );
}