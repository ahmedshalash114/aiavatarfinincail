import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { KYCComponent } from './components/kyc/kyc.component';
import { ResultsComponent } from './components/results/results.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, KYCComponent, ResultsComponent],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
      background: #f3f4f6;
      padding: 1rem;
    }
  `]
})
export class AppComponent {
  title = 'Financial Twin';
}
