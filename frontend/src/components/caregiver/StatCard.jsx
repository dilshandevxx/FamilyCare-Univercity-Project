import React from 'react';

// The "export" must be here for the { StatCard } import to work
export const StatCard = ({ label, value, icon: Icon, colorClass, subtext }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          {Icon && <Icon size={22} />}
        </div>
        <span className="text-3xl font-black text-slate-800">{value}</span>
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtext}</p>
    </div>
  );
};