import { ClientData, ConsumptionPeriod, BillComponent } from './types';
import { Zap, Grid, Activity, Receipt, Gauge } from 'lucide-react';

export const BRAND_COLORS = {
  gradientStart: '#E56334',
  gradientMiddle: '#D14656',
  gradientEnd: '#DE3078',
  slate900: '#0f172a',
  slate50: '#f8fafc',
};

export const CLIENT_DATA: ClientData = {
  name: "REZA SANMARTIN ISIDRO ADOLFO",
  shortName: "Adolfo Reza",
  address: "Blvd. Manuel J. Clouthier 1934",
  colony: "Col. Del Moral",
  city: "León, Guanajuato",
  postalCode: "37125",
  serviceNumber: "063240800626",
  accountNumber: "15DP07F011525465",
  tariff: "PDBT",
  tariffName: "Pequeña Demanda Baja Tensión",
  meterNumber: "NB134D",
  currentPeriod: "09 Sep - 07 Nov 2025",
  dueDate: "23 Nov 2025",
  cutoffDate: "24 Nov 2025"
};

// Exact data from Page 1 (Current) and Page 2 (History) of the PDF Bill
export const CONSUMPTION_HISTORY: ConsumptionPeriod[] = [
  // Page 1: Current Bill
  { period: 'Nov 25', month: 'Nov', year: 2025, kwh: 4251, amount: 22201, days: 59, season: 'mild', current: true },
  // Page 2: History
  { period: 'Sep 25', month: 'Sep', year: 2025, kwh: 4154, amount: 21842, days: 60, season: 'hot' },
  { period: 'Jul 25', month: 'Jul', year: 2025, kwh: 10261, amount: 41766, days: 114, season: 'hot' },
  { period: 'Mar 25', month: 'Mar', year: 2025, kwh: 2370, amount: 12019, days: 29, season: 'mild' },
  { period: 'Feb 25', month: 'Feb', year: 2025, kwh: 1867, amount: 9647, days: 33, season: 'cold' },
  { period: 'Ene 25', month: 'Ene', year: 2025, kwh: 1616, amount: 8449, days: 29, season: 'cold' },
  { period: 'Dic 24', month: 'Dic', year: 2024, kwh: 1389, amount: 7196, days: 29, season: 'cold' },
  { period: 'Nov 24', month: 'Nov', year: 2024, kwh: 903, amount: 4750, days: 32, season: 'mild' },
  { period: 'Oct 24', month: 'Oct', year: 2024, kwh: 1745, amount: 9208, days: 77, season: 'mild' },
];

export const BILL_BREAKDOWN_DATA = {
  subtotalEnergy: 17766.02,
  iva: 2842.56,
  dap: 1591.96,
  previousBalance: 21842.81,
  payment: -21842.00,
  total: 22201.35,
  components: [
    { name: 'Energía', value: 7732.57, percentage: 43.5, color: '#3B82F6', icon: Zap },
    { name: 'Capacidad', value: 4986.42, percentage: 28.1, color: '#D14656', icon: Gauge },
    { name: 'Distribución', value: 4132.82, percentage: 23.3, color: '#F97316', icon: Grid },
    { name: 'Transmisión', value: 769.01, percentage: 4.3, color: '#06B6D4', icon: Activity },
    { name: 'Otros', value: 145.20, percentage: 0.8, color: '#64748B', icon: Receipt },
  ] as BillComponent[]
};

// System Defaults for Static Components
export const SYSTEM_SIZE_KW = 17.6;
export const PANEL_COUNT = 32;
export const INVESTMENT_COST = 309256;
export const TOTAL_SAVINGS_25Y = 6062744; // Updated from analysis
export const ROI_YEARS = 2.9; // Updated from analysis
export const CO2_TONS = 357;

// Static Projection Data for initial view
export const PROJECTION_DATA = Array.from({ length: 26 }, (_, i) => {
  const inflationRate = 0.05;
  const degradation = Math.pow(0.99, i);
  
  // Approximate calculations for static display
  const cfeCumulative = 145000 * ((Math.pow(1 + inflationRate, i + 1) - 1) / inflationRate);
  const solarSavingsAnnual = (28512 * degradation) * 5.22 * Math.pow(1 + inflationRate, i);
  // Simple linear accumulation for static data (approx)
  const solarCumulative = (solarSavingsAnnual * (i + 1)) - INVESTMENT_COST;

  return {
    year: i,
    cfeCumulative: Math.round(cfeCumulative),
    solarCumulative: Math.round(solarCumulative),
    value: Math.round(solarCumulative) // For tooltip
  };
});