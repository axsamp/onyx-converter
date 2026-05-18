import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RefreshCw, ArrowRightLeft, Percent, Calculator, Info, Wallet, X, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const triggerHaptic = (type = 'light') => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(type === 'light' ? 10 : 20);
    }
  } catch (e) {}
};

export default function App() {
  const [yenAmount, setYenAmount] = useState('0');
  const [rate, setRate] = useState(() => {
    const saved = localStorage.getItem('onyx_exchange_rate');
    return saved ? parseFloat(saved) : 150.5;
  });
  const [dailyBudget, setDailyBudget] = useState(() => {
    const saved = localStorage.getItem('onyx_daily_allowance');
    return saved ? parseInt(saved) : 23400;
  });
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStealthMode, setIsStealthMode] = useState(() => localStorage.getItem('onyx_stealth_mode') === 'true');
  const [time, setTime] = useState(new Date());

  // Unified Cross-App Theme Synchronization
  useEffect(() => {
    const THEME_PALETTES = {
      cobalt: {
        light: { primary: '#0B57D0', primaryContainer: '#D3E3FD', bg: '#F0F4F8', surface: '#FFFFFF', onSurface: '#1F1F1F', outline: '#C4C7C5', aluminium: '#E8EAED' },
        dark: { primary: '#8AB4F8', primaryContainer: '#3C4043', bg: '#202124', surface: '#303134', onSurface: '#E8EAED', outline: '#5F6368', aluminium: '#282A2D' }
      },
      vermilion: {
        light: { primary: '#A83827', primaryContainer: '#FFDAD3', bg: '#FFF8F6', surface: '#FFF8F6', onSurface: '#231A18', outline: '#857370', aluminium: '#F5DED9' },
        dark: { primary: '#FFB4A7', primaryContainer: '#862112', bg: '#1A1110', surface: '#1A1110', onSurface: '#F1DFDA', outline: '#A08C89', aluminium: '#534340' }
      },
      matcha: {
        light: { primary: '#4C662B', primaryContainer: '#CDEDA3', bg: '#F8FAF2', surface: '#FFFFFF', onSurface: '#1A1C16', outline: '#74796A', aluminium: '#E8EAED' },
        dark: { primary: '#B2D189', primaryContainer: '#1F3700', primaryContainer: '#354E16', onPrimaryContainer: '#CDEDA3', bg: '#11140E', surface: '#1A1D16', onSurface: '#E3E3DA', outline: '#8E9285', aluminium: '#282A2D' }
      },
      sakura: {
        light: { primary: '#B326B3', primaryContainer: '#FAD2FA', bg: '#FAF2FA', surface: '#FFFFFF', onSurface: '#263238', outline: '#B0BEC5', aluminium: '#E8EAED' },
        dark: { primary: '#E1BEE7', primaryContainer: '#4A148C', bg: '#1A0E1A', surface: '#2D1F2D', onSurface: '#F3E5F5', outline: '#7B1FA2', aluminium: '#282A2D' }
      },
      yuzu: {
        light: { primary: '#7E5700', primaryContainer: '#FFE086', bg: '#FFF8EE', surface: '#FFF8EE', onSurface: '#1E1B13', outline: '#7C7767', aluminium: '#F6E0BB' },
        dark: { primary: '#FABD00', primaryContainer: '#5F4100', bg: '#16130B', surface: '#16130B', onSurface: '#F1DFDA', outline: '#969080', aluminium: '#53462A' }
      },
      titanium: {
        light: { primary: '#5A626A', primaryContainer: '#E2E7EC', bg: '#F1F3F5', surface: '#FFFFFF', onSurface: '#1E2022', outline: '#70777A', aluminium: '#CFD4DA' },
        dark: { primary: '#CFD4DA', primaryContainer: '#2D3238', bg: '#1E2022', surface: '#2D3238', onSurface: '#F1F3F5', outline: '#8E9598', aluminium: '#1A1A1A' }
      },
      abyss: {
        light: { primary: '#006C5B', primaryContainer: '#59FCE1', bg: '#F4FEFA', surface: '#FFFFFF', onSurface: '#00201A', outline: '#6F7977', aluminium: '#CCEBE5' },
        dark: { primary: '#59FCE1', primaryContainer: '#005043', bg: '#001511', surface: '#00201A', onSurface: '#E6FFF9', outline: '#899391', aluminium: '#00372E' }
      }
    };

    const applyTheme = () => {
      // 1. Check URL parameters first for cross-port / Hub launches
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get('theme');
      const urlStealth = params.get('stealth');

      if (urlTheme) localStorage.setItem('onyx_theme', urlTheme);
      if (urlStealth) localStorage.setItem('onyx_stealth_mode', urlStealth);

      // 2. Read stored options
      const themeName = localStorage.getItem('onyx_theme') || 'cobalt';
      const isDark = localStorage.getItem('onyx_stealth_mode') === 'true';

      // 3. Toggle dark/light class
      setIsStealthMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // 4. Resolve exact colors
      const activePalette = THEME_PALETTES[themeName] || THEME_PALETTES.cobalt;
      const colors = isDark ? activePalette.dark : activePalette.light;

      // 5. Inject theme variables
      const root = document.documentElement;
      root.style.setProperty('--theme-g-primary', colors.primary);
      root.style.setProperty('--theme-g-primary-container', colors.primaryContainer);
      root.style.setProperty('--theme-g-bg', colors.bg);
      root.style.setProperty('--theme-g-surface', colors.surface);
      root.style.setProperty('--theme-g-text', colors.onSurface || (isDark ? '#E8EAED' : '#1F1F1F'));
      root.style.setProperty('--theme-g-text-variant', isDark ? '#9AA0A6' : '#444746');
      root.style.setProperty('--theme-g-outline', colors.outline);
      root.style.setProperty('--theme-g-aluminium', colors.aluminium);
    };

    applyTheme();

    const handleStorage = (e) => {
      if (e.key === 'onyx_stealth_mode' || e.key === 'onyx_theme') {
        applyTheme();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('onyx_exchange_rate', rate.toString());
  }, [rate]);

  useEffect(() => {
    localStorage.setItem('onyx_daily_allowance', dailyBudget.toString());
  }, [dailyBudget]);

  const tokyoTime = useMemo(() => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(time);
  }, [time]);

  const convertedAmount = useMemo(() => {
    const yen = parseFloat(yenAmount) || 0;
    return (yen / rate).toFixed(2);
  }, [yenAmount, rate]);

  const budgetImpact = useMemo(() => {
    const yen = parseFloat(yenAmount) || 0;
    if (dailyBudget <= 0) return '0.0';
    return ((yen / dailyBudget) * 100).toFixed(1);
  }, [yenAmount, dailyBudget]);

  const handleKeyPress = useCallback((key) => {
    triggerHaptic('light');
    if (key === 'C') {
      setYenAmount('0');
    } else if (key === 'DEL') {
      setYenAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setYenAmount(prev => {
        if (prev === '0') return key;
        if (prev.length >= 10) return prev; // Avoid huge numbers breaking layout
        return prev + key;
      });
    }
  }, []);

  const Keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', 'DEL', 'C'];

  return (
    <div className="min-h-screen bg-g-bg text-g-text font-sans overflow-hidden transition-colors duration-700 select-none">
      <div className="max-w-md mx-auto h-screen flex flex-col p-6">
        
        {/* Dynamic Island Safety Spacer */}
        <div className="h-10 w-full shrink-0"></div>

        {/* M3 Expressive Header */}
        <header className="flex justify-between items-end py-4 shrink-0">
          <div>
            <h1 className="text-[44px] leading-[1.05] font-black font-display tracking-tight text-g-text">
              Converter.
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold px-3 py-1 bg-g-primary-container text-g-primary rounded-full tracking-wide">
                {tokyoTime.split(':').slice(0, 2).join(':')} JST
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-g-text-variant">
                Active • Realtime Rate
              </span>
            </div>
          </div>
          <button 
            onClick={() => { triggerHaptic(); setIsSettingsOpen(true); }} 
            className="w-14 h-14 rounded-[20px] rounded-br-[8px] bg-g-surface border border-g-outline/10 text-g-text flex items-center justify-center hover:bg-g-primary-container hover:text-g-primary transition-all duration-300 shadow-sm active:scale-95 ripple"
          >
            <Settings size={20} className="text-g-text-variant" />
          </button>
        </header>

        {/* Input / Displays */}
        <div className="flex-1 flex flex-col justify-center my-4 shrink-0 min-h-0">
          <div className="space-y-1 mb-6 text-center shrink-0">
            <span className="text-[10px] font-bold text-g-text-variant uppercase tracking-widest block">Input JPY</span>
            <div className="text-5xl font-black tracking-tighter truncate text-g-text font-display">
              ¥{parseInt(yenAmount).toLocaleString()}
            </div>
          </div>

          <motion.div 
            key={convertedAmount} 
            initial={{ opacity: 0, y: 12, scale: 0.97 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            transition={{ type: "spring", damping: 20, stiffness: 220 }}
            className="material-card p-6 relative overflow-hidden shadow-sm border-g-outline/10 shrink-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-g-primary/5 blur-3xl -mr-16 -mt-16 rounded-full" />
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-g-primary uppercase tracking-[0.2em] block mb-1">Exchange Conversion</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight font-display">{currencySymbol}{convertedAmount}</span>
                <span className="text-[10px] font-bold text-g-text-variant uppercase tracking-widest">EST.</span>
              </div>
              
              <div className="mt-4 flex items-center gap-4 pt-4 border-t border-g-outline/10">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-g-text-variant uppercase tracking-widest block">Daily Cap Impact</span>
                    <span className={cn("text-xs font-bold font-mono", parseFloat(budgetImpact) > 50 ? 'text-red-500 font-extrabold' : 'text-g-primary')}>
                      {budgetImpact}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-g-aluminium dark:bg-g-aluminium/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${Math.min(parseFloat(budgetImpact), 100)}%` }} 
                        className={cn("h-full transition-all duration-500", parseFloat(budgetImpact) > 50 ? 'bg-red-500' : 'bg-g-primary')} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Keyboard Input Grid */}
        <div className="grid grid-cols-3 gap-3 pb-8 shrink-0">
          {Keys.map(key => (
            <motion.button 
              key={key} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleKeyPress(key)} 
              className={cn(
                "h-16 material-card text-xl font-bold flex items-center justify-center cursor-pointer shadow-sm border-g-outline/10 transition-colors duration-200 ripple",
                key === 'C' && 'text-red-500 font-black',
                key === 'DEL' && 'text-g-primary font-black',
                (key !== 'C' && key !== 'DEL') && 'text-g-text font-display'
              )}
            >
              {key}
            </motion.button>
          ))}
        </div>

        {/* M3 Frosted Glass Settings Drawer */}
        <AnimatePresence>
          {isSettingsOpen && (
            <div className="fixed inset-0 z-[300] flex items-end justify-center px-0">
              {/* Dimmed backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsSettingsOpen(false)} 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              />
              
              {/* Premium Glassmorphism Bottom Sheet */}
              <motion.div 
                initial={{ opacity: 0, y: "100%" }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: "100%" }} 
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative w-full max-w-lg bg-white/70 dark:bg-g-surface/70 backdrop-blur-xl border border-g-outline/15 rounded-t-[40px] rounded-b-[24px] p-6 md:p-8 shadow-2xl flex flex-col space-y-6 z-10 max-h-[85vh] overflow-y-auto no-scrollbar transition-colors duration-700"
              >
                {/* Header Status Bar */}
                <div className="w-full flex justify-between items-center border-b border-g-outline/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-g-primary animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.2em] text-g-text-variant uppercase">Rate Configurations</span>
                  </div>
                  <button 
                    onClick={() => { triggerHaptic('light'); setIsSettingsOpen(false); }} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-g-aluminium dark:bg-g-aluminium/10 text-g-text hover:bg-g-primary-container hover:text-g-primary transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Body Form Options */}
                <div className="space-y-6">
                  
                  {/* Exchange rate input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-g-text-variant">
                      <RefreshCw size={15} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Exchange conversion rate</span>
                    </div>
                    <div className="flex items-center gap-4 py-1">
                      <span className="text-base font-bold text-g-text-variant font-display">1 {currencySymbol} = </span>
                      <input 
                        type="number" 
                        value={rate} 
                        onChange={(e) => setRate(parseFloat(e.target.value) || 1)} 
                        className="bg-g-aluminium/20 dark:bg-g-aluminium/5 border border-g-outline/15 rounded-xl px-4 py-3 text-2xl font-black text-g-primary focus:outline-none focus:border-g-primary w-32 font-display text-center" 
                      />
                      <span className="text-base font-bold text-g-text-variant font-display">JPY</span>
                    </div>
                  </div>

                  {/* Daily budget cap input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-g-text-variant">
                      <Wallet size={15} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Daily budget allowance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-g-text-variant font-display">¥</span>
                      <input 
                        type="number" 
                        value={dailyBudget} 
                        onChange={(e) => setDailyBudget(parseInt(e.target.value) || 0)} 
                        className="w-full py-4 px-5 bg-g-aluminium/20 dark:bg-g-aluminium/5 border border-g-outline/15 rounded-xl text-g-text font-mono font-bold focus:outline-none focus:border-g-primary transition-colors" 
                      />
                    </div>
                  </div>

                  {/* Currency Symbol Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-g-text-variant uppercase tracking-[0.2em] ml-1">Domestic Currency Symbol</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['$', '€', '£', 'C$'].map(sym => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => { triggerHaptic(); setCurrencySymbol(sym); }}
                          className={cn(
                            "py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ripple border",
                            currencySymbol === sym 
                              ? 'bg-g-primary-container border-g-primary/20 text-g-primary' 
                              : 'bg-g-aluminium/30 dark:bg-g-aluminium/5 border-g-outline/10 text-g-text-variant'
                          )}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Commit button */}
                <div className="pt-2">
                  <button 
                    onClick={() => { triggerHaptic('medium'); setIsSettingsOpen(false); }} 
                    className="w-full h-16 bg-g-primary text-white dark:text-[#202124] font-display font-black text-sm tracking-widest uppercase rounded-2xl shadow-elevation-2 hover:brightness-110 active:scale-95 transition-all duration-200 ripple flex items-center justify-center gap-2"
                  >
                    Commit Protocol <ArrowRight size={18} className="stroke-[3]" />
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
