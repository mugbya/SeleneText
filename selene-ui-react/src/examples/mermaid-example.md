# Mermaid 图表示例

这是一个 Mermaid 图表示例文件，用于测试 Mermaid 图表功能。

## 流程图示例

```mermaid
graph TD
    A[开始] --> B{是否有问题?}
    B -->|是| C[解决问题]
    B -->|否| D[继续前进]
    C --> D
    D --> E[结束]
```

## 时序图示例

```mermaid
sequenceDiagram
    participant 用户
    participant 系统
    participant 数据库
    
    用户->>系统: 请求数据
    系统->>数据库: 查询数据
    数据库-->>系统: 返回结果
    系统-->>用户: 显示数据
```

## 类图示例

```mermaid
classDiagram
    class Animal {
        +name: string
        +age: int
        +makeSound(): void
    }
    class Dog {
        +breed: string
        +bark(): void
    }
    class Cat {
        +color: string
        +meow(): void
    }
    Animal <|-- Dog
    Animal <|-- Cat
```

## 甘特图示例

```mermaid
gantt
    title 项目计划
    dateFormat  YYYY-MM-DD
    section 设计阶段
    需求分析    :done, des1, 2023-01-01, 2023-01-05
    UI设计     :done, des2, 2023-01-06, 2023-01-10
    section 开发阶段
    前端开发    :active, dev1, 2023-01-11, 2023-01-20
    后端开发    :dev2, 2023-01-15, 2023-01-25
    section 测试阶段
    功能测试    :test1, 2023-01-26, 2023-01-30
```

## 饼图示例

```mermaid
pie title 项目时间分配
    "设计" : 30
    "开发" : 50
    "测试" : 15
    "部署" : 5
```

## 状态图示例

```mermaid
stateDiagram-v2
    [*] --> 待处理
    待处理 --> 进行中: 开始处理
    进行中 --> 已完成: 完成任务
    进行中 --> 已取消: 取消任务
    已完成 --> [*]
    已取消 --> [*]
```

## 使用说明

1. 在 Markdown 文件中使用 \`\`\`mermaid 和 \`\`\` 包裹 Mermaid 图表代码
2. 支持多种图表类型：流程图、时序图、类图、甘特图、饼图、状态图等
3. 在即时模式下，可以直接编辑和预览 Mermaid 图表