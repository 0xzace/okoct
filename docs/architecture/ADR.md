# 架构决策记录

## ADR-001：使用 Astro 静态生成

- 状态：Accepted for V0.1
- 决策：使用 Astro `output: static` 和原生 `.astro` 组件。
- 原因：满足 SEO First、静态 HTML、性能、低 JavaScript 和 V0.1 无后端约束。
- 代价：内容更新需要重新构建；未来编辑工作流需另行设计。

## ADR-002：语言使用独立子目录

- 状态：Accepted for V0.1
- 决策：`th`、`en`、`zh-Hans` 分别映射到 `/th/`、`/en/`、`/zh/`。
- 原因：URL 稳定、可索引、易于 canonical/hreflang 管理，不依赖 IP 跳转。
- 代价：需要维护翻译关系和未翻译页面的排除逻辑。

## ADR-003：内容发布必须通过状态门禁

- 状态：Accepted for V0.1
- 决策：Content Collection 使用 Zod 状态模型，构建前和构建后都检查发布资格。
- 原因：自动化不能替代专业审核，但可以阻止明显的 draft/test-only 泄漏。
- 代价：发布字段和审核记录需要持续维护；门禁不会证明医学事实正确。

## ADR-004：V0.1 手工生成 sitemap

- 状态：Accepted for V0.1
- 决策：使用项目内 sitemap 生成器，来源是显式公开路线记录。
- 原因：页面集合很小，避免不必要依赖，并确保未翻译路线不进入 sitemap。
- 代价：新增公开路线时必须同时更新路线和验证期望集合。

## ADR-005：主题切换使用原生控件和最小脚本

- 状态：Accepted for V0.1
- 决策：使用原生 `select`、`localStorage` 和一个 inline script，页面内容不依赖脚本。
- 原因：保留键盘可用性、降低 hydration 成本，并支持系统偏好。
- 代价：需要持续检查 CSP 和无脚本降级行为。

## ADR-006：V0.3 以 Git 内容记录和统一 Repository 为唯一生产读取层

- 状态：Accepted for V0.3
- 决策：公开文章使用 Astro Content Collections；关键词、主题、brief 和参考资料使用 Git 管理记录；生产页面只能通过 repository 和 fail-closed publication gate 读取。
- 原因：在不引入数据库或 CMS 的前提下保留版本历史、可审计性和静态生成能力，并阻止页面绕过审核记录。
- 代价：内容变更需要重新构建；editorial 与公开 frontmatter 的关系必须持续通过引用校验维护。

## ADR-007：V0.4 使用构建后、无依赖 SEO 审计引擎

- 状态：Accepted for V0.4
- 决策：保留 `src/seo` 作为生成期 SEO 规范实现，使用 `scripts/seo/engine.mjs` 对本地 `dist/` 或明确授权的本地预览执行构建后审计、报告、回归和质量门禁。
- 原因：不引入数据库、CMS 或 TypeScript 运行时依赖，同时能验证真实静态产物与内容泄露风险。
- 代价：当前规则以 HTML/静态资源和显式 redirect map 为输入；真实生产服务器、Search Console、现场性能和外部站点爬取仍需独立验证。
