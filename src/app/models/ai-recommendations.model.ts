export interface SavingsRecommendation {
  id: string;
  type: 'emergency_fund' | 'goal_savings' | 'retirement' | 'investment_boost';
  title: string;
  description: string;
  currentAmount: number;
  recommendedAmount: number;
  monthlyContribution: number;
  priority: 'low' | 'medium' | 'high';
  estimatedTimeToGoal: number; // in months
  impact: 'low' | 'medium' | 'high';
  reasoning: string;
}

export interface InvestmentRecommendation {
  id: string;
  type: 'asset_allocation' | 'specific_investment' | 'portfolio_rebalance';
  title: string;
  description: string;
  assetClass: 'gold' | 'stocks' | 'bonds' | 'real_estate' | 'crypto';
  recommendedAllocation: number; // percentage
  currentAllocation: number;
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  priority: 'low' | 'medium' | 'high';
  reasoning: string;
  culturalContext?: string; // for Egypt/Gulf specific advice
}

export interface FinancialInsight {
  id: string;
  type: 'spending_pattern' | 'savings_trend' | 'investment_opportunity' | 'risk_alert';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'alert';
  category: string;
  actionable: boolean;
  actionItems?: string[];
  data?: any;
}

export interface AIAnalysis {
  profile: {
    riskScore: number;
    savingsEfficiency: number;
    investmentReadiness: number;
    financialHealth: number;
  };
  recommendations: {
    savings: SavingsRecommendation[];
    investments: InvestmentRecommendation[];
    insights: FinancialInsight[];
  };
  nextSteps: string[];
  culturalInsights?: string[];
}

export interface RuleEngineConfig {
  savingsRules: {
    emergencyFundMultiplier: number; // months of expenses
    minimumSavingsRate: number; // percentage
    goalSavingsBuffer: number; // percentage
  };
  investmentRules: {
    conservativeAllocation: { gold: number; bonds: number; stocks: number };
    balancedAllocation: { gold: number; bonds: number; stocks: number };
    aggressiveAllocation: { gold: number; bonds: number; stocks: number };
    ageBasedAdjustments: { [key: number]: number }; // age -> stock allocation reduction
  };
  culturalRules: {
    region: 'egypt' | 'gulf' | 'international';
    preferences: {
      goldPreference: number; // 0-1 scale
      realEstatePreference: number;
      islamicFinance: boolean;
    };
  };
} 