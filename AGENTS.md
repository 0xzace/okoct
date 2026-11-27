OKOCT Health — Agent Instructions

1. Project Identity

- Name: OKOCT Health
- Domain: okoct.com
- Repository: okoct
- Product: Independent Health Knowledge Website
- Target Market: Thailand
- Primary Search Engine: Google
- Locales: th, en, zh-Hans

2. Instruction Priority

Follow the following project-level priority:

1. Legal compliance and medical safety.
2. User privacy and information security.
3. Explicit user requirements.
4. Approved product requirements.
5. Architecture decisions.
6. SEO specifications.
7. Engineering quality.
8. Implementation convenience.

Never sacrifice a higher-priority requirement for a lower-priority objective.

3. Required Reading

Before implementing a task, inspect the relevant documents:

- README.md
- docs/00-MASTER-PLAN.md
- docs/product/PRD-V1.0.md
- docs/architecture/SYSTEM-ARCHITECTURE.md
- docs/architecture/ADR.md
- docs/compliance/LEGAL-COMPLIANCE.md
- docs/compliance/RELEASE-CHECKLIST.md
- docs/seo/TECHNICAL-SEO.md
- docs/seo/INTERNATIONAL-SEO.md
- docs/content/CONTENT-SCHEMA.md
- docs/design/DESIGN-SYSTEM.md
- docs/roadmap/ROADMAP.md
- Current version task document

Do not assume that missing documents have already been approved.

4. Product Boundaries

OKOCT Health is an independent educational website.

It is not:

- A hospital.
- A clinic.
- A pharmacy.
- A prescription service.
- A pharmaceutical marketplace.
- A medical consultation platform.
- A drug affiliate marketing website.

5. Prohibited Features

Never implement:

- Prescription medication checkout.
- Drug purchasing or distribution services.
- Drug procurement referral services.
- Medical diagnosis.
- Personalized treatment recommendations.
- Personalized dosage recommendations.
- Prescription generation.
- Drug promotion commissions.
- Unverified medical testimonials.
- Guaranteed treatment outcomes.
- Sensitive health data collection.

Changes to the business model require explicit user approval and a new legal review.

6. Medical Content Policy

Never fabricate:

- Medical facts.
- Clinical evidence.
- References.
- Author identities.
- Medical credentials.
- Review records.
- Regulatory approvals.
- Publication dates.
- Medical partnerships.

All medical content must have verifiable sources.

AI-generated medical content must remain unpublished until qualified human review and applicable compliance review are completed.

Automated validation does not replace professional review.

7. Content Lifecycle

Use the following content states:

- draft
- fact-check-pending
- medical-review-pending
- compliance-review-pending
- translation-review-pending
- approved
- published
- archived

Only content with valid publication approval may enter the production website.

Draft and unapproved content must not be exposed through:

- Public HTML pages.
- Sitemap.
- Search index.
- RSS feeds.
- Structured data.
- Public content APIs.
- Public build artifacts.

8. Architecture Principles

- Prefer static generation.
- Prefer semantic HTML.
- Prefer Astro native components.
- Minimize client-side JavaScript.
- Avoid unnecessary dependencies.
- Avoid premature abstractions.
- Avoid premature optimization.
- Keep modules independently testable.
- Use TypeScript strict mode.
- Maintain explicit configuration.
- Record significant architectural decisions.

9. SEO Rules

Every indexable page must have:

- Valid HTTP status.
- Unique and descriptive title.
- Accurate meta description.
- Correct canonical URL.
- Semantic page structure.
- Appropriate language metadata.
- Valid indexability configuration.
- Accessible internal links.

Where applicable, include:

- Hreflang.
- Open Graph.
- Breadcrumb.
- JSON-LD.
- Author information.
- Medical reviewer information.
- References.
- Publication and update dates.

Never use:

- Keyword stuffing.
- Cloaking.
- Hidden text.
- Doorway pages.
- Link schemes.
- Fabricated reviews.
- Misleading structured data.
- Scaled low-value content.
- Fake author or reviewer identities.

