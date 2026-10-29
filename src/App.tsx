import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Brain, 
  BookOpen, 
  Users, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Radio,
  Flame,
  Activity,
  Layers,
  Terminal,
  Server
} from 'lucide-react';
import { Navigation, ActiveTab } from './components/Navigation';
import { MissionControlView } from './components/MissionControlView';
import { MemoryPalaceView } from './components/MemoryPalaceView';
import { KnowledgeVaultView } from './components/KnowledgeVaultView';
import { AgentFleetView } from './components/AgentFleetView';
import { HardwareLabView } from './components/HardwareLabView';
import { ComputeSwitchboardView } from './components/ComputeSwitchboardView';
import { SecurityAirlockView } from './components/SecurityAirlockView';
import { MilestoneEvaluationView } from './components/MilestoneEvaluationView';
import { api } from './services/api';
import { 
  AgentProfile, 
  DeviceTelemetry, 
  ComputeRoutingConfig, 
  MilestoneProgress, 
  ToolDefinition 
} from './types';
import { 
  initialAgents, 
  initialDevices, 
  initialComputeConfig, 
  initialMilestones, 
  initialTools 
} from './data/initialState';

const ONI_CORE_IMAGE = '/src/assets/images/oni_intelligence_core_1793236279882.jpg';
const LAB_RIG_IMAGE = '/src/assets/images/lab_automation_rig_1793236280984.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mission_control');
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [agents, setAgents] = useState<AgentProfile[]>(initialAgents);
  const [devices, setDevices] = useState<DeviceTelemetry[]>(initialDevices);
  const [computeConfig, setComputeConfig] = useState<ComputeRoutingConfig>(initialComputeConfig);
  const [milestones, setMilestones] = useState<MilestoneProgress[]>(initialMilestones);
  const [tools, setTools] = useState<ToolDefinition[]>(initialTools);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllSystemState = async () => {
    try {
      const [statusRes, agentsRes, devicesRes, computeRes, milestonesRes, toolsRes] = await Promise.all([
        api.getSystemStatus().catch(() => null),
        api.getAgents().catch(() => ({ agents: initialAgents })),
        api.getDevices().catch(() => ({ devices: initialDevices })),
        api.getComputeConfig().catch(() => ({ computeConfig: initialComputeConfig })),
        api.getMilestones().catch(() => ({ milestones: initialMilestones })),
        api.getTools().catch(() => ({ tools: initialTools })),
      ]);

      if (statusRes) setSystemStatus(statusRes);
      if (agentsRes?.agents) setAgents(agentsRes.agents);
      if (devicesRes?.devices) setDevices(devicesRes.devices);
      if (computeRes?.computeConfig) setComputeConfig(computeRes.computeConfig);
      if (milestonesRes?.milestones) setMilestones(milestonesRes.milestones);
      if (toolsRes?.tools) setTools(toolsRes.tools);
    } catch (err) {
      console.error('System state synchronization failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllSystemState();
    // Poll telemetry every 6 seconds
    const interval = setInterval(() => {
      api.getDevices().then(res => {
        if (res?.devices) setDevices(res.devices);
      }).catch(() => {});
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleEStop = async () => {
    try {
      const res = await api.toggleEStop();
      loadAllSystemState();
    } catch (err) {
      console.error(err);
    }
  };

  const labStation = devices.find(d => d.type === 'lab_station');
  const eStopEngaged = labStation?.metrics?.eStopEngaged ?? false;
  const pendingApprovalsCount = systemStatus?.stats?.pendingApprovalsCount ?? 0;

  const navItems = [
    { id: 'mission_control' as ActiveTab, label: 'Mission Control', icon: <Bot className="w-4 h-4" /> },
    { id: 'memory_palace' as ActiveTab, label: 'Memory Palace', icon: <Brain className="w-4 h-4" /> },
    { id: 'knowledge_vault' as ActiveTab, label: 'Knowledge Vault', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'agent_fleet' as ActiveTab, label: 'Specialized Agents', icon: <Users className="w-4 h-4" /> },
    { id: 'hardware_lab' as ActiveTab, label: 'Hardware & Lab Station', icon: <Radio className="w-4 h-4" /> },
    { id: 'compute_switchboard' as ActiveTab, label: 'Compute Switchboard', icon: <Cpu className="w-4 h-4" /> },
    { 
      id: 'security_airlock' as ActiveTab, 
      label: 'Security & Airlock', 
      icon: <ShieldCheck className="w-4 h-4" />, 
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined 
    },
    { id: 'milestones_eval' as ActiveTab, label: 'Milestones & Evaluation', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* Top Bar (Strict 3-zone contract) */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        eStopEngaged={eStopEngaged}
        onToggleEStop={handleToggleEStop}
        pendingApprovalsCount={pendingApprovalsCount}
        privacyMode={computeConfig.privacyFirewall}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Workspace Sidebar */}
        <aside className="w-64 border-r border-neutral-800 bg-neutral-950 p-3 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider px-3 mb-2 block">
              Intelligence Modules
            </span>

            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-neutral-900 text-cyan-400 font-semibold shadow-sm' 
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-cyan-400' : 'text-neutral-500'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-800/80 px-1.5 py-0.2 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Node Footer Info */}
          <div className="pt-3 border-t border-neutral-900 text-[11px] font-mono text-neutral-500 px-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Local Host:</span>
              <span className="text-neutral-300">Titan-Core</span>
            </div>
            <div className="flex items-center justify-between">
              <span>RTX 4090:</span>
              <span className="text-emerald-400">Online 18.2GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Provider:</span>
              <span className="text-cyan-400 capitalize truncate max-w-[100px]">
                {computeConfig.activeProvider.replace('_', ' ')}
              </span>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 bg-neutral-950 p-6 overflow-hidden flex flex-col min-w-0">
          <div className="max-w-7xl w-full mx-auto h-full flex flex-col">
            {activeTab === 'mission_control' && (
              <MissionControlView 
                agents={agents} 
                onRefreshSystem={loadAllSystemState}
                coreImageSrc={ONI_CORE_IMAGE}
              />
            )}
            {activeTab === 'memory_palace' && (
              <MemoryPalaceView />
            )}
            {activeTab === 'knowledge_vault' && (
              <KnowledgeVaultView />
            )}
            {activeTab === 'agent_fleet' && (
              <AgentFleetView agents={agents} />
            )}
            {activeTab === 'hardware_lab' && (
              <HardwareLabView 
                devices={devices} 
                onRefresh={loadAllSystemState}
                onToggleEStop={handleToggleEStop}
                labImageSrc={LAB_RIG_IMAGE}
              />
            )}
            {activeTab === 'compute_switchboard' && (
              <ComputeSwitchboardView 
                config={computeConfig} 
                onRefresh={loadAllSystemState} 
              />
            )}
            {activeTab === 'security_airlock' && (
              <SecurityAirlockView 
                tools={tools} 
                onRefresh={loadAllSystemState} 
              />
            )}
            {activeTab === 'milestones_eval' && (
              <MilestoneEvaluationView 
                milestones={milestones} 
                onRefresh={loadAllSystemState} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
