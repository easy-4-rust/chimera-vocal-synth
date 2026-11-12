/** Real-browser regression for #33; force AudioContext output rates before the app boots.
 * Usage: CHIMERA_BROWSER_EXECUTABLE=<existing Chrome> bun tools/e2e-device-sample-rates.ts [url] [outdir]
 * No physical Bluetooth device or microphone access is required or claimed.
 */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const url = process.argv[2] ?? "http://127.0.0.1:5318/";
const outDir = process.argv[3] ?? "out/device-sample-rates";
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHIMERA_BROWSER_EXECUTABLE ? { executablePath: process.env.CHIMERA_BROWSER_EXECUTABLE } : {}),
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const cases: Array<{ rate: number; samples: Array<{ rate: number; rms: number; clock: number }>; errors: string[] }> = [];
let failure: string | null = null;
const browserVersion = browser.version();
try {
  for (const rate of [48000, 16000, 24000]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const result = { rate, samples: [] as Array<{ rate: number; rms: number; clock: number }>, errors: [] as string[] };
    cases.push(result);
    page.on("pageerror", e => result.errors.push(e.message));
    page.on("console", m => { if (m.type() === "error") result.errors.push(m.text()); });
    await page.addInitScript((sampleRate: number) => {
      const Original = window.AudioContext;
      window.AudioContext = class extends Original {
        constructor(options?: AudioContextOptions) { super({ ...options, sampleRate }); }
      };
    }, rate);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /breathe in and start/i }).click();
    await page.waitForTimeout(2000);
    for (let i = 0; i < 24; i++) {
      await page.waitForTimeout(250);
      const sample = await page.evaluate(() => {
        const e = (window as unknown as { __chimeraEngine?: { sampleRate: number; latest?: { t: { outRms: number; clock: number } } } }).__chimeraEngine;
        return { rate: e?.sampleRate ?? -1, rms: e?.latest?.t.outRms ?? -1, clock: e?.latest?.t.clock ?? -1 };
      });
      result.samples.push(sample);
      if (sample.rate !== rate || !Number.isFinite(sample.rms) || sample.rms <= 0.001) {
        throw new Error(`${rate} Hz: invalid browser audio telemetry ${JSON.stringify(sample)}`);
      }
    }
    if (result.samples.at(-1)!.clock <= result.samples[0].clock + 3) throw new Error(`${rate} Hz: voice clock stopped`);
    if (result.errors.length) throw new Error(`${rate} Hz: browser errors: ${result.errors.join("; ")}`);
    console.log(`BROWSER_RATE ${rate} Hz: 24 finite audible telemetry observations, advancing clock`);
    await page.close();
  }
  const mean = (c: typeof cases[number]) => c.samples.reduce((sum, s) => sum + s.rms, 0) / c.samples.length;
  const reference = mean(cases[0]);
  for (const c of cases.slice(1)) {
    const rms = mean(c);
    if (!(rms > 0.5 * reference && rms < 2 * reference)) throw new Error(`${c.rate} Hz: mean RMS ${rms}, reference ${reference}`);
  }
} catch (e) {
  failure = e instanceof Error ? e.message : String(e);
  console.error(failure);
} finally {
  writeFileSync(`${outDir}/report.json`, JSON.stringify({ browserVersion, url, cases, failure, scope: "Headless Chrome, forced AudioContext rates; not physical-device listening or a long-duration reliability certification" }, null, 2) + "\n");
  await browser.close();
}
if (failure) process.exitCode = 1;