SEO changes must preserve content accuracy and user trust.

10. Internationalization Rules

- Supported locales: th, en, zh-Hans.
- URL prefixes: th, en, zh.
- Default locale: th.
- Do not generate links to nonexistent translations.
- Do not publish unreviewed medical translations.
- Generate reciprocal hreflang relationships.
- Use self-referencing canonical URLs for independent localized pages.
- Preserve localized metadata.
- Avoid forced IP-based redirects.

11. Performance Rules

Target:

- LCP <= 2.5 seconds.
- INP <= 200 milliseconds.
- CLS <= 0.1.
- Minimal initial JavaScript.
- Responsive images.
- Efficient caching.
- Minimal render-blocking resources.

Treat laboratory measurements and real-user measurements as separate evidence.

Never claim performance targets have been achieved without measurements.

12. Accessibility Rules

Target WCAG 2.2 AA.

Requirements:

- Semantic HTML.
- Keyboard navigation.
- Visible focus indicators.
- Accessible labels.
- Sufficient contrast.
- Meaningful alternative text.
- Reduced-motion support.
- Responsive typography.
- Accessible theme switching.

13. Security Rules

- Never commit credentials.
- Never expose deployment secrets.
- Never expose private keys.
- Never expose private environment variables.
- Validate external input.
- Sanitize untrusted content.
- Minimize third-party scripts.
- Apply appropriate security headers.
- Review dependency vulnerabilities.
- Follow least-privilege access.

14. Privacy Rules

Do not collect:

- Medical records.
- Health conditions.
- Medication history.
- Prescription information.
- Body measurements linked to individuals.
- Other sensitive health information.

Analytics must be evaluated for applicable privacy requirements before activation.

15. Development Workflow

For every task:

1. Read relevant documentation.
2. Inspect existing implementation.
3. Identify dependencies.
4. Define acceptance criteria.
5. Implement the smallest complete solution.
6. Add or update tests.
7. Execute verification.
8. Update documentation.
9. Record evidence.
10. Update task status.

Do not mark a task as completed if required verification has not been performed.

16. Task Status

Supported task states:

- TODO
- READY
- IN_PROGRESS
- BLOCKED
- REVIEW
- DONE
- VERIFIED

DONE means implementation is complete.

VERIFIED means acceptance criteria have been satisfied with recorded evidence.

17. Git Rules

Use Conventional Commits:

- feat:
- fix:
- docs:
- refactor:
- test:
- perf:
- chore:
- ci:
- build:
- security:

Never modify unrelated user changes.

Never push, deploy, force-push, delete branches or modify production infrastructure without explicit authorization.

18. Release Gate

Before a release, verify:

- Type checking.
- Lint.
- Formatting.
- Unit tests.
- Integration tests.
- E2E tests.
- Production build.
- SEO validation.
- Accessibility checks.
- Security checks.
- Content publication eligibility.
- Documentation consistency.

Record all failed, skipped or unavailable checks.

Production release additionally requires explicit authorization and completion of applicable legal, medical and privacy review.

19. Evidence Requirements

Every verified task should record:

- Task ID.
- Implementation summary.
- Changed files.
- Verification commands.
- Verification results.
- Known limitations.
- Git commit when available.

Never fabricate evidence.

20. Scope Control

Implement only the approved current version.

Do not introduce:

- Databases.
- Microservices.
- Message queues.
- Complex CMS platforms.
- User account systems.
- Medical commerce.
- Unnecessary administration dashboards.

Such additions require an approved requirement and architecture decision.

21. Definition of Done

A task is complete only when:

- Requirements are satisfied.
- Implementation is maintainable.
- Relevant tests exist.
- Verification has been executed.
- Documentation is updated.
- Compliance constraints are respected.
- Known limitations are disclosed.

22. Continuous Improvement

Use real evidence to improve the website.

SEO experiments must record hypotheses, baseline metrics, implementation changes, observation windows, results and limitations.

Do not guarantee search rankings, indexing, traffic or medical outcomes.
