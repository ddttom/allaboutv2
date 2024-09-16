# Inline SVG

This block displays an inline SVG from the first row of the block.

## Usage

Place the SVG code in the first cell of the first row of the block. The block will remove the container and display the SVG inline.

## Authoring

In your Google Docs or Microsoft Word document, create a two-column table with one row. Place the SVG code in the second column of the first row.

| Inline SVG |                                 |
|------------|:--------------------------------|
|            | `<svg>...</svg>` (Your SVG here) |

## Styling

The block adds an `inline-svg` class to the root element. You can customize the appearance using 

css
.inline-svg {
/ Your custom styles here /
}



## Behavior

The block extracts the SVG from the first row and displays it inline, removing the original container. If no valid SVG is found, a warning is logged to the console.

## Dependencies

This block has no external dependencies.