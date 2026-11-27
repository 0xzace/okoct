# 系统架构

状态：V0.1 Verified（本地构建）；生产运行 Pending。

## 架构概览

```text
读者浏览器
    │ HTTPS
    ▼
Cloudflare / VPS Nginx（部署边界，Pending）
    │ 静态文件
    ▼
Astro dist/
    ├── /、/th/、/en/、/zh/
    ├── /sitemap.xml、/robots.txt
    └── pagefind/（V0.1 只生成索引，不提供搜索 UI）

构建阶段
    ├── Astro + TypeScript strict
    ├── i18n registry / dictionaries / routes
    ├── SEO metadata / structured data / sitemap
    ├── Content Collection + Zod
    ├── validate-content
    └── Astro build + Pagefind + validate-build
```

## 目录职责

- `src/config`：站点身份和不含秘密的显式配置。
- `src/i18n`：语言注册表、字典、本地化路线和翻译关系。
- `src/seo`：URL、metadata、JSON-LD、sitemap。
- `src/schemas`：内容状态、字段和发布资格 schema。
- `src/content`：构建时内容；V0.1 fixture 是 draft/test-only。
- `src/components`、`src/layouts`、`src/pages`：语义页面结构和页面输出。
- `scripts`：构建前内容门禁和构建后产物验证。
- `infrastructure`：V0.1 暂不创建运行时基础设施；Docker/Nginx 配置位于根目录和 `docker/`。

## 渲染与数据流

1. `getStaticPaths()` 只生成显式支持的语言和页面组合。
2. 页面通过统一 `buildSeoMetadata()` 生成 canonical、robots、Open Graph 和 alternate links。
3. Astro 在构建时读取 Content Collection；V0.1 没有文章页面，draft fixture 不会被路由引用。
4. `validate-content` 在构建前阻止非法公开状态。
5. `validate-build` 在构建后检查页面集合、metadata、sitemap、robots 和测试内容泄漏。

## 安全与隐私

V0.1 不接收表单、不创建账号、不保存健康数据、不读取服务器端秘密。Nginx 配置提供基础安全响应头；真实 TLS、密钥管理、Cloudflare WAF 和访问控制需在部署前单独评审。
