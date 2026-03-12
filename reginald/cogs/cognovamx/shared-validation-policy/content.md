---
name: shared-validation-policy
version: "1.0"
description: "Shared validation policy for cog publication. Included by action-docs that validate cogs before registration."
created: 2026-03-04
modified: 2026-03-04
author: "Tom Cranstoun and Maxine"

mx:
  status: active
  contentType: policy
  category: mx-core
  partOf: mx-os
  tags: [validation, policy, shared, includes-example]
  audience: [ai-agents, developers]
  license: proprietary
  deliverable: "reusable validation rules for cog quality gates"
---

# Shared Validation Policy

This cog exists to be included by other cogs. It contains the validation rules that every cog publication workflow must enforce. Rather than duplicating these rules in every action-doc, action-docs include this cog using the `includes` mechanism.

## Validation Rules

Every cog must satisfy these rules before entering the REGINALD registry:

1. **Required fields present.** `name`, `version`, `description`, `created`, `modified`, `author` — all mandatory.
2. **Two-zone YAML.** Zone 1 (document identity) at top level. Zone 2 (operational metadata) under `mx:`. No Zone 1 fields inside `mx:`.
3. **Field dictionary compliance.** Every field name must appear in `mx-canon/ssot/fields.cog.md`. Invented fields are not permitted.
4. **Markdown lint clean.** The file must pass `markdownlint-cli2` with the repository's `.markdownlint-cli2.jsonc` configuration. Zero errors.
5. **British English in prose.** Organise, colour, recognised. International standards in code and metadata (`"Organization"` in Schema.org contexts).
6. **Action cogs use proprietary licence.** Action-docs in the `scripts/` folder use `license: proprietary`, not MIT.
7. **Status reflects readiness.** Never publish a cog with `status: draft` to the registry. Set `status: published` before registration.
8. **Description is substantive.** The `description` field must explain what the cog does, not restate its name. Maximum 160 characters.

## Override Guidance

When an action-doc includes this policy, it may override individual rules by restating them in its own SOP or policy block. The including cog's version takes precedence. Common overrides:

- **Licence override.** Open-source cogs may override rule 6 with `license: MIT`.
- **Status override.** Internal-only cogs may remain `status: active` without requiring `status: published`.

Rules not explicitly overridden remain in force from this shared policy.
