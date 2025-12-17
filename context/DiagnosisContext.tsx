import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClientData, ConsumptionPeriod, BillComponent } from '../types';
import { Zap, Grid, Activity, Receipt, Gauge } from 'lucide-react';
import {
  analyzeConsumption,
  calculateOptimalSystemSize,
  ConsumptionAnalysis,
  SYSTEM_CONSTANTS
} from '../utils/calculations';

// Import defaults from constants
import {
  CLIENT_DATA as DEFAULT_CLIENT,
  CONSUMPTION_HISTORY as DEFAULT_CONSUMPTION,
} from '../constants';

export interface BillBreakdownData {
  subtotalEnergy: number;
  iva: number;
  dap: number;
  previousBalance?: number;
  payment?: number;
  total: number;
  components: BillComponent[];
}

export interface DiagnosisData {
  client: ClientData;
  consumption: ConsumptionPeriod[];
  consumptionAnalysis: ConsumptionAnalysis;
  billBreakdown: BillBreakdownData;
  systemDefaults: {
    systemSize: number;
    inflationRate: number;
  };
}

interface DiagnosisContextType {
  data: DiagnosisData;
  isLoading: boolean;
  error: string | null;
  diagnosisId: string | null;
}

// Calcular análisis por defecto
const defaultConsumptionAnalysis = analyzeConsumption(DEFAULT_CONSUMPTION);
const defaultOptimalSize = calculateOptimalSystemSize(defaultConsumptionAnalysis);

// Generar desglose de factura basado en datos reales
function generateBillBreakdown(consumptionAnalysis: ConsumptionAnalysis): BillBreakdownData {
  const total = consumptionAnalysis.currentPeriodAmount;
  const { DAP_PERCENTAGE, IVA_RATE } = SYSTEM_CONSTANTS;

  // Desglose típico de factura CFE PDBT (porcentajes aproximados)
  // Estos porcentajes son estándar para tarifa PDBT
  const subtotalEnergy = total / (1 + IVA_RATE); // Quitar IVA para obtener subtotal
  const iva = subtotalEnergy * IVA_RATE;
  const dap = total * DAP_PERCENTAGE; // DAP ~10.3% del total (NO se ahorra con solar)

  // Desglose de componentes del subtotal de energía
  // Basado en estructura típica de factura CFE
  const components: BillComponent[] = [
    {
      name: 'Energía',
      value: Math.round(subtotalEnergy * 0.435),
      percentage: 43.5,
      color: '#3B82F6',
      icon: Zap
    },
    {
      name: 'Capacidad',
      value: Math.round(subtotalEnergy * 0.281),
      percentage: 28.1,
      color: '#D14656',
      icon: Gauge
    },
    {
      name: 'Distribución',
      value: Math.round(subtotalEnergy * 0.233),
      percentage: 23.3,
      color: '#F97316',
      icon: Grid
    },
    {
      name: 'Transmisión',
      value: Math.round(subtotalEnergy * 0.043),
      percentage: 4.3,
      color: '#06B6D4',
      icon: Activity
    },
    {
      name: 'Otros',
      value: Math.round(subtotalEnergy * 0.008),
      percentage: 0.8,
      color: '#64748B',
      icon: Receipt
    },
  ];

  return {
    subtotalEnergy: Math.round(subtotalEnergy),
    iva: Math.round(iva),
    dap: Math.round(dap),
    total: Math.round(total),
    components
  };
}

const defaultBillBreakdown = generateBillBreakdown(defaultConsumptionAnalysis);

const defaultData: DiagnosisData = {
  client: DEFAULT_CLIENT,
  consumption: DEFAULT_CONSUMPTION,
  consumptionAnalysis: defaultConsumptionAnalysis,
  billBreakdown: defaultBillBreakdown,
  systemDefaults: {
    systemSize: defaultOptimalSize,
    inflationRate: 5
  }
};

const DiagnosisContext = createContext<DiagnosisContextType>({
  data: defaultData,
  isLoading: false,
  error: null,
  diagnosisId: null
});

export const useDiagnosis = () => useContext(DiagnosisContext);

interface Props {
  children: ReactNode;
}

export const DiagnosisProvider: React.FC<Props> = ({ children }) => {
  const [data, setData] = useState<DiagnosisData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');

      if (!id) {
        // No ID provided, use defaults
        setIsLoading(false);
        return;
      }

      setDiagnosisId(id);

      try {
        // Try to load from JSON file
        const response = await fetch(`/data/${id}.json`);

        if (!response.ok) {
          throw new Error(`Diagnóstico "${id}" no encontrado`);
        }

        const jsonData = await response.json();

        // Analizar consumo automáticamente
        const consumptionAnalysis = analyzeConsumption(jsonData.consumption);

        // Calcular tamaño óptimo del sistema (si no está especificado)
        const optimalSize = calculateOptimalSystemSize(consumptionAnalysis);
        const systemSize = jsonData.systemDefaults?.systemSize || optimalSize;

        // Generar desglose de factura automáticamente
        const billBreakdown = generateBillBreakdown(consumptionAnalysis);

        const fullData: DiagnosisData = {
          client: jsonData.client,
          consumption: jsonData.consumption,
          consumptionAnalysis,
          billBreakdown,
          systemDefaults: {
            systemSize,
            inflationRate: jsonData.systemDefaults?.inflationRate || 5
          }
        };

        setData(fullData);
      } catch (err) {
        console.error('Error loading diagnosis:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DiagnosisContext.Provider value={{ data, isLoading, error, diagnosisId }}>
      {children}
    </DiagnosisContext.Provider>
  );
};

export default DiagnosisContext;
