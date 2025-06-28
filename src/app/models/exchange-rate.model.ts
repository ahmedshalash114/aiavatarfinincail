export interface ExchangeRatePrediction {
  id: string;
  year: number;
  egyptInflationRate: number; // 0-100 percentage
  usInflationRate: number; // 0-100 percentage
  currentExchangeRate: number; // Current EGP/USD rate
  predictedExchangeRate: number; // Predicted rate for next year
  inflationDifferential: number; // Egypt inflation - US inflation
  predictionDate: Date;
  confidence: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface ExchangeRateHistory {
  year: number;
  actualRate: number;
  predictedRate?: number;
  egyptInflationRate: number;
  usInflationRate: number;
  accuracy?: number; // Percentage accuracy of prediction
}

export interface ExchangeRateInputs {
  egyptInflationRate: number;
  usInflationRate: number;
  currentExchangeRate: number;
  targetYear: number;
}

export interface ExchangeRateCalculation {
  inflationDifferential: number;
  rateAdjustment: number;
  predictedRate: number;
  formula: string;
  explanation: string;
}

export interface HistoricalAccuracy {
  year: number;
  predictedRate: number;
  actualRate: number;
  accuracy: number;
  inflationDifferential: number;
} 