import React from 'react';
import { TOTAL_SAVINGS_25Y, ROI_YEARS, SYSTEM_SIZE_KW } from '../constants';
import { FileBarChart, AlertTriangle, Activity } from 'lucide-react';
import { FinancialAnalysis, SolarSystemSpecs } from '../types';
import { useDiagnosis } from '../context/DiagnosisContext';

interface HeroSectionProps {
  financials?: FinancialAnalysis;
  system?: SolarSystemSpecs;
  isPdfMode?: boolean;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);

const HeroSection: React.FC<HeroSectionProps> = ({ financials, system, isPdfMode = false }) => {
  const { data: diagnosisData } = useDiagnosis();

  // Use dynamic values if available, otherwise fallback to constants
  const totalCfeCost = financials ? financials.totalCfeCost : TOTAL_SAVINGS_25Y;
  const roiYears = financials ? financials.paybackYears : ROI_YEARS;
  const systemSize = system ? system.capacity.toFixed(1) : SYSTEM_SIZE_KW;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl mb-10 border border-slate-800">
      {/* Abstract Data Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Hide heavy blurs/gradients in PDF to avoid rendering artifacts */}
        {!isPdfMode && (
          <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[200%] bg-gradient-to-br from-[#E56334]/10 via-transparent to-transparent rotate-12 blur-3xl"></div>
        )}
        {/* Hide texture in PDF mode to avoid CORS/rendering issues */}
        {!isPdfMode && (
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
        )}
      </div>

      <div className="relative z-10 px-4 py-6 md:px-12 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        {/* Left Content: Report Header */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 mb-3 md:mb-4">
              <span className="relative flex h-2 w-2">
                {!isPdfMode && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E56334] opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E56334]"></span>
              </span>
              <span className="text-[10px] md:text-xs font-mono font-medium text-slate-300 uppercase tracking-widest">Diagnóstico: {diagnosisData.client.currentPeriod}</span>
            </div>

            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-3 md:mb-6">
              Diagnóstico Energético{' '}
              <span className={isPdfMode
                ? 'text-[#E56334]'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-[#E56334] to-[#DE3078]'}>
                & Viabilidad Financiera
              </span>
            </h1>
            <p className="text-slate-400 text-xs md:text-lg max-w-xl leading-relaxed font-medium">
              Reporte para <strong className="text-white">{diagnosisData.client.shortName}</strong>. Análisis de consumo, tarifas y proyección de rentabilidad.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4 pt-1 md:pt-2">
             <div className="px-3 py-2 md:px-5 md:py-3 bg-slate-800/50 border border-slate-700 rounded-lg md:rounded-xl flex items-center gap-2 md:gap-3">
                <AlertTriangle className="text-[#E56334]" size={16} />
                <div>
                   <div className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider">Estado Actual</div>
                   <div className="text-xs md:text-sm font-semibold text-white">Tarifa Excedente</div>
                </div>
             </div>
             <div className="px-3 py-2 md:px-5 md:py-3 bg-slate-800/50 border border-slate-700 rounded-lg md:rounded-xl flex items-center gap-2 md:gap-3">
                <Activity className="text-emerald-500" size={16} />
                <div>
                   <div className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider">Cobertura Solar</div>
                   <div className="text-xs md:text-sm font-semibold text-white">{system ? `${system.coverage}%` : '95%'}</div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Content: Key Metrics Dashboard */}
        <div className={`lg:col-span-5 rounded-xl md:rounded-2xl p-1 ${isPdfMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700'}`}>
          <div className="grid grid-cols-2 divide-x divide-slate-700/50 border-b border-slate-700/50">
             <div className="p-3 md:p-6">
                <div className="text-slate-400 text-[10px] md:text-xs font-medium mb-1 flex items-center gap-1">
                  <FileBarChart size={12} className="hidden md:block" /> Gasto CFE (25y)
                </div>
                <div className="text-lg md:text-2xl font-bold text-white tracking-tight">{formatCurrency(totalCfeCost)}</div>
                <div className="text-[10px] md:text-xs text-[#E56334] mt-1 font-medium">Costo Inacción</div>
             </div>
             <div className="p-3 md:p-6">
                <div className="text-slate-400 text-[10px] md:text-xs font-medium mb-1">Payback</div>
                <div className="text-lg md:text-2xl font-bold text-white tracking-tight">{roiYears} Años</div>
                <div className="text-[10px] md:text-xs text-emerald-500 mt-1 font-medium">Recuperación</div>
             </div>
          </div>
          <div className="p-3 md:p-6">
             <div className="flex justify-between items-end mb-2">
                <div className="text-slate-400 text-[10px] md:text-xs font-medium">Capacidad Sugerida</div>
                <div className="text-white text-base md:text-xl font-bold">{systemSize} kWp</div>
             </div>
             <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#E56334] to-[#DE3078] h-full w-[85%] rounded-full"></div>
             </div>
             <div className="flex justify-between mt-1.5 md:mt-2 text-[9px] md:text-[10px] text-slate-500">
                <span>Eficiencia estimada</span>
                <span>Tier-1 Tech</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
