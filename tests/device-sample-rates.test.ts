/** Device-rate regression through the real WASM ABI and the main-thread JSON mirror. */
import { beforeAll, expect, test } from "bun:test";
import { initEngine, wasmModule } from "./harness.ts";
import { call } from "../src/wasm/chimera.ts";

interface AudioExports {
  memory: WebAssembly.Memory;
  engine_new(fs: number): number;
  engine_free(h: number): void;
  engine_set_body(h: number, female: number, child: number): void;
  engine_set_gate(h: number, level: number): void;
  engine_render(h: number, samples: number): number;
  engine_telemetry(h: number): number;
}
type Model = { model: number; nPh: number; nOr: number };

beforeAll(async () => { await initEngine(); });

function instance(): AudioExports {
  return new WebAssembly.Instance(wasmModule, {}).exports as unknown as AudioExports;
}

function heldRms(fs: number): number {
  const x = instance();
  const h = x.engine_new(fs);
  try {
    x.engine_set_gate(h, 1);
    let sum = 0, count = 0;
    for (let at = 0; at < 2 * fs; at += 128) {
      const n = Math.min(128, 2 * fs - at);
      const p = x.engine_render(h, n);
      const samples = new Float32Array(x.memory.buffer, p, n);
      for (let i = 0; i < n; i++) {
        if (!Number.isFinite(samples[i])) throw new Error(`${fs} Hz: non-finite WASM PCM at ${at + i}`);
        if (at + i >= fs) { sum += samples[i] * samples[i]; count++; }
      }
    }
    return Math.sqrt(sum / count);
  } finally { x.engine_free(h); }
}

for (const fs of [8000, 16000, 22050, 24000]) {
  test(`WASM held voice stays finite and audible at ${fs} Hz`, () => {
    const reference = heldRms(48000);
    const rms = heldRms(fs);
    console.log(`WASM_DEVICE_RATE fs=${fs} rms=${rms} reference=${reference}`);
    expect(rms).toBeGreaterThan(0.5 * reference);
    expect(rms).toBeLessThan(2 * reference);
  }, 30000);
}

test("main-thread anatomy mirrors the safe audio-thread topology for all body presets", () => {
  for (const fs of [8000, 16000, 22050, 24000, 32000, 44100, 48000, 60000, 88200, 96000]) {
    const factor = Math.floor(60000 / fs) + 1;
    for (const body of [{ female: 0, child: 0 }, { female: 1, child: 0 }, { female: 0, child: 1 }]) {
      // Asking for the internal rate itself selects 1x, giving an independent mirror oracle.
      const expected = call<Model>("model", { body, sampleRate: fs * factor });
      const mirror = call<Model>("model", { body, sampleRate: fs });
      const x = instance();
      const h = x.engine_new(fs);
      try {
        x.engine_set_body(h, body.female, body.child);
        const p = x.engine_telemetry(h);
        const head = new Float64Array(x.memory.buffer, p, 16);
        expect([mirror.nPh, mirror.nOr]).toEqual([expected.nPh, expected.nOr]);
        expect([head[12], head[13]]).toEqual([mirror.nPh, mirror.nOr]);
      } finally {
        x.engine_free(h);
        call("dropModel", { model: expected.model });
        if (mirror.model !== expected.model) call("dropModel", { model: mirror.model });
      }
    }
  }
}, 30000);
