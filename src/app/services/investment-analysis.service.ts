import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface InvestmentData {
  initialAmount: number;
  goldAllocation: number;
  equityAllocation: number;
  fixedIncomeAllocation: number;
  investmentPeriod: number;
  startDate: Date;
}

export interface InvestmentResult {
  initialAmount: number;
  finalAmount: number;
  totalReturn: number;
  totalReturnPercentage: number;
  breakdown: {
    gold: {
      amount: number;
      return: number;
      returnPercentage: number;
    };
    equity: {
      amount: number;
      return: number;
      returnPercentage: number;
    };
    fixedIncome: {
      amount: number;
      return: number;
      returnPercentage: number;
    };
  };
  yearlyData: YearlyData[];
}

export interface YearlyData {
  year: number;
  goldValue: number;
  equityValue: number;
  fixedIncomeValue: number;
  totalValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvestmentAnalysisService {
  // Historical returns for the last 5 years
  private readonly GOLD_RETURN = 2.57; // 257%
  private readonly EQUITY_RETURN = 2.11; // 211%
  private readonly FIXED_INCOME_RETURN = 0.35; // 35%

  constructor(private storageService: StorageService) {}

  calculateInvestmentReturns(data: InvestmentData): InvestmentResult {
    const { initialAmount, goldAllocation, equityAllocation, fixedIncomeAllocation, investmentPeriod } = data;
    
    // Calculate initial allocations
    const goldAmount = (initialAmount * goldAllocation) / 100;
    const equityAmount = (initialAmount * equityAllocation) / 100;
    const fixedIncomeAmount = (initialAmount * fixedIncomeAllocation) / 100;

    // Calculate final values
    const goldFinal = goldAmount * (1 + this.GOLD_RETURN);
    const equityFinal = equityAmount * (1 + this.EQUITY_RETURN);
    const fixedIncomeFinal = fixedIncomeAmount * (1 + this.FIXED_INCOME_RETURN);

    const finalAmount = goldFinal + equityFinal + fixedIncomeFinal;
    const totalReturn = finalAmount - initialAmount;
    const totalReturnPercentage = (totalReturn / initialAmount) * 100;

    // Generate yearly breakdown
    const yearlyData: YearlyData[] = [];
    for (let year = 1; year <= investmentPeriod; year++) {
      const yearProgress = year / investmentPeriod;
      
      const goldValue = goldAmount + (goldFinal - goldAmount) * yearProgress;
      const equityValue = equityAmount + (equityFinal - equityAmount) * yearProgress;
      const fixedIncomeValue = fixedIncomeAmount + (fixedIncomeFinal - fixedIncomeAmount) * yearProgress;
      
      const totalValue = goldValue + equityValue + fixedIncomeValue;
      const yearReturn = totalValue - initialAmount;
      const yearReturnPercentage = (yearReturn / initialAmount) * 100;

      yearlyData.push({
        year,
        goldValue,
        equityValue,
        fixedIncomeValue,
        totalValue,
        totalReturn: yearReturn,
        totalReturnPercentage: yearReturnPercentage
      });
    }

    return {
      initialAmount,
      finalAmount,
      totalReturn,
      totalReturnPercentage,
      breakdown: {
        gold: {
          amount: goldAmount,
          return: goldFinal - goldAmount,
          returnPercentage: this.GOLD_RETURN * 100
        },
        equity: {
          amount: equityAmount,
          return: equityFinal - equityAmount,
          returnPercentage: this.EQUITY_RETURN * 100
        },
        fixedIncome: {
          amount: fixedIncomeAmount,
          return: fixedIncomeFinal - fixedIncomeAmount,
          returnPercentage: this.FIXED_INCOME_RETURN * 100
        }
      },
      yearlyData
    };
  }

  saveInvestmentData(data: InvestmentData): void {
    this.storageService.setItem('investmentData', data);
  }

  getInvestmentData(): InvestmentData | null {
    return this.storageService.getItem('investmentData');
  }

  saveInvestmentResult(result: InvestmentResult): void {
    this.storageService.setItem('investmentResult', result);
  }

  getInvestmentResult(): InvestmentResult | null {
    return this.storageService.getItem('investmentResult');
  }

  getHistoricalReturns() {
    return {
      gold: this.GOLD_RETURN * 100,
      equity: this.EQUITY_RETURN * 100,
      fixedIncome: this.FIXED_INCOME_RETURN * 100
    };
  }

  validateAllocation(gold: number, equity: number, fixedIncome: number): boolean {
    const total = gold + equity + fixedIncome;
    return Math.abs(total - 100) < 0.01; // Allow for small floating point errors
  }
} 