import { 
  MemoryEntry, 
  KnowledgeDocument, 
  AgentProfile, 
  ToolDefinition, 
  DeviceTelemetry, 
  ComputeRoutingConfig, 
  MilestoneProgress, 
  AuditLogEntry, 
  TaskPlan 
} from '../types';

export const api = {
  async getSystemStatus() {
    const res = await fetch('/api/system/status');
    return res.json();
  },

  async getMemories(params?: { category?: string; search?: string; minConfidence?: number; sort?: string }): Promise<{ memories: MemoryEntry[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.minConfidence) query.set('minConfidence', String(params.minConfidence));
    if (params?.sort) query.set('sort', params.sort);
    const res = await fetch(`/api/memory?${query.toString()}`);
    return res.json();
  },

  async createMemory(data: Partial<MemoryEntry>): Promise<MemoryEntry> {
    const res = await fetch('/api/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateMemory(id: string, data: Partial<MemoryEntry> & { reason?: string }): Promise<MemoryEntry> {
    const res = await fetch(`/api/memory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteMemory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/memory/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async exportMemories(): Promise<any> {
    const res = await fetch('/api/memory/export', { method: 'POST' });
    return res.json();
  },

  async importMemories(importedMemories: any[]): Promise<any> {
    const res = await fetch('/api/memory/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ importedMemories })
    });
    return res.json();
  },

  async getDocuments(): Promise<{ documents: KnowledgeDocument[] }> {
    const res = await fetch('/api/knowledge/documents');
    return res.json();
  },

  async ingestDocument(data: { title: string; content: string; sourceType?: string; filename?: string; tags?: string[] }): Promise<KnowledgeDocument> {
    const res = await fetch('/api/knowledge/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/knowledge/documents/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async searchKnowledge(query: string, limit = 4): Promise<any> {
    const res = await fetch('/api/knowledge/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit })
    });
    return res.json();
  },

  async getAgents(): Promise<{ agents: AgentProfile[] }> {
    const res = await fetch('/api/agents');
    return res.json();
  },

  async getTools(): Promise<{ tools: ToolDefinition[] }> {
    const res = await fetch('/api/tools');
    return res.json();
  },

  async executeTool(toolId: string, args: any, userConfirmed = false, initiatedBy = 'orchestrator'): Promise<any> {
    const res = await fetch('/api/tools/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId, args, userConfirmed, initiatedBy })
    });
    return res.json();
  },

  async getDevices(): Promise<{ devices: DeviceTelemetry[] }> {
    const res = await fetch('/api/devices');
    return res.json();
  },

  async toggleEStop(): Promise<any> {
    const res = await fetch('/api/devices/estop/toggle', { method: 'POST' });
    return res.json();
  },

  async actuateDevice(deviceId: string, command: string, params: any): Promise<any> {
    const res = await fetch('/api/devices/actuate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, command, params })
    });
    return res.json();
  },

  async getComputeConfig(): Promise<{ computeConfig: ComputeRoutingConfig }> {
    const res = await fetch('/api/compute');
    return res.json();
  },

  async updateComputeConfig(config: Partial<ComputeRoutingConfig>): Promise<any> {
    const res = await fetch('/api/compute', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return res.json();
  },

  async getMilestones(): Promise<{ milestones: MilestoneProgress[] }> {
    const res = await fetch('/api/milestones');
    return res.json();
  },

  async runMilestoneTests(milestoneId?: string): Promise<any> {
    const res = await fetch('/api/milestones/run-tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestoneId })
    });
    return res.json();
  },

  async getAuditLogs(): Promise<{ logs: AuditLogEntry[] }> {
    const res = await fetch('/api/audit-logs');
    return res.json();
  },

  async runOrchestrator(prompt: string, selectedAgent = 'orchestrator'): Promise<{ plan: TaskPlan; memoriesUsed: any[]; citationsUsed: any[]; summary: string }> {
    const res = await fetch('/api/orchestrator/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, selectedAgent })
    });
    return res.json();
  }
};
