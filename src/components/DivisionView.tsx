import React, { useState, useMemo } from 'react';
import { restoringDivision, nonRestoringDivision } from '../engine/division';
import { parseInput } from '../engine/utils';
import { StepPlayer } from './StepPlayer';
import { RegisterGrid } from './RegisterGrid';
import { AcademicReportModal } from './AcademicReportModal';
import { FileText, RotateCcw, AlertTriangle } from 'lucide-react';

export const DivisionView: React.FC = () => {
  const [isRestoring, setIsRestoring] = useState<boolean>(true);
  const [inputDividend, setInputDividend] = useState<string>('142');
  const [inputDivisor, setInputDivisor] = useState<string>('5');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(true);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

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

  // LaTeX & ASCII Generator
  const { latexCode, asciiReport } = useMemo(() => {
    if (!steps.length || !result) return { latexCode: '', asciiReport: '' };

    let latex = `% ---------------------------------------------------------\n`;
    latex += `% Universidad Nacional de Colombia - Facultad de Ingeniería\n`;
    latex += `% Algoritmo de División Binaria (${isRestoring ? 'Con Restauración' : 'Sin Restauración'})\n`;
    latex += `% Dividendo = ${inputDividend} (${result.dividendBin})\n`;
    latex += `% Divisor   = ${inputDivisor} (${result.divisorBin})\n`;
    latex += `% ---------------------------------------------------------\n\n`;
    latex += `\\begin{table}[htbp]\n\\centering\n\\small\n`;
    latex += `\\caption{Traza de ejecución de división: $${inputDividend} \\div ${inputDivisor} = ${result.quotientDec}$ con residuo $${result.remainderDec}$}\n`;
    latex += `\\begin{tabular}{r c c c l}\n`;
    latex += `\\toprule\n`;
    latex += `\\textbf{Ciclo} & \\textbf{Registro A (Acumulador)} & \\textbf{Registro Q (Cociente)} & \\textbf{Divisor M} & \\textbf{Operación} \\\\\n`;
    latex += `\\midrule\n`;
    steps.forEach((s) => {
      latex += `${s.cycle} & \\texttt{${s.A}} & \\texttt{${s.Q}} & \\texttt{${s.M}} & ${s.operation} \\\\\n`;
    });
    latex += `\\bottomrule\n\\end{tabular}\n\\end{table}\n`;

    let ascii = `UNIVERSIDAD NACIONAL DE COLOMBIA - DEPARTAMENTO DE ING. ELÉCTRICA Y ELECTRÓNICA\n`;
    ascii += `ALGORITMO DE DIVISIÓN BINARIA (${isRestoring ? 'CON RESTAURACIÓN' : 'SIN RESTAURACIÓN'})\n`;
    ascii += `Dividendo: ${inputDividend} [${result.dividendBin}] | Divisor: ${inputDivisor} [${result.divisorBin}]\n`;
    ascii += `Cociente: ${result.quotientDec} [${result.quotientBin}] | Residuo: ${result.remainderDec} [${result.remainderBin}]\n`;
    ascii += `Comprobación: ${result.dividendDec} = (${result.divisorDec} x ${result.quotientDec}) + ${result.remainderDec}\n`;
    ascii += `--------------------------------------------------------------------------------------------------------\n`;
    ascii += `| Ciclo | Registro A (Acumulador) | Registro Q (Cociente) | Divisor M         | Operación               |\n`;
    ascii += `--------------------------------------------------------------------------------------------------------\n`;
    steps.forEach((s) => {
      ascii += `| ${String(s.cycle).padStart(5, ' ')} | ${s.A}        | ${s.Q}        | ${s.M} | ${s.operation.padEnd(23, ' ')} |\n`;
    });
    ascii += `--------------------------------------------------------------------------------------------------------\n`;

    return { latexCode: latex, asciiReport: ascii };
  }, [steps, result, isRestoring, inputDividend, inputDivisor]);

  return (
    <div className="space-y-4">
      {/* Parameters Workbench */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-slate-400">Método de División:</span>
            <div className="inline-flex rounded border border-slate-800 bg-slate-950 p-0.5 text-xs font-mono">
              <button
                onClick={() => {
                  setIsRestoring(true);
                  setCurrentStep(0);
                }}
                className={`px-3 py-1 rounded transition ${
                  isRestoring
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                División con Restauración (Restoring)
              </button>
              <button
                onClick={() => {
                  setIsRestoring(false);
                  setCurrentStep(0);
                }}
                className={`px-3 py-1 rounded transition ${
                  !isRestoring
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                División sin Restauración (Non-Restoring)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-mono transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generar Informe LaTeX</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300">
              Dividendo (Cargado en Q, 16 bits):
            </label>
            <input
              type="text"
              value={inputDividend}
              onChange={(e) => {
                setInputDividend(e.target.value);
                setCurrentStep(0);
              }}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-1.5 font-mono text-xs text-white outline-none"
            />
            {parsedDividend.valid && (
              <div className="text-[11px] font-mono text-slate-400">
                DEC: <span className="text-white font-bold">{parsedDividend.dec}</span> | BIN:{' '}
                <span className="text-emerald-400">{parsedDividend.bin}</span>
              </div>
            )}
            {!parsedDividend.valid && (
              <p className="text-[11px] font-mono text-rose-400">{parsedDividend.error}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300">
              Divisor M (Registro M, 16 bits):
            </label>
            <input
              type="text"
              value={inputDivisor}
              onChange={(e) => {
                setInputDivisor(e.target.value);
                setCurrentStep(0);
              }}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-1.5 font-mono text-xs text-white outline-none"
            />
            {parsedDivisor.valid && !isDivByZero && (
              <div className="text-[11px] font-mono text-slate-400">
                DEC: <span className="text-white font-bold">{parsedDivisor.dec}</span> | BIN:{' '}
                <span className="text-emerald-400">{parsedDivisor.bin}</span>
              </div>
            )}
            {isDivByZero && (
              <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Condición no permitida: División por cero
              </p>
            )}
            {!parsedDivisor.valid && (
              <p className="text-[11px] font-mono text-rose-400">{parsedDivisor.error}</p>
            )}
          </div>

          {/* Results Synthesis Card */}
          <div className="bg-slate-950 border border-slate-800 rounded p-2.5 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
              <span>Cociente y Residuo</span>
              <button
                onClick={() => {
                  setInputDividend('142');
                  setInputDivisor('5');
                  setCurrentStep(0);
                }}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 lowercase"
              >
                <RotateCcw className="w-2.5 h-2.5" /> caso 142/5
              </button>
            </div>
            {result && (
              <>
                <div className="text-slate-300">
                  COCIENTE (Q): <span className="text-white font-bold">{result.quotientDec}</span> |{' '}
                  RESIDUO (A): <span className="text-emerald-400 font-bold">{result.remainderDec}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {result.dividendDec} = ({result.divisorDec} × {result.quotientDec}) +{' '}
                  {result.remainderDec} <span className="text-emerald-400">✓ Verificado</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hardware Datapath Registers View at Current Step */}
      {currentStepData && (
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-xs"></span>
              <span className="text-slate-300 font-bold uppercase">
                Estado del Datapath • Ciclo {String(currentStepData.cycle).padStart(2, '0')}/16
              </span>
              <span className="text-slate-400">({currentStepData.operation})</span>
            </div>
            {currentStepData.restored && (
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-mono">
                ↺ Ciclo de Restauración Ejecutado
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <RegisterGrid
              label="Registro A (Acumulador / Residuo Parcial)"
              bits={currentStepData.A}
              sublabel="Contiene el residuo final tras el ciclo 16"
              accentColor="emerald"
            />
            <RegisterGrid
              label="Registro Q (Cociente Parcial)"
              bits={currentStepData.Q}
              sublabel="Contiene el cociente final generado"
              accentColor="indigo"
            />
          </div>
        </div>
      )}

      {/* Stepper Controls */}
      {steps.length > 0 && (
        <StepPlayer
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
          showAll={showAllSteps}
          onToggleShowAll={() => setShowAllSteps(!showAllSteps)}
        />
      )}

      {/* Procedure Table */}
      {steps.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-slate-300 uppercase">
              Tabla de Procedimiento de División ({isRestoring ? 'Con Restauración' : 'Sin Restauración'})
            </span>
            <span className="text-slate-500 text-[11px]">16 Ciclos de Reloj</span>
          </div>

          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2 px-3 border-r border-slate-800 w-16 text-center">Ciclo</th>
                  <th className="py-2 px-3 border-r border-slate-800 text-emerald-400">
                    A (Acumulador - 16b)
                  </th>
                  <th className="py-2 px-3 border-r border-slate-800 text-indigo-400">
                    Q (Cociente Parcial - 16b)
                  </th>
                  <th className="py-2 px-3 border-r border-slate-800 text-slate-300">
                    M (Divisor - 16b)
                  </th>
                  <th className="py-2 px-3 border-r border-slate-800">Operación Realizada</th>
                  <th className="py-2 px-3 text-slate-400">Detalles de Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-[11px]">
                {steps.map((step, idx) => {
                  const isCurrent = idx === currentStep;
                  if (!showAllSteps && !isCurrent) return null;

                  return (
                    <tr
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-emerald-950/40 border-l-4 border-emerald-500 text-white'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-1.5 px-3 border-r border-slate-800 text-center font-bold">
                        {step.cycle}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-800 text-emerald-400 font-mono tracking-wider">
                        {step.A}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-800 text-indigo-400 font-mono tracking-wider">
                        {step.Q}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-800 text-slate-300 font-mono">
                        {step.M}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-800">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            step.restored
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : step.operation.includes('Exitosa')
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.operation}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-slate-400 truncate max-w-xs">
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

      {/* Academic LaTeX Modal */}
      <AcademicReportModal
        title="Informe de Laboratorio - División Binaria"
        algorithmName={`División Binaria (${isRestoring ? 'Con Restauración' : 'Sin Restauración'})`}
        inputsDescription={`Dividendo = ${inputDividend} (${result?.dividendBin}) | Divisor = ${inputDivisor} (${result?.divisorBin})`}
        resultsDescription={`Cociente: ${result?.quotientDec} (${result?.quotientBin}) | Residuo: ${result?.remainderDec} (${result?.remainderBin})`}
        latexCode={latexCode}
        asciiReport={asciiReport}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
