
import React from 'react';
import { XCircle, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Info } from 'lucide-react';
import Card from '../ui/Card';
import { FinancialAnalysis, SolarSystemSpecs } from '../../types';

interface ComparisonSectionProps {
  financials: FinancialAnalysis;
  system: SolarSystemSpecs;
  isPdfMode?: boolean;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ financials, system, isPdfMode = false }) => {
  return (
    <div className={`space-y-6 ${!isPdfMode ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>
      
      <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
        {/* Scenario A: Inaction */}
        <Card className="p-5 md:p-8 border-2 border-red-100 bg-gradient-to-br from-red-50 to-white shadow-xl shadow-red-100/30">
          <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
            <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
              <XCircle className="text-red-500 drop-shadow-sm" size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-2xl text-slate-900 tracking-tight leading-tight">Escenario A: Tendencial</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Status Quo (Seguir pagando)</p>
            </div>
          </div>
          
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between items-center py-2 md:py-3 border-b border-red-100/50 group relative">
              <span className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                Gasto Anual (Año 1)
                <Info size={12} className="text-slate-300" />
              </span>
              <span className="font-bold text-red-600 text-sm md:text-lg">
                ${financials.projection[1]?.cfeWithoutSolar.toLocaleString() || "133,000"}
              </span>
              {/* Tooltip simple */}
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg w-48 z-10">
                Lo que pagarías ese año específico a CFE sin paneles.
              </div>
            </div>

            <div className="flex justify-between items-center py-2 md:py-3 border-b border-red-100/50">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wide">
                  Gasto Anual (Año 10)
                </span>
                <span className="text-[10px] text-red-400 font-medium">
                  Proyectado con inflación
                </span>
              </div>
              <span className="font-bold text-red-600 text-sm md:text-lg">
                ${financials.projection[10]?.cfeWithoutSolar.toLocaleString() || "217,000"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 md:py-3 border-b border-red-100/50">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wide">
                  Gasto Anual (Año 25)
                </span>
                <span className="text-[10px] text-red-400 font-medium">
                  Sin detener el aumento
                </span>
              </div>
              <span className="font-bold text-red-600 text-sm md:text-lg">
                ${financials.projection[25]?.cfeWithoutSolar.toLocaleString() || "450,000"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 md:py-5 bg-red-100 rounded-xl md:rounded-2xl px-4 md:px-6 mt-3 md:mt-4">
              <div className="flex flex-col">
                <span className="font-black text-slate-800 uppercase tracking-wider text-[10px] md:text-xs">
                  Gasto Total Acumulado
                </span>
                <span className="text-[10px] text-red-500 font-bold">
                  Suma de 25 años a fondo perdido
                </span>
              </div>
              <span className="text-lg md:text-3xl font-black text-red-600 tracking-tight">
                ${(financials.totalCfeCost / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-8 p-3 md:p-5 bg-white rounded-xl md:rounded-2xl border border-red-100 shadow-sm flex gap-3 md:gap-4">
             <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={14} />
             <p className="text-red-800 text-[10px] md:text-xs leading-relaxed font-medium">
              <strong>Riesgo Financiero:</strong> Exposición total a inflación tarifaria sin generación de activos. Gasto 100% irrecuperable.
            </p>
          </div>
        </Card>

        {/* Scenario B: Solar */}
        <Card className="p-5 md:p-8 border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-xl shadow-emerald-100/30">
          <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
            <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
              <CheckCircle2 className="text-emerald-500 drop-shadow-sm" size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-2xl text-slate-900 tracking-tight leading-tight">Escenario B: Implementación</h3>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Eficiencia Tecnológica</p>
            </div>
          </div>
          
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between items-center py-2 md:py-3 border-b border-emerald-100/50">
              <span className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wide">Inversión Neta</span>
              <span className="font-bold text-slate-900 text-sm md:text-lg">${financials.netCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 md:py-3 border-b border-emerald-100/50">
              <span className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wide">Recuperación</span>
              <span className="font-bold text-emerald-600 text-sm md:text-lg">{financials.paybackYears} años</span>
            </div>
            <div className="flex justify-between items-center py-2 md:py-3 border-b border-emerald-100/50">
              <span className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wide">Ahorro Total</span>
              <span className="font-bold text-emerald-600 text-sm md:text-lg">${(financials.totalSavings/1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between items-center py-3 md:py-5 bg-emerald-100 rounded-xl md:rounded-2xl px-4 md:px-6 mt-3 md:mt-4">
              <span className="font-black text-slate-800 uppercase tracking-wider text-[9px] md:text-xs">Patrimonio Neto</span>
              <span className="text-lg md:text-3xl font-black text-emerald-600 tracking-tight">+${(financials.projection[25].cumulative / 1000000).toFixed(1)}M</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-8 p-3 md:p-5 bg-white rounded-xl md:rounded-2xl border border-emerald-100 shadow-sm flex gap-3 md:gap-4">
            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={14} />
            <p className="text-emerald-800 text-[10px] md:text-xs leading-relaxed font-medium">
              <strong>Solidez:</strong> Conversión de gasto operativo en inversión de capital (CAPEX) deducible y rentable.
            </p>
          </div>
        </Card>
      </div>

      {/* Final Summary */}
      <Card className="p-5 md:p-10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-none text-center relative overflow-hidden group shadow-2xl" glow>
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#E56334] to-[#DE3078]"></div>
        
        <Sparkles className="mx-auto text-yellow-400 mb-3 md:mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" size={24} />
        <h3 className="text-xl md:text-4xl font-black mb-3 md:mb-4 tracking-tight">Dictamen Final</h3>
        <p className="text-slate-400 text-[10px] md:text-base max-w-2xl mx-auto mb-6 md:mb-12 leading-relaxed font-medium px-2">
          Basado en el perfil de consumo analizado, la implementación del sistema fotovoltaico representa 
          la decisión financiera óptima con un riesgo técnico despreciable.
        </p>
        
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto mb-2">
            <div className={`${isPdfMode ? 'bg-slate-800 border-slate-700' : 'bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/15'} rounded-xl md:rounded-3xl p-3 md:p-8 border transition-colors`}>
              <p className="text-xl md:text-4xl font-black text-emerald-400 mb-1 md:mb-2 tracking-tight">{financials.paybackYears}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Años Payback</p>
            </div>
            <div className={`${isPdfMode ? 'bg-slate-800 border-slate-700' : 'bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/15'} rounded-xl md:rounded-3xl p-3 md:p-8 border transition-colors`}>
              <p className="text-xl md:text-4xl font-black text-purple-400 mb-1 md:mb-2 tracking-tight">{financials.irr}%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TIR Anual</p>
            </div>
            <div className={`${isPdfMode ? 'bg-slate-800 border-slate-700' : 'bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/15'} rounded-xl md:rounded-3xl p-3 md:p-8 border transition-colors`}>
              <p className="text-xl md:text-4xl font-black text-blue-400 mb-1 md:mb-2 tracking-tight">{system.coverage}%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Independencia</p>
            </div>
            <div className={`${isPdfMode ? 'bg-slate-800 border-slate-700' : 'bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/15'} rounded-xl md:rounded-3xl p-3 md:p-8 border transition-colors`}>
              <p className="text-xl md:text-4xl font-black text-orange-400 mb-1 md:mb-2 tracking-tight">25</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Años Garantía</p>
            </div>
          </div>
      </Card>
    </div>
  );
};

export default ComparisonSection;
