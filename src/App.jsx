import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RefreshCw, ArrowRightLeft, Percent, Calculator, Info, Wallet } from 'lucide-react';

const triggerHaptic = (type = 'light') => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(type === 'light' ? 10 : 20);
    }
  } catch (e) {}
};

export default function App() {
  const [yenAmount, setYenAmount] = useState('0');
  const [rate, setRate] = useState(150.5);
  const [dailyBudget, setDailyBudget] = useState(23400);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const convertedAmount = useMemo(() => (parseFloat(yenAmount) / rate).toFixed(2), [yenAmount, rate]);
  const budgetImpact = useMemo(() => ((parseFloat(yenAmount) / dailyBudget) * 100).toFixed(1), [yenAmount, dailyBudget]);

  const handleKeyPress = useCallback((key) => {
    triggerHaptic('light');
    if (key === 'C') {
      setYenAmount('0');
    } else if (key === 'DEL') {
      setYenAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setYenAmount(prev => prev === '0' ? key : prev + key);
    }
  }, []);

  const Keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', 'DEL', 'C'];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden will-change-transform">
      <div className="max-w-md mx-auto h-screen flex flex-col p-6">
        <header className="flex justify-between items-center py-4 mb-4">
          <div className="flex items-center gap-2"><div className="w-1.5 h-6 bg-[#FFC107]" /><h1 className="text-xl font-black uppercase tracking-tighter">Onyx Converter</h1></div>
          <button onClick={() => setIsSettingsOpen(true)} className="text-zinc-600 hover:text-white transition-colors"><Settings size={20} /></button>
        </header>

        <div className="flex-1 flex flex-col justify-center mb-8">
          <div className="space-y-1 mb-8">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block ml-1">Input // JPY</span>
            <div className="text-6xl font-black mono-number tracking-tighter truncate">¥{parseInt(yenAmount).toLocaleString()}</div>
          </div>

          <motion.div key={convertedAmount} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="onyx-glass p-8 relative overflow-hidden group border-[#FFC107]/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC107]/5 blur-3xl -mr-16 -mt-16 rounded-full" />
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-[#FFC107] uppercase tracking-[0.3em] block mb-2">Real Cost</span>
              <div className="flex items-baseline gap-2"><span className="text-4xl font-black mono-number">{currencySymbol}{convertedAmount}</span><span className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Est.</span></div>
              <div className="mt-6 flex items-center gap-4 pt-6 border-t border-zinc-900">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase block mb-1">Budget Impact</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(budgetImpact, 100)}%` }} className={`h-full ${parseFloat(budgetImpact) > 50 ? 'bg-red-500' : 'bg-[#FFC107]'}`} /></div>
                    <span className={`text-xs font-black mono-number ${parseFloat(budgetImpact) > 50 ? 'text-red-500' : 'text-[#FFC107]'}`}>{budgetImpact}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-3 pb-8">
          {Keys.map(key => (<button key={key} onClick={() => handleKeyPress(key)} className={`h-20 onyx-key transition-all active:scale-95 ${key === 'C' ? 'text-red-500' : ''} ${key === 'DEL' ? 'text-[#FFC107]' : ''}`}>{key}</button>))}
        </div>

        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-50 bg-black p-8 flex flex-col">
              <div className="flex justify-between items-center mb-12"><h3 className="text-2xl font-black uppercase tracking-tighter">Rate Config</h3><button onClick={() => setIsSettingsOpen(false)} className="text-zinc-600"><Settings size={32} /></button></div>
              <div className="space-y-10 flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-600"><RefreshCw size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Conversion Rate</span></div>
                  <div className="flex items-center gap-4"><span className="text-lg font-bold text-zinc-400 uppercase tracking-widest">1 {currencySymbol} = </span><input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="bg-transparent text-4xl font-black mono-number text-[#FFC107] border-b border-zinc-900 focus:outline-none w-32" /><span className="text-lg font-bold text-zinc-400 uppercase tracking-widest">JPY</span></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-600"><Wallet size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Daily Allowance</span></div>
                  <div className="flex items-center gap-4"><span className="text-lg font-bold text-zinc-400 uppercase tracking-widest">¥</span><input type="number" value={dailyBudget} onChange={(e) => setDailyBudget(parseInt(e.target.value))} className="bg-transparent text-4xl font-black mono-number text-[#FFC107] border-b border-zinc-900 focus:outline-none w-full" /></div>
                </div>
              </div>
              <button onClick={() => { triggerHaptic('medium'); setIsSettingsOpen(false); }} className="h-20 bg-[#FFC107] text-black font-black uppercase tracking-widest text-sm rounded-2xl active:scale-95 transition-all">Save Protocol</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
