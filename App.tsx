
import React, { useState, useCallback } from 'react';
// Added missing Zap and ShieldAlert icons to the import
import { Search, Loader2, Link2, AlertCircle, Info, ExternalLink, Zap, ShieldAlert } from 'lucide-react';
import { AppState } from './types';
import { analyzeProduct } from './services/gemini';
import BSGauge from './components/BSGauge';
import TruthsCard from './components/TruthsCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    loading: false,
    error: null,
    result: null,
    query: ''
  });

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!state.query.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null, result: null }));

    try {
      const analysis = await analyzeProduct(state.query);
      setState(prev => ({ ...prev, loading: false, result: analysis }));
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message || "An unexpected error occurred" }));
    }
  }, [state.query]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="w-full flex flex-col items-center mb-12 text-center">
        <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[#39FF14] text-xs font-mono mb-4 animate-pulse-slow">
          REAL-TIME SEARCH GROUNDING ACTIVE
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          TruthLens <span className="neon-text">AI</span>
        </h1>
        <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
          The ultimate antidote to marketing hype. We scan real user complaints from Reddit and forums to give you the cold, hard facts.
        </p>
      </header>

      {/* Input Box */}
      <section className="w-full max-w-3xl mb-12">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col md:flex-row gap-4 p-2 bg-slate-900 border border-slate-800 rounded-2xl focus-within:border-[#39FF14]/50 transition-colors">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Paste product link or type product name..."
                className="w-full bg-transparent border-none outline-none py-4 text-slate-100 placeholder:text-slate-600 font-mono"
                value={state.query}
                onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
                disabled={state.loading}
              />
            </div>
            <button
              type="submit"
              disabled={state.loading || !state.query.trim()}
              className="px-8 py-4 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              {state.loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>ANALYZING...</span>
                </>
              ) : (
                <>
                  <span>REVEAL TRUTH</span>
                  <Zap size={18} className="fill-current" />
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Error State */}
      {state.error && (
        <div className="w-full max-w-2xl bg-red-950/20 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 text-red-400 mb-8">
          <AlertCircle size={20} />
          <p>{state.error}</p>
        </div>
      )}

      {/* Loading Placeholder */}
      {state.loading && (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
           <div className="h-64 bg-slate-900/50 rounded-2xl border border-slate-800"></div>
           <div className="space-y-4">
             <div className="h-8 bg-slate-900/50 rounded-lg w-1/2"></div>
             <div className="h-24 bg-slate-900/50 rounded-lg"></div>
             <div className="h-24 bg-slate-900/50 rounded-lg"></div>
             <div className="h-24 bg-slate-900/50 rounded-lg"></div>
           </div>
        </div>
      )}

      {/* Results */}
      {state.result && (
        <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Gauge & Summary */}
          <div className="lg:col-span-5 space-y-6">
            <BSGauge score={state.result.bsScore} />
            
            <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-mono uppercase text-slate-500 mb-3 flex items-center gap-2">
                <Info size={14} /> The Verdict
              </h3>
              <p className="text-slate-300 leading-relaxed italic">
                "{state.result.summary}"
              </p>
            </div>

            {/* Grounding Sources */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <Link2 size={14} /> Grounding Sources
              </h3>
              <div className="flex flex-wrap gap-2">
                {state.result.sources.length > 0 ? (
                  state.result.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-400 hover:text-white transition-all flex items-center gap-2"
                    >
                      <span className="truncate max-w-[120px]">{source.title}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))
                ) : (
                  <span className="text-slate-600 text-xs font-mono italic">No direct sources found...</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Truths */}
          <div className="lg:col-span-7">
            <TruthsCard truths={state.result.truths} />
          </div>
        </main>
      )}

      {/* Footer Info */}
      {!state.result && !state.loading && (
        <div className="mt-auto py-8 text-center border-t border-slate-900 w-full max-w-4xl">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3 text-[#39FF14]">
                  <Search size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-300 uppercase">Search Grounding</h4>
                <p className="text-xs text-slate-500 mt-1">Real-time web verification</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3 text-[#39FF14]">
                  <ShieldAlert size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-300 uppercase">Zero Hype</h4>
                <p className="text-xs text-slate-500 mt-1">Filters sponsored opinions</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3 text-[#39FF14]">
                  <Zap size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-300 uppercase">Reddit Scouring</h4>
                <p className="text-xs text-slate-500 mt-1">Real human feedback</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
