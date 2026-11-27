import type { APIRoute } from "astro";

import { getSitemapUrl } from "../seo/sitemap";

export const GET: APIRoute = () =>
  new Response(
    ["User-agent: *", "Allow: /", `Sitemap: ${getSitemapUrl()}`, ""].join("\n"),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
