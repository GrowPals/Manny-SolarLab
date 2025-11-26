
import React, { useState } from 'react';
import { Wallet, Calculator, TrendingUp, Play, Pause, RotateCcw, Landmark, Percent, ChevronDown, ChevronUp } from 'lucide-react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import { FinancialAnalysis } from '../../types';

interface FinancialSectionProps {
  financials: FinancialAnalysis;
  inflationRate: number;
  setInflationRate: (rate: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentAnimYear: number;
  setCurrentAnimYear: (year: number) => void;
  isPdfMode?: boolean;
}

const FinancialSection: React.FC<FinancialSectionProps> = ({ 
  financials, 
  inflationRate, 
  setInflationRate, 
  isPlaying, 
  setIsPlaying, 
  currentAnimYear, 
  setCurrentAnimYear,
  isPdfMode = false
}) => {
  const [showCashflow, setShowCashflow] = useState(false);

  return (
    <div className={`space-y-6 md:space-y-8 ${!isPdfMode ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>
      {/* Investment Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 md:p-8 lg:col-span-2 bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <SectionTitle icon={Wallet} title="Resumen de Inversión" color="orange" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 md:gap-y-8 mt-5 md:mt-8">
            <div className="space-y-1 md:space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Inversión Base</p>
              <p className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">${financials.baseCost.toLocaleString()}</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">+ IVA (16%)</p>
              <p className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight">${financials.iva.toLocaleString()}</p>
            </div>
            
            {/* Mobile-Optimized Total Section */}
            <div className="col-span-1 sm:col-span-2 pt-5 md:pt-8 border-t border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
                <div className="w-full md:w-auto">
                   <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 md:mb-2">Total con IVA</p>
                   {/* Compact Font Size for Mobile */}
                   <p className="text-3xl sm:text-5xl md:text-6xl font-black text-[#E56334] tracking-tighter leading-none break-words">
                     ${financials.totalCost.toLocaleString()}
                   </p>
                </div>
                
                <div className="w-full md:w-auto bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl md:text-right border border-slate-100 md:border-none flex justify-between md:block items-center mt-2 md:mt-0">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0 md:mb-2 mr-4 md:mr-0">Retorno (ROI)</p>
                    <div className="flex items-baseline gap-2 md:justify-end">
                      <p className="text-2xl md:text-4xl font-black text-slate-900 leading-none">{financials.paybackYears}</p>
                      <span className="text-xs md:text-sm font-bold text-slate-500">años</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card gradient className="p-5 md:p-8 text-white border-none flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-[#DE3078]/20">
          {/* Hide decorative blur in PDF to avoid rendering artifacts */}
          {!isPdfMode && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          )}
          
          <div className="relative z-10">
             <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
              <Landmark size={24} className="text-white drop-shadow-md" strokeWidth={2} />
              <h4 className="font-bold text-base md:text-2xl">Beneficio Fiscal</h4>
            </div>
            
            <div className="mb-5 md:mb-8">
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1 md:mb-2">Deducción ISR (30%)</p>
              <p className="text-3xl md:text-5xl font-black tracking-tight text-white">-${financials.isrDeduction.toLocaleString()}</p>
            </div>
            
            <div className="pt-5 md:pt-6 border-t border-white/20">
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1 md:mb-2">Inversión Neta Real</p>
              <p className="text-xl md:text-3xl font-bold">${financials.netCost.toLocaleString()}</p>
              <p className="text-[10px] text-white/60 mt-2 font-medium leading-relaxed">Art. 34 Frac. XIII LISR</p>
            </div>
          </div>
        </Card>
      </div>

       {/* Fiscal Details */}
      <Card className="p-5 md:p-8">
        <SectionTitle icon={Percent} title="Estrategia Fiscal" subtitle="Recuperación de inversión vía impuestos" color="purple" />
        
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mt-5 md:mt-8">
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <h5 className="font-bold text-slate-900 text-xs md:text-sm mb-2 md:mb-4">Deducción ISR 100%</h5>
            <p className="text-xl md:text-3xl font-black text-purple-600 tracking-tight mb-1 md:mb-2">${financials.isrDeduction.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Depreciación acelerada (Art. 34 LISR)</p>
          </div>
          
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <h5 className="font-bold text-slate-900 text-xs md:text-sm mb-2 md:mb-4">IVA Acreditable</h5>
            <p className="text-xl md:text-3xl font-black text-blue-600 tracking-tight mb-1 md:mb-2">${financials.iva.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Recuperable para personas morales y PFAE</p>
          </div>
          
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <h5 className="font-bold text-slate-900 text-xs md:text-sm mb-2 md:mb-4">Beneficio Total Año 1</h5>
            <p className="text-xl md:text-3xl font-black text-emerald-600 tracking-tight mb-1 md:mb-2">${(financials.isrDeduction + financials.iva).toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Monto recuperable inmediato</p>
          </div>
        </div>
      </Card>

      {/* Inflation Simulator */}
      <Card className="p-5 md:p-8">
        <SectionTitle icon={Calculator} title="Simulador de Escenarios" subtitle="Proyección financiera dinámica" color="purple" />
        
        <div className="mb-6 md:mb-10 p-5 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100">
          <div className="flex justify-between items-center mb-4 md:mb-8">
            <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">Inflación Tarifaria Anual</span>
            <span className="text-2xl md:text-4xl font-black text-purple-600">{inflationRate}%</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            step={0.5}
            value={inflationRate}
            onChange={(e) => setInflationRate(parseFloat(e.target.value))}
            className="w-full h-3 md:h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-600 hover:accent-purple-500 transition-all"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-3 md:mt-4 uppercase tracking-wider">
            <span>2% (Optimista)</span>
            <span>5% (Conservador)</span>
            <span>10% (Pesimista)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-slate-200 transition-colors flex flex-row md:flex-col justify-between md:justify-center items-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0 md:mb-2">Payback</p>
            <p className="text-lg md:text-4xl font-black text-slate-900 tracking-tight">{financials.paybackYears} <span className="text-[10px] md:text-sm text-slate-400 font-bold">años</span></p>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-slate-200 transition-colors flex flex-row md:flex-col justify-between md:justify-center items-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0 md:mb-2">Ahorro 25 años</p>
            <p className="text-lg md:text-4xl font-black text-emerald-600 tracking-tight">${(financials.totalSavings/1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-slate-200 transition-colors flex flex-row md:flex-col justify-between md:justify-center items-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0 md:mb-2">TIR (Retorno Anual)</p>
            <p className="text-lg md:text-4xl font-black text-purple-600 tracking-tight">{financials.irr}%</p>
          </div>
        </div>
      </Card>

      {/* 25 Year Projection Chart */}
      <Card className="p-5 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 md:mb-8 gap-4 sm:gap-6">
          <SectionTitle icon={TrendingUp} title="Flujo de Caja" subtitle="Proyección patrimonial" color="green" />
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg md:rounded-xl border border-slate-100 self-end sm:self-auto">
            <button
              onClick={() => { setIsPlaying(!isPlaying); if (!isPlaying && currentAnimYear >= 25) setCurrentAnimYear(0); }}
              className="p-2 md:p-2.5 bg-white rounded-md md:rounded-lg hover:bg-slate-50 shadow-sm transition-all text-slate-600 hover:text-[#E56334]"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => { setCurrentAnimYear(0); setIsPlaying(false); }}
              className="p-2 md:p-2.5 bg-white rounded-md md:rounded-lg hover:bg-slate-50 shadow-sm transition-all text-slate-600 hover:text-[#E56334]"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        
        <div className="h-64 md:h-96 w-full -ml-2 md:ml-0 min-w-0">
          <ResponsiveContainer width="99%" height="100%">
            <ComposedChart data={financials.projection.slice(0, isPlaying ? currentAnimYear : 26).map(p => ({...p, cfeLoss: -p.cfeCumulative}))}>
              <defs>
                <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} width={40} />
              <Tooltip 
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(value: any, name: string) => {
                  if (name === 'cfeLoss') return [`-$${Math.abs(value).toLocaleString()}`, 'Dinero Tirado (CFE)'];
                  if (name === 'cumulative') return [`$${value.toLocaleString()}`, 'Patrimonio Solar'];
                  return [value, name];
                }}
                labelFormatter={(v) => `Año ${v}`}
              />
              <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
              
              {/* CFE Loss (Abajo) */}
              <Area 
                type="monotone" 
                dataKey="cfeLoss" 
                stroke="#EF4444" 
                strokeWidth={2}
                fill="url(#lossGradient)" 
                animationDuration={500}
              />
              
              {/* Solar Gain (Arriba) */}
              <Area 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#10B981" 
                strokeWidth={3}
                fill="url(#cumulativeGradient)" 
                animationDuration={500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Cashflow Table Toggle */}
        <button
          onClick={() => setShowCashflow(!showCashflow)}
          className="w-full mt-5 md:mt-8 py-3 md:py-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] md:text-xs font-bold text-slate-600 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
        >
          {showCashflow ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showCashflow ? 'Ocultar tabla detallada' : 'Ver tabla detallada'}
        </button>
        
        {showCashflow && (
          <div className="mt-4 max-h-96 overflow-y-auto rounded-xl border border-slate-200 hide-scrollbar">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-3 md:p-4 text-left font-bold text-slate-600">Año</th>
                  <th className="p-3 md:p-4 text-right font-bold text-slate-600">Gasto Evitado</th>
                  <th className="p-3 md:p-4 text-right font-bold text-slate-600">Flujo Anual</th>
                  <th className="p-3 md:p-4 text-right font-bold text-slate-600">Patrimonio Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financials.projection.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 md:p-4 font-medium text-slate-500 group-hover:text-slate-800">{row.year}</td>
                    <td className="p-3 md:p-4 text-right text-red-400 font-medium decoration-red-200 line-through decoration-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      ${row.cfeWithoutSolar.toLocaleString()}
                    </td>
                    <td className="p-3 md:p-4 text-right text-emerald-600 font-bold group-hover:scale-105 transition-transform origin-right">
                      +${row.savings.toLocaleString()}
                    </td>
                    <td className={`p-3 md:p-4 text-right font-black ${row.cumulative > 0 ? 'text-slate-800' : 'text-red-500'}`}>
                      ${row.cumulative.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FinancialSection;
