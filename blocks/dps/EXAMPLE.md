# DPS Block - Usage Examples

This document provides practical examples for content authors using the Dynamic Presentation System (DPS) block.

## Basic Example

`Table Format`
`| DPS                          |                                      |          |                                                  |                                                                                              |`
`| :--------------------------- | :----------------------------------- | :------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------- |`
`| AI in Enterprise             | Transform Your Business - https://example.com/contact | 25       |                                                  |                                                                                              |`
`| Introduction                 | Welcome to the session               | Overview of key themes | https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png | Today we'll explore AI adoption strategies and implementation patterns for enterprise organizations. |`
`| Understanding AI             | Core concepts and capabilities       | What AI can and cannot do | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png | Artificial Intelligence enables pattern recognition, prediction, and automation. Understanding its limitations is crucial for realistic planning. |`
`| Implementation Strategy      | Practical steps for adoption         | Phased approach to deployment | https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg | Start with pilot projects, measure results, and scale gradually. Focus on high-value use cases with clear ROI. |`

## Example with Multiple Images (Sequence)

`Multiple Images per Slide`
`| Cloud Security               | Best Practices Guide                 | 20       |                                                  |                                                                                              |`
`| Security Layers              | Defense in depth                     | Multiple protection levels | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png | Implement security at network, application, and data layers for comprehensive protection. |`
`| Security Layers              |                                      |                            | https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg |                                                                                              |`
`| Security Layers              |                                      |                            | https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg |                                                                                              |`

## Example with Icon Support

`Using Icons`
`| Design Principles            | Creating Better User Experiences     | 30       |                                                  |                                                                                              |`
`| Key Methods                  | Research and iteration               | User-centered approach     | <span class="icon icon-methods"></span>          | User research, prototyping, and iterative testing form the foundation of good design.       |`

## Example with iframe Embed

`Simplified iframe Format`
`| Product Demo                 | Live System Walkthrough              | 15       |                                                  |                                                                                              |`
`| Live Dashboard               | Real-time analytics                  | Interactive demo           | iframe https://example.com/embed/dashboard       | This interactive dashboard shows real-time metrics. Walk through key features and answer questions. |`

## Example with Bullet Points

`Bullet Points and Plain Text`
`| Implementation Roadmap       | 12-Month Plan                        | 25       |                                                  |                                                                                              |`
`| Phase 1: Foundation          | Initial setup and training           | <ul><li>Assess current state</li><li>Define objectives</li><li>Build core team</li></ul> | https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg | Phase 1 focuses on preparation. Ensure executive buy-in and allocate adequate resources. |`

## Complete Presentation Example

`Full Presentation Structure`
`| DPS                          |                                      |          |                                                  |                                                                                              |`
`| :--------------------------- | :----------------------------------- | :------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------- |`
`| Digital Transformation       | Modernizing Enterprise Operations - https://example.com/resources | 30       |                                                  |                                                                                              |`
`| Welcome                      | Introduction to digital transformation | Strategic overview        | https://allabout.network/media_11fa677a5c5d2563c03ba0f229be08509492ccb60.png | Digital transformation encompasses technology, process, and cultural change across the organization. |`
`| Current State                | Where we are today                   | Assessment of existing systems | https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png | Many organizations struggle with legacy systems, siloed data, and manual processes that limit agility. |`
`| Vision for the Future        | Destination and goals                | <ul><li>Automated workflows</li><li>Data-driven decisions</li><li>Agile operations</li></ul> | https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg | Our vision includes seamless automation, real-time insights, and rapid response to market changes. Emphasize employee empowerment through better tools. |`
`| Implementation Approach      | Practical steps forward              | Phased transformation strategy | https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg | Begin with high-impact quick wins, build momentum, then tackle complex integrations. |`
`| Success Metrics              | Measuring progress                   | <ul><li>Time savings</li><li>Cost reduction</li><li>User satisfaction</li><li>Revenue impact</li></ul> | https://allabout.network/media_1e744525e97292dcd074e9b1c7ab2cf47a048f292.jpeg | Track both quantitative KPIs and qualitative feedback. Celebrate early wins to maintain momentum. |`

## Metadata Section (Optional)

`Metadata for SEO and Indexing`
`| metadata        |                                                                              |`
`| :-------------- | :--------------------------------------------------------------------------- |`
`| title           | Digital Transformation Guide                                                 |`
`| description     | Comprehensive guide to enterprise digital transformation strategies          |`
`| json-ld         | article                                                                      |`
`| author          | Tom Cranstoun                                                                |`
`| longdescription | This presentation covers assessment, planning, implementation, and measurement of digital transformation initiatives in enterprise settings. |`

## Notes for Authors

### Column Definitions

1. **Column 1 (Title)**: Slide title - keep concise and descriptive
2. **Column 2 (Subtitle)**: Introduction text or context - can include URLs for Q&A slide
3. **Column 3 (Content)**: Bullet points or short description (10 words or less recommended)
4. **Column 4 (Illustration)**: Images, icons, iframes, or SVGs
5. **Column 5 (Presenter Notes)**: Private notes visible only to presenter

### Navigation Features

- **Arrow Keys**: Navigate between slides and sequence images
- **Space Bar**: Toggle timer pause/resume
- **Plus (+)**: Show presenter notes
- **Minus (-)**: Hide presenter notes
- **P Key**: Toggle enlarged presenter mode
- **Escape**: Toggle navigation bar visibility

### Image Sequence Tips

- Multiple images in consecutive rows create a sequence
- Use arrow keys to navigate through sequence images
- Last arrow press advances to next slide
- First arrow press (backward) returns to previous slide

### iframe Embedding

Use the simplified format for easy embedding:
- `iframe https://example.com/embed/content`
- No HTML tags needed - just "iframe" followed by URL

### Icon Usage

Reference icons using span format:
- `<span class="icon icon-methods"></span>`
- Icon file must exist in `/icons/` directory
- Filename must match icon name (e.g., `methods.svg`)

### Timer Configuration

- Set in Column 3 of first row (configuration row)
- Value in minutes (e.g., 25 for 25 minutes)
- Timer starts when advancing past first slide
- Visual warning when 2 minutes remain

### Q&A Slide

- Automatically added at end of presentation
- Displays "Close" title with circular graphic
- Shows QR code if URL provided in subtitle
- Creates clickable link from presentation subtitle URL
- Format: `Subtitle Text - https://example.com/contact`
