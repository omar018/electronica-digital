import React from 'react';
import { Cpu, Binary, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 shadow-lg shadow-indigo-500/20 text-white">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Simulador de Arquitectura Digital
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  16 BITS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Universidad Nacional de Colombia • Electrónica Digital & Arquitectura
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
              <Binary className="w-4 h-4 text-cyan-400" />
              <span>Double Dabble</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Booth Mult & Div</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
