/**
 * 动态Panel
 *      在展开时支持拖动改变区域大小
 *      收缩时不能拖动
 *
 * 左 / 右面板通用结构（传入位置 + 初始宽度 + 显隐控制）
 * 自带拖拽边界控制（最小 / 最大）
 * 支持收起 / 展开状态
 * 支持外部控制（比如 Header 按钮 ）
 */
import React, { useRef, useEffect } from "react";
import { ResizablePanelProps } from '@/types';


const ResizablePanel: React.FC<ResizablePanelProps> = ({
                                                           side,
                                                           width,
                                                           onWidthChange,
                                                           show,
                                                           minWidth = 160,
                                                           maxWidth = window.innerWidth / 2,
                                                           children,
                                                       }) => {
    const isDragging = useRef(false);

    const startDrag = (e: React.MouseEvent) => {
        isDragging.current = true;

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            const clientX = e.clientX;
            const winWidth = window.innerWidth;

            if (side === "left") {
                const newWidth = Math.min(Math.max(minWidth, clientX), maxWidth);
                onWidthChange(newWidth);
            } else {
                const newWidth = Math.min(Math.max(minWidth, winWidth - clientX), maxWidth);
                onWidthChange(newWidth);
            }
        };

        const onMouseUp = () => {
            isDragging.current = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    // 这种会导致 LeftPanel 加载的目录树 丢失
    // if (!show) return null;

    // return (
    //     <>
    //         <div style={{ width }} className={`border-${side === "left" ? "r" : "l"} p-2`}>
    //             {children}
    //         </div>
    //         <div
    //             onMouseDown={startDrag}
    //             className="w-1 cursor-col-resize transition"
    //         />
    //     </>
    // );

    return (
        <>
            <div
                className={`transition-all duration-300 overflow-hidden ${
                    show ? "block" : "hidden"
                } border-${side === "left" ? "r" : "l"} p-2`}
                style={{ width: show ? width : 0 }}
            >
                {children}
            </div>
            {show && (
                <div
                    onMouseDown={startDrag}
                    className="w-1 cursor-col-resize transition"
                />
            )}
        </>
    );
};

export default ResizablePanel;
