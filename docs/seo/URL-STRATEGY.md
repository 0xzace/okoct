# URL Strategy

- 根路径 `/` 是语言入口，不做 IP 或浏览器语言强制跳转。
- `th`、`en`、`zh-Hans` 分别使用 `/th/`、`/en/`、`/zh/`。
- 目录页使用尾斜杠；canonical、内部链接和 sitemap 使用同一规范化 URL。
- 搜索页和错误页不是公开内容集合，不进入 sitemap。
- 文章和专题 URL 只有在 Publication Gate 允许时才生成。
- URL 迁移使用显式 redirect map，不把所有失效 URL 重定向到首页。
