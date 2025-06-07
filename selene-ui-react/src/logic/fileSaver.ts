import {FileTab} from "@/types";

/**
 * 文件另存为
 * @param defaultPath
 * @param content
 */
export async function saveFileAs(defaultPath: string, content: string): Promise<string | null> {
    const result = await window.electronAPI.invoke("save-file-as", {
        defaultPath,
        content,
    });

    return result.success ? result.filePath : null;
}

/**
 * 文本保存
 * @param file
 * @param updateCallback
 */
// export const handleFileSave = async (
//     file: FileTab,
//     updateCallback: (updated: FileTab) => void
// ) => {
//     const isNew = !file.path || file.path.startsWith("Untitled-");
//
//     const res = await window.electronAPI.invoke("save-file-as", {
//         defaultPath: isNew ? "untitled.txt" : file.path,
//         content: file.content,
//     });
//
//     if (res.success) {
//         updateCallback({ ...file, path: res.filePath });
//     }
// };


// export async function handleFileSave(
//     current: FileTab | undefined,
//     updateFile: (oldPath: string, updated: FileTab) => void
// ) {
//     console.log("handleFileSave: ", current, updateFile );
//     if (!current) {
//         console.warn("❌ handleFileSave 调用失败：current is null or undefined");
//         return;
//     }
//
//     const isNew = !current.path || current.path.startsWith("Untitled-");
//
//     const res = await window.electronAPI.invoke("save-file-as", {
//         defaultPath: isNew ? "untitled.txt" : current.path,
//         content: current.content,
//     });
//
//     if (res.success && res.filePath) {
//         if (isNew) {
//             // 新建文件，保存后需要更新 path
//             const updated = { ...current, path: res.filePath };
//             updateFile(current.path, updated);
//         }
//     }
// }

export async function handleFileSave(
    current: FileTab | undefined,
    updateFile: (oldPath: string, updated: FileTab) => void
) {
    console.log("handleFileSave: ", current, updateFile );
    if (!current) {
        console.warn("❌ handleFileSave 调用失败：current is null or undefined");
        return;
    }

    const hasSaved = current.path && !current.path.startsWith("Untitled-");

    if (hasSaved) {
        // ✅ 直接保存到原路径
        const res = await window.electronAPI.invoke("save-file", {
            path: current.path,
            content: current.content,
        })
        // if (res.success && res.filePath) {
        //     const updated = { ...current, path: res.filePath };
        //     updateFile(current.path, updated);
        // }
        return;
    }

    // 🆕 新文件，弹出保存框
    const res = await window.electronAPI.invoke("save-file-as", {
        defaultPath: "untitled.txt",
        content: current.content,
    });

    if (res.success && res.filePath) {
        const updated = { ...current, path: res.filePath };
        updateFile(current.path, updated);
    }
}