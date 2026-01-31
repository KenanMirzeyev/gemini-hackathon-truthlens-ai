
import React from 'react';
import { TruthEntry } from '../types';
import { ShieldAlert, Zap, Ghost } from 'lucide-react';

interface TruthsCardProps {
  truths: TruthEntry[];
}

const TruthsCard: React.FC<TruthsCardProps> = ({ truths }) => {
  const icons = [<Zap size={20} />, <ShieldAlert size={20} />, <Ghost size={20} />];

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-xl font-bold neon-text flex items-center gap-2">
        <span className="bg-green-500/10 p-2 rounded-lg border border-green-500/30">
          <Zap size={24} className="text-[#39FF14]" />
        </span>
        3 Hidden Truths
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {truths.slice(0, 3).map((truth, idx) => (
          <div 
            key={idx} 
            className="group p-5 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-[#39FF14]/50 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-[#39FF14] transition-colors">
                {icons[idx] || <Zap size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-slate-200 group-hover:text-white mb-1 uppercase tracking-tight">
                  {truth.title}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {truth.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TruthsCard;
