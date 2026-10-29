import React from 'react';
import { 
  Bot, 
  Brain, 
  BookOpen, 
  Users, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Flame,
  Radio,
  SlidersHorizontal,
  FileText
} from 'lucide-react';

export type ActiveTab = 
  | 'mission_control'
  | 'memory_palace'
  | 'knowledge_vault'
  | 'agent_fleet'
  | 'hardware_lab'
  | 'compute_switchboard'
  | 'security_airlock'
  | 'milestones_eval';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  eStopEngaged: boolean;
  onToggleEStop: () => void;
  pendingApprovalsCount: number;
  privacyMode: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  eStopEngaged,
  onToggleEStop,
  pendingApprovalsCount,
  privacyMode
}) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }> = [
    { id: 'mission_control', label: 'Mission Control', icon: <Bot className="w-4 h-4" /> },
    { id: 'memory_palace', label: 'Memory Palace', icon: <Brain className="w-4 h-4" /> },
    { id: 'knowledge_vault', label: 'Knowledge Vault', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'agent_fleet', label: 'Specialized Agents', icon: <Users className="w-4 h-4" /> },
    { id: 'hardware_lab', label: 'Hardware & Lab Station', icon: <Radio className="w-4 h-4" /> },
    { id: 'compute_switchboard', label: 'Compute Switchboard', icon: <Cpu className="w-4 h-4" /> },
    { 
      id: 'security_airlock', 
      label: 'Security & Airlock', 
      icon: <ShieldCheck className="w-4 h-4" />, 
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined 
    },
    { id: 'milestones_eval', label: 'Milestones & Evaluation', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Bar following 3-Zone Contract */}
      <header className="h-14 border-b border-neutral-800 bg-neutral-950 px-6 flex items-center justify-between gap-8 shrink-0 z-30">
        {/* Zone 1: Single element Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400 font-bold text-sm tracking-wider">
            ONI
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-100 whitespace-nowrap shrink-0">
            ONI-GIRYA
          </span>
        </div>

        {/* Zone 2: Navigation Links / Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400">
          <span className="text-neutral-500">Node</span>
          <span className="text-neutral-200 font-mono">Titan-Core (Local 127.0.0.1)</span>
          <span aria-hidden="true" className="text-neutral-700">/</span>
          <span className="text-neutral-500">Firewall</span>
          <span className="text-neutral-200 capitalize font-mono">{privacyMode.replace('_', ' ')}</span>
          <span aria-hidden="true" className="text-neutral-700">/</span>
          <span className="text-neutral-500">Safety Bus</span>
          <span className={`font-mono ${eStopEngaged ? 'text-red-400 font-semibold' : 'text-emerald-400'}`}>
            {eStopEngaged ? 'E-STOP TRIPPED' : 'NOMINAL (INTERLOCKED)'}
          </span>
        </nav>

        {/* Zone 3: 1 Primary Action Control */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleEStop}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              eStopEngaged 
                ? 'bg-red-600 text-white hover:bg-red-500 animate-pulse shadow-lg shadow-red-900/40' 
                : 'bg-neutral-900 text-red-400 border border-red-900/60 hover:bg-red-950/40 hover:text-red-300'
            }`}
            title="Independent Hardware Emergency Stop"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{eStopEngaged ? 'RESET E-STOP' : 'HARDWARE E-STOP'}</span>
          </button>
        </div>
      </header>

      {/* Main Horizontal Workspace Layout with Left Sidebar */}
    </>
  );
};
