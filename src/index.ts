import playwright from 'playwright';

async function main () {
  const browser = await playwright.chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Load page
  await page.goto('https://www.awsiamactions.io/');
  await page.waitForLoadState('networkidle');

  // Save
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Save As...').click();
  const download = await downloadPromise;
  await download.saveAs('awsiamactions.json');

  await browser.close();
}

main().catch((err)=>console.error(err));
