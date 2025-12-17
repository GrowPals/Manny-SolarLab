
import React, { useState, useMemo } from 'react';
import { Wallet, Calculator, TrendingUp, Landmark, Percent, ChevronDown, ChevronUp, History, LineChart, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import { FinancialAnalysis, ConsumptionPeriod } from '../../types';
import { SYSTEM_CONSTANTS } from '../../utils/calculations';

interface HistoricalComparison {
  period: string;
  month: string;
  year: number;
  days: number;
  kwh: number;
  amountPaid: number;           // Lo que pagó
  solarGeneration: number;      // kWh que hubiera generado
  amountWithSolar: number;      // Lo que hubiera pagado con solar
  savings: number;              // Ahorro perdido
  savingsPercent: number;       // % de ahorro
}

interface FinancialSectionProps {
  financials: FinancialAnalysis;
  inflationRate: number;
  setInflationRate: (rate: number) => void;
  consumption?: ConsumptionPeriod[];
  systemSize?: number;
  isPdfMode?: boolean;
}

const FinancialSection: React.FC<FinancialSectionProps> = ({
  financials,
  inflationRate,
  setInflationRate,
  consumption = [],
  systemSize = 0,
  isPdfMode = false
}) => {
  const [showFullTable, setShowFullTable] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'projection'>('history');

  // Calculate historical comparison - what they would have paid with solar
  const historicalComparison = useMemo((): HistoricalComparison[] => {
    if (!consumption.length || !systemSize) return [];

    const { HSP_LEON, PERFORMANCE_RATIO, DAP_PERCENTAGE, CARGO_FIJO_BIMESTRAL, IVA_RATE } = SYSTEM_CONSTANTS;

    return consumption.map(period => {
      // Solar generation for this period: kWp * HSP * days * PR
      const solarGeneration = systemSize * HSP_LEON * period.days * PERFORMANCE_RATIO;

      // Calculate savable portion of the bill (excluding DAP and cargo fijo)
      // DAP is ~10.3% of total, cargo fijo is ~$74 per bimester (prorated by days)
      const cargoFijo = (CARGO_FIJO_BIMESTRAL / 60) * period.days; // Prorated for period
      const amountSinDap = period.amount * (1 - DAP_PERCENTAGE);
      const savableAmount = amountSinDap - cargoFijo;

      // Cost per kWh that can be saved
      const savableCostPerKwh = savableAmount / period.kwh;

      // How much would solar offset?
      const solarOffset = Math.min(solarGeneration * savableCostPerKwh, savableAmount);

      // What they would have paid with solar
      // Still pay: DAP + cargo fijo + remaining energy (if any)
      const nonSavablePortion = period.amount - savableAmount;
      const remainingEnergy = Math.max(0, savableAmount - solarOffset);
      const amountWithSolar = nonSavablePortion + remainingEnergy;

      const savings = period.amount - amountWithSolar;
      const savingsPercent = (savings / period.amount) * 100;

      return {
        period: period.period,
        month: period.month,
        year: period.year,
        days: period.days,
        kwh: period.kwh,
        amountPaid: period.amount,
        solarGeneration: Math.round(solarGeneration),
        amountWithSolar: Math.round(amountWithSolar),
        savings: Math.round(savings),
        savingsPercent: Math.round(savingsPercent)
      };
    });
  }, [consumption, systemSize]);

  // Total savings they've missed
  const totalMissedSavings = historicalComparison.reduce((sum, p) => sum + p.savings, 0);
  const totalPaid = historicalComparison.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalWouldPay = historicalComparison.reduce((sum, p) => sum + p.amountWithSolar, 0);

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

      {/* Tabbed Analysis: History vs Projection */}
      <Card className="p-5 md:p-8">
        {/* Tab Buttons - only show in interactive mode */}
        {!isPdfMode && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-[#E56334] to-[#DE3078] text-white shadow-lg shadow-[#E56334]/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <History size={18} />
              <span className="hidden sm:inline">Tu Historial Real</span>
              <span className="sm:hidden">Historial</span>
            </button>
            <button
              onClick={() => setActiveTab('projection')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'projection'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <LineChart size={18} />
              <span className="hidden sm:inline">Proyección 25 años</span>
              <span className="sm:hidden">Proyección</span>
            </button>
          </div>
        )}

        {/* HISTORY TAB - show if active tab or PDF mode */}
        {(activeTab === 'history' || isPdfMode) && historicalComparison.length > 0 && (
          <div className="space-y-6">
            <SectionTitle icon={History} title="Lo Que Ya Pagaste" subtitle="Comparación con sistema solar" color="orange" />

            {/* Impact Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Total Pagado a CFE</p>
                <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                  ${totalPaid.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">{historicalComparison.length} periodos</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-2">Hubieras Pagado</p>
                <p className="text-2xl md:text-3xl font-black text-emerald-700 tracking-tight">
                  ${totalWouldPay.toLocaleString()}
                </p>
                <p className="text-[10px] text-emerald-600/70 font-medium mt-1">con paneles solares</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white">
                <p className="text-[10px] text-red-100 font-bold uppercase tracking-wider mb-2">Dinero Perdido</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">
                  ${totalMissedSavings.toLocaleString()}
                </p>
                <p className="text-[10px] text-red-200 font-medium mt-1">que ya no recuperas</p>
              </div>
            </div>

            {/* Alert Message */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-amber-800 text-sm font-bold mb-1">Cada bimestre que pasa es dinero que no recuperas</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                  Estos <strong>${totalMissedSavings.toLocaleString()}</strong> ya se fueron a CFE. Con paneles, este dinero se queda en tu bolsillo desde el día 1.
                </p>
              </div>
            </div>

            {/* Historical Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-3 text-left font-bold">Periodo</th>
                    <th className="p-3 text-right font-bold">
                      <span className="hidden md:inline">Pagaste</span>
                      <span className="md:hidden">Pagaste</span>
                    </th>
                    <th className="p-3 text-right font-bold">
                      <span className="hidden md:inline">Con Solar</span>
                      <span className="md:hidden">Solar</span>
                    </th>
                    <th className="p-3 text-right font-bold">
                      <span className="hidden md:inline">Ahorro Perdido</span>
                      <span className="md:hidden">Perdido</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historicalComparison.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{row.period}</div>
                        <div className="text-[9px] text-slate-400">{row.days} días • {row.kwh.toLocaleString()} kWh</div>
                      </td>
                      <td className="p-3 text-right">
                        <span className="font-bold text-slate-700">${row.amountPaid.toLocaleString()}</span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="font-bold text-emerald-600">${row.amountWithSolar.toLocaleString()}</span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-black text-red-500">-${row.savings.toLocaleString()}</div>
                        <div className="text-[9px] text-slate-400">{row.savingsPercent}% ahorro</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-900 text-white">
                  <tr>
                    <td className="p-4 font-black">TOTAL</td>
                    <td className="p-4 text-right font-black">${totalPaid.toLocaleString()}</td>
                    <td className="p-4 text-right font-black text-emerald-400">${totalWouldPay.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full font-black text-sm">
                        -${totalMissedSavings.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Separator between sections in PDF mode */}
        {isPdfMode && historicalComparison.length > 0 && (
          <div className="my-10 border-t-2 border-slate-200 pt-10"></div>
        )}

        {/* PROJECTION TAB - show if active tab or PDF mode */}
        {(activeTab === 'projection' || isPdfMode) && (
          <div className="space-y-6">
            <SectionTitle icon={TrendingUp} title="Tu Camino a la Rentabilidad" subtitle="Proyección año por año" color="green" />

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="mb-2">
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

            {/* Show More Toggle - hide in PDF mode */}
            {!isPdfMode && (
              <button
                onClick={() => setShowFullTable(!showFullTable)}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] md:text-xs font-bold text-slate-600 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
              >
                {showFullTable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showFullTable ? 'Ver menos (primeros 10 años)' : 'Ver los 25 años completos'}
              </button>
            )}
          </div>
        )}

        {/* Fallback if no history data - only in interactive mode */}
        {!isPdfMode && activeTab === 'history' && historicalComparison.length === 0 && (
          <div className="text-center py-12">
            <History className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No hay datos históricos disponibles</p>
            <p className="text-slate-400 text-sm mt-1">Cambia a la pestaña de proyección para ver el análisis financiero</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FinancialSection;
