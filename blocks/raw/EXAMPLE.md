---
title: "Raw Block Examples"
description: "Usage examples for the raw EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# Raw Block Examples

## Basic HTML Structure

| Raw |
|-----|
| `<div class="custom-content"><h2>Custom Heading</h2><p>This is raw HTML content rendered directly in the page.</p></div>` |

---

## Alert Box with Styling

| Raw |
|-----|
| `<div style="padding: 1rem; background: #d4edda; border: 1px solid #28a745; border-radius: 4px; color: #155724;"><strong>Success:</strong> Your operation completed successfully.</div>` |

---

## Warning Banner

| Raw |
|-----|
| `<div style="padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; color: #856404;"><strong>Warning:</strong> Please review the content before proceeding.</div>` |

---

## Embedded mmhmm Video

| Raw |
|-----|
| `<iframe src="https://ooo.mmhmm.app/embed/abc123xyz" width="640" height="360" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>` |

---

## Data Table

| Raw |
|-----|
| `<table style="width: 100%; border-collapse: collapse;"><thead><tr style="background: #f5f5f5;"><th style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">Product</th><th style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">Price</th><th style="padding: 0.5rem; border: 1px solid #ddd; text-align: left;">Status</th></tr></thead><tbody><tr><td style="padding: 0.5rem; border: 1px solid #ddd;">Product A</td><td style="padding: 0.5rem; border: 1px solid #ddd;">$99.99</td><td style="padding: 0.5rem; border: 1px solid #ddd;">Available</td></tr><tr><td style="padding: 0.5rem; border: 1px solid #ddd;">Product B</td><td style="padding: 0.5rem; border: 1px solid #ddd;">$149.99</td><td style="padding: 0.5rem; border: 1px solid #ddd;">Sold Out</td></tr></tbody></table>` |

---

## Feature Grid Layout

| Raw |
|-----|
| `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;"><div style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;"><h3 style="margin-top: 0;">Feature One</h3><p>Description of the first feature goes here.</p></div><div style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;"><h3 style="margin-top: 0;">Feature Two</h3><p>Description of the second feature goes here.</p></div><div style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;"><h3 style="margin-top: 0;">Feature Three</h3><p>Description of the third feature goes here.</p></div></div>` |

---

## Quote-Wrapped Content

| Raw |
|-----|
| "`<div style="padding: 1.5rem; background: #f8f9fa; border-left: 4px solid #007bff;"><blockquote style="margin: 0; font-style: italic; font-size: 1.1rem;">"This content was copied with surrounding quotes and will be properly processed."</blockquote></div>`" |

---

## HTML Entity Encoded Content

| Raw |
|-----|
| `&lt;div style="padding: 1rem; background: #e9ecef;"&gt;&lt;p&gt;This HTML was encoded with entities and will be decoded automatically.&lt;/p&gt;&lt;ul&gt;&lt;li&gt;Item 1&lt;/li&gt;&lt;li&gt;Item 2&lt;/li&gt;&lt;/ul&gt;&lt;/div&gt;` |

---

## Definition List

| Raw |
|-----|
| `<dl style="display: grid; grid-template-columns: max-content auto; gap: 0.5rem 1rem;"><dt style="font-weight: bold;">Term 1:</dt><dd style="margin: 0;">Definition for term 1 goes here.</dd><dt style="font-weight: bold;">Term 2:</dt><dd style="margin: 0;">Definition for term 2 goes here.</dd><dt style="font-weight: bold;">Term 3:</dt><dd style="margin: 0;">Definition for term 3 goes here.</dd></dl>` |

---

## Call-to-Action Box

| Raw |
|-----|
| `<div style="padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white; text-align: center;"><h2 style="margin-top: 0; color: white;">Ready to Get Started?</h2><p style="font-size: 1.1rem; margin-bottom: 1.5rem;">Join thousands of users already using our platform.</p><a href="/signup" style="display: inline-block; padding: 0.75rem 2rem; background: white; color: #667eea; border-radius: 4px; text-decoration: none; font-weight: bold;">Sign Up Now</a></div>` |

---

## Image with Caption

| Raw |
|-----|
| `<figure style="margin: 0;"><img src="https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png" alt="Sample image" style="width: 100%; height: auto; border-radius: 4px;"><figcaption style="margin-top: 0.5rem; font-size: 0.9rem; color: #666; text-align: center;">Sample image with a descriptive caption</figcaption></figure>` |

---

## Progress Indicator

| Raw |
|-----|
| `<div style="margin: 1rem 0;"><div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">Project Progress: 75%</div><div style="width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden;"><div style="width: 75%; height: 100%; background: linear-gradient(90deg, #28a745 0%, #20c997 100%); transition: width 0.3s ease;"></div></div></div>` |

---

## Multi-Column Text

| Raw |
|-----|
| `<div style="column-count: 2; column-gap: 2rem; text-align: justify;"><p>This is a multi-column layout using CSS columns. The text will automatically flow from one column to the next, creating a newspaper-like reading experience.</p><p>You can add multiple paragraphs and they will distribute across the columns naturally. This is particularly useful for long-form content that benefits from a narrower reading width.</p><p>The column count can be adjusted based on screen size using media queries for responsive design.</p></div>` |

---

## Info Panel with Icon

| Raw |
|-----|
| `<div style="display: flex; gap: 1rem; padding: 1rem; background: #e7f3ff; border: 1px solid #2196F3; border-radius: 4px;"><div style="flex-shrink: 0; width: 24px; height: 24px; background: #2196F3; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">i</div><div><strong style="display: block; margin-bottom: 0.5rem;">Information</strong><p style="margin: 0;">This is an informational panel with a custom icon. Use this pattern for tips, notes, or additional context.</p></div></div>` |

---

## Responsive Grid Gallery

| Raw |
|-----|
| `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;"><img src="https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png" alt="Gallery image 1" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;"><img src="https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg" alt="Gallery image 2" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;"><img src="https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg" alt="Gallery image 3" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;"><img src="https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg" alt="Gallery image 4" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;"></div>` |

---

## Testimonial Card

| Raw |
|-----|
| `<div style="padding: 2rem; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"><div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;"><img src="https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;"><div><strong style="display: block; font-size: 1.1rem;">Tom Cranstoun</strong><span style="color: #666; font-size: 0.9rem;">Software Developer</span></div></div><p style="font-style: italic; color: #333; line-height: 1.6; margin: 0;">"This platform has transformed the way we build and deploy web applications. Highly recommended for any development team."</p></div>` |

---

## Metadata

| Section | Metadata |
|---------|----------|
| Block | Raw |
| Version | 1.0 |
| Status | Production |
| Last Updated | 2025-11-28 |
