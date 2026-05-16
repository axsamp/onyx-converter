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
    <div className="min-h-screen bg-g-bg text-g-text font-sans overflow-hidden will-change-transform">
      <div className="max-w-md mx-auto h-screen flex flex-col p-6">
        <header className="flex justify-between items-center py-4 mb-4">
          <div className="flex items-center gap-2"><div className="w-1.5 h-6 bg-g-primary rounded-full" /><h1 className="text-xl font-bold uppercase tracking-tight">Onyx Converter</h1></div>
          <button onClick={() => setIsSettingsOpen(true)} className="p-3 bg-g-surface rounded-full shadow-elevation-1 text-g-text-variant hover:text-g-text hover:bg-g-aluminium transition-colors ripple"><Settings size={20} /></button>
        </header>

        <div className="flex-1 flex flex-col justify-center mb-8">
          <div className="space-y-1 mb-8 text-center">
            <span className="text-[11px] font-bold text-g-text-variant uppercase tracking-widest block ml-1">Input // JPY</span>
            <div className="text-6xl font-bold tracking-tighter truncate text-g-text">¥{parseInt(yenAmount).toLocaleString()}</div>
          </div>

          <motion.div key={convertedAmount} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="material-card p-8 relative overflow-hidden shadow-elevation-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-g-primary/5 blur-3xl -mr-16 -mt-16 rounded-full" />
            <div className="relative z-10">
              <span className="text-[11px] font-bold text-g-primary uppercase tracking-[0.2em] block mb-2">Real Cost</span>
              <div className="flex items-baseline gap-2"><span className="text-4xl font-bold tracking-tight">{currencySymbol}{convertedAmount}</span><span className="text-sm font-bold text-g-text-variant uppercase tracking-widest">Est.</span></div>
              <div className="mt-6 flex items-center gap-4 pt-6 border-t border-g-outline/20">
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-g-text-variant uppercase block mb-2">Budget Impact</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-g-aluminium rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(budgetImpact, 100)}%` }} className={`h-full ${parseFloat(budgetImpact) > 50 ? 'bg-red-500' : 'bg-g-primary'}`} /></div>
                    <span className={`text-sm font-bold ${parseFloat(budgetImpact) > 50 ? 'text-red-600' : 'text-g-primary'}`}>{budgetImpact}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-3 pb-8">
          {Keys.map(key => (
            <button 
              key={key} 
              onClick={() => handleKeyPress(key)} 
              className={`h-20 material-card text-2xl font-bold flex items-center justify-center ripple shadow-elevation-1 hover:bg-g-aluminium transition-colors active:scale-95 ${key === 'C' ? 'text-red-600' : ''} ${key === 'DEL' ? 'text-g-primary' : 'text-g-text'}`}
            >
              {key}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-50 bg-g-surface p-8 flex flex-col shadow-elevation-3">
              <div className="flex justify-between items-center mb-12"><h3 className="text-2xl font-bold uppercase tracking-tight text-g-text">Rate Config</h3><button onClick={() => setIsSettingsOpen(false)} className="w-10 h-10 rounded-full bg-g-aluminium flex items-center justify-center text-g-text ripple"><X size={20} /></button></div>
              <div className="space-y-10 flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-g-text-variant"><RefreshCw size={16} /><span className="text-[11px] font-bold uppercase tracking-widest">Conversion Rate</span></div>
                  <div className="flex items-center gap-4"><span className="text-lg font-bold text-g-text-variant uppercase tracking-widest">1 {currencySymbol} = </span><input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="bg-transparent text-4xl font-bold text-g-primary border-b-2 border-g-outline/20 focus:border-g-primary focus:outline-none w-32" /><span className="text-lg font-bold text-g-text-variant uppercase tracking-widest">JPY</span></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-g-text-variant"><Wallet size={16} /><span className="text-[11px] font-bold uppercase tracking-widest">Daily Allowance</span></div>
                  <div className="flex items-center gap-4"><span className="text-lg font-bold text-g-text-variant uppercase tracking-widest">¥</span><input type="number" value={dailyBudget} onChange={(e) => setDailyBudget(parseInt(e.target.value))} className="bg-transparent text-4xl font-bold text-g-primary border-b-2 border-g-outline/20 focus:border-g-primary focus:outline-none w-full" /></div>
                </div>
              </div>
              <button onClick={() => { triggerHaptic('medium'); setIsSettingsOpen(false); }} className="h-16 bg-g-primary text-white font-bold uppercase tracking-wider text-sm rounded-2xl shadow-elevation-2 active:scale-95 transition-all ripple">Save Protocol</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
