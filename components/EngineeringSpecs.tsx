import React from 'react';
import { SYSTEM_SIZE_KW, PANEL_COUNT } from '../constants';
import { Box, Cable, Monitor, ShieldCheck, Sun, CheckCircle2, LayoutGrid, Leaf, Wifi } from 'lucide-react';

const SpecCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; tags: string[]; color: string }> = ({ icon, title, subtitle, tags, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${color} group-hover:scale-110 duration-300`}>
      {icon}
    </div>
    <h4 className="font-bold text-slate-900 text-lg mb-1">{title}</h4>
    <p className="text-slate-500 text-sm mb-4">{subtitle}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <span key={idx} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const EngineeringSpecs: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Visual Spec Cards */}
      <SpecCard 
        icon={<Sun size={24} className="text-[#E56334]" />}
        title="Generación"
        subtitle={`${PANEL_COUNT} Módulos Monocristalinos PERC`}
        tags={['550W Potencia', 'Tier 1 Quality', 'Half-Cell Tech']}
        color="bg-orange-50"
      />
      <SpecCard 
        icon={<Cable size={24} className="text-[#D14656]" />}
        title="Inversión"
        subtitle="Inversor Central Inteligente"
        tags={['Eficiencia 98.6%', '2 MPPTs', 'Protección AFCI']}
        color="bg-rose-50"
      />
      <SpecCard 
        icon={<Wifi size={24} className="text-[#DE3078]" />}
        title="Conectividad"
        subtitle="Monitoreo 24/7 en App Móvil"
        tags={['Tiempo Real', 'Alertas Email', 'Histórico']}
        color="bg-pink-50"
      />
      <SpecCard 
        icon={<ShieldCheck size={24} className="text-emerald-600" />}
        title="Blindaje"
        subtitle="Paquete de Garantías Total"
        tags={['25 Años Potencia', '12 Años Producto', 'Instalación']}
        color="bg-emerald-50"
      />

      {/* Large Technical Summary Card */}
      <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row gap-12 items-center">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E56334] to-[#DE3078] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
        
        <div className="flex-1 relative z-10">
           <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
             <LayoutGrid className="text-[#E56334]" />
             Dimensionamiento Técnico
           </h3>
           <p className="text-slate-400 mb-8 max-w-xl">
             Sistema diseñado con precisión satelital considerando la irradiación específica de León, GTO (5.8 HSP) para maximizar la producción.
           </p>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Potencia Total</div>
                <div className="text-3xl font-bold text-white">{SYSTEM_SIZE_KW} <span className="text-lg text-[#E56334]">kWp</span></div>
              </div>
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Producción Anual</div>
                <div className="text-3xl font-bold text-white">28.5 <span className="text-lg text-[#E56334]">MWh</span></div>
              </div>
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Área Techo</div>
                <div className="text-3xl font-bold text-white">~85 <span className="text-lg text-[#E56334]">m²</span></div>
              </div>
           </div>
        </div>

        <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative z-10 min-w-[300px]">
           <h4 className="font-bold mb-4 flex items-center gap-2">
             <Leaf className="text-emerald-400" size={18} />
             Impacto Ambiental
           </h4>
           <ul className="space-y-4">
             <li className="flex justify-between items-center border-b border-white/10 pb-2">
               <span className="text-slate-300 text-sm">CO₂ Evitado</span>
               <span className="font-bold">357 Tons</span>
             </li>
             <li className="flex justify-between items-center border-b border-white/10 pb-2">
               <span className="text-slate-300 text-sm">Árboles Plantados</span>
               <span className="font-bold">16,250 Eq.</span>
             </li>
             <li className="flex justify-between items-center">
               <span className="text-slate-300 text-sm">Autos Fuera</span>
               <span className="font-bold">145 / año</span>
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default EngineeringSpecs;