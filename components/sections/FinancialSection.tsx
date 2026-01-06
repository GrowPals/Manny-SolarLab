
import React, { useState, useMemo } from 'react';
import {
  Wallet, Calculator, TrendingUp, Landmark, ChevronDown, ChevronUp,
  History, AlertCircle, Sun, Zap, Target, PiggyBank
} from 'lucide-react';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import { FinancialAnalysis, ConsumptionPeriod, SolarSystemSpecs } from '../../types';
import { SYSTEM_CONSTANTS, calculateSolarSystem, calculateFinancials, ConsumptionAnalysis } from '../../utils/calculations';

interface HistoricalComparison {
  period: string;
  days: number;
  kwh: number;
  amountPaid: number;
  amountWithSolar: number;
  savings: number;
  coverage: number;
}

interface FinancialSectionProps {
  financials: FinancialAnalysis;
  inflationRate: number;
  setInflationRate: (rate: number) => void;
  consumption?: ConsumptionPeriod[];
  systemSize: number;
  setSystemSize: (size: number) => void;
  optimalSize: number;
  consumptionAnalysis: ConsumptionAnalysis;
  isPdfMode?: boolean;
}

const FinancialSection: React.FC<FinancialSectionProps> = ({
  financials,
  inflationRate,
  setInflationRate,
  consumption = [],
  systemSize,
  setSystemSize,
  optimalSize,
  consumptionAnalysis,
  isPdfMode = false
}) => {
  const [showFullTable, setShowFullTable] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Dynamic slider range based on optimal size
  const sliderMin = Math.max(1, Math.round(optimalSize * 0.3 * 2) / 2);
  const sliderMax = Math.round(optimalSize * 2 * 2) / 2;

  // Recalculate system specs based on current systemSize
  const currentSystem = useMemo(() =>
    calculateSolarSystem(systemSize, consumptionAnalysis),
    [systemSize, consumptionAnalysis]
  );

  // Calculate historical comparison
  const historicalComparison = useMemo((): HistoricalComparison[] => {
    if (!consumption.length || !systemSize) return [];

    const { HSP_LEON, PERFORMANCE_RATIO, DAP_PERCENTAGE, CARGO_FIJO_BIMESTRAL } = SYSTEM_CONSTANTS;

    return consumption
      .filter(period => period.kwh > 0 && period.amount > 0 && period.days > 0)
      .map(period => {
        const solarGeneration = systemSize * HSP_LEON * period.days * PERFORMANCE_RATIO;
        const cargoFijo = (CARGO_FIJO_BIMESTRAL / 60) * period.days;
        const amountSinDap = period.amount * (1 - DAP_PERCENTAGE);
        const savableAmount = Math.max(0, amountSinDap - cargoFijo);
        const savableCostPerKwh = period.kwh > 0 ? savableAmount / period.kwh : 0;
        const solarOffset = Math.min(solarGeneration * savableCostPerKwh, savableAmount);
        const nonSavablePortion = period.amount - savableAmount;
        const remainingEnergy = Math.max(0, savableAmount - solarOffset);
        const amountWithSolar = Math.max(0, nonSavablePortion + remainingEnergy);
        const savings = Math.max(0, period.amount - amountWithSolar);
        const coverage = Math.min(100, Math.round((solarGeneration / period.kwh) * 100));

        return {
          period: period.period,
          days: period.days,
          kwh: period.kwh,
          amountPaid: period.amount,
          amountWithSolar: Math.round(amountWithSolar),
          savings: Math.round(savings),
          coverage,
        };
      });
  }, [consumption, systemSize]);

  const totalPaid = historicalComparison.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalWouldPay = historicalComparison.reduce((sum, p) => sum + p.amountWithSolar, 0);
  const totalSavings = totalPaid - totalWouldPay;
  const avgCoverage = historicalComparison.length > 0
    ? Math.round(historicalComparison.reduce((sum, p) => sum + p.coverage, 0) / historicalComparison.length)
    : 0;

  // Calculate panels count
  const panelsCount = Math.ceil((systemSize * 1000) / SYSTEM_CONSTANTS.PANEL_WATTS);

  return (
    <div className={`space-y-6 md:space-y-8 ${!isPdfMode ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>

      {/* ============================================================ */}
      {/* SYSTEM CONFIGURATOR - The main interactive element */}
      {/* ============================================================ */}
      <Card className="p-4 md:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-none shadow-2xl">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-1.5 md:p-2 bg-[#E56334] rounded-lg md:rounded-xl">
            <Sun size={18} className="text-white md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="font-black text-base md:text-2xl">Configura Tu Sistema</h3>
            <p className="text-slate-400 text-[10px] md:text-xs">Ajusta el tamaño y ve el impacto</p>
          </div>
        </div>

        {/* Main Configurator */}
        <div className="bg-white/5 backdrop-blur rounded-xl md:rounded-2xl p-4 md:p-8 border border-white/10">
          {/* Current Selection Display */}
          <div className="flex justify-between items-center gap-3 mb-4 md:mb-6">
            <div>
              <p className="text-slate-400 text-[9px] md:text-[10px] uppercase tracking-wider font-bold mb-0.5">Sistema</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-6xl font-black text-white">{systemSize}</span>
                <span className="text-sm md:text-xl text-slate-400 font-bold">kW</span>
              </div>
            </div>
            <div className="flex gap-3 md:gap-6">
              <div className="text-center">
                <p className="text-slate-400 text-[9px] md:text-[10px] uppercase tracking-wider font-bold mb-0.5">Paneles</p>
                <p className="text-xl md:text-3xl font-black text-white">{panelsCount}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-[9px] md:text-[10px] uppercase tracking-wider font-bold mb-0.5">Cobertura</p>
                <p className="text-xl md:text-3xl font-black text-emerald-400">{Math.round(Number(currentSystem.coverage))}%</p>
              </div>
            </div>
          </div>

          {/* Slider */}
          {!isPdfMode ? (
            <div className="space-y-2 md:space-y-3">
              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                step={0.5}
                value={systemSize}
                onChange={(e) => setSystemSize(parseFloat(e.target.value))}
                className="w-full h-2 md:h-3 bg-slate-700 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #E56334 0%, #E56334 ${((systemSize - sliderMin) / (sliderMax - sliderMin)) * 100}%, #334155 ${((systemSize - sliderMin) / (sliderMax - sliderMin)) * 100}%, #334155 100%)`
                }}
              />
              <div className="flex justify-between items-center text-[9px] md:text-[10px] text-slate-500 font-medium">
                <span>{sliderMin} kW</span>
                <button
                  onClick={() => setSystemSize(optimalSize)}
                  className={`px-2 md:px-3 py-1 rounded-full transition-all text-[9px] md:text-[10px] ${
                    systemSize === optimalSize
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {optimalSize} kW Recomendado
                </button>
                <span>{sliderMax} kW</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
                Sistema recomendado: {optimalSize} kW
              </span>
            </div>
          )}
        </div>

        {/* Quick Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-4 md:mt-6">
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
            <Wallet size={16} className="text-[#E56334] mb-1 md:mb-2 md:w-[18px] md:h-[18px]" />
            <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider font-bold">Inversión</p>
            <p className="text-base md:text-xl font-black text-white">${(financials.totalCost / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
            <Target size={16} className="text-emerald-400 mb-1 md:mb-2 md:w-[18px] md:h-[18px]" />
            <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider font-bold">Payback</p>
            <p className="text-base md:text-xl font-black text-white">{financials.paybackYears} años</p>
          </div>
          <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
            <TrendingUp size={16} className="text-purple-400 mb-1 md:mb-2 md:w-[18px] md:h-[18px]" />
            <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider font-bold">TIR Anual</p>
            <p className="text-base md:text-xl font-black text-white">{financials.irr}%</p>
          </div>
          <div className="bg-emerald-500/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-emerald-500/30">
            <PiggyBank size={16} className="text-emerald-400 mb-1 md:mb-2 md:w-[18px] md:h-[18px]" />
            <p className="text-[9px] md:text-[10px] text-emerald-300 uppercase tracking-wider font-bold">Ganancia 25y</p>
            <p className="text-base md:text-xl font-black text-emerald-400">+${(financials.totalSavings / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* INVESTMENT BREAKDOWN */}
      {/* ============================================================ */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-4 md:p-8 lg:col-span-2 bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between gap-2 mb-4 md:mb-8">
            <SectionTitle icon={Wallet} title="Desglose de Inversión" color="orange" />
            <div className="flex items-center gap-1.5 md:gap-2 text-slate-500">
              <span className="text-[10px] md:text-xs font-bold bg-slate-100 px-2 md:px-3 py-1 rounded-full">{panelsCount} paneles</span>
              <span className="text-[10px] md:text-xs font-bold bg-slate-100 px-2 md:px-3 py-1 rounded-full">{systemSize} kW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-x-12 md:gap-y-8">
            <div className="space-y-0.5 md:space-y-2">
              <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider font-bold">Inversión Base</p>
              <p className="text-lg md:text-3xl font-bold text-slate-900 tracking-tight">${financials.baseCost.toLocaleString()}</p>
              <p className="text-[9px] md:text-[10px] text-slate-400">{panelsCount}× {SYSTEM_CONSTANTS.PANEL_WATTS}W</p>
            </div>
            <div className="space-y-0.5 md:space-y-2">
              <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider font-bold">+ IVA (16%)</p>
              <p className="text-lg md:text-3xl font-bold text-slate-900 tracking-tight">${financials.iva.toLocaleString()}</p>
              <p className="text-[9px] md:text-[10px] text-slate-400">Acreditable PM/PFAE</p>
            </div>

            <div className="col-span-2 pt-4 md:pt-8 border-t border-slate-100">
              <div className="flex justify-between items-end gap-4">
                <div>
                   <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Total con IVA</p>
                   <p className="text-2xl md:text-5xl font-black text-[#E56334] tracking-tighter leading-none">
                     ${financials.totalCost.toLocaleString()}
                   </p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">$/Watt</p>
                    <p className="text-lg md:text-2xl font-black text-slate-700 leading-none">
                      ${(financials.totalCost / (systemSize * 1000)).toFixed(2)}
                    </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Fiscal Benefit Card */}
        <Card gradient className="p-4 md:p-8 text-white border-none flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-[#DE3078]/20">
          {!isPdfMode && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          )}

          <div className="relative z-10">
             <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8">
              <Landmark size={20} className="text-white drop-shadow-md md:w-6 md:h-6" strokeWidth={2} />
              <h4 className="font-bold text-sm md:text-2xl">Beneficio Fiscal</h4>
            </div>

            <div className="mb-4 md:mb-8">
              <p className="text-[9px] md:text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Deducción ISR (100%)</p>
              <p className="text-2xl md:text-5xl font-black tracking-tight text-white">-${financials.isrDeduction.toLocaleString()}</p>
            </div>

            <div className="pt-4 md:pt-6 border-t border-white/20">
              <p className="text-[9px] md:text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Inversión Neta</p>
              <p className="text-lg md:text-3xl font-bold">${financials.netCost.toLocaleString()}</p>
              <p className="text-[9px] md:text-[10px] text-white/60 mt-1 md:mt-2 font-medium">Art. 34 Frac. XIII LISR</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Fiscal Disclaimer */}
      <div className="p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg md:rounded-xl flex gap-2 md:gap-3">
        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
        <div>
          <p className="text-amber-800 text-[10px] md:text-xs font-bold mb-0.5 md:mb-1">Beneficios fiscales según régimen</p>
          <p className="text-amber-700 text-[9px] md:text-[10px] leading-relaxed">
            Deducción ISR e IVA acreditable aplican para <strong>Personas Morales</strong> y <strong>PFAE</strong>.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* HISTORICAL COMPARISON - What you would have saved */}
      {/* ============================================================ */}
      {historicalComparison.length > 0 && (
        <Card className="p-4 md:p-8">
          {!isPdfMode ? (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-slate-100 rounded-lg md:rounded-xl">
                  <History className="text-slate-600" size={16} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 text-xs md:text-base">
                    Con {systemSize} kW hubieras ahorrado
                  </h4>
                  <p className="text-[9px] md:text-[10px] text-slate-500">
                    {historicalComparison.length} periodos CFE
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-right">
                  <p className="text-lg md:text-2xl font-black text-emerald-600">${totalSavings.toLocaleString()}</p>
                  <p className="text-[9px] md:text-[10px] text-slate-400 hidden sm:block">ahorrados</p>
                </div>
                {showHistory ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </div>
            </button>
          ) : (
            <SectionTitle icon={History} title={`Ahorro Histórico con ${systemSize} kW`} subtitle={`${historicalComparison.length} periodos`} color="slate" />
          )}

          {(showHistory || isPdfMode) && (
            <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                <div className="bg-slate-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-slate-200">
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Pagaste CFE</p>
                  <p className="text-base md:text-xl font-black text-slate-800">${totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-emerald-200">
                  <p className="text-[9px] md:text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Con Solar</p>
                  <p className="text-base md:text-xl font-black text-emerald-700">${totalWouldPay.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-600 rounded-lg md:rounded-xl p-3 md:p-4">
                  <p className="text-[9px] md:text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-0.5">Tu Ahorro</p>
                  <p className="text-base md:text-xl font-black text-white">${totalSavings.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900 rounded-lg md:rounded-xl p-3 md:p-4">
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Cobertura</p>
                  <p className="text-base md:text-xl font-black text-white">{avgCoverage}%</p>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-lg md:rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
                <table className="w-full text-[10px] md:text-xs">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2 md:p-3 text-left font-bold text-slate-600">Periodo</th>
                      <th className="p-2 md:p-3 text-right font-bold text-slate-600 hidden sm:table-cell">kWh</th>
                      <th className="p-2 md:p-3 text-right font-bold text-slate-600">Pagaste</th>
                      <th className="p-2 md:p-3 text-right font-bold text-slate-600">Solar</th>
                      <th className="p-2 md:p-3 text-right font-bold text-slate-600 hidden md:table-cell">Cobertura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historicalComparison.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2 md:p-3 font-bold text-slate-700">{row.period}</td>
                        <td className="p-2 md:p-3 text-right text-slate-500 hidden sm:table-cell">{row.kwh.toLocaleString()}</td>
                        <td className="p-2 md:p-3 text-right font-bold text-slate-700">${row.amountPaid.toLocaleString()}</td>
                        <td className="p-2 md:p-3 text-right font-bold text-emerald-600">${row.amountWithSolar.toLocaleString()}</td>
                        <td className="p-2 md:p-3 text-right hidden md:table-cell">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            row.coverage >= 100 ? 'bg-emerald-100 text-emerald-700' :
                            row.coverage >= 70 ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {row.coverage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {avgCoverage < 100 && !isPdfMode && (
                <p className="text-[9px] text-slate-500 text-center">
                  Aumenta el sistema para mayor cobertura
                </p>
              )}
            </div>
          )}
        </Card>
      )}

      {/* ============================================================ */}
      {/* SCENARIO SIMULATOR */}
      {/* ============================================================ */}
      <Card className="p-4 md:p-8">
        <SectionTitle icon={Calculator} title="Escenario de Inflación" subtitle="Ajusta inflación tarifaria" color="purple" />

        <div className="mb-4 md:mb-10 p-4 md:p-8 bg-slate-50 rounded-xl md:rounded-3xl border border-slate-100">
          <div className="flex justify-between items-center mb-3 md:mb-8">
            <span className="text-[9px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">Inflación Anual</span>
            <span className="text-xl md:text-4xl font-black text-purple-600">{inflationRate}%</span>
          </div>
          {!isPdfMode ? (
            <>
              <input
                type="range"
                min={2}
                max={10}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                className="w-full h-2 md:h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[9px] md:text-[10px] font-bold text-slate-400 mt-2 md:mt-4 uppercase tracking-wider">
                <span>2%</span>
                <span>5%</span>
                <span>10%</span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-medium">Escenario conservador</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-6">
          <div className="bg-white rounded-xl md:rounded-3xl p-3 md:p-6 text-center border border-slate-100 shadow-sm">
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">Payback</p>
            <p className="text-base md:text-4xl font-black text-slate-900 tracking-tight">{financials.paybackYears}<span className="text-[9px] md:text-sm text-slate-400 font-bold ml-0.5">años</span></p>
          </div>
          <div className="bg-white rounded-xl md:rounded-3xl p-3 md:p-6 text-center border border-slate-100 shadow-sm">
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">Ahorro 25y</p>
            <p className="text-base md:text-4xl font-black text-emerald-600 tracking-tight">${(financials.totalSavings/1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-white rounded-xl md:rounded-3xl p-3 md:p-6 text-center border border-slate-100 shadow-sm">
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">TIR</p>
            <p className="text-base md:text-4xl font-black text-purple-600 tracking-tight">{financials.irr}%</p>
          </div>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* 25 YEAR PROJECTION */}
      {/* ============================================================ */}
      <Card className="p-4 md:p-8">
        <SectionTitle icon={TrendingUp} title="Proyección a 25 Años" subtitle={`${systemSize} kW · ${inflationRate}% inflación`} color="green" />

        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
          <div className="bg-emerald-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-emerald-100">
            <p className="text-[9px] md:text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Equilibrio</p>
            <p className="text-xl md:text-3xl font-black text-emerald-700 tracking-tight">{financials.paybackYears}</p>
            <p className="text-[9px] md:text-[10px] text-emerald-600/70 font-medium">años</p>
          </div>
          <div className="bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-slate-200">
            <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Año 1</p>
            <p className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">+${(financials.projection[1]?.savings / 1000).toFixed(0)}k</p>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">ahorro</p>
          </div>
          <div className="bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-slate-200">
            <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Año 10</p>
            <p className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">${(financials.projection[10]?.cumulative / 1000).toFixed(0)}k</p>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">acum.</p>
          </div>
          <div className="bg-emerald-600 rounded-xl md:rounded-2xl p-3 md:p-4">
            <p className="text-[9px] md:text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-0.5">25 Años</p>
            <p className="text-xl md:text-3xl font-black text-white tracking-tight">+${(financials.projection[25]?.cumulative / 1000000).toFixed(1)}M</p>
            <p className="text-[9px] md:text-[10px] text-emerald-200 font-medium">ganancia</p>
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="my-4 md:my-6">
          <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400"></div>
              <span className="text-[9px] md:text-[10px] text-slate-600 font-medium">Recuperando</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] md:text-[10px] text-slate-600 font-medium">Ganancia</span>
            </div>
          </div>
          <div className="relative h-8 md:h-10 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 to-red-300 flex items-center justify-center"
              style={{ width: `${Math.min((parseFloat(financials.paybackYears) / 25) * 100, 100)}%` }}
            >
              {parseFloat(financials.paybackYears) > 2 && (
                <span className="text-[9px] md:text-[10px] font-bold text-white px-1">{financials.paybackYears}y</span>
              )}
            </div>
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center"
              style={{ width: `${100 - Math.min((parseFloat(financials.paybackYears) / 25) * 100, 100)}%` }}
            >
              <span className="text-[9px] md:text-[10px] font-bold text-white px-1">+</span>
            </div>
          </div>
          <div className="flex justify-between mt-1.5 md:mt-2 text-[8px] md:text-[9px] text-slate-400 font-medium px-1">
            <span>0</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
            <span>25</span>
          </div>
        </div>

        {/* Year by Year Table */}
        <div className="rounded-lg md:rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-[10px] md:text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2 md:p-3 text-left font-bold text-slate-600">Año</th>
                <th className="p-2 md:p-3 text-right font-bold text-slate-600">CFE</th>
                <th className="p-2 md:p-3 text-right font-bold text-slate-600">Ahorro</th>
                <th className="p-2 md:p-3 text-right font-bold text-slate-600">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financials.projection.slice(1, showFullTable || isPdfMode ? 26 : 11).map((row) => {
                const isPaybackYear = row.cumulative >= 0 && financials.projection[row.year - 1]?.cumulative < 0;
                return (
                  <tr
                    key={row.year}
                    className={`transition-colors ${isPaybackYear ? 'bg-emerald-50' : row.cumulative < 0 ? 'bg-red-50/30' : 'hover:bg-slate-50'}`}
                  >
                    <td className="p-2 md:p-3 font-bold text-slate-700">
                      {row.year}
                      {isPaybackYear && (
                        <span className="ml-1 md:ml-2 text-[7px] md:text-[8px] bg-emerald-500 text-white px-1 py-0.5 rounded font-bold">✓</span>
                      )}
                    </td>
                    <td className="p-2 md:p-3 text-right text-red-400 font-medium">
                      <span className="line-through decoration-1">${(row.cfeWithoutSolar / 1000).toFixed(0)}k</span>
                    </td>
                    <td className="p-2 md:p-3 text-right text-emerald-600 font-bold">
                      +${(row.savings / 1000).toFixed(0)}k
                    </td>
                    <td className={`p-2 md:p-3 text-right font-black ${row.cumulative >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
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
        {!isPdfMode && (
          <button
            onClick={() => setShowFullTable(!showFullTable)}
            className="w-full mt-3 md:mt-4 py-2.5 md:py-3 bg-slate-50 hover:bg-slate-100 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            {showFullTable ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showFullTable ? 'Ver menos' : 'Ver 25 años'}
          </button>
        )}
      </Card>
    </div>
  );
};

export default FinancialSection;
