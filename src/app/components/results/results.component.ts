import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { ChartOptions, ChartData } from 'chart.js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgChartsModule } from 'ng2-charts';

interface ChartAxis {
  label: string;
  value: number;
  angle: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  standalone: true,
  imports: [CommonModule,  FontAwesomeModule,NgChartsModule]
})
export class ResultsComponent implements OnInit {
  profileScore: number = 0;
  profileRank: string = '';
  recommendations: string[] = [];
  avatarMessage = '';
  avatarExpression = 'success';
  avatarAnimation = 'celebrate';
  isTyping = false;
  chartAxes: ChartAxis[] = [];
  Math = Math; // Make Math available in template

  radarChartLabels: string[] = [
    'Income Level',
    'Risk Tolerance',
    'Investment Knowledge',
    'Financial Goals',
    'Time Horizon'
  ];

  radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      {
        label: 'Your Profile',
        data: [], // Will be set in ngOnInit
        fill: true,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: 'rgba(76, 175, 80, 1)',
        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(76, 175, 80, 1)'
      }
    ]
  };

  radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          font: { size: 16 }
        }
      }
    }
  };

  radarChartPlugins = [];

  dashboardMetrics = [
    { label: 'Income Level', value: 0, icon: '💰' },
    { label: 'Risk Tolerance', value: 0, icon: '⚡' },
    { label: 'Investment Knowledge', value: 0, icon: '📚' },
    { label: 'Financial Goals', value: 0, icon: '🎯' },
    { label: 'Time Horizon', value: 0, icon: '⏳' }
  ];

  gaugeCircumference = 2 * Math.PI * 45;

  profileCards = [
    { icon: '💰', title: 'Income Level', message: '' },
    { icon: '⚡', title: 'Risk Tolerance', message: '' },
    { icon: '📚', title: 'Investment Knowledge', message: '' },
    { icon: '🎯', title: 'Financial Goals', message: '' },
    { icon: '⏳', title: 'Time Horizon', message: '' }
  ];

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadKycDataAndCalculate();
  }

  loadKycDataAndCalculate() {
    // Load local form data
    const kycFormData = this.storageService.getItem('kycFormData');
    // Load API response if available
    const apiResponse = this.storageService.getItem('kycApiResponse');
    
    console.log('KYC Form Data:', kycFormData);
    console.log('API Response:', apiResponse);
    
    // Use API response if available, otherwise use local form data
    const kycData = apiResponse || kycFormData || {};
    
    this.setDashboardDataFromKyc(kycData);
    this.setProfileCardsFromKyc(kycData);
    this.calculateProfileScore(kycData);
    this.generateRecommendations(kycData);
    this.updateAvatarMessage();
  }

  calculateProfileScore(form: any): void {
    let score = 0;
    
    // Handle both old and new form structures
    if (form.step2?.annualIncome) {
      // New step-based structure
      const annualIncome = form.step2.annualIncome;
      if (annualIncome >= 600000) score += 30;
      else if (annualIncome >= 300000) score += 20;
      else if (annualIncome) score += 10;
      
      const savings = form.step3?.savings || 0;
      if (savings >= 1000000) score += 20;
      else if (savings >= 500000) score += 15;
      else if (savings) score += 10;
      
      const investments = form.step3?.investments || 0;
      if (investments >= 1000000) score += 20;
      else if (investments >= 500000) score += 15;
      else if (investments) score += 10;
      
      const riskTolerance = form.step5?.riskTolerance;
      if (riskTolerance === 'high') score += 20;
      else if (riskTolerance === 'medium') score += 15;
      else if (riskTolerance) score += 10;
      
      const investmentKnowledge = form.step6?.investmentKnowledge;
      if (investmentKnowledge === 'advanced') score += 10;
      else if (investmentKnowledge === 'intermediate') score += 7;
      else if (investmentKnowledge) score += 5;
    } else {
      // Old structure or API response
      if (form.monthlyIncome >= 50000) score += 30;
      else if (form.monthlyIncome >= 25000) score += 20;
      else if (form.monthlyIncome) score += 10;
      
      if (form.investmentGoal === 'grow') score += 30;
      else if (form.investmentGoal === 'protect') score += 20;
      else if (form.investmentGoal) score += 10;
      
      if (form.riskTolerance === 'ok') score += 40;
      else if (form.riskTolerance === 'moderate') score += 30;
      else if (form.riskTolerance) score += 20;
    }
    
    this.profileScore = Math.min(100, score);
    
    // Determine profile rank
    if (this.profileScore >= 80) {
      this.profileRank = 'Advanced';
    } else if (this.profileScore >= 50) {
      this.profileRank = 'Intermediate';
    } else {
      this.profileRank = 'Beginner';
    }
  }

  generateRecommendations(formData: any): void {
    const recommendations: string[] = [];

    // Basic recommendations for all users
    recommendations.push('Start building an emergency fund');
    recommendations.push('Consider setting up automatic savings');

    // Level-specific recommendations
    if (this.profileRank === 'Beginner') {
      recommendations.push('Learn about basic investment concepts');
      recommendations.push('Consider starting with low-risk investments');
    } else if (this.profileRank === 'Intermediate') {
      recommendations.push('Diversify your investment portfolio');
      recommendations.push('Consider exploring different investment vehicles');
    } else {
      recommendations.push('Optimize your investment strategy');
      recommendations.push('Consider advanced investment opportunities');
    }

    // Goal-specific recommendations
    const shortTermGoal = formData.step4?.shortTermGoal || formData.shortTermGoal;
    const longTermGoal = formData.step4?.longTermGoal || formData.longTermGoal;
    
    if (shortTermGoal) {
      recommendations.push(`Focus on short-term goal: ${shortTermGoal}`);
    }
    if (longTermGoal) {
      recommendations.push(`Plan for long-term goal: ${longTermGoal}`);
    }

    this.recommendations = recommendations;
  }

  updateAvatarMessage(): void {
    this.isTyping = true;
    
    let message = '';
    if (this.profileRank === 'Advanced') {
      message = 'Impressive financial profile! You\'re ready for advanced strategies.';
    } else if (this.profileRank === 'Intermediate') {
      message = 'Great progress! Let\'s take your financial journey to the next level.';
    } else {
      message = 'Welcome to your financial journey! I\'ll guide you every step of the way.';
    }
    
    setTimeout(() => {
      this.avatarMessage = message;
      this.isTyping = false;
    }, 500);
  }

  initializeChartAxes(formData: any): void {
    const totalAxes = 5;
    const angleStep = (2 * Math.PI) / totalAxes;

    // Create base axes data
    const axesData = [
      {
        label: 'Income Level',
        value: this.calculateIncomeScore(formData.financialInfo?.savings || 0)
      },
      {
        label: 'Risk Tolerance',
        value: this.calculateRiskScore(formData.goals?.riskTolerance || 'medium')
      },
      {
        label: 'Investment Knowledge',
        value: formData.goals?.investmentGoal !== 'unsure' ? 75 : 50
      },
      {
        label: 'Financial Goals',
        value: formData.goals?.investmentGoal === 'grow' || formData.goals?.investmentGoal === 'protect' ? 75 : 50
      },
      {
        label: 'Time Horizon',
        value: formData.goals?.investmentTimeline === 'yes' ? 75 : 50
      }
    ];

    // Add position information to each axis
    this.chartAxes = axesData.map((axis, index) => ({
      ...axis,
      angle: index * angleStep,
      x: Math.cos(index * angleStep),
      y: Math.sin(index * angleStep)
    }));
  }

  calculateIncomeScore(income: number): number {
    if (income >= 50000) return 100;
    if (income >= 25000) return 75;
    if (income >= 10000) return 50;
    return 25;
  }

  calculateRiskScore(risk: string): number {
    switch (risk) {
      case 'high': return 100;
      case 'medium': return 66;
      case 'low': return 33;
      default: return 50;
    }
  }

  getProgressOffset(): number {
    const circumference = 2 * Math.PI * 45;
    return circumference - (this.profileScore / 100) * circumference;
  }

  getRiskLevel(): string {
    const kycData = JSON.parse(localStorage.getItem('kycData') || '{}');
    switch (kycData.riskTolerance) {
      case 'high': return 'Aggressive';
      case 'medium': return 'Moderate';
      case 'low': return 'Conservative';
      default: return 'Not Specified';
    }
  }

  getTimelineLabel(): string {
    const kycData = JSON.parse(localStorage.getItem('kycData') || '{}');
    return kycData.investmentTimeline === 'yes' ? 'Short-term' : 'Long-term';
  }

  getProfileInsight(): string {
    const kycData = JSON.parse(localStorage.getItem('kycData') || '{}');
    let insight = '';

    // Income-based insight
    if (kycData.monthlyIncome >= 50000) {
      insight += 'With your strong income level, ';
    } else if (kycData.monthlyIncome >= 25000) {
      insight += 'Given your moderate income, ';
    } else {
      insight += 'With your current income level, ';
    }

    // Goal-based insight
    if (kycData.investmentGoal === 'grow') {
      insight += 'you\'re well-positioned to pursue growth-oriented investments. ';
    } else if (kycData.investmentGoal === 'protect') {
      insight += 'you may want to focus on capital preservation strategies. ';
    } else {
      insight += 'you should first clarify your investment objectives. ';
    }

    // Risk-based insight
    if (kycData.riskTolerance === 'high') {
      insight += 'Your high risk tolerance allows for more aggressive investment strategies.';
    } else if (kycData.riskTolerance === 'medium') {
      insight += 'Your moderate risk tolerance suggests a balanced approach to investing.';
    } else {
      insight += 'Your conservative risk profile suggests focusing on stable, low-risk investments.';
    }

    return insight;
  }

  startOver(): void {
    // Clear form data using storage service
    this.storageService.removeItem('kycFormData');
    this.router.navigate(['/kyc']);
  }

  downloadReport() {
    // Create a report with the user's financial profile
    const report = {
      profileScore: this.profileScore,
      profileRank: this.profileRank,
      recommendations: this.recommendations,
      chartData: this.chartAxes,
      timestamp: new Date().toISOString()
    };

    // Convert to JSON and create a downloadable file
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financial-profile-report.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getPolygonPath(): string {
    if (!this.chartAxes.length) return '';
    
    const centerX = 50;
    const centerY = 50;
    const maxRadius = 40;
    
    const points = this.chartAxes.map(axis => {
      const radius = (axis.value / 100) * maxRadius;
      const x = centerX + radius * axis.x;
      const y = centerY + radius * axis.y;
      return `${x}% ${y}%`;
    });
    
    return `polygon(${points.join(', ')})`;
  }

  setRadarChartData() {
    const kycData = JSON.parse(localStorage.getItem('kycData') || '{}');
    this.radarChartData.datasets[0].data = [
      this.calculateIncomeScore(kycData.monthlyIncome),
      this.calculateRiskScore(kycData.riskTolerance),
      kycData.investmentGoal !== 'unsure' ? 75 : 50,
      (kycData.investmentGoal === 'grow' || kycData.investmentGoal === 'protect') ? 75 : 50,
      kycData.investmentTimeline === 'yes' ? 75 : 50
    ];
  }

  setDashboardDataFromKyc(kycData: any) {
    // Handle both new step-based structure and API response
    const monthlyIncome = kycData.monthlyIncome || (kycData.step2?.annualIncome ? kycData.step2.annualIncome / 12 : 0);
    const riskTolerance = kycData.riskTolerance || kycData.step5?.riskTolerance;
    const investmentKnowledge = kycData.step6?.investmentKnowledge;
    const shortTermGoal = kycData.step4?.shortTermGoal || kycData.shortTermGoal;
    const longTermGoal = kycData.step4?.longTermGoal || kycData.longTermGoal;
    
    this.dashboardMetrics = [
      { 
        label: 'Income Level', 
        value: this.calculateIncomeScore(monthlyIncome), 
        icon: '💰' 
      },
      { 
        label: 'Risk Tolerance', 
        value: this.calculateRiskScore(riskTolerance), 
        icon: '⚡' 
      },
      { 
        label: 'Investment Knowledge', 
        value: this.calculateKnowledgeScore(investmentKnowledge), 
        icon: '📚' 
      },
      { 
        label: 'Financial Goals', 
        value: (shortTermGoal || longTermGoal) ? 75 : 50, 
        icon: '🎯' 
      },
      { 
        label: 'Time Horizon', 
        value: 75, // Default to medium-term 
        icon: '⏳' 
      }
    ];
  }

  calculateKnowledgeScore(knowledge: string): number {
    switch (knowledge) {
      case 'advanced': return 100;
      case 'intermediate': return 75;
      case 'beginner': return 50;
      default: return 50;
    }
  }

  getGaugeOffset(value: number): number {
    return this.gaugeCircumference - (value / 100) * this.gaugeCircumference;
  }

  setProfileCardsFromKyc(kycData: any) {
    // Handle both new step-based structure and API response
    const monthlyIncome = kycData.monthlyIncome || (kycData.step2?.annualIncome ? kycData.step2.annualIncome / 12 : 0);
    const riskTolerance = kycData.riskTolerance || kycData.step5?.riskTolerance;
    const investmentKnowledge = kycData.step6?.investmentKnowledge;
    const shortTermGoal = kycData.step4?.shortTermGoal || kycData.shortTermGoal;
    const longTermGoal = kycData.step4?.longTermGoal || kycData.longTermGoal;
    
    this.profileCards = [
      {
        icon: '💰',
        title: 'Income Level',
        message: monthlyIncome >= 50000 ?
          'Your strong income gives you more investment flexibility.' :
          monthlyIncome >= 25000 ?
            'Your moderate income allows for steady growth.' :
            'Consider building your income for greater financial options.'
      },
      {
        icon: '⚡',
        title: 'Risk Tolerance',
        message: riskTolerance === 'high' ?
          'You are comfortable with market ups and downs.' :
          riskTolerance === 'medium' ?
            'You prefer a balanced approach to risk.' :
            'You value stability and security in your investments.'
      },
      {
        icon: '📚',
        title: 'Investment Knowledge',
        message: investmentKnowledge === 'advanced' ?
          'You have advanced knowledge of investment strategies.' :
          investmentKnowledge === 'intermediate' ?
            'You have a good understanding of investment basics.' :
            'Learning more about investments can boost your confidence.'
      },
      {
        icon: '🎯',
        title: 'Financial Goals',
        message: (shortTermGoal || longTermGoal) ?
          'You have clear financial goals guiding your strategy.' :
          'Defining your goals will help you stay on track.'
      },
      {
        icon: '⏳',
        title: 'Time Horizon',
        message: 'A well-planned timeline helps optimize your investment strategy.'
      }
    ];
  }
} 