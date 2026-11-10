## ADDED Requirements

### Requirement: Upstream provenance is traceable

The project MUST record its upstream repository, Fork repository, adoption baseline, and every synchronized upstream commit range.

#### Scenario: Inspect the current integration baseline

- **GIVEN** a checked-out integration branch
- **WHEN** a maintainer inspects the upstream ledger
- **THEN** the upstream SHA, local SHA, merge range, and divergence are identifiable.

### Requirement: Upstream changes are reviewed before integration

Upstream changes MUST be classified and validated before they are merged into the maintained integration branch.

#### Scenario: Synchronize upstream main

- **GIVEN** upstream main has advanced
- **WHEN** a synchronization branch is prepared
- **THEN** changed paths are reviewed for DSP, Engine API, ABI, phonetics, UI, dependencies, fixtures, generated data, and licensing before merge.

### Requirement: Local extensions remain distinguishable

Easy-4-Rust-specific changes MUST be isolated and documented so that upstream synchronization does not silently overwrite or misattribute them.

#### Scenario: Resolve an upstream conflict

- **GIVEN** an upstream change conflicts with an Easy-4-Rust extension
- **WHEN** the conflict is resolved
- **THEN** the chosen behavior, source provenance, tests, and rationale are recorded.

### Requirement: Synchronization is not automatic release approval

A successful merge from upstream MUST NOT by itself be treated as proof that the synchronized code is ready for release.

#### Scenario: Upstream merge completes

- **GIVEN** an upstream merge has been created
- **WHEN** release readiness is assessed
- **THEN** all impacted Native, WASM, CLI, UI, golden, license, and CI gates are evaluated independently.
