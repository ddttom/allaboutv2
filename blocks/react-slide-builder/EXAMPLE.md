---
title: "React Slide Builder Examples"
description: "Usage examples for the react-slide-builder EDS block"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# React Slide Builder Examples

This document provides examples for content authors on how to use the React Slide Builder block in Adobe Edge Delivery Services.

## Basic Usage

### Default Configuration

The simplest way to use the React Slide Builder block:

| react-slide-builder |
| :----------------- |

This will:

- Load the React slide builder application
- Render the full slide creation interface
- Enable interactive slide building features

## Page Integration Examples

### Dedicated Slide Builder Page

Create a dedicated page for slide building:

`Slide Builder Page`
`# Create Your Presentation`
`Use our interactive slide builder to create stunning presentations.`
`| react-slide-builder |`
`| :----------------- |`

### Embedded in Content Page

Embed the slide builder alongside other content:

`Content Page with Slide Builder`
`# Marketing Resources`
`## Create Custom Presentations`
`Build presentations that match your brand and message.`
`| react-slide-builder |`
`| :----------------- |`
`## Additional Resources`
`Download templates and guides for creating effective presentations.`

### Workshop or Training Page

Use in educational contexts:

`Training Page`
`# Presentation Skills Workshop`
`## Interactive Exercise`
`Create a 5-slide presentation using the slide builder below:`
`| react-slide-builder |`
`| :----------------- |`
`## Submission Instructions`
`When complete, export your slides and upload to the submission form.`

## Use Case Examples

### Product Marketing

`Product Launch Page`
`# New Product Launch Kit`
`Create your product launch presentation:`
`| react-slide-builder |`
`| :----------------- |`
`Customize slides with your product details, images, and messaging.`

### Sales Enablement

`Sales Tools Page`
`# Sales Presentation Builder`
`Build custom pitch decks for your prospects:`
`| react-slide-builder |`
`| :----------------- |`
`Start with our templates or create from scratch.`

### Educational Content

`Course Materials Page`
`# Lesson 5: Creating Presentations`
`Practice creating an effective presentation:`
`| react-slide-builder |`
`| :----------------- |`
`Apply the principles from today's lesson.`

### Event Planning

`Event Preparation Page`
`# Conference Presentation Prep`
`Prepare your speaker presentation:`
`| react-slide-builder |`
`| :----------------- |`
`Submit your slides by the deadline for review.`

## Advanced Integration Patterns

### Multi-Section Page

Combine with other blocks for rich pages:

`Comprehensive Page`
`# Presentation Center`
`## Getting Started`
`Watch this tutorial first:`
`| embed |`
`| :---- |`
`| https://youtube.com/tutorial |`
`## Build Your Slides`
`| react-slide-builder |`
`| :----------------- |`
`## Share and Collaborate`
`| cards |`
`| :---- |`
`| Share | Download | Print |`

### Before and After Sections

Provide context around the builder:

`Structured Page`
`# Create Professional Presentations`
`## Before You Begin`
`Review our guidelines and best practices.`
`| hero |`
`| :---- |`
`| Presentation Guidelines | /guidelines.pdf |`
`## Slide Builder`
`| react-slide-builder |`
`| :----------------- |`
`## After Building`
`Export options and next steps.`
`| tabs |`
`| :---- |`
`| Export PDF | Share Link | Download PowerPoint |`

## Content Guidelines

### Page Structure

When adding React Slide Builder to a page:

1. **Clear Purpose**: Explain what users will create
2. **Context Before**: Provide instructions or guidelines above the block
3. **Block Placement**: Center the block in the page flow
4. **Follow-up Content**: Include next steps or resources below

### Instructional Content

Provide clear instructions for users:

`Example Instructions`
`# Build Your Pitch Deck`
`## What You'll Create`
`A 10-slide presentation for investor meetings.`
`## Instructions`
`1. Start with the template`
`2. Customize each slide with your content`
`3. Add your logo and branding`
`4. Export as PDF when complete`
`## Slide Builder`
`| react-slide-builder |`
`| :----------------- |`

