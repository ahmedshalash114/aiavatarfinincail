import { Injectable } from '@angular/core';
import { UserProfile } from '../models/user-profile.model';
import { 
  AIAnalysis, 
  SavingsRecommendation, 
  InvestmentRecommendation, 
  FinancialInsight,
  RuleEngineConfig 
} from '../models/ai-recommendations.model';

@Injectable({
  providedIn: 'root'
})
export class AIRuleEngineService {
  private config: RuleEngineConfig = {
    savingsRules: {
      emergencyFundMultiplier: 6, // 6 months of expenses
      minimumSavingsRate: 0.15, // 15% of income
      goalSavingsBuffer: 0.1 // 10% buffer for goals
    },
    investmentRules: {
      conservativeAllocation: { gold: 40, bonds: 40, stocks: 20 },
      balancedAllocation: { gold: 25, bonds: 35, stocks: 40 },
      aggressiveAllocation: { gold: 15, bonds: 20, stocks: 65 },
      ageBasedAdjustments: {
        25: 0, 30: -5, 35: -10, 40: -15, 45: -20, 50: -25, 55: -30, 60: -35
      }
    },
    culturalRules: {
      region: 'egypt',
      preferences: {
        goldPreference: 0.7, // High preference for gold in Egypt
        realEstatePreference: 0.8,
        islamicFinance: true
      }
    }
  };

  constructor() {}

  analyzeProfile(profile: UserProfile): AIAnalysis {
    const savingsRecommendations = this.generateSavingsRecommendations(profile);
    const investmentRecommendations = this.generateInvestmentRecommendations(profile);
    const insights = this.generateFinancialInsights(profile);
    const profileScores = this.calculateProfileScores(profile);

    return {
      profile: profileScores,
      recommendations: {
        savings: savingsRecommendations,
        investments: investmentRecommendations,
        insights: insights
      },
      nextSteps: this.generateNextSteps(profile, savingsRecommendations, investmentRecommendations),
      culturalInsights: this.generateCulturalInsights(profile)
    };
  }

  private generateSavingsRecommendations(profile: UserProfile): SavingsRecommendation[] {
    const recommendations: SavingsRecommendation[] = [];
    
    // Emergency Fund Analysis
    const emergencyFundNeeded = profile.monthlyExpenses * this.config.savingsRules.emergencyFundMultiplier;
    const emergencyFundGap = emergencyFundNeeded - profile.currentSavings;
    
    if (emergencyFundGap > 0) {
      recommendations.push({
        id: 'emergency-fund-1',
        type: 'emergency_fund',
        title: 'Build Emergency Fund',
        description: `You need ${emergencyFundGap.toLocaleString()} EGP more for a 6-month emergency fund`,
        currentAmount: profile.currentSavings,
        recommendedAmount: emergencyFundNeeded,
        monthlyContribution: Math.ceil(emergencyFundGap / 12),
        priority: emergencyFundGap > profile.monthlyIncome * 3 ? 'high' : 'medium',
        estimatedTimeToGoal: Math.ceil(emergencyFundGap / (profile.monthlyIncome * 0.2)),
        impact: 'high',
        reasoning: 'Emergency fund provides financial security and prevents debt during unexpected situations'
      });
    }

    // Savings Rate Analysis
    const currentSavingsRate = profile.savingsRate;
    const targetSavingsRate = this.config.savingsRules.minimumSavingsRate;
    
    if (currentSavingsRate < targetSavingsRate) {
      const monthlySavingsGap = profile.monthlyIncome * (targetSavingsRate - currentSavingsRate);
      recommendations.push({
        id: 'savings-rate-1',
        type: 'goal_savings',
        title: 'Increase Savings Rate',
        description: `Increase monthly savings by ${monthlySavingsGap.toLocaleString()} EGP to reach 15% savings rate`,
        currentAmount: profile.monthlyIncome * currentSavingsRate,
        recommendedAmount: profile.monthlyIncome * targetSavingsRate,
        monthlyContribution: monthlySavingsGap,
        priority: 'medium',
        estimatedTimeToGoal: 3,
        impact: 'medium',
        reasoning: 'Higher savings rate accelerates goal achievement and builds wealth faster'
      });
    }

    // Goal-Based Savings
    if (profile.targetSavingsAmount > profile.currentSavings) {
      const goalGap = profile.targetSavingsAmount - profile.currentSavings;
      const monthlyContribution = Math.ceil(goalGap / 24); // 2-year timeline
      
      recommendations.push({
        id: 'goal-savings-1',
        type: 'goal_savings',
        title: 'Goal-Based Savings Plan',
        description: `Save ${monthlyContribution.toLocaleString()} EGP monthly to reach your ${profile.shortTermGoal} goal`,
        currentAmount: profile.currentSavings,
        recommendedAmount: profile.targetSavingsAmount,
        monthlyContribution: monthlyContribution,
        priority: 'medium',
        estimatedTimeToGoal: 24,
        impact: 'high',
        reasoning: 'Structured savings plan helps achieve specific financial goals'
      });
    }

    return recommendations;
  }

