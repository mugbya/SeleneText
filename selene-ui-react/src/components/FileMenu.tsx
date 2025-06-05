import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function FileMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">文件</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
                {/* 第一组：新建 */}
                <DropdownMenuLabel>新建</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => console.log("新建文本文件")}>
                        新建文本文件
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("新建目录")}>
                        新建目录
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* 第二组：打开 */}
                <DropdownMenuLabel>打开</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => console.log("打开文件")}>
                        打开文件
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("打开文件夹")}>
                        打开文件夹
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("打开最新的文件")}>
                        打开最新的文件
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* 第三组：工作区 */}
                <DropdownMenuLabel>工作区</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => console.log("添加文件夹到工作区")}>
                        添加文件夹到工作区
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* 第四组：关闭 */}
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => console.log("关闭文件夹")}>
                        关闭文件夹
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
