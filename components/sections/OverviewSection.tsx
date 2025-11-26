
import React from 'react';
import { 
  PiggyBank, Target, TrendingUp, Zap, AlertCircle, MapPin, 
  Receipt
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import { CLIENT_DATA, BILL_BREAKDOWN_DATA } from '../../constants';
import { FinancialAnalysis, SolarSystemSpecs } from '../../types';

interface OverviewSectionProps {
  financials: FinancialAnalysis;
  system: SolarSystemSpecs;
  animatedValues: any;
  isPdfMode?: boolean;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ financials, system, animatedValues, isPdfMode = false }) => {
  
  const StatCard = ({ icon: Icon, label, value, suffix = "", trend = null, color = "orange" }: any) => {
    const colors: any = {
      orange: "text-[#E56334]",
      green: "text-emerald-500",
      blue: "text-blue-500",
      purple: "text-purple-500"
    };
    
    return (
      <Card className="p-4 md:p-6 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <Icon size={24} className={`${colors[color]} drop-shadow-sm`} strokeWidth={2} />
          {trend && (
            <div className={`flex items-center gap-1 text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-full border
              ${trend > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
              <TrendingUp size={10} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="mt-2 md:mt-4">
          <p className="text-lg md:text-3xl font-black text-slate-900 tracking-tight leading-none">
            {value}<span className="text-[9px] md:text-sm text-slate-400 ml-1 font-bold">{suffix}</span>
          </p>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 md:mt-2">{label}</p>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard 
          icon={PiggyBank} 
          label="Ahorro Anual" 
          value={`$${(animatedValues.savings || 0).toLocaleString()}`}
          color="green"
          trend={90}
        />
        <StatCard 
          icon={Target} 
          label="Retorno (ROI)" 
          value={animatedValues.payback || "0.0"}
          suffix="años"
          color="blue"
        />
        <StatCard 
          icon={TrendingUp} 
          label="ROI 25 Años" 
          value={`${animatedValues.roi || 0}%`}
          color="purple"
        />
        <StatCard 
          icon={Zap} 
          label="Cobertura" 
          value={`${animatedValues.coverage || 0}%`}
          color="orange"
        />
      </div>

      {/* Client + Chart */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
        <Card dark className="p-5 md:p-8 flex flex-col justify-between shadow-xl shadow-slate-900/20">
          <div>
            <div className="flex justify-between items-start mb-5 md:mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest border border-red-500/20 mb-2 md:mb-3">
                  <AlertCircle size={10} strokeWidth={3} />
                  Consumo Crítico
                </span>
                <h2 className="text-lg md:text-2xl font-black text-white leading-tight">{CLIENT_DATA.name}</h2>
                <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-2 font-medium">
                  <MapPin size={12} className="text-[#E56334]" />
                  {CLIENT_DATA.address}
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tarifa</p>
                <p className="text-xl font-black text-[#E56334]">{CLIENT_DATA.tariff}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-8 pt-5 md:pt-8 border-t border-slate-800">
              <div>
                <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Factura Actual</p>
                <p className="text-lg md:text-3xl font-black text-white tracking-tight">${BILL_BREAKDOWN_DATA.total.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Costo Promedio</p>
                <p className="text-lg md:text-3xl font-black text-[#E56334] tracking-tight">$5.22<span className="text-[10px] md:text-sm text-slate-500 ml-1 font-bold">/kWh</span></p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 md:p-8">
          <SectionTitle icon={TrendingUp} title="Proyección de Ahorro" subtitle="Acumulado primeros 10 años" color="green" />
          <div className="h-48 md:h-56 w-full -ml-2 min-w-0">
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={financials.projection.slice(0, 10)}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} width={35} />
                <Tooltip 
                  contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }}
                  formatter={(v: any) => [`$${v.toLocaleString()}`, 'Ahorro']}
                  labelFormatter={(v) => `Año ${v}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  fill="url(#savingsGrad)" 
                  isAnimationActive={!isPdfMode}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bill Breakdown */}
      <Card className="p-5 md:p-8">
        <SectionTitle icon={Receipt} title="Análisis del Recibo CFE" subtitle="¿Qué estás pagando realmente?" color="blue" />
        <div className="grid lg:grid-cols-2 gap-8 items-center mt-4">
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={BILL_BREAKDOWN_DATA.components}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  cornerRadius={6}
                  isAnimationActive={!isPdfMode}
                >
                  {BILL_BREAKDOWN_DATA.components.map((entry, index) => (
                    <Cell key={index} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(v: number) => `$${v.toLocaleString()}`}
                   contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 md:space-y-4">
            {BILL_BREAKDOWN_DATA.components.map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                       <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-900 block">{item.name}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-medium">{item.percentage}% del total</span>
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-slate-900">${item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OverviewSection;
