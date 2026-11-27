# OKOCT Health

OKOCT Health 是面向泰国市场的独立、非商业健康知识网站。当前版本为 `0.2.1`，在 V0.1 的 SEO First、国际化、静态生成和合规优先基础上，完成科学编辑型设计系统的视觉收敛、内容驱动首页、移动端导航和生产预览质量验证；当前仍不发布正式医学文章。

## 当前范围

- Astro 静态生成，默认语言为 `th`，支持 `th`、`en`、`zh-Hans`，URL 前缀为 `/th/`、`/en/`、`/zh/`。
- 类型安全的 i18n、canonical、hreflang、Open Graph、JSON-LD、sitemap 和 robots.txt 基础设施。
- Content Collections + Zod 内容模型，以及构建前/构建后内容发布门禁。
- 语义 HTML、键盘焦点、深色/浅色/系统主题和 reduced-motion 基础支持。
- Evidence Horizon 品牌资产、CSS Design Tokens、原生 Astro 组件、响应式首页和 noindex 搜索页。
- 内容为空时隐藏重复的文章/研究区块；正式内容必须通过发布门禁后才显示摘要。
- 移动端紧凑导航、Escape/焦点管理、axe-core 检查、生产构建截图和 Lighthouse 实验室基线。
- Vitest、Playwright、TypeScript、ESLint、Prettier、Pagefind、Docker、Nginx 和 GitHub Actions 配置。

V0.2 仍不包含数据库、后端、CMS、账号、支付、购药、诊断、个性化治疗、剂量建议、在线诊疗或敏感健康信息收集。

## 本地开发

```bash
pnpm install --frozen-lockfile
pnpm dev
```

常用命令：

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test:unit
pnpm test:integration
pnpm validate:content
pnpm build
pnpm validate:seo
pnpm test:e2e
pnpm exec playwright test tests/e2e/accessibility.spec.ts
```

完整静态验收使用 `pnpm verify:static`；完整验收使用 `pnpm verify`。浏览器依赖首次使用 Playwright 时执行 `pnpm exec playwright install chromium`。

## 合规状态

V0.1 的内容 fixture 明确标记为 `draft`、`test-only` 和不可索引。正式医学内容必须具备可验证来源，并经过真实的事实核查、专业医学审核、合规审核和翻译审核后，才允许进入公开构建。自动化门禁不能替代专业人员审核。

本地 Docker 镜像构建、Nginx 容器 HTTP/安全头检查和基础 VPS/DNS/TLS 部署已完成；GitHub Actions 自动部署仍需配置专用 SSH Secrets 后验证。Cloudflare、Search Console、真实用户性能测量和正式医学审核仍为 Pending。本仓库不包含生产凭据。

## 文档

- [项目主计划](docs/00-MASTER-PLAN.md)
- [系统架构](docs/architecture/SYSTEM-ARCHITECTURE.md)
- [技术 SEO](docs/seo/TECHNICAL-SEO.md)
- [内容模型](docs/content/CONTENT-SCHEMA.md)
- [发布清单](docs/compliance/RELEASE-CHECKLIST.md)
- [V0.1 验证证据](docs/evidence/V0.1-VERIFICATION.md)
- [V0.2 设计说明](docs/superpowers/specs/2026-11-27-okoct-v0.2-design.md)
- [V0.2 任务状态](docs/roadmap/V0.2-TASKS.md)
- [V0.2 验证证据](docs/evidence/V0.2-VERIFICATION.md)
- [V0.2.1 设计说明](docs/superpowers/specs/2026-11-27-okoct-v0.2.1-visual-refinement-design.md)
- [V0.2.1 实施计划](docs/superpowers/plans/2026-11-27-okoct-v0.2.1-visual-refinement-plan.md)
- [V0.2.1 验证证据](docs/evidence/V0.2.1-VERIFICATION.md)
