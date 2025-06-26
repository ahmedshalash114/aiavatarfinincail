import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KYCComponent } from './components/kyc/kyc.component';
import { ResultsComponent } from './components/results/results.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ReactiveFormsModule, 
    CommonModule,
    KYCComponent, 
    ResultsComponent, 
    LandingComponent,
    NavigationComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Financial Twin';
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // Check if user has completed KYC
    const kycData = this.storageService.getItem('kycData');
    if (kycData) {
      this.isAuthenticated = true;
    }

    // Subscribe to authentication changes
    this.authService.isAuthenticated$.subscribe(
      isAuth => this.isAuthenticated = isAuth
    );
  }
}
