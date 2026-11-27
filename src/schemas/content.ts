import { z } from "astro/zod";

import { CONTENT_STATES } from "../content-engine/schemas/entities";
import { SUPPORTED_LOCALES } from "../i18n/config";

export const ARTICLE_CONTENT_STATES = CONTENT_STATES;

export const contentStateSchema = z.enum(ARTICLE_CONTENT_STATES);
export const localeSchema = z.enum(SUPPORTED_LOCALES);
export const contentVisibilitySchema = z.enum(["test-only", "public"]);

const reviewDateSchema = z.coerce.date().optional();

export const articleSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    locale: localeSchema,
    state: contentStateSchema,
    visibility: contentVisibilitySchema,
    indexable: z.boolean(),
    sources: z.array(z.url()),
    author: z.string().min(1).optional(),
    medicalReviewer: z.string().min(1).optional(),
    factCheckedAt: reviewDateSchema,
    medicallyReviewedAt: reviewDateSchema,
    complianceReviewedAt: reviewDateSchema,
    translationReviewedAt: reviewDateSchema,
    publishedAt: reviewDateSchema,
    updatedAt: reviewDateSchema,
    id: z.string().optional(),
    translationKey: z.string().optional(),
    slug: z.string().optional(),
    type: z.enum(["pillar", "guide", "glossary"]).optional(),
    topicId: z.string().optional(),
    clusterId: z.string().optional(),
    contentBriefId: z.string().optional(),
    revision: z.number().int().positive().optional(),
    contentHash: z.string().nullable().optional(),
    authorIds: z.array(z.string()).optional(),
    reviewerIds: z.array(z.string()).optional(),
    referenceIds: z.array(z.string()).optional(),
    reviewRecordIds: z.array(z.string()).optional(),
    publicationApprovalId: z.string().nullable().optional(),
    seo: z
      .object({
        index: z.boolean(),
        follow: z.boolean(),
        canonical: z.literal("self"),
        schemaType: z.literal("MedicalWebPage"),
      })
      .optional(),
  })
  .superRefine((article, context) => {
    const isPublished = article.state === "published";

    if (
      !isPublished &&
      (article.visibility === "public" || article.indexable)
    ) {
      context.addIssue({
        code: "custom",
        path: ["state"],
        message: "Only published content may be public or indexable.",
      });
    }

    if (!isPublished) {
      return;
    }

    if (article.visibility !== "public") {
      context.addIssue({
        code: "custom",
        path: ["visibility"],
        message: "Published content must use public visibility.",
      });
    }

    if (!article.indexable) {
      context.addIssue({
        code: "custom",
        path: ["indexable"],
        message: "Published content must be explicitly indexable.",
      });
    }

    if (article.sources.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["sources"],
        message: "Published content requires at least one verifiable source.",
      });
    }

    const requiredReviewFields = [
      ["author", article.author],
      ["medicalReviewer", article.medicalReviewer],
      ["factCheckedAt", article.factCheckedAt],
      ["medicallyReviewedAt", article.medicallyReviewedAt],
      ["complianceReviewedAt", article.complianceReviewedAt],
      ["translationReviewedAt", article.translationReviewedAt],
      ["publishedAt", article.publishedAt],
    ] as const;

    for (const [field, value] of requiredReviewFields) {
      if (!value) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: `Published content requires ${field}.`,
        });
      }
    }
  });

export type ContentState = z.infer<typeof contentStateSchema>;
export type ArticleFrontmatter = z.infer<typeof articleSchema>;
