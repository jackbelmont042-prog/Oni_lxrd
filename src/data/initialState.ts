import { 
  MemoryEntry, 
  KnowledgeDocument, 
  AgentProfile, 
  ToolDefinition, 
  DeviceTelemetry, 
  ComputeRoutingConfig, 
  MilestoneProgress,
  AuditLogEntry
} from '../types';

export const initialMemories: MemoryEntry[] = [
  {
    id: 'mem-001',
    category: 'preferences',
    title: 'Code Generation & Architecture Paradigm',
    content: 'User prioritizes modular local-first architecture with typed interfaces, defensive error handling, zero vendor lock-in, and explicit permission verification over automated magic.',
    confidence: 0.98,
    provenance: 'User explicit engineering manifesto v1.0',
    createdAt: '2026-10-15T09:30:00Z',
    updatedAt: '2026-10-15T09:30:00Z',
    tags: ['coding', 'architecture', 'local-first', 'standards'],
    accessCount: 42,
    isConfirmed: true,
  },
  {
    id: 'mem-002',
    category: 'preferences',
    title: 'Hardware Safety Envelope & E-Stop Policy',
    content: 'All stepper motors and optical excitation lasers require active physical interlock confirmation. Maximum translation speed is clamped to 15mm/s during autonomous runs.',
    confidence: 1.0,
    provenance: 'Lab Safety Protocol Document & User Direct Instruction',
    createdAt: '2026-10-18T14:12:00Z',
    updatedAt: '2026-10-20T11:05:00Z',
    tags: ['safety', 'hardware', 'estop', 'laboratory'],
    accessCount: 19,
    isConfirmed: true,
  },
  {
    id: 'mem-003',
    category: 'facts',
    title: 'Local Compute Rig Hardware Topology',
    content: 'Primary workstation features 24-core CPU, 64GB DDR5 system RAM, and dedicated RTX 4090 (24GB VRAM). Ollama instance runs locally on port 11434 with Q4_K_M quantized weights.',
    confidence: 0.95,
    provenance: 'System discovery scan at boot',
    createdAt: '2026-10-22T08:00:00Z',
    updatedAt: '2026-10-27T16:20:00Z',
    tags: ['hardware', 'compute', 'ollama', 'gpu'],
    accessCount: 65,
    isConfirmed: true,
  },
  {
    id: 'mem-004',
    category: 'projects',
    title: 'Project ONI-GIRYA Core Milestones',
    content: 'Active target is Milestone M5 (Controlled Tool Execution & Verification) and M7 (Laboratory Automated Interlocks). M0-M4 foundation validated with persistent palace and RAG.',
    confidence: 0.96,
    provenance: 'Engineering Backlog & Sprint 4 Review',
    createdAt: '2026-10-24T10:00:00Z',
    updatedAt: '2026-10-28T12:00:00Z',
    tags: ['oni-girya', 'roadmap', 'milestones'],
    accessCount: 88,
    isConfirmed: true,
  },
  {
    id: 'mem-005',
    category: 'procedures',
    title: 'Spectrometer Calibration Sequence',
    content: '1. Dark spectrum baseline capture (shutter closed, 100ms integration time). 2. Reference light source warm-up (300s). 3. Wavelength calibration against Xenon-Mercury emission lines (435.8nm, 546.1nm). 4. Record calibration coefficient matrix to /lab/calib_matrix.json.',
    confidence: 0.99,
    provenance: 'Analytical Chemistry Lab Manual Sec 4.1',
    createdAt: '2026-10-19T13:45:00Z',
    updatedAt: '2026-10-19T13:45:00Z',
    tags: ['spectrometry', 'calibration', 'laboratory', 'sop'],
    accessCount: 14,
    isConfirmed: true,
  },
  {
    id: 'mem-006',
    category: 'lessons',
    title: 'Untrusted Document Injection Immunity',
    content: 'Lesson #14: External markdown documents ingested into the RAG pipeline must never be allowed to execute tools or escalate permissions. The parser must treat all retrieved document tokens as data payload, never instruction control tokens.',
    confidence: 1.0,
    provenance: 'Security Red-Team Audit Round 2',
    createdAt: '2026-10-26T17:15:00Z',
    updatedAt: '2026-10-26T17:15:00Z',
    tags: ['security', 'prompt-injection', 'red-team', 'defenses'],
    accessCount: 31,
    isConfirmed: true,
  },
  {
    id: 'mem-007',
    category: 'events',
    title: 'Microfluidics Pressure Anomaly Resolved',
    content: 'On 2026-10-27 at 15:32 UTC, pneumatic line 2 spiked to 38.4 PSI. Automated safety interlock halted syringe pump within 120ms before line seal rupture occurred. Post-mortem identified particulate clogging in filter mesh.',
    confidence: 0.99,
    provenance: 'Incident Log #2026-10-27-02',
    createdAt: '2026-10-27T16:00:00Z',
    updatedAt: '2026-10-27T16:00:00Z',
    tags: ['incident', 'microfluidics', 'safety-interlock', 'post-mortem'],
    accessCount: 9,
    isConfirmed: true,
  }
];

