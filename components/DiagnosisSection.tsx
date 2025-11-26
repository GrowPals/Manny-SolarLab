
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { CONSUMPTION_HISTORY } from '../constants';
import { AlertOctagon, TrendingUp, Zap, FileWarning } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-3 rounded-lg shadow-xl border border-slate-700">
        <p className="text-slate-300 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-lg">
          {payload[0].value.toLocaleString()} kWh
        </p>
        <p className="text-[#E56334] text-xs font-medium">
          Costo: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(payload[0].payload.amount)}
        </p>
      </div>
    );
  }
  return null;
};

interface DiagnosisSectionProps {
  isPdfMode?: boolean;
}

const DiagnosisSection: React.FC<DiagnosisSectionProps> = ({ isPdfMode = false }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Visual Chart Card */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0"></div>
        
        <div className="flex justify-between items-end mb-8 relative z-10">
          <div>
             <h3 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Zap className="text-[#E56334]" size={28} strokeWidth={2} />
              Análisis de Consumo
            </h3>
            <p className="text-slate-500 mt-2 text-xs md:text-sm font-medium">Tendencia histórica de los últimos periodos facturados</p>
          </div>
          <div className="text-right hidden sm:block">
             <div className="text-4xl font-black text-slate-900 tracking-tight">4,251 kWh</div>
             <div className="text-xs font-bold text-[#D14656] uppercase tracking-wider mt-1">Último Bimestre</div>
          </div>
        </div>

        <div className="h-[300px] md:h-[350px] w-full relative z-10 min-w-0">
          <ResponsiveContainer width="99%" height="100%">
            <BarChart data={CONSUMPTION_HISTORY} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                axisLine={false}
                tickLine={false}
                interval={0} 
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
              <ReferenceLine y={2500} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'right', value: 'Límite DAC', fill: '#94a3b8', fontSize: 10 }} />
              <Bar 
                dataKey="kwh" 
                radius={[6, 6, 0, 0]} 
                barSize={isPdfMode ? 40 : undefined}
                isAnimationActive={!isPdfMode}
              >
                {CONSUMPTION_HISTORY.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? 'url(#gradientRed)' : '#cbd5e1'} 
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D14656" />
                  <stop offset="100%" stopColor="#E56334" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Cards - The "Problem" */}
      <div className="space-y-6">
        {/* Card 1: The Issue */}
        <div className="bg-[#FFF1F2] rounded-3xl p-6 md:p-8 border border-[#FECDD3] relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
           <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#FDA4AF] rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
           
           <div className="flex items-center gap-4 mb-6">
              <AlertOctagon size={28} className="text-[#F43F5E]" />
              <h4 className="font-bold text-[#881337] text-lg">Tarifa Penalizada</h4>
           </div>
           
           <p className="text-[#9F1239] text-sm leading-relaxed mb-6 font-medium">
             Tu tarifa actual <span className="font-black">PDBT</span> te clasifica como "Excedente", pagando un precio promedio de <span className="font-bold bg-white px-1.5 py-0.5 rounded text-[#881337]">$5.22 MXN/kWh</span>.
           </p>

           <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden mb-2">
              <div className="w-[95%] h-full bg-gradient-to-r from-[#F43F5E] to-[#9F1239]"></div>
           </div>
           <div className="flex justify-between text-[10px] text-[#9F1239] font-bold mt-1 uppercase tracking-wide">
              <span>Consumo Bajo</span>
              <span>Zona Crítica (Tú)</span>
           </div>
        </div>

        {/* Card 2: The Trend */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm group hover:shadow-lg transition-shadow duration-300">
           <div className="flex items-center gap-4 mb-6">
              <TrendingUp size={28} className="text-slate-700" />
              <h4 className="font-bold text-slate-900 text-lg">Proyección Gasto</h4>
           </div>
           
           <div className="flex flex-col gap-1 mb-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Gasto Anual Estimado</span>
              <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">$145,000</span>
           </div>

           <div className="flex items-start gap-3 text-xs font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl">
              <FileWarning size={16} className="mt-0.5 text-orange-500 shrink-0" />
              <p>Tu consumo ha crecido un <strong>200%</strong> en el último año. Sin acción, este gasto se duplicará en 4 años.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisSection;
