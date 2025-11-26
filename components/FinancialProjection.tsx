import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PROJECTION_DATA, INVESTMENT_COST } from '../constants';
import { CircleDollarSign, ArrowUpRight, Lock } from 'lucide-react';

const formatCurrencyShort = (val: number) => {
  if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-100 shadow-2xl rounded-2xl text-sm min-w-[200px]">
        <div className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Año {label}</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-xs">Pago Acum. CFE</span>
            <span className="font-mono font-bold text-[#D14656]">{formatCurrencyShort(payload[0].value)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-xs">Beneficio Solar</span>
            <span className="font-mono font-bold text-emerald-600">{formatCurrencyShort(payload[1].value)}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-4 px-4 py-1 -mb-4 rounded-b-xl">
             <span className="font-bold text-slate-700 text-xs">Ahorro Neto</span>
             <span className="font-bold text-slate-900">{formatCurrencyShort(payload[1].value - payload[0].value + INVESTMENT_COST)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const FinancialProjection: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
               <CircleDollarSign size={24} />
            </div>
            Proyección Patrimonial
          </h3>
          <p className="text-slate-500 text-sm mt-2 max-w-lg">
            Comparativa directa entre el costo de oportunidad (seguir pagando a CFE) vs. la acumulación de capital mediante energía solar.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
          <Lock size={14} />
          Precios de energía congelados por 25 años
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PROJECTION_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCfe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.05}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tickFormatter={formatCurrencyShort} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            
            <Area 
              type="monotone" 
              dataKey="cfeCumulative" 
              name="Gasto a Fondo Perdido (CFE)" 
              stroke="#D14656" 
              fillOpacity={1} 
              fill="url(#colorCfe)" 
              strokeWidth={3}
            />
            <Area 
              type="monotone" 
              dataKey="solarCumulative" 
              name="Patrimonio Generado (Solar)" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorSolar)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
         <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Inversión Inicial</div>
            <div className="text-xl font-bold text-slate-900">$309,256</div>
         </div>
         <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Retorno de Inversión</div>
            <div className="text-xl font-bold text-[#E56334]">1,600%</div>
         </div>
         <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Tasa Interna (TIR)</div>
            <div className="text-xl font-bold text-emerald-600 flex items-center gap-1">
               35% <ArrowUpRight size={18} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default FinancialProjection;