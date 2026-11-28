## Description

What changed and why.

## URL for testing

The AEM Code Sync bot runs PageSpeed Insights on every URL listed here, and fails the check on any URL that is not an HTML page.

- List HTML preview pages only, in the form `https://{branch}--allaboutv2--ddttom.aem.page/{path}`.
- Never list `.json`, `.txt`, `.xml`, `.pem`, `.md` or `.yaml` files, even when the PR changes them. Lighthouse cannot score them and reports `NOT_HTML`. Name them in the description instead.
- If the PR changes only non-HTML files, list the default blog page on the branch preview: `https://{branch}--allaboutv2--ddttom.aem.page/blogs/ddt/a-guide-to-ai-optimization-an-update`.

URL for testing:

- https://{branch}--allaboutv2--ddttom.aem.page/blogs/ddt/a-guide-to-ai-optimization-an-update
