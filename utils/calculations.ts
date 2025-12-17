import { SolarSystemSpecs, FinancialAnalysis, ConsumptionPeriod } from '../types';

// ============================================================================
// CONSTANTES DE CONFIGURACIÓN (Pueden ajustarse según región/proveedor)
// ============================================================================
export const SYSTEM_CONSTANTS = {
  // Panel specs
  PANEL_WATTS: 550,
  PANEL_TYPE: "Monocristalino PERC Tier 1",
  PANEL_AREA_M2: 2.4,
  PANEL_DEGRADATION_ANNUAL: 0.01, // 1% anual
  PANEL_WARRANTY_YEARS: 25,

  // Generación (HSP = Horas Sol Pico)
  HSP_LEON: 5.8, // Horas sol pico promedio León, Guanajuato
  PERFORMANCE_RATIO: 0.77, // Factor de rendimiento del sistema (pérdidas)

  // Costos de instalación
  COST_PER_KWP: 17600, // MXN por kWp instalado
  IVA_RATE: 0.16, // 16%
  ISR_DEDUCTION_RATE: 0.30, // 30% deducción fiscal

  // Factores ambientales
  CO2_KG_PER_KWH: 0.505, // kg CO2 evitado por kWh solar
  KWH_PER_TREE_YEAR: 22, // kWh equivalente a un árbol por año

  // Financieros
  DISCOUNT_RATE: 0.10, // 10% WACC para NPV

  // Factores de facturación CFE
  // DAP (Derecho de Alumbrado Público) - NO se ahorra con paneles
  DAP_PERCENTAGE: 0.103, // ~10.3% del total de factura es DAP
  // Cargo fijo bimestral - NO se ahorra con paneles
  CARGO_FIJO_BIMESTRAL: 73.78, // MXN (tarifa PDBT 2025)
};

// ============================================================================
// ANÁLISIS DE CONSUMO DEL CLIENTE
// ============================================================================
export interface ConsumptionAnalysis {
  totalKwhYear: number;           // Consumo anual total en kWh
  totalAmountYear: number;        // Gasto anual total en MXN
  avgKwhPerMonth: number;         // Promedio mensual kWh
  avgAmountPerMonth: number;      // Promedio mensual MXN
  avgCostPerKwh: number;          // Costo promedio por kWh ($/kWh) - INCLUYE DAP
  savableCostPerKwh: number;      // Costo ahorreable por kWh ($/kWh) - SIN DAP
  savableAmountYear: number;      // Monto anual ahorreable (sin DAP ni cargo fijo)
  avgKwhPerDay: number;           // Consumo promedio diario
  currentPeriodKwh: number;       // Consumo del periodo actual
  currentPeriodAmount: number;    // Monto del periodo actual
  maxKwh: number;                 // Consumo máximo registrado
  minKwh: number;                 // Consumo mínimo registrado
  seasonalAvg: {
    cold: number;   // Promedio temporada fría (Nov-Feb)
    hot: number;    // Promedio temporada caliente (May-Sep)
    mild: number;   // Promedio temporada templada (Mar-Abr, Oct)
  };
  growthRate: number;             // Tasa de crecimiento del consumo
}

/**
 * Analiza el historial de consumo y extrae métricas clave
 */
