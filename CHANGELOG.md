# Changelog

## [0.2.1] - 2026-11-27

### Added

- 内容驱动的首页 Featured 摘要和重复空状态收敛；draft/test-only 内容继续被排除。
- 移动端原生 disclosure 导航，支持 Escape、焦点恢复、背景滚动控制和主题同步。
- `@axe-core/playwright` 无障碍检查、生产构建预览截图和 Lighthouse 实验室基线。

### Changed

- Hero 明确体重管理知识方向，Evidence Horizon 增加克制的抽象轨道并支持 reduced-motion。
- 修复浅色主题主按钮对比度和搜索页空状态 heading 层级。
- section spacing 和移动端 Hero 高度收敛；Playwright 改为生产预览验证。
- 补强移动菜单断点关闭、短屏滚动、无脚本状态和主题控件初始化；完整 E2E 达到 27/27。

### Verified

- axe 3/3、生产预览视觉测试 6/6、Lighthouse 三语言移动/桌面基线已记录在 `docs/evidence/V0.2.1-VERIFICATION.md`。
- Docker `okoct:0.2.1` 镜像构建、容器健康检查和 Nginx HTTP/安全头验证已通过。

### Pending

- 正式医学/法律/翻译审核、真实用户性能、Search Console、生产发布和外部账号验证仍未完成。

## [0.2.0] - 2026-11-27

### Added

- Evidence Horizon 品牌标志、favicon、社交预览模板和品牌使用指南。
- Primitive、semantic、component、typography、spacing、radius、shadow、motion、focus 和 z-index Design Tokens。
- Astro 原生基础组件、页面布局壳、三语言首页、主题/语言导航和 noindex Pagefind 搜索入口。
- 内容空状态、医疗安全提示、来源/作者/审核者模板组件；没有真实记录时不渲染虚构身份。
- 多宽度、双主题、reduced-motion、键盘导航和截图验收用 Playwright 测试。

### Verified

- 本次本地运行的 typecheck、lint、format、unit、integration、build、SEO 和 E2E 结果记录在 `docs/evidence/V0.2-VERIFICATION.md`。

### Pending

- Docker daemon、真实用户 Core Web Vitals、正式医学/法律/翻译审核、生产发布和外部账号验证仍未完成。

## [0.1.0] - 2026-11-27

### Added

- 初始化 OKOCT Health Astro 静态站点工程。
- 增加 TypeScript strict、Tailwind CSS、Vitest、Playwright、ESLint、Prettier、Pagefind、Docker、Nginx 和 CI 基础配置。
- 增加项目配置、全局样式、测试入口和文档入口。

### Verified

- 国际化页面、SEO 模块、内容发布门禁、sitemap/robots、静态构建验收和部署准备已完成本地验证。

### Pending

- 正式医学内容、专业审核、生产部署、Cloudflare 和 Search Console 尚未完成。