  private generateInvestmentRecommendations(profile: UserProfile): InvestmentRecommendation[] {
    const recommendations: InvestmentRecommendation[] = [];
    
    // Asset Allocation based on risk tolerance and age
    const baseAllocation = this.getBaseAllocation(profile.riskTolerance);
    const ageAdjustment = this.getAgeAdjustment(profile.age);
    const culturalAdjustment = this.getCulturalAdjustment();
    
    const finalAllocation = {
      gold: Math.min(100, baseAllocation.gold + culturalAdjustment.gold),
      bonds: Math.max(0, baseAllocation.bonds + ageAdjustment),
      stocks: Math.max(0, baseAllocation.stocks - ageAdjustment - culturalAdjustment.gold)
    };

    // Normalize to 100%
    const total = finalAllocation.gold + finalAllocation.bonds + finalAllocation.stocks;
    const normalizedAllocation = {
      gold: (finalAllocation.gold / total) * 100,
      bonds: (finalAllocation.bonds / total) * 100,
      stocks: (finalAllocation.stocks / total) * 100
    };

    recommendations.push({
      id: 'asset-allocation-1',
      type: 'asset_allocation',
      title: 'Recommended Asset Allocation',
      description: `Based on your ${profile.riskTolerance} risk tolerance and age ${profile.age}`,
      assetClass: 'stocks',
      recommendedAllocation: normalizedAllocation.stocks,
      currentAllocation: 0, // Will be calculated from actual portfolio
      expectedReturn: 8.5,
      riskLevel: profile.riskTolerance,
      timeHorizon: profile.investmentTimeline,
      priority: 'medium',
      reasoning: `Conservative allocation with ${normalizedAllocation.gold}% gold (cultural preference), ${normalizedAllocation.bonds}% bonds (age-appropriate), ${normalizedAllocation.stocks}% stocks (growth)`,
      culturalContext: 'High gold allocation reflects Egyptian investment preferences and inflation hedging'
    });

    // Gold Investment Recommendation (Cultural Context)
    if (normalizedAllocation.gold > 20) {
      recommendations.push({
        id: 'gold-investment-1',
        type: 'specific_investment',
        title: 'Gold Investment Strategy',
        description: 'Consider gold as a hedge against inflation and currency fluctuations',
        assetClass: 'gold',
        recommendedAllocation: normalizedAllocation.gold,
        currentAllocation: 0,
        expectedReturn: 6.0,
        riskLevel: 'low',
        timeHorizon: 'long',
        priority: 'medium',
        reasoning: 'Gold provides stability and is culturally preferred in Egypt',
        culturalContext: 'Gold is traditionally valued in Egyptian culture and serves as both investment and jewelry'
      });
    }

    // Real Estate Consideration
    if (profile.monthlyIncome > 15000 && profile.currentSavings > 100000) {
      recommendations.push({
        id: 'real-estate-1',
        type: 'specific_investment',
        title: 'Real Estate Investment',
        description: 'Consider real estate for long-term wealth building',
        assetClass: 'real_estate',
        recommendedAllocation: 20,
        currentAllocation: 0,
        expectedReturn: 7.0,
        riskLevel: 'medium',
        timeHorizon: 'long',
        priority: 'low',
        reasoning: 'Real estate provides rental income and capital appreciation',
        culturalContext: 'Real estate is highly valued in Egyptian culture and provides social status'
      });
    }

    return recommendations;
  }

