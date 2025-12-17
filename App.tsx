
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BarChart2, Activity, Sun, Wallet, Scale, Download, Loader2, FileText, AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import MannyLogo from './components/MannyLogo';
import { calculateSolarSystem, calculateFinancials, calculateOptimalSystemSize } from './utils/calculations';
import { useDiagnosis } from './context/DiagnosisContext';

// Sections
import OverviewSection from './components/sections/OverviewSection';
import ConsumptionSection from './components/sections/ConsumptionSection';
import SystemSection from './components/sections/SystemSection';
import FinancialSection from './components/sections/FinancialSection';
import ComparisonSection from './components/sections/ComparisonSection';
import HeroSection from './components/HeroSection';
import DiagnosisSection from './components/DiagnosisSection';

const App: React.FC = () => {
  const { data: diagnosisData, isLoading, error } = useDiagnosis();
  const [activeSection, setActiveSection] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  // State for calculations - initialize from diagnosis data
  const [inflationRate, setInflationRate] = useState(diagnosisData.systemDefaults.inflationRate);
  const [systemSize, setSystemSize] = useState(diagnosisData.systemDefaults.systemSize);

  // Update state when diagnosis data changes
  useEffect(() => {
    setInflationRate(diagnosisData.systemDefaults.inflationRate);
    setSystemSize(diagnosisData.systemDefaults.systemSize);
  }, [diagnosisData]);
  
  // Animation states
  const [animatedValues, setAnimatedValues] = useState({});

  // Derived Data - usando análisis de consumo real del cliente
  const consumptionAnalysis = diagnosisData.consumptionAnalysis;
  const optimalSystemSize = useMemo(
    () => calculateOptimalSystemSize(consumptionAnalysis),
    [consumptionAnalysis]
  );
  const solarSystem = useMemo(
    () => calculateSolarSystem(systemSize, consumptionAnalysis),
    [systemSize, consumptionAnalysis]
  );
  const financialAnalysis = useMemo(
    () => calculateFinancials(systemSize, solarSystem, inflationRate, consumptionAnalysis),
    [systemSize, solarSystem, inflationRate, consumptionAnalysis]
  );

  // Number Animation Effect
  useEffect(() => {
    const targets = {
      savings: financialAnalysis.annualSavings,
      payback: parseFloat(financialAnalysis.paybackYears),
      roi: parseFloat(financialAnalysis.irr),
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
      // Ensure fonts are fully loaded to avoid fallback rendering in the capture
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

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
            
            // Force disable all animations and transitions in PDF clone
            const allElements = element.querySelectorAll('*');
            allElements.forEach((el: any) => {
              if (el.style) {
                el.style.animation = 'none';
                el.style.transition = 'none';
                el.style.transform = '';
              }
            });
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdfWidth = canvas.width;
      const pdfHeight = canvas.height;
      
      // One long continuous page
      const customPdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [pdfWidth, pdfHeight] // Custom format to match content exactly
      });
      
      customPdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      customPdf.save(`Diagnostico_Solar_${diagnosisData.client.shortName.replace(/ /g, '_')}.pdf`);
      
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('Hubo un error al generar el PDF. Por favor intente de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#E56334] mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Cargando diagnóstico...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Diagnóstico no encontrado</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#E56334] selection:text-white pb-20 md:pb-0 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer flex items-center gap-4 hover:opacity-80 transition-opacity" onClick={() => setActiveSection('overview')}>
              <MannyLogo textSize="text-2xl md:text-3xl" />
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
                className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-6 md:py-3 bg-slate-900 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-bold shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} className="group-hover:text-[#E56334] transition-colors" />}
                <span className="hidden sm:inline">Descargar PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {activeSection === 'overview' && (
          <div className="animate-in fade-in duration-500">
            <HeroSection financials={financialAnalysis} system={solarSystem} />
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
              optimalSize={optimalSystemSize}
            />
          </div>
        )}
        {activeSection === 'financial' && (
          <div className="animate-in fade-in duration-500">
            <FinancialSection
              financials={financialAnalysis}
              inflationRate={inflationRate}
              setInflationRate={setInflationRate}
              consumption={diagnosisData.consumption}
              systemSize={systemSize}
              setSystemSize={setSystemSize}
              optimalSize={optimalSystemSize}
              consumptionAnalysis={consumptionAnalysis}
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
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 safe-area-bottom overflow-hidden">
        <div className="flex justify-between items-center px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 w-full py-2 rounded-xl transition-all duration-300
                ${activeSection === item.id 
                  ? 'text-[#E56334]' 
                  : 'text-slate-400 hover:text-slate-600'}`}
            >
              {activeSection === item.id && (
                <span className="absolute -top-2 w-8 h-1 bg-[#E56334] rounded-b-full shadow-[0_2px_10px_rgba(229,99,52,0.5)]"></span>
              )}
              <item.icon size={20} strokeWidth={activeSection === item.id ? 2.5 : 2} className="transition-transform duration-300 active:scale-90" />
              <span className={`text-[9px] font-bold tracking-wide transition-all duration-300 ${activeSection === item.id ? 'opacity-100 translate-y-0' : 'opacity-70'}`}>
                {item.label}
              </span>
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
      <div style={{ position: 'fixed', top: 0, left: '-5000px', width: '1200px', zIndex: -50 }} aria-hidden="true">
        <div 
          id="report-container"
          ref={reportRef} 
          className="pdf-mode w-[1200px] bg-white p-20 space-y-16 font-sans text-slate-900"
        >
           {/* Report Header */}
           <div className="flex justify-between items-center mb-10 pb-10 border-b-2 border-slate-100">
              <div className="flex items-center gap-5">
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded-full bg-gradient-to-r from-[#E56334] via-[#D14656] to-[#DE3078] shadow-lg shadow-[#E56334]/30"></div>
                  <div className="h-3 w-12 rounded-full bg-slate-200"></div>
                </div>
                <MannyLogo textSize="text-6xl" />
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diagnóstico Energético Integral</h1>
                <p className="text-slate-500 text-lg font-medium mt-2">{diagnosisData.client.currentPeriod}</p>
              </div>
           </div>
           
           <HeroSection financials={financialAnalysis} system={solarSystem} isPdfMode={true} />
           
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
                 roi: financialAnalysis.irr,
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
             <SystemSection systemSize={systemSize} setSystemSize={setSystemSize} solarSystem={solarSystem} optimalSize={optimalSystemSize} isPdfMode={true} />
           </section>

           <section className="break-inside-avoid">
             <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
               <Wallet size={32} className="text-slate-900" strokeWidth={2.5} />
               <h2 className="text-3xl font-black text-slate-900">Viabilidad Financiera</h2>
             </div>
             <FinancialSection
               financials={financialAnalysis}
               inflationRate={inflationRate}
               setInflationRate={() => {}}
               consumption={diagnosisData.consumption}
               systemSize={systemSize}
               setSystemSize={() => {}}
               optimalSize={optimalSystemSize}
               consumptionAnalysis={consumptionAnalysis}
               isPdfMode={true}
             />
           </section>

           <section className="break-inside-avoid">
             <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
               <Scale size={32} className="text-slate-900" strokeWidth={2.5} />
               <h2 className="text-3xl font-black text-slate-900">Comparativa & Conclusiones</h2>
             </div>
             <ComparisonSection financials={financialAnalysis} system={solarSystem} isPdfMode={true} />
           </section>

           <div className="mt-20 pt-10 border-t-2 border-slate-200 text-center text-slate-500 text-base font-medium">
             <p className="mb-2">Este documento es un diagnóstico técnico preliminar basado en la información histórica proporcionada.</p>
             <p className="uppercase tracking-widest text-xs font-bold">© 2025 Manny Solar. Confidential Engineering Report.</p>
           </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-12">
          {/* Mobile: Compact single row */}
          <div className="md:hidden flex items-center justify-between gap-3">
            <MannyLogo textSize="text-lg" />
            <div className="text-right">
              <p className="text-slate-400 text-[10px] font-medium truncate max-w-[140px]">{diagnosisData.client.shortName}</p>
              <p className="text-slate-600 text-[8px] font-bold uppercase tracking-wider">© 2025 Manny</p>
            </div>
          </div>

          {/* Desktop: Full layout */}
          <div className="hidden md:grid grid-cols-3 gap-12 text-left">
            <div>
              <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
                 <MannyLogo textSize="text-3xl" />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
                Ingeniería especializada en sistemas fotovoltaicos y eficiencia energética.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-white uppercase tracking-wider">Cliente</h4>
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">{diagnosisData.client.name}</p>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#E56334]"></div>
                   {diagnosisData.client.city}, {diagnosisData.client.postalCode}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-white uppercase tracking-wider">Detalles</h4>
              <p className="text-slate-400 text-sm font-medium mb-2">{diagnosisData.client.currentPeriod}</p>
              <p className="text-slate-500 text-xs leading-relaxed border-l-2 border-[#E56334] pl-3">
                Proyecciones basadas en tarifas vigentes CFE.
              </p>
            </div>
          </div>

          <div className="hidden md:block border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">© 2025 Manny Solar</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
