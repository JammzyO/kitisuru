import puppeteer from "puppeteer";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] ? `-${process.argv[3]}` : "";
const outDir = "./temporary screenshots";

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// Auto-increment filename
const existing = existsSync(outDir)
  ? readdirSync(outDir).filter((f) => f.startsWith("screenshot-")).length
  : 0;
const filename = join(outDir, `screenshot-${existing + 1}${label}.png`);

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1000));
await page.screenshot({ path: filename, fullPage: false });
await browser.close();

console.log(`Screenshot saved: ${filename}`);
