# 部署说明

状态：2026-11-27 已完成 okoct.com 的基础生产部署、DNS 指向和 TLS 配置；Cloudflare、Search Console 及正式内容发布仍为 Pending。

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

当前生产实例为 Alibaba Cloud 轻量应用服务器，公网 IPv4 为 `47.79.19.48`。已安装 Nginx、Certbot 和 `python3-certbot-nginx`，构建产物部署到 `/var/www/okoct`，并通过 `/etc/nginx/sites-enabled/okoct.conf` 提供静态页面。

Let's Encrypt 证书覆盖 `okoct.com` 和 `www.okoct.com`，证书文件由 Certbot 管理；Certbot timer 已启用自动续期。部署证据见 [DNS/TLS 部署记录](../evidence/DNS-TLS-DEPLOYMENT-2026-11-27.md)。

## GitHub Actions 自动部署

`.github/workflows/ci.yml` 在完整验证通过后上传静态构建 artifact；`.github/workflows/deploy.yml` 仅在 `main` 分支 CI 成功后自动部署，也支持 `main` 分支的手动触发。部署流程使用专用 SSH 私钥和固定的 `admin` 用户，不使用 root 密码。

GitHub 仓库需要配置以下 Secrets：

- `OKOCT_DEPLOY_HOST`：`47.79.19.48`
- `OKOCT_DEPLOY_USER`：服务器上的非 root 部署用户，例如 `admin`
- `OKOCT_DEPLOY_SSH_PRIVATE_KEY`：专用 ED25519 私钥
- `OKOCT_DEPLOY_KNOWN_HOSTS`：服务器 SSH 主机公钥，例如 `ssh-keyscan -t ed25519 47.79.19.48` 的结果

服务器上的部署用户必须能够通过 SSH 登录，并对 `/var/www/okoct` 执行 `sudo rsync`、`sudo nginx -t` 和 `sudo systemctl reload nginx`。本地修改不会自动创建 GitHub Secrets；首次运行前必须完成密钥安装和 Secrets 配置。

## Cloudflare 和 Search Console

本次部署使用 NameSilo DNS + Alibaba Cloud VPS，未接入 Cloudflare CDN/WAF。Cloudflare DNS/CDN、缓存规则、WAF、Search Console 验证和 sitemap 提交仍为 Pending。正式发布前必须完成法律、医疗、隐私、安全和发布授权。
