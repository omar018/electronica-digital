import React from 'react';
import { BookOpen, ExternalLink, CheckCircle } from 'lucide-react';

export const GuideView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Guía y Fundamentos de los Algoritmos</h2>
            <p className="text-xs text-slate-400">
              Criterios de evaluación y lógica matemática explicada para presentación académica
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-cyan-400 flex items-center gap-1.5 text-sm">
              <CheckCircle className="w-4 h-4 text-cyan-400" /> 1. Double Dabble (Binario ↔ BCD)
            </h3>
            <p>
              El algoritmo <strong>Double Dabble</strong> evita divisiones pesadas entre 10 al convertir números binarios a código BCD (Binary Coded Decimal):
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>
                <strong>Binario a BCD:</strong> En cada uno de los 16 ciclos, si cualquier columna BCD es mayor o igual a 5 (<code className="text-cyan-300">≥ 0101₂</code>), se le suma 3 (<code className="text-cyan-300">+0011₂</code>). Luego se desplazan todos los registros 1 bit a la izquierda.
              </li>
              <li>
                <strong>BCD a Binario (Inverso):</strong> Se desplazan todos los registros a la derecha 1 bit hacia el acumulador binario. Si alguna columna BCD es mayor o igual a 8 (<code className="text-cyan-300">≥ 1000₂</code>), se le resta 3 (<code className="text-cyan-300">-0011₂</code>).
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-indigo-400 flex items-center gap-1.5 text-sm">
              <CheckCircle className="w-4 h-4 text-indigo-400" /> 2. Algoritmo de Booth (Multiplicación)
            </h3>
            <p>
              Optimiza la multiplicación tratando bloques contiguos de 1s binarios:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>
                <strong>Con Signo:</strong> Evalúa los bits <code className="text-indigo-300">(Q₀, Q₋₁)</code>. Si es <code className="text-indigo-300">10</code> resta <code className="text-indigo-300">A = A - M</code>. Si es <code className="text-indigo-300">01</code> suma <code className="text-indigo-300">A = A + M</code>. Luego realiza desplazamiento aritmético a la derecha conservando el bit de signo.
              </li>
              <li>
                <strong>Sin Signo (Shift-Add):</strong> Evalúa <code className="text-indigo-300">Q₀</code>. Si es 1, suma <code className="text-indigo-300">A = A + M</code> activando el carry. Luego desplaza a la derecha con el carry entrante.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 md:col-span-2">
            <h3 className="font-semibold text-emerald-400 flex items-center gap-1.5 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> 3. División Binaria (Restoring / Non-Restoring)
            </h3>
            <p className="text-slate-300">
              Determina el cociente (<strong className="text-white">Q</strong>) y el residuo (<strong className="text-white">A</strong>) a través de desplazamientos y restas sucesivas:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>
                <strong>Con Restauración (Restoring):</strong> Desplaza <code className="text-emerald-300">[A, Q]</code> a la izquierda. Resta el divisor: <code className="text-emerald-300">A = A - M</code>. Si el resultado es negativo (<code className="text-rose-400">A &lt; 0</code>), se restaura el valor original sumando <code className="text-emerald-300">A = A + M</code> y se coloca <code className="text-white">Q₀ = 0</code>. Si es positivo o cero, se conserva y se coloca <code className="text-emerald-300">Q₀ = 1</code>.
              </li>
            </ul>
          </div>
        </div>

        {/* Video References */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Enlaces de Referencia de los Vídeos del Curso
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href="https://www.youtube.com/watch?v=FHy-9iyiS1w"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-cyan-400 flex items-center justify-between transition"
            >
              <span>1. Double Dabble (Binario a BCD y viceversa)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-50" />
            </a>
            <a
              href="https://www.youtube.com/watch?v=C7uaMtI9qSI"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-cyan-400 flex items-center justify-between transition"
            >
              <span>2. Algoritmo de Booth (Sin signo)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-50" />
            </a>
            <a
              href="https://www.youtube.com/watch?v=eZQqwvCWJ9o"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-cyan-400 flex items-center justify-between transition"
            >
              <span>3. Algoritmo de Booth (Con Signo)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-50" />
            </a>
            <a
              href="https://www.youtube.com/watch?v=G78D5Ud7_RY"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-cyan-400 flex items-center justify-between transition"
            >
              <span>4. Algoritmo para la División</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-50" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
