import { referenceSchema, type Reference } from "../schemas/entities";

export type ReferenceIssue = {
  code: "schema-invalid" | "missing-locator" | "not-medically-verified";
  message: string;
};

export function validateReference(reference: unknown): ReferenceIssue[] {
  const parsed = referenceSchema.safeParse(reference);

  if (!parsed.success) {
    return [
      {
        code: "schema-invalid",
        message: "Reference metadata does not match the reference schema.",
      },
    ];
  }

  const issues: ReferenceIssue[] = [];
  const value = parsed.data;

  if (!value.url && !value.doi) {
    issues.push({
      code: "missing-locator",
      message: `${value.id} requires a URL or DOI.`,
    });
  }

  if (value.verification.status !== "verified") {
    issues.push({
      code: "not-medically-verified",
      message: `${value.id} is not medically verified.`,
    });
  }

  return issues;
}

export function canonicalReferenceKey(
  reference: Pick<Reference, "url" | "doi">,
): string | null {
  if (reference.doi) return `doi:${reference.doi.toLowerCase()}`;
  if (!reference.url) return null;

  const url = new URL(reference.url);
  url.hash = "";
  return `url:${url.toString()}`;
}
