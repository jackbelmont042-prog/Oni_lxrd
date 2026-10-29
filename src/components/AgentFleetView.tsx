import React from 'react';
import { 
  Users, 
  Bot, 
  Search, 
  Code, 
  Brain, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  Activity,
  Layers
} from 'lucide-react';
import { AgentProfile, AgentRole } from '../types';

interface AgentFleetViewProps {
  agents: AgentProfile[];
}

export const AgentFleetView: React.FC<AgentFleetViewProps> = ({ agents }) => {
  const getRoleIcon = (roleId: AgentRole) => {
    switch (roleId) {
      case 'orchestrator':
        return <Bot className="w-5 h-5 text-cyan-400" />;
      case 'researcher':
        return <Search className="w-5 h-5 text-indigo-400" />;
      case 'programmer':
        return <Code className="w-5 h-5 text-emerald-400" />;
      case 'memory_specialist':
        return <Brain className="w-5 h-5 text-amber-400" />;
      case 'systems_operator':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'lab_specialist':
        return <Radio className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pr-1">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-semibold text-neutral-100">Specialized Agent Fleet & Orchestration</h2>
          <span className="text-xs text-neutral-500">·</span>
          <span className="text-xs font-mono text-cyan-400 tabular-nums">{agents.length} Dedicated Roles</span>
        </div>
        <p className="text-xs text-neutral-400">
          Domain-specialized agents execute tasks under central orchestrator delegation. Enforces strict token and time budgets, isolated tool permissions, and anti-recursion limits.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => {
          const budgetPercent = Math.min(100, Math.round((agent.tokensUsed / agent.tokenBudget) * 100));
          return (
            <div 
              key={agent.id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-neutral-950 border border-neutral-800 shrink-0">
                      {getRoleIcon(agent.id)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-100 leading-tight">
                        {agent.name}
                      </h3>
                      <span className="text-xs text-neutral-400 font-mono">
                        {agent.role}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded uppercase">
                    {agent.status}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-4">
                  {agent.description}
                </p>

                {/* Capabilities list */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                    Core Capabilities
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((cap, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-mono bg-neutral-950 text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Token Budget & Telemetry Footer */}
              <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>Token Budget ({budgetPercent}%)</span>
                  <span className="tabular-nums text-neutral-200">
                    {agent.tokensUsed.toLocaleString()} / {agent.tokenBudget.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                  <div 
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1">
                  <span>Tasks: {agent.assignedTasksCount} completed</span>
                  <span className="truncate max-w-[140px] text-neutral-400">
                    Scope: {agent.permissionScope.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
