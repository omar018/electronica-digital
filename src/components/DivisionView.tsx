import React, { useState, useMemo } from 'react';
import { restoringDivision, nonRestoringDivision } from '../engine/division';
import { parseInput } from '../engine/utils';
import { StepPlayer } from './StepPlayer';
import { Copy, Check, Sparkles, AlertTriangle } from 'lucide-react';

export const DivisionView: React.FC = () => {
  const [isRestoring, setIsRestoring] = useState<boolean>(true);
  const [inputDividend, setInputDividend] = useState<string>('142');
  const [inputDivisor, setInputDivisor] = useState<string>('5');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Parsing inputs (unsigned 16 bits)
  const parsedDividend = useMemo(() => parseInput(inputDividend, false), [inputDividend]);
  const parsedDivisor = useMemo(() => parseInput(inputDivisor, false), [inputDivisor]);

  const isDivByZero = parsedDivisor.valid && parsedDivisor.dec === 0;
  const isValid = parsedDividend.valid && parsedDivisor.valid && !isDivByZero;

  const result = useMemo(() => {
    if (!isValid) return null;
    try {
      return isRestoring
        ? restoringDivision(parsedDividend.dec, parsedDivisor.dec)
        : nonRestoringDivision(parsedDividend.dec, parsedDivisor.dec);
    } catch {
      return null;
    }
  }, [isValid, isRestoring, parsedDividend.dec, parsedDivisor.dec]);

  const steps = result?.steps || [];
  const currentStepData = steps[currentStep] || null;

  const handleCopyTable = () => {
    if (!steps.length) return;
    let text = `DIVISIÓN BINARIA (${isRestoring ? 'CON RESTAURACIÓN' : 'SIN RESTAURACIÓN'})\n`;
    text += `Dividendo (Q): ${inputDividend} | Divisor (M): ${inputDivisor}\n\n`;
    text += `| Ciclo | Registro A (Acumulador) | Registro Q (Cociente) | Divisor M         | Operación |\n`;
    text += `|-------|-------------------------|-----------------------|-------------------|-----------|\n`;
    steps.forEach((s) => {
      text += `| ${s.cycle} | ${s.A} | ${s.Q} | ${s.M} | ${s.operation} |\n`;
    });
    text += `\nCociente: ${result?.quotientDec} (${result?.quotientBin}) | Residuo: ${result?.remainderDec} (${result?.remainderBin})\n`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">Método de División:</span>
              <div className="inline-flex p-1 rounded-xl bg-slate-800 border border-slate-700/60 text-xs">
                <button
                  onClick={() => {
                    setIsRestoring(true);
                    setCurrentStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    isRestoring
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Con Restauración (Restoring)
                </button>
                <button
                  onClick={() => {
                    setIsRestoring(false);
                    setCurrentStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    !isRestoring
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sin Restauración (Non-Restoring)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ejemplos:</span>
              <button
                onClick={() => {
                  setInputDividend('142');
                  setInputDivisor('5');
                  setCurrentStep(0);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
              >
                142 ÷ 5
              </button>
              <button
                onClick={() => {
                  setInputDividend('11');
                  setInputDivisor('3');
                  setCurrentStep(0);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
              >
                11 ÷ 3 (Vídeo)
              </button>
              <button
                onClick={() => {
                  setInputDividend('b1101');
                  setInputDivisor('b11');
                  setCurrentStep(0);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
              >
                13 ÷ 3 (Bin)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Dividendo (Decimal o prefijo "b", max 16 bits):
              </label>
              <input
                type="text"
                value={inputDividend}
                onChange={(e) => {
                  setInputDividend(e.target.value);
                  setCurrentStep(0);
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm outline-none transition"
              />
              {parsedDividend.valid && (
                <div className="text-[11px] font-mono text-slate-400">
                  Dec: <span className="text-white">{parsedDividend.dec}</span> | Bin:{' '}
                  <span className="text-cyan-400">{parsedDividend.bin}</span>
                </div>
              )}
              {!parsedDividend.valid && (
                <p className="text-xs text-rose-400">{parsedDividend.error}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Divisor (Decimal o prefijo "b", max 16 bits):
              </label>
              <input
                type="text"
                value={inputDivisor}
                onChange={(e) => {
                  setInputDivisor(e.target.value);
                  setCurrentStep(0);
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm outline-none transition"
              />
              {parsedDivisor.valid && !isDivByZero && (
                <div className="text-[11px] font-mono text-slate-400">
                  Dec: <span className="text-white">{parsedDivisor.dec}</span> | Bin:{' '}
                  <span className="text-cyan-400">{parsedDivisor.bin}</span>
                </div>
              )}
              {isDivByZero && (
                <p className="text-xs text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> El divisor no puede ser cero
                </p>
              )}
              {!parsedDivisor.valid && <p className="text-xs text-rose-400">{parsedDivisor.error}</p>}
            </div>
          </div>
        </div>

        {/* Live Result Summary Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Resultados de la División
            </span>
            <button
              onClick={handleCopyTable}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition"
              title="Copiar procedimiento"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          {result && (
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">COCIENTE (Q):</span>
                  <span className="text-xl font-bold text-white">{result.quotientDec}</span>
                  <span className="text-[10px] text-emerald-400 block break-all">
                    {result.quotientBin}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">RESIDUO (A):</span>
                  <span className="text-xl font-bold text-cyan-400">{result.remainderDec}</span>
                  <span className="text-[10px] text-cyan-400/80 block break-all">
                    {result.remainderBin}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">
                  Comprobación Matemática:
                </span>
                <div>
                  <span className="text-white font-bold">{result.dividendDec}</span> = (
                  <span className="text-indigo-400">{result.divisorDec}</span> ×{' '}
                  <span className="text-emerald-400">{result.quotientDec}</span>) +{' '}
                  <span className="text-cyan-400">{result.remainderDec}</span>
                </div>
                <div className="text-[10px] text-emerald-400">
                  {result.divisorDec * result.quotientDec + result.remainderDec === result.dividendDec
                    ? '✓ Ecuación verificada correctamente'
                    : '✗ Error en cálculo'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registers Inspector at Current Step */}
      {currentStepData && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200">
              Registros en Ciclo {currentStepData.cycle} ({currentStepData.operation})
            </h3>
            {currentStepData.restored && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ↺ Restauración Aplicada
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Acumulador A (Residuo parcial)
              </span>
              <div className="text-sm font-bold text-cyan-400 tracking-wider">
                {currentStepData.A}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Registro Q (Cociente parcial)
              </span>
              <div className="text-sm font-bold text-emerald-400 tracking-wider">
                {currentStepData.Q}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Divisor M (Fijo)
              </span>
              <div className="text-sm font-bold text-indigo-400 tracking-wider">
                {currentStepData.M}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Player */}
      {steps.length > 0 && (
        <StepPlayer
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
          showAll={showAllSteps}
          onToggleShowAll={() => setShowAllSteps(!showAllSteps)}
        />
      )}

      {/* Procedural Table */}
      {steps.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Tabla de Procedimiento de la División ({isRestoring ? 'Con Restauración' : 'Sin Restauración'})
            </h3>
            <span className="text-xs text-slate-400">{steps.length} pasos</span>
          </div>

          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Ciclo</th>
                  <th className="py-2.5 px-3 text-cyan-400">A (Acumulador)</th>
                  <th className="py-2.5 px-3 text-emerald-400">Q (Cociente Parcial)</th>
                  <th className="py-2.5 px-3 text-indigo-400">M (Divisor)</th>
                  <th className="py-2.5 px-3">Operación Realizada</th>
                  <th className="py-2.5 px-3 text-slate-400">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {steps.map((step, idx) => {
                  const isCurrent = idx === currentStep;
                  if (!showAllSteps && !isCurrent) return null;

                  return (
                    <tr
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`cursor-pointer transition ${
                        isCurrent
                          ? 'bg-cyan-500/15 border-l-4 border-cyan-400'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-2 px-3 font-bold text-slate-300">{step.cycle}</td>
                      <td className="py-2 px-3 text-cyan-400 font-mono tracking-wider">{step.A}</td>
                      <td className="py-2 px-3 text-emerald-400 font-mono tracking-wider">{step.Q}</td>
                      <td className="py-2 px-3 text-indigo-400 font-mono tracking-wider">{step.M}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            step.restored
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : step.operation.includes('Exitosa')
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {step.operation}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-400 max-w-xs truncate">
                        {step.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
