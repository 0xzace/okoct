# 部署说明

状态：配置已完成；生产部署 Pending，未执行 VPS、DNS、Cloudflare 或 TLS 变更。

## 本地静态构建

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

`pnpm build` 会先运行内容门禁，再执行 Astro static build 和 Pagefind；`pnpm validate:seo` 检查 `dist/`。

## Docker

```bash
docker build -t okoct:0.1.0 .
docker run --rm -p 8080:80 okoct:0.1.0
```

镜像使用多阶段 Node 构建和 Nginx 静态运行时，配置位于 `docker/nginx.conf`。实际镜像构建结果和镜像漏洞扫描必须以部署环境证据为准。

## VPS/Nginx

VPS 需要由授权人员配置 TLS、域名、日志、备份、最小权限和更新策略。当前仓库只提供容器内静态 Nginx 配置，不包含服务器密钥、域名证书或账号配置。

## Cloudflare 和 Search Console

Cloudflare DNS/CDN、缓存规则、WAF、TLS 模式、Search Console 验证和 sitemap 提交均为 Pending。生产上线前必须完成法律、医疗、隐私、安全和发布授权。
