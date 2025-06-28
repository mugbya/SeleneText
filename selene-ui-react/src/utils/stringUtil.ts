

export function textToId(text: string){
    const slug = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s]/g, '') // 保留中英文和空格
        .replace(/\s+/g, '-')                  // 空格转连字符
        .replace(/--+/g, '-')                  // 移除重复连字符
        .replace(/^-|-$/g, '')
    return slug
}