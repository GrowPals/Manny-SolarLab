
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BarChart2, Activity, Sun, Wallet, Scale, Download, Loader2, FileText
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import MannyLogo from './components/MannyLogo';
import { calculateSolarSystem, calculateFinancials } from './utils/calculations';
import { CLIENT_DATA } from './constants';

// Sections
import OverviewSection from './components/sections/OverviewSection';
import ConsumptionSection from './components/sections/ConsumptionSection';
import SystemSection from './components/sections/SystemSection';
import FinancialSection from './components/sections/FinancialSection';
import ComparisonSection from './components/sections/ComparisonSection';
import HeroSection from './components/HeroSection';
import DiagnosisSection from './components/DiagnosisSection';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  // State for calculations
  const [inflationRate, setInflationRate] = useState(5);
  const [systemSize, setSystemSize] = useState(17.6);
  
  // Animation states
  const [animatedValues, setAnimatedValues] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAnimYear, setCurrentAnimYear] = useState(0);

  // Derived Data
  const solarSystem = useMemo(() => calculateSolarSystem(systemSize), [systemSize]);
  const financialAnalysis = useMemo(() => calculateFinancials(systemSize, solarSystem, inflationRate), [systemSize, solarSystem, inflationRate]);

  // Number Animation Effect
  useEffect(() => {
    const targets = {
      savings: financialAnalysis.annualSavings,
      payback: parseFloat(financialAnalysis.paybackYears),
      roi: parseFloat(financialAnalysis.roi25),
      coverage: parseFloat(solarSystem.coverage)
    };
    
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      
      setAnimatedValues({
        savings: Math.round(targets.savings * eased),
        payback: (targets.payback * eased).toFixed(1),
        roi: Math.round(targets.roi * eased),
        coverage: (targets.coverage * eased).toFixed(0)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, [financialAnalysis, solarSystem]);

  // Timeline Animation Effect
  useEffect(() => {
    if (isPlaying && currentAnimYear < 25) {
      const timer = setTimeout(() => {
        setCurrentAnimYear(prev => prev + 1);
      }, 100); // Speed of animation
      return () => clearTimeout(timer);
    } else if (currentAnimYear >= 25) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentAnimYear]);

  const navItems = [
    { id: 'overview', label: 'Resumen', icon: BarChart2 },
    { id: 'consumption', label: 'Consumo', icon: Activity },
    { id: 'system', label: 'Sistema', icon: Sun },
    { id: 'financial', label: 'Inversión', icon: Wallet },
    { id: 'comparison', label: 'Comparativa', icon: Scale },
  ];

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      // Small delay to ensure any re-renders or font loads are settled
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // High resolution for sharpness
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200, // Force desktop width context
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById('report-container');
          if (element) {
            // Ensure visibility in clone context
            element.style.display = 'block';
            element.style.opacity = '1';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = canvas.width;
      const pdfHeight = canvas.height;
      
      // One long continuous page
      const customPdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [pdfWidth, pdfHeight] // Custom format to match content exactly
      });
      
      customPdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      customPdf.save(`Diagnostico_Solar_${CLIENT_DATA.shortName.replace(/ /g, '_')}.pdf`);
      
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('Hubo un error al generar el PDF. Por favor intente de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#E56334] selection:text-white pb-24 md:pb-0 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer flex items-center gap-4 hover:opacity-80 transition-opacity" onClick={() => setActiveSection('overview')}>
              <MannyLogo textSize="text-3xl" />
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2 p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300
                    ${activeSection === item.id 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50 transform scale-105' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                >
                  <item.icon size={18} className={activeSection === item.id ? 'text-[#E56334]' : ''} />
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="group-hover:text-[#E56334] transition-colors" />}
                <span className="hidden sm:inline">Descargar Diagnóstico PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeSection === 'overview' && (
          <div className="animate-in fade-in duration-500">
            <HeroSection />
            <OverviewSection 
              financials={financialAnalysis} 
              system={solarSystem} 
              animatedValues={animatedValues} 
            />
          </div>
        )}
        {activeSection === 'consumption' && (
          <div className="animate-in fade-in duration-500">
            <ConsumptionSection />
          </div>
        )}
        {activeSection === 'system' && (
          <div className="animate-in fade-in duration-500">
            <SystemSection 
              systemSize={systemSize}
              setSystemSize={setSystemSize}
              solarSystem={solarSystem}
            />
          </div>
        )}
        {activeSection === 'financial' && (
          <div className="animate-in fade-in duration-500">
            <FinancialSection 
              financials={financialAnalysis}
              inflationRate={inflationRate}
              setInflationRate={setInflationRate}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentAnimYear={currentAnimYear}
              setCurrentAnimYear={setCurrentAnimYear}
            />
          </div>
        )}
        {activeSection === 'comparison' && (
          <div className="animate-in fade-in duration-500">
            <ComparisonSection 
              financials={financialAnalysis}
              system={solarSystem}
            />
          </div>
        )}
      </main>

      {/* Bottom Nav Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-6 py-3 z-50 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all active:scale-95
                ${activeSection === item.id 
                  ? 'text-[#E56334]' 
                  : 'text-slate-400'}`}
            >
              <item.icon size={22} strokeWidth={activeSection === item.id ? 2.5 : 2} />
              <span className={`text-[9px] font-bold ${activeSection === item.id ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 
        HIDDEN REPORT VIEW FOR PDF GENERATION 
        IMPORTANT: Positioned fixed to the LEFT OFF-SCREEN (-5000px).
        This ensures it doesn't expand the document width (causing scrollbars)
        and doesn't render 0x0 size (causing broken content).
      */}
      <div style={{ position: 'fixed', top: 0, left: '-5000px', width: '1200px', zIndex: -50 }}>
        <div 
          id="report-container"
          ref={reportRef} 
          className="w-[1200px] bg-white p-20 space-y-16 font-sans text-slate-900"
        >
           {/* Report Header */}
           <div className="flex justify-between items-center mb-10 pb-10 border-b-2 border-slate-100">
              <MannyLogo textSize="text-6xl" />
              <div className="text-right">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diagnóstico Energético Integral</h1>
                <p className="text-slate-500 text-lg font-medium mt-2">Noviembre 2025</p>
              </div>
           </div>
           
           <HeroSection />
           
           <section className="break-inside-avoid">
             <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
               <BarChart2 size={32} className="text-slate-900" strokeWidth={2.5} />
               <h2 className="text-3xl font-black text-slate-900">Resumen Ejecutivo</h2>
             </div>
             {/* Pass static values for PDF to avoid animation delay */}
             <OverviewSection 
               financials={financialAnalysis} 
               system={solarSystem} 
               animatedValues={{
                 savings: financialAnalysis.annualSavings,
                 payback: financialAnalysis.paybackYears,
                 roi: financialAnalysis.roi25,
                 coverage: solarSystem.coverage
               }}
               isPdfMode={true}
             />
           </section>

           <section className="break-inside-avoid">
             <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
               <Activity size={32} className="text-slate-900" strokeWidth={2.5} />
               <h2 className="text-3xl font-black text-slate-900">Análisis de Consumo</h2>
             </div>
             <DiagnosisSection isPdfMode={true} />
             <div className="mt-8">
                <ConsumptionSection isPdfMode={true} />
             </div>
           </section>

           <section className="break-inside-avoid">
             <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
               <Sun size={32} className="text-slate-900" strokeWidth={2.5} />
               <h2 className="text-3xl font-black text-slate-900">Solución Técnica</h2>
             </div>
             <SystemSection systemSize={systemSize} setSystemSize={setSystemSize} solarSystem={solarSystem} />
           </section>

           <section className="break-inside-avoid">
             <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
               <Wallet size={32} className="text-slate-900" strokeWidth={2.5} />
               <h2 className="text-3xl font-black text-slate-900">Viabilidad Financiera</h2>
             </div>
             {/* Disable playing/animations for PDF view */}
             <FinancialSection 
               financials={financialAnalysis} 
               inflationRate={inflationRate} 
               setInflationRate={() => {}} 
               isPlaying={false} 
               setIsPlaying={() => {}} 
               currentAnimYear={25} 
               setCurrentAnimYear={() => {}} 
             />
           </section>

           <section className="break-inside-avoid">
             <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
               <Scale size={32} className="text-slate-900" strokeWidth={2.5} />
               <h2 className="text-3xl font-black text-slate-900">Comparativa & Conclusiones</h2>
             </div>
             <ComparisonSection financials={financialAnalysis} system={solarSystem} />
           </section>

           <div className="mt-20 pt-10 border-t-2 border-slate-200 text-center text-slate-500 text-base font-medium">
             <p className="mb-2">Este documento es un diagnóstico técnico preliminar basado en la información histórica proporcionada.</p>
             <p className="uppercase tracking-widest text-xs font-bold">© 2025 Manny Solar. Confidential Engineering Report.</p>
           </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
                 <MannyLogo textSize="text-3xl" />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
                Ingeniería especializada en sistemas fotovoltaicos y eficiencia energética para el sector comercial e industrial de alto consumo.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-white uppercase tracking-wider">Datos del Cliente</h4>
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">{CLIENT_DATA.name}</p>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#E56334]"></div>
                   {CLIENT_DATA.address}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#E56334]"></div>
                   {CLIENT_DATA.city}, {CLIENT_DATA.postalCode}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-white uppercase tracking-wider">Detalles del Reporte</h4>
              <p className="text-slate-400 text-sm font-medium mb-2">Diagnóstico generado: Noviembre 2025</p>
              <p className="text-slate-500 text-xs leading-relaxed border-l-2 border-[#E56334] pl-3">
                Los cálculos presentados son proyecciones basadas en las tarifas vigentes de CFE y el histórico de consumo.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">© 2025 Manny Solar. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
