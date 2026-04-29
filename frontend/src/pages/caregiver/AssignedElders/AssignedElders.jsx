import React, { useState } from 'react';
import CaregiverLayout from '../../../layouts/CaregiverLayout';
import { Search, Filter, Eye, FilePlus, Heart, Activity, Thermometer, ChevronLeft, ChevronRight, HelpCircle, Plus } from 'lucide-react';

const mockElders = [
  {
    id: 'FC-9021',
    name: 'Arthur Jenkins',
    age: 82,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arthur',
    status: 'CRITICAL',
    heartRate: '104',
    bp: '158/95',
    temp: '99.1',
    condition: 'Congestive Heart Failure',
    lastUpdate: '12 mins ago',
  },
  {
    id: 'FC-1154',
    name: 'Martha Stewart',
    age: 76,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha',
    status: 'NEEDS ATTENTION',
    heartRate: '78',
    bp: '132/84',
    temp: '98.6',
    condition: 'Type 2 Diabetes',
    lastUpdate: '2 hours ago',
  },
  {
    id: 'FC-2281',
    name: 'George Miller',
    age: 89,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George',
    status: 'STABLE',
    heartRate: '72',
    bp: '120/80',
    temp: '98.4',
    condition: 'Post-Op Recovery',
    lastUpdate: '5 hours ago',
  }
];

const getStatusConfig = (status) => {
  switch (status) {
    case 'CRITICAL':
      return { 
        color: 'text-red-600', 
        bg: 'bg-red-50', 
        border: 'border-red-500',
        dot: 'bg-red-500'
      };
    case 'NEEDS ATTENTION':
      return { 
        color: 'text-orange-600', 
        bg: 'bg-orange-50', 
        border: 'border-orange-500',
        dot: 'bg-orange-500'
      };
    case 'STABLE':
      return { 
        color: 'text-teal-600', 
        bg: 'bg-teal-50', 
        border: 'border-teal-500',
        dot: 'bg-teal-500'
      };
    default:
      return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-500', dot: 'bg-slate-500' };
  }
};

const AssignedElders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <CaregiverLayout title="Assigned Elders">
      {/* Top Header / Breadcrumb area specifically for this page layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="hidden md:flex items-center text-xs text-slate-500 mb-2 font-medium">
            <span>Dashboard</span>
            <span className="mx-2">›</span>
            <span className="text-teal-600 font-bold">Assigned Elders</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Assigned Elders</h1>
          <p className="text-sm text-slate-500 mt-1">Managing care for 12 individuals across the district.</p>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <HelpCircle size={20} />
          </button>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
            <Plus size={18} /> Add Health Log
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
            placeholder="Search by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative hidden md:block">
            <select className="appearance-none bg-white border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm cursor-pointer">
              <option>Status: All</option>
              <option>Critical</option>
              <option>Needs Attention</option>
              <option>Stable</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <button className="hidden md:flex items-center px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            Age Range
          </button>
          
          <button className="p-3 bg-slate-900 text-white rounded-2xl shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-center">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Grid of Elders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {mockElders.map((elder) => {
          const statusConfig = getStatusConfig(elder.status);
          const isCritical = elder.status === 'CRITICAL';
          
          return (
            <div key={elder.id} className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative md:border-l-[1px] border-l-4 ${statusConfig.border} md:border-l-slate-100`}>
              
              {/* Mobile-only left border color - achieved via classes above */}
              
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200">
                      <img src={elder.image} alt={elder.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 leading-tight">{elder.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {elder.age} years old <span className="hidden md:inline">• ID: {elder.id}</span>
                        <span className="md:hidden block mt-0.5">{elder.condition}</span>
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.color} absolute top-6 right-6 md:static`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
                    <span className="text-[10px] font-bold tracking-wider uppercase">{elder.status}</span>
                  </div>
                </div>

                {/* Desktop BP/Temp Info Boxes */}
                <div className="hidden md:grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last BP</p>
                    <p className="text-xl font-black text-slate-800">
                      <span className={isCritical ? 'text-red-600' : ''}>{elder.bp.split('/')[0]}</span>
                      <span className="text-slate-400 font-bold text-lg">/{elder.bp.split('/')[1]}</span>
                      <span className="text-xs font-medium text-slate-400 ml-1">mmHg</span>
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Temperature</p>
                    <p className="text-xl font-black text-slate-800">
                      {elder.temp} <span className="text-xs font-medium text-slate-400">°F</span>
                    </p>
                  </div>
                </div>

                {/* Mobile Heart/BP/Temp Row */}
                <div className="md:hidden flex justify-between items-center bg-slate-50 rounded-2xl p-4 mb-6">
                  <div className="text-center">
                    <Heart className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    <p className={`text-sm font-bold ${isCritical ? 'text-red-600' : 'text-slate-800'}`}>{elder.heartRate} bpm</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Heart Rate</p>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-200"></div>
                  <div className="text-center">
                    <Activity className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    <p className={`text-sm font-bold ${elder.status === 'NEEDS ATTENTION' ? 'text-orange-600' : 'text-slate-800'}`}>{elder.bp}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">BP</p>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-200"></div>
                  <div className="text-center">
                    <Thermometer className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    <p className="text-sm font-bold text-slate-800">{elder.temp}°F</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Temp</p>
                  </div>
                </div>

                {/* Desktop Condition/Update */}
                <div className="hidden md:flex flex-col gap-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Condition</span>
                    <span className="font-bold text-slate-800">{elder.condition}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Last Update</span>
                    <span className="font-bold text-slate-800">{elder.lastUpdate}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-auto">
                  <button className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                    <Eye size={16} /> View Details
                  </button>
                  <button className="flex-1 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20">
                    <FilePlus size={16} /> Add Log
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500">
        <p>Showing <span className="font-bold text-slate-800">3</span> of <span className="font-bold text-slate-800">12</span> elders</p>
        
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-400 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-600 text-white shadow-sm font-bold">
            1
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors font-bold">
            2
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors font-bold">
            3
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </CaregiverLayout>
  );
};

export default AssignedElders;