export const analyzeConsumption = (consumption: ConsumptionPeriod[]): ConsumptionAnalysis => {
  if (!consumption || consumption.length === 0) {
    throw new Error('No hay datos de consumo para analizar');
  }

  // Ordenar por fecha (más reciente primero)
  const sorted = [...consumption].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months.indexOf(b.month) - months.indexOf(a.month);
  });

  // Totales
  const totalDays = consumption.reduce((sum, c) => sum + c.days, 0);
  const totalKwh = consumption.reduce((sum, c) => sum + c.kwh, 0);
  const totalAmount = consumption.reduce((sum, c) => sum + c.amount, 0);

  // Normalizar a un año (365 días)
  const daysInYear = 365;
  const normalizationFactor = daysInYear / totalDays;
  const totalKwhYear = Math.round(totalKwh * normalizationFactor);
  const totalAmountYear = Math.round(totalAmount * normalizationFactor);

  // Promedios
  const avgKwhPerDay = totalKwh / totalDays;
  const avgKwhPerMonth = totalKwhYear / 12;
  const avgAmountPerMonth = totalAmountYear / 12;
  const avgCostPerKwh = totalAmount / totalKwh;

  // ============================================================================
  // CÁLCULO DEL COSTO AHORREABLE REAL
  // ============================================================================
  // La factura de CFE incluye cargos que NO se ahorran con paneles solares:
  // 1. DAP (Derecho de Alumbrado Público): ~10.3% del total
  // 2. Cargo fijo bimestral: ~$74 MXN
  //
  // Fórmula:
  // Monto ahorreable = Total - DAP - Cargo Fijo
  // Costo ahorreable por kWh = Monto ahorreable / kWh
  // ============================================================================
  const { DAP_PERCENTAGE, CARGO_FIJO_BIMESTRAL } = SYSTEM_CONSTANTS;

  // Calcular periodos por año (normalmente 6 bimestres)
  const avgDaysPerPeriod = totalDays / consumption.length;
  const periodsPerYear = 365 / avgDaysPerPeriod;
  const cargoFijoAnual = CARGO_FIJO_BIMESTRAL * periodsPerYear;

  // Monto total sin DAP
  const totalAmountSinDap = totalAmountYear * (1 - DAP_PERCENTAGE);

  // Monto ahorreable (sin DAP ni cargo fijo)
  const savableAmountYear = totalAmountSinDap - cargoFijoAnual;

  // Costo ahorreable por kWh
  const savableCostPerKwh = savableAmountYear / totalKwhYear;

  // Periodo actual
  const current = consumption.find(c => c.current) || sorted[0];
  const currentPeriodKwh = current.kwh;
  const currentPeriodAmount = current.amount;

  // Min/Max
  const maxKwh = Math.max(...consumption.map(c => c.kwh));
  const minKwh = Math.min(...consumption.map(c => c.kwh));

  // Promedios por temporada
  const coldPeriods = consumption.filter(c => c.season === 'cold');
  const hotPeriods = consumption.filter(c => c.season === 'hot');
  const mildPeriods = consumption.filter(c => c.season === 'mild');

  const calcSeasonAvg = (periods: ConsumptionPeriod[]) => {
    if (periods.length === 0) return 0;
    const totalKwh = periods.reduce((sum, p) => sum + p.kwh, 0);
    const totalDays = periods.reduce((sum, p) => sum + p.days, 0);
    return Math.round((totalKwh / totalDays) * 30); // Normalizar a mes de 30 días
  };

  // Tasa de crecimiento (comparando primer y último periodo disponible)
  const oldest = sorted[sorted.length - 1];
  const newest = sorted[0];
  const oldestDaily = oldest.kwh / oldest.days;
  const newestDaily = newest.kwh / newest.days;
  const growthRate = oldestDaily > 0 ? ((newestDaily - oldestDaily) / oldestDaily) * 100 : 0;

  return {
    totalKwhYear,
    totalAmountYear,
    avgKwhPerMonth,
    avgAmountPerMonth,
    avgCostPerKwh: Math.round(avgCostPerKwh * 100) / 100,
    savableCostPerKwh: Math.round(savableCostPerKwh * 100) / 100,
    savableAmountYear: Math.round(savableAmountYear),
    avgKwhPerDay: Math.round(avgKwhPerDay * 10) / 10,
    currentPeriodKwh,
    currentPeriodAmount,
    maxKwh,
    minKwh,
    seasonalAvg: {
      cold: calcSeasonAvg(coldPeriods),
      hot: calcSeasonAvg(hotPeriods),
      mild: calcSeasonAvg(mildPeriods),
    },
    growthRate: Math.round(growthRate),
  };
};

// ============================================================================
// CÁLCULO DEL SISTEMA SOLAR
// ============================================================================

