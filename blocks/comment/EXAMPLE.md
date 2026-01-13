# Comment Block - Author Usage Guide

The Comment block allows content authors to add editorial notes, reminders, and collaboration comments directly within documents. These comments are visible in the authoring environment but completely hidden from the published website.

## Quick Start

Add a comment anywhere in your document:

| Comment |
| --- |
| TODO: Update this section before publishing |

**Result:** The comment appears in your authoring environment but never on the published website.

---

## Usage Examples

### Example 1: Basic TODO Note

**Use Case:** Remind yourself to update content

| Comment |
| --- |
| TODO: Add Q4 sales data when available |

**When to Use:** Content placeholders, pending updates, reminders

---

### Example 2: Content Review Checklist

**Use Case:** Track review requirements before publishing

| Comment |
| --- |
| **Pre-Publish Checklist** |
| - Verify all dates are current |
| - Check all links are working |
| - Review for brand compliance |
| - Legal approval: PENDING |

**When to Use:** Quality assurance, review workflows, compliance tracking

---

### Example 3: Team Collaboration

**Use Case:** Leave notes for other team members

| Comment |
| --- |
| @Sarah: Please review technical accuracy |
| @Marketing: Approve messaging before go-live |
| @Legal: Need compliance sign-off |

**When to Use:** Team collaboration, approval workflows, role assignments

---

### Example 4: Workflow Status

**Use Case:** Track content development status

| Comment |
| --- |
| STATUS: Draft - awaiting stakeholder review |
| OWNER: Marketing Team |
| DUE DATE: 2025-12-15 |
| DEPENDENCIES: Product launch announcement |

**When to Use:** Project management, status tracking, dependency management

---

### Example 5: Version Notes

**Use Case:** Track changes and version history

| Comment |
| --- |
| **Version 2.1 Changes** |
| - Updated pricing table (line 45) |
| - Added new testimonial section |
| - Removed outdated feature comparison |
| - Last updated: 2025-11-20 by Tom |

**When to Use:** Change tracking, version control, audit trails

---

### Example 6: Content Planning

**Use Case:** Plan future content additions

| Comment |
| --- |
| PLACEHOLDER: Customer testimonials section |
| Waiting on: Marketing testimonial collection campaign |
| Target completion: End of Q4 2025 |
| Note: Need 3-5 testimonials with photos |

**When to Use:** Content roadmaps, placeholder sections, upcoming features

---

### Example 7: SEO Notes

**Use Case:** Track SEO optimization requirements

| Comment |
| --- |
| SEO TODO: |
| - Add meta description (150-160 chars) |
| - Optimize H1 for primary keyword |
| - Add alt text to all images |
| - Internal links to related articles |

**When to Use:** SEO optimization, content quality checks

---

### Example 8: Multiple Comments

**Use Case:** Add comments throughout document sections

**Document Structure:**

`Section Header: Introduction`

| Comment |
| --- |
| Review: Make introduction more engaging |

`[Introduction content here]`

---

`Section Header: Features`

| Comment |
| --- |
| TODO: Add comparison table with competitors |

`[Features content here]`

---

`Section Header: Pricing`

| Comment |
| --- |
| Update: New pricing effective Jan 1, 2026 |

`[Pricing content here]`

**When to Use:** Section-specific notes, localized reminders

---

## Best Practices

### Do's

**Use Comments For:**

- Editorial reminders and notes
- Team collaboration and approvals
- Workflow status tracking
- Content planning and placeholders
- Review checklists
- Version notes and change tracking
- Internal documentation

**Writing Effective Comments:**

- Be specific and actionable
- Include dates when relevant
- Tag team members with @mentions
- Use structured format for checklists
- Keep comments concise and clear

### Don'ts

**Avoid Comments For:**

