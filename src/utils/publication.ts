import { articleSchema, type ArticleFrontmatter } from "../schemas/content";
import { articleEntitySchema } from "../content-engine/schemas/entities";
import {
  evaluatePublication,
  type PublicationContext,
} from "../content-engine/publication/gate";

export function isPublishableContent(
  input: unknown,
): input is ArticleFrontmatter {
  const parsed = articleSchema.safeParse(input);

  return parsed.success && parsed.data.state === "published";
}

export function getPublicContent(
  entries: readonly ArticleFrontmatter[],
  context?: PublicationContext,
): ArticleFrontmatter[] {
  if (!context) {
    return entries.filter((entry) => {
      if (entry.id) {
        const parsed = articleEntitySchema.safeParse(entry);
        return (
          parsed.success &&
          evaluatePublication(parsed.data, {
            authors: [],
            reviewers: [],
            references: [],
            reviews: [],
            approvals: [],
          }).allowed
        );
      }
      return isPublishableContent(entry);
    });
  }

  return entries.filter((entry) => {
    const parsed = articleEntitySchema.safeParse(entry);
    return parsed.success && evaluatePublication(parsed.data, context).allowed;
  });
}
