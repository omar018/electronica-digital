import React, { useState, useMemo } from 'react';
import { signedBoothMultiply, unsignedBoothMultiply } from '../engine/booth';
import { parseInput } from '../engine/utils';
import { StepPlayer } from './StepPlayer';
import { RegisterGrid } from './RegisterGrid';
import { AcademicReportModal } from './AcademicReportModal';
import { FileText, RotateCcw } from 'lucide-react';

export const BoothView: React.FC = () => {
  const [isSigned, setIsSigned] = useState<boolean>(true);
  const [inputM, setInputM] = useState<string>('11');
  const [inputQ, setInputQ] = useState<string>('-7');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(true);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

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

  // LaTeX & ASCII Generator
  const { latexCode, asciiReport } = useMemo(() => {
    if (!steps.length || !result) return { latexCode: '', asciiReport: '' };

    let latex = `% ---------------------------------------------------------\n`;
    latex += `% Universidad Nacional de Colombia - Sede Medellín\n`;
    latex += `% Facultad de Minas\n`;
    latex += `% Docentes: Daniel González Montoya (Teoría) | Amado Ospina Montoya (Práctica)\n`;
    latex += `% Algoritmo de Multiplicación de Booth (${isSigned ? 'Con Signo' : 'Sin Signo'})\n`;
    latex += `% Multiplicando M = ${inputM} (${result.multiplicandBin})\n`;
    latex += `% Multiplicador Q = ${inputQ} (${result.multiplierBin})\n`;
    latex += `% ---------------------------------------------------------\n\n`;
    latex += `\\begin{table}[htbp]\n\\centering\n\\small\n`;
    latex += `\\caption{Traza de ejecución de la multiplicación de Booth: $${inputM} \\times ${inputQ} = ${result.productDec}$}\n`;
    latex += `\\begin{tabular}{r c c c c l}\n`;
    latex += `\\toprule\n`;
    latex += `\\textbf{Cuenta} & \\textbf{$Q_0$} & \\textbf{${isSigned ? '$Q_{-1}$' : '$C_f$'}} & \\textbf{AL (Registro A)} & \\textbf{DL (Registro Q)} & \\textbf{Operación} \\\\\n`;
    latex += `\\midrule\n`;
    steps.forEach((s) => {
      const extra = isSigned ? s.Q_prev : s.Cf;
      latex += `${s.cycle} & ${s.Q[15]} & ${extra} & \\texttt{${s.A}} & \\texttt{${s.Q}} & ${s.operation} \\\\\n`;
    });
    latex += `\\bottomrule\n\\end{tabular}\n\\end{table}\n`;

    let ascii = `UNIVERSIDAD NACIONAL DE COLOMBIA - SEDE MEDELLÍN - FACULTAD DE MINAS\n`;
    ascii += `DOCENTES: Daniel González Montoya (Teoría) | Amado Ospina Montoya (Práctica)\n`;
    ascii += `ALGORITMO DE BOOTH (${isSigned ? 'CON SIGNO - COMPLEMENTO A 2' : 'SIN SIGNO - SHIFT-ADD'})\n`;
    ascii += `Multiplicando (M): ${inputM} [${result.multiplicandBin}]\n`;
    ascii += `Multiplicador (Q): ${inputQ} [${result.multiplierBin}]\n`;
    ascii += `Producto 32b: ${result.productBin} | Decimal: ${result.productDec}\n`;
    ascii += `--------------------------------------------------------------------------------------------------\n`;
    ascii += `| Cuenta | Q_0 | ${isSigned ? 'Q_-1' : 'C_f '} | AL (Registro A)   | DL (Registro Q)   | Operacion |\n`;
    ascii += `--------------------------------------------------------------------------------------------------\n`;
    steps.forEach((s) => {
      const extra = isSigned ? s.Q_prev : s.Cf;
      ascii += `| ${String(s.cycle).padStart(6, ' ')} |  ${s.Q[15]}  |   ${extra}  | ${s.A} | ${s.Q} | ${s.operation.padEnd(25, ' ')} |\n`;
    });
    ascii += `--------------------------------------------------------------------------------------------------\n`;

    return { latexCode: latex, asciiReport: ascii };
  }, [steps, result, isSigned, inputM, inputQ]);

  return (
    <div className="space-y-4">
      {/* Parameters Workbench */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-slate-400">Régimen Aritmético:</span>
            <div className="inline-flex rounded border border-slate-800 bg-slate-950 p-0.5 text-xs font-mono">
              <button
                onClick={() => {
                  setIsSigned(true);
                  setInputM('11');
                  setInputQ('-7');
                  setCurrentStep(0);
                }}
                className={`px-3 py-1 rounded transition ${
                  isSigned
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Con Signo (Booth en Complemento a Dos)
              </button>
              <button
                onClick={() => {
                  setIsSigned(false);
                  setInputM('23');
                  setInputQ('3');
                  setCurrentStep(0);
                }}
                className={`px-3 py-1 rounded transition ${
                  !isSigned
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sin Signo (Shift-Add con Carry)
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
              Multiplicando M (Fijo, 16 bits):
            </label>
            <input
              type="text"
              value={inputM}
              onChange={(e) => {
                setInputM(e.target.value);
                setCurrentStep(0);
              }}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-1.5 font-mono text-xs text-white outline-none"
            />
            {parsedM.valid && (
              <div className="text-[11px] font-mono text-slate-400">
                DEC: <span className="text-white font-bold">{parsedM.dec}</span> | BIN:{' '}
                <span className="text-emerald-400">{parsedM.bin}</span>
              </div>
            )}
            {!parsedM.valid && <p className="text-[11px] font-mono text-rose-400">{parsedM.error}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-300">
              Multiplicador Q (Inicial en DL, 16 bits):
            </label>
            <input
              type="text"
              value={inputQ}
              onChange={(e) => {
                setInputQ(e.target.value);
                setCurrentStep(0);
              }}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-1.5 font-mono text-xs text-white outline-none"
            />
            {parsedQ.valid && (
              <div className="text-[11px] font-mono text-slate-400">
                DEC: <span className="text-white font-bold">{parsedQ.dec}</span> | BIN:{' '}
                <span className="text-emerald-400">{parsedQ.bin}</span>
              </div>
            )}
            {!parsedQ.valid && <p className="text-[11px] font-mono text-rose-400">{parsedQ.error}</p>}
          </div>

          {/* Preset Buttons & Result */}
          <div className="bg-slate-950 border border-slate-800 rounded p-2.5 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
              <span>Producto Calculado (32 bits)</span>
              <button
                onClick={() => {
                  if (isSigned) {
                    setInputM('11');
                    setInputQ('-7');
                  } else {
                    setInputM('23');
                    setInputQ('3');
                  }
                  setCurrentStep(0);
                }}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 lowercase"
              >
                <RotateCcw className="w-2.5 h-2.5" /> caso vídeo
              </button>
            </div>
            {result && (
              <>
                <div className="text-slate-300 text-sm">
                  PRODUCTO DEC: <span className="text-white font-bold">{result.productDec.toString()}</span>
                </div>
                <div className="text-[10px] text-emerald-400 break-all font-mono">
                  {result.productBin.slice(0, 16)} {result.productBin.slice(16)}
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
                Estado del Datapath • Cuenta {String(currentStepData.cycle).padStart(2, '0')}/16
              </span>
              <span className="text-slate-400">({currentStepData.operation})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">
                Q₀: <strong className="text-emerald-400">{currentStepData.Q[15]}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">
                {isSigned ? 'Q₋₁' : 'C_f'}:{' '}
                <strong className="text-emerald-400">
                  {isSigned ? currentStepData.Q_prev : currentStepData.Cf}
                </strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <RegisterGrid
              label="Registro AL (Acumulador A)"
              bits={currentStepData.A}
              decimalValue={currentStepData.A_dec}
              sublabel="Parte alta del producto en proceso"
              accentColor="emerald"
            />
            <RegisterGrid
              label="Registro DL (Multiplicador Q)"
              bits={currentStepData.Q}
              decimalValue={currentStepData.Q_dec}
              sublabel="Parte baja del producto en proceso"
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
              Tabla de Procedimiento de Booth (Secuencia de 16 Ciclos de Reloj)
            </span>
            <span className="text-slate-500 text-[11px]">Ref: Amado Ospina Montoya</span>
          </div>

          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2 px-3 border-r border-slate-800 w-16 text-center">Cuenta</th>
                  <th className="py-2 px-3 border-r border-slate-800 w-12 text-center">Q₀</th>
                  <th className="py-2 px-3 border-r border-slate-800 w-12 text-center">
                    {isSigned ? 'Q₋₁' : 'C_f'}
                  </th>
                  <th className="py-2 px-3 border-r border-slate-800 text-emerald-400">
                    AL (Registro A - 16b)
                  </th>
                  <th className="py-2 px-3 border-r border-slate-800 text-indigo-400">
                    DL (Registro Q - 16b)
                  </th>
                  <th className="py-2 px-3">Operación en ALU & Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-[11px]">
                {steps.map((step, idx) => {
                  const isCurrent = idx === currentStep;
                  if (!showAllSteps && !isCurrent) return null;

                  const q0 = step.Q[15];
                  const extra = isSigned ? step.Q_prev : step.Cf;

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
                      <td className="py-1.5 px-3 border-r border-slate-800 text-center text-white font-bold">
                        {q0}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-800 text-center text-white font-bold">
                        {extra}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-800 text-emerald-400 font-mono tracking-wider">
                        {step.A}
                      </td>
                      <td className="py-1.5 px-3 border-r border-slate-800 text-indigo-400 font-mono tracking-wider">
                        {step.Q}
                      </td>
                      <td className="py-1.5 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            step.operation.includes('A - M')
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : step.operation.includes('A + M')
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'text-slate-400'
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

      {/* Academic LaTeX Modal */}
      <AcademicReportModal
        title="Informe de Laboratorio - Multiplicación de Booth"
        algorithmName={`Algoritmo de Booth (${isSigned ? 'Con Signo (Complemento a 2)' : 'Sin Signo'})`}
        inputsDescription={`M = ${inputM} (${result?.multiplicandBin}) | Q = ${inputQ} (${result?.multiplierBin})`}
        resultsDescription={`Producto: ${result?.productDec} (32b: ${result?.productBin})`}
        latexCode={latexCode}
        asciiReport={asciiReport}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
