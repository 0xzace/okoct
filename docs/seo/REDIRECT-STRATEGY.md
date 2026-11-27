# Redirect Strategy

重定向规则必须是显式、同源、可审计的 `from -> to` 映射。支持 301、302、307、308，并保留 404/410 用于确实移除且没有替代内容的 URL。

SEO Engine 检查重定向链和循环；链产生 Warning，循环产生 Error 并阻断。sitemap 不得包含重定向 URL。Nginx 生产集成仍需在实际部署环境单独验证。
