import { useState } from 'react';
import { Header } from './components/Header';
import { DoubleDabbleView } from './components/DoubleDabbleView';
import { BoothView } from './components/BoothView';
import { DivisionView } from './components/DivisionView';
import { GuideView } from './components/GuideView';
import { Binary, Layers, Divide, BookOpen, GraduationCap } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'doubledabble' | 'booth' | 'division' | 'guide'>('doubledabble');

  const navItems = [
    {
      id: 'doubledabble',
      label: 'Double Dabble (BCD)',
      icon: Binary,
      description: 'Binario ↔ BCD (16 bits)',
      color: 'text-cyan-400',
      activeBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'booth',
      label: 'Booth (Multiplicación)',
      icon: Layers,
      description: 'Con y Sin Signo (32 bits)',
      color: 'text-indigo-400',
      activeBg: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
    },
    {
      id: 'division',
      label: 'División Binaria',
      icon: Divide,
      description: 'Restoring & Non-Restoring',
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'guide',
      label: 'Teoría y Vídeos',
      icon: BookOpen,
      description: 'Fundamentos y Referencias',
      color: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-200 flex items-start gap-3 ${
                  isActive
                    ? item.activeBg + ' shadow-lg'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    isActive ? 'bg-slate-950/60 shadow-inner' : 'bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight text-white">{item.label}</div>
                  <div className="text-[11px] text-slate-400">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <div className="transition-opacity duration-300">
          {activeTab === 'doubledabble' && <DoubleDabbleView />}
          {activeTab === 'booth' && <BoothView />}
          {activeTab === 'division' && <DivisionView />}
          {activeTab === 'guide' && <GuideView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>
              Proyecto de Laboratorio de Electrónica Digital & Arquitectura • Universidad Nacional de Colombia
            </span>
          </div>
          <div>Profesor: Amado Ospina Montoya • Procesamiento de hasta 16 bits</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
