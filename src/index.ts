import playwright from 'playwright';

async function main () {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://amazon.com');
  await page.waitForTimeout(1000);
  await browser.close();
}

main().catch((err)=>console.error(err));
