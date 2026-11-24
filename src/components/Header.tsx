import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      {/* Top Institutional Bar */}
      <div className="bg-[#0b2818] border-b border-[#144728] px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[11px] font-mono text-emerald-300">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-wider text-white">
              UNIVERSIDAD NACIONAL DE COLOMBIA
            </span>
            <span className="hidden md:inline text-emerald-500">•</span>
            <span className="hidden md:inline text-emerald-400/90">
              Facultad de Ingeniería • Electrónica Digital
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span>Docente:</span>
            <span className="text-white font-semibold">Ing. Amado Ospina Montoya</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>
              <h1 className="text-lg font-bold text-white tracking-tight uppercase font-mono">
                Banco de Pruebas de Algoritmos Aritméticos de 16 Bits
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                LAB-ARCH-2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Simulador interactivo de hardware: Double Dabble (Directo e Inverso), Multiplicación de Booth (Con/Sin Signo) y División Binaria por Restas.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Lógica Síncrona (16 Ciclos)</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              Palabra: <strong className="text-white">16 Bits</strong>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
