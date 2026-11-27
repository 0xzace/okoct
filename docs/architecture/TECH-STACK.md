# 技术栈

版本以 `package.json` 和 `pnpm-lock.yaml` 为准；以下为本次初始化实际配置的版本。

| 层               | 技术                                            | 版本/状态                                                      |
| ---------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| Runtime          | Node.js                                         | 当前环境 v24.22.3；Astro 要求 `>=22.23.4`                      |
| Package manager  | pnpm                                            | 10.24.0                                                        |
| Site framework   | Astro                                           | 7.4.13                                                         |
| Language         | TypeScript                                      | 6.0.3，strictest 配置                                          |
| CSS              | Tailwind CSS + `@tailwindcss/vite`              | 4.3.5                                                          |
| Content          | Markdown/MDX loader + Astro Content Collections | Astro 7 内置接口                                               |
| Validation       | Zod                                             | 4.6.7，通过 `astro/zod` 使用                                   |
| Unit/integration | Vitest                                          | 5.1.2                                                          |
| Browser E2E      | Playwright                                      | 1.65.1；Chromium 已在本地安装并执行                            |
| Lint/format      | ESLint / Prettier                               | ESLint 10.15.0 / Prettier 3.10.1                               |
| Search index     | Pagefind                                        | 1.6.0，V0.1 仅构建索引                                         |
| Image capability | Sharp                                           | 0.35.5，V0.1 没有医学图片内容                                  |
| Static serving   | Nginx                                           | Dockerfile 使用 `nginx:1.29-alpine`，镜像拉取/安全审查 Pending |
| Container build  | Docker                                          | 多阶段 Node 构建 + Nginx 静态运行时                            |
| CI               | GitHub Actions                                  | `.github/workflows/ci.yml`，远程运行 Pending                   |
| CDN/DNS          | Cloudflare                                      | 仅作为部署边界记录，未接入账号                                 |

## 依赖原则

V0.1 不引入数据库、后端、Redis、队列、微服务、CMS、用户系统或不必要的 UI 框架。依赖版本必须锁定，升级需要重新执行完整验证。
