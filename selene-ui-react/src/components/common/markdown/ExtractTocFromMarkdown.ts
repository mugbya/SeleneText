// utils/markdownToc.ts
import { marked } from "marked";
import {textToId} from "@/utils/stringUtil";

export interface TocItem {
    text: string;
    level: number;
    slug: string;
}

export function ExtractTocFromMarkdown(markdown: string): TocItem[] {
    const toc: TocItem[] = [];
    const tokens = marked.lexer(markdown);

    for (const token of tokens) {
        if (token.type === "heading" && "depth" in token) {
            // const slug = slugger.slug(token.text); // ✅ 使用 slugger
            const slug = textToId(token.text);
            // console.log("Extracting toc from markdown, slug: ", slug, "level", token.depth);
            toc.push({
                text: token.text,
                level: token.depth,
                slug,
            });
        }
    }
    return toc;
}