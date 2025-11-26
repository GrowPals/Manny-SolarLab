import React from 'react';
import { FileText, ArrowRight, Check } from 'lucide-react';
import { INVESTMENT_COST } from '../constants';

const formatCurrency = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);

const FiscalSection: React.FC = () => {
  const isrRate = 0.30; 
  const isrSavings = INVESTMENT_COST * isrRate;
  const iva = INVESTMENT_COST * 0.16;
  const totalRecovery = isrSavings + iva;
  const netInvestment = (INVESTMENT_COST * 1.16) - totalRecovery;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl shadow-2xl text-white p-8 md:p-12 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DE3078] rounded-full blur-[150px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-6 border border-white/20">
             <Check size={12} className="text-emerald-400" />
             <span className="text-xs font-semibold tracking-wide uppercase">Incentivo Gubernamental</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            Tu inversión se paga <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">con tus impuestos</span>
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8 text-lg">
            Bajo el <strong>Artículo 34 Fracción XIII de la LISR</strong>, el sistema es 100% deducible en el primer año fiscal. Convierte pasivos fiscales en activos energéticos.
          </p>

          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 font-bold">1</div>
                <span className="text-slate-200">Factura deducible al 100% (Maquinaria para energía renovable)</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 font-bold">2</div>
                <span className="text-slate-200">Recuperación inmediata de IVA</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 font-bold">3</div>
                <span className="text-slate-200">Depreciación acelerada en un solo ejercicio</span>
             </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
           <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6">Calculadora Fiscal</h3>
           
           <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                 <span className="text-slate-300">Inversión (Subtotal)</span>
                 <span className="font-mono font-semibold">{formatCurrency(INVESTMENT_COST)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 text-emerald-400">
                 <span>Ahorro ISR (30%)</span>
                 <span className="font-mono font-bold">- {formatCurrency(isrSavings)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 text-cyan-400 border-b border-white/5">
                 <span>Recuperación IVA (16%)</span>
                 <span className="font-mono font-bold">- {formatCurrency(iva)}</span>
              </div>
              
              <div className="pt-4 flex justify-between items-end">
                 <div className="text-xs text-slate-400">Costo Neto Real <br/> Después de Impuestos</div>
                 <div className="text-4xl font-bold text-white tracking-tight">{formatCurrency(netInvestment)}</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FiscalSection;