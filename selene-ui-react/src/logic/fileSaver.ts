import { FileTab } from "@/types";


export async function handleFileSave(
    currentFile: FileTab | undefined,
) {
    // console.log("handleFileSave: ", current, updateFile);
    if (!currentFile) {
        console.warn("❌[fileSaver:handleFileSave] 调用失败：current is null or undefined");
        return;
    }
    
    const hasSaved = !currentFile.isTemporary;
    const contentToSave = currentFile.content ?? "";
    
    console.log("[fileSaver:handleFileSave] 开始保存文件:", currentFile.path, "内容长度:", contentToSave.length);
    
    // 安全检查：防止保存空文件
    if (contentToSave.trim().length === 0) {
        console.warn("⚠️ [fileSaver:handleFileSave] 检测到空文件内容，询问用户是否继续保存");
        const userConfirmed = window.confirm("检测到文件内容为空，确定要保存吗？");
        if (!userConfirmed) {
            console.log("[fileSaver:handleFileSave] 用户取消保存空文件");
            return;
        }
    }
    
    if (hasSaved) {
        // ✅ 已保存文件：执行备份+安全写入
        console.log("[fileSaver:handleFileSave] 执行备份+安全写入");
        
        try {
            // 1. 生成备份文件名：使用原文件名和时间戳
            const fileName = currentFile.path.split('/').pop() || 'unknown';
            const timestamp = Date.now();
            const backupFileName = `${fileName}.backup.${timestamp}`;
            
            // 2. 使用resolvePath获取appData目录下的bak文件夹路径
            const bakFolderPath = await window.electronAPI.getUserDateFileBackPath();
            // console.log("[fileSaver:handleFileSave] bakFolderPath: ", bakFolderPath);

            const projectName = currentFile.projectRootPath.split('/').pop() || 'orphan';
            const relative = currentFile.path.slice(currentFile.projectRootPath.length + 1).replace(/\.[^.]+$/, '');

            const backupPath = `${bakFolderPath}/${projectName}/${relative}/${backupFileName}`;
            
            console.log("[fileSaver:handleFileSave] 创建备份文件到appData目录:", backupPath);
            
            // 4. 使用现有的 saveFileSafely API来创建备份
            const result = await window.electronAPI.saveFileSafely(backupPath, currentFile.path, contentToSave);
            console.log(`[fileSaver:handleFileSave] 文件安全写执行结果: ${result.success}. error: ${result.error}`);
            
        } catch (error) {
            console.error("❌[fileSaver:handleFileSave] 保存过程中发生错误:", error);
            // 保存失败时，可以提示用户有备份文件可用
            throw error;
        }
        
        return;
    }

    // 🆕 新文件，弹出保存框
    console.log("[fileSaver:handleFileSave] 新文件，使用保存对话框");
    const res = await window.electronAPI.saveFileAs("untitled.txt", contentToSave)

    if (res.success && res.filePath) {
        // ✅ 自动添加一个新项目（如果这个文件不在已有项目中）
        window.electronAPI.send("load-folder", window.electronAPI.dirname(res.filePath));
    }
}