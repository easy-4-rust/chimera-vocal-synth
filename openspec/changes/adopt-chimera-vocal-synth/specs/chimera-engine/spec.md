## ADDED Requirements

### Requirement: Default voice constructors handle validated device sample rates

The default Engine and HumanVoice constructors MUST use one shared oversampling policy that keeps the human airway simulation above 60 kHz for the validated positive finite output rates. The browser's main-thread airway mirror MUST use the same policy and produce matching node counts. Explicit low-level oversampling configuration remains caller-owned.

#### Scenario: Hold a voice at a low output rate

- **GIVEN** a default human voice at 8000, 16000, 22050, 24000, or 32000 Hz
- **WHEN** it renders a held voice in 128-sample blocks for two seconds
- **THEN** every sample is finite and the second-second RMS stays between 0.5 and 2 times the corresponding 48000 Hz reference, rather than silently outputting NaN or limiter saturation.

#### Scenario: Preserve inherited normal-rate behavior

- **GIVEN** the default constructors at 44100, 48000, 60000, 88200, and 96000 Hz
- **WHEN** the oversampling policy is applied
- **THEN** the factors remain 2, 2, 2, 1, and 1, and the inherited golden suite passes without re-blessing.


### Requirement: Native engine is independently usable

The project MUST provide the CHIMERA acoustic and vocal synthesis engine as a Rust library that can be built and used without a browser runtime.

#### Scenario: Render through the Native library

- **GIVEN** a supported sample rate and a successfully initialized Engine
- **WHEN** a caller renders into a caller-provided PCM buffer
- **THEN** the engine produces the rendered samples without requiring React, WebAudio, or a browser.

### Requirement: Preserve upstream synthesis behavior

The adoption MUST preserve upstream acoustic equations, constants, control semantics, phonetics behavior, and golden fixtures unless a separately reviewed change explicitly authorizes a behavior change.

#### Scenario: Run the inherited golden suite

- **GIVEN** the pinned adoption baseline
- **WHEN** the Native golden tests are executed
- **THEN** all inherited fixtures pass or every failure is recorded with its cause and disposition.

### Requirement: Steady-state rendering is real-time safe

The engine MUST preserve its documented no-allocation steady-state rendering contract after initialization for the paths covered by the upstream contract.

#### Scenario: Repeated rendering after warm-up

- **GIVEN** an initialized engine and warmed buffers
- **WHEN** repeated render and documented real-time control operations are executed
- **THEN** no heap allocation occurs on the real-time path.

### Requirement: Allocating operations are explicit

The project MUST document operations that allocate or rebuild internal state and MUST keep such operations off the real-time render callback unless separately proven safe.

#### Scenario: Plan speech outside the audio callback

- **GIVEN** a text or phonetic planning request
- **WHEN** the host creates a gesture plan
- **THEN** planning runs on a non-real-time execution context and the render callback receives the prepared schedule.

### Requirement: Equivalent event timelines are deterministic

The engine MUST preserve output determinism for equivalent command timelines and supported host block sizes as defined by the upstream contract.

#### Scenario: Render with different host block sizes

- **GIVEN** identical initial state and commands at identical absolute sample positions
- **WHEN** the same session is rendered using supported block sizes
- **THEN** output samples are identical under the tested target/build conditions.

### Requirement: Engine instances are isolated

Independent engine instances MUST NOT share mutable synthesis state in a way that causes cross-instance interference.

#### Scenario: Render two independent voices

- **GIVEN** two separately initialized engine instances with different inputs
- **WHEN** both are rendered concurrently or interleaved
- **THEN** each output and telemetry stream reflects only its own state.
