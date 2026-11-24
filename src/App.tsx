import { useState } from 'react';
import { Header } from './components/Header';
import { DoubleDabbleView } from './components/DoubleDabbleView';
import { BoothView } from './components/BoothView';
import { DivisionView } from './components/DivisionView';
import { GuideView } from './components/GuideView';
import { Binary, Layers, Divide, BookOpen } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'doubledabble' | 'booth' | 'division' | 'guide'>('doubledabble');

  const navItems = [
    {
      id: 'doubledabble',
      label: 'MÓDULO 1: DOUBLE DABBLE',
      icon: Binary,
      description: 'Conversor BCD / Binario (16b)',
    },
    {
      id: 'booth',
      label: 'MÓDULO 2: MULTIPLICACIÓN DE BOOTH',
      icon: Layers,
      description: 'Aritmética Signed/Unsigned (32b)',
    },
    {
      id: 'division',
      label: 'MÓDULO 3: DIVISIÓN BINARIA',
      icon: Divide,
      description: 'Restoring & Non-Restoring (16b)',
    },
    {
      id: 'guide',
      label: 'MÓDULO 4: MARCO TEÓRICO',
      icon: BookOpen,
      description: 'Fundamentos y Referencias UNAL',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {/* Laboratory Instrumentation Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-3 rounded-lg text-left border transition-all duration-150 flex items-center gap-3 ${
                  isActive
                    ? 'bg-slate-900 border-emerald-600 text-white shadow-xs'
                    : 'bg-slate-950/80 border-slate-800 hover:bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-2 rounded border ${
                    isActive
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-mono">
                  <div
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Workbench */}
        <div className="mt-2">
          {activeTab === 'doubledabble' && <DoubleDabbleView />}
          {activeTab === 'booth' && <BoothView />}
          {activeTab === 'division' && <DivisionView />}
          {activeTab === 'guide' && <GuideView />}
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 mt-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            Universidad Nacional de Colombia • Sede Medellín • <span className="text-emerald-400 font-semibold">Facultad de Minas</span>
          </div>
          <div className="text-slate-400">
            Docentes: <span className="text-slate-200">Daniel González Montoya (Teoría)</span> • <span className="text-slate-200">Amado Ospina Montoya (Práctica)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
