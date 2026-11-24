import React from 'react';
import { BookOpen, ExternalLink, Cpu } from 'lucide-react';

export const GuideView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-5xl mx-auto font-mono text-xs text-slate-300">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Marco Teórico y Fundamentos de Arquitectura de Hardware (16 Bits)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Double Dabble */}
          <div className="bg-slate-950 border border-slate-800 rounded p-4 space-y-2">
            <h3 className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> 1. Algoritmo Double Dabble (Shift-and-Add-3)
            </h3>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              Mecanismo hardware diseñado para convertir binario puro a BCD (Binary Coded Decimal) sin recurrir a divisiones sucesivas entre 10, las cuales son computacionalmente costosas en lógica combinacional/secuencial.
            </p>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1 text-[11px]">
              <div className="text-white font-semibold">Regla de Transición (Binario → BCD):</div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                <li>En cada uno de los 16 ciclos:</li>
                <li>Si cualquier dígito BCD (nibble de 4 bits) es <code className="text-emerald-300 font-bold">≥ 5</code> (0101₂), se le suma 3 (0011₂).</li>
                <li>Se desplaza todo el banco de registros 1 bit hacia la izquierda.</li>
              </ul>
              <div className="text-white font-semibold mt-2">Regla Inversa (BCD → Binario):</div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                <li>Se desplazan todos los registros 1 bit a la derecha.</li>
                <li>Si algún nibble resultante es <code className="text-emerald-300 font-bold">≥ 8</code> (1000₂), se le resta 3 (0011₂).</li>
              </ul>
            </div>
          </div>

          {/* Booth Multiplier */}
          <div className="bg-slate-950 border border-slate-800 rounded p-4 space-y-2">
            <h3 className="text-indigo-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> 2. Multiplicación de Booth (Signed / Unsigned)
            </h3>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              Algoritmo de multiplicación desarrollado por Andrew Donald Booth en 1950. Aprovecha secuencias contiguas de ceros y unos para minimizar el número de adiciones requeridas en la ALU.
            </p>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1 text-[11px]">
              <div className="text-white font-semibold">Decodificación de Bits (Q₀, Q₋₁):</div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                <li><code className="text-indigo-300">10</code>: Inicio de cadena de 1s → <code className="text-rose-400 font-bold">A = A - M</code></li>
                <li><code className="text-indigo-300">01</code>: Fin de cadena de 1s → <code className="text-emerald-400 font-bold">A = A + M</code></li>
                <li><code className="text-indigo-300">00 / 11</code>: Interior de cadena → Solo desplazamiento aritmético.</li>
                <li>Desplazamiento aritmético a la derecha: Conserva el bit más significativo (bit de signo A₁₅).</li>
              </ul>
            </div>
          </div>

          {/* Division */}
          <div className="bg-slate-950 border border-slate-800 rounded p-4 space-y-2 md:col-span-2">
            <h3 className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> 3. División Binaria (Restoring & Non-Restoring)
            </h3>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              Algoritmo secuencial basado en restas y pruebas de acarreo sobre el acumulador y el cociente temporal:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                <div className="text-white font-semibold">Algoritmo con Restauración (Restoring):</div>
                <p className="text-slate-400">
                  1. Desplazar a la izquierda [A, Q].<br />
                  2. Restar divisor: <code className="text-amber-300">A = A - M</code>.<br />
                  3. Si <code className="text-rose-400">A &lt; 0</code>: Restaurar sumando <code className="text-emerald-300">A = A + M</code> y fijar <code className="text-white">Q₀ = 0</code>.<br />
                  4. Si <code className="text-emerald-400">A ≥ 0</code>: Conservar resta y fijar <code className="text-emerald-300">Q₀ = 1</code>.
                </p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                <div className="text-white font-semibold">Algoritmo sin Restauración (Non-Restoring):</div>
                <p className="text-slate-400">
                  Evita ciclos de restauración adicionando o sustrayendo en el ciclo subsecuente en función del signo de A en el ciclo previo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* References */}
        <div className="bg-slate-950 border border-slate-800 rounded p-4 space-y-2">
          <div className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
            Referencias Académicas y Material del Curso
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <a
              href="https://www.youtube.com/watch?v=FHy-9iyiS1w"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded flex items-center justify-between text-slate-300 hover:text-emerald-400 transition"
            >
              <span>Double Dabble: Binario ↔ BCD (Amado Ospina)</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a
              href="https://www.youtube.com/watch?v=C7uaMtI9qSI"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded flex items-center justify-between text-slate-300 hover:text-emerald-400 transition"
            >
              <span>Multiplicación de Booth Sin Signo (Amado Ospina)</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a
              href="https://www.youtube.com/watch?v=eZQqwvCWJ9o"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded flex items-center justify-between text-slate-300 hover:text-emerald-400 transition"
            >
              <span>Multiplicación de Booth Con Signo (Amado Ospina)</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a
              href="https://www.youtube.com/watch?v=G78D5Ud7_RY"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded flex items-center justify-between text-slate-300 hover:text-emerald-400 transition"
            >
              <span>Algoritmo para la División Binaria (Amado Ospina)</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
