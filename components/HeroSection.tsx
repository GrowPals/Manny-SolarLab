import React from 'react';
import { TOTAL_SAVINGS_25Y, ROI_YEARS, SYSTEM_SIZE_KW, PANEL_COUNT, CO2_TONS, CLIENT_DATA } from '../constants';
import { TrendingUp, Activity, FileBarChart, AlertTriangle, ArrowRight } from 'lucide-react';

const formatCurrency = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl mb-10 border border-slate-800">
      {/* Abstract Data Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[200%] bg-gradient-to-br from-[#E56334]/10 via-transparent to-transparent rotate-12 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
      </div>

      <div className="relative px-6 py-10 md:px-12 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Diagnóstico Energético <br />
              & Viabilidad Financiera
            </h1>
            <p className="text-slate-400 text-base md:text-lg mt-4 max-w-xl leading-relaxed">
              Reporte técnico para <strong>{CLIENT_DATA.shortName}</strong>. Análisis de perfil de consumo, ineficiencias tarifarias y proyección de rentabilidad patrimonial.
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
                <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(TOTAL_SAVINGS_25Y)}</div>
                <div className="text-xs text-[#E56334] mt-1 font-medium">Costo de Inacción</div>
             </div>
             <div className="p-6">
                <div className="text-slate-400 text-xs font-medium mb-1">Retorno de Inversión</div>
                <div className="text-2xl font-bold text-white tracking-tight">{ROI_YEARS} Años</div>
                <div className="text-xs text-emerald-500 mt-1 font-medium">Recuperación Acelerada</div>
             </div>
          </div>
          <div className="p-6">
             <div className="flex justify-between items-end mb-2">
                <div className="text-slate-400 text-xs font-medium">Capacidad Instalada Sugerida</div>
                <div className="text-white text-xl font-bold">{SYSTEM_SIZE_KW} kWp</div>
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