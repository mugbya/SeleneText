import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"


// App.tsx
import React from 'react';
import MarkdownViewer from '../viewer/MarkdownViewer';

const markdownContent = `
# PIS整改工作细化



## 1、概述

本文档根据PIS整改方案进行细化

| 工作项 | 前端(天) | 后端(天) |
| ------ | -------- | -------- |
| 板式   |          | 1        |
| 计划   |          |          |
| 集成MQ |          | 1        |



## 2、工作项

### 2.1 板式

允许版式直接进行下发(到区域、到设备)，新下发的覆盖之前的

#### 2.1.1 前端

1. 前端 有下发 操作按钮

#### 2.1.2 后端

1. 支持 板式下发  
2. 下发协议改成MQ



#### 2.1.3 终端

对接协议



### 2.2 计划

隐藏这个计划功能，需要沟通是直接在前端隐藏，还是在数据库层面删除计划相关的 资源记录



### 2.3 节目单

节目单直接允许下发到播控器



#### 2.3.1 前端

1. 下发的时候 需要改版支持 下发 选中设备



#### 2.3.2 后端

1. 支持下发选中设备
2. 下发协议改成MQ







1. 项目做隔离？ 是否能按照模块进行打包
2. 界面怎么展示，整个业务串起来
3. 查询机 模块是否能去掉


`;

export default function MainContentLocal()  {
  return (
    <div className="text-left min-h-screen bg-background text-foreground p-8">
    {/* // <div className="text-left prose dark:prose-invert max-w-none prose-pre:bg-zinc-900 prose-table:border prose-th:border prose-td:border prose-th:px-2 prose-td:px-2"> */}
      <MarkdownViewer content={markdownContent} />
    </div>
  );
}