/**
 * Calcula el tamaño óptimo del sistema basado en el consumo
 */
export const calculateOptimalSystemSize = (consumptionAnalysis: ConsumptionAnalysis): number => {
  const { HSP_LEON, PERFORMANCE_RATIO } = SYSTEM_CONSTANTS;

  // Generación anual por kWp = HSP * 365 * Performance Ratio
  const kwhPerKwpYear = HSP_LEON * 365 * PERFORMANCE_RATIO; // ~1630 kWh/kWp/año

  // Sistema óptimo para cubrir 100% del consumo
  const optimalSize = consumptionAnalysis.totalKwhYear / kwhPerKwpYear;

  // Redondear a 0.5 kWp más cercano
  return Math.round(optimalSize * 2) / 2;
};

/**
 * Calcula las especificaciones del sistema solar
 */
export const calculateSolarSystem = (
  systemSize: number,
  consumptionAnalysis?: ConsumptionAnalysis
): SolarSystemSpecs => {
  const {
    PANEL_WATTS,
    PANEL_TYPE,
    PANEL_AREA_M2,
    HSP_LEON,
    PERFORMANCE_RATIO,
    CO2_KG_PER_KWH,
    KWH_PER_TREE_YEAR
  } = SYSTEM_CONSTANTS;

  const panels = Math.ceil((systemSize * 1000) / PANEL_WATTS);

  // Generación anual = kWp * HSP * 365 días * Performance Ratio
  const annualGeneration = systemSize * HSP_LEON * 365 * PERFORMANCE_RATIO;

  // Cobertura basada en consumo real (si está disponible)
  const annualConsumption = consumptionAnalysis?.totalKwhYear || annualGeneration;
  const coverage = (annualGeneration / annualConsumption) * 100;

  // Selección de inversor según tamaño
  let inverterConfig = "1 × 15 kW Trifásico";
  if (systemSize <= 6) inverterConfig = "1 × 6 kW Monofásico";
  else if (systemSize <= 10) inverterConfig = "1 × 10 kW Trifásico";
  else if (systemSize <= 16) inverterConfig = "1 × 15 kW Trifásico";
  else if (systemSize <= 22) inverterConfig = "1 × 20 kW Trifásico";
  else inverterConfig = "2 × 15 kW Trifásicos";

  // Impacto ambiental
  const co2AvoidedKg = annualGeneration * CO2_KG_PER_KWH;
  const treesEquivalent = co2AvoidedKg / KWH_PER_TREE_YEAR;

  return {
    capacity: systemSize,
    panels,
    panelWatts: PANEL_WATTS,
    panelType: PANEL_TYPE,
    inverterConfig,
    annualGeneration: Math.round(annualGeneration),
    coverage: coverage.toFixed(1),
    area: Math.round(panels * PANEL_AREA_M2),
    co2Avoided: (co2AvoidedKg / 1000).toFixed(1), // Convertir a toneladas
    treesEquivalent: Math.round(treesEquivalent),
  };
};

// ============================================================================
// CÁLCULOS FINANCIEROS
// ============================================================================

/**
 * Calcula la TIR (Tasa Interna de Retorno) usando método de bisección
 */
const calculateIRR = (cashFlows: number[]): number => {
  let min = -0.5;
  let max = 2.0;
  let guess = 0.1;

  for (let i = 0; i < 50; i++) {
    guess = (min + max) / 2;
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + guess, t);
    }
    if (Math.abs(npv) < 1) break;
    if (npv > 0) min = guess;
    else max = guess;
  }
  return guess * 100;
};

/**
 * Calcula el análisis financiero completo del proyecto solar
 */
