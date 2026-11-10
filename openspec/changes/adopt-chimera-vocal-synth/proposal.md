# Adopt Chimera Vocal Synth

## Status

In progress. WP-01 and WP-02 have evidence-backed completion recorded in [the adoption ledger](../../../docs/adoption/phase-1/task-evidence.md). Product acceptance and release readiness remain open. No task is complete merely because this change exists; see [remaining risks](../../../docs/adoption/phase-1/risk-register.md).

## Why

Adopt the complete upstream CHIMERA physical-modeling vocal synthesizer into Easy-4-Rust as a maintainable, independently buildable product. The adoption includes the Rust engine, WebAssembly boundary, AudioWorklet integration, CLI, React application, tests, fixtures, tools, documentation, and upstream synchronization process.

The upstream project is technically distinctive because it models vocal production through a branched acoustic airway network and articulatory control rather than relying exclusively on recorded samples or neural waveform generation. Easy-4-Rust should preserve that capability and its existing product experience before adding new language or product features.

## Source and baseline

- Upstream: https://github.com/jamesondh/chimera-vocal-synth
- Fork: https://github.com/easy-4-rust/chimera-vocal-synth
- Adoption baseline: `5ab44de236b0eb384ec4d81ec216e0d0928a9f7a`
- Upstream branch at baseline: `main`
- Fork branch at baseline: `main`
- Fork and upstream were equal when the plan was prepared. During adoption, upstream was observed at `d361a82ce1b18d0ac19001aab19169ff2c1eb9e8` (19 upstream-only commits). The frozen product baseline remains unchanged; those commits were not merged. See [baseline evidence](../../../UPSTREAM_BASELINE.md).

## What changes

1. Establish a traceable Fork workflow and an isolated Phase 1 integration branch.
2. Inventory all source, build, runtime, test, fixture, tool, documentation, and data assets.
3. Preserve and validate the complete Rust Native Engine.
4. Preserve and validate the WASM ABI and browser AudioWorklet.
5. Preserve and validate all existing CLI rendering, diagnostics, calibration, and comparison commands.
6. Preserve and validate the complete React application and its existing interaction modes.
7. Establish repeatable CI, cross-target validation, coverage baselines, performance baselines, and release practices.
8. Record all findings with commit, environment, command, raw result, and evidence status.

## Non-goals

- Do not rewrite or retune the FDTD acoustic model.
- Do not change existing sound behavior or regenerate golden fixtures to hide unexplained differences.
- Do not replace React with GPUI, Tauri, or another UI framework.
- Do not merge Chimera into AgentScope Runtime or make it dependent on an AgentScope component.
- Do not implement Chinese, Japanese, or other new G2P systems in this adoption change.
- Do not implement ESP32 or embedded targets.
- Do not claim the planned two-mass vocal-fold model or other documented future features are already implemented.
- Do not redistribute CSD recordings or other restricted evaluation assets.
- Do not publish or merge the integration branch until the acceptance gates are met and reviewed.

## Work packages

- WP-01: repository and upstream management.
- WP-02: source asset and license audit.
- WP-03: Native Engine acceptance.
- WP-04: WASM and AudioWorklet acceptance.
- WP-05: CLI and offline audio tooling acceptance.
- WP-06: React application acceptance.
- WP-07: CI, quality gates, and release readiness.

## Acceptance

The adoption is complete only when:

1. The Fork relationship, upstream remote, common history, and baseline are documented and reproducible.
2. Every in-scope tracked asset is inventoried and its disposition is recorded.
3. Native workspace build and tests pass on the declared supported platforms, or platform limitations are explicitly recorded and approved.
4. The WASM target builds and ABI/AudioWorklet tests pass.
5. Every existing CLI command has a reproducible smoke or behavioral test.
6. Every existing user-facing mode is exercised through browser E2E tests.
7. Golden fixtures remain unchanged unless an independently reviewed upstream change or intentional behavior change explains the update.
8. CI runs the relevant quality gates.
9. Coverage and performance baselines are measured and reported; no arbitrary threshold is invented before the baseline.
10. No unresolved critical license, security, data provenance, or runtime correctness issue is hidden by a green aggregate status.

## Evidence policy

Each result must be labeled as one of:

- VERIFIED: command or test actually ran and its result is recorded.
- STATIC_REVIEW: inferred from source/configuration without executing it.
- NOT_RUN: not executed.
- BLOCKED: attempted but prevented by a documented environment or dependency failure.

A planned task is not complete because its documentation exists. A build failure caused by infrastructure must not be reported as a product defect or as a pass.