- Sensitive security information (use secure channels)
- Personal data or PII (even hidden, it's in source)
- Production configuration (use config files)
- User-facing content (use proper content blocks)
- Accessibility instructions (use separate documentation)

**Comment Anti-Patterns:**

- Vague notes without context
- Outdated comments left indefinitely
- Comments as substitute for proper documentation
- Excessive length (keep it brief)

---

## Comment Format Reference

### Standard Format

| Comment |
| --- |
| Your comment text here |

### Multi-Line Format

| Comment |
| --- |
| Line 1 of comment |
| Line 2 of comment |
| Line 3 of comment |

### Structured Format

| Comment |
| --- |
| **Heading** |
| - Bullet point 1 |
| - Bullet point 2 |
| - Bullet point 3 |

---

## Frequently Asked Questions

**Q: Will my comments appear on the published website?**

A: No. Comments are completely hidden from the published website through CSS. They only appear in the authoring environment.

**Q: Can I include links in comments?**

A: Yes, but remember they're only visible in the authoring environment. For published links, use proper content blocks.

**Q: How many comments can I add to a document?**

A: There's no limit. Add as many comments as needed for your workflow.

**Q: Can other authors see my comments?**

A: Yes, comments are visible to all users with access to the authoring environment.

**Q: Do comments affect page performance?**

A: No. Comments have zero impact on published page performance because they're hidden via CSS and not rendered.

**Q: Can I use markdown formatting in comments?**

A: Yes, markdown formatting works in comments (bold, italics, lists, etc.), but it's only visible in the authoring environment.

**Q: Should I delete old comments?**

A: Yes, it's good practice to clean up resolved comments to keep the authoring environment organized.

**Q: Can I use comments for version control?**

A: Comments can track changes informally, but use proper version control systems (Git) for official version tracking.

**Q: Are comments included in search indexing?**

A: No. Since comments are hidden from the published site, they're not indexed by search engines.

**Q: Can I export comments for reporting?**

A: This depends on your authoring tool. Check your CMS documentation for comment export features.

---

## Comment Templates

### Review Checklist Template

| Comment |
| --- |
| **Pre-Publish Checklist** |
| - [ ] Content accuracy verified |
| - [ ] All links tested |
| - [ ] Images optimized |
| - [ ] SEO elements complete |
| - [ ] Legal review: [STATUS] |
| - [ ] Stakeholder approval: [NAME] |
| - [ ] Publish date: [DATE] |

### Status Update Template

| Comment |
| --- |
| **Status:** [Draft/Review/Approved/Published] |
| **Owner:** [Team/Person] |
| **Last Updated:** [Date] |
| **Due Date:** [Date] |
| **Blockers:** [List any blockers] |

### Content Planning Template

| Comment |
| --- |
| **Planned Addition:** [Description] |
| **Priority:** [High/Medium/Low] |
| **Target Date:** [Date] |
| **Dependencies:** [List dependencies] |
| **Notes:** [Additional context] |

### Change Log Template

| Comment |
| --- |
| **Version [X.X] - [Date]** |
| **Changed by:** [Name] |
| **Changes:** |
| - [Change 1] |
| - [Change 2] |
| - [Change 3] |
| **Reason:** [Why changes were made] |

---

## Troubleshooting

### Comment Not Visible in Authoring Environment

**Problem:** You added a comment but don't see it in the authoring interface.

**Solutions:**

1. Refresh the authoring interface
2. Check table syntax is correct (header, separator, content)
3. Verify block name is exactly "Comment" (case-sensitive)
4. Check with your authoring tool support

### Comment Appears on Published Site

**Problem:** Comment is visible on the published website.

**This should never happen.** If it does:

1. Verify the CSS file is loaded correctly
2. Check browser cache (hard refresh)
3. Contact development team immediately
4. Remove sensitive information if applicable

### Comment Syntax Issues

**Problem:** Comment block not rendering correctly in authoring.

**Common Issues:**

- Missing table separator line (`| --- |`)
- Incorrect block name (must be "Comment")
- Unclosed markdown formatting
- Special characters breaking parser

**Solution:** Use simple, clean markdown syntax in comments.

---

## Related Resources

**Technical Documentation:**

- README.md - Complete technical documentation
- test.html - Browser-based testing file

**EDS Documentation:**

- [EDS Authoring Guide](https://www.aem.live/docs/authoring)
- [Markdown Reference](https://www.aem.live/docs/authoring-basics)

**Support:**

- Contact: Development team
- Issues: Project repository
- Questions: Team Slack/Email

---

## Summary

**Key Takeaways:**

1. Comments are authoring-only - never visible on published site
2. Use for notes, reminders, collaboration, and workflow tracking
3. Simple table syntax: `| Comment |` header with content rows
4. No performance impact on published pages
5. Clean up old comments to keep authoring environment organized

**Remember:** Comments are your personal and team workspace for content management. Use them freely to improve your authoring workflow!
