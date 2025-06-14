import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { KYCComponent } from './components/kyc/kyc.component';
import { ResultsComponent } from './components/results/results.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'kyc', component: KYCComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '' }
];
