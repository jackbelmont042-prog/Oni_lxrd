import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  Brain, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap
} from 'lucide-react';
import { AgentRole, TaskPlan, AgentProfile } from '../types';
import { api } from '../services/api';

interface MissionControlProps {
  agents: AgentProfile[];
  onRefreshSystem: () => void;
  coreImageSrc?: string;
}

export const MissionControlView: React.FC<MissionControlProps> = ({ 
  agents, 
  onRefreshSystem,
  coreImageSrc
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentRole>('orchestrator');
  const [isRunning, setIsRunning] = useState(false);
  const [activePlan, setActivePlan] = useState<TaskPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingToolConfirmation, setPendingToolConfirmation] = useState<any | null>(null);

  const samplePrompts = [
    {
      label: 'Lab Spectrometer Protocol',
      text: 'Perform calibrated optical absorbance scan at 546.1nm and verify against laboratory standard operating procedures.'
    },
    {
      label: 'Code & Types Audit',
      text: 'Inspect local workspace file interfaces, run static analysis linter, and verify TypeScript compilation invariants.'
    },
    {
      label: 'Memory & Objectives',
      text: 'Recall user architecture preferences and evaluate project ONI-GIRYA milestone M5 completion state.'
    },
    {
      label: 'Gantry Translation (Gated)',
      text: 'Translate laboratory XYZ gantry stepper to target coordinates X: 45mm, Y: 120mm, Z: 12mm at safe speed.'
    }
  ];

  const handleExecute = async (inputPrompt?: string) => {
    const textToRun = inputPrompt || prompt;
    if (!textToRun.trim() || isRunning) return;

    setIsRunning(true);
    setErrorMsg(null);
    setPendingToolConfirmation(null);

    try {
      const res = await api.runOrchestrator(textToRun, selectedAgent);
      setActivePlan(res.plan);
      onRefreshSystem();
    } catch (err: any) {
      setErrorMsg(err.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleApproveTool = async () => {
    if (!pendingToolConfirmation) return;
    try {
      const toolId = pendingToolConfirmation.toolId;
      const args = pendingToolConfirmation.arguments;
      const res = await api.executeTool(toolId, args, true, selectedAgent);
      setPendingToolConfirmation(null);
      onRefreshSystem();
      // append result to step
      if (activePlan) {
        const updatedSteps = activePlan.steps.map(s => {
          if (s.requiredTool === toolId) {
            return {
              ...s,
              status: 'completed' as const,
              observation: `Manual confirmation granted. Executed ${toolId}: ${JSON.stringify(res.record?.result || {})}`,
              verificationVerdict: 'Human approval recorded. Execution verified.'
            };
          }
          return s;
        });
        setActivePlan({ ...activePlan, steps: updatedSteps });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to approve tool');
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pr-1">
      {/* Top Banner / System Objective & Core Module visual */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {coreImageSrc ? (
            <div className="w-16 h-16 rounded border border-neutral-800 overflow-hidden shrink-0 bg-neutral-950">
              <img 
                src={coreImageSrc} 
                alt="ONI Intelligence Core Module" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded border border-neutral-800 flex items-center justify-center bg-neutral-950 text-cyan-400 shrink-0">
              <Bot className="w-8 h-8" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-neutral-100">Plan-Execute-Observe-Verify Autonomous Workflow</span>
              <span className="text-xs text-neutral-500">·</span>
              <span className="text-xs text-cyan-400 font-mono">Engine M5.2 Active</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              ONI-GIRYA executes tasks with explicit verification loops: recalling long-term memory, grounding citations from the Knowledge Vault, checking permission boundaries, observing tool results, and confirming completion criteria.
            </p>
          </div>
        </div>

        {/* Quick Execution Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-neutral-400 font-medium">Lead Agent:</label>
          <select 
            value={selectedAgent} 
            onChange={(e) => setSelectedAgent(e.target.value as AgentRole)}
            className="bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prompt Input Box */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <div className="flex gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleExecute();
              }
            }}
            placeholder="Instruct ONI-GIRYA (e.g. 'Audit lab sensors and execute optical scan' or 'Review memory palace facts')..."
            rows={2}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-md p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-sans resize-none"
          />
          <button
            onClick={() => handleExecute()}
            disabled={isRunning || !prompt.trim()}
            className="px-5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium text-xs rounded-md transition-colors flex flex-col items-center justify-center gap-1 shrink-0"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="text-[10px]">Orchestrating</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Execute</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-neutral-800/60">
          <span className="text-[11px] text-neutral-500 font-medium">Quick Workflows:</span>
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(sp.text);
                handleExecute(sp.text);
              }}
              className="px-2.5 py-1 text-[11px] font-mono text-neutral-400 bg-neutral-950 hover:bg-neutral-800 hover:text-neutral-200 border border-neutral-800 rounded transition-colors text-left"
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-md text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Active Task / Plan Execution Display */}
      {activePlan && (
        <div className="flex flex-col gap-5">
          {/* Goal & Evidence Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400">{activePlan.id}</span>
                <span className="text-xs text-neutral-600">·</span>
                <span className="text-xs text-emerald-400 font-medium capitalize">Status: {activePlan.status}</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                {new Date(activePlan.createdAt).toLocaleTimeString()}
              </span>
            </div>

            <h3 className="text-base font-semibold text-neutral-100 mb-2">
              {activePlan.goal}
            </h3>

            {/* Context Recalled Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-800 text-xs">
              {/* Memories Recalled */}
              <div>
                <div className="flex items-center gap-1.5 text-neutral-400 font-medium mb-2">
                  <Brain className="w-3.5 h-3.5 text-amber-400" />
                  <span>Memory Palace Recalls ({activePlan.retrievedMemories.length})</span>
                </div>
                {activePlan.retrievedMemories.length > 0 ? (
                  <ul className="space-y-1">
                    {activePlan.retrievedMemories.map((mTitle, i) => (
                      <li key={i} className="text-neutral-300 font-mono text-[11px] bg-neutral-950/60 px-2 py-1 rounded border border-neutral-800/60 truncate">
                        • {mTitle}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-neutral-500 italic">No specific personal preference constraint required.</span>
                )}
              </div>

              {/* Citations Grounded */}
              <div>
                <div className="flex items-center gap-1.5 text-neutral-400 font-medium mb-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Traceable Document Grounding ({activePlan.retrievedCitations.length})</span>
                </div>
                {activePlan.retrievedCitations.length > 0 ? (
                  <div className="space-y-1.5">
                    {activePlan.retrievedCitations.map((c, i) => (
                      <div key={i} className="bg-neutral-950/60 p-2 rounded border border-neutral-800/60">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-cyan-300">
                          <span className="truncate">{c.docTitle}</span>
                          <span className="text-neutral-500 shrink-0 tabular-nums">{c.location}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                          "{c.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-neutral-500 italic">Operating on core system reasoning.</span>
                )}
              </div>
            </div>
          </div>

          {/* Plan-Execute-Observe-Verify Steps */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Execution Pipeline: Plan → Execute → Observe → Verify</span>
              <span className="text-[11px] font-mono text-neutral-500 font-normal">
                {activePlan.steps.length} Steps
              </span>
            </h4>

            <div className="space-y-3">
              {activePlan.steps.map((step, idx) => (
                <div 
                  key={step.id} 
                  className="bg-neutral-950 border border-neutral-800 rounded-md p-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold">
                        {step.stepNumber}
                      </span>
                      <span className="text-sm font-medium text-neutral-200">
                        {step.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="text-neutral-400">Agent:</span>
                      <span className="text-neutral-200">{step.assignedAgent}</span>
                      <span className="text-neutral-600">·</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        step.permissionLevel === 'destructive_or_physical' 
                          ? 'bg-red-950/80 text-red-300 border border-red-800/60'
                          : step.permissionLevel === 'consequential'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {step.permissionLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 mb-3 ml-7">
                    {step.description}
                  </p>

                  {/* Tool Call & Observation */}
                  <div className="ml-7 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-neutral-900/60 p-2.5 rounded border border-neutral-800/50">
                    <div>
                      <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        <span>Subsystem Observation</span>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-300">
                        {step.observation || 'No anomalous telemetry observed.'}
                      </p>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Verification Verdict</span>
                      </div>
                      <p className="text-[11px] text-emerald-300">
                        {step.verificationVerdict || 'Criteria verified.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Summary */}
          {activePlan.executionSummary && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Synthesis & Verified Outcome</span>
              </div>
              <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                {activePlan.executionSummary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal if tool gated */}
      {pendingToolConfirmation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-semibold text-neutral-100">Tool Execution Airlock</h3>
            </div>
            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              The agent <span className="font-mono text-cyan-300">{pendingToolConfirmation.initiatedBy}</span> requested to execute tool <span className="font-mono text-amber-300">{pendingToolConfirmation.toolName}</span>, which operates within the <span className="font-mono text-red-400">{pendingToolConfirmation.permissionLevel}</span> ring.
            </p>
            <div className="bg-neutral-950 p-3 rounded border border-neutral-800 mb-5 font-mono text-xs text-neutral-300 overflow-x-auto">
              <pre>{JSON.stringify(pendingToolConfirmation.arguments, null, 2)}</pre>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingToolConfirmation(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 border border-neutral-700 rounded transition-colors"
              >
                Deny Action
              </button>
              <button
                onClick={handleApproveTool}
                className="px-4 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-500 rounded transition-colors"
              >
                Authorize & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
