# Vue Slide Builder Examples

This document provides examples for content authors on how to use the Vue Slide Builder block in Adobe Edge Delivery Services.

## Basic Usage

### Default Configuration

The simplest way to use the Vue Slide Builder block:

| vue-slide-builder |
| :---------------- |

This will:
- Load the Vue.js slide builder application
- Render the full slide creation interface
- Enable reactive slide building features

## Page Integration Examples

### Dedicated Slide Builder Page

Create a dedicated page for slide building:

`Slide Builder Page`
`# Create Your Presentation`
`Use our reactive Vue.js slide builder to create stunning presentations.`
`| vue-slide-builder |`
`| :---------------- |`

### Embedded in Content Page

Embed the slide builder alongside other content:

`Content Page with Slide Builder`
`# Marketing Resources`
`## Create Custom Presentations`
`Build presentations that match your brand and message.`
`| vue-slide-builder |`
`| :---------------- |`
`## Additional Resources`
`Download templates and guides for creating effective presentations.`

### Workshop or Training Page

Use in educational contexts:

`Training Page`
`# Presentation Skills Workshop`
`## Interactive Exercise`
`Create a 5-slide presentation using the Vue slide builder below:`
`| vue-slide-builder |`
`| :---------------- |`
`## Submission Instructions`
`When complete, export your slides and upload to the submission form.`

## Use Case Examples

### Product Marketing

`Product Launch Page`
`# New Product Launch Kit`
`Create your product launch presentation:`
`| vue-slide-builder |`
`| :---------------- |`
`Customize slides with your product details, images, and messaging.`

### Sales Enablement

`Sales Tools Page`
`# Sales Presentation Builder`
`Build custom pitch decks for your prospects:`
`| vue-slide-builder |`
`| :---------------- |`
`Start with our templates or create from scratch.`

### Educational Content

`Course Materials Page`
`# Lesson 5: Creating Presentations`
`Practice creating an effective presentation:`
`| vue-slide-builder |`
`| :---------------- |`
`Apply the principles from today's lesson.`

### Event Planning

`Event Preparation Page`
`# Conference Presentation Prep`
`Prepare your speaker presentation:`
`| vue-slide-builder |`
`| :---------------- |`
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
`| vue-slide-builder |`
`| :---------------- |`
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
`| vue-slide-builder |`
`| :---------------- |`
`## After Building`
`Export options and next steps.`
`| tabs |`
`| :---- |`
`| Export PDF | Share Link | Download PowerPoint |`

## Content Guidelines

### Page Structure

When adding Vue Slide Builder to a page:

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
`| vue-slide-builder |`
`| :---------------- |`

### Support Content

Add supporting information:

`With Support Content`
`# Presentation Builder`
`Create slides for your next big meeting.`
`| vue-slide-builder |`
`| :---------------- |`
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
`| vue-slide-builder |`
`| :---------------- |`

### Collaborative Workspace

`Team Workspace`
`# Team Presentations`
`## Active Projects`
`| accordion |`
`| :-------- |`
`| Project A | Project B | Project C |`
`## Create New Presentation`
`| vue-slide-builder |`
`| :---------------- |`

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
`| vue-slide-builder |`
`| :---------------- |`
`**Due Date**: Friday, 5:00 PM`

## Vue.js Specific Features

### Reactive Interface

The Vue-based interface provides:
- **Instant Updates**: Changes appear immediately
- **Two-Way Binding**: Seamless form interactions
- **Component Reactivity**: Dynamic UI updates
- **State Management**: Consistent application state

### Component-Based Design

Benefits of Vue's component architecture:
- **Reusable Elements**: Consistent UI patterns
- **Modular Features**: Easy to understand and maintain
- **Scoped Styles**: No style conflicts
- **Clear Organization**: Logical component hierarchy

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
2. Check browser compatibility (no IE11)
3. Try a different modern browser
4. Report issues to support

### After Updates

If builder stops working after an update:
1. Clear browser cache completely
2. Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
3. Check if bundle files were updated correctly
4. Contact support if issues persist

## Technical Notes for Authors

### Browser Requirements

Best experience on modern browsers:
- Chrome 64+
- Firefox 67+
- Safari 12+
- Edge 79+ (Chromium-based)

**Note**: Internet Explorer is not supported

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
`| vue-slide-builder |`
`| :---------------- |`
`---`
`# Footer Section`
`| footer |`
`| :----- |`
`| Contact | Privacy | Terms |`
`---`

### With Metadata

`Page Metadata`
`# Slide Builder`
`| vue-slide-builder |`
`| :---------------- |`
`---`
`| Metadata | Value |`
`| :------- | :---- |`
`| Title | Create Presentations - Vue Slide Builder |`
`| Description | Reactive Vue.js slide builder for creating presentations |`
`| Keywords | slides, presentations, builder, vue, interactive |`

## Performance Tips

### For Best Performance

- Use modern browsers for optimal experience
- Close unused browser tabs
- Ensure stable internet connection
- Use devices with adequate memory
- Keep browser updated

### Understanding Load Times

- First load may take 1-2 seconds
- Subsequent loads are faster (cached)
- Large slide decks may take time to process
- Image uploads depend on network speed

## Support

For questions about using Vue Slide Builder:
- See [Block Documentation](README.md) for technical details
- Contact support for functionality questions
- Check browser console for error messages
- Report issues through standard channels

## Framework Benefits

### Why Vue.js?

The Vue Slide Builder leverages Vue.js for:
- **Reactive Updates**: Instant UI responsiveness
- **Component Reusability**: Consistent design patterns
- **Simplified State**: Easier application logic
- **Better Developer Experience**: Modern tooling
- **Performance**: Optimized rendering

### User Benefits

As a user, you benefit from:
- **Smooth Interactions**: No page reloads
- **Instant Feedback**: See changes immediately
- **Better Performance**: Optimized rendering
- **Modern UX**: Contemporary design patterns
- **Reliability**: Well-tested framework
