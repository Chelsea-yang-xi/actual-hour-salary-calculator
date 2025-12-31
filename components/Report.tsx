
import React, { useMemo } from 'react';
import { UserConfig, WorkSession } from '../types';
import { SLACKING_QUOTES } from '../constants';

interface ReportProps {
  session: WorkSession;
  config: UserConfig;
  onReset: () => void;
}

const Report: React.FC<ReportProps> = ({ session, config, onReset }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const dailyWage = config.monthlySalary / 30;
  const standardSeconds = config.standardHours * 3600;
  
  const actualWorkSeconds = Math.max(0, standardSeconds - session.slackSeconds);
  const slackValue = (session.slackSeconds / standardSeconds) * dailyWage;
  
  const effectiveHourlyRate = actualWorkSeconds > 0 
    ? dailyWage / (actualWorkSeconds / 3600)
    : dailyWage;

  const quote = useMemo(() => {
    return SLACKING_QUOTES[Math.floor(Math.random() * SLACKING_QUOTES.length)];
  }, []);

  const isWhiteLabel = actualWorkSeconds <= 0;

  return (
    <div className="p-10 bg-white rounded-[40px] shadow-2xl w-full max-w-lg mx-auto border-[12px] border-indigo-50 bounce-in">
      <div className="text-center mb-10">
        <div className="inline-block px-5 py-1.5 bg-indigo-50 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          Niuma Survival Report
        </div>
        <h1 className="text-2xl font-black text-[#2D3436] mb-2 tracking-tight">今日牛马日报</h1>
        <p className="text-3xl font-zcool text-[#6C5CE7] px-2 leading-tight">
          {isWhiteLabel ? "🎉 恭喜！你今天彻底白嫖了公司" : `今天成功赚了公司 ¥${slackValue.toFixed(2)}`}
        </p>
      </div>

      <div className="bg-slate-50 rounded-[32px] p-8 space-y-5 mb-10">
        <div className="flex justify-between items-center text-xs font-medium uppercase tracking-widest text-slate-400">
          <span>劳作定额</span>
          <span className="font-outfit font-black text-slate-600">{config.standardHours}h</span>
        </div>
        <div className="flex justify-between items-center text-xs font-medium uppercase tracking-widest text-slate-400">
          <span>套利时长</span>
          <span className="font-outfit font-black text-indigo-500">{formatTime(session.slackSeconds)}</span>
        </div>
        <div className="flex justify-between items-center text-xs font-medium uppercase tracking-widest text-slate-400">
          <span>损耗工时</span>
          <span className="font-outfit font-black text-emerald-500">{formatTime(actualWorkSeconds)}</span>
        </div>
        <div className="pt-6 mt-6 border-t border-slate-200">
          <div className="flex justify-between items-end">
            <span className="text-[#2D3436] font-black text-sm uppercase tracking-tighter">有效身价</span>
            <div className="text-right">
                <span className="text-[10px] text-slate-300 block line-through font-bold">Standard: ¥{(dailyWage/config.standardHours).toFixed(2)}</span>
                <span className="text-4xl font-outfit font-black text-[#6C5CE7]">¥ {effectiveHourlyRate.toFixed(2)}<span className="text-xs ml-1">/h</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50/50 p-8 rounded-[32px] italic text-indigo-700/80 text-center mb-10 relative text-sm font-medium leading-relaxed">
        <span className="absolute -top-4 -left-2 text-5xl opacity-20">“</span>
        {quote}
        <span className="absolute -bottom-10 -right-2 text-5xl rotate-180 opacity-20">“</span>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-[#2D3436] hover:bg-black text-white font-black py-6 rounded-3xl shadow-2xl transition-all active:scale-95 mb-4 text-lg uppercase tracking-widest"
      >
        明天继续白嫖
      </button>
    </div>
  );
};

export default Report;
