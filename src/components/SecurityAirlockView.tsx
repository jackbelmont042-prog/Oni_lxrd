import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  AlertOctagon, 
  CheckCircle2, 
  Terminal, 
  Flame, 
  RefreshCw,
  Search
} from 'lucide-react';
import { ToolDefinition, AuditLogEntry } from '../types';
import { api } from '../services/api';

interface SecurityAirlockProps {
  tools: ToolDefinition[];
  onRefresh: () => void;
}

export const SecurityAirlockView: React.FC<SecurityAirlockProps> = ({ tools, onRefresh }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [testToolId, setTestToolId] = useState<string>('tool_calc');
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isExecutingTest, setIsExecutingTest] = useState(false);

  const loadLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      setLogs(res.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleTestExecute = async () => {
    setIsExecutingTest(true);
    setTestResult(null);
    try {
      const tool = tools.find(t => t.id === testToolId);
      const sampleArgs = testToolId === 'tool_calc' 
        ? { expression: '2 * 3.14159 * 50' }
        : testToolId === 'tool_spectrometer_scan'
        ? { startWavelengthNm: 546.1, endWavelengthNm: 550.0 }
        : testToolId === 'tool_gantry_actuate'
        ? { targetX: 10, targetY: 20, targetZ: 5, speedMmS: 12 }
        : {};

      const res = await api.executeTool(testToolId, sampleArgs, false, 'orchestrator');
      setTestResult(res);
      loadLogs();
      onRefresh();
    } catch (err: any) {
      setTestResult({ error: err.message });
    } finally {
      setIsExecutingTest(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    if (selectedFilter === 'all') return true;
    return l.category === selectedFilter;
  });

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pr-1">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-semibold text-neutral-100">Security Governance & Permission Rings</h2>
          <span className="text-xs text-neutral-500">·</span>
          <span className="text-xs font-mono text-emerald-400">Least-Privilege Active</span>
        </div>
        <p className="text-xs text-neutral-400">
          Enforces immutable authorization boundaries across three rings. Code and tool execution are strictly isolated, and untrusted document contents are treated as pure data payloads without execution permissions.
        </p>
      </div>

      {/* Permission Rings Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ring 0 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-cyan-400 font-bold">Ring 0: Read-Only</span>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
              Autonomous
            </span>
          </div>
          <p className="text-xs text-neutral-300 mb-3">
            Mathematical calculations, sandboxed file inspections, knowledge semantic searches, and telemetry scans.
          </p>
          <div className="text-[11px] font-mono text-neutral-500">
            Tools: <span className="text-neutral-400">tool_calc, tool_rag_search, tool_fs_read, tool_spectrometer_scan</span>
          </div>
        </div>

        {/* Ring 1 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-amber-400 font-bold">Ring 1: Consequential</span>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
              Guarded / Logged
            </span>
          </div>
          <p className="text-xs text-neutral-300 mb-3">
            File writes, memory updates, external HTTP requests, and git commits. Audited with reversible rollback points.
          </p>
          <div className="text-[11px] font-mono text-neutral-500">
            Tools: <span className="text-neutral-400">tool_memory_write, tool_fs_write</span>
          </div>
        </div>

        {/* Ring 2 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-red-400 font-bold">Ring 2: Destructive & Physical</span>
            <span className="text-[10px] font-mono text-red-300 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60 font-semibold">
              Human Sign-off Gated
            </span>
          </div>
          <p className="text-xs text-neutral-300 mb-3">
            Hardware stepper gantry translations, laser excitation, chemical fluidics, and permanent data destruction.
          </p>
          <div className="text-[11px] font-mono text-neutral-500">
            Tools: <span className="text-neutral-400">tool_gantry_actuate, tool_estop_trigger</span>
          </div>
        </div>
      </div>

      {/* Interactive Tool Permission Tester */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
          Interactive Tool Authorization Tester
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
          <select
            value={testToolId}
            onChange={(e) => setTestToolId(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {tools.map(t => (
              <option key={t.id} value={t.id}>
                [{t.permissionLevel}] {t.name} ({t.id})
              </option>
            ))}
          </select>

          <button
            onClick={handleTestExecute}
            disabled={isExecutingTest}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold rounded transition-colors shrink-0"
          >
            {isExecutingTest ? 'Testing...' : 'Test Execution Airlock'}
          </button>
        </div>

        {testResult && (
          <div className="bg-neutral-950 p-3 rounded border border-neutral-800 font-mono text-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span>Status: {testResult.status || 'Response'}</span>
              <span>Ring: {testResult.record?.permissionLevel || 'Enforced'}</span>
            </div>
            <pre className="text-neutral-300 overflow-x-auto text-[11px]">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Live Security Audit Log Stream */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Immutable Security & Audit Trail
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-400 font-mono"
            >
              <option value="all">All Categories</option>
              <option value="auth">Auth & Session</option>
              <option value="tool_execution">Tool Execution</option>
              <option value="memory_update">Memory Updates</option>
              <option value="hardware_actuation">Hardware Actuation</option>
              <option value="policy_denial">Policy Denials</option>
            </select>

            <button
              onClick={loadLogs}
              className="p-1 hover:text-neutral-200 text-neutral-500"
              title="Refresh Logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredLogs.map(log => (
            <div 
              key={log.id} 
              className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80 text-xs font-mono flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    log.level === 'critical' 
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : log.level === 'warning'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="text-cyan-400 text-[11px]">{log.category}</span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-neutral-400 text-[11px]">Actor: {log.actor}</span>
                </div>
                <p className="text-neutral-300 font-sans text-xs">
                  {log.message}
                </p>
              </div>

              <span className="text-[10px] text-neutral-500 shrink-0 tabular-nums">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
