# Technical SEO

## 页面契约

每个 V0.1 公开 HTML 页面都通过 `buildSeoMetadata()` 生成：

- 唯一页面标题和描述。
- self-referencing absolute canonical。
- `index,follow` robots；非公开内容不得生成页面。
- Open Graph 和 Twitter summary metadata。
- 当前语言及真实存在语言的 hreflang。
- 语义 HTML、可访问内部链接和 JSON-LD WebPage/WebSite/BreadcrumbList。

## URL 和状态

- 根路径 `/` 是语言入口，不做 IP 强制跳转。
- 语言路径为 `/th/`、`/en/`、`/zh/`。
- Astro static build 生成目录式页面和真实 404 页面。
- 404 页面使用 `noindex,nofollow`，不进入 sitemap 或公开内容集合。
- Nginx 只提供构建产物，不进行应用层重写。

## Sitemap 与 robots

`src/seo/sitemap.ts` 从显式公开路线记录生成 sitemap；当前不包含 `/zh/safety/`，因为该翻译不存在。`robots.txt` 公开爬取并指向 `https://okoct.com/sitemap.xml`。

## 结构化数据

V0.1 只输出真实的 WebSite、WebPage 和 BreadcrumbList。没有正式医学文章，因此不输出虚假的 Article、MedicalWebPage、作者或医学审核人结构化数据。

## 验证

`tests/integration/seo-output.test.ts` 和 `scripts/validate-build.mjs` 检查页面集合、title、description、canonical、自身 hreflang、sitemap、robots 和测试内容泄漏。SEO 验证不等于 Google 收录或排名证明。

## 待测量指标

LCP ≤ 2.5 秒、INP ≤ 200 毫秒、CLS ≤ 0.1 是目标值。当前没有真实用户性能数据，也没有宣称目标已达成。
