import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { KYCApiService, KYCData } from '../../services/kyc-api.service';
import { faFaceSmile, faFaceGrinStars, faFaceGrinTears, faFaceSurprise, faFaceGrinBeam, faFaceMeh, faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartOptions, ChartType, ChartData, Chart } from 'chart.js';


// Define the AvatarExpression type outside the class
type AvatarExpression = 'happy' | 'thinking' | 'excited' | 'concerned' | 'success' | 'surprised' | 'proud';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ,FontAwesomeModule]

})
export class KYCComponent implements OnInit {
  kycForm: FormGroup;
  currentStep = 1;
  totalSteps = 7;
  avatarMessage = '';
  avatarExpression = 'happy';
  avatarAnimation = 'idle';
  isTyping = false;
  profileRank = 0;
  selectedGender: 'male' | 'female' = 'male';
  showValidationError = false;
  profileScore: number = 0;

  // Dashboard visualization properties
  orbits = [
    {
      icon: '💰',
      tooltip: 'Income',
      class: 'income',
      delay: '0s'
    },
    {
      icon: '📈',
      tooltip: 'Investments',
      class: 'investments',
      delay: '0.5s'
    },
    {
      icon: '🎯',
      tooltip: 'Goals',
      class: 'goals',
      delay: '1s'
    },
    {
      icon: '💡',
      tooltip: 'Insights',
      class: 'insights',
      delay: '1.5s'
    }
  ];

  progressRings = [
    {
      progress: '0%',
      class: 'primary'
    },
    {
      progress: '0%',
      class: 'secondary'
    },
    {
      progress: '0%',
      class: 'tertiary'
    }
  ];

  // Avatar expressions and their corresponding messages
  private expressions = {
    happy: 'happy',
    thinking: 'thinking',
    excited: 'excited',
    concerned: 'concerned',
    success: 'success',
    surprised: 'surprised',
    proud: 'proud'
  };

  // Add expressionIcons property
  private expressionIcons: Record<AvatarExpression, string> = {
    happy: 'fa-face-smile',
    thinking: 'fa-face-thinking',
    excited: 'fa-face-grin-stars',
    concerned: 'fa-face-worried',
    success: 'fa-face-grin-tears',
    surprised: 'fa-face-surprise',
    proud: 'fa-face-grin-beam'
  };

  // Step-specific messages
  private stepMessages = [
    {
      message: 'Let\'s start with some basic information about you! 🎯',
      expression: 'happy',
      animation: 'wave'
    },
    {
      message: 'Great! Now, let\'s talk about your financial situation. 💰',
      expression: 'thinking',
      animation: 'nod'
    },
    {
      message: 'What are your main goals for investing? 🎯',
      expression: 'excited',
      animation: 'bounce'
    },
    {
      message: 'How do you feel about investment fluctuations? 📈',
      expression: 'thinking',
      animation: 'nod'
    },
    {
      message: 'Almost done! Just one more question about your timeline. ⏰',
      expression: 'success',
      animation: 'spin'
    },
    {
      message: 'Perfect! Let\'s analyze your profile and create your personalized plan! 🎉',
      expression: 'excited',
      animation: 'celebrate'
    },
    {
      message: 'One last thing! Want free personalized analysis & updates? 💡',
      expression: 'proud',
      animation: 'celebrate'
    }
  ];

