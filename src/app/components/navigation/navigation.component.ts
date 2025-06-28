import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHome, 
  faUser, 
  faChartLine, 
  faChartPie, 
  faCog,
  faSignOutAlt,
  faTimes,
  faUserEdit,
  faDollarSign,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class NavigationComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  isMobileMenuOpen = false;
  
  // Icons
  icons = {
    home: faHome,
    user: faUser,
    chartLine: faChartLine,
    chartPie: faChartPie,
    cog: faCog,
    signOut: faSignOutAlt,
    times: faTimes,
    userEdit: faUserEdit,
    dollarSign: faDollarSign
  };

  navigationItems: NavigationItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/profile', label: 'Profile', icon: 'user' },
    { path: '/investment-analysis', label: 'Investment Analysis', icon: 'chartPie' },
    { path: '/exchange-rate-prediction', label: 'EGP/USD Predictor', icon: 'dollarSign' },
    { path: '/kyc', label: 'Update KYC', icon: 'cog' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      isAuth => this.isAuthenticated = isAuth
    );
    
    this.authService.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  getIcon(iconName: string): IconDefinition {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.home;
  }

  isActiveRoute(path: string): boolean {
    return this.router.url === path;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.closeMobileMenu();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  getCurrentUserName(): string {
    const kycData = this.storageService.getItem('kycData');
    return kycData?.fullName || 'User';
  }

  getCurrentUserRank(): string {
    const kycData = this.storageService.getItem('kycData');
    return kycData?.profileRank || 'beginner';
  }

  // Mobile menu methods
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  // Quick action methods
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
    this.closeMobileMenu();
  }

  goToKYC(): void {
    this.router.navigate(['/kyc']);
    this.closeMobileMenu();
  }

  goToInvestmentAnalysis(): void {
    this.router.navigate(['/investment-analysis']);
    this.closeMobileMenu();
  }

  goToExchangeRatePrediction(): void {
    this.router.navigate(['/exchange-rate-prediction']);
    this.closeMobileMenu();
  }

  goToResults(): void {
    this.router.navigate(['/results']);
    this.closeMobileMenu();
  }
} 