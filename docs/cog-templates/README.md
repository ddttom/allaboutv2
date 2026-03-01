# COG Templates

Templates for creating Certificate of Genuineness (COG) documents across allaboutv2 content.

## What Are COGs?

A COG is a markdown file (`.cog.md`) with YAML frontmatter that provides:

1. **Certificate of Genuineness** — Trust layer: who published it, when, verification status
2. **Contract of Governance** — Accountability layer: who maintains it, review cycle, correction SLA

COGs make content readable by both humans and AI agents. The YAML is for machines. The markdown body is for people. Same truth, both audiences.

## Available Templates

| Template | Use For | Key Fields |
|----------|---------|------------|
| [landing-page.cog.template.md](landing-page.cog.template.md) | Marketing pages, product intros, coming-soon pages | `runbook` (under `mx:`), `subject.scope` |
| [eds-block.cog.template.md](eds-block.cog.template.md) | EDS blocks documentation | `block.content_model`, `block.decoration` |
| [documentation.cog.template.md](documentation.cog.template.md) | Technical docs, guides, specifications | `documentation.type`, `documentation.audience` |

## Compliance Levels

These templates target **Level 2** compliance:

| Level | Name | Requirements | Use Case |
|-------|------|--------------|----------|
| 1 | Basic | YAML present, publisher identified | Internal docs |
| **2** | **Structured** | **MX-compliant structure, maintainer identified** | **Public docs** |
| 3 | Signed | Cryptographically signed, review cycle defined | REGINALD minimum |
| 4 | Registered | Signed + registered with SLA | Commercial docs |
| 5 | Audited | Signed + registered + third-party verified | Regulated industries |

## How to Use

### Step 1: Copy the Template

```bash
cp docs/cog-templates/landing-page.cog.template.md cogs/my-publisher/my-page.cog.md
```

### Step 2: Replace Placeholders

All placeholders use `{placeholder}` format. Replace:

- `{Publisher Name}` → Your organization
- `{subject-slug}` → kebab-case identifier
- `{YYYYMMDD}` → Date in format 20260222
- `{email@example.com}` → Contact email
- All other `{...}` placeholders

### Step 3: Write the Narrative Body

The markdown body below the YAML should tell the same story as the structured data — but for humans. Don't just repeat the YAML. Explain context, provide examples, make it readable.

### Step 4: Validate Structure

Check that your COG has:

- [ ] `cog:` section with `id`, `publisher`, `subject`
- [ ] `governance:` section with `maintainer`, `review_cycle`
- [ ] Human-readable narrative body
- [ ] No remaining `{placeholder}` text

## File Naming

COG files follow this pattern:

```
{subject-slug}.cog.md
```

Examples:

- `coming-soon.cog.md`
- `header-block.cog.md`
- `api-reference.cog.md`

## Directory Structure

```
cogs/
├── mx-reginald/           # Publisher: MX Reginald Ltd
│   ├── cog-system.cog.md
│   └── maxine.cog.md
├── {your-publisher}/      # Your publisher ID
│   └── {subject}.cog.md
```

## ID Format

COG IDs follow this pattern:

```
cog-{publisher-id}-{subject-slug}-{YYYYMMDD}
```

Examples:

- `cog-mx-reginald-cog-system-20260208`
- `cog-allabout-header-block-20260222`

## Template-Specific Fields

### Landing Page Template

The `mx:` section includes:

```yaml
mx:
  contentType: "landing-page"
  audience: ["humans", "machines"]
  runbook: |
    Instructions for how AI agents should use this page.
```

### EDS Block Template

The `block:` section includes:

```yaml
block:
  name: "block-name"
  contentModel:
    rows:
      - name: "Row 1"
        purpose: "What it contains"
        required: true
  decoration:
    approach: "decorate()"
    transforms:
      - "DOM transformation description"
```

### Documentation Template

The `documentation:` section includes:

```yaml
documentation:
  type: "specification"  # or tutorial, reference, guide, api
  audience:
    primary: "developers"
    expertise_level: "intermediate"
  prerequisites:
    - "Familiarity with EDS"
```

## Upgrading Compliance Levels

To move from Level 2 to Level 3:

1. Ensure all required fields are complete
2. Define specific `update_triggers`
3. Set a concrete `correction_sla`
4. Submit for cryptographic signing

## See Also

- [cog-system.cog.md](../../cogs/mx-reginald/cog-system.cog.md) — The canonical COG about COGs
- [REGINALD Registry](https://allabout.network) — Public COG registry

---

*Cog-Nova-MX Ltd — Design for machines. Benefit humans. Advance both.*
