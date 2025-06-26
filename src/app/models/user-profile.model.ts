export interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  gender: 'male' | 'female';
  age: number;
  occupation: string;
  
  // Financial Data
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  currentInvestments: number;
  
  // Goals
  shortTermGoal: string;
  longTermGoal: string;
  targetSavingsAmount: number;
  targetInvestmentAmount: number;
  
  // Risk Profile
  riskTolerance: 'low' | 'medium' | 'high';
  investmentStyle: 'conservative' | 'balanced' | 'aggressive';
  investmentTimeline: 'short' | 'medium' | 'long';
  
  // Preferences
  preferredContact: string;
  preferredInvestmentTypes: string[];
  
  // Calculated Fields
  profileScore: number;
  profileRank: 'beginner' | 'intermediate' | 'advanced';
  savingsRate: number; // percentage of income saved
  emergencyFundStatus: 'insufficient' | 'adequate' | 'excellent';
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'emergency' | 'short-term' | 'long-term' | 'retirement';
  monthlyContribution: number;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'income' | 'expense' | 'investment' | 'savings';
  tags?: string[];
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
} 