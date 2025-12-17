
import React from 'react';
import { Activity, Snowflake, ThermometerSun, Leaf, AlertCircle } from 'lucide-react';
import { ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import { useDiagnosis } from '../../context/DiagnosisContext';

interface ConsumptionSectionProps {
  isPdfMode?: boolean;
}

// Formatear número grande a formato corto (1400 -> "1.4k")
const formatShortNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

const ConsumptionSection: React.FC<ConsumptionSectionProps> = ({ isPdfMode = false }) => {
  const { data: diagnosisData } = useDiagnosis();
  const consumptionHistory = diagnosisData.consumption;
  const analysis = diagnosisData.consumptionAnalysis;

  return (
    <div className={`space-y-6 ${!isPdfMode ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>
      {/* Consumption Chart */}
      <Card className="p-5 md:p-8">
        <SectionTitle icon={Activity} title="Historial de Consumo" subtitle="Comportamiento últimos 12 meses (kWh)" color="blue" />
        
        <div className="h-60 md:h-80 w-full mt-6 min-w-0">
          <ResponsiveContainer width="99%" height="100%">
            <ComposedChart data={consumptionHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }}
                formatter={(v: any, name: any) => [name === 'kwh' ? `${v.toLocaleString()} kWh` : `$${v.toLocaleString()}`, name === 'kwh' ? 'Consumo' : 'Importe']}
              />
              <Area 
                type="monotone" 
                dataKey="kwh" 
                fill="url(#consumptionGradient)" 
                stroke="none" 
                isAnimationActive={!isPdfMode}
              />
              <Bar 
                dataKey="kwh" 
                radius={[4, 4, 0, 0]} 
                barSize={isPdfMode ? 40 : undefined}
                isAnimationActive={!isPdfMode}
              >
                {consumptionHistory.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.current ? '#E56334' : '#3B82F6'}
                    opacity={entry.current ? 1 : 0.8}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-6 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#E56334]"></div>Periodo Actual</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>Histórico</div>
        </div>
      </Card>

      {/* Seasonality Analysis - Vertical Stack on Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        <Card className="p-4 md:p-5 border-blue-100 shadow-lg shadow-blue-100/50 flex sm:block items-center justify-between sm:justify-start">
          <div className="flex items-center sm:block gap-3 sm:gap-0">
            <Snowflake className="text-blue-500 sm:mb-4 drop-shadow-sm" size={20} strokeWidth={2} />
            <div>
              <h4 className="font-bold text-slate-900 text-xs md:text-sm mb-0.5">Temporada Fría</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:mb-4">Nov - Feb</p>
            </div>
          </div>
          <div className="text-right sm:text-left">
             <p className="text-lg md:text-3xl font-black text-blue-600 tracking-tight">~{formatShortNumber(analysis.seasonalAvg.cold)}</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">kWh/mes (Promedio)</p>
          </div>
        </Card>

        <Card className="p-4 md:p-5 border-orange-100 shadow-lg shadow-orange-100/50 flex sm:block items-center justify-between sm:justify-start">
          <div className="flex items-center sm:block gap-3 sm:gap-0">
            <ThermometerSun className="text-[#E56334] sm:mb-4 drop-shadow-sm" size={20} strokeWidth={2} />
            <div>
              <h4 className="font-bold text-slate-900 text-xs md:text-sm mb-0.5">Temporada Cálida</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:mb-4">May - Sep</p>
            </div>
          </div>
          <div className="text-right sm:text-left">
             <p className="text-lg md:text-3xl font-black text-[#E56334] tracking-tight">~{formatShortNumber(analysis.seasonalAvg.hot)}</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">kWh/mes (Alto Consumo)</p>
          </div>
        </Card>

        <Card className="p-4 md:p-5 border-emerald-100 shadow-lg shadow-emerald-100/50 flex sm:block items-center justify-between sm:justify-start">
          <div className="flex items-center sm:block gap-3 sm:gap-0">
            <Leaf className="text-emerald-500 sm:mb-4 drop-shadow-sm" size={20} strokeWidth={2} />
            <div>
              <h4 className="font-bold text-slate-900 text-xs md:text-sm mb-0.5">Transición</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:mb-4">Mar - Abr, Oct</p>
            </div>
          </div>
          <div className="text-right sm:text-left">
             <p className="text-lg md:text-3xl font-black text-emerald-600 tracking-tight">~{formatShortNumber(analysis.seasonalAvg.mild)}</p>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">kWh/mes</p>
          </div>
        </Card>
      </div>

      {/* Alert */}
      <Card gradient className="p-5 md:p-8 text-white border-none flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6 shadow-xl shadow-[#DE3078]/20">
        <div className={`p-3 rounded-2xl shadow-inner shrink-0 hidden sm:block ${isPdfMode ? 'bg-white/30' : 'bg-white/20 backdrop-blur-md'}`}>
          <AlertCircle size={28} />
        </div>
        <div className="flex gap-3 sm:block">
          <div className={`sm:hidden p-2 rounded-xl h-fit mt-1 ${isPdfMode ? 'bg-white/30' : 'bg-white/20 backdrop-blur-md'}`}>
             <AlertCircle size={18} />
          </div>
          <div>
            <h4 className="font-bold text-base md:text-xl mb-1 md:mb-2">Diagnóstico de Tarifa {diagnosisData.client.tariff}</h4>
            <p className="text-white/90 text-[10px] md:text-sm leading-relaxed max-w-3xl font-medium">
              Su tarifa actual ({diagnosisData.client.tariffName}) cobra la energía a precio excedente (${analysis.avgCostPerKwh.toFixed(2)}/kWh con IVA).
              Sin paneles, su gasto anual base es de <strong>${analysis.totalAmountYear.toLocaleString()} MXN</strong> y aumentando.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConsumptionSection;
