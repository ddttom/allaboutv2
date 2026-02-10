---
title: "Floating Alert"
description: "Usage examples for the floating-alert EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Floating Alert

| metadata        |                                                                                |
| :-------------- | :----------------------------------------------------------------------------- |
| title           | Floating Alert Examples                                                        |
| description     | Comprehensive examples of the Floating Alert block with various content types  |
| json-ld         | article                                                                        |
| image           | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png  |
| author          | Tom Cranstoun                                                                  |
| longdescription | This page demonstrates how to use the Floating Alert block with headings, links, rich content, and various styling options. Includes examples for announcements, maintenance notices, special offers, and more. |

## Example 1: Basic Welcome Message (No Heading)

| Floating Alert |
| -------------- |
| Welcome to our website! We're glad you're here. Take a moment to explore our features. |

## Example 2: Important Notice with Heading

| Floating Alert |
| -------------- |
| ## Important Notice<br>We've updated our privacy policy. Please review the changes to understand how we protect your data. |

## Example 3: Scheduled Maintenance Alert

| Floating Alert |
| -------------- |
| ## Scheduled Maintenance<br>⚠️ Our service will be unavailable this Saturday from 2-4 AM EST for system upgrades. Visit our [status page](https://example.com/status) for real-time updates. |

## Example 4: Special Offer Promotion

| Floating Alert |
| -------------- |
| ## Limited Time Offer<br>🎉 Celebrate with us! Get 25% off all products this week only. [Shop now](https://example.com/shop) or [view details](https://example.com/offer) about this exclusive deal. |

## Example 5: Privacy Policy Update

| Floating Alert |
| -------------- |
| ## Privacy Policy Update<br>We value your privacy. Our updated [privacy policy](https://example.com/privacy) and [cookie policy](https://example.com/cookies) are now in effect. [Learn more](https://example.com/help) about your data rights. |

## Example 6: Feature Announcement

| Floating Alert |
| -------------- |
| ## New Features Available<br>We've launched exciting new capabilities! Check out our [feature guide](https://example.com/features) or watch the [video tutorial](https://example.com/tutorial) to get started. |

## Example 7: Security Alert

| Floating Alert |
| -------------- |
| ## Security Update Required<br>🔒 Please update your password for enhanced security. [Change password now](https://example.com/password) or [contact support](https://example.com/support) if you need assistance. |

## Example 8: Event Registration

| Floating Alert |
| -------------- |
| ## Upcoming Webinar<br>Join us for an exclusive webinar next Thursday at 2 PM EST. Topics include best practices, case studies, and Q&A. [Register now](https://example.com/register) - Limited seats available! |

## Example 9: System Migration Notice

| Floating Alert |
| -------------- |
| ## System Migration In Progress<br>We're upgrading to serve you better! Some features may be temporarily unavailable. [View migration schedule](https://example.com/migration) or [check status](https://example.com/status). |

## Example 10: Cookie Consent

| Floating Alert |
| -------------- |
| ## Cookie Preferences<br>🍪 We use cookies to improve your experience. By continuing to browse, you consent to our use of cookies. [Learn more](https://example.com/cookies) or [manage preferences](https://example.com/preferences). |

## Example 11: Breaking News

| Floating Alert |
| -------------- |
| ## Breaking News<br>📰 Major announcement: We've partnered with industry leaders to bring you enhanced services. [Read full announcement](https://example.com/news) or [see FAQ](https://example.com/faq). |

## Example 12: Account Verification

| Floating Alert |
| -------------- |
| ## Verify Your Account<br>Please verify your email address to unlock all features. [Resend verification email](https://example.com/verify) or [update email address](https://example.com/email). |

## Example 13: Service Outage

| Floating Alert |
| -------------- |
| ## Service Outage Notice<br>⚠️ We're experiencing technical difficulties. Our team is working to resolve this issue. [Status updates](https://example.com/status) or [contact support](https://example.com/support). |

## Example 14: Survey Request

| Floating Alert |
| -------------- |
| ## We Value Your Feedback<br>Help us improve! Take our 2-minute survey and enter to win a gift card. [Start survey](https://example.com/survey) or [learn about prizes](https://example.com/prizes). |

## Example 15: Terms of Service Update

| Floating Alert |
| -------------- |
| ## Updated Terms of Service<br>Our terms of service have been updated effective immediately. Please review our [terms of service](https://example.com/terms) and [acceptable use policy](https://example.com/aup). |

## Example 16: Holiday Hours

| Floating Alert |
| -------------- |
| ## Holiday Schedule<br>🎄 We'll have modified hours during the holiday season. [View full schedule](https://example.com/hours) or [plan your visit](https://example.com/plan). |

## Example 17: Beta Feature Invitation

| Floating Alert |
| -------------- |
| ## Try Our Beta Features<br>🚀 Be among the first to test our new features! [Join beta program](https://example.com/beta) or [learn about requirements](https://example.com/beta-info). |

## Example 18: Data Migration Notice

| Floating Alert |
| -------------- |
| ## Action Required: Data Migration<br>We're migrating your data to a new system. [Download your data](https://example.com/export) or [view migration guide](https://example.com/guide) for details. |

## Example 19: Community Guidelines

| Floating Alert |
| -------------- |
| ## Community Guidelines<br>Please review our updated [community guidelines](https://example.com/guidelines) and [code of conduct](https://example.com/conduct) to ensure a positive experience for everyone. |

## Example 20: Multi-Paragraph Content

| Floating Alert |
| -------------- |
| ## Important Platform Update<br>We're introducing significant improvements to our platform.<br><br>New features include enhanced performance, better security, and improved user interface.<br><br>[Read full changelog](https://example.com/changelog) or [contact support](https://example.com/support) with questions. |

## Usage Notes

### Dismissal Behavior

- Click the X button in the top-right corner
- Click outside the modal (on the darkened overlay)
- Press the Escape key
- Once dismissed, the alert won't appear again until localStorage is cleared

### Heading Processing

When you include a heading (h1-h6) in your content:

- The heading is automatically extracted as the alert title
- It appears prominently at the top of the modal
- A horizontal rule separator is added below the heading
- The remaining content displays below the separator

### Testing and Development

Use browser console commands for testing:

- `window.floatingAlertDebug.reset()` - Clear dismissed state
- `window.floatingAlertDebug.checkStatus()` - Check if dismissed
- `window.floatingAlertDebug.forceShow()` - Force display
- `window.floatingAlertDebug.checkDOM()` - Inspect DOM elements

### Best Practices

- Keep messages concise and actionable
- Use headings to provide context
- Include relevant links for more information
- Test on mobile devices for readability
- Verify color contrast meets accessibility standards
- Consider timing - don't overwhelm users with alerts

### Content Guidelines

- **Headings**: Use h2 or h3 for consistency
- **Links**: Make link text descriptive (not "click here")
- **Length**: Aim for 1-3 sentences plus links
- **Emojis**: Use sparingly for visual emphasis
- **Formatting**: Use `<br>` tags for line breaks

### Customization

Override CSS variables to match your brand:

- `--alert-bg-color`: Background color
- `--alert-border-color`: Border color
- `--alert-text-color`: Text color
- `--alert-max-width`: Maximum width
- `--alert-padding`: Internal spacing

See README.md for complete customization options.
