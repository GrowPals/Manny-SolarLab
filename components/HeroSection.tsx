import React from 'react';
import { TOTAL_SAVINGS_25Y, ROI_YEARS, SYSTEM_SIZE_KW, CLIENT_DATA } from '../constants';
import { FileBarChart, AlertTriangle, Activity } from 'lucide-react';
import { FinancialAnalysis, SolarSystemSpecs } from '../types';

interface HeroSectionProps {
  financials?: FinancialAnalysis;
  system?: SolarSystemSpecs;
  isPdfMode?: boolean;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);

const HeroSection: React.FC<HeroSectionProps> = ({ financials, system, isPdfMode = false }) => {
  // Use dynamic values if available, otherwise fallback to constants
  const totalSavings = financials ? financials.totalSavings : TOTAL_SAVINGS_25Y;
  const roiYears = financials ? financials.paybackYears : ROI_YEARS;
  const systemSize = system ? system.capacity.toFixed(1) : SYSTEM_SIZE_KW;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl mb-10 border border-slate-800">
      {/* Abstract Data Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[200%] bg-gradient-to-br from-[#E56334]/10 via-transparent to-transparent rotate-12 blur-3xl"></div>
        {/* Hide texture in PDF mode to avoid CORS/rendering issues */}
        {!isPdfMode && (
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
        )}
      </div>

      <div className="relative px-5 py-8 md:px-12 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Content: Report Header */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E56334] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E56334]"></span>
              </span>
              <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-widest">Diagnóstico Generado: Nov 2025</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4 md:mb-6">
              Diagnóstico Energético <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E56334] to-[#DE3078]">
                 & Viabilidad Financiera
              </span>
            </h1>
            <p className="text-slate-400 text-sm md:text-lg max-w-xl leading-relaxed font-medium">
              Reporte técnico para <strong className="text-white">{CLIENT_DATA.shortName}</strong>. Análisis de perfil de consumo, ineficiencias tarifarias y proyección de rentabilidad patrimonial.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
             <div className="px-5 py-3 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center gap-3">
                <AlertTriangle className="text-[#E56334]" size={20} />
                <div>
                   <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Estado Actual</div>
                   <div className="text-sm font-semibold text-white">Tarifa Excedente (Crítica)</div>
                </div>
             </div>
             <div className="px-5 py-3 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center gap-3">
                <Activity className="text-emerald-500" size={20} />
                <div>
                   <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Potencial de Optimización</div>
                   <div className="text-sm font-semibold text-white">95% Reducción de Costos</div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Content: Key Metrics Dashboard */}
        <div className="lg:col-span-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-1">
          <div className="grid grid-cols-2 divide-x divide-slate-700/50 border-b border-slate-700/50">
             <div className="p-6">
                <div className="text-slate-400 text-xs font-medium mb-1 flex items-center gap-1">
                  <FileBarChart size={14} /> Gasto Proyectado (25y)
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(totalSavings)}</div>
                <div className="text-xs text-[#E56334] mt-1 font-medium">Costo de Inacción</div>
             </div>
             <div className="p-6">
                <div className="text-slate-400 text-xs font-medium mb-1">Retorno de Inversión</div>
                <div className="text-2xl font-bold text-white tracking-tight">{roiYears} Años</div>
                <div className="text-xs text-emerald-500 mt-1 font-medium">Recuperación Acelerada</div>
             </div>
          </div>
          <div className="p-6">
             <div className="flex justify-between items-end mb-2">
                <div className="text-slate-400 text-xs font-medium">Capacidad Instalada Sugerida</div>
                <div className="text-white text-xl font-bold">{systemSize} kWp</div>
             </div>
             <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#E56334] to-[#DE3078] h-full w-[85%] rounded-full"></div>
             </div>
             <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                <span>Eficiencia estimada</span>
                <span>Tier-1 Technology</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;