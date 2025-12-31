
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
    <div className="p-8 bg-white rounded-3xl shadow-xl w-full max-w-sm mx-auto animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">基础工资配置</h2>
      <p className="text-sm text-gray-500 mb-6 text-center">为了计算你到底多贵，我们需要一点点信息...</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">月薪 (¥)</label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
            placeholder="例如: 20000"
            required
          />
          <p className="mt-1 text-xs text-gray-400">税前税后随你，别太认真。</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标准工时 (h)</label>
          <input
            type="number"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
            placeholder="通常是 8"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
        >
          确定，去赚钱
        </button>
      </form>
    </div>
  );
};

export default Settings;
