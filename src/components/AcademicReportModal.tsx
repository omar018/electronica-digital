import React, { useState } from 'react';
import { Copy, Check, Printer, FileText, X } from 'lucide-react';

interface AcademicReportModalProps {
  title: string;
  algorithmName: string;
  inputsDescription: string;
  resultsDescription: string;
  latexCode: string;
  asciiReport: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicReportModal: React.FC<AcademicReportModalProps> = ({
  title,
  algorithmName,
  inputsDescription,
  resultsDescription,
  latexCode,
  asciiReport,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'latex' | 'ascii'>('latex');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const textToCopy = activeTab === 'latex' ? latexCode : asciiReport;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <div className="text-slate-400">
              <span className="text-emerald-400 font-bold">ALGORITMO:</span> {algorithmName}
            </div>
            <div className="text-slate-400">
              <span className="text-emerald-400 font-bold">PARÁMETROS:</span> {inputsDescription}
            </div>
            <div className="text-slate-400">
              <span className="text-emerald-400 font-bold">RESULTADO:</span> {resultsDescription}
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('latex')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === 'latex'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Código LaTeX (\begin&#123;tabular&#125;)
              </button>
              <button
                onClick={() => setActiveTab('ascii')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === 'ascii'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Informe Texto Plano / Markdown
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado al Portapapeles' : 'Copiar al Portapapeles'}</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={activeTab === 'latex' ? latexCode : asciiReport}
              rows={16}
              className="w-full bg-slate-950 border border-slate-800 rounded p-4 font-mono text-xs text-slate-300 leading-relaxed outline-none select-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Universidad Nacional de Colombia • Facultad de Ingeniería</span>
          <span>Docente: Ing. Amado Ospina Montoya</span>
        </div>
      </div>
    </div>
  );
};
