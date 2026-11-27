# V0.2 UI Specification

## 版式

- 页面外层最大宽度：`1200px`，移动端内边距 `20px`，桌面端内边距 `32px`。
- 阅读内容最大宽度：约 `68ch`；长文正文左对齐，不使用两端对齐。
- 大屏使用 12 列概念网格；首页英雄文案约占 5 列，Evidence Horizon 约占 7 列。
- 移动端为单列，优先保证标题、正文和操作的顺序。

## Token 契约

颜色、间距、圆角、阴影、动效、焦点和层级 token 集中在 `src/styles/global.css`。组件使用语义 token，例如 `bg-surface`、`text-ink`、`border-line` 和 `text-brand-strong`，不直接绑定 palette 原始值。

## 组件状态

链接和按钮提供默认、hover、focus、active、disabled；搜索页提供 loading、empty、error；内容卡提供 available 与 empty。未拥有真实数据时不渲染 author/reviewer 身份。

## 图形

Evidence Horizon 使用 CSS 圆弧、网格和内联 SVG；不使用外部图片、视频、WebGL、Canvas 或网络字体。唯一强装饰在英雄区，其余区块使用边界、留白和清晰标题表达结构。

## 文案

所有 UI 文案进入三语言 dictionary。标签采用 sentence case；按钮用动作结果命名，例如“Explore knowledge”“搜索知识”“ค้นหาความรู้”。
