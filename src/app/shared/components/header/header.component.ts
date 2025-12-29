import { Component, output, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-start">
        <button class="menu-toggle" (click)="toggleSidebar.emit()" type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <div class="logo">
          <h1>{{ t('app.title') }}</h1>
          <span class="slogan">{{ t('app.slogan') }}</span>
        </div>
      </div>

      <div class="header-end">
        <button class="notification-btn" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="badge">3</span>
        </button>

        <div class="user-menu">
          <div class="user-info">
            <div class="user-avatar">
              <span>{{ userInitials() }}</span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ user()?.name }}</span>
              <span class="user-role">{{ t('roles.' + user()?.role) }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {{ t('auth.logout') }}
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      z-index: 1000;
    }

    .header-start {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-toggle {
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #4b5563;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        color: #1f2937;
      }
    }

    .logo {
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #059669;
        margin: 0;
        line-height: 1.2;
      }

      .slogan {
        font-size: 0.75rem;
        color: #6b7280;
        display: block;
      }
    }

    .header-end {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .notification-btn {
      position: relative;
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #4b5563;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        color: #1f2937;
      }

      .badge {
        position: absolute;
        top: 0.25rem;
        right: 0.25rem;
        background: #ef4444;
        color: white;
        font-size: 0.625rem;
        padding: 0.125rem 0.375rem;
        border-radius: 9999px;
        font-weight: 600;
      }
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      text-align: start;

      @media (max-width: 640px) {
        display: none;
      }
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
    }

    .user-role {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: none;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      color: #4b5563;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;

      &:hover {
        background: #fef2f2;
        border-color: #fecaca;
        color: #dc2626;
      }

      @media (max-width: 640px) {
        span {
          display: none;
        }
      }
    }
  `]
})
export class HeaderComponent {
  toggleSidebar = output<void>();
  sidebarOpen = input<boolean>(true);

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private router: Router
  ) {}

  user = computed(() => this.authService.getCurrentUser());
  
  userInitials = computed(() => {
    const user = this.user();
    if (!user) return '';
    const names = user.name.split(' ');
    return names.length > 1 
      ? names[0][0] + names[1][0] 
      : names[0][0];
  });

  t(key: string): string {
    return this.i18nService.translate(key);
  }

  logout() {
    this.authService.logout();
  }
}

