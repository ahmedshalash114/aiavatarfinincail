import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ResultsComponent implements OnInit {
  profileScore = 0;
  profileRank = '';
  recommendations: string[] = [];
  avatarMessage = '';
  avatarExpression = 'success';
  avatarAnimation = 'celebrate';
  isTyping = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get the form data from localStorage
    const formData = JSON.parse(localStorage.getItem('kycFormData') || '{}');
    this.calculateProfileScore(formData);
    this.generateRecommendations(formData);
    this.updateAvatarMessage();
  }

  calculateProfileScore(formData: any): void {
    let score = 0;
    
    // Score based on financial information
    if (formData.financialInfo) {
      if (formData.financialInfo.investments > 0) score += 2;
      if (formData.financialInfo.savings > 0) score += 1;
    }
    
    // Score based on goals
    if (formData.goals) {
      if (formData.goals.riskTolerance === 'high') score += 2;
      else if (formData.goals.riskTolerance === 'medium') score += 1;
    }

    this.profileScore = score;
    
    // Determine profile rank
    if (score >= 4) {
      this.profileRank = 'Advanced';
    } else if (score >= 2) {
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
    if (formData.goals) {
      if (formData.goals.shortTermGoal) {
        recommendations.push(`Focus on short-term goal: ${formData.goals.shortTermGoal}`);
      }
      if (formData.goals.longTermGoal) {
        recommendations.push(`Plan for long-term goal: ${formData.goals.longTermGoal}`);
      }
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

  startOver(): void {
    localStorage.removeItem('kycFormData');
    this.router.navigate(['/kyc']);
  }
} 