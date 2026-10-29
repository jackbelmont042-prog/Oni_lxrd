import React, { useState } from 'react';
import { 
  Cpu, 
  Shield, 
  Server, 
  Zap, 
  Globe, 
  Lock, 
  CheckCircle2, 
  Sliders,
  DollarSign,
  Activity
} from 'lucide-react';
import { ComputeRoutingConfig } from '../types';
import { api } from '../services/api';

interface ComputeSwitchboardProps {
  config: ComputeRoutingConfig;
  onRefresh: () => void;
}

export const ComputeSwitchboardView: React.FC<ComputeSwitchboardProps> = ({ config, onRefresh }) => {
  const [activeProvider, setActiveProvider] = useState(config.activeProvider);
  const [privacyFirewall, setPrivacyFirewall] = useState(config.privacyFirewall);
  const [allowRemoteGpu, setAllowRemoteGpu] = useState(config.allowRemoteGpuWorker);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = async (newProvider?: any, newFirewall?: any) => {
    setIsUpdating(true);
    setFeedback(null);
    try {
      await api.updateComputeConfig({
        activeProvider: newProvider || activeProvider,
        privacyFirewall: newFirewall || privacyFirewall,
        allowRemoteGpuWorker: allowRemoteGpu
      });
      setFeedback('Compute switchboard routing and privacy firewall policies updated.');
      onRefresh();
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pr-1">
      {/* Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-semibold text-neutral-100">Compute Switchboard & Privacy Perimeter</h2>
          <span className="text-xs text-neutral-500">·</span>
          <span className="text-xs font-mono text-cyan-400 capitalize">
            {privacyFirewall.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-xs text-neutral-400">
          Hardware-aware compute routing. Prioritizes local CPU and RTX 4090 GPU execution while enforcing cryptographic isolation policies on WAN data transmission.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-neutral-900 border border-cyan-800 text-cyan-200 text-xs rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Hardware Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] font-mono uppercase mb-1">
            <span>Local Accelerator</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm font-semibold text-neutral-100 truncate">
            RTX 4090 24GB
          </div>
          <span className="text-[11px] font-mono text-emerald-400 tabular-nums">
            {config.hardwareStats.vramAvailableGb} GB VRAM Available
          </span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] font-mono uppercase mb-1">
            <span>Inference Speed</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-bold font-mono text-neutral-100 tabular-nums">
            {config.hardwareStats.localInferenceTps} <span className="text-xs font-normal text-neutral-400">TPS</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Q4_K_M Quantized Stream
          </span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] font-mono uppercase mb-1">
            <span>Cloud Round-Trip</span>
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-base font-bold font-mono text-neutral-100 tabular-nums">
            {config.hardwareStats.cloudLatencyMs} <span className="text-xs font-normal text-neutral-400">ms</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Server-side @google/genai
          </span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] font-mono uppercase mb-1">
            <span>Current Compute Cost</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
            ${config.hardwareStats.monthlyTokenCostUsd.toFixed(2)}
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Local-First Free Tier
          </span>
        </div>
      </div>

      {/* Main Switchboard Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Provider Switcher */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Active Inference Provider</span>
          </h3>

          <div className="space-y-3">
            {[
              {
                id: 'hybrid_orchestrated',
                title: 'Hybrid Orchestrated (Recommended)',
                desc: 'Local Memory Palace & RAG index with server-side Gemini Flash reasoning boost.',
                badge: 'Lowest Latency & Highest Recall'
              },
              {
                id: 'local_ollama',
                title: 'Strict Local Ollama / Llama.cpp',
                desc: 'Runs completely on local RTX 4090 hardware. Operates 100% offline without internet connection.',
                badge: '100% Air-Gapped'
              },
              {
                id: 'gemini_cloud',
                title: 'Gemini 3.8 Flash Cloud Direct',
                desc: 'Direct server-side Google GenAI reasoning with large 128k context window.',
                badge: 'Full Multimodal'
              },
              {
                id: 'remote_gpu',
                title: 'Remote Dedicated GPU Worker',
                desc: 'Routes large batch jobs and LoRA fine-tuning workloads to local network GPU cluster.',
                badge: 'High Throughput'
              }
            ].map(p => (
              <div
                key={p.id}
                onClick={() => {
                  setActiveProvider(p.id as any);
                  handleSave(p.id, undefined);
                }}
                className={`p-4 rounded-md border cursor-pointer transition-colors ${
                  activeProvider === p.id
                    ? 'bg-neutral-950 border-cyan-500/80 shadow-sm'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-neutral-200">{p.title}</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                    {p.badge}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Firewall Policy */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Privacy Perimeter & Data Handling</span>
          </h3>

          <div className="space-y-3 mb-5">
            {[
              {
                id: 'strict_local_only',
                title: 'Strict Local Only',
                desc: 'WAN data transmission strictly blocked. No memories, documents, or prompts may leave the machine perimeter under any circumstance.'
              },
              {
                id: 'hybrid_guarded',
                title: 'Hybrid Guarded (Default)',
                desc: 'Personal memories and confidential file contents remain on host. Only sanitized task prompts and public context are dispatched to cloud reasoning.'
              },
              {
                id: 'cloud_permissive',
                title: 'Cloud Permissive',
                desc: 'Allows full context transmission for complex multimodal processing and deep synthesis.'
              }
            ].map(fw => (
              <div
                key={fw.id}
                onClick={() => {
                  setPrivacyFirewall(fw.id as any);
                  handleSave(undefined, fw.id);
                }}
                className={`p-4 rounded-md border cursor-pointer transition-colors ${
                  privacyFirewall === fw.id
                    ? 'bg-neutral-950 border-emerald-500/80 shadow-sm'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-neutral-200">{fw.title}</span>
                  {privacyFirewall === fw.id && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {fw.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-neutral-950 p-3.5 rounded border border-neutral-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-neutral-300">Allow Remote GPU Worker</span>
              <input
                type="checkbox"
                checked={allowRemoteGpu}
                onChange={(e) => {
                  setAllowRemoteGpu(e.target.checked);
                  handleSave();
                }}
                className="w-4 h-4 accent-cyan-500"
              />
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">
              Worker URL: {config.remoteGpuEndpoint}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
