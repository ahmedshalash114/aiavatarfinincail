import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { faFaceSmile, faFaceGrinStars, faFaceGrinTears, faFaceSurprise, faFaceGrinBeam, faFaceMeh, faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
  totalSteps = 5;
  avatarMessage = '';
  avatarExpression: AvatarExpression = 'happy';
  avatarAnimation = 'idle';
  isTyping = false;
  profileRank = 0;
  selectedGender: 'male' | 'female' = 'male';

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

  // Step-specific messages with expressions
  private stepMessages: Array<{
    message: string;
    expression: AvatarExpression;
    animation: string;
  }> = [
    {
      message: 'Hi there! I\'m your financial teddy bear. Let\'s get to know each other better! 🧸',
      expression: 'happy',
      animation: 'wave'
    },
    {
      message: 'Great! Now, let\'s talk about your financial situation. Don\'t worry, I\'m here to help!',
      expression: 'thinking',
      animation: 'nod'
    },
    {
      message: 'Perfect! What are your financial goals? I\'m excited to help you achieve them!',
      expression: 'excited',
      animation: 'bounce'
    },
    {
      message: 'Almost done! Just a few more preferences to set. You\'re doing great!',
      expression: 'success',
      animation: 'spin'
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService
  ) {
    this.kycForm = this.fb.group({
      gender: ['male', Validators.required],
      personalInfo: this.fb.group({
        fullName: ['', Validators.required],
        age: ['', [Validators.required, Validators.min(18)]],
        occupation: ['', Validators.required]
      }),
      financialInfo: this.fb.group({
        annualIncome: [0, [Validators.required, Validators.min(1)]],
        savings: [0, [Validators.required, Validators.min(1)]],
        investments: [0, [Validators.required, Validators.min(1)]]
      }),
      goals: this.fb.group({
        shortTermGoal: [0, [Validators.required, Validators.min(1)]],
        longTermGoal: [0, [Validators.required, Validators.min(1)]],
        riskTolerance: ['', Validators.required]
      }),
      preferences: this.fb.group({
        investmentStyle: ['', Validators.required],
        preferredContact: ['', Validators.required]
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
  }

  getCurrentIcon(): IconDefinition {
    return this.iconMap[this.avatarExpression] || this.iconMap.happy;
  }

  updateProgressRings(): void {
    const progress = (this.currentStep / this.totalSteps) * 100;
    this.progressRings = this.progressRings.map((ring, index) => ({
      ...ring,
      progress: `${progress}%`
    }));
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateAvatarMessage();
      this.updateProgressRings();
      this.triggerAnimation('thinking');
      this.updateProfileRank();
      
      // Add celebration message for completing steps
      if (this.currentStep === this.totalSteps) {
        setTimeout(() => {
          this.isTyping = true;
          this.avatarMessage = 'Fantastic! You\'ve completed all the steps. Let\'s review your financial profile! 🎉';
          this.avatarExpression = 'excited';
          this.triggerAnimation('celebrate');
          setTimeout(() => {
            this.isTyping = false;
          }, 500);
        }, 1000);
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateAvatarMessage();
      this.updateProgressRings();
      this.triggerAnimation('thinking');
      
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
    const stepData = this.stepMessages[this.currentStep - 1];
    this.isTyping = true;
    this.avatarMessage = stepData.message;
    setTimeout(() => {
      this.isTyping = false;
    }, 500);
    this.avatarExpression = stepData.expression;
    this.avatarAnimation = stepData.animation;
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
    const financialInfo = this.kycForm.get('financialInfo')?.value;
    const goals = this.kycForm.get('goals')?.value;
    
    let score = 0;
    
    // Score based on financial information
    if (financialInfo) {
      if (financialInfo.investments > 0) score += 2;
      if (financialInfo.savings > 0) score += 1;
    }
    
    // Score based on goals
    if (goals) {
      if (goals.riskTolerance === 'high') score += 2;
      else if (goals.riskTolerance === 'medium') score += 1;
    }
    
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

  getCurrentFormGroup(): FormGroup | null {
    switch (this.currentStep) {
      case 1: return this.kycForm.get('personalInfo') as FormGroup;
      case 2: return this.kycForm.get('financialInfo') as FormGroup;
      case 3: return this.kycForm.get('goals') as FormGroup;
      case 4: return this.kycForm.get('preferences') as FormGroup;
      default: return null;
    }
  }

  triggerAnimation(animation: string): void {
    this.avatarAnimation = animation;
    setTimeout(() => {
      this.avatarAnimation = this.stepMessages[this.currentStep - 1].animation;
    }, 1000);
  }

  onSubmit(): void {
    if (this.kycForm.valid) {
      // Save form data using storage service
      this.storageService.setItem('kycFormData', this.kycForm.value);
      this.router.navigate(['/results']);
    }
  }
} 