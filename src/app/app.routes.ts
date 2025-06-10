import { Routes } from '@angular/router';
import { KYCComponent } from './components/kyc/kyc.component';
import { ResultsComponent } from './components/results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: '/kyc', pathMatch: 'full' },
  { path: 'kyc', component: KYCComponent },
  { path: 'results', component: ResultsComponent }
];
