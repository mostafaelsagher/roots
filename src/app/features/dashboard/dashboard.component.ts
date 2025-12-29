import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { RequestService } from '../../core/services/request.service';
import { QuotationService } from '../../core/services/quotation.service';
import { ShippingService } from '../../core/services/shipping.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ImportRequest } from '../../core/models/request.model';
import { Quotation } from '../../core/models/quotation.model';
import { Shipment } from '../../core/models/shipping.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, CardComponent, StatusBadgeComponent, LoadingComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div>
          <h1>{{ t('dashboard.welcome') }}، {{ user()?.name }}</h1>
          <p class="subtitle">{{ t('dashboard.overview') }}</p>
        </div>
      </div>

      @if (loading()) {
        <app-loading [message]="t('common.loading')" />
      } @else {
        <div class="stats-grid">
          <app-card [hover]="true">
            <div class="stat-card">
              <div class="stat-icon requests">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div class="stat-content">
                <h3>{{ stats().activeRequests }}</h3>
                <p>{{ t('dashboard.activeRequests') }}</p>
              </div>
            </div>
          </app-card>

          <app-card [hover]="true">
            <div class="stat-card">
              <div class="stat-icon quotations">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <div class="stat-content">
                <h3>{{ stats().pendingQuotations }}</h3>
                <p>{{ t('dashboard.pendingQuotations') }}</p>
              </div>
            </div>
          </app-card>

          <app-card [hover]="true">
            <div class="stat-card">
              <div class="stat-icon shipments">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              <div class="stat-content">
                <h3>{{ stats().activeShipments }}</h3>
                <p>{{ t('dashboard.activeShipments') }}</p>
              </div>
            </div>
          </app-card>

          <app-card [hover]="true">
            <div class="stat-card">
              <div class="stat-icon completed">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="stat-content">
                <h3>{{ stats().completedOrders }}</h3>
                <p>{{ t('dashboard.completedOrders') }}</p>
              </div>
            </div>
          </app-card>
        </div>

        <div class="dashboard-content">
          <div class="content-main">
            <app-card [title]="t('dashboard.recentActivity')">
              <div class="activity-list">
                @if (recentRequests().length > 0) {
                  @for (request of recentRequests(); track request.id) {
                    <div class="activity-item" [routerLink]="['/requests', request.id]">
                      <div class="activity-icon">📦</div>
                      <div class="activity-details">
                        <h4>{{ request.requestNumber }}</h4>
                        <p>{{ request.productInfo.productName }} - {{ request.quantityInfo.quantity }} {{ request.quantityInfo.unit }}</p>
                        <span class="activity-time">{{ formatDate(request.createdAt) }}</span>
                      </div>
                      <app-status-badge [status]="request.status" />
                    </div>
                  }
                } @else {
                  <div class="empty-state">
                    <p>{{ t('common.noData') }}</p>
                  </div>
                }
              </div>
            </app-card>
          </div>

          <div class="content-sidebar">
            <app-card [title]="t('dashboard.quickActions')">
              <div class="quick-actions">
                @if (user()?.role === 'importer') {
                  <button class="action-btn primary" routerLink="/requests/new">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    {{ t('dashboard.createRequest') }}
                  </button>
                }
                
                <button class="action-btn secondary" routerLink="/requests">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  </svg>
                  {{ t('dashboard.viewAllRequests') }}
                </button>

                @if (user()?.role === 'importer' || user()?.role === 'exporter') {
                  <button class="action-btn secondary" routerLink="/quotations">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                    </svg>
                    {{ t('dashboard.viewAllQuotations') }}
                  </button>
                }

                <button class="action-btn secondary" routerLink="/shipments">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                  {{ t('dashboard.viewAllShipments') }}
                </button>
              </div>
            </app-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
      }

      .subtitle {
        color: #6b7280;
        margin: 0;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.requests {
        background: #dbeafe;
        color: #2563eb;
      }

      &.quotations {
        background: #fef3c7;
        color: #d97706;
      }

      &.shipments {
        background: #e0e7ff;
        color: #6366f1;
      }

      &.completed {
        background: #d1fae5;
        color: #059669;
      }
    }

    .stat-content {
      h3 {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 0.25rem 0;
      }

      p {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
      }
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        transform: translateX(-4px);
      }
    }

    .activity-icon {
      width: 3rem;
      height: 3rem;
      background: white;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .activity-details {
      flex: 1;

      h4 {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.25rem 0;
      }

      p {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0 0 0.25rem 0;
      }

      .activity-time {
        font-size: 0.75rem;
        color: #9ca3af;
      }
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      text-decoration: none;

      &.primary {
        background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }
      }

      &.secondary {
        background: #f3f4f6;
        color: #374151;

        &:hover {
          background: #e5e7eb;
        }
      }
    }

    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
      color: #9ca3af;
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  requests = signal<ImportRequest[]>([]);
  quotations = signal<Quotation[]>([]);
  shipments = signal<Shipment[]>([]);

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private requestService: RequestService,
    private quotationService: QuotationService,
    private shippingService: ShippingService,
    private router: Router
  ) {}

  user = computed(() => this.authService.getCurrentUser());

  stats = computed(() => {
    const requests = this.requests();
    const quotations = this.quotations();
    const shipments = this.shipments();

    return {
      activeRequests: requests.filter(r => 
        ['pending', 'in_review', 'awaiting_quotes', 'sent_to_exporter', 'quoted', 'in_execution'].includes(r.status)
      ).length,
      pendingQuotations: quotations.filter(q => 
        ['submitted', 'under_review'].includes(q.status)
      ).length,
      activeShipments: shipments.filter(s => 
        ['preparing', 'ready_to_ship', 'in_transit', 'in_customs', 'out_for_delivery'].includes(s.status)
      ).length,
      completedOrders: requests.filter(r => r.status === 'completed').length
    };
  });

  recentRequests = computed(() => {
    return this.requests().slice(0, 5);
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    Promise.all([
      this.requestService.getRequests().toPromise(),
      this.quotationService.getQuotations().toPromise(),
      // Note: getShipmentById needs an ID, so we'll skip this for now
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

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'اليوم';
    if (days === 1) return 'أمس';
    if (days < 7) return `منذ ${days} أيام`;
    return new Date(date).toLocaleDateString('ar-SA');
  }
}

