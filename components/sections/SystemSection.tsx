
import React from 'react';
import { Sun, Grid, Zap, Target, Leaf, Shield, Gauge } from 'lucide-react';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import { SolarSystemSpecs } from '../../types';

interface SystemSectionProps {
  systemSize: number;
  setSystemSize: (size: number) => void;
  solarSystem: SolarSystemSpecs;
  isPdfMode?: boolean;
}

const SystemSection: React.FC<SystemSectionProps> = ({ systemSize, setSystemSize, solarSystem, isPdfMode = false }) => {
  return (
    <div className={`space-y-6 md:space-y-8 ${!isPdfMode ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>
      
      {/* Custom Styles for Slider to ensure consistency */}
      <style>{`
        input[type=range] {
          -webkit-appearance: none; 
          background: transparent; 
        }
        /* WebKit/Blink */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: #ffffff;
          border: 6px solid #E56334;
          cursor: pointer;
          margin-top: -12px; 
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 15px -3px rgba(229, 99, 52, 0.3);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          background: linear-gradient(to right, #E56334, #DE3078);
          border-radius: 999px;
        }
        
        /* Firefox */
        input[type=range]::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: #ffffff;
          border: 6px solid #E56334;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
        }
        input[type=range]::-moz-range-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          background: linear-gradient(to right, #E56334, #DE3078);
          border-radius: 999px;
        }

        input[type=range]:focus {
          outline: none;
        }
      `}</style>

      {/* System Configurator */}
      <Card className="p-5 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-10 gap-4">
          <SectionTitle icon={Sun} title="Configurador Técnico" subtitle="Dimensionamiento de planta" color="orange" />
          <div className="flex flex-col items-end">
            <span className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                {systemSize.toFixed(1)} <span className="text-sm md:text-lg text-[#E56334]">kWp</span>
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Potencia Seleccionada</span>
          </div>
        </div>
        
        <div className="mb-8 md:mb-12 p-5 md:p-8 bg-slate-50/80 rounded-3xl border border-slate-100">
          <div className="relative w-full h-10 flex items-center">
            <input
              type="range"
              min={10}
              max={25}
              step={0.5}
              value={systemSize}
              onChange={(e) => setSystemSize(parseFloat(e.target.value))}
              className="w-full z-20 relative"
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
            <span>10 kWp</span>
            
            {/* Dynamic System Status Label */}
            {parseFloat(solarSystem.coverage) < 80 ? (
               <span className="text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 shadow-sm">Subdimensionado</span>
            ) : parseFloat(solarSystem.coverage) > 110 ? (
               <span className="text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 shadow-sm">Sobredimensionado</span>
            ) : (
               <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">Rango Óptimo</span>
            )}

            <span>25 kWp</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-blue-100 transition-all hover:shadow-lg hover:-translate-y-1">
            <Grid className="mx-auto text-blue-500 mb-2 md:mb-4 drop-shadow-sm" size={24} strokeWidth={2} />
            <p className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{solarSystem.panels}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 md:mt-2">Paneles</p>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-yellow-100 transition-all hover:shadow-lg hover:-translate-y-1">
            <Zap className="mx-auto text-yellow-500 mb-2 md:mb-4 drop-shadow-sm" size={24} strokeWidth={2} />
            <p className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{(solarSystem.annualGeneration/1000).toFixed(1)}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 md:mt-2">MWh/Año</p>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-emerald-100 transition-all hover:shadow-lg hover:-translate-y-1">
            <Target className="mx-auto text-emerald-500 mb-2 md:mb-4 drop-shadow-sm" size={24} strokeWidth={2} />
            <p className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{solarSystem.coverage}%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 md:mt-2">Cobertura</p>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-purple-100 transition-all hover:shadow-lg hover:-translate-y-1 group relative">
            <Gauge className="mx-auto text-purple-500 mb-2 md:mb-4 drop-shadow-sm" size={24} strokeWidth={2} />
            <p className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{solarSystem.area}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 md:mt-2">m² Req.</p>
            
            {/* Tooltip de espacio */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 bg-slate-800 text-white text-[9px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
              Equivale a ~{Math.ceil(solarSystem.area / 15)} cajones de auto
            </div>
          </div>
        </div>
      </Card>

      {/* Technical Specs & Environment */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5 md:p-8">
           <div className="flex items-center gap-4 mb-6 md:mb-8">
            <Shield size={28} className="text-blue-600 drop-shadow-sm" strokeWidth={2} />
            <h4 className="font-bold text-slate-900 text-base md:text-xl">Especificaciones</h4>
          </div>
          <div className="space-y-2 md:space-y-4">
            {[
              { label: 'Módulos', value: `${solarSystem.panels}× ${solarSystem.panelType}` },
              { label: 'Potencia Panel', value: `${solarSystem.panelWatts}W` },
              { label: 'Inversores', value: solarSystem.inverterConfig },
              { label: 'Área', value: `${solarSystem.area} m²` },
              { label: 'Garantía', value: '25 años (80%)' },
              { label: 'Monitoreo', value: 'WiFi + App 24/7' },
            ].map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 md:py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 md:px-4 rounded-xl transition-colors -mx-2 md:-mx-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{spec.label}</span>
                <span className="text-[10px] md:text-sm font-bold text-slate-900 text-right max-w-[60%] truncate">{spec.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card gradient className="p-5 md:p-8 text-white border-none flex flex-col justify-between shadow-xl shadow-[#DE3078]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <Leaf className="mb-4 md:mb-6 text-white drop-shadow-md" size={32} strokeWidth={1.5} />
            <h4 className="font-black text-xl md:text-3xl mb-2 md:mb-3 tracking-tight">Impacto Ambiental</h4>
            <p className="text-white/80 text-[10px] md:text-sm mb-6 md:mb-10 max-w-xs leading-relaxed font-medium">
                Mitigación de huella de carbono anual equivalente a:
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-6 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <p className="text-2xl md:text-5xl font-black mb-1 md:mb-2 tracking-tighter">{solarSystem.co2Avoided}</p>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Ton CO₂</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <p className="text-2xl md:text-5xl font-black mb-1 md:mb-2 tracking-tighter">{(solarSystem.treesEquivalent/1000).toFixed(1)}k</p>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Árboles</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemSection;