  // Field-specific messages
  private fieldMessages: { [key: string]: { valid: string; invalid: string } } = {
    fullName: {
      valid: 'Nice to meet you, {name}! 👋',
      invalid: 'Please tell me your name so I can address you properly.'
    },
    age: {
      valid: 'Perfect! Age is just a number when it comes to financial planning.',
      invalid: 'Please enter a valid age (18 or above).'
    },
    occupation: {
      valid: 'That\'s an interesting profession! Let\'s tailor your financial plan accordingly.',
      invalid: 'Please let me know what you do for a living.'
    },
    annualIncome: {
      valid: 'Thanks for sharing! This helps me understand your financial capacity better.',
      invalid: 'Please enter your annual income to help me provide better recommendations.'
    },
    savings: {
      valid: 'Great job on your savings! 💰',
      invalid: 'Please let me know about your current savings.'
    },
    investments: {
      valid: 'Impressive investment portfolio! 📈',
      invalid: 'Please share your current investment details.'
    },
    shortTermGoal: {
      valid: 'Excellent short-term goal! Let\'s work on achieving it.',
      invalid: 'Please tell me about your short-term financial goal.'
    },
    longTermGoal: {
      valid: 'Ambitious long-term goal! I\'ll help you get there.',
      invalid: 'Please share your long-term financial goal.'
    },
    riskTolerance: {
      valid: 'Perfect! I\'ll tailor your investment strategy based on your risk tolerance.',
      invalid: 'Please select your risk tolerance level.'
    },
    investmentStyle: {
      valid: 'Great choice! Your investment style will guide our strategy.',
      invalid: 'Please select your preferred investment style.'
    },
    preferredContact: {
      valid: 'Noted! I\'ll make sure to reach out through your preferred method.',
      invalid: 'Please select how you\'d like to be contacted.'
    },
    email: {
      valid: 'Great! You\'ll be hearing from us soon. 📧',
      invalid: 'Please enter a valid email address.'
    }
  };

  // Profile ranking messages
  private rankingMessages: Record<'beginner' | 'intermediate' | 'advanced', {
    message: string;
    expression: AvatarExpression;
    animation: string;
  }> = {
    beginner: {
      message: 'Welcome to your financial journey! I\'ll be here to guide you every step of the way. 🌟',
      expression: 'happy',
      animation: 'wave'
    },
    intermediate: {
      message: 'You\'re making great progress! Let\'s take your financial knowledge to the next level. 📈',
      expression: 'excited',
      animation: 'bounce'
    },
    advanced: {
      message: 'Impressive financial knowledge! Let\'s optimize your strategy together. 🎯',
      expression: 'proud',
      animation: 'celebrate'
    }
  };

