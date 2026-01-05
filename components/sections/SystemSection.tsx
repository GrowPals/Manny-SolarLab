
import React from 'react';
import { Sun, Grid, Zap, Target, Leaf, Shield, Gauge, MapPin } from 'lucide-react';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import { SolarSystemSpecs } from '../../types';
import { SYSTEM_CONSTANTS } from '../../utils/calculations';

interface SystemSectionProps {
  systemSize: number;
  setSystemSize: (size: number) => void;
  solarSystem: SolarSystemSpecs;
  optimalSize: number;
  isPdfMode?: boolean;
}

const SystemSection: React.FC<SystemSectionProps> = ({ systemSize, setSystemSize, solarSystem, optimalSize, isPdfMode = false }) => {
  // Dynamic status based on coverage
  const getSystemStatus = () => {
    const coverage = parseFloat(solarSystem.coverage);
    if (coverage < 80) return { label: 'Subdimensionado', color: 'yellow' };
    if (coverage > 110) return { label: 'Sobredimensionado', color: 'orange' };
    return { label: 'Óptimo', color: 'emerald' };
  };

  const status = getSystemStatus();

  return (
    <div className={`space-y-6 md:space-y-8 ${!isPdfMode ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>

      {/* System Overview */}
      <Card className="p-5 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <SectionTitle icon={Sun} title="Tu Sistema Solar" subtitle="Especificaciones técnicas" color="orange" />
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              status.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
              status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {status.label}
            </span>
            <div className="text-right">
              <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {systemSize.toFixed(1)} <span className="text-sm text-[#E56334]">kW</span>
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-blue-100 transition-all hover:shadow-lg hover:-translate-y-1">
            <Grid className="mx-auto text-blue-500 mb-2 md:mb-4 drop-shadow-sm" size={24} strokeWidth={2} />
            <p className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{solarSystem.panels}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 md:mt-2">Paneles</p>
            <p className="text-[9px] text-slate-400 mt-1">{SYSTEM_CONSTANTS.PANEL_WATTS}W c/u</p>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-yellow-100 transition-all hover:shadow-lg hover:-translate-y-1">
            <Zap className="mx-auto text-yellow-500 mb-2 md:mb-4 drop-shadow-sm" size={24} strokeWidth={2} />
            <p className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{(solarSystem.annualGeneration/1000).toFixed(1)}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 md:mt-2">MWh/Año</p>
            <p className="text-[9px] text-slate-400 mt-1">{Math.round(solarSystem.annualGeneration/365)} kWh/día</p>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-emerald-100 transition-all hover:shadow-lg hover:-translate-y-1">
            <Target className="mx-auto text-emerald-500 mb-2 md:mb-4 drop-shadow-sm" size={24} strokeWidth={2} />
            <p className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{solarSystem.coverage || 0}%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 md:mt-2">Cobertura</p>
            <p className="text-[9px] text-slate-400 mt-1">de tu consumo</p>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-slate-100 shadow-sm hover:border-purple-100 transition-all hover:shadow-lg hover:-translate-y-1 group relative">
            <Gauge className="mx-auto text-purple-500 mb-2 md:mb-4 drop-shadow-sm" size={24} strokeWidth={2} />
            <p className="text-xl md:text-4xl font-black text-slate-900 tracking-tight">{solarSystem.area}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 md:mt-2">m² Req.</p>
            <p className="text-[9px] text-slate-400 mt-1">~{Math.ceil(solarSystem.area / 15)} cajones</p>
          </div>
        </div>
      </Card>

      {/* Technical Specs & Environment */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5 md:p-8">
           <div className="flex items-center gap-4 mb-6 md:mb-8">
            <Shield size={28} className="text-blue-600 drop-shadow-sm" strokeWidth={2} />
            <div>
              <h4 className="font-bold text-slate-900 text-base md:text-xl">Especificaciones Técnicas</h4>
              <p className="text-[10px] text-slate-400">Equipamiento incluido</p>
            </div>
          </div>
          <div className="space-y-2 md:space-y-4">
            {[
              { label: 'Módulos', value: `${solarSystem.panels}× ${solarSystem.panelType}` },
              { label: 'Potencia Panel', value: `${solarSystem.panelWatts}W` },
              { label: 'Inversores', value: solarSystem.inverterConfig },
              { label: 'Área Requerida', value: `${solarSystem.area} m²` },
              { label: 'Garantía Paneles', value: '25 años (80% rendimiento)' },
              { label: 'Monitoreo', value: 'WiFi + App 24/7' },
            ].map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 md:py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 md:px-4 rounded-xl transition-colors -mx-2 md:-mx-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{spec.label}</span>
                <span className={`text-[10px] md:text-sm font-bold text-slate-900 text-right max-w-[60%] ${isPdfMode ? '' : 'truncate'}`}>{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Location context */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <MapPin size={18} className="text-slate-400" />
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Irradiación Solar</p>
              <p className="text-xs text-slate-500">{SYSTEM_CONSTANTS.HSP_LEON} horas sol pico/día (León, Gto.)</p>
            </div>
          </div>
        </Card>

        <Card gradient className="p-5 md:p-8 text-white border-none flex flex-col justify-between shadow-xl shadow-[#DE3078]/20 relative overflow-hidden">
          {!isPdfMode && (
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          )}

          <div className="relative z-10">
            <Leaf className="mb-4 md:mb-6 text-white drop-shadow-md" size={32} strokeWidth={1.5} />
            <h4 className="font-black text-xl md:text-3xl mb-2 md:mb-3 tracking-tight">Impacto Ambiental</h4>
            <p className="text-white/80 text-[10px] md:text-sm mb-6 md:mb-10 max-w-xs leading-relaxed font-medium">
                Tu contribución anual al medio ambiente con este sistema:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-6 relative z-10">
            <div className={`${isPdfMode ? 'bg-white/20 border-white/30' : 'bg-white/10 backdrop-blur-md border-white/20'} rounded-xl md:rounded-2xl p-4 md:p-6 border`}>
              <p className="text-2xl md:text-5xl font-black mb-1 md:mb-2 tracking-tighter">{solarSystem.co2Avoided}</p>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Ton CO₂/año</p>
              <p className="text-[9px] text-white/50 mt-1">evitadas</p>
            </div>
            <div className={`${isPdfMode ? 'bg-white/20 border-white/30' : 'bg-white/10 backdrop-blur-md border-white/20'} rounded-xl md:rounded-2xl p-4 md:p-6 border`}>
              <p className="text-2xl md:text-5xl font-black mb-1 md:mb-2 tracking-tighter">{(solarSystem.treesEquivalent/1000).toFixed(1)}k</p>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Árboles</p>
              <p className="text-[9px] text-white/50 mt-1">equivalentes</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemSection;
