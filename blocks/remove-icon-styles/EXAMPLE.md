# Remove Icon Styles - Usage Examples

## Basic Usage Example

The simplest use case - activate the icon style reset globally:

| Remove-Icon-Styles |
| --- |

## With Custom Icon Styling

Combine the reset with custom CSS to control icon sizes:

| Remove-Icon-Styles |
| --- |

### Custom CSS

`Custom Icon Classes`
`.icon.small {`
`  height: 16px;`
`  width: 16px;`
`}`
``
`.icon.medium {`
`  height: 32px;`
`  width: 32px;`
`}`
``
`.icon.large {`
`  height: 48px;`
`  width: 48px;`
`}`

## With Icon Blocks

Use the reset alongside icon blocks for flexible sizing:

| Remove-Icon-Styles |
| --- |

| Icon |
| --- |
| ![Settings](https://allabout.network/media_1251e262eade67c1f9c8e0ccffa6d35945487140c.png) |

## Responsive Icon Example

Create icons that scale with viewport size:

| Remove-Icon-Styles |
| --- |

### Responsive CSS

`Responsive Icon Pattern`
`.icon.responsive {`
`  height: 1.5rem;`
`  width: 1.5rem;`
`}`
``
`@media (min-width: 768px) {`
`  .icon.responsive {`
`    height: 2rem;`
`    width: 2rem;`
`  }`
`}`
``
`@media (min-width: 1024px) {`
`  .icon.responsive {`
`    height: 3rem;`
`    width: 3rem;`
`  }`
`}`

## Multiple Icons with Different Sizes

Demonstrate various icon sizes on the same page:

| Remove-Icon-Styles |
| --- |

| Icon | Icon | Icon |
| --- | --- | --- |
| ![Icon 1](https://allabout.network/media_188fa5bcd003e5a2d56e7ad3ca233300c9e52f1e5.png) | ![Icon 2](https://allabout.network/media_14e918fa88c2a9a810fd454fa04f0bd152c01fed2.jpeg) | ![Icon 3](https://allabout.network/media_1d92670adcfb7a18a062e49fd7967f4e9f76d8a52.jpeg) |

### Icon-Specific Styling

`Target Specific Icons`
`.icon:nth-child(1) {`
`  height: 24px;`
`  width: 24px;`
`}`
``
`.icon:nth-child(2) {`
`  height: 36px;`
`  width: 36px;`
`}`
``
`.icon:nth-child(3) {`
`  height: 48px;`
`  width: 48px;`
`}`

## SVG Icons with Natural Sizing

Let SVG icons use their viewBox attributes:

| Remove-Icon-Styles |
| --- |

`SVG Example`
`<span class="icon">`
`  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">`
`    <circle cx="50" cy="50" r="40" fill="blue" />`
`  </svg>`
`</span>`

## Contextual Icon Sizing

Icons sized based on their container context:

| Remove-Icon-Styles |
| --- |

### Context-Based CSS

`Container Query Pattern`
`.card .icon {`
`  height: 2em;`
`  width: 2em;`
`}`
``
`.sidebar .icon {`
`  height: 1.5em;`
`  width: 1.5em;`
`}`
``
`.hero .icon {`
`  height: 4em;`
`  width: 4em;`
`}`

## Inline Icons with Text

Icons that flow naturally with text:

| Remove-Icon-Styles |
| --- |

`Inline Icon Pattern`
`<p>`
`  Click the <span class="icon">⚙️</span> settings icon to configure.`
`</p>`

### Text-Relative Sizing

`Em-Based Sizing`
`.icon.inline {`
`  height: 1em;`
`  width: 1em;`
`  vertical-align: middle;`
`}`

## Icon Grid with Uniform Sizing

Create a grid of icons with consistent dimensions:

| Remove-Icon-Styles |
| --- |

### Grid CSS

`Icon Grid Layout`
`.icon-grid {`
`  display: grid;`
`  grid-template-columns: repeat(4, 1fr);`
`  gap: 1rem;`
`}`
``
`.icon-grid .icon {`
`  height: 64px;`
`  width: 64px;`
`}`

## Accessibility Example

Icons with proper accessibility attributes:

| Remove-Icon-Styles |
| --- |

`Accessible Icon Pattern`
`<span class="icon" role="img" aria-label="Settings">`
`  <img src="settings.svg" alt="Settings">`
`</span>`
``
`<button>`
`  <span class="icon" aria-hidden="true">`
`    <img src="save.svg" alt="">`
`  </span>`
`  Save`
`</button>`

---

**Note**: All examples use the single-backtick code format as required by EDS markdown processing.
