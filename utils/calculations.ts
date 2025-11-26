import { SolarSystemSpecs, FinancialAnalysis } from '../types';

export const calculateSolarSystem = (systemSize: number): SolarSystemSpecs => {
  const panels = Math.ceil((systemSize * 1000) / 550);
  // HSP León ~5.8 * 365 * 0.77 performance factor
  const annualGeneration = systemSize * 1620; 
  // Allow coverage > 100% for display to show oversizing, but logic will cap financial savings
  const coverage = (annualGeneration / 28000) * 100;
  
  // Inverter selection logic
  let inverterConfig = "1 × 15 kW Trifásico";
  if (systemSize <= 6) inverterConfig = "1 × 6 kW Monofásico";
  else if (systemSize <= 10) inverterConfig = "1 × 10 kW Trifásico";
  else if (systemSize <= 16) inverterConfig = "1 × 15 kW Trifásico"; // 15kW is good for up to ~19.5kWp (130% DC/AC)
  else if (systemSize <= 22) inverterConfig = "1 × 20 kW Trifásico";
  else inverterConfig = "2 × 15 kW Trifásicos";

  return {
    capacity: systemSize,
    panels: panels,
    panelWatts: 550,
    panelType: "Monocristalino PERC Tier 1",
    inverterConfig: inverterConfig,
    annualGeneration: Math.round(annualGeneration),
    coverage: coverage.toFixed(1),
    area: Math.round(panels * 2.4),
    co2Avoided: ((annualGeneration * 0.505) / 1000).toFixed(1),
    treesEquivalent: Math.round((annualGeneration * 0.505) / 22),
  };
};

// Helper for IRR
const calculateIRR = (cashFlows: number[]): number => {
  let min = -0.5; // Allow negative returns just in case
  let max = 2.0; // Up to 200% IRR
  let guess = 0.1;
  
  for (let i = 0; i < 50; i++) {
    guess = (min + max) / 2;
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + guess, t);
    }
    if (Math.abs(npv) < 1) break; // Precision threshold
    if (npv > 0) min = guess;
    else max = guess;
  }
  return guess * 100;
};

export const calculateFinancials = (
  systemSize: number, 
  solarSystem: SolarSystemSpecs, 
  inflationRate: number
): FinancialAnalysis => {
  // ... (existing code up to projection loop end)
  
  const baseCost = systemSize * 17600; // ~$17,600 MXN per kWp installed
  const iva = baseCost * 0.16;
  const totalCost = baseCost + iva;
  const isrDeduction = baseCost * 0.30; // 30% ISR deduction benefit
  const netCost = totalCost - isrDeduction;
  
  // Average CFE price $5.22, 90% savings efficiency factor (system losses, etc)
  // Initial savings estimation (capped at 100% of consumption bill for PDBT net metering rules)
  const rawAnnualSavings = solarSystem.annualGeneration * 5.22 * 0.90;
  const baseAnnualBill = 133000;
  const annualSavings = Math.min(rawAnnualSavings, baseAnnualBill);
  
  // Payback calculation iteration (more accurate than simple division)
  let paybackYears = 0;
  let paybackFound = false;
  let runningCashflow = -totalCost; // Start with full investment out

  let cumulative = -netCost; // For display graph (starts at net cost to show tax benefit impact visually)
  let cfeCumulative = 0;
  let npv = -totalCost; // Initial investment (Cash flow Year 0)
  const discountRate = 0.10; // 10% WACC
  
  // Array for IRR Calculation: Year 0 is negative total investment
  const irrCashFlows = [-totalCost];

  const projection = Array.from({ length: 26 }, (_, i) => {
    const year = i;
    if (year === 0) {
      return {
        year: 0,
        generation: 0,
        savings: 0,
        cfeWithoutSolar: 0,
        cumulative: -netCost,
        cfeCumulative: 0,
        roi: '0'
      };
    }

    const degradation = Math.pow(0.99, i - 1);
    const inflationFactor = Math.pow(1 + inflationRate / 100, i - 1);
    
    const generation = solarSystem.annualGeneration * degradation;
    // Calculate theoretical savings
    const potentialSavings = generation * 5.22 * inflationFactor * 0.90;
    const cfeWithoutSolar = baseAnnualBill * inflationFactor;
    
    // Cap savings at the bill amount (Net Metering limit: you can't save more than the bill)
    const savings = Math.min(potentialSavings, cfeWithoutSolar);
    
    // Add savings to cumulative
    cumulative += savings;
    cfeCumulative += cfeWithoutSolar;
    
    // NPV Calculation
    npv += savings / Math.pow(1 + discountRate, year);

    // Payback Calculation Logic
    // Year 1 includes the tax benefit inflow
    const annualInflow = savings + (year === 1 ? isrDeduction : 0);
    runningCashflow += annualInflow;
    
    // Add to IRR flows
    irrCashFlows.push(annualInflow);
    
    if (!paybackFound && runningCashflow >= 0) {
       // Linear interpolation for fraction of year
       const prevBalance = runningCashflow - annualInflow;
       const fraction = Math.abs(prevBalance) / annualInflow;
       paybackYears = (year - 1) + fraction;
       paybackFound = true;
    }
    
    return {
      year,
      generation: Math.round(generation),
      savings: Math.round(savings),
      cfeWithoutSolar: Math.round(cfeWithoutSolar),
      cumulative: Math.round(cumulative),
      cfeCumulative: Math.round(cfeCumulative),
      roi: ((cumulative / totalCost) * 100).toFixed(0)
    };
  });
  
  // Total savings is sum of annual savings + the tax benefit
  const totalSavingsProjected = projection.reduce((sum, p) => sum + p.savings, 0);
  const totalCfeCost = projection.reduce((sum, p) => sum + p.cfeWithoutSolar, 0);
  
  const irr = calculateIRR(irrCashFlows);

  return {
    baseCost,
    iva,
    totalCost,
    isrDeduction,
    netCost,
    annualSavings,
    paybackYears: paybackYears > 0 ? paybackYears.toFixed(1) : "> 25",
    projection,
    totalSavings: totalSavingsProjected,
    totalCfeCost,
    roi25: (((totalSavingsProjected - totalCost) / totalCost) * 100).toFixed(0),
    irr: irr.toFixed(1),
    npv: Math.round(npv),
  };
};
