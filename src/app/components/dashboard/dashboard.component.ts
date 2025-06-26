import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faChartLine, 
  faPiggyBank, 
  faChartPie, 
  faLightbulb, 
  faArrowUp, 
  faArrowDown,
  faExclamationTriangle,
  faCheckCircle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

import { UserProfile } from '../../models/user-profile.model';
import { AIAnalysis, SavingsRecommendation, InvestmentRecommendation, FinancialInsight } from '../../models/ai-recommendations.model';
import { AIRuleEngineService } from '../../services/ai-rule-engine.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, NgChartsModule, FontAwesomeModule]
})
export class DashboardComponent implements OnInit {
  userProfile: UserProfile | null = null;
  aiAnalysis: AIAnalysis | null = null;
  
  // Icons
  icons = {
    chartLine: faChartLine,
    piggyBank: faPiggyBank,
    chartPie: faChartPie,
    lightbulb: faLightbulb,
    arrowUp: faArrowUp,
    arrowDown: faArrowDown,
    warning: faExclamationTriangle,
    success: faCheckCircle,
    info: faInfoCircle
  };

  // Chart configurations
  financialHealthChartData: ChartData<'doughnut'> = {
    labels: ['Risk Score', 'Savings Efficiency', 'Investment Readiness', 'Financial Health'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  financialHealthChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  savingsProgressChartData: ChartData<'bar'> = {
    labels: ['Current', 'Target'],
    datasets: [{
      label: 'Emergency Fund (Months)',
      data: [0, 6],
      backgroundColor: ['#FF6384', '#36A2EB'],
      borderWidth: 1
    }]
  };

  savingsProgressChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 12
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  assetAllocationChartData: ChartData<'pie'> = {
    labels: ['Gold', 'Stocks', 'Bonds', 'Real Estate'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#FFD700', '#32CD32', '#4169E1', '#8B4513'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  assetAllocationChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  constructor(
    private router: Router,
    private aiRuleEngine: AIRuleEngineService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.analyzeProfile();
  }

  private loadUserProfile(): void {
    const kycData = this.storageService.getItem('kycData');
    if (kycData) {
      this.userProfile = this.transformKYCDataToProfile(kycData);
    } else {
      // Redirect to KYC if no profile exists
      this.router.navigate(['/kyc']);
    }
  }

  private transformKYCDataToProfile(kycData: any): UserProfile {
    const monthlyIncome = kycData.monthlyIncome || kycData.annualIncome / 12;
    const monthlyExpenses = monthlyIncome * 0.7; // Estimate 70% of income as expenses
    const savingsRate = (kycData.savings || 0) / monthlyIncome;

    return {
      id: kycData.id,
      fullName: kycData.fullName,
      email: kycData.email || '',
      gender: kycData.gender,
      age: kycData.age,
      occupation: kycData.occupation,
      monthlyIncome: monthlyIncome,
      monthlyExpenses: monthlyExpenses,
      currentSavings: kycData.savings || 0,
      currentInvestments: kycData.investments || 0,
      shortTermGoal: kycData.shortTermGoal,
      longTermGoal: kycData.longTermGoal,
      targetSavingsAmount: kycData.targetSavingsAmount || monthlyIncome * 12,
      targetInvestmentAmount: kycData.targetInvestmentAmount || monthlyIncome * 6,
      riskTolerance: kycData.riskTolerance,
      investmentStyle: kycData.investmentStyle,
      investmentTimeline: kycData.investmentTimeline,
      preferredContact: kycData.preferredContact,
      preferredInvestmentTypes: [],
      profileScore: kycData.profileScore || 0,
      profileRank: kycData.profileRank || 'beginner',
      savingsRate: savingsRate,
      emergencyFundStatus: this.calculateEmergencyFundStatus(kycData.savings || 0, monthlyExpenses),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private calculateEmergencyFundStatus(savings: number, monthlyExpenses: number): 'insufficient' | 'adequate' | 'excellent' {
    const months = savings / monthlyExpenses;
    if (months < 3) return 'insufficient';
    if (months < 6) return 'adequate';
    return 'excellent';
  }

  private analyzeProfile(): void {
    if (this.userProfile) {
      this.aiAnalysis = this.aiRuleEngine.analyzeProfile(this.userProfile);
      this.updateCharts();
    }
  }

  private updateCharts(): void {
    if (!this.aiAnalysis || !this.userProfile) return;

    // Update Financial Health Chart
    this.financialHealthChartData.datasets[0].data = [
      this.aiAnalysis.profile.riskScore,
      this.aiAnalysis.profile.savingsEfficiency,
      this.aiAnalysis.profile.investmentReadiness,
      this.aiAnalysis.profile.financialHealth
    ];

    // Update Savings Progress Chart
    const emergencyMonths = this.userProfile.currentSavings / this.userProfile.monthlyExpenses;
    this.savingsProgressChartData.datasets[0].data = [emergencyMonths, 6];

    // Update Asset Allocation Chart (if investment recommendations exist)
    const investmentRec = this.aiAnalysis.recommendations.investments.find(r => r.type === 'asset_allocation');
    if (investmentRec) {
      // This would be more complex in real implementation
      this.assetAllocationChartData.datasets[0].data = [25, 40, 25, 10];
    }
  }

  getTopRecommendations(): (SavingsRecommendation | InvestmentRecommendation)[] {
    if (!this.aiAnalysis) return [];
    
    const allRecs = [
      ...this.aiAnalysis.recommendations.savings,
      ...this.aiAnalysis.recommendations.investments
    ];
    
    return allRecs
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 3);
  }

  getCriticalInsights(): FinancialInsight[] {
    if (!this.aiAnalysis) return [];
    
    return this.aiAnalysis.recommendations.insights
      .filter(insight => insight.severity === 'alert' || insight.severity === 'warning')
      .slice(0, 3);
  }

  getFinancialHealthColor(score: number): string {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  }

  getEmergencyFundStatusColor(): string {
    if (!this.userProfile) return '#F44336';
    
    const months = this.userProfile.currentSavings / this.userProfile.monthlyExpenses;
    if (months >= 6) return '#4CAF50';
    if (months >= 3) return '#FF9800';
    return '#F44336';
  }

  getSavingsRateColor(): string {
    if (!this.userProfile) return '#F44336';
    
    if (this.userProfile.savingsRate >= 0.15) return '#4CAF50';
    if (this.userProfile.savingsRate >= 0.10) return '#FF9800';
    return '#F44336';
  }

  goToKYC(): void {
    this.router.navigate(['/kyc']);
  }

  goToInvestmentAnalysis(): void {
    this.router.navigate(['/investment-analysis']);
  }

  getSeverityIcon(severity: string) {
    switch (severity) {
      case 'alert': return this.icons.warning;
      case 'warning': return this.icons.warning;
      case 'info': return this.icons.info;
      default: return this.icons.info;
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'alert': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      default: return '#2196F3';
    }
  }
} 