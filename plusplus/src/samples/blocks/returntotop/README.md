---
title: "return to top block"
description: "Sample EDS returntotop block from the plusplus boilerplate"
author: Tom Cranstoun
created: 2026-01-15
modified: 2026-02-09
version: "1.0"
status: active
---

# return to top block

This code adds a "return to top" button feature to the webpage. Here's how it works:

1. **Button Selection:** It first identifies the button element on the webpage that is intended to return the user to the top of the page. This button is marked with a specific class.

2. **Scroll Event Handling:** The code listens for when the user scrolls up or down on the page. If the user scrolls down more than 100 pixels, the button is made visible. If the user scrolls back up so that they are within 100 pixels from the top, the button is hidden.

3. **Button Click Behavior:** When the visible button is clicked, the page smoothly scrolls back to the top. This gives users a quick and easy way to return to the top of the page without having to manually scroll back up.
