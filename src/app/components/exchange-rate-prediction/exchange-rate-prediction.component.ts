import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { ExchangeRateInputs, ExchangeRateCalculation, ExchangeRatePrediction, HistoricalAccuracy } from '../../models/exchange-rate.model';

@Component({
  selector: 'app-exchange-rate-prediction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exchange-rate-prediction.component.html',
  styleUrls: ['./exchange-rate-prediction.component.scss']
})
export class ExchangeRatePredictionComponent implements OnInit {
  predictionForm: FormGroup;
  calculation: ExchangeRateCalculation | null = null;
  financialTwinPrediction: ExchangeRatePrediction | null = null;
  historicalAccuracy: HistoricalAccuracy[] = [];
  averageAccuracy: number = 0;
  showResults: boolean = false;
  showHistoricalData: boolean = false;
  isLoading: boolean = false;
  errors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private exchangeRateService: ExchangeRateService
  ) {
    this.predictionForm = this.fb.group({
      egyptInflationRate: [35.0, [Validators.required, Validators.min(0), Validators.max(100)]],
      usInflationRate: [2.5, [Validators.required, Validators.min(0), Validators.max(100)]],
      currentExchangeRate: [31.0, [Validators.required, Validators.min(0.01)]],
      targetYear: [2026, [Validators.required, Validators.min(new Date().getFullYear())]]
    });
  }

  ngOnInit(): void {
    this.loadFinancialTwinPrediction();
    this.loadHistoricalAccuracy();
  }

  /**
   * Calculate exchange rate prediction
   */
  calculatePrediction(): void {
    if (this.predictionForm.valid) {
      this.isLoading = true;
      this.errors = [];
      
      const inputs: ExchangeRateInputs = this.predictionForm.value;
      
      // Validate inputs
      const validation = this.exchangeRateService.validateInputs(inputs);
      if (!validation.isValid) {
        this.errors = validation.errors;
        this.isLoading = false;
        return;
      }
      
      // Calculate prediction
      this.calculation = this.exchangeRateService.calculateExchangeRate(inputs);
      this.showResults = true;
      this.isLoading = false;
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Load Your Financial Twin's 2026 prediction
   */
  private loadFinancialTwinPrediction(): void {
    this.financialTwinPrediction = this.exchangeRateService.getFinancialTwin2026Prediction();
  }

  /**
   * Load historical accuracy data
   */
  private loadHistoricalAccuracy(): void {
    this.historicalAccuracy = this.exchangeRateService.calculateHistoricalAccuracy();
    this.averageAccuracy = this.exchangeRateService.getAverageAccuracy();
  }

  /**
   * Toggle historical data display
   */
  toggleHistoricalData(): void {
    this.showHistoricalData = !this.showHistoricalData;
  }

  /**
   * Reset form and results
   */
  resetForm(): void {
    this.predictionForm.reset({
      egyptInflationRate: 35.0,
      usInflationRate: 2.5,
      currentExchangeRate: 31.0,
      targetYear: 2026
    });
    this.calculation = null;
    this.showResults = false;
    this.errors = [];
  }

  /**
   * Mark all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.predictionForm.controls).forEach(key => {
      const control = this.predictionForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Get confidence color class
   */
  getConfidenceColor(confidence: string): string {
    switch (confidence) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-danger';
      default: return 'text-muted';
    }
  }

  /**
   * Get accuracy color class
   */
  getAccuracyColor(accuracy: number): string {
    if (accuracy >= 80) return 'text-success';
    if (accuracy >= 60) return 'text-warning';
    return 'text-danger';
  }

  /**
   * Format number with 2 decimal places
   */
  formatNumber(value: number): string {
    return value.toFixed(2);
  }

  /**
   * Get inflation differential interpretation
   */
  getDifferentialInterpretation(differential: number): string {
    if (differential > 0) {
      return 'Egypt inflation higher - EGP expected to depreciate';
    } else if (differential < 0) {
      return 'US inflation higher - EGP expected to appreciate';
    }
    return 'Equal inflation rates - EGP expected to remain stable';
  }
} 