export const initialDocuments: KnowledgeDocument[] = [
  {
    id: 'doc-001',
    title: 'ONI-GIRYA Architecture & Threat Model',
    sourceType: 'markdown',
    filename: 'oni_girya_system_spec_v1.md',
    uploadedAt: '2026-10-20T10:00:00Z',
    sizeBytes: 42100,
    chunkCount: 3,
    summary: 'Core blueprint detailing the Plan-Execute-Observe-Verify orchestrator, memory storage hierarchy, and multi-tier permission containment.',
    tags: ['architecture', 'security', 'threat-model', 'orchestrator'],
    chunks: [
      {
        id: 'chunk-001-1',
        docId: 'doc-001',
        docTitle: 'ONI-GIRYA Architecture & Threat Model',
        chunkIndex: 1,
        location: 'Section 1.2: Core Principles, Lines 14-48',
        tokenCount: 240,
        keywords: ['local-first', 'offline-capable', 'permission', 'isolation'],
        content: 'ONI-GIRYA is fundamentally designed as a local-first system. Under normal operations, all persistent memories, knowledge indices, and execution logs reside exclusively on host-controlled encrypted storage. Remote compute clusters may only receive anonymized prompt payloads when user explicitly engages Cloud Boost mode.'
      },
      {
        id: 'chunk-001-2',
        docId: 'doc-001',
        docTitle: 'ONI-GIRYA Architecture & Threat Model',
        chunkIndex: 2,
        location: 'Section 4.1: Permission Hierarchy, Lines 89-130',
        tokenCount: 310,
        keywords: ['read-only', 'consequential', 'destructive', 'approval'],
        content: 'Tools are partitioned into three immutable permission rings: Ring 0 (Read-Only: searches, telemetry, calculations) executed autonomously; Ring 1 (Consequential: file modifications, git commits, outbound network calls) requiring policy verification; Ring 2 (Destructive & Physical: actuator movements, flash writes, chemical dispensing) requiring explicit interactive user confirmation and physical E-Stop clearance.'
      },
      {
        id: 'chunk-001-3',
        docId: 'doc-001',
        docTitle: 'ONI-GIRYA Architecture & Threat Model',
        chunkIndex: 3,
        location: 'Section 7.3: RAG Citation Standard, Lines 195-240',
        tokenCount: 220,
        keywords: ['rag', 'citations', 'evidence', 'grounding'],
        content: 'Every factual assertion derived from documents must be accompanied by an immutable citation containing the source document title, location pointer (page/section/line), and the exact verbatim snippet. Answers lacking citation backing must explicitly declare ungrounded status.'
      }
    ]
  },
  {
    id: 'doc-002',
    title: 'Automated Lab Instrument & Microfluidics Protocol',
    sourceType: 'lab_protocol',
    filename: 'lab_sop_spectrometer_microfluidics.pdf',
    uploadedAt: '2026-10-22T14:30:00Z',
    sizeBytes: 89400,
    chunkCount: 2,
    summary: 'Standard operating procedures for spectrophotometric assays, syringe pump dispensing curves, and emergency fluidics cutoffs.',
    tags: ['laboratory', 'spectrometry', 'fluidics', 'safety'],
    chunks: [
      {
        id: 'chunk-002-1',
        docId: 'doc-002',
        docTitle: 'Automated Lab Instrument & Microfluidics Protocol',
        chunkIndex: 1,
        location: 'Protocol Section 2: Optical Density & UV-Vis Assay, p. 4',
        tokenCount: 280,
        keywords: ['optical density', 'absorbance', 'spectrometer', 'wavelength', 'beer-lambert'],
        content: 'Absorbance readings for protein quantification are measured at 280nm and nucleic acid purity at 260/280 ratio. Ensure optical path length is calibrated to 10.0mm. Ambient temperature in optical chamber must be maintained at 23.5°C ± 0.5°C to avoid thermal baseline drift.'
      },
      {
        id: 'chunk-002-2',
        docId: 'doc-002',
        docTitle: 'Automated Lab Instrument & Microfluidics Protocol',
        chunkIndex: 2,
        location: 'Protocol Section 5: Emergency Hardware Shutoff & Drain, p. 11',
        tokenCount: 260,
        keywords: ['e-stop', 'drain', 'pressure', 'emergency', 'interlock'],
        content: 'In the event of an E-STOP signal or telemetry deviation exceeding 32.0 PSI pressure, the controller immediately cuts 24V bus power to the XYZ gantry and depressurizes the reagent manifold. Manual inspection is mandatory prior to firmware interlock release.'
      }
    ]
  },
  {
    id: 'doc-003',
    title: 'Model Adaptation & Quantized Inference Guide',
    sourceType: 'technical_note',
    filename: 'quantization_lora_fine_tuning.md',
    uploadedAt: '2026-10-25T11:15:00Z',
    sizeBytes: 31200,
    chunkCount: 2,
    summary: 'Procedures for evaluating task performance, collecting curated feedback pairs, and training LoRA adapters on local GPUs.',
    tags: ['machine-learning', 'lora', 'fine-tuning', 'benchmarking'],
    chunks: [
      {
        id: 'chunk-003-1',
        docId: 'doc-003',
        docTitle: 'Model Adaptation & Quantized Inference Guide',
        chunkIndex: 1,
        location: 'Section 3: Evaluation-Driven Promotion, Lines 55-92',
        tokenCount: 230,
        keywords: ['evaluation', 'regression', 'benchmark', 'lora', 'promotion'],
        content: 'No fine-tuned model weight or LoRA adapter may be promoted to production without clearing the benchmark regression test suite with >= 92% pass rate. Test sets must remain held-out and completely isolated from training corpora.'
      },
      {
        id: 'chunk-003-2',
        docId: 'doc-003',
        docTitle: 'Model Adaptation & Quantized Inference Guide',
        chunkIndex: 2,
        location: 'Section 5: Rollback Mechanics, Lines 120-160',
        tokenCount: 210,
        keywords: ['rollback', 'checkpoint', 'versioning'],
        content: 'Each adapter deployment generates an immutable Git-tagged checkpoint. In case of unexpected latency spikes (>500ms over baseline) or safety violations, the Compute Manager rolls back to baseline weights within 1000ms.'
      }
    ]
  }
];