### Support Content

Add supporting information:

`With Support Content`
`# Presentation Builder`
`Create slides for your next big meeting.`
`| react-slide-builder |`
`| :----------------- |`
`## Need Help?`
`- [Video Tutorial](/tutorials/slides)`
`- [Template Gallery](/templates)`
`- [Support Chat](/help)`

## Best Practices

### Page Design

- **Single Focus**: Use one slide builder per page
- **Clear Heading**: Descriptive page title explaining purpose
- **Contextual Help**: Provide inline help or tooltips
- **Progress Saving**: Inform users about auto-save features

### User Experience

- **Loading Feedback**: The app will show loading state
- **Browser Requirements**: Note modern browser needed
- **Mobile Considerations**: Best experienced on desktop/tablet
- **Time Expectations**: Set expectations for completion time

### Content Organization

- **Dedicated Pages**: Give slide builder its own page
- **Clear Navigation**: Easy to find and return to
- **Template Access**: Provide templates nearby
- **Example Gallery**: Show examples of what's possible

## Common Patterns

### Template Library Page

`Template Library Integration`
`# Presentation Templates`
`## Choose a Template`
`| cards |`
`| :---- |`
`| Business | Creative | Academic |`
`## Customize Your Presentation`
`| react-slide-builder |`
`| :----------------- |`

### Collaborative Workspace

`Team Workspace`
`# Team Presentations`
`## Active Projects`
`| accordion |`
`| :-------- |`
`| Project A | Project B | Project C |`
`## Create New Presentation`
`| react-slide-builder |`
`| :----------------- |`

### Learning Management System

`LMS Integration`
`# Course Assignment: Week 5`
`## Assignment Brief`
`Create a 7-slide presentation on your research topic.`
`## Rubric`
`- Content clarity: 40%`
`- Visual design: 30%`
`- Organization: 30%`
`## Submission Tool`
`| react-slide-builder |`
`| :----------------- |`
`**Due Date**: Friday, 5:00 PM`

## Troubleshooting for Authors

### Block Not Displaying

If the block doesn't appear:

1. Check that you've published the page
2. Verify the block syntax is correct
3. Ensure your browser is up to date
4. Try clearing browser cache

### Slow Loading

If the application loads slowly:

1. Check your internet connection
2. Try on a faster network
3. Close unnecessary browser tabs
4. Consider device performance

### Functionality Issues

If features don't work:

1. Ensure JavaScript is enabled
2. Check browser compatibility
3. Try a different browser
4. Report issues to support

## Technical Notes for Authors

### Browser Requirements

Best experience on:

- Chrome 57+
- Firefox 60+
- Safari 11+
- Edge 16+

### Device Recommendations

Optimal use on:

- Desktop computers
- Laptop computers
- Tablets (landscape orientation)

Limited functionality on:

- Mobile phones (small screen)
- Older devices (performance)

### Network Considerations

- Requires internet connection for initial load
- Slides may save to cloud (check app features)
- Large images may take time to upload
- Export features may require good connection

## Integration Examples

### With EDS Sections

`Section Integration`
`---`
`# Hero Section`
`| hero |`
`| :---- |`
`| Create Presentations | Get Started Now |`
`---`
`# Builder Section`
`| react-slide-builder |`
`| :----------------- |`
`---`
`# Footer Section`
`| footer |`
`| :----- |`
`| Contact | Privacy | Terms |`
`---`

### With Metadata

`Page Metadata`
`# Slide Builder`
`| react-slide-builder |`
`| :----------------- |`
`---`
`| Metadata | Value |`
`| :------- | :---- |`
`| Title | Create Presentations - Slide Builder |`
`| Description | Interactive slide builder for creating presentations |`
`| Keywords | slides, presentations, builder, interactive |`

## Support

For questions about using React Slide Builder:

- See [Block Documentation](README.md) for technical details
- Contact support for functionality questions
- Check browser console for error messages
- Report issues through standard channels
