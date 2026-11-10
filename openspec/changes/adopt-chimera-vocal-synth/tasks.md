# Tasks: Adopt Chimera Vocal Synth

All tasks begin unchecked. Do not mark a task complete until its evidence is recorded. Use the status labels VERIFIED, STATIC_REVIEW, NOT_RUN, or BLOCKED in the relevant validation report.

## WP-01 — Repository and upstream management

- [ ] T001 Verify the GitHub repository parent points to `jamesondh/chimera-vocal-synth`.
- [ ] T002 Verify default branch, visibility, permissions, and branch protection for the Easy-4-Rust Fork.
- [ ] T003 Record upstream and fork baseline SHAs and confirm common ancestry.
- [ ] T004 Configure and verify local `origin` and `upstream` remotes.
- [ ] T005 Create `integration/phase-1` from the verified adoption baseline.
- [ ] T006 Document the fetch/merge/push procedure for upstream synchronization.
- [ ] T007 Document feature/fix branch and pull-request rules for Easy-4-Rust changes.
- [ ] T008 Create an upstream commit ledger recording inherited and local commits.
- [ ] T009 Document conflict resolution, rollback, and sync verification procedures.

**WP-01 exit criteria:** Fork parent and shared history are verified; branch and remote topology is reproducible; no upstream history is rewritten.

## WP-02 — Source asset and license audit

- [ ] T010 Generate a complete tracked-file inventory at the pinned baseline.
- [ ] T011 Inventory all Cargo workspace members, targets, examples, benches, and build scripts.
- [ ] T012 Inventory Bun scripts, dependencies, lockfiles, Vite configuration, and browser build inputs.
- [ ] T013 Verify the upstream MIT license and preserve its attribution and notice.
- [ ] T014 Verify the CMU Pronouncing Dictionary license and the bundled notice.
- [ ] T015 Inventory bundled fonts and verify each font's redistribution license.
- [ ] T016 Inventory audio, image, fixture, and evaluation data; record provenance and restrictions.
- [ ] T017 Review `.gitignore` and identify generated, local-only, large, or sensitive files.
- [ ] T018 Produce a third-party NOTICE/license inventory without replacing upstream notices.
- [ ] T019 Record the adoption baseline, source URLs, file inventory checksum, and all asset dispositions.

**WP-02 exit criteria:** Every tracked asset is accounted for; no restricted dataset or unlicensed asset is added; all notices remain available.

## WP-03 — Native Engine acceptance

- [ ] T020 Review and inventory the public `chimera` Engine and voice APIs.
- [ ] T021 Review FDTD network equations, numerical guards, stability tests, and frequency-domain oracle tests.
- [ ] T022 Validate HumanVoice rendering, control updates, release behavior, and telemetry.
- [ ] T023 Validate CreatureVoice and each shipped creature definition/call path.
- [ ] T024 Validate human vocal-tract geometry, articulator constraints, and body blending.
- [ ] T025 Validate IPA tokenization, English G2P, syllabification, gesture planning, and singing planning.
- [ ] T026 Validate FFT, LPC, YIN, formant/transfer-function analysis, and diagnostics.
- [ ] T027 Run Native golden tests and record exact counts, failures, and fixture provenance.
- [ ] T028 Run the real-time allocation tests for render/control paths after initialization.
- [ ] T029 Run block-size independence and event-timing tests across the documented range.
- [ ] T030 Validate independent Engine instances and concurrent rendering isolation where supported.
- [ ] T031 Run and record Native performance benchmarks against the upstream baseline methodology.
- [ ] T032 Build and test on Windows, Linux, and macOS where runners/toolchains are available; record architecture-specific gaps.

**WP-03 exit criteria:** Native behavior is validated against existing fixtures and contracts; all deviations are explained; no unexplained fixture re-blessing occurs.

## WP-04 — WASM and AudioWorklet acceptance

- [ ] T033 Inventory all exported WASM ABI functions, handles, buffers, and lifecycle rules.
- [ ] T034 Audit the Gesture binary record layout and its Rust/TypeScript definitions.
- [ ] T035 Verify `LAYOUT_VERSION` handling and document compatibility/bump rules.
- [ ] T036 Build the `wasm32-unknown-unknown` target and verify the expected import policy.
- [ ] T037 Test memory growth and recreation of JavaScript typed-array views.
- [ ] T038 Validate AudioWorklet render behavior, buffer limits, and silence/error behavior.
- [ ] T039 Validate command ordering, scheduling, cancellation/release, and sample-time semantics.
- [ ] T040 Validate human-body and creature switching and state transitions.
- [ ] T041 Run browser audio output tests in a supported secure context.
- [ ] T042 Run Native/WASM golden comparison and record target, architecture, and comparison method.
- [ ] T043 Validate startup failure, WASM trap/error reporting, retry/recreation behavior, and audio permission failures.
- [ ] T044 Record WASM runtime and startup performance baselines.

