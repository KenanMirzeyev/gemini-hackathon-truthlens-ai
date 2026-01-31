
import React from 'react';

interface BSGaugeProps {
  score: number;
}

const BSGauge: React.FC<BSGaugeProps> = ({ score }) => {
  const radius = 90;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  const getLabel = (s: number) => {
    if (s < 20) return { text: "LEGIT", color: "text-green-400" };
    if (s < 50) return { text: "SUSPECT", color: "text-yellow-400" };
    if (s < 80) return { text: "PURE HYPE", color: "text-orange-500" };
    return { text: "TOTAL BS", color: "text-red-500" };
  };

  const label = getLabel(score);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800 neon-shadow-heavy">
      <h3 className="text-sm font-mono tracking-widest text-slate-400 mb-4 uppercase">Marketing BS-Meter</h3>
      <div className="relative w-48 h-32 overflow-hidden">
        <svg viewBox="0 0 200 120" className="w-full h-full transform -rotate-0">
          {/* Background Arc */}
          <path
            d="M 10,110 A 90,90 0 0,1 190,110"
            fill="none"
            className="gauge-bg"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Fill Arc */}
          <path
            d="M 10,110 A 90,90 0 0,1 190,110"
            fill="none"
            className="gauge-fill"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: dashOffset,
              stroke: score > 75 ? '#ef4444' : score > 40 ? '#f59e0b' : '#39FF14'
            }}
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          <span className="text-4xl font-bold font-mono neon-text">{score}</span>
          <span className={`text-xs font-bold uppercase tracking-tighter ${label.color}`}>{label.text}</span>
        </div>
      </div>
    </div>
  );
};

export default BSGauge;
