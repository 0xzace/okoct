# okoct.com DNS/TLS 部署记录

日期：2026-11-27（Asia/Shanghai）

## 任务

- 域名：`okoct.com`
- DNS 管理：NameSilo DNS（DNSOWL nameservers）
- 生产实例：Alibaba Cloud 轻量应用服务器
- 公网 IPv4：`47.79.19.48`

## 实施结果

- `okoct.com` 和 `www.okoct.com` 均解析到 `47.79.19.48`。公共 DNS 查询在服务器内部验证，避免本地代理 Fake-IP 结果干扰。
- 本地静态构建通过：`pnpm build`，生成 13 个页面和 Pagefind 产物。
- 构建产物部署到服务器 `/var/www/okoct`。
- Nginx 已安装并通过 `nginx -t`，HTTP 站点已启用安全响应头。
- Let's Encrypt 证书覆盖 `okoct.com` 和 `www.okoct.com`，有效期至 2027-02-25。
- Certbot timer 已启用；`certbot renew --dry-run` 模拟续期成功。

## 验证命令和结果

```text
dig @1.1.1.1 okoct.com A        -> 47.79.19.48（从生产服务器执行）
dig @8.8.8.8 www.okoct.com A    -> 47.79.19.48（从生产服务器执行）
curl --resolve okoct.com:80:47.79.19.48 http://okoct.com/
  -> 301 Location: https://okoct.com/
curl --resolve okoct.com:443:47.79.19.48 https://okoct.com/
  -> 200 OK
curl --resolve www.okoct.com:443:47.79.19.48 https://www.okoct.com/
  -> 200 OK
openssl s_client ...
  -> SAN: DNS:okoct.com, DNS:www.okoct.com
certbot renew --dry-run
  -> all simulated renewals succeeded
```

## 限制和后续事项

- 本地代理的 Fake-IP DNS 结果不适合作为公网 DNS 验证依据；直接测试应使用 `--noproxy '*'`、`--resolve` 或从生产服务器查询。
- 本次证书注册未配置通知邮箱，因此没有到期提醒邮件；Certbot 自动续期 timer 已启用，仍需保留定期运维检查。
- Cloudflare、Search Console、法律审核、医学审核、隐私评审和正式生产发布授权仍未完成。
- 本记录不代表性能目标、Google 收录或医学内容审核已完成。
