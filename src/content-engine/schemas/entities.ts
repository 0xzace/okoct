import { z } from "astro/zod";

import { SUPPORTED_LOCALES } from "../../i18n/config";

export const CONTENT_STATES = [
  "planned",
  "brief",
  "draft",
  "fact-check-pending",
  "medical-review-pending",
  "compliance-review-pending",
  "translation-review-pending",
  "approved",
  "published",
  "update-required",
  "withdrawn",
  "archived",
] as const;

export const contentStateSchema = z.enum(CONTENT_STATES);
export const localeSchema = z.enum(SUPPORTED_LOCALES);
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const idSchema = (prefix: string) =>
  z.string().regex(new RegExp(`^${prefix}-[A-Z0-9-]+$`));
const nullableDate = z.coerce.date().nullable().optional();

const localizedEntitySchema = z.object({
  locale: localeSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  state: contentStateSchema,
});

export const topicSchema = localizedEntitySchema.extend({
  id: idSchema("TOP"),
  slug: slugSchema,
  parentTopicId: idSchema("TOP").nullable().optional(),
  priority: z.enum(["P0", "P1", "P2"]).default("P1"),
});

export const clusterSchema = localizedEntitySchema.extend({
  id: idSchema("CLUSTER"),
  slug: slugSchema,
  topicId: idSchema("TOP"),
  pillarArticleId: idSchema("ART").nullable().optional(),
});

export const keywordSchema = z.object({
  id: idSchema("KW"),
  keyword: z.string().min(1),
  locale: localeSchema,
  market: z.literal("TH"),
  searchEngine: z.literal("google"),
  intent: z.enum([
    "informational",
    "navigational",
    "commercial",
    "transactional",
  ]),
  topicId: idSchema("TOP"),
  clusterId: idSchema("CLUSTER").nullable(),
  primaryPageId: idSchema("ART").nullable(),
  secondaryPageIds: z.array(idSchema("ART")),
  status: z.enum([
    "candidate",
    "researched",
    "validated",
    "mapped",
    "rejected",
    "archived",
  ]),
  compliance: z.object({
    status: z.enum(["pending", "approved", "rejected"]),
    commercialIntent: z.boolean(),
    medicalReviewRequired: z.boolean(),
  }),
  research: z.object({
    status: z.enum(["pending", "researched", "validated"]),
    searchVolume: z.number().nonnegative().nullable(),
    keywordDifficulty: z.number().nonnegative().nullable(),
    cpc: z.number().nonnegative().nullable(),
    serpFeatures: z.array(z.string()),
    source: z.url().nullable(),
    researchedAt: nullableDate,
  }),
});

export const contentBriefSchema = z.object({
  id: idSchema("BRIEF"),
  locale: localeSchema,
  market: z.literal("TH"),
  topicId: idSchema("TOP"),
  clusterId: idSchema("CLUSTER"),
  searchIntent: z.enum([
    "informational",
    "navigational",
    "commercial",
    "transactional",
  ]),
  primaryKeywordId: idSchema("KW"),
  secondaryKeywordIds: z.array(idSchema("KW")),
  targetAudience: z.string().min(1),
  contentObjective: z.string().min(1),
  proposedTitle: z.string().min(1),
  proposedUrl: slugSchema,
  articleOutline: z.array(z.string().min(1)).min(1),
  userQuestions: z.array(z.string().min(1)),
  evidenceRequirements: z.array(z.string().min(1)).min(1),
  referenceRequirements: z.array(z.string().min(1)).min(1),
  internalLinkOpportunities: z.array(z.string().min(1)),
  complianceRisks: z.array(z.string().min(1)),
  medicalReviewRequired: z.boolean(),
  acceptanceCriteria: z.array(z.string().min(1)).min(1),
  status: z.enum(["planned", "brief", "in-progress", "ready", "archived"]),
});

const identitySchema = z.object({
  id: z.string().regex(/^(AUTH|REV)-[A-Z0-9-]+$/),
  name: z.string().min(1),
  locale: localeSchema,
  verified: z.boolean(),
  publicBio: z.string().nullable().optional(),
});

export const authorSchema = identitySchema.extend({ id: idSchema("AUTH") });
export const reviewerSchema = identitySchema.extend({
  id: idSchema("REV"),
  role: z.enum([
    "fact-checker",
    "medical-reviewer",
    "compliance-reviewer",
    "language-reviewer",
  ]),
});

export const referenceSchema = z.object({
  id: idSchema("REF"),
  type: z.enum([
    "regulatory-document",
    "official-drug-label",
    "clinical-guideline",
    "systematic-review",
    "meta-analysis",
    "clinical-trial",
    "academic-publication",
    "government-publication",
    "safety-alert",
  ]),
  title: z.string().min(1),
  publisher: z.string().min(1),
  authors: z.array(z.string()),
  url: z.url().nullable(),
  doi: z
    .string()
    .regex(/^10\..+$/)
    .nullable(),
  publicationDate: nullableDate,
  accessedAt: z.coerce.date(),
  jurisdiction: z.string().min(2),
  language: localeSchema,
  verification: z.object({
    status: z.enum(["pending", "verified", "rejected"]),
    verifiedAt: nullableDate,
    verifiedBy: z.string().nullable(),
  }),
  license: z.object({ status: z.enum(["unknown", "open", "restricted"]) }),
  notes: z.string(),
});