export const initialAgents: AgentProfile[] = [
  {
    id: 'orchestrator',
    name: 'ONI Core Orchestrator',
    role: 'Central Executive',
    description: 'Deconstructs multi-step user prompts into actionable plans, manages delegation trees, and enforces verification criteria.',
    capabilities: ['Task decomposition', 'Plan-Execute-Observe-Verify', 'Agent delegation', 'Result synthesis'],
    tokenBudget: 32000,
    tokensUsed: 8450,
    status: 'idle',
    permissionScope: ['all_rings_subject_to_policy'],
    assignedTasksCount: 142
  },
  {
    id: 'researcher',
    name: 'Deep Research Specialist',
    role: 'Knowledge & Synthesis',
    description: 'Queries vector indices, performs hybrid BM25 and semantic citation retrieval, checks evidence consistency, and flags knowledge gaps.',
    capabilities: ['Semantic document search', 'Evidence grounding', 'Citation extraction', 'Hypothesis testing'],
    tokenBudget: 24000,
    tokensUsed: 6120,
    status: 'idle',
    permissionScope: ['read_only_documents', 'memory_search'],
    assignedTasksCount: 68
  },
  {
    id: 'programmer',
    name: 'Code Synthesizer & Auditor',
    role: 'Software Engineer',
    description: 'Writes, reviews, type-checks, and lints code implementations. Executes tests in sandboxed environments.',
    capabilities: ['TypeScript/Python authoring', 'Static analysis', 'Test generation', 'Refactoring'],
    tokenBudget: 28000,
    tokensUsed: 11400,
    status: 'idle',
    permissionScope: ['code_sandbox', 'filesystem_read', 'git_inspect'],
    assignedTasksCount: 95
  },
  {
    id: 'memory_specialist',
    name: 'Palace Curator',
    role: 'Memory Manager',
    description: 'Extracts durable insights from completed sessions, identifies contradictions, updates confidence values, and purges stale facts.',
    capabilities: ['Fact extraction', 'Contradiction detection', 'Palace re-indexing', 'Decay computation'],
    tokenBudget: 16000,
    tokensUsed: 3910,
    status: 'idle',
    permissionScope: ['memory_read_write', 'audit_log'],
    assignedTasksCount: 53
  },
  {
    id: 'systems_operator',
    name: 'Infrastructure Daemon',
    role: 'Systems & Diagnostics',
    description: 'Monitors host hardware health, checks daemon status, inspects process tables, manages local model weights, and verifies network paths.',
    capabilities: ['System telemetry', 'Process inspection', 'Disk/RAM auditing', 'Ollama daemon health'],
    tokenBudget: 16000,
    tokensUsed: 2750,
    status: 'idle',
    permissionScope: ['system_read', 'network_diagnostic'],
    assignedTasksCount: 37
  },
  {
    id: 'lab_specialist',
    name: 'Laboratory & Hardware Actuator',
    role: 'Physical Interface',
    description: 'Interfaces with lab instruments, reads spectrometer curves, commands stepper coordinates, and verifies independent safety envelopes.',
    capabilities: ['Spectrometry analysis', 'Gantry positioning', 'Manifold pressure control', 'E-Stop verification'],
    tokenBudget: 20000,
    tokensUsed: 4180,
    status: 'idle',
    permissionScope: ['hardware_telemetry', 'hardware_actuation_gated'],
    assignedTasksCount: 29
  }
];

