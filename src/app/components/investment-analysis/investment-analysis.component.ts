import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvestmentAnalysisService, InvestmentData } from '../../services/investment-analysis.service';

@Component({
  selector: 'app-investment-analysis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="investment-analysis-container">
      <div class="header">
        <div class="header-content">
          <h1 class="main-title">
            <span class="gradient-text">Historical Investment</span>
            <br>Analysis
          </h1>
          <p class="subtitle">
            Discover what your investment could have grown to over the past 5 years
          </p>
        </div>
      </div>

      <div class="analysis-form">
        <div class="form-container">
          <div class="form-header">
            <h2>Let's Analyze Your Investment</h2>
            <p>Tell us about your investment preferences</p>
          </div>

          <form [formGroup]="investmentForm" (ngSubmit)="onSubmit()">
            <div class="form-section">
              <h3>Investment Amount</h3>
              <div class="amount-input">
                <label for="initialAmount">How much would you like to invest?</label>
                <div class="input-group">
                  <input 
                    type="number" 
                    id="initialAmount"
                    formControlName="initialAmount"
                    placeholder="5000"
                    class="amount-field"
                  >
                  <span class="currency">LE</span>
                </div>
                <div class="quick-amounts">
                  <button type="button" (click)="setAmount(5000)" class="quick-btn">5,000 LE</button>
                  <button type="button" (click)="setAmount(10000)" class="quick-btn">10,000 LE</button>
                  <button type="button" (click)="setAmount(25000)" class="quick-btn">25,000 LE</button>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3>Asset Allocation</h3>
              <div class="allocation-sliders">
                <div class="slider-group">
                  <div class="slider-header">
                    <span class="asset-icon">🥇</span>
                    <span class="asset-name">Gold</span>
                    <span class="asset-percentage">{{ goldAllocation }}%</span>
                  </div>
                  <input 
                    type="range" 
                    formControlName="goldAllocation"
                    min="0" 
                    max="100" 
                    class="slider gold-slider"
                    (input)="updateAllocation()"
                  >
                  <div class="slider-info">
                    <span>Historical Return: +257%</span>
                  </div>
                </div>

                <div class="slider-group">
                  <div class="slider-header">
                    <span class="asset-icon">📈</span>
                    <span class="asset-name">Equity Fund</span>
                    <span class="asset-percentage">{{ equityAllocation }}%</span>
                  </div>
                  <input 
                    type="range" 
                    formControlName="equityAllocation"
                    min="0" 
                    max="100" 
                    class="slider equity-slider"
                    (input)="updateAllocation()"
                  >
                  <div class="slider-info">
                    <span>Historical Return: +211%</span>
                  </div>
                </div>

                <div class="slider-group">
                  <div class="slider-header">
                    <span class="asset-icon">🛡️</span>
                    <span class="asset-name">Fixed Income</span>
                    <span class="asset-percentage">{{ fixedIncomeAllocation }}%</span>
                  </div>
                  <input 
                    type="range" 
                    formControlName="fixedIncomeAllocation"
                    min="0" 
                    max="100" 
                    class="slider fixed-income-slider"
                    (input)="updateAllocation()"
                  >
                  <div class="slider-info">
                    <span>Historical Return: +35%</span>
                  </div>
                </div>
              </div>

              <div class="allocation-summary">
                <div class="total-allocation" [class.valid]="isAllocationValid" [class.invalid]="!isAllocationValid">
                  <span>Total Allocation: {{ totalAllocation }}%</span>
                  <span *ngIf="!isAllocationValid" class="error-message">Must equal 100%</span>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                [disabled]="!investmentForm.valid || !isAllocationValid"
                class="analyze-btn"
              >
                📊 Analyze My Investment →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .investment-analysis-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f6f8ff 0%, #ffffff 100%);
      padding: 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .main-title {
      font-size: 3.5rem;
      line-height: 1.2;
      margin-bottom: 1rem;
      color: #1a1a1a;
    }

    .gradient-text {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 1.25rem;
      color: #4b5563;
      line-height: 1.6;
    }

    .analysis-form {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-container {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .form-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .form-header h2 {
      font-size: 2.5rem;
      color: #1a1a1a;
      margin-bottom: 1rem;
    }

    .form-section {
      margin-bottom: 3rem;
    }

    .form-section h3 {
      font-size: 1.5rem;
      color: #1a1a1a;
      margin-bottom: 1rem;
    }

    .amount-input label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }

    .input-group {
      position: relative;
      margin-bottom: 1rem;
    }

    .amount-field {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 1.2rem;
      transition: border-color 0.3s ease;
    }

    .amount-field:focus {
      outline: none;
      border-color: #6366f1;
    }

    .currency {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      font-weight: 600;
    }

    .quick-amounts {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .quick-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 25px;
      background: white;
      color: #374151;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quick-btn:hover {
      border-color: #6366f1;
      color: #6366f1;
    }

    .allocation-sliders {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .slider-group {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 15px;
    }

    .slider-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .asset-icon {
      font-size: 1.5rem;
    }

    .asset-name {
      flex: 1;
      font-weight: 600;
      color: #374151;
    }

    .asset-percentage {
      font-weight: bold;
      color: #6366f1;
      font-size: 1.2rem;
    }

    .slider {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      outline: none;
      margin-bottom: 0.5rem;
    }

    .gold-slider {
      background: linear-gradient(to right, #fbbf24, #f59e0b);
    }

    .equity-slider {
      background: linear-gradient(to right, #10b981, #059669);
    }

    .fixed-income-slider {
      background: linear-gradient(to right, #6366f1, #4f46e5);
    }

    .slider-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .allocation-summary {
      margin-top: 1rem;
      text-align: center;
    }

    .total-allocation {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 25px;
      font-weight: 600;
    }

    .total-allocation.valid {
      background: #d1fae5;
      color: #065f46;
    }

    .total-allocation.invalid {
      background: #fee2e2;
      color: #991b1b;
    }

    .error-message {
      display: block;
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      text-align: center;
      margin-top: 3rem;
    }

    .analyze-btn {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }

    .analyze-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }

    .analyze-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class InvestmentAnalysisComponent implements OnInit {
  investmentForm: FormGroup;
  goldAllocation = 33;
  equityAllocation = 34;
  fixedIncomeAllocation = 33;
  totalAllocation = 100;
  isAllocationValid = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private investmentService: InvestmentAnalysisService
  ) {
    this.investmentForm = this.fb.group({
      initialAmount: [5000, [Validators.required, Validators.min(1000)]],
      goldAllocation: [33, [Validators.required, Validators.min(0), Validators.max(100)]],
      equityAllocation: [34, [Validators.required, Validators.min(0), Validators.max(100)]],
      fixedIncomeAllocation: [33, [Validators.required, Validators.min(0), Validators.max(100)]],
      investmentPeriod: [5, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.updateAllocation();
  }

  setAmount(amount: number): void {
    this.investmentForm.patchValue({ initialAmount: amount });
  }

  updateAllocation(): void {
    this.goldAllocation = this.investmentForm.get('goldAllocation')?.value || 0;
    this.equityAllocation = this.investmentForm.get('equityAllocation')?.value || 0;
    this.fixedIncomeAllocation = this.investmentForm.get('fixedIncomeAllocation')?.value || 0;
    
    this.totalAllocation = this.goldAllocation + this.equityAllocation + this.fixedIncomeAllocation;
    this.isAllocationValid = this.investmentService.validateAllocation(
      this.goldAllocation, 
      this.equityAllocation, 
      this.fixedIncomeAllocation
    );
  }

  onSubmit(): void {
    if (this.investmentForm.valid && this.isAllocationValid) {
      const formData = this.investmentForm.value;
      const investmentData: InvestmentData = {
        initialAmount: formData.initialAmount,
        goldAllocation: formData.goldAllocation,
        equityAllocation: formData.equityAllocation,
        fixedIncomeAllocation: formData.fixedIncomeAllocation,
        investmentPeriod: formData.investmentPeriod,
        startDate: new Date()
      };

      const result = this.investmentService.calculateInvestmentReturns(investmentData);
      
      this.investmentService.saveInvestmentData(investmentData);
      this.investmentService.saveInvestmentResult(result);
      
      this.router.navigate(['/investment-results']);
    }
  }
}
