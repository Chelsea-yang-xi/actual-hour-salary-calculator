
import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserConfig, WorkSession } from './types';
import Settings from './components/Settings';
import Report from './components/Report';
import CoinAnimation from './components/CoinAnimation';
import { Coffee, Play, Power, CheckCircle, TrendingUp, Fish, UserRound } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Settings onSave={setConfig} />
      </div>
    );
  }

  if (appState === AppState.FINISHED && lastSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Report session={lastSession} config={config} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#FFF9F0]">
      {/* Background Decor */}
      <div className="absolute top-20 right-20 opacity-5 -rotate-12">
        <Fish size={200} />
      </div>
      <div className="absolute bottom-20 left-10 opacity-5 rotate-12">
        <UserRound size={180} />
      </div>

      <CoinAnimation 
        active={appState === AppState.WORKING || appState === AppState.SLACKING} 
        frozen={appState === AppState.SLACKING} 
      />

      <div className="z-20 w-full max-w-md text-center flex flex-col items-center">
        <div className="mb-6">
            <h1 className="text-4xl font-zcool text-orange-900 drop-shadow-sm">摸鱼计时器</h1>
            <p className="text-xs text-orange-400 mt-2 font-bold tracking-widest">让每一秒带薪拉屎都闪闪发光</p>
        </div>
        
        {/* Timer Circle */}
        <div className={`w-80 h-80 rounded-[60px] flex flex-col items-center justify-center border-[12px] transition-all duration-700 shadow-2xl bg-white relative
          ${appState === AppState.WORKING ? 'border-emerald-300 shadow-emerald-100' : 
            appState === AppState.SLACKING ? 'border-sky-300 shadow-sky-100' : 'border-orange-100 shadow-orange-50'}`}>
          
          <div className="absolute -top-5 bg-white px-4 py-1 rounded-full border-4 border-inherit text-xs font-bold text-gray-500">
            {appState === AppState.SLACKING ? '💰 正在掠夺公司资产...' : 
             appState === AppState.WORKING ? '🐎 当牛做马中...' : '💤 休息中'}
          </div>

          <div className="text-6xl font-mono font-black text-gray-800 tracking-tighter">
            {formatTime(totalSeconds)}
          </div>

          {appState === AppState.SLACKING && (
            <div className="mt-4 bg-sky-50 px-4 py-2 rounded-2xl text-sky-600 font-bold animate-bounce flex items-center gap-2">
              <Fish size={18} /> 已摸: {formatTime(slackSeconds)}
            </div>
          )}

          {appState === AppState.WORKING && (
            <div className="mt-4 text-emerald-500 font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                心率平稳，正在产出
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-14 grid grid-cols-1 gap-5 w-full px-6">
          {appState === AppState.IDLE && (
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-bold py-7 rounded-[30px] shadow-xl shadow-emerald-100 transition-all active:scale-90"
            >
              <Play fill="currentColor" size={28} /> 牛马开工
            </button>
          )}

          {appState === AppState.WORKING && (
            <>
              <button
                onClick={handleSlack}
                className="flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-600 text-white text-2xl font-bold py-7 rounded-[30px] shadow-xl shadow-sky-100 transition-all active:scale-95 group"
              >
                <Fish size={28} className="group-hover:rotate-12 transition-transform" /> 开始摸鱼
              </button>
              <button
                onClick={handleFinish}
                className="flex items-center justify-center gap-2 text-gray-400 hover:text-rose-500 font-bold py-2 transition-colors mt-2"
              >
                <Power size={18} /> 溜了溜了（下班）
              </button>
            </>
          )}

          {appState === AppState.SLACKING && (
            <>
              <button
                onClick={handleResume}
                className="flex items-center justify-center gap-3 bg-emerald-400 hover:bg-emerald-500 text-white text-2xl font-bold py-7 rounded-[30px] shadow-xl shadow-emerald-50 transition-all active:scale-95"
              >
                <TrendingUp size={28} /> 继续奋斗
              </button>
              <button
                onClick={handleFinish}
                className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white text-xl font-bold py-5 rounded-[30px] shadow-xl transition-all active:scale-95"
              >
                <CheckCircle size={24} /> 摸够了，回家
              </button>
            </>
          )}
        </div>

        {/* Config Summary Footer */}
        <div className="mt-16 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-orange-100/50">
          <div className="flex items-center gap-4 text-sm text-orange-800/60 font-medium">
            <span>月薪 ¥{config.monthlySalary}</span>
            <span className="w-1 h-1 bg-orange-200 rounded-full"></span>
            <span>工时 {config.standardHours}h</span>
            <button 
                onClick={() => setConfig(null)}
                className="ml-2 text-orange-400 underline decoration-dotted hover:text-orange-600"
            >
                修改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
