import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react';

interface StepPlayerProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  showAll: boolean;
  onToggleShowAll: () => void;
}

export const StepPlayer: React.FC<StepPlayerProps> = ({
  currentStep,
  totalSteps,
  onStepChange,
  showAll,
  onToggleShowAll,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(600);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        if (currentStep >= totalSteps - 1) {
          setIsPlaying(false);
        } else {
          onStepChange(currentStep + 1);
        }
      }, speedMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedMs, totalSteps, currentStep, onStepChange]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            setIsPlaying(false);
            onStepChange(0);
          }}
          disabled={currentStep === 0}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 border border-slate-700 transition"
          title="Primer ciclo"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            onStepChange(Math.max(0, currentStep - 1));
          }}
          disabled={currentStep === 0}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 border border-slate-700 transition"
          title="Ciclo anterior"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            if (currentStep >= totalSteps - 1) {
              onStepChange(0);
            }
            setIsPlaying(!isPlaying);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition border ${
            isPlaying
              ? 'bg-amber-950/60 text-amber-300 border-amber-800'
              : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-600'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Pausar Reloj' : 'Iniciar Reloj'}</span>
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            onStepChange(Math.min(totalSteps - 1, currentStep + 1));
          }}
          disabled={currentStep >= totalSteps - 1}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 border border-slate-700 transition"
          title="Ciclo siguiente"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            onStepChange(totalSteps - 1);
          }}
          disabled={currentStep >= totalSteps - 1}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 border border-slate-700 transition"
          title="Último ciclo"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <div className="ml-3 px-2.5 py-1 bg-slate-950 rounded border border-slate-800 text-slate-400">
          Ciclo: <span className="text-emerald-400 font-bold">{String(currentStep + 1).padStart(2, '0')}</span> / {String(totalSteps).padStart(2, '0')}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Periodo:</span>
          <select
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded px-2 py-1 outline-none text-xs"
          >
            <option value={1000}>1000 ms</option>
            <option value={600}>600 ms (Normal)</option>
            <option value={200}>200 ms (Rápido)</option>
          </select>
        </div>

        <button
          onClick={onToggleShowAll}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition ${
            showAll
              ? 'bg-slate-800 border-slate-600 text-emerald-400'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>{showAll ? 'Modo Paso a Paso' : 'Mostrar Todos los Ciclos'}</span>
        </button>
      </div>
    </div>
  );
};