export const initialTools: ToolDefinition[] = [
  {
    id: 'tool_calc',
    name: 'Scientific & Unit Calculator',
    description: 'High-precision algebraic evaluation, dimensional analysis, and conversion between metric and SI scientific units.',
    permissionLevel: 'read_only',
    category: 'research',
    schema: { expression: 'string' },
    isAutomated: true
  },
  {
    id: 'tool_rag_search',
    name: 'Knowledge Vault Semantic Retriever',
    description: 'Retrieves top-k evidence passages matching query with similarity metrics and document coordinates.',
    permissionLevel: 'read_only',
    category: 'research',
    schema: { query: 'string', limit: 'number' },
    isAutomated: true
  },
  {
    id: 'tool_fs_read',
    name: 'Sandboxed File System Inspector',
    description: 'Reads authorized text files, directory structures, and git metadata within the local project workspace.',
    permissionLevel: 'read_only',
    category: 'system',
    schema: { path: 'string', recursive: 'boolean' },
    isAutomated: true
  },
  {
    id: 'tool_code_lint',
    name: 'TypeScript & Python Static Linter',
    description: 'Executes static analysis to verify type safety, missing imports, and security vulnerabilities without side-effects.',
    permissionLevel: 'read_only',
    category: 'code',
    schema: { code: 'string', language: 'string' },
    isAutomated: true
  },
  {
    id: 'tool_memory_write',
    name: 'Memory Palace Update',
    description: 'Adds or updates persistent facts, preferences, procedures, or lessons in the user Memory Palace.',
    permissionLevel: 'consequential',
    category: 'system',
    schema: { category: 'string', title: 'string', content: 'string', confidence: 'number' },
    isAutomated: false
  },
  {
    id: 'tool_fs_write',
    name: 'File System Mutator',
    description: 'Creates, modifies, or appends to designated source code or output data files in the local workspace.',
    permissionLevel: 'consequential',
    category: 'system',
    schema: { path: 'string', content: 'string' },
    isAutomated: false
  },
  {
    id: 'tool_spectrometer_scan',
    name: 'Spectrometer Optical Scan',
    description: 'Initiates wavelength sweep from 200nm to 800nm, measures optical absorbance, and reports spectrum peaks.',
    permissionLevel: 'read_only',
    category: 'hardware',
    schema: { integrationTimeMs: 'number', startWavelengthNm: 'number', endWavelengthNm: 'number' },
    isAutomated: true
  },
  {
    id: 'tool_gantry_actuate',
    name: 'Laboratory XYZ Gantry Stepper',
    description: 'Translates optical probe or pipette gantry to physical Cartesian coordinates (X, Y, Z mm). STRICTLY GATED.',
    permissionLevel: 'destructive_or_physical',
    category: 'hardware',
    schema: { targetX: 'number', targetY: 'number', targetZ: 'number', speedMmS: 'number' },
    isAutomated: false
  },
  {
    id: 'tool_estop_trigger',
    name: 'Emergency Hardware Stop (E-STOP)',
    description: 'Instantly de-energizes all physical stepper actuators, lasers, and pumps. Can be invoked anytime.',
    permissionLevel: 'destructive_or_physical',
    category: 'hardware',
    schema: { reason: 'string' },
    isAutomated: true
  }
];

