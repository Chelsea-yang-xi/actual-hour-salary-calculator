
import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserConfig, WorkSession } from './types';
import Settings from './components/Settings';
import Report from './components/Report';
import CoinAnimation from './components/CoinAnimation';
import { Coffee, Play, Power, CheckCircle, TrendingUp, Fish, UserRound, Smartphone, BookOpen, Ghost } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [config, setConfig] = useState<UserConfig | null>(() => {
    const saved = localStorage.getItem('fish_slacker_config');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [slackSeconds, setSlackSeconds] = useState(0);
  const [lastSession, setLastSession] = useState<WorkSession | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (config) {
      localStorage.setItem('fish_slacker_config', JSON.stringify(config));
    }
  }, [config]);

  useEffect(() => {
    if (appState === AppState.WORKING || appState === AppState.SLACKING) {
      timerRef.current = window.setInterval(() => {
        setTotalSeconds(prev => prev + 1);
        if (appState === AppState.SLACKING) {
          setSlackSeconds(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appState]);

  const handleStart = () => setAppState(AppState.WORKING);
  const handleSlack = () => setAppState(AppState.SLACKING);
  const handleResume = () => setAppState(AppState.WORKING);
  const handleFinish = () => {
    setLastSession({
      totalSeconds,
      slackSeconds,
      date: new Date().toLocaleDateString()
    });
    setAppState(AppState.FINISHED);
  };

  const handleReset = () => {
    setTotalSeconds(0);
    setSlackSeconds(0);
    setAppState(AppState.IDLE);
    setLastSession(null);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v < 10 ? '0' + v : v).join(':');
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F7F2]">
        <Settings onSave={setConfig} />
      </div>
    );
  }

  if (appState === AppState.FINISHED && lastSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F7F2]">
        <Report session={lastSession} config={config} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#F8F7F2]">
      {/* Exaggerated Coin Rain */}
      <CoinAnimation 
        active={appState === AppState.WORKING || appState === AppState.SLACKING} 
        frozen={appState === AppState.SLACKING} 
      />

      <div className="z-20 w-full max-w-lg text-center flex flex-col items-center">
        <header className="mb-10">
            <h1 className="text-5xl font-zcool text-[#2D3436] tracking-tight">摸鱼计时器</h1>
            <div className="mt-3 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-gray-300"></span>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">Capitalism Arbitrage Tool</p>
                <span className="h-px w-8 bg-gray-300"></span>
            </div>
        </header>
        
        {/* Main Interface Circle */}
        <div className={`w-80 h-80 rounded-full flex flex-col items-center justify-center border-[1px] transition-all duration-1000 bg-white neo-shadow relative
          ${appState === AppState.WORKING ? 'border-emerald-200 timer-glow-work' : 
            appState === AppState.SLACKING ? 'border-blue-200 timer-glow-slack' : 'border-gray-100'}`}>
          
          {/* Status Badge */}
          <div className={`absolute -top-4 px-6 py-2 rounded-full border text-xs font-black tracking-widest transition-colors duration-500 glass-morphism
            ${appState === AppState.WORKING ? 'text-emerald-600 border-emerald-200' : 
              appState === AppState.SLACKING ? 'text-blue-600 border-blue-200' : 'text-gray-400 border-gray-100'}`}>
            {appState === AppState.SLACKING ? '💰 掠夺资产中' : 
             appState === AppState.WORKING ? '🐎 当牛做马中' : 'IDLE'}
          </div>

          {/* Funny Slacking Visualization */}
          {appState === AppState.SLACKING ? (
            <div className="slacker-icon flex flex-col items-center gap-1 mb-2">
                <div className="text-5xl">🚽</div>
                <div className="flex gap-2">
                    <Smartphone size={16} className="text-blue-500" />
                    <BookOpen size={16} className="text-orange-400" />
                </div>
                <p className="text-[10px] text-blue-400 font-bold uppercase mt-1">厕所战神模式</p>
            </div>
          ) : (
            <div className={`mb-2 transition-opacity duration-500 ${appState === AppState.WORKING ? 'opacity-100' : 'opacity-20'}`}>
                <Ghost size={48} className="text-gray-200 animate-bounce" />
            </div>
          )}

          <div className="text-7xl font-outfit font-black text-[#2D3436] tracking-tighter tabular-nums">
            {formatTime(totalSeconds)}
          </div>

          {appState === AppState.SLACKING && (
            <div className="mt-4 text-blue-500 font-outfit font-bold flex items-center gap-2 px-4 py-1 bg-blue-50 rounded-full text-sm">
               <Fish size={14} /> {formatTime(slackSeconds)}
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="mt-16 w-full max-w-sm space-y-4">
          {appState === AppState.IDLE && (
            <button
              onClick={handleStart}
              className="w-full bg-[#2D3436] hover:bg-black text-white text-xl font-bold py-6 rounded-3xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Play fill="white" size={24} /> 牛马开工
            </button>
          )}

          {appState === AppState.WORKING && (
            <>
              <button
                onClick={handleSlack}
                className="w-full bg-[#6C5CE7] hover:bg-[#5849be] text-white text-xl font-bold py-6 rounded-3xl shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                <Fish size={24} className="group-hover:animate-bounce" /> 开始摸鱼
              </button>
              <button
                onClick={handleFinish}
                className="w-full py-4 text-gray-400 text-sm font-bold hover:text-red-400 transition-colors uppercase tracking-widest"
              >
                溜了溜了 / 下班
              </button>
            </>
          )}

          {appState === AppState.SLACKING && (
            <>
              <button
                onClick={handleResume}
                className="w-full bg-[#2ED573] hover:bg-[#26af5f] text-white text-xl font-bold py-6 rounded-3xl shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <TrendingUp size={24} /> 继续奋斗
              </button>
              <button
                onClick={handleFinish}
                className="w-full bg-[#2D3436] text-white text-lg font-bold py-5 rounded-3xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
              >
                <CheckCircle size={20} /> 赚够了，回家
              </button>
            </>
          )}
        </div>

        {/* Info Footer */}
        <footer className="mt-20 border-t border-gray-100 pt-6 w-full opacity-60">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter text-gray-500 px-4">
                <span>Monthly: ¥{config.monthlySalary}</span>
                <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                <span>Base: {config.standardHours}H/Day</span>
                <button onClick={() => setConfig(null)} className="underline text-black">Reset</button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
