import {FileTab} from "@/types";

export async function handleFileSave(
    current: FileTab | undefined,
    updateFile: (oldPath: string, updated: FileTab) => void
) {
    // console.log("handleFileSave: ", current, updateFile );
    if (!current) {
        console.warn("❌ handleFileSave 调用失败：current is null or undefined");
        return;
    }

    const hasSaved = current.path && !current.path.startsWith("Untitled-");

    if (hasSaved) {
        // ✅ 直接保存到原路径
        const res = await window.electronAPI.saveFile(current.path, current.content)
        return;
    }

    // 🆕 新文件，弹出保存框
    const res = await window.electronAPI.saveFileAs("untitled.txt", current.content)

    if (res.success && res.filePath) {
        const updated = { ...current, path: res.filePath };
        updateFile(current.path, updated);
    }
}