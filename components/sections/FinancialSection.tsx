
import React, { useState } from 'react';
import { Wallet, Calculator, TrendingUp, Landmark, Percent, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import { FinancialAnalysis } from '../../types';

interface FinancialSectionProps {
  financials: FinancialAnalysis;
  inflationRate: number;
  setInflationRate: (rate: number) => void;
  isPdfMode?: boolean;
}

const FinancialSection: React.FC<FinancialSectionProps> = ({
  financials,
  inflationRate,
  setInflationRate,
  isPdfMode = false
}) => {
  const [showFullTable, setShowFullTable] = useState(false);

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

      {/* Rentability Timeline with Integrated Table */}
      <Card className="p-5 md:p-8">
        <SectionTitle icon={TrendingUp} title="Tu Camino a la Rentabilidad" subtitle="Proyección año por año" color="green" />

        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-8">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">Punto de Equilibrio</p>
            <p className="text-2xl md:text-3xl font-black text-emerald-700 tracking-tight">{financials.paybackYears}</p>
            <p className="text-[10px] text-emerald-600/70 font-medium">años para recuperar</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Ahorro Año 1</p>
            <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">+${(financials.projection[1]?.savings / 1000).toFixed(0)}k</p>
            <p className="text-[10px] text-slate-400 font-medium">primer año</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Patrimonio Año 10</p>
            <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">${(financials.projection[10]?.cumulative / 1000).toFixed(0)}k</p>
            <p className="text-[10px] text-slate-400 font-medium">acumulado</p>
          </div>
          <div className="bg-emerald-600 rounded-2xl p-4">
            <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-1">Ganancia Total</p>
            <p className="text-2xl md:text-3xl font-black text-white tracking-tight">+${(financials.projection[25]?.cumulative / 1000000).toFixed(1)}M</p>
            <p className="text-[10px] text-emerald-200 font-medium">en 25 años</p>
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-[10px] text-slate-600 font-medium">Recuperando inversión</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-slate-600 font-medium">Ganancia neta</span>
            </div>
          </div>
          <div className="relative h-10 bg-slate-100 rounded-full overflow-hidden">
            {/* Recovery Phase */}
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 to-red-300 flex items-center justify-center"
              style={{ width: `${Math.min((parseFloat(financials.paybackYears) / 25) * 100, 100)}%` }}
            >
              {parseFloat(financials.paybackYears) > 2 && (
                <span className="text-[10px] font-bold text-white px-2">{financials.paybackYears} años</span>
              )}
            </div>
            {/* Profit Phase */}
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center"
              style={{ width: `${100 - Math.min((parseFloat(financials.paybackYears) / 25) * 100, 100)}%` }}
            >
              <span className="text-[10px] font-bold text-white px-2">Ganancia</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-slate-400 font-medium px-1">
            <span>Año 0</span>
            <span>Año 5</span>
            <span>Año 10</span>
            <span>Año 15</span>
            <span>Año 20</span>
            <span>Año 25</span>
          </div>
        </div>

        {/* Year by Year Table - Always visible for first 10 years */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left font-bold text-slate-600">Año</th>
                <th className="p-3 text-right font-bold text-slate-600">
                  <span className="hidden md:inline">Pagarías a CFE</span>
                  <span className="md:hidden">CFE</span>
                </th>
                <th className="p-3 text-right font-bold text-slate-600">
                  <span className="hidden md:inline">Tu Ahorro</span>
                  <span className="md:hidden">Ahorro</span>
                </th>
                <th className="p-3 text-right font-bold text-slate-600">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financials.projection.slice(1, showFullTable ? 26 : 11).map((row) => {
                const isPaybackYear = row.cumulative >= 0 && financials.projection[row.year - 1]?.cumulative < 0;
                return (
                  <tr
                    key={row.year}
                    className={`transition-colors ${isPaybackYear ? 'bg-emerald-50' : row.cumulative < 0 ? 'bg-red-50/30' : 'hover:bg-slate-50'}`}
                  >
                    <td className="p-3 font-bold text-slate-700">
                      {row.year}
                      {isPaybackYear && (
                        <span className="ml-2 text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">PAYBACK</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-red-400 font-medium">
                      <span className="line-through decoration-1">${(row.cfeWithoutSolar / 1000).toFixed(0)}k</span>
                    </td>
                    <td className="p-3 text-right text-emerald-600 font-bold">
                      +${(row.savings / 1000).toFixed(0)}k
                    </td>
                    <td className={`p-3 text-right font-black ${row.cumulative >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {row.cumulative >= 0 ? '+' : ''}{row.cumulative >= 1000000 || row.cumulative <= -1000000
                        ? `$${(row.cumulative / 1000000).toFixed(1)}M`
                        : `$${(row.cumulative / 1000).toFixed(0)}k`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Show More Toggle */}
        <button
          onClick={() => setShowFullTable(!showFullTable)}
          className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] md:text-xs font-bold text-slate-600 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
        >
          {showFullTable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showFullTable ? 'Ver menos (primeros 10 años)' : 'Ver los 25 años completos'}
        </button>
      </Card>
    </div>
  );
};

export default FinancialSection;
