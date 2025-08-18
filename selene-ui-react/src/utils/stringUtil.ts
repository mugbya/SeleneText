

export function textToId(text: string){
    const slug = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s]/g, '') // 保留中英文和空格
        .replace(/\s+/g, '-')                  // 空格转连字符
        .replace(/--+/g, '-')                  // 移除重复连字符
        .replace(/^-|-$/g, '')
    return slug
}


export const normalizeForCompare = (s: string) =>
  (s ?? '')
    .replace(/\r\n/g, '\n')   // 统一换行
    .replace(/^\uFEFF/, '')   // 去掉 BOM
    .replace(/\u00A0/g, ' ')  // NBSP -> 空格（按需）
    .replace(/\n+$/,'\n');    // 统一末尾换行（可选：保留 1 个）