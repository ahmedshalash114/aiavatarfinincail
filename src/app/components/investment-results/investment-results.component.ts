import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvestmentAnalysisService, InvestmentResult } from '../../services/investment-analysis.service';

@Component({
  selector: 'app-investment-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="investment-results-container">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <h1 class="main-title">
            <span class="gradient-text">Your Investment</span>
            <br>Analysis Results
          </h1>
          <p class="subtitle">
            Here's what your investment could have achieved over the past 5 years
          </p>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="results-summary" *ngIf="investmentResult">
        <div class="summary-card">
          <div class="summary-header">
            <h2>Investment Summary</h2>
            <div class="period-badge">{{ investmentResult.yearlyData.length }} Years</div>
          </div>
          
          <div class="summary-metrics">
            <div class="metric">
              <div class="metric-label">Initial Investment</div>
              <div class="metric-value">{{ investmentResult.initialAmount | number:'1.0-0' }} LE</div>
            </div>
            <div class="metric">
              <div class="metric-label">Final Value</div>
              <div class="metric-value final">{{ investmentResult.finalAmount | number:'1.0-0' }} LE</div>
            </div>
            <div class="metric">
              <div class="metric-label">Total Return</div>
              <div class="metric-value return">+{{ investmentResult.totalReturn | number:'1.0-0' }} LE</div>
            </div>
            <div class="metric">
              <div class="metric-label">Return %</div>
              <div class="metric-value percentage">+{{ investmentResult.totalReturnPercentage | number:'1.1-1' }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Asset Breakdown -->
      <div class="asset-breakdown" *ngIf="investmentResult">
        <h2>Asset Performance Breakdown</h2>
        <div class="breakdown-cards">
          <div class="breakdown-card gold">
            <div class="card-header">
              <div class="asset-icon">🥇</div>
              <div class="asset-info">
                <h3>Gold</h3>
                <p>{{ investmentResult.breakdown.gold.amount | number:'1.0-0' }} LE invested</p>
              </div>
            </div>
            <div class="card-performance">
              <div class="performance-metric">
                <span class="label">Return</span>
                <span class="value">+{{ investmentResult.breakdown.gold.return | number:'1.0-0' }} LE</span>
              </div>
              <div class="performance-metric">
                <span class="label">Return %</span>
                <span class="value">+{{ investmentResult.breakdown.gold.returnPercentage | number:'1.1-1' }}%</span>
              </div>
            </div>
          </div>

          <div class="breakdown-card equity">
            <div class="card-header">
              <div class="asset-icon">📈</div>
              <div class="asset-info">
                <h3>Equity Fund</h3>
                <p>{{ investmentResult.breakdown.equity.amount | number:'1.0-0' }} LE invested</p>
              </div>
            </div>
            <div class="card-performance">
              <div class="performance-metric">
                <span class="label">Return</span>
                <span class="value">+{{ investmentResult.breakdown.equity.return | number:'1.0-0' }} LE</span>
              </div>
              <div class="performance-metric">
                <span class="label">Return %</span>
                <span class="value">+{{ investmentResult.breakdown.equity.returnPercentage | number:'1.1-1' }}%</span>
              </div>
            </div>
          </div>

          <div class="breakdown-card fixed-income">
            <div class="card-header">
              <div class="asset-icon">🛡️</div>
              <div class="asset-info">
                <h3>Fixed Income</h3>
                <p>{{ investmentResult.breakdown.fixedIncome.amount | number:'1.0-0' }} LE invested</p>
              </div>
            </div>
            <div class="card-performance">
              <div class="performance-metric">
                <span class="label">Return</span>
                <span class="value">+{{ investmentResult.breakdown.fixedIncome.return | number:'1.0-0' }} LE</span>
              </div>
              <div class="performance-metric">
                <span class="label">Return %</span>
                <span class="value">+{{ investmentResult.breakdown.fixedIncome.returnPercentage | number:'1.1-1' }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Yearly Progress -->
      <div class="yearly-progress" *ngIf="investmentResult">
        <h2>Yearly Investment Growth</h2>
        <div class="progress-chart">
          <div class="chart-container">
            <div class="yearly-bars">
              <div 
                class="year-bar" 
                *ngFor="let yearData of investmentResult.yearlyData"
                [style.height.%]="(yearData.totalValue / investmentResult.finalAmount) * 100"
              >
                <div class="bar-tooltip">
                  <div class="tooltip-year">Year {{ yearData.year }}</div>
                  <div class="tooltip-value">{{ yearData.totalValue | number:'1.0-0' }} LE</div>
                  <div class="tooltip-return">+{{ yearData.totalReturnPercentage | number:'1.1-1' }}%</div>
                </div>
              </div>
            </div>
            <div class="chart-labels">
              <span *ngFor="let yearData of investmentResult.yearlyData">Year {{ yearData.year }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div class="insights-section">
        <h2>Key Insights</h2>
        <div class="insights-grid">
          <div class="insight-card">
            <div class="insight-icon">📊</div>
            <h3>Diversification Benefits</h3>
            <p>Your diversified portfolio across three asset classes helped balance risk and maximize returns.</p>
          </div>
          <div class="insight-card">
            <div class="insight-icon">📈</div>
            <h3>Compound Growth</h3>
            <p>Over {{ investmentResult?.yearlyData?.length || 5 }} years, compound returns significantly boosted your investment value.</p>
          </div>
          <div class="insight-card">
            <div class="insight-icon">🎯</div>
            <h3>Historical Performance</h3>
            <p>These results are based on actual historical performance of gold, equity funds, and fixed income over the past 5 years.</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-secondary" (click)="startNewAnalysis()">
          🔄 Start New Analysis
        </button>
        <button class="btn-primary" (click)="goToKYC()">
          👤 Complete KYC Profile
        </button>
        <button class="btn-download" (click)="downloadReport()">
          📄 Download Report
        </button>
      </div>
    </div>
  `,
  styles: [`
    .investment-results-container {
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

    .results-summary {
      max-width: 1000px;
      margin: 0 auto 4rem;
    }

    .summary-card {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .summary-header h2 {
      font-size: 2rem;
      color: #1a1a1a;
      margin: 0;
    }

    .period-badge {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 25px;
      font-weight: 600;
    }

    .summary-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .metric {
      text-align: center;
    }

    .metric-label {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      color: #1a1a1a;
    }

    .metric-value.final {
      color: #10b981;
    }

    .metric-value.return {
      color: #059669;
    }

    .metric-value.percentage {
      color: #6366f1;
    }

    .asset-breakdown {
      max-width: 1000px;
      margin: 0 auto 4rem;
    }

    .asset-breakdown h2 {
      font-size: 2rem;
      color: #1a1a1a;
      margin-bottom: 2rem;
      text-align: center;
    }

    .breakdown-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .breakdown-card {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
    }

    .breakdown-card.gold {
      border-left-color: #f59e0b;
    }

    .breakdown-card.equity {
      border-left-color: #10b981;
    }

    .breakdown-card.fixed-income {
      border-left-color: #6366f1;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .asset-icon {
      font-size: 2rem;
    }

    .asset-info h3 {
      margin: 0;
      color: #1a1a1a;
    }

    .asset-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .card-performance {
      display: flex;
      justify-content: space-between;
    }

    .performance-metric {
      text-align: center;
    }

    .performance-metric .label {
      display: block;
      font-size: 0.8rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .performance-metric .value {
      display: block;
      font-weight: bold;
      color: #1a1a1a;
    }

    .yearly-progress {
      max-width: 1000px;
      margin: 0 auto 4rem;
    }

    .yearly-progress h2 {
      font-size: 2rem;
      color: #1a1a1a;
      margin-bottom: 2rem;
      text-align: center;
    }

    .progress-chart {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .chart-container {
      position: relative;
      height: 300px;
    }

    .yearly-bars {
      display: flex;
      align-items: end;
      justify-content: space-around;
      height: 250px;
      gap: 1rem;
    }

    .year-bar {
      flex: 1;
      background: linear-gradient(to top, #6366f1, #8b5cf6);
      border-radius: 8px 8px 0 0;
      position: relative;
      min-width: 60px;
      transition: all 0.3s ease;
    }

    .year-bar:hover {
      transform: scale(1.05);
    }

    .bar-tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a1a;
      color: white;
      padding: 0.5rem;
      border-radius: 8px;
      font-size: 0.8rem;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .year-bar:hover .bar-tooltip {
      opacity: 1;
    }

    .chart-labels {
      display: flex;
      justify-content: space-around;
      margin-top: 1rem;
    }

    .chart-labels span {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .insights-section {
      max-width: 1000px;
      margin: 0 auto 4rem;
    }

    .insights-section h2 {
      font-size: 2rem;
      color: #1a1a1a;
      margin-bottom: 2rem;
      text-align: center;
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .insight-card {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .insight-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .insight-card h3 {
      color: #1a1a1a;
      margin-bottom: 1rem;
    }

    .insight-card p {
      color: #6b7280;
      line-height: 1.6;
    }

    .action-buttons {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary, .btn-download {
      padding: 1rem 2rem;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #6366f1;
      border: 2px solid #6366f1;
    }

    .btn-secondary:hover {
      background: #6366f1;
      color: white;
    }

    .btn-download {
      background: #10b981;
      color: white;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    }

    .btn-download:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    @media (max-width: 768px) {
      .main-title {
        font-size: 2.5rem;
      }

      .summary-metrics {
        grid-template-columns: repeat(2, 1fr);
      }

      .breakdown-cards {
        grid-template-columns: 1fr;
      }

      .insights-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }

      .action-buttons button {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class InvestmentResultsComponent implements OnInit {
  investmentResult: InvestmentResult | null = null;

  constructor(
    private router: Router,
    private investmentService: InvestmentAnalysisService
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.investmentResult = this.investmentService.getInvestmentResult();
    if (!this.investmentResult) {
      // If no results, redirect to analysis
      this.router.navigate(['/investment-analysis']);
    }
  }

  startNewAnalysis(): void {
    this.router.navigate(['/investment-analysis']);
  }

  goToKYC(): void {
    this.router.navigate(['/kyc']);
  }

  downloadReport(): void {
    if (!this.investmentResult) return;

    const report = this.generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investment-analysis-report.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateReport(): string {
    if (!this.investmentResult) return '';

    return `
INVESTMENT ANALYSIS REPORT
==========================

INVESTMENT SUMMARY
------------------
Initial Investment: ${this.investmentResult.initialAmount.toLocaleString()} LE
Final Value: ${this.investmentResult.finalAmount.toLocaleString()} LE
Total Return: +${this.investmentResult.totalReturn.toLocaleString()} LE
Return Percentage: +${this.investmentResult.totalReturnPercentage.toFixed(1)}%

ASSET BREAKDOWN
---------------
Gold:
  - Amount Invested: ${this.investmentResult.breakdown.gold.amount.toLocaleString()} LE
  - Return: +${this.investmentResult.breakdown.gold.return.toLocaleString()} LE
  - Return %: +${this.investmentResult.breakdown.gold.returnPercentage.toFixed(1)}%

Equity Fund:
  - Amount Invested: ${this.investmentResult.breakdown.equity.amount.toLocaleString()} LE
  - Return: +${this.investmentResult.breakdown.equity.return.toLocaleString()} LE
  - Return %: +${this.investmentResult.breakdown.equity.returnPercentage.toFixed(1)}%

Fixed Income:
  - Amount Invested: ${this.investmentResult.breakdown.fixedIncome.amount.toLocaleString()} LE
  - Return: +${this.investmentResult.breakdown.fixedIncome.return.toLocaleString()} LE
  - Return %: +${this.investmentResult.breakdown.fixedIncome.returnPercentage.toFixed(1)}%

YEARLY PROGRESS
---------------
${this.investmentResult.yearlyData.map(year => 
  `Year ${year.year}: ${year.totalValue.toLocaleString()} LE (+${year.totalReturnPercentage.toFixed(1)}%)`
).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `;
  }
} 