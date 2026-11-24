import React from 'react';

interface RegisterGridProps {
  label: string;
  bits: string;
  sublabel?: string;
  decimalValue?: number | bigint;
  accentColor?: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose';
  showIndices?: boolean;
}

export const RegisterGrid: React.FC<RegisterGridProps> = ({
  label,
  bits,
  sublabel,
  decimalValue,
  accentColor = 'emerald',
  showIndices = true,
}) => {
  const cleanBits = bits.replace(/\s+/g, '');
  const bitArray = cleanBits.split('');
  const totalBits = bitArray.length;

  const colorStyles = {
    emerald: {
      activeBorder: 'border-emerald-500/60',
      activeText: 'text-emerald-400',
      activeBg: 'bg-emerald-950/30',
      tagBg: 'bg-emerald-950/50 text-emerald-300 border-emerald-800',
    },
    cyan: {
      activeBorder: 'border-cyan-500/60',
      activeText: 'text-cyan-400',
      activeBg: 'bg-cyan-950/30',
      tagBg: 'bg-cyan-950/50 text-cyan-300 border-cyan-800',
    },
    amber: {
      activeBorder: 'border-amber-500/60',
      activeText: 'text-amber-400',
      activeBg: 'bg-amber-950/30',
      tagBg: 'bg-amber-950/50 text-amber-300 border-amber-800',
    },
    indigo: {
      activeBorder: 'border-indigo-500/60',
      activeText: 'text-indigo-400',
      activeBg: 'bg-indigo-950/30',
      tagBg: 'bg-indigo-950/50 text-indigo-300 border-indigo-800',
    },
    rose: {
      activeBorder: 'border-rose-500/60',
      activeText: 'text-rose-400',
      activeBg: 'bg-rose-950/30',
      tagBg: 'bg-rose-950/50 text-rose-300 border-rose-800',
    },
  }[accentColor];

  // Group into nibbles of 4 bits from left to right
  const nibbles: { index: number; bit: string; originalIndex: number }[][] = [];
  let currentNibble: { index: number; bit: string; originalIndex: number }[] = [];

  bitArray.forEach((b, i) => {
    const bitPos = totalBits - 1 - i;
    currentNibble.push({ index: bitPos, bit: b, originalIndex: i });
    if ((i + 1) % 4 === 0 || i === bitArray.length - 1) {
      nibbles.push(currentNibble);
      currentNibble = [];
    }
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            {label}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-slate-950 text-slate-400 border-slate-800">
            {totalBits} BITS
          </span>
        </div>

        {decimalValue !== undefined && (
          <div className="text-xs font-mono text-slate-400">
            Valor Dec:{' '}
            <span className="text-white font-bold ml-1">{decimalValue.toString()}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {nibbles.map((nibble, nIdx) => (
          <div key={nIdx} className="flex items-center gap-0.5 bg-slate-950 p-1 rounded border border-slate-800/80">
            {nibble.map((item) => {
              const isOne = item.bit === '1';
              return (
                <div key={item.index} className="flex flex-col items-center">
                  {showIndices && (
                    <span className="text-[9px] font-mono text-slate-500 mb-0.5">
                      {item.index}
                    </span>
                  )}
                  <div
                    className={`w-6 h-7 flex items-center justify-center font-mono text-xs font-bold rounded-sm border transition-colors ${
                      isOne
                        ? `${colorStyles.activeBg} ${colorStyles.activeBorder} ${colorStyles.activeText}`
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {item.bit}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {sublabel && (
        <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
          <span>{sublabel}</span>
        </div>
      )}
    </div>
  );
};
