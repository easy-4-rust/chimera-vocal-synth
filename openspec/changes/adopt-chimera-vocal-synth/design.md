# Design: Chimera adoption

## 1. Adoption model

Keep the upstream repository as the source of inherited product behavior. The Easy-4-Rust repository remains a Fork, not a source-code reimplementation.

- `upstream`: `https://github.com/jamesondh/chimera-vocal-synth.git`
- `origin`: `https://github.com/easy-4-rust/chimera-vocal-synth.git`
- Adoption baseline: `5ab44de236b0eb384ec4d81ec216e0d0928a9f7a`
- Integration branch: `integration/phase-1` (create after verifying branch policy and baseline).
- This change branch: `openspec/adopt-chimera-vocal-synth`.

Do not rewrite shared upstream history. Prefer merge-based upstream synchronization so inherited commits remain traceable. Keep Easy-4-Rust changes in isolated commits and document every intentional divergence.

## 2. Product boundary

The complete Phase 1 product contains four runtime surfaces plus supporting assets:

1. Native Rust library: `crates/chimera`.
2. WASM adapter: `crates/chimera-wasm`, its C ABI, wire format, TypeScript facade, and AudioWorklet.
3. CLI: `crates/chimera-cli` and the associated render, diagnose, calibrate, and comparison tools.
4. React web application: UI, routing/modes, visualizations, WebAudio graph, MIDI integration, and browser lifecycle.

Tests, golden fixtures, calibration tables, benchmarks, scripts, and documentation are part of the adoption scope, not optional extras.

## 3. Preserve source-of-truth boundaries

- `chimera` owns acoustic simulation, anatomy, articulatory control, phonetics, synthesis, and analysis behavior.
- `chimera-wasm` exposes a narrow platform ABI; it must not duplicate engine behavior.
- `chimera-cli` provides offline commands and diagnostics; it must use the same Native engine.
- React/TypeScript owns presentation, browser device integration, and user interaction. It must not become a second acoustic engine.
- AudioWorklet performs bounded, real-time audio work only. Expensive planning, dictionary loading, model construction, and other allocating operations stay off the audio render callback unless specifically proven safe.
- Native and WASM should continue to use the same Rust engine implementation.

## 4. Compatibility invariants

The adoption must preserve, or explicitly explain any approved change to:

- FDTD numerical behavior and acoustic model constants.
- Existing source, articulator, gesture, planner, and creature behavior.
- Engine command ordering and absolute-sample timing semantics.
- No-allocation steady-state rendering contract.
- Bounded gesture/scheduling capacity and overflow behavior.
- Native/WASM ABI field order, byte layout, versioning, and NaN-as-absent semantics.
- WASM memory-view refresh after memory growth.
- AudioWorklet initialization order and fault behavior.
- CLI arguments, output formats, sample rates, and exit semantics.
- Existing React routes, modes, keyboard/MIDI interactions, and visual telemetry.
- Existing golden fixtures and their documented provenance.

A test fixture may only be re-blessed after the change is understood, reviewed, and justified. Re-blessing is not a substitute for diagnosis.

## 5. Runtime and platform validation

Validate the project in layers:

1. Rust Native workspace.
2. WASM target and ABI.
3. Bun/TypeScript typecheck and tests.
4. Production web build and preview.
5. Playwright browser E2E.
6. Platform matrix.

At minimum, record the exact tested OS, architecture, Rust toolchain, target triples, Bun version, browser version, and commands. Do not claim ARM64/macOS parity based solely on x86-64 Linux evidence. Windows, Linux, macOS, and browser support should be classified independently.

## 6. CLI and evaluation data

Exercise every command currently declared by the CLI, including render variants, diagnose, calibrate, and dataset comparison. Dataset comparison is optional to execute where the external dataset is unavailable, but the command and data contract must be documented.

CSD is licensed CC BY-NC-SA 4.0 according to upstream documentation. Do not commit CSD recordings or derivatives to the product repository. Keep dataset acquisition and output paths outside tracked product assets, and record the applicable license restrictions.

CMU Pronouncing Dictionary and font assets retain their own licenses. Preserve license notices and verify each bundled font's license before redistribution.

## 7. Upstream synchronization

For each upstream update:

1. Fetch upstream refs.
2. Record old and new upstream SHAs.
3. Review changed paths and dependency changes.
4. Classify changes affecting DSP, Engine API, ABI, phonetics, UI, tests, fixtures, generated data, and licensing.
5. Merge into a dedicated sync branch.
6. Run impacted golden, Native, WASM, CLI, and browser tests.
7. Record conflicts and Easy-4-Rust-specific adaptations.
8. Merge to the integration/stable branch only after review.

Do not automatically merge upstream changes into a release branch without the compatibility gates.

## 8. Evidence and status model

Every task and validation report must distinguish VERIFIED, STATIC_REVIEW, NOT_RUN, and BLOCKED. A green compile is not evidence of complete UI behavior; a passing unit suite is not evidence of audio quality; a static code review is not a runtime test.

## 9. Risks and mitigations

- Audio regressions: preserve golden fixtures and require explicit review for changes.
- Real-time allocation or blocking: retain allocation tests and keep planning/model construction off the audio thread.
- ABI drift: test Rust and TypeScript wire layouts together and require a layout version bump for incompatible changes.
- Platform divergence: report per-platform evidence rather than extrapolating.
- License contamination: maintain third-party notices and exclude restricted datasets.
- Upstream divergence: keep a baseline/sync ledger and prefer merge-based updates.
- Scope creep: defer new languages, embedded ports, and product integrations to later changes.