  private generateFinancialInsights(profile: UserProfile): FinancialInsight[] {
    const insights: FinancialInsight[] = [];

    // Savings Rate Insight
    if (profile.savingsRate < 0.1) {
      insights.push({
        id: 'savings-insight-1',
        type: 'savings_trend',
        title: 'Low Savings Rate Detected',
        message: `Your savings rate of ${(profile.savingsRate * 100).toFixed(1)}% is below the recommended 15%`,
        severity: 'warning',
        category: 'savings',
        actionable: true,
        actionItems: ['Review monthly expenses', 'Set up automatic savings', 'Create a budget']
      });
    }

    // Emergency Fund Insight
    const emergencyFundMonths = profile.currentSavings / profile.monthlyExpenses;
    if (emergencyFundMonths < 3) {
      insights.push({
        id: 'emergency-insight-1',
        type: 'risk_alert',
        title: 'Insufficient Emergency Fund',
        message: `You have ${emergencyFundMonths.toFixed(1)} months of emergency funds. Aim for 6 months.`,
        severity: 'alert',
        category: 'risk',
        actionable: true,
        actionItems: ['Prioritize emergency fund building', 'Reduce non-essential expenses']
      });
    }

    // Investment Opportunity
    if (profile.currentSavings > profile.monthlyExpenses * 6 && profile.currentInvestments < profile.currentSavings * 0.3) {
      insights.push({
        id: 'investment-insight-1',
        type: 'investment_opportunity',
        title: 'Investment Opportunity',
        message: 'You have excess savings that could be invested for better returns',
        severity: 'info',
        category: 'investment',
        actionable: true,
        actionItems: ['Consider diversified investment portfolio', 'Start with low-risk investments']
      });
    }

    return insights;
  }

  private calculateProfileScores(profile: UserProfile) {
    const riskScore = this.calculateRiskScore(profile);
    const savingsEfficiency = this.calculateSavingsEfficiency(profile);
    const investmentReadiness = this.calculateInvestmentReadiness(profile);
    const financialHealth = this.calculateFinancialHealth(profile);

    return {
      riskScore,
      savingsEfficiency,
      investmentReadiness,
      financialHealth
    };
  }

  private calculateRiskScore(profile: UserProfile): number {
    let score = 50; // Base score
    
    // Age factor
    if (profile.age < 30) score += 20;
    else if (profile.age < 40) score += 10;
    else if (profile.age > 50) score -= 20;

    // Income stability
    if (profile.occupation.includes('freelance') || profile.occupation.includes('business')) score -= 10;
    else if (profile.occupation.includes('government') || profile.occupation.includes('corporate')) score += 10;

    // Risk tolerance
    if (profile.riskTolerance === 'high') score += 20;
    else if (profile.riskTolerance === 'low') score -= 20;

    return Math.max(0, Math.min(100, score));
  }

  private calculateSavingsEfficiency(profile: UserProfile): number {
    let score = 0;
    
    // Savings rate
    score += Math.min(100, profile.savingsRate * 200); // 50% savings rate = 100 points
    
    // Emergency fund
    const emergencyMonths = profile.currentSavings / profile.monthlyExpenses;
    score += Math.min(50, emergencyMonths * 10); // 5 months = 50 points
    
    return Math.min(100, score);
  }

