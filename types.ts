
import { LucideIcon } from 'lucide-react';

export interface ConsumptionPeriod {
  period: string;
  month: string;
  year: number;
  kwh: number;
  amount: number;
  days: number;
  season: 'cold' | 'mild' | 'hot';
  estimated?: boolean;
  current?: boolean;
}

export interface BillComponent {
  name: string;
  value: number;
  percentage: number;
  color: string;
  icon?: LucideIcon;
  [key: string]: any;
}

export interface ClientData {
  name: string;
  shortName: string;
  address: string;
  colony: string;
  city: string;
  postalCode: string;
  serviceNumber: string;
  accountNumber: string;
  tariff: string;
  tariffName: string;
  meterNumber: string;
  currentPeriod: string;
  dueDate: string;
  cutoffDate: string;
}

export interface SolarSystemSpecs {
  capacity: number;
  panels: number;
  panelWatts: number;
  panelType: string;
  inverterConfig: string;
  annualGeneration: number;
  coverage: string;
  area: number;
  co2Avoided: string;
  treesEquivalent: number;
}

export interface FinancialProjectionYear {
  year: number;
  generation: number;
  savings: number;
  cfeWithoutSolar: number;
  cumulative: number;
  roi: string;
}

export interface FinancialAnalysis {
  baseCost: number;
  iva: number;
  totalCost: number;
  isrDeduction: number;
  netCost: number;
  annualSavings: number;
  paybackYears: string;
  projection: FinancialProjectionYear[];
  totalSavings: number;
  totalCfeCost: number;
  roi25: string;
  npv: number;
}
