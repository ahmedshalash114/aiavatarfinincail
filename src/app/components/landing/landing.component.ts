import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faArrowRight, 
  faChartLine, 
  faBrain, 
  faShieldAlt, 
  faChartPie, 
  faQuoteLeft,
  faUser,
  faCog,
  faLightbulb,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  // Icons
  icons = {
    arrowRight: faArrowRight,
    chartLine: faChartLine,
    brain: faBrain,
    shieldAlt: faShieldAlt,
    chartPie: faChartPie,
    quote: faQuoteLeft,
    user: faUser,
    cog: faCog,
    lightbulb: faLightbulb
  };

  floatingCards = [
    {
      icon: 'brain',
      title: 'AI-Powered Insights',
      description: 'Get personalized financial recommendations based on your unique profile.',
      delay: '0s'
    },
    {
      icon: 'chartLine',
      title: 'Smart Analytics',
      description: 'Track your financial health with advanced analytics and visualizations.',
      delay: '2s'
    },
    {
      icon: 'shieldAlt',
      title: 'Secure & Private',
      description: 'Your financial data is protected with bank-level security.',
      delay: '4s'
    }
  ];

  features = [
    {
      icon: 'brain',
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your financial patterns and provide personalized insights.'
    },
    {
      icon: 'chartPie',
      title: 'Comprehensive Dashboard',
      description: 'Visualize your financial health with interactive charts and real-time data tracking.'
    },
    {
      icon: 'shieldAlt',
      title: 'Secure & Private',
      description: 'Bank-level security ensures your financial data remains confidential and protected.'
    },
    {
      icon: 'lightbulb',
      title: 'Smart Recommendations',
      description: 'Receive actionable advice tailored to your financial goals and risk tolerance.'
    },
    {
      icon: 'user',
      title: 'Personalized Experience',
      description: 'Customized financial strategies based on your unique profile and preferences.'
    },
    {
      icon: 'cog',
      title: 'Easy Integration',
      description: 'Seamlessly connect with your existing financial accounts and services.'
    }
  ];

  steps = [
    {
      title: 'Complete Your Profile',
      description: 'Answer a few questions about your financial situation and goals.'
    },
    {
      title: 'Get AI Analysis',
      description: 'Our AI analyzes your profile and generates personalized insights.'
    },
    {
      title: 'Start Investing',
      description: 'Receive tailored investment recommendations and start building wealth.'
    }
  ];

  testimonials = [
    {
      quote: "Financial Twin transformed how I think about investing. The AI insights are incredibly accurate!",
      name: "Sarah Johnson",
      title: "Software Engineer",
      avatar: "SJ"
    },
    {
      quote: "Finally, a financial tool that speaks my language. The recommendations are spot-on!",
      name: "Ahmed Hassan",
      title: "Business Owner",
      avatar: "AH"
    },
    {
      quote: "I've never felt more confident about my financial decisions. This is a game-changer!",
      name: "Maria Garcia",
      title: "Marketing Manager",
      avatar: "MG"
    }
  ];

  constructor(private router: Router) {}

  getIcon(iconName: string): IconDefinition {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.lightbulb;
  }

  startJourney() {
    this.router.navigate(['/kyc']);
  }

  startInvestmentAnalysis() {
    this.router.navigate(['/investment-analysis']);
  }
} 