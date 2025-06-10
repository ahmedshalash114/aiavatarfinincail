import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher" [class.rtl]="currentLang === 'ar'">
      <button 
        [class.active]="currentLang === 'en'"
        (click)="switchLanguage('en')"
        class="lang-btn">
        <span class="lang-icon">🇺🇸</span>
        <span class="lang-text">English</span>
      </button>
      <button 
        [class.active]="currentLang === 'ar'"
        (click)="switchLanguage('ar')"
        class="lang-btn">
        <span class="lang-icon">🇸🇦</span>
        <span class="lang-text">العربية</span>
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 8px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.9);
      padding: 4px;
      border-radius: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.1);

      &.rtl {
        right: auto;
        left: 20px;
      }
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border: none;
      border-radius: 20px;
      background: transparent;
      color: #4b5563;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;
      }

      &.active {
        background: #6366f1;
        color: white;
      }

      .lang-icon {
        font-size: 1.1rem;
      }

      .lang-text {
        font-family: var(--font-family);
      }
    }
  `]
})
export class LanguageSwitcherComponent {
  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang || 'en';
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
} 