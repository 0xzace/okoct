# V0.2 无障碍标准

- 目标：WCAG 2.2 AA；语义 landmark 为 `header`、`nav`、`main`、`article`、`section` 和 `footer`。
- 页面提供 skip link；焦点环使用 `--focus-ring`，不得通过 `outline: none` 隐藏焦点而不提供替代样式。
- 所有表单控件有可见或屏幕阅读器标签；当前语言和当前导航项使用 `aria-current`。
- 标题按层级递进，正文左对齐，Thai 和简体中文可自然换行。
- 主题和 reduced-motion 不改变内容可用性；`prefers-reduced-motion: reduce` 禁用非必要动画。
- 颜色不是唯一信息来源；安全、空状态和证据状态都同时提供文字说明。
- 图片/图形使用有意义的替代文本或 `aria-hidden`；不伪造医学插图。
- 实际 axe、键盘、对比度和多尺寸浏览器检查必须记录在验证证据中。
