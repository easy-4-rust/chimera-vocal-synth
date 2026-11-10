## ADDED Requirements

### Requirement: Complete inherited application is retained

The project MUST retain the complete upstream React application and its existing routes, screens, interaction modes, and supporting tools within the adoption scope.

#### Scenario: Open each existing mode

- **GIVEN** a successfully built application
- **WHEN** a user opens Play, Speak, Sing, Beatbox, Bestiary, and Duet
- **THEN** each mode renders its existing controls and interaction surface without being replaced by a placeholder.

### Requirement: UI uses the shared Rust engine

The browser application MUST use the WASM adapter over the shared Rust engine for synthesis behavior and MUST NOT introduce a divergent TypeScript acoustic engine.

#### Scenario: Play a voice in the browser

- **GIVEN** the WASM engine has initialized successfully
- **WHEN** a user triggers an existing voice or creature interaction
- **THEN** audio and telemetry are produced by the Rust engine through the WASM/AudioWorklet path.

### Requirement: Browser lifecycle is handled explicitly

The application MUST handle WASM startup ordering, secure-context requirements, audio permissions, and documented browser failure states.

#### Scenario: Audio permission is denied

- **GIVEN** the browser denies audio access or playback activation
- **WHEN** the user attempts to start audio
- **THEN** the application reports the blocked state and provides the supported recovery action.

### Requirement: Existing input integrations remain functional

Existing keyboard, MIDI, and query-driven interaction paths MUST be preserved and tested where the host environment supports them.

#### Scenario: MIDI device is unavailable

- **GIVEN** Web MIDI is unsupported, permission is denied, or no device is connected
- **WHEN** the application initializes its MIDI integration
- **THEN** the rest of the application remains usable and the MIDI limitation is communicated.
