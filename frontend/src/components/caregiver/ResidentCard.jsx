import React from 'react';

export const ResidentCard = ({ name, age, room, status, condition, lastUpdate }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex gap-4 mb-6">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt={name} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-slate-800 text-base">{name}</h4>
            <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-lg text-[10px] font-bold uppercase">
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{age} Years • Room {room}</p>
        </div>
      </div>

      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl mb-6">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Condition</span>
          <span className="text-xs font-bold text-slate-700">{condition}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Last Update</span>
          <span className="text-xs font-bold text-slate-600">{lastUpdate}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">Details</button>
        <button className="flex-1 py-3 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700">Add Log</button>
      </div>
    </div>
  );
};