import { useProjectsStore } from "@/store/projectsStore";
import {FileTab} from "@/types";

export async function handleFileSave(
    current: FileTab | undefined,
    updateFile: (oldPath: string, updated: FileTab) => void
) {
    // const projects = useProjectsStore((s) => s.projects);
    // const removeOrphanFile = useProjectsStore((s) => s.removeOrphanFile);

    console.log("handleFileSave: ", current, updateFile );
    if (!current) {
        console.warn("❌ handleFileSave 调用失败：current is null or undefined");
        return;
    }

    // const hasSaved = current.path && !current.path.startsWith("Untitled-");
    console.log("current.isTemporary: ", current.isTemporary);
    const hasSaved = !current.isTemporary;


    console.log("hasSaved: ", hasSaved);
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

            // ✅ 自动添加一个新项目（如果这个文件不在已有项目中）
            // const basePath = path.dirname(res.filePath); // 从文件路径中提取文件夹路径
            // const basePath = res.filePath; // 从文件路径中提取文件夹路径
            window.electronAPI.send("load-folder", window.electronAPI.dirname(res.filePath));

            // const alreadyExists = Object.values(projects).some(
            //     (p) => p.rootPath === basePath
            // );

            // console.log("alreadyExists: ", alreadyExists);
            // if (!alreadyExists) {
            //     // 通知主进程 watch 新文件夹，并触发 folder-changed
            //     // window.electronAPI.send(basePath);
            //     window.electronAPI.send("refresh-folder", basePath);
            // }

            // 可选：关闭这个 orphan tab，因为已经转为项目内了
            // removeOrphanFile(current.path);
    }
}