  private calculateInvestmentReadiness(profile: UserProfile): number {
    let score = 0;
    
    // Emergency fund adequacy
    const emergencyMonths = profile.currentSavings / profile.monthlyExpenses;
    if (emergencyMonths >= 6) score += 40;
    else if (emergencyMonths >= 3) score += 20;
    
    // Income level
    if (profile.monthlyIncome > 20000) score += 30;
    else if (profile.monthlyIncome > 10000) score += 20;
    else if (profile.monthlyIncome > 5000) score += 10;
    
    // Age factor
    if (profile.age >= 25 && profile.age <= 55) score += 30;
    
    return Math.min(100, score);
  }

  private calculateFinancialHealth(profile: UserProfile): number {
    const savingsEfficiency = this.calculateSavingsEfficiency(profile);
    const investmentReadiness = this.calculateInvestmentReadiness(profile);
    const debtRatio = profile.monthlyExpenses / profile.monthlyIncome;
    
    let score = (savingsEfficiency + investmentReadiness) / 2;
    
    // Debt ratio adjustment
    if (debtRatio > 0.8) score -= 30;
    else if (debtRatio > 0.6) score -= 15;
    else if (debtRatio < 0.4) score += 20;
    
    return Math.max(0, Math.min(100, score));
  }

  private getBaseAllocation(riskTolerance: string) {
    switch (riskTolerance) {
      case 'conservative':
        return this.config.investmentRules.conservativeAllocation;
      case 'balanced':
        return this.config.investmentRules.balancedAllocation;
      case 'aggressive':
        return this.config.investmentRules.aggressiveAllocation;
      default:
        return this.config.investmentRules.balancedAllocation;
    }
  }

  private getAgeAdjustment(age: number): number {
    const adjustments = this.config.investmentRules.ageBasedAdjustments;
    for (const ageThreshold of Object.keys(adjustments).map(Number).sort((a, b) => b - a)) {
      if (age >= ageThreshold) {
        return adjustments[ageThreshold];
      }
    }
    return 0;
  }

  private getCulturalAdjustment() {
    return {
      gold: this.config.culturalRules.preferences.goldPreference * 20, // Add up to 20% for cultural preference
      realEstate: this.config.culturalRules.preferences.realEstatePreference * 15
    };
  }

  private generateNextSteps(profile: UserProfile, savingsRecs: SavingsRecommendation[], investmentRecs: InvestmentRecommendation[]): string[] {
    const steps: string[] = [];
    
    // Priority 1: Emergency Fund
    const emergencyRec = savingsRecs.find(r => r.type === 'emergency_fund');
    if (emergencyRec && emergencyRec.priority === 'high') {
      steps.push('Build emergency fund as top priority');
    }
    
    // Priority 2: Increase Savings Rate
    const savingsRateRec = savingsRecs.find(r => r.type === 'goal_savings');
    if (savingsRateRec) {
      steps.push('Increase monthly savings rate to 15%');
    }
    
    // Priority 3: Start Investing
    if (investmentRecs.length > 0 && this.calculateInvestmentReadiness(profile) > 60) {
      steps.push('Begin diversified investment portfolio');
    }
    
    // Priority 4: Goal Planning
    if (profile.targetSavingsAmount > 0) {
      steps.push('Create detailed plan for financial goals');
    }
    
    return steps;
  }

  private generateCulturalInsights(profile: UserProfile): string[] {
    const insights: string[] = [];
    
    insights.push('Gold investment is culturally significant in Egypt and provides inflation protection');
    insights.push('Real estate is highly valued for both investment and social status');
    insights.push('Consider Islamic finance options for Sharia-compliant investments');
    insights.push('Family financial planning is important - consider including family goals');
    
    return insights;
  }
} 