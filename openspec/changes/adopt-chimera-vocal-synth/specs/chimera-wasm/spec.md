## ADDED Requirements

### Requirement: WASM is an adapter over the Native engine

The WASM crate MUST expose the same underlying Rust synthesis implementation rather than maintaining a second acoustic engine.

#### Scenario: Browser and Native use the same engine behavior

- **GIVEN** equivalent engine configuration and commands
- **WHEN** Native and WASM render the same supported scenario
- **THEN** their output is compared using the documented cross-target golden method and any target-specific limitation is recorded.

### Requirement: ABI layout is versioned and explicit

The WASM boundary MUST preserve the documented C ABI, buffer ownership, fixed binary gesture layout, field order, and layout-version contract.

#### Scenario: Decode a gesture record

- **GIVEN** a valid record encoded according to the current layout version
- **WHEN** the WASM adapter reads the record
- **THEN** every field, optional value, label, and target is decoded according to the documented layout.

### Requirement: Memory views remain valid

The browser adapter MUST refresh typed-array views when WebAssembly memory changes and MUST NOT use stale views after memory growth.

#### Scenario: Memory grows during a session

- **GIVEN** the WASM memory buffer has grown
- **WHEN** the browser next accesses exported buffers
- **THEN** it recreates views against the current memory buffer before reading or writing.

### Requirement: AudioWorklet steady-state work is bounded

The AudioWorklet render path MUST avoid blocking operations and unbounded work, and MUST preserve the engine's documented real-time allocation constraints.

#### Scenario: Process an audio quantum

- **GIVEN** the WASM module and engine are initialized
- **WHEN** the AudioWorklet processes an audio quantum
- **THEN** it renders within the bounded buffer contract and does not perform dictionary loading, planning, or model construction.

### Requirement: Browser faults are observable

WASM initialization failures and engine traps MUST be surfaced to the host application as observable failures rather than being silently reported as successful playback.

#### Scenario: WASM initialization fails

- **GIVEN** the module cannot be instantiated
- **WHEN** the application starts
- **THEN** the application presents the documented retryable failure state and does not enter a false-ready state.