export const calculateFinancials = (
  systemSize: number,
  solarSystem: SolarSystemSpecs,
  inflationRate: number,
  consumptionAnalysis?: ConsumptionAnalysis
): FinancialAnalysis => {
  const {
    COST_PER_KWP,
    IVA_RATE,
    ISR_DEDUCTION_RATE,
    DISCOUNT_RATE,
    PANEL_DEGRADATION_ANNUAL,
  } = SYSTEM_CONSTANTS;

  // ============================================================================
  // USAR COSTO AHORREABLE REAL (SIN DAP NI CARGO FIJO)
  // ============================================================================
  // El savableCostPerKwh ya excluye DAP (~10.3%) y cargo fijo (~$74/bimestre)
  // Esto da un cálculo de ahorro más preciso y realista
  // ============================================================================
  const savableCostPerKwh = consumptionAnalysis?.savableCostPerKwh || 4.50;
  const savableAnnualBill = consumptionAnalysis?.savableAmountYear || 100000;

  // Costos de inversión
  const baseCost = systemSize * COST_PER_KWP;
  const iva = baseCost * IVA_RATE;
  const totalCost = baseCost + iva;
  const isrDeduction = baseCost * ISR_DEDUCTION_RATE;
  const netCost = totalCost - isrDeduction;

  // Ahorro anual inicial (año 1)
  // Usamos el costo ahorreable (sin DAP ni cargo fijo) para cálculo realista
  const rawAnnualSavings = solarSystem.annualGeneration * savableCostPerKwh;
  // No puedes ahorrar más de lo que pagas (límite de net metering)
  const annualSavings = Math.min(rawAnnualSavings, savableAnnualBill);

  // Variables para tracking
  let paybackYears = 0;
  let paybackFound = false;
  let runningCashflow = -totalCost;
  let cumulative = -netCost;
  let cfeCumulative = 0;
  let npv = -totalCost;

  const irrCashFlows = [-totalCost];

  // Proyección a 25 años
  const projection = Array.from({ length: 26 }, (_, i) => {
    const year = i;

    if (year === 0) {
      return {
        year: 0,
        generation: 0,
        savings: 0,
        cfeWithoutSolar: 0,
        cumulative: Math.round(-netCost),
        cfeCumulative: 0,
        roi: '0'
      };
    }

    // Degradación del panel: 1% anual compuesto
    const degradation = Math.pow(1 - PANEL_DEGRADATION_ANNUAL, year - 1);
    // Inflación de tarifas
    const inflationFactor = Math.pow(1 + inflationRate / 100, year - 1);

    // Generación con degradación
    const generation = solarSystem.annualGeneration * degradation;

    // Ahorro potencial (generación * costo kWh ahorreable ajustado por inflación)
    const potentialSavings = generation * savableCostPerKwh * inflationFactor;

    // Lo que pagarías a CFE sin paneles (monto ahorreable, sin DAP)
    const cfeWithoutSolar = savableAnnualBill * inflationFactor;

    // El ahorro real no puede exceder la factura (regla de net metering)
    const savings = Math.min(potentialSavings, cfeWithoutSolar);

    // Acumulados
    cumulative += savings;
    cfeCumulative += cfeWithoutSolar;

    // NPV
    npv += savings / Math.pow(1 + DISCOUNT_RATE, year);

    // Flujo para payback (año 1 incluye beneficio fiscal)
    const annualInflow = savings + (year === 1 ? isrDeduction : 0);
    runningCashflow += annualInflow;
    irrCashFlows.push(annualInflow);

    // Detectar punto de payback
    if (!paybackFound && runningCashflow >= 0) {
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

  const totalSavingsProjected = projection.reduce((sum, p) => sum + p.savings, 0);
  const totalCfeCost = projection.reduce((sum, p) => sum + p.cfeWithoutSolar, 0);
  const irr = calculateIRR(irrCashFlows);

  return {
    baseCost,
    iva,
    totalCost,
    isrDeduction,
    netCost,
    annualSavings: Math.round(annualSavings),
    paybackYears: paybackYears > 0 ? paybackYears.toFixed(1) : "> 25",
    projection,
    totalSavings: totalSavingsProjected,
    totalCfeCost,
    roi25: (((totalSavingsProjected - totalCost) / totalCost) * 100).toFixed(0),
    irr: irr.toFixed(1),
    npv: Math.round(npv),
  };
};
