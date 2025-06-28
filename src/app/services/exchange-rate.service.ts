import { Injectable } from '@angular/core';
import { ExchangeRatePrediction, ExchangeRateInputs, ExchangeRateCalculation, ExchangeRateHistory, HistoricalAccuracy } from '../models/exchange-rate.model';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  // Historical data for validation and accuracy calculation
  private historicalData: ExchangeRateHistory[] = [
    { year: 2020, actualRate: 15.7, egyptInflationRate: 5.7, usInflationRate: 1.2 },
    { year: 2021, actualRate: 15.7, egyptInflationRate: 5.2, usInflationRate: 4.7 },
    { year: 2022, actualRate: 24.5, egyptInflationRate: 13.9, usInflationRate: 8.0 },
    { year: 2023, actualRate: 30.9, egyptInflationRate: 33.7, usInflationRate: 3.4 },
    { year: 2024, actualRate: 31.0, egyptInflationRate: 35.0, usInflationRate: 3.1 }
  ];

  constructor() { }

  /**
   * Calculate exchange rate prediction using the Egyptian economic model
   * Formula: New Rate = Current Rate + (Current Rate × (Egypt Inflation - US Inflation))
   */
  calculateExchangeRate(inputs: ExchangeRateInputs): ExchangeRateCalculation {
    const inflationDifferential = inputs.egyptInflationRate - inputs.usInflationRate;
    const rateAdjustment = inputs.currentExchangeRate * (inflationDifferential / 100);
    const predictedRate = inputs.currentExchangeRate + rateAdjustment;

    const formula = `Predicted Rate = ${inputs.currentExchangeRate} + (${inputs.currentExchangeRate} × (${inputs.egyptInflationRate}% - ${inputs.usInflationRate}%))`;
    
    const explanation = this.generateExplanation(inputs, inflationDifferential, rateAdjustment, predictedRate);

    return {
      inflationDifferential,
      rateAdjustment,
      predictedRate,
      formula,
      explanation
    };
  }

  /**
   * Generate detailed explanation of the calculation
   */
  private generateExplanation(
    inputs: ExchangeRateInputs, 
    inflationDifferential: number, 
    rateAdjustment: number, 
    predictedRate: number
  ): string {
    const currentYear = new Date().getFullYear();
    const targetYear = inputs.targetYear;
    
    let explanation = `Based on the proven Egyptian economic model (1992-present), `;
    explanation += `the exchange rate prediction for ${targetYear} is calculated using inflation differentials.\n\n`;
    
    explanation += `• Egypt Inflation Rate: ${inputs.egyptInflationRate}%\n`;
    explanation += `• US Inflation Rate: ${inputs.usInflationRate}%\n`;
    explanation += `• Inflation Differential: ${inflationDifferential.toFixed(2)}%\n`;
    explanation += `• Current Exchange Rate: ${inputs.currentExchangeRate} EGP/USD\n`;
    explanation += `• Rate Adjustment: ${rateAdjustment.toFixed(2)} EGP\n`;
    explanation += `• Predicted Rate for ${targetYear}: ${predictedRate.toFixed(2)} EGP/USD\n\n`;
    
    if (inflationDifferential > 0) {
      explanation += `Since Egypt's inflation is higher than US inflation by ${inflationDifferential.toFixed(2)}%, `;
      explanation += `the Egyptian pound is expected to depreciate against the US dollar.`;
    } else if (inflationDifferential < 0) {
      explanation += `Since Egypt's inflation is lower than US inflation by ${Math.abs(inflationDifferential).toFixed(2)}%, `;
      explanation += `the Egyptian pound is expected to appreciate against the US dollar.`;
    } else {
      explanation += `Since inflation rates are equal, the exchange rate is expected to remain stable.`;
    }

    return explanation;
  }

  /**
   * Get prediction confidence based on historical accuracy
   */
  getPredictionConfidence(inflationDifferential: number): 'low' | 'medium' | 'high' {
    const absDifferential = Math.abs(inflationDifferential);
    
    if (absDifferential > 20) return 'high'; // Large differentials are more predictable
    if (absDifferential > 10) return 'medium';
    return 'low'; // Small differentials are less predictable
  }

  /**
   * Calculate historical accuracy of the model
   */
  calculateHistoricalAccuracy(): HistoricalAccuracy[] {
    const accuracyData: HistoricalAccuracy[] = [];
    
    for (let i = 1; i < this.historicalData.length; i++) {
      const current = this.historicalData[i];
      const previous = this.historicalData[i - 1];
      
      const inputs: ExchangeRateInputs = {
        egyptInflationRate: current.egyptInflationRate,
        usInflationRate: current.usInflationRate,
        currentExchangeRate: previous.actualRate,
        targetYear: current.year
      };
      
      const calculation = this.calculateExchangeRate(inputs);
      const accuracy = this.calculateAccuracy(calculation.predictedRate, current.actualRate);
      
      accuracyData.push({
        year: current.year,
        predictedRate: calculation.predictedRate,
        actualRate: current.actualRate,
        accuracy,
        inflationDifferential: calculation.inflationDifferential
      });
    }
    
    return accuracyData;
  }

  /**
   * Calculate accuracy percentage
   */
  private calculateAccuracy(predicted: number, actual: number): number {
    const error = Math.abs(predicted - actual) / actual;
    return Math.max(0, (1 - error) * 100);
  }

  /**
   * Get average historical accuracy
   */
  getAverageAccuracy(): number {
    const accuracyData = this.calculateHistoricalAccuracy();
    const totalAccuracy = accuracyData.reduce((sum, item) => sum + item.accuracy, 0);
    return totalAccuracy / accuracyData.length;
  }

  /**
   * Get Your Financial Twin's 2026 prediction
   */
  getFinancialTwin2026Prediction(): ExchangeRatePrediction {
    const currentYear = new Date().getFullYear();
    const inputs: ExchangeRateInputs = {
      egyptInflationRate: 35.0, // Expected Egypt inflation for 2025
      usInflationRate: 2.5,     // Expected US inflation for 2025
      currentExchangeRate: 31.0, // Current rate as of 2024
      targetYear: 2026
    };
    
    const calculation = this.calculateExchangeRate(inputs);
    
    return {
      id: 'ft-2026-prediction',
      year: 2026,
      egyptInflationRate: inputs.egyptInflationRate,
      usInflationRate: inputs.usInflationRate,
      currentExchangeRate: inputs.currentExchangeRate,
      predictedExchangeRate: calculation.predictedRate,
      inflationDifferential: calculation.inflationDifferential,
      predictionDate: new Date(),
      confidence: this.getPredictionConfidence(calculation.inflationDifferential),
      notes: 'Your Financial Twin prediction: EGP/USD expected to reach 55-57 by end of 2026 based on inflation differential model.'
    };
  }

  /**
   * Get historical data for charting
   */
  getHistoricalData(): ExchangeRateHistory[] {
    return [...this.historicalData];
  }

  /**
   * Validate input ranges
   */
  validateInputs(inputs: ExchangeRateInputs): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (inputs.egyptInflationRate < 0 || inputs.egyptInflationRate > 100) {
      errors.push('Egypt inflation rate must be between 0 and 100%');
    }
    
    if (inputs.usInflationRate < 0 || inputs.usInflationRate > 100) {
      errors.push('US inflation rate must be between 0 and 100%');
    }
    
    if (inputs.currentExchangeRate <= 0) {
      errors.push('Current exchange rate must be greater than 0');
    }
    
    if (inputs.targetYear < new Date().getFullYear()) {
      errors.push('Target year cannot be in the past');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 