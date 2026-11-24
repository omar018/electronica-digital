import React, { useState, useMemo } from 'react';
import { binaryToBcdDoubleDabble, bcdToBinaryDoubleDabble } from '../engine/doubleDabble';
import { parseInput } from '../engine/utils';
import { StepPlayer } from './StepPlayer';
import { Check, Copy, Sparkles } from 'lucide-react';

export const DoubleDabbleView: React.FC = () => {
  const [direction, setDirection] = useState<'bin2bcd' | 'bcd2bin'>('bin2bcd');
  const [inputValue, setInputValue] = useState<string>('142');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Parsing & Calculation for Bin -> BCD
  const parsed = useMemo(() => {
    return parseInput(inputValue, false);
  }, [inputValue]);

  const binToBcdResult = useMemo(() => {
    if (!parsed.valid) return null;
    return binaryToBcdDoubleDabble(parsed.dec);
  }, [parsed]);

  // Parsing & Calculation for BCD -> Bin
  // Digits input e.g. "0 0 1 4 2" or "142"
  const bcdDigits = useMemo((): [number, number, number, number, number] => {
    const raw = inputValue.replace(/[^0-9]/g, '');
    const padded = raw.padStart(5, '0').slice(-5);
    return [
      parseInt(padded[0], 10),
      parseInt(padded[1], 10),
      parseInt(padded[2], 10),
      parseInt(padded[3], 10),
      parseInt(padded[4], 10),
    ];
  }, [inputValue]);

  const bcdToBinResult = useMemo(() => {
    if (direction !== 'bcd2bin') return null;
    return bcdToBinaryDoubleDabble(bcdDigits);
  }, [direction, bcdDigits]);

  const activeSteps = direction === 'bin2bcd' ? binToBcdResult?.steps : bcdToBinResult?.steps;
  const totalSteps = activeSteps?.length || 0;

  const currentStepData = activeSteps && activeSteps[currentStep] ? activeSteps[currentStep] : null;

  const handleCopyTable = () => {
    if (!activeSteps) return;
    let text = `PROCEDIMIENTO DOUBLE DABBLE (${direction === 'bin2bcd' ? 'Binario a BCD' : 'BCD a Binario'})\n`;
    text += `Entrada: ${inputValue}\n\n`;
    text += `Paso | Operación | D_Mil | U_Mil | Centena | Decena | Unidad | Registro Binario | Ajuste\n`;
    text += `-----|-----------|-------|-------|---------|--------|--------|------------------|-------\n`;
    activeSteps.forEach((s) => {
      text += `${s.cycle} | ${s.operation} | ${s.bcdBinary[0]} | ${s.bcdBinary[1]} | ${s.bcdBinary[2]} | ${s.bcdBinary[3]} | ${s.bcdBinary[4]} | ${s.binaryRegister} | ${s.adjustmentMade || ''}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">Dirección de Conversión:</span>
              <div className="inline-flex p-1 rounded-xl bg-slate-800 border border-slate-700/60 text-xs">
                <button
                  onClick={() => {
                    setDirection('bin2bcd');
                    setInputValue('142');
                    setCurrentStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    direction === 'bin2bcd'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Binario / Decimal → BCD
                </button>
                <button
                  onClick={() => {
                    setDirection('bcd2bin');
                    setInputValue('00142');
                    setCurrentStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    direction === 'bcd2bin'
                      ? 'bg-indigo-500 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BCD → Binario (Inverso)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ejemplos:</span>
              <button
                onClick={() => setInputValue(direction === 'bin2bcd' ? '142' : '00142')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
              >
                142 (Vídeo)
              </button>
              <button
                onClick={() => setInputValue(direction === 'bin2bcd' ? 'b1011' : '00011')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
              >
                11
              </button>
              <button
                onClick={() => setInputValue(direction === 'bin2bcd' ? '4096' : '04096')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
              >
                4096
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              {direction === 'bin2bcd'
                ? 'Número a convertir (Decimal o Binario prefijado con "b", ej: 142 o b10001110):'
                : 'Dígitos BCD (hasta 5 dígitos, ej: 00142 o 142):'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setCurrentStep(0);
                }}
                placeholder={direction === 'bin2bcd' ? 'Ej: 142 o b10110' : 'Ej: 00142'}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-sm outline-none transition"
              />
              <button
                onClick={handleCopyTable}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
                title="Copiar tabla en formato Markdown para tu reporte"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado' : 'Copiar Tabla'}</span>
              </button>
            </div>
            {direction === 'bin2bcd' && !parsed.valid && (
              <p className="text-xs text-rose-400">{parsed.error}</p>
            )}
          </div>
        </div>

        {/* Live Result Summary Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Resultado Final
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              16 BITS
            </span>
          </div>

          {direction === 'bin2bcd' && binToBcdResult && (
            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-500 block">DECIMAL:</span>
                <span className="text-xl font-bold text-white">{binToBcdResult.inputDecimal}</span>
              </div>
              <div>
                <span className="text-slate-500 block">BINARIO (16b):</span>
                <span className="text-emerald-400 break-all">{binToBcdResult.inputBinary}</span>
              </div>
              <div>
                <span className="text-slate-500 block">BCD (Dígitos y Nibbles):</span>
                <span className="text-cyan-400 font-bold text-sm block">
                  {binToBcdResult.bcdFormatted}
                </span>
                <span className="text-slate-400 text-xs">
                  Dígitos: <strong className="text-white">{binToBcdResult.bcdString}</strong>
                </span>
              </div>
            </div>
          )}

          {direction === 'bcd2bin' && bcdToBinResult && (
            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-500 block">DÍGITOS BCD:</span>
                <span className="text-xl font-bold text-white">{bcdDigits.join(' ')}</span>
                <span className="text-slate-400 text-xs block">{bcdToBinResult.inputBcdFormatted}</span>
              </div>
              <div>
                <span className="text-slate-500 block">BINARIO CALCULADO (16b):</span>
                <span className="text-emerald-400 break-all">{bcdToBinResult.outputBinary}</span>
              </div>
              <div>
                <span className="text-slate-500 block">DECIMAL OBTENIDO:</span>
                <span className="text-cyan-400 font-bold text-lg">{bcdToBinResult.outputDecimal}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual BCD Register Nibbles Display */}
      {currentStepData && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200">
              Estado de los Registros ({currentStepData.operation} - Ciclo {currentStepData.cycle}/16)
            </h3>
            {currentStepData.adjustmentMade && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                ⚡ {currentStepData.adjustmentMade}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
            {['Decenas de Mil', 'Unidades de Mil', 'Centenas', 'Decenas', 'Unidades'].map((name, idx) => (
              <div
                key={name}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                  {name}
                </span>
                <div className="text-lg font-bold font-mono text-cyan-400">
                  {currentStepData.bcdDigits[idx]}
                </div>
                <div className="text-xs font-mono text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {currentStepData.bcdBinary[idx]}
                </div>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block truncate">
                Reg. Binario
              </span>
              <div className="text-xs font-mono text-slate-200 bg-slate-900 px-1 py-1 rounded break-all">
                {currentStepData.binaryRegister}
              </div>
              <span className="text-[10px] text-slate-500">
                {direction === 'bin2bcd' ? 'Bits restantes' : 'Bits generados'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step Player */}
      {totalSteps > 0 && (
        <StepPlayer
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepChange={setCurrentStep}
          showAll={showAllSteps}
          onToggleShowAll={() => setShowAllSteps(!showAllSteps)}
        />
      )}

      {/* Steps Table */}
      {activeSteps && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Tabla de Procedimiento del Algoritmo Double Dabble
            </h3>
            <span className="text-xs text-slate-400">{activeSteps.length} iteraciones registradas</span>
          </div>

          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Ciclo</th>
                  <th className="py-2.5 px-3">Operación</th>
                  <th className="py-2.5 px-2 text-center text-cyan-400">D. Mil</th>
                  <th className="py-2.5 px-2 text-center text-cyan-400">U. Mil</th>
                  <th className="py-2.5 px-2 text-center text-cyan-400">Centena</th>
                  <th className="py-2.5 px-2 text-center text-cyan-400">Decena</th>
                  <th className="py-2.5 px-2 text-center text-cyan-400">Unidad</th>
                  <th className="py-2.5 px-3 text-indigo-400">Registro Binario</th>
                  <th className="py-2.5 px-3 text-slate-400">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeSteps.map((step, idx) => {
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
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            step.operation.includes('+3')
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : step.operation.includes('-3')
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : step.operation.includes('Desplazamiento')
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {step.operation}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center text-slate-300">{step.bcdBinary[0]}</td>
                      <td className="py-2 px-2 text-center text-slate-300">{step.bcdBinary[1]}</td>
                      <td className="py-2 px-2 text-center text-slate-300">{step.bcdBinary[2]}</td>
                      <td className="py-2 px-2 text-center text-slate-300">{step.bcdBinary[3]}</td>
                      <td className="py-2 px-2 text-center text-slate-300">{step.bcdBinary[4]}</td>
                      <td className="py-2 px-3 font-mono text-emerald-400">{step.binaryRegister}</td>
                      <td className="py-2 px-3 text-[11px] text-slate-400 max-w-xs truncate">
                        {step.adjustmentMade || step.description}
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
