import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUser, 
  faEdit, 
  faSave, 
  faTimes, 
  faChartLine,
  faPiggyBank,
  faBullseye,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

import { UserProfile } from '../../models/user-profile.model';
import { FinancialGoal } from '../../models/user-profile.model';
import { StorageService } from '../../services/storage.service';
import { AIRuleEngineService } from '../../services/ai-rule-engine.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  profileForm: FormGroup;
  goalsForm: FormGroup;
  isEditing = false;
  isEditingGoals = false;
  financialGoals: FinancialGoal[] = [];
  
  // Icons
  icons = {
    user: faUser,
    edit: faEdit,
    save: faSave,
    times: faTimes,
    chartLine: faChartLine,
    piggyBank: faPiggyBank,
    target: faBullseye,
    shieldAlt: faShieldAlt
  };

  // Risk tolerance options
  riskToleranceOptions = [
    { value: 'low', label: 'Conservative', description: 'Prefer stable, low-risk investments' },
    { value: 'medium', label: 'Balanced', description: 'Mix of growth and stability' },
    { value: 'high', label: 'Aggressive', description: 'Seek maximum growth potential' }
  ];

  // Investment timeline options
  timelineOptions = [
    { value: 'short', label: '1-3 years', description: 'Short-term goals' },
    { value: 'medium', label: '3-10 years', description: 'Medium-term planning' },
    { value: 'long', label: '10+ years', description: 'Long-term wealth building' }
  ];

  // Goal categories
  goalCategories = [
    { value: 'emergency', label: 'Emergency Fund', icon: '🛡️' },
    { value: 'short-term', label: 'Short-term Goals', icon: '🎯' },
    { value: 'long-term', label: 'Long-term Goals', icon: '🏆' },
    { value: 'retirement', label: 'Retirement', icon: '🌅' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private aiRuleEngine: AIRuleEngineService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      occupation: ['', Validators.required],
      monthlyIncome: ['', [Validators.required, Validators.min(0)]],
      monthlyExpenses: ['', [Validators.required, Validators.min(0)]],
      currentSavings: ['', [Validators.required, Validators.min(0)]],
      currentInvestments: ['', [Validators.required, Validators.min(0)]],
      riskTolerance: ['', Validators.required],
      investmentTimeline: ['', Validators.required],
      shortTermGoal: ['', Validators.required],
      longTermGoal: ['', Validators.required],
      targetSavingsAmount: ['', [Validators.required, Validators.min(0)]],
      targetInvestmentAmount: ['', [Validators.required, Validators.min(0)]]
    });

    this.goalsForm = this.fb.group({
      name: ['', Validators.required],
      targetAmount: ['', [Validators.required, Validators.min(0)]],
      currentAmount: ['', [Validators.required, Validators.min(0)]],
      targetDate: ['', Validators.required],
      priority: ['medium', Validators.required],
      category: ['', Validators.required],
      monthlyContribution: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadFinancialGoals();
  }

  private loadUserProfile(): void {
    const kycData = this.storageService.getItem('kycData');
    if (kycData) {
      this.userProfile = this.transformKYCDataToProfile(kycData);
      this.populateForm();
    } else {
      this.router.navigate(['/kyc']);
    }
  }

  private transformKYCDataToProfile(kycData: any): UserProfile {
    const monthlyIncome = kycData.monthlyIncome || kycData.annualIncome / 12;
    const monthlyExpenses = monthlyIncome * 0.7; // Estimate
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

  private populateForm(): void {
    if (this.userProfile) {
      this.profileForm.patchValue({
        fullName: this.userProfile.fullName,
        email: this.userProfile.email,
        age: this.userProfile.age,
        occupation: this.userProfile.occupation,
        monthlyIncome: this.userProfile.monthlyIncome,
        monthlyExpenses: this.userProfile.monthlyExpenses,
        currentSavings: this.userProfile.currentSavings,
        currentInvestments: this.userProfile.currentInvestments,
        riskTolerance: this.userProfile.riskTolerance,
        investmentTimeline: this.userProfile.investmentTimeline,
        shortTermGoal: this.userProfile.shortTermGoal,
        longTermGoal: this.userProfile.longTermGoal,
        targetSavingsAmount: this.userProfile.targetSavingsAmount,
        targetInvestmentAmount: this.userProfile.targetInvestmentAmount
      });
    }
  }

  private loadFinancialGoals(): void {
    const goals = this.storageService.getItem('financialGoals');
    this.financialGoals = goals || [];
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm(); // Reset form
    }
  }

  toggleEditGoals(): void {
    this.isEditingGoals = !this.isEditingGoals;
    if (!this.isEditingGoals) {
      this.goalsForm.reset();
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      
      if (this.userProfile) {
        const updatedProfile: UserProfile = {
          ...this.userProfile,
          ...formData,
          updatedAt: new Date()
        };

        // Update KYC data
        this.storageService.setItem('kycData', updatedProfile);
        
        // Re-analyze profile
        const aiAnalysis = this.aiRuleEngine.analyzeProfile(updatedProfile);
        
        // Update profile score
        updatedProfile.profileScore = Math.round(aiAnalysis.profile.financialHealth);
        updatedProfile.profileRank = this.calculateProfileRank(updatedProfile.profileScore);
        
        this.userProfile = updatedProfile;
        this.storageService.setItem('kycData', updatedProfile);
        
        this.isEditing = false;
      }
    }
  }

  private calculateProfileRank(score: number): 'beginner' | 'intermediate' | 'advanced' {
    if (score >= 80) return 'advanced';
    if (score >= 60) return 'intermediate';
    return 'beginner';
  }

  addGoal(): void {
    if (this.goalsForm.valid) {
      const goalData = this.goalsForm.value;
      const newGoal: FinancialGoal = {
        id: 'goal_' + Date.now(),
        ...goalData,
        targetDate: new Date(goalData.targetDate)
      };

      this.financialGoals.push(newGoal);
      this.storageService.setItem('financialGoals', this.financialGoals);
      this.goalsForm.reset();
      this.isEditingGoals = false;
    }
  }

  deleteGoal(goalId: string): void {
    this.financialGoals = this.financialGoals.filter(goal => goal.id !== goalId);
    this.storageService.setItem('financialGoals', this.financialGoals);
  }

  getGoalProgress(goal: FinancialGoal): number {
    return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  }

  getGoalProgressColor(progress: number): string {
    if (progress >= 80) return '#28a745';
    if (progress >= 50) return '#ffc107';
    return '#dc3545';
  }

  getRiskToleranceLabel(value: string): string {
    const option = this.riskToleranceOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  getTimelineLabel(value: string): string {
    const option = this.timelineOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  getCategoryIcon(category: string): string {
    const cat = this.goalCategories.find(c => c.value === category);
    return cat ? cat.icon : '🎯';
  }

  getCategoryLabel(category: string): string {
    const cat = this.goalCategories.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  }

  getEmergencyFundStatusColor(): string {
    if (!this.userProfile) return '#dc3545';
    
    switch (this.userProfile.emergencyFundStatus) {
      case 'excellent': return '#28a745';
      case 'adequate': return '#ffc107';
      case 'insufficient': return '#dc3545';
      default: return '#6c757d';
    }
  }

  getSavingsRateColor(): string {
    if (!this.userProfile) return '#dc3545';
    
    if (this.userProfile.savingsRate >= 0.15) return '#28a745';
    if (this.userProfile.savingsRate >= 0.10) return '#ffc107';
    return '#dc3545';
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToInvestmentAnalysis(): void {
    this.router.navigate(['/investment-analysis']);
  }
} 