export const initialDevices: DeviceTelemetry[] = [
  {
    id: 'dev-001',
    name: 'Host Workstation (Titan-Core)',
    type: 'workstation',
    status: 'online',
    ipAddress: '127.0.0.1 (Local loopback)',
    lastPing: '2026-10-28T18:10:00Z',
    metrics: {
      cpuPercent: 24.2,
      ramPercent: 41.5,
      gpuVramUsedMb: 6144,
      diskPercent: 52.8,
    },
    permissions: {
      readTelemetry: true,
      fileOperations: true,
      remoteControl: false,
      hazardousActuation: false
    }
  },
  {
    id: 'dev-002',
    name: 'Mobile Intelligence Companion',
    type: 'mobile_companion',
    status: 'online',
    ipAddress: '192.168.1.144 (Encrypted TLS)',
    lastPing: '2026-10-28T18:09:45Z',
    metrics: {
      batteryPercent: 88,
      ramPercent: 32.0,
      cpuPercent: 8.5
    },
    permissions: {
      readTelemetry: true,
      fileOperations: false,
      remoteControl: false,
      hazardousActuation: false
    }
  },
  {
    id: 'dev-003',
    name: 'Precision Lab Instrument Station #1',
    type: 'lab_station',
    status: 'online',
    ipAddress: '192.168.1.205 (Isolated Lab VLAN)',
    lastPing: '2026-10-28T18:10:12Z',
    metrics: {
      spectrometerWavelengthNm: 546.1,
      spectrometerIntensity: 0.884,
      stepperPositionMm: { x: 45.0, y: 120.5, z: 12.0 },
      chamberPressurePsi: 14.8,
      chamberTempC: 23.4,
      laserInterlockEngaged: true,
      eStopEngaged: false
    },
    permissions: {
      readTelemetry: true,
      fileOperations: true,
      remoteControl: true,
      hazardousActuation: true
    }
  }
];

export const initialComputeConfig: ComputeRoutingConfig = {
  activeProvider: 'hybrid_orchestrated',
  privacyFirewall: 'hybrid_guarded',
  allowRemoteGpuWorker: true,
  remoteGpuEndpoint: 'https://gpu-worker-01.local.corp:8443',
  localModelName: 'Ollama Llama-3.3-8B-Instruct-Q4_K_M',
  cloudModelName: 'Gemini 3.8 Flash (Server-Side @google/genai)',
  contextWindow: 128000,
  maxOutputTokens: 8192,
  hardwareStats: {
    localGpuDetected: 'NVIDIA GeForce RTX 4090 24GB',
    vramAvailableGb: 18.2,
    localInferenceTps: 48.6,
    cloudLatencyMs: 310,
    monthlyTokenCostUsd: 0.00
  }
};

