import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { articleEntitySchema } from "../content-engine/schemas/entities";
import { PUBLICATION_CONTEXT } from "../content-engine/repository/publication-context";
import { INITIAL_TOPICS } from "../content-engine/data/planning";
import { renderSitemapXml } from "../seo/sitemap";

export const GET: APIRoute = async () => {
  const entries = await getCollection("articles");
  const articles = entries
    .map((entry) => {
      const parsed = articleEntitySchema.safeParse(entry.data);
      return parsed.success ? parsed.data : undefined;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);

  return new Response(
    renderSitemapXml({
      articles,
      context: PUBLICATION_CONTEXT,
      topics: INITIAL_TOPICS,
    }),
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
