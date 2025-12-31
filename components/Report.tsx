
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
    <div className="p-8 bg-white rounded-[40px] shadow-2xl w-full max-w-lg mx-auto border-8 border-orange-100 bounce-in">
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold mb-2">
          牛马生存日报
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">摸鱼结算清单</h1>
        <p className="text-3xl font-zcool text-orange-600 px-2 leading-relaxed">
          {isWhiteLabel ? "🎉 恭喜！你今天彻底白嫖了公司" : `今天成功赚了公司 ¥${slackValue.toFixed(2)}`}
        </p>
      </div>

      <div className="bg-orange-50/50 rounded-3xl p-6 space-y-4 mb-8">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">规定的劳作时间</span>
          <span className="font-mono font-bold">{config.standardHours}h</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">实际摸鱼时长</span>
          <span className="font-mono font-bold text-rose-500">{formatTime(session.slackSeconds)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">真正当牛马的时间</span>
          <span className="font-mono font-bold text-emerald-600">{formatTime(actualWorkSeconds)}</span>
        </div>
        <div className="pt-4 mt-4 border-t border-orange-200">
          <div className="flex justify-between items-end">
            <span className="text-gray-800 font-bold">今日有效时薪</span>
            <div className="text-right">
                <span className="text-xs text-gray-400 block line-through">原价: ¥{(dailyWage/config.standardHours).toFixed(2)}</span>
                <span className="text-3xl font-bold text-orange-600">¥ {effectiveHourlyRate.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 p-6 rounded-3xl italic text-emerald-800 text-center mb-8 relative">
        <span className="absolute -top-3 -left-2 text-3xl">“</span>
        {quote}
        <span className="absolute -bottom-6 -right-2 text-3xl rotate-180">“</span>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95 mb-4 text-lg"
      >
        明天继续努力赚公司钱
      </button>
    </div>
  );
};

export default Report;
