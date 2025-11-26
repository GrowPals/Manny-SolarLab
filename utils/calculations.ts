import { SolarSystemSpecs, FinancialAnalysis } from '../types';

export const calculateSolarSystem = (systemSize: number): SolarSystemSpecs => {
  const panels = Math.ceil((systemSize * 1000) / 550);
  // HSP León ~5.8 * 365 * 0.77 performance factor
  const annualGeneration = systemSize * 1620; 
  const coverage = Math.min((annualGeneration / 28000) * 100, 100);
  
  return {
    capacity: systemSize,
    panels: panels,
    panelWatts: 550,
    panelType: "Monocristalino PERC Tier 1",
    inverterConfig: systemSize > 15 ? "2 × 8.5 kW String" : "1 × 15 kW String",
    annualGeneration: Math.round(annualGeneration),
    coverage: coverage.toFixed(1),
    area: Math.round(panels * 2.4),
    co2Avoided: ((annualGeneration * 0.505) / 1000).toFixed(1),
    treesEquivalent: Math.round((annualGeneration * 0.505) / 22),
  };
};

export const calculateFinancials = (
  systemSize: number, 
  solarSystem: SolarSystemSpecs, 
  inflationRate: number
): FinancialAnalysis => {
  const baseCost = systemSize * 17600; // ~$17,600 MXN per kWp installed
  const iva = baseCost * 0.16;
  const totalCost = baseCost + iva;
  const isrDeduction = baseCost * 0.30; // 30% ISR deduction benefit
  const netCost = totalCost - isrDeduction;
  
  // Average CFE price $5.22, 90% savings efficiency
  const annualSavings = Math.round(solarSystem.annualGeneration * 5.22 * 0.90);
  const paybackYears = netCost / annualSavings;
  
  let cumulative = -netCost;
  
  const projection = Array.from({ length: 26 }, (_, i) => {
    const year = i;
    if (year === 0) {
      return {
        year: 0,
        generation: 0,
        savings: 0,
        cfeWithoutSolar: 0,
        cumulative: -netCost,
        roi: '0'
      };
    }

    const degradation = Math.pow(0.99, i - 1);
    const inflationFactor = Math.pow(1 + inflationRate / 100, i - 1);
    const generation = solarSystem.annualGeneration * degradation;
    const savings = generation * 5.22 * inflationFactor * 0.90;
    const cfeWithoutSolar = 145000 * inflationFactor; // Base annual cost
    
    // Add savings to cumulative
    cumulative += savings;
    
    // In year 1, add the ISR deduction benefit cash flow effectively
    // (Already accounted for in netCost start point, but visually strictly flow)
    
    return {
      year,
      generation: Math.round(generation),
      savings: Math.round(savings),
      cfeWithoutSolar: Math.round(cfeWithoutSolar),
      cumulative: Math.round(cumulative),
      roi: ((cumulative / totalCost) * 100).toFixed(0)
    };
  });
  
  // Total savings is sum of annual savings + the tax benefit
  const totalSavingsProjected = projection.reduce((sum, p) => sum + p.savings, 0);
  const totalCfeCost = projection.reduce((sum, p) => sum + p.cfeWithoutSolar, 0);
  
  return {
    baseCost,
    iva,
    totalCost,
    isrDeduction,
    netCost,
    annualSavings,
    paybackYears: paybackYears.toFixed(1),
    projection,
    totalSavings: totalSavingsProjected,
    totalCfeCost,
    roi25: (((totalSavingsProjected - totalCost) / totalCost) * 100).toFixed(0),
    npv: Math.round(totalSavingsProjected * 0.6 - totalCost),
  };
};
