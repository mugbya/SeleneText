import React, { useEffect, useRef, useState } from "react";

interface ImagePreviewProps {
  path: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  path,
  alt = "图片",
  style,
  className,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // 滚轮缩放（以鼠标为中心）
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const delta = -e.deltaY * 0.005;
    // let next = prev - delta * 0.001; // 控制缩放速度
    // return Math.min(Math.max(next, 0.1), 5); // 限制缩放范围
    const newScale = Math.min(Math.max(scale + delta, 0.1), 5);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const dx = (offsetX - position.x) / scale;
    const dy = (offsetY - position.y) / scale;

    const newX = offsetX - dx * newScale;
    const newY = offsetY - dy * newScale;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // 鼠标拖拽平移
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (!path) return;

    const load = async () => {
      try {
        const base64 = await window.electronAPI.getImageBase64(path);
        if (!base64) throw new Error("图片加载失败");
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } catch (err) {
        console.error("[ImagePreview] 加载失败:", err);
        setError("无法加载图片");
      }
    };

    load();
  }, [path]);

  if (error) return <div>{error}</div>;

  console.log("[ImagePreview] 渲染imageSrc:", imageSrc);
  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-full h-full overflow-hidden cursor-grab relative select-none"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="预览图"
          className="absolute top-0 left-0 transition-transform duration-75"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
          draggable={false}
        />
      ) : (
        <div>加载中...</div>
      )}
    </div>
  );
};
