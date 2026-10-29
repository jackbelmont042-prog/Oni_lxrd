import React, { useState } from 'react';
import { 
  Radio, 
  Flame, 
  Sliders, 
  Gauge, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Smartphone, 
  Laptop, 
  Zap, 
  RefreshCw,
  Move
} from 'lucide-react';
import { DeviceTelemetry } from '../types';
import { api } from '../services/api';

interface HardwareLabViewProps {
  devices: DeviceTelemetry[];
  onRefresh: () => void;
  onToggleEStop: () => void;
  labImageSrc?: string;
}

export const HardwareLabView: React.FC<HardwareLabViewProps> = ({
  devices,
  onRefresh,
  onToggleEStop,
  labImageSrc
}) => {
  const labStation = devices.find(d => d.type === 'lab_station');
  const eStopEngaged = labStation?.metrics?.eStopEngaged ?? false;

  const [targetX, setTargetX] = useState<number>(labStation?.metrics?.stepperPositionMm?.x ?? 45);
  const [targetY, setTargetY] = useState<number>(labStation?.metrics?.stepperPositionMm?.y ?? 120);
  const [targetZ, setTargetZ] = useState<number>(labStation?.metrics?.stepperPositionMm?.z ?? 12);
  const [isTranslating, setIsTranslating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleTranslateGantry = async () => {
    if (eStopEngaged) {
      setActionFeedback('Command Aborted: Hardware E-STOP is active! De-energized bus cannot actuate.');
      return;
    }
    setIsTranslating(true);
    setActionFeedback(null);
    try {
      await api.actuateDevice(labStation?.id || 'dev-003', 'translate_gantry', {
        x: targetX,
        y: targetY,
        z: targetZ
      });
      setActionFeedback(`Gantry translated to X:${targetX}mm, Y:${targetY}mm, Z:${targetZ}mm within verified safety envelope.`);
      onRefresh();
    } catch (err: any) {
      setActionFeedback(`Actuation Error: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleWavelengthTune = async (wavelengthNm: number) => {
    if (eStopEngaged) return;
    try {
      await api.actuateDevice(labStation?.id || 'dev-003', 'set_wavelength', { wavelengthNm });
      setActionFeedback(`Monochromator tuned to ${wavelengthNm}nm.`);
      onRefresh();
    } catch (err: any) {
      setActionFeedback(`Error: ${err.message}`);
    }
  };

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-semibold text-neutral-100">Hardware & Laboratory Integration</h2>
            <span className="text-xs text-neutral-500">·</span>
            <span className="text-xs font-mono text-cyan-400 tabular-nums">{devices.length} Connected Subsystems</span>
          </div>
          <p className="text-xs text-neutral-400">
            Per-device permissions, optical spectrometer telemetry, Cartesian XYZ gantry positioning, and independent physical safety interlocks.
          </p>
        </div>

        {/* Global Hardware E-STOP Big Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 rounded transition-colors"
            title="Poll Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleEStop}
            className={`px-4 py-2.5 rounded text-xs font-bold transition-all flex items-center gap-2 ${
              eStopEngaged 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-950/50 animate-pulse'
                : 'bg-neutral-950 border border-red-800/80 text-red-400 hover:bg-red-950/60'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{eStopEngaged ? 'RESET PHYSICAL E-STOP' : 'TRIP HARDWARE E-STOP'}</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className={`p-3 rounded text-xs flex items-center gap-2 border ${
          actionFeedback.includes('Error') || actionFeedback.includes('Aborted')
            ? 'bg-red-950/40 border-red-800 text-red-200'
            : 'bg-cyan-950/40 border-cyan-800 text-cyan-200'
        }`}>
          {actionFeedback.includes('Error') || actionFeedback.includes('Aborted') ? (
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Laboratory Automated Station Benchmark Panel */}
      {labStation && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">{labStation.name}</h3>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                  <span>{labStation.ipAddress}</span>
                  <span aria-hidden="true" className="text-neutral-700">·</span>
                  <span className={eStopEngaged ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {eStopEngaged ? 'E-STOP TRIPPED (POWER CUT)' : 'INTERLOCK NOMINAL'}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
              Last Ping: {new Date(labStation.lastPing).toLocaleTimeString()}
            </span>
          </div>

          {/* Split: Rig Photo + Telemetry Readouts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
            {/* Rig Visual Frame */}
            <div className="lg:col-span-5 rounded-lg border border-neutral-800 overflow-hidden relative bg-neutral-950">
              {labImageSrc ? (
                <img 
                  src={labImageSrc} 
                  alt="Precision Lab Automation Rig" 
                  className="w-full h-56 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-56 flex items-center justify-center text-xs text-neutral-600">
                  Lab Automation Rig
                </div>
              )}
              {/* Overlay state badge */}
              <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${eStopEngaged ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <span className="text-neutral-300">{eStopEngaged ? 'BUS OFF' : 'ONLINE 24V'}</span>
              </div>
            </div>

            {/* Telemetry Dashboard Strip */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Metric: Spectrometer */}
              <div className="bg-neutral-950 p-3 rounded-md border border-neutral-800 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Monochromator</span>
                <div>
                  <div className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
                    {labStation.metrics?.spectrometerWavelengthNm?.toFixed(1)} <span className="text-xs text-neutral-400">nm</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                    Abs: {labStation.metrics?.spectrometerIntensity} AU
                  </span>
                </div>
                <div className="flex gap-1 mt-2">
                  {[280.0, 435.8, 546.1].map(w => (
                    <button
                      key={w}
                      disabled={eStopEngaged}
                      onClick={() => handleWavelengthTune(w)}
                      className="px-1.5 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-[10px] font-mono text-neutral-300 rounded border border-neutral-800 disabled:opacity-40"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric: Chamber Pressure */}
              <div className="bg-neutral-950 p-3 rounded-md border border-neutral-800 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Manifold Pressure</span>
                <div>
                  <div className="text-lg font-bold font-mono text-neutral-200 tabular-nums">
                    {labStation.metrics?.chamberPressurePsi?.toFixed(1)} <span className="text-xs text-neutral-400">PSI</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    &lt; 32.0 PSI Envelope
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500">Pneumatic valve 1/2 closed</span>
              </div>

              {/* Metric: Temperature */}
              <div className="bg-neutral-950 p-3 rounded-md border border-neutral-800 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Chamber Temp</span>
                <div>
                  <div className="text-lg font-bold font-mono text-neutral-200 tabular-nums">
                    {labStation.metrics?.chamberTempC?.toFixed(1)} <span className="text-xs text-neutral-400">°C</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Target: 23.5°C ± 0.5
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500">Peltier active</span>
              </div>

              {/* Metric: Gantry XYZ */}
              <div className="col-span-2 sm:col-span-3 bg-neutral-950 p-3.5 rounded-md border border-neutral-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-neutral-400 text-[11px] uppercase">Gantry Current Position</span>
                  <span className="font-mono text-xs text-cyan-400 tabular-nums">
                    X: {labStation.metrics?.stepperPositionMm?.x}mm · Y: {labStation.metrics?.stepperPositionMm?.y}mm · Z: {labStation.metrics?.stepperPositionMm?.z}mm
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Velocity Clamp: 15.0 mm/s · Lead Screw Step: 0.02mm · Safe Envelope: [0..200, 0..200, 0..50]
                </div>
              </div>
            </div>
          </div>

          {/* Calibrated Gantry Stepper Controls */}
          <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-cyan-400" />
                <span>Calibrated Cartesian Gantry Actuator</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                Ring 2 Permission (Verified Envelope)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
              <div>
                <label className="text-neutral-400 font-mono block mb-1">Target X (0 - 200 mm): {targetX}mm</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={targetX}
                  disabled={eStopEngaged || isTranslating}
                  onChange={(e) => setTargetX(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 font-mono block mb-1">Target Y (0 - 200 mm): {targetY}mm</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={targetY}
                  disabled={eStopEngaged || isTranslating}
                  onChange={(e) => setTargetY(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 font-mono block mb-1">Target Z (0 - 50 mm): {targetZ}mm</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={targetZ}
                  disabled={eStopEngaged || isTranslating}
                  onChange={(e) => setTargetZ(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] text-neutral-500">
                {eStopEngaged 
                  ? 'Actuator translation disabled while Emergency Stop is tripped.' 
                  : 'Translations execute at 12mm/s with software ramp.'}
              </span>

              <button
                onClick={handleTranslateGantry}
                disabled={eStopEngaged || isTranslating}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-100 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isTranslating ? 'Translating...' : 'Execute Translation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Connected Devices (PC & Phone) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.filter(d => d.type !== 'lab_station').map(dev => (
          <div key={dev.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {dev.type === 'workstation' ? (
                  <Laptop className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                )}
                <h3 className="text-sm font-semibold text-neutral-100">{dev.name}</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 uppercase">
                {dev.status}
              </span>
            </div>

            <div className="text-[11px] font-mono text-neutral-500 mb-3">
              Endpoint: {dev.ipAddress}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs mb-4">
              {dev.metrics?.cpuPercent !== undefined && (
                <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 font-mono block">CPU</span>
                  <span className="font-mono text-neutral-200 tabular-nums">{dev.metrics.cpuPercent}%</span>
                </div>
              )}
              {dev.metrics?.ramPercent !== undefined && (
                <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 font-mono block">RAM</span>
                  <span className="font-mono text-neutral-200 tabular-nums">{dev.metrics.ramPercent}%</span>
                </div>
              )}
              {dev.metrics?.batteryPercent !== undefined && (
                <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 font-mono block">Battery</span>
                  <span className="font-mono text-neutral-200 tabular-nums">{dev.metrics.batteryPercent}%</span>
                </div>
              )}
              {dev.metrics?.gpuVramUsedMb !== undefined && (
                <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 font-mono block">VRAM</span>
                  <span className="font-mono text-neutral-200 tabular-nums">{(dev.metrics.gpuVramUsedMb / 1024).toFixed(1)} GB</span>
                </div>
              )}
            </div>

            {/* Scoped Permissions list */}
            <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-500">
              <span className="font-medium text-neutral-400">Granted Scopes: </span>
              <span>
                {Object.entries(dev.permissions)
                  .filter(([_, allowed]) => allowed)
                  .map(([name]) => name)
                  .join(' · ') || 'Read telemetry only'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
