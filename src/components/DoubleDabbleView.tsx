import React, { useState, useMemo } from 'react';
import { binaryToBcdDoubleDabble, bcdToBinaryDoubleDabble } from '../engine/doubleDabble';
import { parseInput } from '../engine/utils';
import { StepPlayer } from './StepPlayer';
import { RegisterGrid } from './RegisterGrid';
import { AcademicReportModal } from './AcademicReportModal';
import { FileText, RotateCcw } from 'lucide-react';

export const DoubleDabbleView: React.FC = () => {
  const [direction, setDirection] = useState<'bin2bcd' | 'bcd2bin'>('bin2bcd');
  const [inputValue, setInputValue] = useState<string>('142');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(true);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Parsing & Calculation for Bin -> BCD
  const parsed = useMemo(() => parseInput(inputValue, false), [inputValue]);

  const binToBcdResult = useMemo(() => {
    if (!parsed.valid) return null;
    return binaryToBcdDoubleDabble(parsed.dec);
  }, [parsed]);

  // Parsing & Calculation for BCD -> Bin
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

  // LaTeX & ASCII Generator
  const { latexCode, asciiReport } = useMemo(() => {
    if (!activeSteps) return { latexCode: '', asciiReport: '' };

    let latex = `% ---------------------------------------------------------\n`;
    latex += `% Universidad Nacional de Colombia - Sede Medellín\n`;
    latex += `% Facultad de Minas\n`;
    latex += `% Docentes: Daniel González Montoya (Teoría) | Amado Ospina Montoya (Práctica)\n`;
    latex += `% Algoritmo Double Dabble (${direction === 'bin2bcd' ? 'Binario a BCD' : 'BCD a Binario'})\n`;
    latex += `% Entrada: ${inputValue}\n`;
    latex += `% ---------------------------------------------------------\n\n`;
    latex += `\\begin{table}[htbp]\n\\centering\n\\small\n`;
    latex += `\\caption{Traza de ejecución del algoritmo Double Dabble para valor $${inputValue}$}\n`;
    latex += `\\begin{tabular}{r l c c c c c l l}\n`;
    latex += `\\toprule\n`;
    latex += `\\textbf{Ciclo} & \\textbf{Operación} & \\textbf{D. Mil} & \\textbf{U. Mil} & \\textbf{Centena} & \\textbf{Decena} & \\textbf{Unidad} & \\textbf{Reg. Binario} & \\textbf{Ajuste} \\\\\n`;
    latex += `\\midrule\n`;
    activeSteps.forEach((s) => {
      latex += `${s.cycle} & ${s.operation} & ${s.bcdBinary[0]} & ${s.bcdBinary[1]} & ${s.bcdBinary[2]} & ${s.bcdBinary[3]} & ${s.bcdBinary[4]} & \\texttt{${s.binaryRegister}} & ${s.adjustmentMade || '--'} \\\\\n`;
    });
    latex += `\\bottomrule\n\\end{tabular}\n\\end{table}\n`;

    let ascii = `UNIVERSIDAD NACIONAL DE COLOMBIA - SEDE MEDELLÍN - FACULTAD DE MINAS\n`;
    ascii += `DOCENTES: Daniel González Montoya (Teoría) | Amado Ospina Montoya (Práctica)\n`;
    ascii += `ALGORITMO: Double Dabble (${direction === 'bin2bcd' ? 'Binario a BCD' : 'BCD a Binario'})\n`;
    ascii += `ENTRADA: ${inputValue}\n`;
    ascii += `--------------------------------------------------------------------------------------------------------\n`;
    ascii += `Ciclo | Operacion           | D_Mil | U_Mil | Cent. | Dec.  | Unid. | Registro Binario | Ajuste\n`;
    ascii += `--------------------------------------------------------------------------------------------------------\n`;
    activeSteps.forEach((s) => {
      const op = s.operation.padEnd(19, ' ');
      ascii += `${String(s.cycle).padStart(5, ' ')} | ${op} | ${s.bcdBinary[0]}  | ${s.bcdBinary[1]}  | ${s.bcdBinary[2]}  | ${s.bcdBinary[3]}  | ${s.bcdBinary[4]}  | ${s.binaryRegister} | ${s.adjustmentMade || ''}\n`;
    });
    ascii += `--------------------------------------------------------------------------------------------------------\n`;

    return { latexCode: latex, asciiReport: ascii };
  }, [activeSteps, direction, inputValue]);

  return (
    <div className="space-y-4">
      {/* Parameters Workbench */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-slate-400">Modalidad Operativa:</span>
            <div className="inline-flex rounded border border-slate-800 bg-slate-950 p-0.5 text-xs font-mono">
              <button
                onClick={() => {
                  setDirection('bin2bcd');
                  setInputValue('142');
                  setCurrentStep(0);
                }}
                className={`px-3 py-1 rounded transition ${
                  direction === 'bin2bcd'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Binario / Decimal → BCD (Shift-Add-3)
              </button>
              <button
                onClick={() => {
                  setDirection('bcd2bin');
                  setInputValue('00142');
                  setCurrentStep(0);
                }}
                className={`px-3 py-1 rounded transition ${
                  direction === 'bcd2bin'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BCD → Binario Inverso (Shift-Subtract-3)
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
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-mono text-slate-300">
              {direction === 'bin2bcd'
                ? 'Vector de entrada (Formato decimal [0..65535] o binario con prefijo "b", ej: 142 o b10001110):'
                : 'Cadena BCD (Hasta 5 dígitos BCD, ej: 00142):'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setCurrentStep(0);
                }}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded px-3 py-1.5 font-mono text-xs text-white outline-none"
              />
              <button
                onClick={() => setInputValue(direction === 'bin2bcd' ? '142' : '00142')}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono flex items-center gap-1"
                title="Cargar caso del vídeo (142)"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Caso Vídeo (142)</span>
              </button>
            </div>
            {direction === 'bin2bcd' && !parsed.valid && (
              <p className="text-[11px] font-mono text-rose-400">{parsed.error}</p>
            )}
          </div>

          {/* Synthesis Card */}
          <div className="bg-slate-950 border border-slate-800 rounded p-2.5 font-mono text-xs space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500">Resumen de Conversión</div>
            {direction === 'bin2bcd' && binToBcdResult && (
              <>
                <div className="text-slate-300">
                  DEC: <span className="text-white font-bold">{binToBcdResult.inputDecimal}</span> | BIN:{' '}
                  <span className="text-emerald-400">{binToBcdResult.inputBinary}</span>
                </div>
                <div className="text-slate-300">
                  BCD: <span className="text-emerald-300 font-bold">{binToBcdResult.bcdFormatted}</span> (
                  <span className="text-white">{binToBcdResult.bcdString}</span>)
                </div>
              </>
            )}
            {direction === 'bcd2bin' && bcdToBinResult && (
              <>
                <div className="text-slate-300">
                  Dígitos BCD: <span className="text-white font-bold">{bcdDigits.join(' ')}</span>
                </div>
                <div className="text-slate-300">
                  BIN: <span className="text-emerald-400">{bcdToBinResult.outputBinary}</span> | DEC:{' '}
                  <span className="text-emerald-300 font-bold">{bcdToBinResult.outputDecimal}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hardware Bus and Register Display at Current Step */}
      {currentStepData && (
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-xs"></span>
              <span className="text-slate-300 font-bold uppercase">
                Estado Físico de Registros • Ciclo {String(currentStepData.cycle).padStart(2, '0')}/16
              </span>
              <span className="text-slate-500">({currentStepData.operation})</span>
            </div>
            {currentStepData.adjustmentMade && (
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[11px]">
                Ajuste BCD: {currentStepData.adjustmentMade}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 font-mono">
            {['Decenas de Mil', 'Unidades de Mil', 'Centenas', 'Decenas', 'Unidades'].map((name, idx) => (
              <div key={name} className="bg-slate-900 border border-slate-800 rounded p-2.5 text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold truncate">
                  {name}
                </span>
                <div className="text-xl font-bold text-white my-0.5">
                  {currentStepData.bcdDigits[idx]}
                </div>
                <div className="text-[11px] text-emerald-400 bg-slate-950 py-0.5 px-1 rounded border border-slate-800">
                  {currentStepData.bcdBinary[idx]}
                </div>
              </div>
            ))}

            <div className="bg-slate-900 border border-slate-800 rounded p-2.5 text-center">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold truncate">
                Reg. Desplazamiento
              </span>
              <div className="text-xs text-emerald-400 bg-slate-950 py-1.5 px-1 rounded border border-slate-800 mt-2 break-all">
                {currentStepData.binaryRegister}
              </div>
            </div>
          </div>

          {/* Hardware Register Flip-Flop Component */}
          <RegisterGrid
            label={direction === 'bin2bcd' ? 'Registro de Entrada / Shift Register' : 'Registro Reconstituido'}
            bits={currentStepData.binaryRegister}
            sublabel={currentStepData.description}
            accentColor="emerald"
          />
        </div>
      )}

      {/* Clock Stepper Controls */}
      {totalSteps > 0 && (
        <StepPlayer
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepChange={setCurrentStep}
          showAll={showAllSteps}
          onToggleShowAll={() => setShowAllSteps(!showAllSteps)}
        />
      )}

      {/* Execution Trace Table */}
      {activeSteps && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-slate-300 uppercase">
              Tabla de Estados y Transición de Registros ({activeSteps.length} Pasos Registrados)
            </span>
            <span className="text-slate-500 text-[11px]">Norma IEEE / U. Nacional</span>
          </div>

          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2 px-3 border-r border-slate-800 w-12 text-center">Ciclo</th>
                  <th className="py-2 px-3 border-r border-slate-800">Operación Realizada</th>
                  <th className="py-2 px-2 border-r border-slate-800 text-center">D. Mil</th>
                  <th className="py-2 px-2 border-r border-slate-800 text-center">U. Mil</th>
                  <th className="py-2 px-2 border-r border-slate-800 text-center">Centena</th>
                  <th className="py-2 px-2 border-r border-slate-800 text-center">Decena</th>
                  <th className="py-2 px-2 border-r border-slate-800 text-center">Unidad</th>
                  <th className="py-2 px-3 border-r border-slate-800 text-emerald-400">Registro Binario (16b)</th>
                  <th className="py-2 px-3 text-slate-400">Detalle de Transición</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-[11px]">
                {activeSteps.map((step, idx) => {
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
                      <td className="py-1.5 px-3 border-r border-slate-800 font-medium">
                        {step.operation}
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-800 text-center">{step.bcdBinary[0]}</td>
                      <td className="py-1.5 px-2 border-r border-slate-800 text-center">{step.bcdBinary[1]}</td>
                      <td className="py-1.5 px-2 border-r border-slate-800 text-center">{step.bcdBinary[2]}</td>
                      <td className="py-1.5 px-2 border-r border-slate-800 text-center">{step.bcdBinary[3]}</td>
                      <td className="py-1.5 px-2 border-r border-slate-800 text-center">{step.bcdBinary[4]}</td>
                      <td className="py-1.5 px-3 border-r border-slate-800 text-emerald-400 font-mono">
                        {step.binaryRegister}
                      </td>
                      <td className="py-1.5 px-3 text-slate-400 truncate max-w-xs">
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

      {/* Academic LaTeX Modal */}
      <AcademicReportModal
        title="Informe de Laboratorio - Double Dabble"
        algorithmName={`Double Dabble (${direction === 'bin2bcd' ? 'Binario a BCD' : 'BCD a Binario Inverso'})`}
        inputsDescription={`Entrada: ${inputValue}`}
        resultsDescription={
          direction === 'bin2bcd'
            ? `BCD: ${binToBcdResult?.bcdFormatted} (${binToBcdResult?.bcdString})`
            : `Decimal: ${bcdToBinResult?.outputDecimal} | Binario: ${bcdToBinResult?.outputBinary}`
        }
        latexCode={latexCode}
        asciiReport={asciiReport}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
