import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { UserRole } from '../../../core/models/user.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, LoadingComponent],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <h1>جوزور</h1>
            <div class="logo-icon">🌍</div>
          </div>
          <h2>{{ t('auth.login') }}</h2>
          <p>{{ t('app.slogan') }}</p>
        </div>

        @if (loading()) {
          <app-loading [message]="t('common.loading')" />
        } @else {
          <form class="login-form" (ngSubmit)="onSubmit()">
            @if (error()) {
              <div class="error-message">
                {{ error() }}
              </div>
            }

            <div class="form-group">
              <label>{{ t('auth.selectRole') }}</label>
              <select 
                [(ngModel)]="role" 
                name="role"
                class="form-control"
                required>
                <option value="importer">{{ t('roles.importer') }}</option>
                <option value="exporter">{{ t('roles.exporter') }}</option>
                <option value="logistics">{{ t('roles.logistics') }}</option>
                <option value="quality">{{ t('roles.quality') }}</option>
                <option value="admin">{{ t('roles.admin') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ t('auth.email') }}</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email"
                class="form-control"
                placeholder="example@company.com"
                required>
            </div>

            <div class="form-group">
              <label>{{ t('auth.password') }}</label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password"
                class="form-control"
                placeholder="••••••••"
                required>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
                <span>{{ t('auth.rememberMe') }}</span>
              </label>
              <a href="#" class="forgot-link">{{ t('auth.forgotPassword') }}</a>
            </div>

            <button type="submit" class="btn-primary" [disabled]="!isValid()">
              {{ t('auth.login') }}
            </button>
          </form>
        }

        <div class="login-footer">
          <p>{{ t('footer.copyright') }}</p>
        </div>
      </div>

      <div class="login-illustration">
        <div class="illustration-content">
          <h3>منصة التمكين التجاري B2B</h3>
          <p>ربط المستوردين والمصدرين ومزودي الخدمات اللوجستية في منصة واحدة متكاملة</p>
          <div class="features">
            <div class="feature">
              <div class="feature-icon">✓</div>
              <span>إدارة متكاملة للطلبات</span>
            </div>
            <div class="feature">
              <div class="feature-icon">✓</div>
              <span>تتبع الشحنات لحظياً</span>
            </div>
            <div class="feature">
              <div class="feature-icon">✓</div>
              <span>إدارة المستندات الإلكترونية</span>
            </div>
            <div class="feature">
              <div class="feature-icon">✓</div>
              <span>خدمات لوجستية متقدمة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .login-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 3rem;
      background: white;

      @media (max-width: 640px) {
        padding: 2rem 1.5rem;
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;

        h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #059669;
          margin: 0;
        }

        .logo-icon {
          font-size: 2rem;
        }
      }

      h2 {
        font-size: 1.875rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
      }

      p {
        color: #6b7280;
        margin: 0;
      }
    }

    .login-form {
      max-width: 400px;
      margin: 0 auto;
      width: 100%;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 0.9375rem;
        transition: all 0.2s;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
      }

      select.form-control {
        cursor: pointer;
      }
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;

      @media (max-width: 480px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: #374151;

      input[type="checkbox"] {
        cursor: pointer;
        width: 1rem;
        height: 1rem;
      }
    }

    .forgot-link {
      color: #059669;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .btn-primary {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .login-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;

      p {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
      }
    }

    .login-illustration {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      padding: 3rem;

      @media (max-width: 1024px) {
        display: none;
      }
    }

    .illustration-content {
      max-width: 500px;

      h3 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        line-height: 1.2;
      }

      > p {
        font-size: 1.125rem;
        opacity: 0.9;
        margin: 0 0 3rem 0;
        line-height: 1.6;
      }
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.125rem;

      .feature-icon {
        width: 2rem;
        height: 2rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        flex-shrink: 0;
      }
    }
  `]
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  role = signal<UserRole>('importer');
  rememberMe = signal(false);
  loading = signal(false);
  error = signal('');

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private router: Router
  ) {}

  t(key: string): string {
    return this.i18nService.translate(key);
  }

  isValid(): boolean {
    return this.email().length > 0 && this.password().length > 0;
  }

  onSubmit() {
    if (!this.isValid()) return;

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.email(), this.password(), this.role()).subscribe({
      next: (response) => {
        this.authService.setCurrentUser(response.user, response.token);
        this.loading.set(false);
        
        // Route based on role
        if (response.user.role === 'importer') {
          this.router.navigate(['/importer/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    });
  }
}