**WP-04 exit criteria:** WASM builds; ABI and wire tests pass; AudioWorklet runs without blocking/allocating engine work in its steady-state render path; failures are observable.

## WP-05 — CLI and offline audio tooling acceptance

- [ ] T045 Validate `chimera render speech` with deterministic sample output.
- [ ] T046 Validate `chimera render text` with dictionary and fallback pronunciation paths.
- [ ] T047 Validate `chimera render song` and shipped demo-song behavior.
- [ ] T048 Validate `chimera render notes`, input schema, timing, and optional telemetry output.
- [ ] T049 Validate `chimera render beatbox`, patterns, presets, and timing.
- [ ] T050 Validate `chimera render creature` for all shipped creature identifiers.
- [ ] T051 Validate `chimera render vowels` for supported body presets.
- [ ] T052 Validate `chimera diagnose` output and diagnostic metric interpretation.
- [ ] T053 Validate `chimera calibrate vowels` without overwriting committed calibration data unintentionally.
- [ ] T054 Validate `chimera calibrate consonants` and generated-table provenance.
- [ ] T055 Validate `chimera compare csd` argument handling and report generation when the separately licensed dataset is available.
- [ ] T056 Validate WAV sample rate, channel count, duration, encoding, and file integrity.
- [ ] T057 Validate float WAV output and compare it with the default PCM output.
- [ ] T058 Validate invalid arguments, missing data, I/O failures, error messages, and process exit codes.

**WP-05 exit criteria:** Every existing CLI command has a reproducible validation result; restricted evaluation data is not committed.

## WP-06 — React web application acceptance

- [ ] T059 Inventory routes, screens, navigation, query-driven views, and application entry points.
- [ ] T060 Exercise Play mode, articulator controls, keyboard input, and live audio.
- [ ] T061 Exercise Speak mode with English text and IPA input, planning visualization, and playback.
- [ ] T062 Exercise Sing mode, piano roll, lyrics, note timing, and live note controls.
- [ ] T063 Exercise Beatbox pads, sequencer, presets, and tempo controls.
- [ ] T064 Exercise Bestiary for all shipped creatures and their controls.
- [ ] T065 Exercise Duet query/show flow, synchronized playback, and multi-head visualization.
- [ ] T066 Validate Web MIDI availability, permission denial, device disconnect, and input mapping.
- [ ] T067 Validate vocal-tract/anatomy visualization against engine telemetry.
- [ ] T068 Validate pressure, airflow, glottal, formant, and creature telemetry rendering.
- [ ] T069 Validate WASM initialization ordering, refresh, and navigation/reload lifecycle.
- [ ] T070 Validate browser audio permission, autoplay restrictions, and secure-context behavior.
- [ ] T071 Validate supported viewport sizes, layout lint, and accessible control behavior.
- [ ] T072 Run Playwright E2E against the production preview and record browser/version/results.

**WP-06 exit criteria:** Every existing user-facing mode is exercised; no screen is considered accepted solely because the application bundle builds.

## WP-07 — CI, quality gates, and release readiness

- [ ] T073 Inventory existing GitHub Actions workflows, secrets, permissions, and runner assumptions.
- [ ] T074 Establish Rust formatting, workspace check, and workspace test CI.
- [ ] T075 Establish WASM target build CI.
- [ ] T076 Establish Bun install and TypeScript typecheck CI.
- [ ] T077 Establish production React/Vite build CI.
- [ ] T078 Establish browser preview and Playwright E2E CI where runner capabilities allow.
- [ ] T079 Establish Native/WASM golden and ABI compatibility CI.
- [ ] T080 Establish Clippy and formatting gates without broad unrelated lint rewrites.
- [ ] T081 Establish dependency/license/security audit and triage findings by severity and reachability.
- [ ] T082 Run `cargo llvm-cov` and record a reproducible coverage baseline before setting thresholds.
- [ ] T083 Record Native and WASM performance baselines with hardware/toolchain metadata.
- [ ] T084 Define release build artifacts, checksums, provenance, and release workflow.
- [ ] T085 Define versioning, changelog, upstream attribution, and adoption release notes.

**WP-07 exit criteria:** CI gates are reproducible; coverage/performance baselines are recorded; release artifacts and provenance can be produced; unresolved blockers are explicit.

## Cross-package dependencies

- WP-01 precedes all implementation and sync work.
- WP-02 precedes redistribution/release decisions.
- WP-03 is the prerequisite for WASM and CLI runtime acceptance.
- WP-04 is the prerequisite for browser runtime acceptance in WP-06.
- WP-05 and WP-06 may proceed in parallel after WP-03.
- WP-07 foundation can be prepared early, but final release gates depend on WP-03 through WP-06.

## Completion rule

Do not close this change while any P0 acceptance criterion is unverified. Tasks blocked by unavailable hardware, browser automation, licensed datasets, or platform runners must remain explicitly BLOCKED/NOT_RUN with a follow-up plan; they must not be marked complete by inference.
