import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="main-title">
            <span class="gradient-text">Your Personal</span>
            <br>
            Financial Twin
          </h1>
          <p class="hero-subtitle">
            Experience the future of personal finance management with AI-powered insights and personalized investment strategies.
          </p>
          <button class="cta-button" (click)="startJourney()">
            Start Your Financial Journey
            <span class="arrow">→</span>
          </button>
        </div>
        <div class="hero-image">
          <div class="floating-cards">
            <div class="card" *ngFor="let card of floatingCards" [style.animation-delay]="card.delay">
              <div class="card-icon">{{ card.icon }}</div>
              <div class="card-content">
                <h3>{{ card.title }}</h3>
                <p>{{ card.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2 class="section-title">Why Choose Financial Twin?</h2>
        <div class="features-grid">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="how-it-works">
        <h2 class="section-title">How It Works</h2>
        <div class="steps-container">
          <div class="step" *ngFor="let step of steps; let i = index">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials">
        <h2 class="section-title">What Our Users Say</h2>
        <div class="testimonials-slider">
          <div class="testimonial-card" *ngFor="let testimonial of testimonials">
            <div class="testimonial-content">
              <p class="quote">{{ testimonial.quote }}</p>
              <div class="author">
                <div class="author-avatar">{{ testimonial.avatar }}</div>
                <div class="author-info">
                  <h4>{{ testimonial.name }}</h4>
                  <p>{{ testimonial.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to Transform Your Financial Future?</h2>
          <p>Join thousands of users who are already making smarter financial decisions with their AI-powered Financial Twin.</p>
          <button class="cta-button" (click)="startJourney()">
            Get Started Now
            <span class="arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-container {
      max-width: 100%;
      overflow-x: hidden;
    }

    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 2rem;
      background: linear-gradient(135deg, #f6f8ff 0%, #ffffff 100%);
      position: relative;
      overflow: hidden;
    }

    .hero-content {
      flex: 1;
      max-width: 600px;
      z-index: 1;
    }

    .main-title {
      font-size: 4rem;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      color: #1a1a1a;
    }

    .gradient-text {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #4b5563;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .cta-button {
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

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);

        .arrow {
          transform: translateX(4px);
        }
      }

      .arrow {
        transition: transform 0.3s ease;
      }
    }

    .hero-image {
      flex: 1;
      position: relative;
      min-height: 500px;
    }

    .floating-cards {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .card {
      position: absolute;
      background: white;
      padding: 1.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: float 6s ease-in-out infinite;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);

      &:nth-child(1) {
        top: 10%;
        left: 10%;
      }

      &:nth-child(2) {
        top: 40%;
        right: 10%;
      }

      &:nth-child(3) {
        bottom: 20%;
        left: 20%;
      }
    }

    .card-icon {
      font-size: 2rem;
    }

    .card-content {
      h3 {
        margin: 0;
        color: #1a1a1a;
        font-size: 1.1rem;
      }

      p {
        margin: 0.5rem 0 0;
        color: #4b5563;
        font-size: 0.9rem;
      }
    }

    .features-section {
      padding: 6rem 2rem;
      background: white;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #1a1a1a;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
      }
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .how-it-works {
      padding: 6rem 2rem;
      background: #f6f8ff;
    }

    .steps-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 2rem;
      margin-bottom: 3rem;
      position: relative;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 1.5rem;
        top: 4rem;
        bottom: -3rem;
        width: 2px;
        background: #e5e7eb;
      }
    }

    .step-number {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .testimonials {
      padding: 6rem 2rem;
      background: white;
    }

    .testimonials-slider {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .testimonial-card {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    }

    .quote {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 1.5rem;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .author-avatar {
      width: 3rem;
      height: 3rem;
      background: #e5e7eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .cta-section {
      padding: 6rem 2rem;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      text-align: center;
    }

    .cta-content {
      max-width: 600px;
      margin: 0 auto;

      h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      .cta-button {
        background: white;
        color: #6366f1;
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
        text-align: center;
        padding-top: 4rem;
      }

      .main-title {
        font-size: 3rem;
      }

      .hero-image {
        margin-top: 3rem;
      }

      .card {
        position: relative;
        margin: 1rem auto;
        max-width: 300px;
      }
    }
  `]
})
export class LandingComponent {
  floatingCards = [
    {
      icon: '📈',
      title: 'Smart Investment',
      description: 'AI-powered investment recommendations based on your profile',
      delay: '0s'
    },
    {
      icon: '💰',
      title: 'Wealth Growth',
      description: 'Track and optimize your financial growth in real-time',
      delay: '1s'
    },
    {
      icon: '🎯',
      title: 'Goal Planning',
      description: 'Set and achieve your financial goals with confidence',
      delay: '2s'
    }
  ];

  features = [
    {
      icon: '🤖',
      title: 'AI-Powered Insights',
      description: 'Get personalized financial advice powered by advanced artificial intelligence.'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Track your financial health with detailed analytics and visualizations.'
    },
    {
      icon: '🎯',
      title: 'Goal Tracking',
      description: 'Set and monitor your financial goals with smart progress tracking.'
    },
    {
      icon: '💡',
      title: 'Investment Guidance',
      description: 'Receive expert investment recommendations based on your risk profile.'
    },
    {
      icon: '📱',
      title: 'Easy Access',
      description: 'Access your financial twin anytime, anywhere through our mobile-friendly platform.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your financial data is protected with bank-level security measures.'
    }
  ];

  steps = [
    {
      title: 'Create Your Profile',
      description: 'Tell us about your financial situation, goals, and preferences.'
    },
    {
      title: 'Get AI Analysis',
      description: 'Our AI analyzes your profile and creates personalized recommendations.'
    },
    {
      title: 'Track & Optimize',
      description: 'Monitor your progress and get real-time optimization suggestions.'
    }
  ];

  testimonials = [
    {
      quote: "Financial Twin has completely transformed how I manage my investments. The AI insights are incredibly accurate!",
      name: "Sarah Ahmed",
      title: "Software Engineer",
      avatar: "👩‍💻"
    },
    {
      quote: "I've never felt more confident about my financial decisions. The personalized guidance is exactly what I needed.",
      name: "Mohammed Ali",
      title: "Business Owner",
      avatar: "👨‍💼"
    },
    {
      quote: "The goal tracking feature helped me save for my dream house. Couldn't have done it without Financial Twin!",
      name: "Layla Hassan",
      title: "Marketing Manager",
      avatar: "👩‍💼"
    }
  ];

  constructor(private router: Router) {}

  startJourney() {
    this.router.navigate(['/kyc']);
  }
} 