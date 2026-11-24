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
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setIsPlaying(false);
            onStepChange(0);
          }}
          disabled={currentStep === 0}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
          title="Primer paso"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            onStepChange(Math.max(0, currentStep - 1));
          }}
          disabled={currentStep === 0}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
          title="Paso anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (currentStep >= totalSteps - 1) {
              onStepChange(0);
            }
            setIsPlaying(!isPlaying);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-semibold shadow-lg shadow-cyan-500/20'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            onStepChange(Math.min(totalSteps - 1, currentStep + 1));
          }}
          disabled={currentStep >= totalSteps - 1}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
          title="Siguiente paso"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            onStepChange(totalSteps - 1);
          }}
          disabled={currentStep >= totalSteps - 1}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
          title="Último paso"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono text-slate-400 ml-2">
          Paso <span className="text-cyan-400 font-bold">{currentStep + 1}</span> de {totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Velocidad:</span>
          <select
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2 py-1 text-xs outline-none"
          >
            <option value={1000}>0.5x (Lento)</option>
            <option value={600}>1x (Normal)</option>
            <option value={250}>2x (Rápido)</option>
          </select>
        </div>

        <button
          onClick={onToggleShowAll}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            showAll
              ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          {showAll ? 'Modo Interactivo' : 'Ver Todos los Pasos'}
        </button>
      </div>
    </div>
  );
};
