import { articleSchema, type ArticleFrontmatter } from "../schemas/content";

export function isPublishableContent(
  input: unknown,
): input is ArticleFrontmatter {
  const parsed = articleSchema.safeParse(input);

  return parsed.success && parsed.data.state === "published";
}

export function getPublicContent(
  entries: readonly ArticleFrontmatter[],
): ArticleFrontmatter[] {
  return entries.filter((entry) => isPublishableContent(entry));
}