export const reviewRecordSchema = z.object({
  id: idSchema("REVREC"),
  articleId: idSchema("ART"),
  articleRevision: z.number().int().positive(),
  contentHash: z.string().min(1),
  reviewerId: idSchema("REV"),
  reviewType: z.enum([
    "fact-check",
    "medical",
    "compliance",
    "language",
    "editorial",
  ]),
  status: z.enum(["pending", "valid", "expired", "rejected"]),
  decision: z.enum(["pending", "approve", "request-changes", "reject"]),
  reviewedAt: nullableDate,
  expiresAt: nullableDate,
  scope: z.array(z.string().min(1)),
  comments: z.array(z.string()),
  evidence: z.array(idSchema("REF")),
});

export const publicationApprovalSchema = z.object({
  id: idSchema("APPROVAL"),
  articleId: idSchema("ART"),
  articleRevision: z.number().int().positive(),
  contentHash: z.string().min(1),
  approvedBy: z.string().min(1),
  approvedAt: z.coerce.date(),
  status: z.enum(["approved", "revoked"]),
});

export const translationGroupSchema = z.object({
  id: idSchema("TRANSLATION"),
  translationKey: z.string().regex(/^ART-[A-Z0-9-]+$/),
  sourceArticleId: idSchema("ART"),
  articleIds: z.array(idSchema("ART")),
  statuses: z.record(
    localeSchema,
    z.enum([
      "planned",
      "in-progress",
      "review-pending",
      "published",
      "missing",
    ]),
  ),
});

export const revisionSchema = z.object({
  id: idSchema("REVISION"),
  articleId: idSchema("ART"),
  revision: z.number().int().positive(),
  contentHash: z.string().min(1),
  changedAt: z.coerce.date(),
  changedBy: z.string().min(1),
  summary: z.string().min(1),
});

export const correctionSchema = z.object({
  id: idSchema("CORRECTION"),
  articleId: idSchema("ART"),
  revision: z.number().int().positive(),
  publishedAt: z.coerce.date(),
  summary: z.string().min(1),
  reason: z.string().min(1),
});

export const internalLinkSchema = z.object({
  id: idSchema("LINK"),
  sourceArticleId: idSchema("ART"),
  targetArticleId: idSchema("ART"),
  type: z.enum([
    "pillar-cluster",
    "cluster-pillar",
    "related",
    "contextual",
    "breadcrumb",
    "reference",
  ]),
  anchor: z.string().min(1),
  locale: localeSchema,
});

export const redirectSchema = z.object({
  id: idSchema("REDIRECT"),
  from: slugSchema,
  to: slugSchema,
  statusCode: z.enum(["301", "308"]),
  reason: z.string().min(1),
});

export const articleEntitySchema = z
  .object({
    id: idSchema("ART"),
    translationKey: z.string().regex(/^ART-[A-Z0-9-]+$/),
    locale: localeSchema,
    slug: slugSchema,
    type: z.enum(["pillar", "guide", "glossary"]),
    title: z.string().min(1),
    description: z.string().min(1),
    summary: z.string().min(1),
    topicId: idSchema("TOP"),
    clusterId: idSchema("CLUSTER"),
    contentBriefId: idSchema("BRIEF"),
    state: contentStateSchema,
    visibility: z.enum(["test-only", "public"]),
    indexable: z.boolean(),
    revision: z.number().int().positive(),
    contentHash: z.string().min(1).nullable(),
    authorIds: z.array(idSchema("AUTH")),
    reviewerIds: z.array(idSchema("REV")),
    referenceIds: z.array(idSchema("REF")),
    reviewRecordIds: z.array(idSchema("REVREC")),
    publicationApprovalId: idSchema("APPROVAL").nullable(),
    relatedArticleIds: z.array(idSchema("ART")).default([]),
    seo: z.object({
      index: z.boolean(),
      follow: z.boolean(),
      canonical: z.literal("self"),
      schemaType: z.literal("MedicalWebPage"),
    }),
    publishedAt: nullableDate,
    updatedAt: nullableDate,
  })
  .superRefine((article, context) => {
    if (article.state !== "published") return;

    const requirements: Array<[string, boolean]> = [
      ["contentHash", Boolean(article.contentHash)],
      ["authorIds", article.authorIds.length > 0],
      ["reviewerIds", article.reviewerIds.length > 0],
      ["referenceIds", article.referenceIds.length > 0],
      ["reviewRecordIds", article.reviewRecordIds.length > 0],
      ["publicationApprovalId", Boolean(article.publicationApprovalId)],
      ["publishedAt", Boolean(article.publishedAt)],
      ["public visibility", article.visibility === "public"],
      ["indexable", article.indexable && article.seo.index],
    ];

    for (const [field, valid] of requirements) {
      if (!valid) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: `Published articles require ${field}.`,
        });
      }
    }
  });

export type ContentState = z.infer<typeof contentStateSchema>;
export type ArticleEntity = z.infer<typeof articleEntitySchema>;
export type Topic = z.infer<typeof topicSchema>;
export type Cluster = z.infer<typeof clusterSchema>;
export type Keyword = z.infer<typeof keywordSchema>;
export type ContentBrief = z.infer<typeof contentBriefSchema>;
export type Author = z.infer<typeof authorSchema>;
export type Reviewer = z.infer<typeof reviewerSchema>;
export type Reference = z.infer<typeof referenceSchema>;
export type ReviewRecord = z.infer<typeof reviewRecordSchema>;
export type PublicationApproval = z.infer<typeof publicationApprovalSchema>;
