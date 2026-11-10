## ADDED Requirements

### Requirement: CLI remains independently executable

The project MUST retain the Native CLI as an independent entry point for offline synthesis, diagnostics, calibration, and evaluation.

#### Scenario: Render without a browser

- **GIVEN** a valid CLI installation and input
- **WHEN** a supported render command is invoked
- **THEN** the CLI writes a valid audio artifact without launching a browser.

### Requirement: Existing command surface is preserved

All commands declared by the adoption baseline MUST remain available or have an explicitly reviewed compatibility disposition.

#### Scenario: Invoke each existing command

- **GIVEN** the CLI usage surface at the pinned baseline
- **WHEN** each render, diagnose, calibrate, and comparison command is invoked with valid arguments
- **THEN** it produces the documented output or a documented external-data prerequisite result.

### Requirement: Audio outputs are verifiable

The CLI MUST produce audio files with documented sample rate, channel count, encoding, duration, and integrity.

#### Scenario: Validate a rendered WAV

- **GIVEN** a successful render
- **WHEN** the output file is inspected
- **THEN** its container metadata and sample payload match the command's documented contract.

### Requirement: Restricted evaluation data is not redistributed

The project MUST preserve third-party data restrictions and MUST NOT commit CSD recordings or derivatives whose license does not permit product redistribution.

#### Scenario: Run evaluation with external data

- **GIVEN** a separately acquired evaluation dataset and its license terms
- **WHEN** the comparison command runs
- **THEN** data and generated outputs remain outside distributable product assets unless redistribution is explicitly permitted.
