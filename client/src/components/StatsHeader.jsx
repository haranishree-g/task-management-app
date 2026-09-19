import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

const StatsHeader = ({ stats }) => {
  const { total = 0, completed = 0, in_progress = 0, to_do = 0, urgent = 0 } = stats || {};
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Tasks Card */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold text-white">{total}</span>
          <p className="text-xs text-slate-400 mt-1">{to_do} pending to start</p>
        </div>
      </div>

      {/* In Progress Card */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold text-amber-400">{in_progress}</span>
          <p className="text-xs text-slate-400 mt-1">Currently being worked on</p>
        </div>
      </div>

      {/* Completed Card & Progress */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">{completed}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {completionRate}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Urgent/High Priority Card */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Urgent Tasks</span>
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold text-rose-400">{urgent}</span>
          <p className="text-xs text-slate-400 mt-1">High priority items left</p>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
