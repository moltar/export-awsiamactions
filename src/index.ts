import { readFile, writeFile } from 'fs/promises';
import jsonStableStringify from 'json-stable-stringify';
import playwright from 'playwright';

const SAVE_FILENAME = process.argv.at(2) ?? 'awsiamactions.json';

async function main() {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Load page
  await page.goto('https://www.awsiamactions.io/');
  await page.waitForLoadState('networkidle');

  // Save
  const downloadPromise = page.waitForEvent('download');
  await page.getByText('Save As...').click();
  const download = await downloadPromise;
  await download.saveAs(SAVE_FILENAME);

  // Done
  await browser.close();

  // Stable sort the output
  const fileContents = await readFile(SAVE_FILENAME, 'utf8');
  const fileContentsJson = jsonStableStringify(JSON.parse(fileContents), {
    space: 2,
  });
  await writeFile(SAVE_FILENAME, fileContentsJson, 'utf8');
}

main().catch((err) => console.error(err));