  iconMap: Record<AvatarExpression, IconDefinition> = {
    happy: faFaceSmile,
    thinking: faFaceMeh,
    excited: faFaceGrinStars,
    concerned: faFaceFrown,
    success: faFaceGrinTears,
    surprised: faFaceSurprise,
    proud: faFaceGrinBeam
  };

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
        data: [],
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private kycApiService: KYCApiService
  ) {
    this.kycForm = this.fb.group({
      step1: this.fb.group({
        fullName: ['', Validators.required],
        age: ['', [Validators.required, Validators.min(18)]],
        gender: ['male', Validators.required]
      }),
      step2: this.fb.group({
        occupation: ['', Validators.required],
        annualIncome: ['', [Validators.required, Validators.min(0)]]
      }),
      step3: this.fb.group({
        savings: ['', [Validators.required, Validators.min(0)]],
        investments: ['', [Validators.required, Validators.min(0)]]
      }),
      step4: this.fb.group({
        shortTermGoal: ['', Validators.required],
        longTermGoal: ['', Validators.required]
      }),
      step5: this.fb.group({
        riskTolerance: ['', Validators.required],
        investmentStyle: ['', Validators.required]
      }),
      step6: this.fb.group({
        investmentKnowledge: ['', Validators.required],
        preferredContact: ['email', Validators.required]
      }),
      step7: this.fb.group({
        email: ['', [Validators.email]]
      })
    });

    this.kycForm.get('gender')?.valueChanges.subscribe((gender) => {
      this.selectedGender = gender;
    });

    // Subscribe to form changes for interactive feedback
    this.kycForm.valueChanges.subscribe(() => {
      this.handleFormChanges();
    });
  }

  ngOnInit(): void {
    this.updateAvatarMessage();
    this.setRadarChartData();
    if (this.kycForm) {
      this.kycForm.valueChanges.subscribe(() => {
        this.updateProgressRings();
        this.updateProfileRank();
        this.setRadarChartData();
        this.updateProfileScore();
      });
    }
    this.updateProfileScore();
  }

  getCurrentIcon(): IconDefinition {
    return this.iconMap[this.avatarExpression as AvatarExpression] || this.iconMap.happy;
  }

  updateProgressRings(): void {
    const progress = (this.currentStep / this.totalSteps) * 100;
    this.progressRings = this.progressRings.map((ring, index) => ({
      ...ring,
      progress: `${progress}%`
    }));
  }

  isCurrentStepValid(): boolean {
    if (this.currentStep > this.totalSteps) {
      return true;
    }
    if (this.currentStep === 7) { // Email step is optional
      return true;
    }
    const currentGroup = this.kycForm.get(`step${this.currentStep}`);
    return currentGroup ? currentGroup.valid : false;
  }

  nextStep(): void {
    if (this.isCurrentStepValid()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateAvatarMessage();
        this.triggerAnimation('next');
        this.updateProgressRings();
        this.showValidationError = false;
        // Update profile rank based on current step
        this.updateProfileRank();
        
        // Add a delay to simulate typing and thinking
        if (this.currentStep === this.totalSteps) {
          setTimeout(() => {
            this.updateRankingMessage('advanced');
          }, 1000);
        }
      }
    } else {
      this.showValidationError = true;
      const currentGroup = this.kycForm.get(`step${this.currentStep}`) as FormGroup;
      if (currentGroup) {
        // Mark all fields as touched to show errors
        Object.keys(currentGroup.controls).forEach(field => {
          const control = currentGroup.get(field);
          control?.markAsTouched({ onlySelf: true });
        });
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateAvatarMessage();
      this.triggerAnimation('previous');
      this.updateProgressRings();
      
      // Add encouraging message when going back
      setTimeout(() => {
        this.isTyping = true;
        this.avatarMessage = 'No worries! Let\'s review the previous step together. 🔍';
        this.avatarExpression = 'thinking';
        setTimeout(() => {
          this.isTyping = false;
        }, 500);
      }, 1000);
    }
  }

  updateAvatarMessage(): void {
    this.isTyping = true;
    setTimeout(() => {
      if (this.currentStep <= this.totalSteps) {
        const stepInfo = this.stepMessages[this.currentStep - 1];
        this.avatarMessage = stepInfo.message;
        this.setAvatarExpression(stepInfo.expression as AvatarExpression);
      }
      this.isTyping = false;
    }, 500); // Typing effect duration
  }

  handleFormChanges(): void {
    const currentFormGroup = this.getCurrentFormGroup();
    if (currentFormGroup) {
      const controls = currentFormGroup.controls;
      Object.keys(controls).forEach(fieldName => {
        const control = controls[fieldName];
        if (control.dirty) {
          const fieldMessage = this.fieldMessages[fieldName];
          if (fieldMessage) {
            this.isTyping = true;
            if (control.valid) {
              let message = fieldMessage.valid;
              if (fieldName === 'fullName') {
                message = message.replace('{name}', control.value);
              }
              this.avatarMessage = message;
              this.avatarExpression = 'happy';
              this.triggerAnimation('nod');
            } else {
              this.avatarMessage = fieldMessage.invalid;
              this.avatarExpression = 'thinking';
              this.triggerAnimation('shake');
            }
            setTimeout(() => {
              this.isTyping = false;
            }, 500);
          }
        }
      });
    }
  }

  updateProfileRank(): void {
    // Calculate profile rank based on form completion and financial knowledge
    const savings = this.kycForm.get('step3.savings')?.value;
    const investments = this.kycForm.get('step3.investments')?.value;
    const riskTolerance = this.kycForm.get('step5.riskTolerance')?.value;
    const investmentKnowledge = this.kycForm.get('step6.investmentKnowledge')?.value;
    
    let score = 0;
    
    // Score based on financial information
    if (investments && investments > 0) score += 2;
    if (savings && savings > 0) score += 1;
    
    // Score based on risk tolerance
    if (riskTolerance === 'high') score += 2;
    else if (riskTolerance === 'medium') score += 1;
    
    // Score based on investment knowledge
    if (investmentKnowledge === 'advanced') score += 2;
    else if (investmentKnowledge === 'intermediate') score += 1;
    
    this.profileRank = score;
    
    // Update avatar based on profile rank
    if (score >= 4) {
      this.updateRankingMessage('advanced');
    } else if (score >= 2) {
      this.updateRankingMessage('intermediate');
    } else {
      this.updateRankingMessage('beginner');
    }
  }

  updateRankingMessage(level: 'beginner' | 'intermediate' | 'advanced'): void {
    const rankingData = this.rankingMessages[level];
    this.isTyping = true;
    this.avatarMessage = rankingData.message;
    setTimeout(() => {
      this.isTyping = false;
    }, 500);
    this.avatarExpression = rankingData.expression;
    this.avatarAnimation = rankingData.animation;
  }

  getCurrentFormGroup(): FormGroup {
    return this.kycForm;
  }

  triggerAnimation(animation: string): void {
    this.avatarAnimation = animation;
    setTimeout(() => {
      this.avatarAnimation = this.stepMessages[this.currentStep - 1].animation;
    }, 1000);
  }

  onSubmit(): void {
    if (this.kycForm.valid) {
      // Prepare the data for the API
      const formData = this.kycForm.value;
      const kycData: KYCData = {
        fullName: formData.step1?.fullName || '',
        email: formData.step7?.email || '',
        gender: formData.step1?.gender || '',
        age: formData.step1?.age || 0,
        occupation: formData.step2?.occupation || '',
        monthlyIncome: (formData.step2?.annualIncome || 0) / 12, // Convert annual to monthly
        savings: formData.step3?.savings || 0,
        investments: formData.step3?.investments || 0,
        investmentGoal: formData.step4?.shortTermGoal || '',
        riskTolerance: this.getRiskToleranceLabel(formData.step5?.riskTolerance),
        investmentTimeline: '5 years', // Default value
        shortTermGoal: formData.step4?.shortTermGoal || '',
        longTermGoal: formData.step4?.longTermGoal || '',
        investmentStyle: this.getInvestmentStyleLabel(formData.step5?.investmentStyle),
        preferredContact: this.getPreferredContactLabel(formData.step6?.preferredContact),
        profileScore: this.profileScore,
        profileRank: this.getProfileRankLabel()
      };

      // Store KYC data locally for the dashboard
      this.storageService.setItem('kycData', kycData);

      // Send data to backend
      this.kycApiService.submitKYCData(kycData).subscribe({
        next: (response) => {
          console.log('KYC data submitted successfully:', response);
          // Store form data locally as well
          this.storageService.setItem('kycFormData', this.kycForm.value);
          this.storageService.setItem('kycApiResponse', response);
          // Navigate to dashboard instead of results
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error submitting KYC data:', error);
          // Still navigate to dashboard even if API call fails
          this.storageService.setItem('kycFormData', this.kycForm.value);
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  // Helper methods to convert form values to API format
  private getRiskToleranceLabel(risk: string): string {
    switch (risk) {
      case 'low': return 'Low';
      case 'medium': return 'Medium';
      case 'high': return 'High';
      default: return 'Medium';
    }
  }

  private getInvestmentStyleLabel(style: string): string {
    switch (style) {
      case 'hands_on': return 'Active';
      case 'hands_off': return 'Passive';
      default: return 'Moderate';
    }
  }

  private getPreferredContactLabel(contact: string): string {
    switch (contact) {
      case 'email': return 'Email';
      case 'phone': return 'Phone';
      case 'none': return 'None';
      default: return 'Email';
    }
  }

  private getProfileRankLabel(): string {
    if (this.profileScore >= 80) return 'Advanced';
    if (this.profileScore >= 50) return 'Intermediate';
    return 'Beginner';
  }

  getProgressOffset(): number {
    const circumference = 2 * Math.PI * 45; // 2πr where r=45
    const progress = (this.currentStep / this.totalSteps) * 100;
    return circumference - (progress / 100) * circumference;
  }

  getInvestmentGoalLabel(): string {
    const goal = this.kycForm.get('investmentGoal')?.value;
    switch (goal) {
      case 'grow':
        return 'Growth Focused';
      case 'protect':
        return 'Capital Protection';
      case 'unsure':
        return 'Exploring Options';
      default:
        return 'Not Selected';
    }
  }

  getRiskProfileLabel(): string {
    const risk = this.kycForm.get('riskTolerance')?.value;
    switch (risk) {
      case 'ok':
        return 'Risk Tolerant';
      case 'moderate':
        return 'Moderate Risk';
      case 'not_ok':
        return 'Risk Averse';
      default:
        return 'Not Selected';
    }
  }

  getProfileInsight(): string {
    const annualIncome = this.kycForm.get('step2.annualIncome')?.value;
    const shortTermGoal = this.kycForm.get('step4.shortTermGoal')?.value;
    const riskTolerance = this.kycForm.get('step5.riskTolerance')?.value;

    if (!annualIncome || !shortTermGoal || !riskTolerance) {
      return 'Complete your profile to get personalized insights.';
    }

    let insight = '';

    // Income-based insights
    if (annualIncome >= 600000) { // 50K+ monthly
      insight += 'With your income level, you have great potential for wealth building. ';
    } else if (annualIncome >= 300000) { // 25K+ monthly
      insight += 'Your income provides a solid foundation for investment growth. ';
    } else {
      insight += 'Starting your investment journey early is a smart move. ';
    }

    // Goal-based insights
    if (shortTermGoal.toLowerCase().includes('car') || shortTermGoal.toLowerCase().includes('vehicle')) {
      insight += 'Your vehicle goal suggests a medium-term investment strategy. ';
    } else if (shortTermGoal.toLowerCase().includes('house') || shortTermGoal.toLowerCase().includes('property')) {
      insight += 'Your property goal indicates a long-term wealth-building approach. ';
    } else {
      insight += 'Your specific goal will help tailor the right investment strategy. ';
    }

    // Risk-based insights
    if (riskTolerance === 'high') {
      insight += 'Your high risk tolerance allows for more dynamic investment opportunities.';
    } else if (riskTolerance === 'medium') {
      insight += 'A balanced portfolio would suit your moderate risk appetite.';
    } else {
      insight += 'Conservative investments would align well with your risk profile.';
    }

    return insight;
  }

  setRadarChartData() {
    // Use your logic to get the values for each axis (0-100)
    const kycData = JSON.parse(localStorage.getItem('kycData') || '{}');
    this.radarChartData.datasets[0].data = [
      this.calculateIncomeScore(kycData.monthlyIncome),
      this.calculateRiskScore(kycData.riskTolerance),
      kycData.investmentGoal !== 'unsure' ? 75 : 50,
      (kycData.investmentGoal === 'grow' || kycData.investmentGoal === 'protect') ? 75 : 50,
      kycData.investmentTimeline === 'yes' ? 75 : 50
    ];
  }

  calculateIncomeScore(income: number): number {
    // Implement your logic to calculate income score
    return 75; // Placeholder, actual implementation needed
  }

  calculateRiskScore(risk: string): number {
    // Implement your logic to calculate risk score
    return 75; // Placeholder, actual implementation needed
  }

  updateProfileScore(): void {
    if (!this.kycForm) return;
    
    let score = 0;
    
    // Income score (from step2)
    const annualIncome = this.kycForm.get('step2.annualIncome')?.value;
    if (annualIncome) {
      if (annualIncome >= 600000) score += 30; // 50K+ monthly
      else if (annualIncome >= 300000) score += 20; // 25K+ monthly
      else score += 10;
    }
    
    // Savings score (from step3)
    const savings = this.kycForm.get('step3.savings')?.value;
    if (savings) {
      if (savings >= 1000000) score += 20;
      else if (savings >= 500000) score += 15;
      else score += 10;
    }
    
    // Investments score (from step3)
    const investments = this.kycForm.get('step3.investments')?.value;
    if (investments) {
      if (investments >= 1000000) score += 20;
      else if (investments >= 500000) score += 15;
      else score += 10;
    }
    
    // Risk tolerance score (from step5)
    const riskTolerance = this.kycForm.get('step5.riskTolerance')?.value;
    if (riskTolerance) {
      if (riskTolerance === 'high') score += 20;
      else if (riskTolerance === 'medium') score += 15;
      else score += 10;
    }
    
    // Investment knowledge score (from step6)
    const investmentKnowledge = this.kycForm.get('step6.investmentKnowledge')?.value;
    if (investmentKnowledge) {
      if (investmentKnowledge === 'advanced') score += 10;
      else if (investmentKnowledge === 'intermediate') score += 7;
      else score += 5;
    }
    
    this.profileScore = Math.min(100, score);
  }

  setAvatarExpression(expression: AvatarExpression): void {
    this.avatarExpression = expression;
  }

  goToLanding(): void {
    this.router.navigate(['/']);
  }

  goToInvestmentAnalysis(): void {
    this.router.navigate(['/investment-analysis']);
  }
} 