import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { themeKeys } from "@/constants/theme"; // 路径按你项目结构调整


export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            storageKey="vite-ui-theme"
            themes={themeKeys} // 自动从配置导入
        >
            {children}
        </NextThemesProvider>
    );
}
