import { ClientData, ConsumptionPeriod } from '../types';

export interface DiagnosisData {
  client: ClientData;
  consumption: ConsumptionPeriod[];
  billBreakdown?: {
    subtotalEnergy: number;
    iva: number;
    dap: number;
    total: number;
  };
  systemDefaults?: {
    systemSize: number;
    inflationRate: number;
  };
}

// Compress and encode data for URL
export function encodeDataForURL(data: DiagnosisData): string {
  const jsonString = JSON.stringify(data);
  const base64 = btoa(unescape(encodeURIComponent(jsonString)));
  return base64;
}

// Decode data from URL
export function decodeDataFromURL(encoded: string): DiagnosisData | null {
  try {
    const jsonString = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to decode URL data:', e);
    return null;
  }
}

// Get diagnosis ID from URL params
export function getDiagnosisIdFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Get encoded data from URL params
export function getEncodedDataFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('data');
}

// Generate shareable URL with diagnosis ID
export function generateShareableURL(id: string): string {
  const baseURL = window.location.origin + window.location.pathname;
  return `${baseURL}?id=${encodeURIComponent(id)}`;
}

// Generate shareable URL with encoded data (for small datasets)
export function generateEncodedURL(data: DiagnosisData): string {
  const baseURL = window.location.origin + window.location.pathname;
  const encoded = encodeDataForURL(data);
  return `${baseURL}?data=${encoded}`;
}
