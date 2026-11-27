# V0.2 动效规范

## Token

- `--motion-fast`：短交互反馈，约 160ms。
- `--motion-base`：导航、颜色和面板状态，约 240ms。
- `--motion-slow`：只用于英雄区的非必要装饰，约 420ms。
- `--ease-standard`：`cubic-bezier(0.2, 0.65, 0.25, 1)`。

## 使用规则

- 动效必须说明状态变化，不用于制造医疗紧迫感或模拟疗效。
- hover 只改变颜色、边界、阴影或轻微位移；不让卡片漂浮成装饰。
- 页面加载不对主要正文做逐段延迟动画。
- `prefers-reduced-motion: reduce` 下保留内容和焦点，只移除非必要移动与滚动动画。
- Dialog、Accordion 和搜索 loading 若进入后续版本，必须提供键盘关闭、状态文本和错误恢复。
