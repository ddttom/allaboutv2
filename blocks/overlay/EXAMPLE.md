# Overlay Block - Google Docs Authoring Example

This document shows how to create Overlay blocks in Google Docs for use with AEM Edge Delivery Services.

## ⚠️ CRITICAL: The First Row is Not Optional

**The first row (header row) in your table MUST contain the block name "Overlay"**. This is not just a label - it's the mechanism that tells EDS to:

1. Load `/blocks/overlay/overlay.js`
2. Load `/blocks/overlay/overlay.css`
3. Run the decoration function

**Without the correct first row, your overlay block will not work at all.**

## How to Use in Google Docs

### Step 1: Create a Table

Insert a table with **1 column** and **3 rows**:

- **Row 1: "Overlay" (header)** ← THIS IS CRITICAL - Must match the block directory name
- Row 2: Button text
- Row 3: Overlay content

### Step 2: Add Block Name (REQUIRED)

In the **first row**, type exactly:

```
Overlay
```

Make this row a **header row** (Table > Header row).

**Why this matters:**

- EDS reads the header row to identify which block to load
- The text "Overlay" tells EDS to look for `/blocks/overlay/`
- If you misspell it or leave it out, the block won't load
- The name must match your directory name exactly (case-insensitive, but use proper case)

### Step 3: Add Button Text

In the **second row**, type the text you want to appear on the button:

```
Learn More
```

### Step 4: Add Overlay Content

In the **third row**, add the content that will appear in the overlay:

```
Welcome to Our Platform

Discover how our platform can help you achieve your goals. We offer comprehensive solutions designed to streamline your workflow and increase productivity.

Get started today and see the difference for yourself!
```

### Complete Example

Your table should look like this in Google Docs:

| Overlay |
| ------- |
| Learn More |
| ------- |
| Welcome to Our Platform<br><br>Discover how our platform can help you achieve your goals. We offer comprehensive solutions designed to streamline your workflow and increase productivity.<br><br>Get started today and see the difference for yourself! |

## More Examples

### Example 1: Simple Call-to-Action

| Overlay |
| ------- |
| View Details |
| ------- |
| Our product includes:<br><br>• Real-time Collaboration<br>• Advanced Analytics<br>• Enterprise Security<br>• 24/7 Support |

### Example 2: Contact Information

| Overlay |
| ------- |
| Contact Us |
| ------- |
| **Get in Touch**<br><br>Email: hello@example.com<br>Phone: +1 (555) 123-4567<br>Hours: Monday - Friday, 9am - 5pm EST<br><br>We typically respond within 24 hours. |

### Example 3: With Links

| Overlay |
| ------- |
| Learn More |
| ------- |
| **Product Features**<br><br>Our platform offers comprehensive solutions for your business needs.<br><br>[View Pricing](https://example.com/pricing) \| [Request Demo](https://example.com/demo) |

### Example 4: Terms and Conditions

| Overlay |
| ------- |
| Read Terms |
| ------- |
| **Terms and Conditions**<br><br>By using our services, you agree to the following terms:<br><br>**1. Acceptance of Terms**<br>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.<br><br>**2. Use License**<br>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. |

## Formatting Tips

### Bold Text

Use **double asterisks** around text:

```
**Important Note**
```

### Lists

Use bullet points or numbered lists:

```
• Item 1
• Item 2
• Item 3
```

Or:

```
1. First item
2. Second item
3. Third item
```

### Line Breaks

Press **Shift+Enter** to add a line break within the same cell, or just press **Enter** for a new paragraph.

### Links

Create links normally in Google Docs:

1. Highlight text
2. Click Insert > Link
3. Enter URL

### Headings

Use bold text or actual heading styles for structure:

```
**Section Title**

Regular paragraph text here.
```

## Multiple Overlays on Same Page

You can add multiple overlay blocks to the same page. Each will work independently:

**First Overlay:**

| Overlay |
| ------- |
| About Us |
| ------- |
| Founded in 2020, we've been dedicated to providing exceptional service... |

**Second Overlay:**

| Overlay |
| ------- |
| Our Mission |
| ------- |
| Our mission is to empower businesses through technology... |

## Best Practices

### Button Text

- ✅ Keep it short (1-3 words)
- ✅ Use action verbs: "View", "Read", "Learn", "Contact"
- ✅ Be descriptive: "View Features" not just "Click Here"

### Overlay Content

- ✅ Be concise but informative
- ✅ Use formatting (bold, lists) to organize information
- ✅ Test on mobile - content adjusts automatically
- ✅ Include relevant links if needed

### Things to Avoid

- ❌ Very long button text (use 1-3 words)
- ❌ Empty overlay content
- ❌ Extremely wide images (may not display well on mobile)
- ❌ Critical information that must always be visible (use regular content instead)

## Preview and Testing

After creating your overlay block in Google Docs:

1. **Preview** in the Sidekick to see how it looks
2. **Test the button** - does it open the overlay?
3. **Check the content** - does it display correctly?
4. **Try on mobile** - does it work on smaller screens?
5. **Test closing** - click outside or press ESC to close

## Troubleshooting

### Button doesn't appear

- Make sure row 1 has "Overlay" as the header
- Check that row 2 has button text
- Verify table has exactly 3 rows

### Content doesn't show

- Ensure row 3 has content (not empty)
- Check for formatting issues
- Try simplifying the content

### Overlay looks wrong

- Verify you're using the correct table structure
- Check that row 1 is marked as a header row
- Try previewing in Sidekick

## Questions?

If you need help with the Overlay block:

- Check the [README.md](README.md) for more details
- Contact your development team
- Reference the examples in `/drafts/overlay-examples/`
