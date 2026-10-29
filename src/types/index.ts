/**
 * ONI-GIRYA System Types
 */

export type MemoryCategory = 
  | 'preferences'
  | 'facts'
  | 'projects'
  | 'events'
  | 'procedures'
  | 'lessons';

export interface MemoryEntry {
  id: string;
  category: MemoryCategory;
  title: string;
  content: string;
  confidence: number; // 0.0 - 1.0
  provenance: string; // e.g. "User explicit instruction", "Observed workflow #42", "Lab calibration run"
  createdAt: string;
  updatedAt: string;
  tags: string[];
  accessCount: number;
  lastRetrievedAt?: string;
  isConfirmed: boolean;
  history?: Array<{
    timestamp: string;
    previousContent: string;
    reason: string;
  }>;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  sourceType: 'pdf' | 'markdown' | 'code' | 'technical_note' | 'lab_protocol';
  filename: string;
  uploadedAt: string;
  sizeBytes: number;
  chunkCount: number;
  chunks: KnowledgeChunk[];
  summary: string;
  tags: string[];
}

export interface KnowledgeChunk {
  id: string;
  docId: string;
  docTitle: string;
  chunkIndex: number;
  content: string;
  location: string; // e.g., "Section 3.2, p. 14" or "Line 142-185"
  tokenCount: number;
  keywords: string[];
}

export type AgentRole = 
  | 'orchestrator'
  | 'researcher'
  | 'programmer'
  | 'memory_specialist'
  | 'systems_operator'
  | 'lab_specialist';

export interface AgentProfile {
  id: AgentRole;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  tokenBudget: number;
  tokensUsed: number;
  status: 'idle' | 'active' | 'evaluating';
  permissionScope: string[];
  assignedTasksCount: number;
}

export type PermissionLevel = 'read_only' | 'consequential' | 'destructive_or_physical';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  permissionLevel: PermissionLevel;
  category: 'system' | 'research' | 'code' | 'hardware' | 'network';
  schema: Record<string, string>;
  isAutomated: boolean; // can run without confirmation if allowed
}

export interface ToolExecutionRecord {
  id: string;
  toolId: string;
  toolName: string;
  arguments: Record<string, any>;
  result?: any;
  error?: string;
  status: 'pending_approval' | 'executed' | 'rejected' | 'failed';
  permissionLevel: PermissionLevel;
  initiatedBy: AgentRole;
  timestamp: string;
  durationMs?: number;
}

export interface PlanStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  assignedAgent: AgentRole;
  requiredTool?: string;
  permissionLevel: PermissionLevel;
  status: 'pending' | 'in_progress' | 'observing' | 'verifying' | 'completed' | 'failed' | 'rejected';
  toolCallRecord?: ToolExecutionRecord;
  observation?: string;
  verificationVerdict?: string;
}

export interface TaskPlan {
  id: string;
  userPrompt: string;
  goal: string;
  status: 'planning' | 'awaiting_approval' | 'executing' | 'verifying' | 'completed' | 'failed' | 'aborted';
  steps: PlanStep[];
  currentStepIndex: number;
  createdAt: string;
  completedAt?: string;
  retrievedMemories: string[];
  retrievedCitations: Array<{
    docTitle: string;
    location: string;
    snippet: string;
    score: number;
  }>;
  executionSummary?: string;
}

export interface DeviceTelemetry {
  id: string;
  name: string;
  type: 'workstation' | 'mobile_companion' | 'lab_station' | 'network_gateway';
  status: 'online' | 'standby' | 'restricted' | 'offline';
  ipAddress: string;
  lastPing: string;
  metrics: {
    cpuPercent?: number;
    ramPercent?: number;
    gpuVramUsedMb?: number;
    diskPercent?: number;
    batteryPercent?: number;
    spectrometerWavelengthNm?: number;
    spectrometerIntensity?: number;
    stepperPositionMm?: { x: number; y: number; z: number };
    chamberPressurePsi?: number;
    chamberTempC?: number;
    laserInterlockEngaged?: boolean;
    eStopEngaged?: boolean;
  };
  permissions: {
    readTelemetry: boolean;
    fileOperations: boolean;
    remoteControl: boolean;
    hazardousActuation: boolean;
  };
}

export interface ComputeRoutingConfig {
  activeProvider: 'local_ollama' | 'remote_gpu' | 'gemini_cloud' | 'hybrid_orchestrated';
  privacyFirewall: 'strict_local_only' | 'hybrid_guarded' | 'cloud_permissive';
  allowRemoteGpuWorker: boolean;
  remoteGpuEndpoint?: string;
  localModelName: string;
  cloudModelName: string;
  contextWindow: number;
  maxOutputTokens: number;
  hardwareStats: {
    localGpuDetected: string;
    vramAvailableGb: number;
    localInferenceTps: number;
    cloudLatencyMs: number;
    monthlyTokenCostUsd: number;
  };
}

export interface MilestoneProgress {
  id: string; // M0 to M13
  title: string;
  objective: string;
  status: 'passed' | 'in_progress' | 'pending';
  testsTotal: number;
  testsPassed: number;
  checklist: Array<{
    text: string;
    passed: boolean;
  }>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'auth' | 'tool_execution' | 'memory_update' | 'hardware_actuation' | 'policy_denial' | 'prompt_inspection';
  level: 'info' | 'warning' | 'critical';
  actor: AgentRole | 'user' | 'system';
  message: string;
  details?: Record<string, any>;
}
