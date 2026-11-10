## ADDED Requirements

### Requirement: Validation results are reproducible

Every adoption validation report MUST record the tested commit, OS, architecture, toolchain, command, raw outcome, and evidence status.

#### Scenario: Record a validation run

- **GIVEN** a build, test, benchmark, or browser test has been executed
- **WHEN** its result is added to the adoption evidence
- **THEN** another maintainer can identify the exact environment and reproduce the command.

### Requirement: Golden changes require explicit review

Golden fixtures MUST NOT be regenerated merely to make a failing test pass; every intentional update requires a documented explanation and review.

#### Scenario: A golden fixture changes

- **GIVEN** a code change causes an inherited fixture to differ
- **WHEN** the fixture update is proposed
- **THEN** the change includes a diagnosis, before/after evidence, rationale, and approval before re-blessing.

### Requirement: Coverage is baselined before threshold enforcement

The project MUST record a `cargo llvm-cov` baseline before introducing a new coverage threshold.

#### Scenario: Establish initial coverage

- **GIVEN** the adoption baseline and the supported coverage toolchain
- **WHEN** coverage is measured
- **THEN** the report records line, region, and function coverage plus exclusions and command metadata.

### Requirement: CI validates all product surfaces

CI MUST validate Native Rust, WASM build, TypeScript typecheck, React production build, and the browser tests that can run in the configured environment.

#### Scenario: Run the adoption CI pipeline

- **GIVEN** a proposed change to the integration branch
- **WHEN** the CI workflow executes
- **THEN** all applicable gates report pass, fail, or an explicitly permitted blocked/skipped state.

### Requirement: Security and license findings are triaged

Dependency, security, and license findings MUST be recorded and triaged rather than silently ignored.

#### Scenario: Dependency audit reports an advisory

- **GIVEN** a dependency audit identifies an advisory
- **WHEN** the finding is reviewed
- **THEN** severity, reachability, affected target, mitigation, and disposition are documented.
