import React, { useState, useMemo } from 'react';
import { signedBoothMultiply, unsignedBoothMultiply } from '../engine/booth';
import { parseInput } from '../engine/utils';
import { StepPlayer } from './StepPlayer';
import { Copy, Check, Sparkles } from 'lucide-react';

export const BoothView: React.FC = () => {
  const [isSigned, setIsSigned] = useState<boolean>(true);
  const [inputM, setInputM] = useState<string>('11');
  const [inputQ, setInputQ] = useState<string>('-7');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Parsing inputs
  const parsedM = useMemo(() => parseInput(inputM, isSigned), [inputM, isSigned]);
  const parsedQ = useMemo(() => parseInput(inputQ, isSigned), [inputQ, isSigned]);

  const isValid = parsedM.valid && parsedQ.valid;

  const result = useMemo(() => {
    if (!isValid) return null;
    return isSigned
      ? signedBoothMultiply(parsedM.dec, parsedQ.dec)
      : unsignedBoothMultiply(parsedM.dec, parsedQ.dec);
  }, [isValid, isSigned, parsedM.dec, parsedQ.dec]);

  const steps = result?.steps || [];
  const currentStepData = steps[currentStep] || null;

  const handleCopyTable = () => {
    if (!steps.length) return;
    let text = `MULTIPLICACIÓN DE BOOTH (${isSigned ? 'CON SIGNO' : 'SIN SIGNO'})\n`;
    text += `Multiplicando (M): ${inputM} | Multiplicador (Q): ${inputQ}\n\n`;
    text += `| Cuenta | Q_0 | ${isSigned ? 'Q_-1' : 'C_f'} | AL (Registro A)   | DL (Registro Q)   | Operación |\n`;
    text += `|--------|-----|------|-------------------|-------------------|-----------|\n`;
    steps.forEach((s) => {
      const extraBit = isSigned ? s.Q_prev : s.Cf;
      text += `| ${s.cycle} | ${s.Q[15]} | ${extraBit} | ${s.A} | ${s.Q} | ${s.operation} |\n`;
    });
    text += `\nResultado: ${result?.productDec} (Binario 32b: ${result?.productBin})\n`;
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
              <span className="text-sm font-semibold text-slate-200">Tipo de Multiplicación:</span>
              <div className="inline-flex p-1 rounded-xl bg-slate-800 border border-slate-700/60 text-xs">
                <button
                  onClick={() => {
                    setIsSigned(true);
                    setInputM('11');
                    setInputQ('-7');
                    setCurrentStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    isSigned
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Con Signo (Booth Clásico)
                </button>
                <button
                  onClick={() => {
                    setIsSigned(false);
                    setInputM('23');
                    setInputQ('3');
                    setCurrentStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    !isSigned
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sin Signo (Shift-Add)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ejemplos:</span>
              {isSigned ? (
                <>
                  <button
                    onClick={() => {
                      setInputM('11');
                      setInputQ('-7');
                      setCurrentStep(0);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
                  >
                    11 × -7 (Vídeo)
                  </button>
                  <button
                    onClick={() => {
                      setInputM('-15');
                      setInputQ('-4');
                      setCurrentStep(0);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
                  >
                    -15 × -4
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setInputM('23');
                      setInputQ('3');
                      setCurrentStep(0);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
                  >
                    23 × 3 (Vídeo)
                  </button>
                  <button
                    onClick={() => {
                      setInputM('142');
                      setInputQ('5');
                      setCurrentStep(0);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
                  >
                    142 × 5
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Multiplicando M (Decimal o prefijo "b"):
              </label>
              <input
                type="text"
                value={inputM}
                onChange={(e) => {
                  setInputM(e.target.value);
                  setCurrentStep(0);
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm outline-none transition"
              />
              {parsedM.valid && (
                <div className="text-[11px] font-mono text-slate-400">
                  Dec: <span className="text-white">{parsedM.dec}</span> | Bin:{' '}
                  <span className="text-cyan-400">{parsedM.bin}</span>
                </div>
              )}
              {!parsedM.valid && <p className="text-xs text-rose-400">{parsedM.error}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Multiplicador Q (Decimal o prefijo "b"):
              </label>
              <input
                type="text"
                value={inputQ}
                onChange={(e) => {
                  setInputQ(e.target.value);
                  setCurrentStep(0);
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm outline-none transition"
              />
              {parsedQ.valid && (
                <div className="text-[11px] font-mono text-slate-400">
                  Dec: <span className="text-white">{parsedQ.dec}</span> | Bin:{' '}
                  <span className="text-cyan-400">{parsedQ.bin}</span>
                </div>
              )}
              {!parsedQ.valid && <p className="text-xs text-rose-400">{parsedQ.error}</p>}
            </div>
          </div>
        </div>

        {/* Live Result Summary Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Producto Calculado (32 bits)
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
              <div>
                <span className="text-slate-500 block">PRODUCTO DECIMAL:</span>
                <span className="text-2xl font-bold text-white tracking-tight">
                  {result.productDec.toString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">BINARIO (32 BITS):</span>
                <span className="text-emerald-400 font-mono text-xs break-all block">
                  {result.productBin.slice(0, 16)} {result.productBin.slice(16)}
                </span>
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Parte Alta [AL]: {result.productBin.slice(0, 16)}</span>
                  <span>Parte Baja [DL]: {result.productBin.slice(16)}</span>
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
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {currentStepData.description}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Registro AL (Acumulador A)
              </span>
              <div className="text-sm font-bold text-cyan-400 tracking-wider">
                {currentStepData.A}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Dec: {currentStepData.A_dec}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Registro DL (Multiplicador Q)
              </span>
              <div className="text-sm font-bold text-indigo-400 tracking-wider">
                {currentStepData.Q}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Dec: {currentStepData.Q_dec}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                {isSigned ? 'Bit Q₋₁ (Anterior)' : 'Carry Flag (Cf)'}
              </span>
              <div className="text-xl font-bold text-amber-400">
                {isSigned ? currentStepData.Q_prev : currentStepData.Cf}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Multiplicando M (Fijo)
              </span>
              <div className="text-sm font-bold text-slate-200 tracking-wider">
                {result?.multiplicandBin}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Dec: {result?.multiplicandDec}
              </span>
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
              Tabla de Procedimiento de Booth (16 Ciclos)
            </h3>
            <span className="text-xs text-slate-400">{steps.length} pasos</span>
          </div>

          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Cuenta</th>
                  <th className="py-2.5 px-3 text-center">Q₀</th>
                  <th className="py-2.5 px-3 text-center">{isSigned ? 'Q₋₁' : 'Cf'}</th>
                  <th className="py-2.5 px-3 text-cyan-400">AL (Registro A)</th>
                  <th className="py-2.5 px-3 text-indigo-400">DL (Registro Q)</th>
                  <th className="py-2.5 px-3">Operación Realizada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {steps.map((step, idx) => {
                  const isCurrent = idx === currentStep;
                  if (!showAllSteps && !isCurrent) return null;

                  const q0 = step.Q[15];
                  const extra = isSigned ? step.Q_prev : step.Cf;

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
                      <td className="py-2 px-3 text-center text-amber-300 font-bold">{q0}</td>
                      <td className="py-2 px-3 text-center text-amber-400 font-bold">{extra}</td>
                      <td className="py-2 px-3 text-cyan-400 font-mono tracking-wider">{step.A}</td>
                      <td className="py-2 px-3 text-indigo-400 font-mono tracking-wider">{step.Q}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            step.operation.includes('A - M')
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : step.operation.includes('A + M')
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {step.operation}
                        </span>
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
