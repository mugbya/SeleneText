import { FileTab } from "@/types";

export async function handleFileSave(
    current: FileTab | undefined,
) {
    // console.log("handleFileSave: ", current, updateFile);
    if (!current) {
        console.warn("❌ handleFileSave 调用失败：current is null or undefined");
        return;
    }
    // const hasSaved = current.path && !current.path.startsWith("Untitled-");
    // console.log("current.isTemporary: ", current.isTemporary);
    const hasSaved = !current.isTemporary;

    console.log("hasSaved: ", hasSaved);
    if (hasSaved) {
        // ✅ 直接保存到原路径
        await window.electronAPI.saveFile(current.path, current.content)
        return;
    }

    // 🆕 新文件，弹出保存框
    const res = await window.electronAPI.saveFileAs("untitled.txt", current.content)

    if (res.success && res.filePath) {
        // ✅ 自动添加一个新项目（如果这个文件不在已有项目中）
        window.electronAPI.send("load-folder", window.electronAPI.dirname(res.filePath));
    }
}