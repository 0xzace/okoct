import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { articleSchema } from "./schemas/content";

const articles = defineCollection({
  loader: glob({ base: "./src/content/articles", pattern: "**/*.{md,mdx}" }),
  schema: articleSchema,
});

export const collections = { articles };
