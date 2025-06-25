
export type FileType = "image" | "markdown" | "code" | "plain" | "unknown";

export function getFileType(filePath: string): FileType {
    const ext = filePath.split(".").pop()?.toLowerCase();

    if (!ext) return "unknown";

    const imageExtensions = new Set([
        "jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "tiff", "avif",
    ]);
    const markdownExtensions = new Set(["md", "markdown"]);
    const codeExtensions = new Set(["ts", "js", "tsx", "jsx", "json", "html", "css"]);

    if (imageExtensions.has(ext)) return "image";
    if (markdownExtensions.has(ext)) return "markdown";
    if (codeExtensions.has(ext)) return "code";
    if (ext === "txt") return "plain";
    return "unknown";
}
