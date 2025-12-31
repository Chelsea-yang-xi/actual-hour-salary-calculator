
import React, { useState } from 'react';
import { UserConfig } from '../types';

interface SettingsProps {
  onSave: (config: UserConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSave }) => {
  const [salary, setSalary] = useState<string>('15000');
  const [hours, setHours] = useState<string>('8');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      monthlySalary: parseFloat(salary),
      standardHours: parseFloat(hours)
    });
  };

  return (
    <div className="p-8 bg-white rounded-3xl shadow-xl w-full max-w-sm mx-auto animate-in fade-in zoom-in duration-300 border border-slate-100">
      <h2 className="text-2xl font-black mb-6 text-slate-800 text-center font-outfit uppercase tracking-tight">配置你的身价</h2>
      <p className="text-sm text-slate-400 mb-6 text-center font-medium">量化生命价值的第一步...</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">月薪 (到手金额 ¥)</label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-400 focus:outline-none text-slate-950 text-2xl font-black font-outfit transition-all placeholder-slate-300 bg-slate-50/30"
            placeholder="20000"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">每日法定工时 (h)</label>
          <input
            type="number"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-400 focus:outline-none text-slate-950 text-2xl font-black font-outfit transition-all placeholder-slate-300 bg-slate-50/30"
            placeholder="8"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm"
        >
          确定，开始打工
        </button>
      </form>
    </div>
  );
};

export default Settings;
