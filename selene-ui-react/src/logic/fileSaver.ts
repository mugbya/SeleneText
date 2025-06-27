import { FileTab } from "@/types";

export async function handleFileSave(
    currentFile: FileTab | undefined,
) {
    // console.log("handleFileSave: ", current, updateFile);
    if (!currentFile) {
        console.warn("❌ handleFileSave 调用失败：current is null or undefined");
        return;
    }
    // const hasSaved = current.path && !current.path.startsWith("Untitled-");
    // console.log("current.isTemporary: ", current.isTemporary);
    const hasSaved = !currentFile.isTemporary;

    const mode = currentFile.mode ?? "wysiwyg";
    const contentToSave = mode === "source" ? currentFile.markdown ?? currentFile.content : currentFile.content;
    // console.log("[handleFileSave] contentToSave: ", contentToSave);
    console.log("hasSaved: ", hasSaved);
    if (hasSaved) {
        // ✅ 直接保存到原路径
        await window.electronAPI.saveFile(currentFile.path, contentToSave)
        return;
    }

    // 🆕 新文件，弹出保存框
    const res = await window.electronAPI.saveFileAs("untitled.txt", contentToSave)

    if (res.success && res.filePath) {
        // ✅ 自动添加一个新项目（如果这个文件不在已有项目中）
        window.electronAPI.send("load-folder", window.electronAPI.dirname(res.filePath));
    }
}