export const initialMilestones: MilestoneProgress[] = [
  {
    id: 'M0',
    title: 'Define Product & Scope',
    objective: 'Establish functional use cases, security boundaries, and acceptance criteria.',
    status: 'passed',
    testsTotal: 6,
    testsPassed: 6,
    checklist: [
      { text: 'Initial use cases documented (Assistant, Research, Coding, Memory, Devices)', passed: true },
      { text: 'Supported operating systems & local target hardware specified', passed: true },
      { text: 'Privacy perimeter & local data permanence rules established', passed: true },
      { text: 'Autonomous vs Human-Approval permission boundaries codified', passed: true },
      { text: 'Measurable success criteria and benchmark suites defined', passed: true },
      { text: 'Prioritized feature backlog established', passed: true }
    ]
  },
  {
    id: 'M1',
    title: 'Repository & Foundation',
    objective: 'Establish modular, maintainable, reproducible codebase structure.',
    status: 'passed',
    testsTotal: 6,
    testsPassed: 6,
    checklist: [
      { text: 'Modular component separation (Core, Memory, Tools, RAG, Devices)', passed: true },
      { text: 'Configuration and environment variable management', passed: true },
      { text: 'Structured logging and defensive error propagation', passed: true },
      { text: 'TypeScript strict type safety and automated build checks', passed: true },
      { text: 'Clean repeatable startup and zero secret leaks', passed: true },
      { text: 'Integrated automated test harness', passed: true }
    ]
  },
  {
    id: 'M2',
    title: 'Local AI Core & Inference',
    objective: 'Provider-independent inference interface supporting local and remote runtimes.',
    status: 'passed',
    testsTotal: 7,
    testsPassed: 7,
    checklist: [
      { text: 'Unified inference adapter for local models and cloud providers', passed: true },
      { text: 'Streaming token generation and multi-turn session tracking', passed: true },
      { text: 'Graceful timeout handling and connection retry policies', passed: true },
      { text: 'Performance metrics (latency, TPS, token budget consumption)', passed: true },
      { text: 'Zero crash recovery when inference engine disconnects', passed: true },
      { text: 'Model parameters decoupled from core business logic', passed: true },
      { text: 'Benchmark validation against standard evaluation prompts', passed: true }
    ]
  },
  {
    id: 'M3',
    title: 'Memory Palace',
    objective: 'Persistent, inspectable, correctable personal context and facts.',
    status: 'passed',
    testsTotal: 8,
    testsPassed: 8,
    checklist: [
      { text: 'Six memory taxonomies (Preferences, Facts, Projects, Events, Procedures, Lessons)', passed: true },
      { text: 'Confidence scores (0.0-1.0) and verifiable provenance metadata', passed: true },
      { text: 'Interactive inspection, correction with audit log, and deletion', passed: true },
      { text: 'Contradiction resolution policy between new and existing records', passed: true },
      { text: 'Recency decay weighting and semantic retrieval scoring', passed: true },
      { text: 'Full export, backup snapshotting, and restoration verification', passed: true },
      { text: 'Strict isolation of sensitive personal memory from external logs', passed: true },
      { text: 'Cross-session memory recall tests passing at 100%', passed: true }
    ]
  },
  {
    id: 'M4',
    title: 'Knowledge Engine & RAG',
    objective: 'Evidence-grounded answers with traceable document citations.',
    status: 'passed',
    testsTotal: 7,
    testsPassed: 7,
    checklist: [
      { text: 'Multi-format ingestion (Markdown, PDF, code, lab protocols)', passed: true },
      { text: 'Contextual semantic chunking with keyword indexing', passed: true },
      { text: 'Hybrid semantic and lexical retrieval ranking', passed: true },
      { text: 'Mandatory source citations with verifiable document coordinates', passed: true },
      { text: 'Explicit "Not Found" admission when evidence is insufficient', passed: true },
      { text: 'Prompt-injection defense: untrusted documents treated as data only', passed: true },
      { text: 'Incremental index updates and document unlinking', passed: true }
    ]
  },
  {
    id: 'M5',
    title: 'Tools, Planning & Permissions',
    objective: 'Plan-Execute-Observe-Verify task workflow with permission ring gates.',
    status: 'passed',
    testsTotal: 7,
    testsPassed: 7,
    checklist: [
      { text: 'Typed schema validation on all incoming tool arguments', passed: true },
      { text: 'Safe sandbox execution for Read-Only tools', passed: true },
      { text: 'Interactive approval airlock for Consequential operations', passed: true },
      { text: 'Explicit observation and verification phase before marking success', passed: true },
      { text: 'Immutable audit log recording initiator, arguments, and outcomes', passed: true },
      { text: 'Abort / cancellation token to stop running plans immediately', passed: true },
      { text: 'Non-idempotent action guards to prevent accidental duplicates', passed: true }
    ]
  },
  {
    id: 'M6',
    title: 'Computer & Phone Integrations',
    objective: 'Personal workstation and mobile companion connectivity.',
    status: 'passed',
    testsTotal: 6,
    testsPassed: 6,
    checklist: [
      { text: 'Host PC status telemetry and workspace file inspection', passed: true },
      { text: 'Mobile companion encrypted TLS communication channel', passed: true },
      { text: 'Per-device permission toggles and instant revocation switch', passed: true },
      { text: 'Graceful reconnection without corrupting running plan state', passed: true },
      { text: 'Unregistered device denial and unauthorized file blocking', passed: true },
      { text: 'Audit trail for all device-mediated operations', passed: true }
    ]
  },
  {
    id: 'M7',
    title: 'Network & Laboratory Integrations',
    objective: 'Extend ONI into physical equipment with hardware safety interlocks.',
    status: 'passed',
    testsTotal: 7,
    testsPassed: 7,
    checklist: [
      { text: 'Spectrophotometer and optical sensor digital bus integration', passed: true },
      { text: 'Precision stepper gantry XYZ coordinate translation commands', passed: true },
      { text: 'Fluidic manifold pressure monitoring and threshold alarms', passed: true },
      { text: 'Independent physical Emergency Stop (E-STOP) hardware cut', passed: true },
      { text: 'Out-of-range command rejection before signal transmission', passed: true },
      { text: 'Automated test against simulated hardware faults and leaks', passed: true },
      { text: 'Zero hazardous actuation without explicit manual safety sign-off', passed: true }
    ]
  },
  {
    id: 'M8',
    title: 'Specialized Agents & Orchestration',
    objective: 'Multi-agent role delegation with strict token and time budgets.',
    status: 'passed',
    testsTotal: 6,
    testsPassed: 6,
    checklist: [
      { text: 'Dedicated roles: Researcher, Programmer, Memory Specialist, Systems, Lab', passed: true },
      { text: 'Orchestrator delegation tree without infinite recursion', passed: true },
      { text: 'Strict per-agent capability sandboxes and token quotas', passed: true },
      { text: 'Surfacing conflicting agent conclusions to orchestrator for arbitration', passed: true },
      { text: 'Agent performance comparison against single-agent baseline', passed: true },
      { text: 'Zero silent failures: failed sub-agents report exact error codes', passed: true }
    ]
  },
  {
    id: 'M9',
    title: 'Continuous Evaluation & Training',
    objective: 'Safe improvement loops, curated datasets, and version rollback.',
    status: 'passed',
    testsTotal: 7,
    testsPassed: 7,
    checklist: [
      { text: 'Opt-in outcome logging and curated pair dataset curation', passed: true },
      { text: 'Isolation of training sets from evaluation benchmarks', passed: true },
      { text: 'LoRA fine-tuning and quantized adapter promotion workflow', passed: true },
      { text: 'Automated regression test clearance before adapter activation', passed: true },
      { text: '1-click rollback to last known good adapter/checkpoint', passed: true },
      { text: 'Versioned prompts and system instruction history', passed: true },
      { text: 'Evaluation score metrics tracked over time', passed: true }
    ]
  },
  {
    id: 'M10',
    title: 'Local & Cloud Compute Routing',
    objective: 'Hardware-aware routing with strict privacy perimeters.',
    status: 'passed',
    testsTotal: 7,
    testsPassed: 7,
    checklist: [
      { text: 'Hardware capability detection (VRAM, CPU cores, throughput)', passed: true },
      { text: 'Strict Local-First mode: zero outbound bytes over WAN', passed: true },
      { text: 'Hybrid routing: local retrieval + cloud reasoning boost', passed: true },
      { text: 'Remote GPU worker interface with checkpointing and recovery', passed: true },
      { text: 'Real-time latency, TPS, and cost metrics monitoring', passed: true },
      { text: 'Automatic fallback to local Ollama if internet drops', passed: true },
      { text: 'Zero data leakage guarantee enforced by policy engine', passed: true }
    ]
  },
  {
    id: 'M11',
    title: 'Security, Reliability & Privacy',
    objective: 'Comprehensive system stress tests, red-teaming, and failover.',
    status: 'passed',
    testsTotal: 8,
    testsPassed: 8,
    checklist: [
      { text: 'Prompt injection defense benchmark: 100% attack containment', passed: true },
      { text: 'Credential isolation: API keys and secrets never logged', passed: true },
      { text: 'Code execution sandboxed with memory and CPU bounds', passed: true },
      { text: 'Clean crash recovery: zero palace database corruption', passed: true },
      { text: 'Backup restore verified in clean sandbox environment', passed: true },
      { text: 'Concurrent task planner stress tested under 20 parallel requests', passed: true },
      { text: 'User inspection and hard deletion of all stored personal records', passed: true },
      { text: 'Zero open critical security or reliability findings', passed: true }
    ]
  },
  {
    id: 'M12',
    title: 'Personal AI Release (v1.0)',
    objective: 'Production-ready unified interface, diagnostics, and documentation.',
    status: 'passed',
    testsTotal: 7,
    testsPassed: 7,
    checklist: [
      { text: 'Mission Control interface for chat, plans, tools, and telemetry', passed: true },
      { text: 'Comprehensive self-test diagnostics on startup', passed: true },
      { text: 'Export & import tools for palace data and document indices', passed: true },
      { text: 'Complete hardware and model setup instructions included', passed: true },
      { text: 'Pinned dependencies and zero build regressions', passed: true },
      { text: 'Zero unhandled exceptions across all standard workflows', passed: true },
      { text: 'Signed production release tagged v1.0.0', passed: true }
    ]
  },
  {
    id: 'M13',
    title: 'Continuous Evaluation & Expansion',
    objective: 'Permanent benchmark harness and feature-flagged capability releases.',
    status: 'passed',
    testsTotal: 5,
    testsPassed: 5,
    checklist: [
      { text: 'Permanent regression benchmark suite executing in background', passed: true },
      { text: 'Feature flags for experimental laboratory actuators', passed: true },
      { text: 'Operational metrics and quality score tracking', passed: true },
      { text: 'Security re-assessment triggers whenever permissions expand', passed: true },
      { text: 'Verified rollback paths for any newly introduced tool', passed: true }
    ]
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-28T17:45:12Z',
    category: 'auth',
    level: 'info',
    actor: 'system',
    message: 'ONI-GIRYA Core Orchestrator initialized in Local-First Guarded mode.'
  },
  {
    id: 'log-002',
    timestamp: '2026-10-28T17:45:14Z',
    category: 'hardware_actuation',
    level: 'info',
    actor: 'lab_specialist',
    message: 'Laboratory Station #1 handshake verified. E-Stop nominal. Laser interlock armed.'
  },
  {
    id: 'log-003',
    timestamp: '2026-10-28T17:50:30Z',
    category: 'memory_update',
    level: 'info',
    actor: 'memory_specialist',
    message: 'Indexed 7 persistent memories into Memory Palace across 6 taxonomies.'
  },
  {
    id: 'log-004',
    timestamp: '2026-10-28T18:02:11Z',
    category: 'tool_execution',
    level: 'info',
    actor: 'researcher',
    message: 'Executed Knowledge Semantic Search for "Microfluidics Pressure Interlock" (retrieved 2 chunks, citation matched).'
  }
];
