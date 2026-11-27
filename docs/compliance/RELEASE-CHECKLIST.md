# 发布清单

状态说明：`DONE` 表示实现完成；`VERIFIED` 表示已执行证据满足验收；`PENDING` 表示不能在当前证据下宣称完成。

## V0.1 工程门

- [x] 项目身份和边界文档化 — VERIFIED
- [x] `pnpm install --frozen-lockfile` — VERIFIED
- [x] TypeScript strict/typecheck — VERIFIED
- [x] ESLint — VERIFIED
- [x] Prettier — VERIFIED
- [x] Vitest 单元测试 — VERIFIED
- [x] 集成/静态产物测试 — VERIFIED
- [x] Playwright Chromium E2E — VERIFIED
- [x] Astro 生产构建和 Pagefind — VERIFIED
- [x] SEO metadata/sitemap/robots 验证 — VERIFIED
- [x] 内容发布门禁 — VERIFIED
- [x] Docker/Nginx 配置存在 — DONE；本地镜像构建因 Docker daemon 不可用而未验证
- [x] GitHub Actions 配置存在 — DONE；远程运行 Pending

## 医疗、法律和隐私门

- [ ] 正式医学内容来源核验 — PENDING
- [ ] 合格专业人员医学审核 — PENDING
- [ ] 法律合规评审 — PENDING
- [ ] 翻译专业审核 — PENDING
- [ ] 隐私政策、Cookie 和分析评估 — PENDING
- [ ] 生产秘密、TLS、Cloudflare 和 VPS 配置审查 — PENDING

## V0.3 工程门

- [x] 内容架构、实体 schema、生命周期和 repository — VERIFIED；见 `docs/content/`
- [x] 参考文献、审核记录和 fail-closed publication gate — VERIFIED；无真实医学批准被自动化制造
- [x] 文章/主题静态路径、首页、sitemap、hreflang、Pagefind 泄漏检查 — VERIFIED；当前公开文章为 0
- [x] 关键词、brief、主题集群、内部链接、翻译关系和内容审计 — VERIFIED；未知研究指标保持 null
- [x] CLI 和首批 12 项非公开内容规划 — VERIFIED
- [x] V0.3 完整本地验证 — VERIFIED；证据见 `docs/evidence/V0.3-VERIFICATION.md`

## 生产发布门

- [ ] 生产构建包签名/制品留档 — PENDING
- [ ] 生产 Nginx/TLS 健康检查 — PENDING
- [ ] DNS/Cloudflare 变更授权 — PENDING
- [ ] Search Console 验证和 sitemap 提交 — PENDING
- [ ] 实验室和真实用户 Core Web Vitals 测量 — PENDING
- [ ] 生产发布授权 — PENDING

## V0.4 Technical SEO 工程门

- [x] SEO 架构、规则等级和质量门禁文档 — VERIFIED
- [x] 本地 dist 爬取和页面快照 — VERIFIED
- [x] metadata、indexability、canonical、sitemap、robots 校验 — VERIFIED
- [x] JSON-LD、hreflang、内部链接、图片和重复内容候选校验 — VERIFIED
- [x] SEO 报告、CSV/JSON 产物和回归比较 — VERIFIED
- [x] SEO CLI 和本地质量门禁 — VERIFIED
- [x] CI 执行入口和报告 artifact 配置 — DONE；远程执行 Pending
- [ ] Lighthouse 实验室报告 — PENDING，需在可用浏览器环境实际运行
- [ ] 真实用户 Core Web Vitals — PENDING；不能由本地审计替代
- [ ] 生产服务器/Nginx 重定向和 HTTP 爬取验证 — PENDING
