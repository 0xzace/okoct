# 设计系统

## 方向

专业、安静、编辑型健康知识界面。避免药品营销、疗效对比图、虚假背书和夸张动画。移动优先，浅色默认，支持深色和系统主题。

## 视觉令牌

| 令牌           | 值/意图                 |
| -------------- | ----------------------- |
| ink            | `#12383a`，正文深青色   |
| ink-muted      | `#4b686b`，辅助文字     |
| surface        | `#f6fbfa`，页面背景     |
| surface-raised | `#ffffff`，卡片/表面    |
| brand          | `#0d7377`，主要行动色   |
| brand-strong   | `#07585d`，链接和 hover |
| accent         | `#b9e9dc`，安全提示背景 |

## 组件

- `BaseLayout`：HTML、head、跳过链接、header、main、footer。
- `SiteHeader`：主要导航、语言切换、主题控件。
- `SeoHead`：统一 metadata、alternate links 和 JSON-LD。
- `Breadcrumbs`：语义 breadcrumb 与 BreadcrumbList JSON-LD。
- `ThemeControl`：原生 select，键盘可用、系统偏好、reduced-motion 友好。

## 可访问性

- 使用 `header`、`nav`、`main`、`article`、`footer` 和正确的 heading 层级。
- 提供 skip link、`aria-label`、`aria-current` 和可见 focus ring。
- 主题控件不承载页面内容；页面无需 JavaScript 也可阅读。
- `prefers-reduced-motion: reduce` 禁用非必要动画和滚动动画。
- 颜色目标为 WCAG 2.2 AA；完整对比度和真实设备审查仍需在发布前执行。
