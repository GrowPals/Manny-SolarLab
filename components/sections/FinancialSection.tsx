
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

        {/* Disclaimer */}
        <div className="mt-4 mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
          <div className="text-amber-500 shrink-0 mt-0.5">⚠️</div>
          <div>
            <p className="text-amber-800 text-xs font-bold mb-1">Aplica según régimen fiscal</p>
            <p className="text-amber-700 text-[10px] leading-relaxed">
              Los beneficios fiscales mostrados aplican para <strong>Personas Morales</strong> y <strong>Personas Físicas con Actividad Empresarial (PFAE)</strong>.
              Si tributas en otro régimen (asalariado, RIF, RESICO), consulta con tu contador para conocer tu elegibilidad.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <h5 className="font-bold text-slate-900 text-xs md:text-sm mb-2 md:mb-4">Deducción ISR 100%</h5>
            <p className="text-xl md:text-3xl font-black text-purple-600 tracking-tight mb-1 md:mb-2">${financials.isrDeduction.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Depreciación acelerada (Art. 34 Frac. XIII LISR)</p>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <h5 className="font-bold text-slate-900 text-xs md:text-sm mb-2 md:mb-4">IVA Acreditable</h5>
            <p className="text-xl md:text-3xl font-black text-blue-600 tracking-tight mb-1 md:mb-2">${financials.iva.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Recuperable para PM y PFAE con actividades gravadas</p>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <h5 className="font-bold text-slate-900 text-xs md:text-sm mb-2 md:mb-4">Beneficio Potencial Año 1</h5>
            <p className="text-xl md:text-3xl font-black text-emerald-600 tracking-tight mb-1 md:mb-2">${(financials.isrDeduction + financials.iva).toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Monto máximo recuperable (según régimen)</p>
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

      {/* Payback Timeline - Visual Hero */}
      <Card className="p-5 md:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px] opacity-10"></div>

        <div className="relative z-10">
          <SectionTitle icon={TrendingUp} title="Tu Camino a la Rentabilidad" subtitle="Cuándo empiezas a ganar" color="white" />

          {/* Timeline Visual */}
          <div className="mt-6 md:mt-10">
            {/* Payback Highlight */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Punto de Equilibrio</p>
                <p className="text-4xl md:text-6xl font-black text-emerald-400 tracking-tight">
                  {financials.paybackYears} <span className="text-lg md:text-2xl text-slate-400 font-bold">años</span>
                </p>
                <p className="text-slate-500 text-xs mt-1">Después de esto, todo es ganancia</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Ganancia Total (25 años)</p>
                <p className="text-2xl md:text-4xl font-black text-white tracking-tight">
                  +${(financials.projection[25]?.cumulative / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>

            {/* Visual Timeline Bar */}
            <div className="relative h-16 md:h-20 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
              {/* Investment Phase (Red) */}
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500/30 to-red-500/10 border-r-2 border-red-400"
                style={{ width: `${(parseFloat(financials.paybackYears) / 25) * 100}%` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] md:text-xs font-bold text-red-300 uppercase tracking-wider">Recuperando Inversión</span>
                </div>
              </div>

              {/* Profit Phase (Green) */}
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-r from-emerald-500/10 to-emerald-500/30"
                style={{ width: `${100 - (parseFloat(financials.paybackYears) / 25) * 100}%` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] md:text-xs font-bold text-emerald-300 uppercase tracking-wider">Ganancia Neta</span>
                </div>
              </div>

              {/* Year markers */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1">
                {[0, 5, 10, 15, 20, 25].map(year => (
                  <span key={year} className="text-[9px] text-slate-500 font-mono">{year}</span>
                ))}
              </div>
            </div>

            {/* Key Milestones */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mt-6">
              <div className="bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-700">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Año 1</p>
                <p className="text-sm md:text-lg font-bold text-white">+${financials.projection[1]?.savings.toLocaleString()}</p>
                <p className="text-[9px] text-slate-500">Ahorro inmediato</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-700">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Año 5</p>
                <p className="text-sm md:text-lg font-bold text-white">${(financials.projection[5]?.cumulative / 1000).toFixed(0)}k</p>
                <p className="text-[9px] text-slate-500">Patrimonio acumulado</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 md:p-4 border border-slate-700">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Año 10</p>
                <p className="text-sm md:text-lg font-bold text-emerald-400">${(financials.projection[10]?.cumulative / 1000).toFixed(0)}k</p>
                <p className="text-[9px] text-slate-500">Patrimonio acumulado</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Chart */}
      <Card className="p-5 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 md:mb-8 gap-4 sm:gap-6">
          <div>
            <h4 className="font-bold text-slate-900 text-lg md:text-xl mb-1">Proyección a 25 Años</h4>
            <p className="text-slate-500 text-xs">Comparativa: Con Solar vs Sin Solar</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-slate-600 font-medium">Con paneles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-[10px] text-slate-600 font-medium">Sin paneles</span>
            </div>
          </div>
        </div>

        <div className="h-64 md:h-80 w-full -ml-2 md:ml-0 min-w-0">
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
              <XAxis
                dataKey="year"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `Año ${v}`}
                interval={4}
              />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} width={50} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(value: any, name: string) => {
                  if (name === 'cfeLoss') return [`$${Math.abs(value).toLocaleString()}`, '💸 Pagado a CFE (perdido)'];
                  if (name === 'cumulative') return [`$${value.toLocaleString()}`, '💰 Tu patrimonio con paneles'];
                  return [value, name];
                }}
                labelFormatter={(v) => `Año ${v}`}
              />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: 'Punto cero', fontSize: 10, fill: '#94a3b8' }} />

              {/* CFE Loss (Abajo) */}
              <Area
                type="monotone"
                dataKey="cfeLoss"
                stroke="#F87171"
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

        {/* Animation Controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => { setIsPlaying(!isPlaying); if (!isPlaying && currentAnimYear >= 25) setCurrentAnimYear(0); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pausar' : 'Animar'}
          </button>
          <button
            onClick={() => { setCurrentAnimYear(0); setIsPlaying(false); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors"
          >
            <RotateCcw size={14} />
            Reiniciar
          </button>
        </div>

        {/* Detailed Table */}
        <button
          onClick={() => setShowCashflow(!showCashflow)}
          className="w-full mt-5 md:mt-8 py-3 md:py-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] md:text-xs font-bold text-slate-600 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
        >
          {showCashflow ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showCashflow ? 'Ocultar desglose anual' : 'Ver desglose año por año'}
        </button>

        {showCashflow && (
          <div className="mt-4 max-h-96 overflow-y-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-3 md:p-4 text-left font-bold text-slate-600">Año</th>
                  <th className="p-3 md:p-4 text-right font-bold text-red-500">Sin Paneles (CFE)</th>
                  <th className="p-3 md:p-4 text-right font-bold text-emerald-600">Tu Ahorro Anual</th>
                  <th className="p-3 md:p-4 text-right font-bold text-slate-800">Balance Acumulado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financials.projection.slice(1).map((row) => (
                  <tr key={row.year} className={`hover:bg-slate-50 transition-colors ${row.cumulative >= 0 ? '' : 'bg-red-50/30'}`}>
                    <td className="p-3 md:p-4 font-bold text-slate-700">
                      {row.year}
                      {row.cumulative >= 0 && financials.projection[row.year - 1]?.cumulative < 0 && (
                        <span className="ml-2 text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">PAYBACK</span>
                      )}
                    </td>
                    <td className="p-3 md:p-4 text-right text-red-400 font-medium line-through decoration-red-200 decoration-1">
                      ${row.cfeWithoutSolar.toLocaleString()}
                    </td>
                    <td className="p-3 md:p-4 text-right text-emerald-600 font-bold">
                      +${row.savings.toLocaleString()}
                    </td>
                    <td className={`p-3 md:p-4 text-right font-black ${row.cumulative >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {row.cumulative >= 0 ? '+' : ''}${row.cumulative.toLocaleString()}
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
