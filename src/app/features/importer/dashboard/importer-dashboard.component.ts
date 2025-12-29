import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { RequestService } from '../../../core/services/request.service';
import { QuotationService } from '../../../core/services/quotation.service';
import { AuthService } from '../../../core/services/auth.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-importer-dashboard',
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="importer-dashboard-new">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="welcome-badge">مرحباً بك 👋</div>
          <h1 class="hero-title">{{ user()?.name }}</h1>
          <p class="hero-subtitle">لوحة التحكم الخاصة بالمستوردين</p>
          
          <div class="hero-actions">
            <button class="btn-hero-primary" routerLink="/importer/requests/new">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              طلب استيراد جديد
            </button>
            <button class="btn-hero-secondary" routerLink="/importer/requests">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              عرض جميع الطلبات
            </button>
          </div>
        </div>
        <div class="hero-graphic">
          <div class="floating-card card-1">📦</div>
          <div class="floating-card card-2">🚚</div>
          <div class="floating-card card-3">✅</div>
        </div>
      </div>

      @if (!loading()) {
        <!-- Modern Stats Grid -->
        <div class="modern-stats">
          <div class="stat-card stat-primary">
            <div class="stat-header">
              <span class="stat-icon">📋</span>
              <div class="stat-badge">إجمالي</div>
            </div>
            <div class="stat-number">{{ kpis().totalRequests }}</div>
            <div class="stat-label">طلبات الاستيراد</div>
            <div class="stat-progress">
              <div class="progress-bar" [style.width.%]="100"></div>
            </div>
          </div>

          <div class="stat-card stat-warning">
            <div class="stat-header">
              <span class="stat-icon">⏳</span>
              <div class="stat-badge">قيد المعالجة</div>
            </div>
            <div class="stat-number">{{ kpis().inReview }}</div>
            <div class="stat-label">بانتظار المراجعة</div>
            <div class="stat-progress">
              <div class="progress-bar" [style.width.%]="(kpis().inReview / kpis().totalRequests * 100)"></div>
            </div>
          </div>

          <div class="stat-card stat-success">
            <div class="stat-header">
              <span class="stat-icon">✅</span>
              <div class="stat-badge">معتمدة</div>
            </div>
            <div class="stat-number">{{ kpis().approved }}</div>
            <div class="stat-label">طلبات معتمدة</div>
            <div class="stat-progress">
              <div class="progress-bar" [style.width.%]="(kpis().approved / kpis().totalRequests * 100)"></div>
            </div>
          </div>

          <div class="stat-card stat-info">
            <div class="stat-header">
              <span class="stat-icon">🚚</span>
              <div class="stat-badge">جارية</div>
            </div>
            <div class="stat-number">{{ kpis().activeShipments }}</div>
            <div class="stat-label">شحنات نشطة</div>
            <div class="stat-progress">
              <div class="progress-bar" [style.width.%]="75"></div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
          <h2 class="section-title">إجراءات سريعة</h2>
          <div class="actions-grid">
            <button class="action-tile" routerLink="/importer/requests/new">
              <div class="tile-icon primary">📦</div>
              <h3>طلب جديد</h3>
              <p>إنشاء طلب استيراد</p>
            </button>

            <button class="action-tile" routerLink="/importer/requests">
              <div class="tile-icon info">📋</div>
              <h3>طلباتي</h3>
              <p>عرض جميع الطلبات</p>
            </button>

            <button class="action-tile" routerLink="/importer/tracking/1">
              <div class="tile-icon warning">🚚</div>
              <h3>تتبع الشحنات</h3>
              <p>متابعة الشحنات</p>
            </button>

            <button class="action-tile" routerLink="/documents">
              <div class="tile-icon success">📄</div>
              <h3>المستندات</h3>
              <p>إدارة المستندات</p>
            </button>
          </div>
        </div>

        <div class="content-grid">
          <!-- Recent Requests -->
          <div class="modern-card">
            <div class="card-header-modern">
              <h3>آخر الطلبات</h3>
              <button class="btn-link-modern" routerLink="/importer/requests">عرض الكل →</button>
            </div>
            <div class="requests-list">
                @for (request of recentRequests(); track request.id) {
                  <div class="request-item-modern" [routerLink]="['/importer/requests', request.id]">
                    <div class="request-icon-modern">
                      {{ request.productInfo.productType === 'fresh' ? '🥬' : '❄️' }}
                    </div>
                    <div class="request-details-modern">
                      <div class="request-header-modern">
                        <strong>{{ request.requestNumber }}</strong>
                        <app-status-badge [status]="request.status" />
                      </div>
                      <p class="request-product">{{ request.productInfo.productName }}</p>
                      <span class="request-meta">{{ request.quantityInfo.quantity }} {{ request.quantityInfo.unit }}</span>
                    </div>
                    <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                }
              </div>
            </div>

          <!-- Notifications -->
          <div class="modern-card">
            <div class="card-header-modern">
              <h3>الإشعارات</h3>
              <span class="notification-count">{{ notifications().length }}</span>
            </div>
            <div class="notifications-modern">
                @for (notification of notifications(); track notification.id) {
                  <div class="notification-modern" [class.unread]="!notification.read">
                    <div class="notif-icon">
                      @if (notification.read) {
                        <span>✉️</span>
                      } @else {
                        <span>📬</span>
                      }
                    </div>
                    <div class="notif-content">
                      <h4>{{ notification.title }}</h4>
                      <p>{{ notification.message }}</p>
                      <span class="notif-time">{{ formatTime(notification.timestamp) }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
    </div>
  `,
  styles: [`
    .importer-dashboard-new {
      background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
      min-height: 100vh;
      padding: 2rem;
    }

    .hero-section {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      border-radius: 2rem;
      padding: 3rem;
      margin-bottom: 2rem;
      color: white;
      display: grid;
      grid-template-columns: 1fr 200px;
      gap: 2rem;
      align-items: center;
      box-shadow: 0 20px 60px rgba(5, 150, 105, 0.3);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -10%;
        width: 400px;
        height: 400px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        z-index: 0;
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        padding: 2rem;
      }
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .welcome-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    .hero-subtitle {
      font-size: 1.125rem;
      opacity: 0.9;
      margin: 0 0 2rem 0;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-hero-primary,
    .btn-hero-secondary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
    }

    .btn-hero-primary {
      background: white;
      color: #059669;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      }
    }

    .btn-hero-secondary {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }
    }

    .hero-graphic {
      position: relative;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: 768px) {
        display: none;
      }
    }

    .floating-card {
      position: absolute;
      font-size: 3rem;
      animation: float 3s ease-in-out infinite;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));

      &.card-1 {
        top: 0;
        left: 0;
        animation-delay: 0s;
      }

      &.card-2 {
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        animation-delay: 1s;
      }

      &.card-3 {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        animation-delay: 2s;
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .modern-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;
      border: 2px solid transparent;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
      }

      &.stat-primary { border-color: #3b82f6; }
      &.stat-warning { border-color: #f59e0b; }
      &.stat-success { border-color: #10b981; }
      &.stat-info { border-color: #8b5cf6; }
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: #f1f5f9;
      color: #475569;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9375rem;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .stat-progress {
      height: 8px;
      background: #f1f5f9;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #059669 0%, #10b981 100%);
      border-radius: 9999px;
      transition: width 1s ease;
    }

    .quick-actions-section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-tile {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 1.25rem;
      padding: 2rem 1.5rem;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
      text-decoration: none;

      &:hover {
        border-color: #059669;
        transform: translateY(-5px);
        box-shadow: 0 12px 30px rgba(5, 150, 105, 0.2);
      }

      h3 {
        font-size: 1.125rem;
        font-weight: 700;
        color: #1e293b;
        margin: 1rem 0 0.5rem 0;
      }

      p {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
      }
    }

    .tile-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      border-radius: 1rem;

      &.primary { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); }
      &.info { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }
      &.warning { background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); }
      &.success { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .modern-card {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .card-header-modern {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
      }
    }

    .btn-link-modern {
      background: none;
      border: none;
      color: #059669;
      font-weight: 600;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
      text-decoration: none;
      font-size: 0.875rem;

      &:hover {
        background: #f0fdf4;
      }
    }

    .notification-count {
      background: #ef4444;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .requests-list,
    .notifications-modern {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .request-item-modern {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;

      &:hover {
        background: #f1f5f9;
        border-color: #059669;
        transform: translateX(-5px);
      }
    }

    .request-icon-modern {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      background: white;
      border-radius: 0.75rem;
      flex-shrink: 0;
    }

    .request-details-modern {
      flex: 1;
    }

    .request-header-modern {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;

      strong {
        font-size: 0.875rem;
        color: #1e293b;
      }
    }

    .request-product {
      font-size: 0.875rem;
      color: #475569;
      margin: 0 0 0.25rem 0;
    }

    .request-meta {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .chevron {
      color: #cbd5e1;
      flex-shrink: 0;
    }

    .notification-modern {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 1rem;
      border-inline-start: 4px solid transparent;

      &.unread {
        background: #eff6ff;
        border-inline-start-color: #3b82f6;
      }
    }

    .notif-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .notif-content {
      flex: 1;

      h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0 0 0.25rem 0;
      }

      p {
        font-size: 0.8125rem;
        color: #64748b;
        margin: 0 0 0.5rem 0;
      }

      .notif-time {
        font-size: 0.75rem;
        color: #94a3b8;
      }
    }

  `]
})
export class ImporterDashboardComponent implements OnInit {
  loading = signal(true);
  requests = signal<any[]>([]);
  quotations = signal<any[]>([]);
  shipments = signal<any[]>([]);

  constructor(
    private i18nService: I18nService,
    private requestService: RequestService,
    private quotationService: QuotationService,
    private authService: AuthService
  ) {}

  user = computed(() => this.authService.getCurrentUser());

  kpis = computed(() => {
    const requests = this.requests();
    const shipments = this.shipments();

    return {
      totalRequests: requests.length,
      inReview: requests.filter(r => ['pending', 'in_review', 'awaiting_quotes'].includes(r.status)).length,
      approved: requests.filter(r => r.status === 'approved').length,
      activeShipments: shipments.filter(s => ['preparing', 'ready_to_ship', 'in_transit', 'in_customs', 'out_for_delivery'].includes(s.status)).length,
      completedShipments: shipments.filter(s => s.status === 'delivered').length
    };
  });

  recentRequests = computed(() => {
    return this.requests().slice(0, 5);
  });

  notifications = computed(() => [
    {
      id: '1',
      title: 'عرض سعر جديد',
      message: 'تم استلام عرض سعر جديد للطلب REQ-00001',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      title: 'تحديث حالة الشحن',
      message: 'الشحنة SHP-00001 وصلت إلى الميناء',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      title: 'مستند جديد',
      message: 'تم رفع بوليصة الشحن للطلب REQ-00002',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true
    }
  ]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    Promise.all([
      this.requestService.getRequests().toPromise(),
      this.quotationService.getQuotations().toPromise()
    ]).then(([requests, quotations]) => {
      this.requests.set(requests || []);
      this.quotations.set(quotations || []);
      this.loading.set(false);
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.loading.set(false);
    });
  }

  t(key: string): string {
    return this.i18nService.translate(key);
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  }
}

