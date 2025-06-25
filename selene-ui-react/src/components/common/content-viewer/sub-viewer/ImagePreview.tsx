import React, { useEffect, useState } from "react";

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
        const blob = new Blob([bytes], { type: 'image/jpeg' });
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
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <div>加载中...</div>
      )}
    </div>
  );
};