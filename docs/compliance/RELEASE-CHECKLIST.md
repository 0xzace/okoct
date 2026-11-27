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

## 生产发布门

- [ ] 生产构建包签名/制品留档 — PENDING
- [ ] 生产 Nginx/TLS 健康检查 — PENDING
- [ ] DNS/Cloudflare 变更授权 — PENDING
- [ ] Search Console 验证和 sitemap 提交 — PENDING
- [ ] 实验室和真实用户 Core Web Vitals 测量 — PENDING
- [ ] 生产发布授权 — PENDING
