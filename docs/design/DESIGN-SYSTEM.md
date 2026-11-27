# 设计系统

## V0.2 方向

Evidence Horizon：专业、安静、编辑型健康知识界面。用地平线、证据曲线和少量状态标记表达从问题到来源的阅读路径；不使用药品营销、疗效对比图、虚假背书或夸张动画。移动优先，浅色默认，支持深色和系统主题。

## 视觉令牌

| 令牌      | 值/意图                 |
| --------- | ----------------------- |
| ink       | `#0b252b`，正文深蓝绿色 |
| ink-muted | `#49666a`，辅助文字     |
| canvas    | `#f2f7f5`，页面背景     |
| surface   | `#ffffff`，内容表面     |
| signal    | `#147d78`，主要行动色   |
| evidence  | `#b48639`，证据状态标记 |

深色主题使用 `#0b171b` canvas、`#13282d` surface、`#6ed7c5` signal 和 `#e2bd6b` evidence。完整 token 位于 `src/styles/global.css`，包括 primitive、semantic、component、typography、spacing、radius、shadow、motion、focus 和 z-index 层。

## 组件

- `BaseLayout`：HTML、head、跳过链接、header、main、footer。
- `SiteHeader`：品牌导航、搜索链接、语言切换、主题控件。
- `SeoHead`：统一 metadata、alternate links 和 JSON-LD。
- `Breadcrumbs`：语义 breadcrumb 与 BreadcrumbList JSON-LD。
- `ThemeControl`：原生 select，键盘可用、系统偏好、reduced-motion 友好。
- `HeroPanel`、`TopicCard`、`FeaturedContent`、`SafetyNotice`、`EditorialStandards`：首页科学编辑模块。
- `SearchDialog`、`ArticleHeader`、`ArticleMeta`、`ArticleBody`、`ReferenceList`、`AuthorCard`、`ReviewerCard`：搜索和未来内容模板。

## 可访问性

- 使用 `header`、`nav`、`main`、`article`、`footer` 和正确的 heading 层级。
- 提供 skip link、`aria-label`、`aria-current` 和可见 focus ring。
- skip link 的 `main` 目标可获得焦点，便于键盘用户确认跳转位置。
- 主题控件不承载页面内容；页面无需 JavaScript 也可阅读。
- `prefers-reduced-motion: reduce` 禁用非必要动画和滚动动画。
- 颜色目标为 WCAG 2.2 AA；完整对比度和真实设备审查仍需在发布前执行。
