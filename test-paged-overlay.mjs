import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to page...');
  await page.goto('https://main--allaboutv2--ddttom.aem.page/blogs/ddt/integrations/live-jupyter-notebook', {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(3000);

  console.log('\nLooking for "Start Reading" button...');
  const startButton = await page.locator('button:has-text("Start Reading")').first();
  if (await startButton.isVisible()) {
    console.log('✓ Found Start Reading button, clicking it...');
    await startButton.click();
    await page.waitForTimeout(2000);

    console.log('\nChecking for paged overlay...');
    const pagedOverlay = await page.locator('.ipynb-paged-overlay').first();
    const isVisible = await pagedOverlay.isVisible();
    console.log(`Paged overlay visible: ${isVisible}`);

    if (isVisible) {
      console.log('\nChecking for pagination controls...');
      const pagination = await page.locator('.ipynb-pagination').first();
      const paginationVisible = await pagination.isVisible();
      console.log(`Pagination div visible: ${paginationVisible}`);

      const prevButton = await page.locator('.ipynb-prev-button').first();
      const nextButton = await page.locator('.ipynb-next-button').first();
      const pageIndicator = await page.locator('.ipynb-page-indicator').first();

      console.log(`Previous button visible: ${await prevButton.isVisible()}`);
      console.log(`Next button visible: ${await nextButton.isVisible()}`);
      console.log(`Page indicator visible: ${await pageIndicator.isVisible()}`);

      // Check computed styles
      if (paginationVisible) {
        const paginationBox = await pagination.boundingBox();
        console.log(`\nPagination bounding box:`, paginationBox);
      }

      console.log('\nTesting ESC key...');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      const stillVisible = await pagedOverlay.isVisible();
      console.log(`After ESC, paged overlay still visible: ${stillVisible}`);
    }
  } else {
    console.log('❌ Start Reading button not found');
  }

  await page.waitForTimeout(5000);
  await browser.close();
})();
