import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { RequestService } from '../../../core/services/request.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ImportRequest } from '../../../core/models/request.model';

@Component({
  selector: 'app-my-requests',
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="my-requests-modern">
      <!-- Hero Header -->
      <div class="page-header-gradient">
        <div class="header-content">
          <div>
            <div class="breadcrumb">لوحة التحكم / طلباتي</div>
            <h1>📋 طلبات الاستيراد</h1>
            <p>إدارة ومتابعة جميع طلبات الاستيراد الخاصة بك</p>
          </div>
          <button class="btn-create-request" routerLink="/importer/requests/new">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            طلب استيراد جديد
          </button>
        </div>
      </div>

      <!-- Modern Filters -->
      <div class="filters-modern">
        <div class="search-modern">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="filterRequests()"
            placeholder="ابحث برقم الطلب أو نوع المنتج..."
          />
        </div>

        <div class="status-pills">
          <button 
            class="pill" 
            [class.active]="selectedStatus === ''"
            (click)="selectedStatus = ''; filterRequests()">
            الكل ({{ requests().length }})
          </button>
          <button 
            class="pill pill-warning" 
            [class.active]="selectedStatus === 'in_review'"
            (click)="selectedStatus = 'in_review'; filterRequests()">
            قيد المراجعة
          </button>
          <button 
            class="pill pill-success" 
            [class.active]="selectedStatus === 'approved'"
            (click)="selectedStatus = 'approved'; filterRequests()">
            معتمدة
          </button>
          <button 
            class="pill pill-info" 
            [class.active]="selectedStatus === 'in_execution'"
            (click)="selectedStatus = 'in_execution'; filterRequests()">
            جارية
          </button>
          <button 
            class="pill pill-complete" 
            [class.active]="selectedStatus === 'completed'"
            (click)="selectedStatus = 'completed'; filterRequests()">
            مكتملة
          </button>
        </div>
      </div>

      <!-- Modern Cards Grid -->
      <div class="requests-grid">
        @if (!loading() && filteredRequests().length > 0) {
          @for (request of filteredRequests(); track request.id) {
            <div class="request-card-modern">
              <div class="card-header-row">
                <div class="request-number-badge">
                  {{ request.requestNumber }}
                </div>
                <app-status-badge [status]="request.status" />
              </div>

              <div class="product-info-modern">
                <div class="product-icon-large">
                  {{ request.productInfo.productType === 'fresh' ? '🥬' : '❄️' }}
                </div>
                <div>
                  <h3>{{ request.productInfo.productName }}</h3>
                  <p class="product-meta">
                    {{ request.productInfo.productType === 'fresh' ? 'منتج طازج' : 'منتج مجمد' }}
                  </p>
                </div>
              </div>

              <div class="card-details-grid">
                <div class="detail-item">
                  <span class="detail-icon">📦</span>
                  <div>
                    <div class="detail-label">الكمية</div>
                    <div class="detail-value">{{ request.quantityInfo.quantity }} {{ request.quantityInfo.unit }}</div>
                  </div>
                </div>

                <div class="detail-item">
                  <span class="detail-icon">📅</span>
                  <div>
                    <div class="detail-label">تاريخ الإنشاء</div>
                    <div class="detail-value">{{ formatDate(request.createdAt) }}</div>
                  </div>
                </div>

                <div class="detail-item">
                  <span class="detail-icon">🌍</span>
                  <div>
                    <div class="detail-label">الوجهة</div>
                    <div class="detail-value">{{ request.shippingInfo.destinationCountry }}</div>
                  </div>
                </div>

                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <div>
                    <div class="detail-label">الميناء</div>
                    <div class="detail-value">{{ request.shippingInfo.destinationPort }}</div>
                  </div>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn-card-action primary" [routerLink]="['/importer/requests', request.id]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  عرض التفاصيل
                </button>

                @if (request.status === 'awaiting_quotes' || request.status === 'approved') {
                  <button class="btn-card-action success" [routerLink]="['/importer/quotations', request.id]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    عروض الأسعار
                  </button>
                }

                @if (request.status === 'in_execution') {
                  <button class="btn-card-action info" [routerLink]="['/importer/tracking', request.id]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    تتبع الشحنة
                  </button>
                }
              </div>
            </div>
          }
        } @else if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>جاري التحميل...</p>
          </div>
        } @else {
          <div class="empty-state-modern">
            <div class="empty-icon">📦</div>
            <h3>لا توجد طلبات</h3>
            <p>لم يتم العثور على طلبات مطابقة للبحث أو الفلتر المحدد</p>
            <button class="btn-empty-action" routerLink="/importer/requests/new">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              إنشاء طلب جديد
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .my-requests-modern {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .page-header-gradient {
      background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
      padding: 2.5rem 2rem;
      margin-bottom: 2rem;
      color: white;
      box-shadow: 0 8px 32px rgba(14, 165, 233, 0.3);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -10%;
        width: 500px;
        height: 500px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
      }
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      position: relative;
      z-index: 1;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    .breadcrumb {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-bottom: 0.75rem;
      font-weight: 500;
    }

    .page-header-gradient h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0 0 0.75rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      letter-spacing: -0.025em;
    }

    .page-header-gradient p {
      margin: 0;
      opacity: 0.95;
      font-size: 1.0625rem;
      font-weight: 500;
    }

    .btn-create-request {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 1.125rem 2rem;
      background: white;
      color: #0ea5e9;
      border: none;
      border-radius: 0.875rem;
      font-size: 1.0625rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      white-space: nowrap;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
      }

      &:active {
        transform: translateY(-1px);
      }
    }

    .filters-modern {
      max-width: 1400px;
      margin: 0 auto 2.5rem;
      padding: 0 2rem;
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .search-modern {
      position: relative;
      flex: 1;
      min-width: 320px;

      input {
        width: 100%;
        padding: 1.125rem 1.25rem 1.125rem 3.5rem;
        border: 2px solid #e2e8f0;
        border-radius: 1rem;
        font-size: 1rem;
        background: white;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

        &:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        &::placeholder {
          color: #94a3b8;
        }
      }

      .search-icon {
        position: absolute;
        right: 1.25rem;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        pointer-events: none;
      }
    }

    .status-pills {
      display: flex;
      gap: 0.875rem;
      flex-wrap: wrap;
    }

    .pill {
      padding: 0.875rem 1.5rem;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 9999px;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

      &:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
      }

      &.active {
        background: #0ea5e9;
        border-color: #0ea5e9;
        color: white;
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
      }

      &.pill-warning.active {
        background: #f59e0b;
        border-color: #f59e0b;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      }

      &.pill-success.active {
        background: #10b981;
        border-color: #10b981;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      &.pill-info.active {
        background: #8b5cf6;
        border-color: #8b5cf6;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
      }

      &.pill-complete.active {
        background: #059669;
        border-color: #059669;
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
      }
    }

    .requests-grid {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem 3rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
      gap: 2rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .request-card-modern {
      background: white;
      border-radius: 1.75rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 2px solid #f1f5f9;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #0ea5e9 0%, #06b6d4 100%);
        border-radius: 1.75rem 1.75rem 0 0;
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
        border-color: #0ea5e9;

        &::before {
          opacity: 1;
        }
      }
    }

    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.75rem;
    }

    .request-number-badge {
      padding: 0.625rem 1.25rem;
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #0369a1;
      border-radius: 0.875rem;
      font-size: 0.9375rem;
      font-weight: 800;
      letter-spacing: 0.025em;
    }

    .product-info-modern {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.75rem;
      padding-bottom: 1.75rem;
      border-bottom: 2px solid #f1f5f9;

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 0.375rem 0;
        letter-spacing: -0.025em;
      }

      .product-meta {
        font-size: 0.9375rem;
        color: #64748b;
        margin: 0;
        font-weight: 500;
      }
    }

    .product-icon-large {
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 1.25rem;
      flex-shrink: 0;
      border: 2px solid #e2e8f0;
    }

    .card-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .detail-item {
      display: flex;
      gap: 0.875rem;
      align-items: flex-start;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 0.75rem;
    }

    .detail-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
      line-height: 1;
    }

    .detail-label {
      font-size: 0.8125rem;
      color: #94a3b8;
      margin-bottom: 0.375rem;
      font-weight: 500;
    }

    .detail-value {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #1e293b;
    }

    .card-actions {
      display: flex;
      gap: 0.875rem;
      flex-wrap: wrap;
    }

    .btn-card-action {
      flex: 1;
      min-width: fit-content;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1.25rem;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 0.875rem;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      color: #64748b;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      &.primary {
        border-color: #0ea5e9;
        color: #0ea5e9;
        background: #eff6ff;

        &:hover {
          background: #0ea5e9;
          color: white;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }
      }

      &.success {
        border-color: #10b981;
        color: #10b981;
        background: #ecfdf5;

        &:hover {
          background: #10b981;
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
      }

      &.info {
        border-color: #8b5cf6;
        color: #8b5cf6;
        background: #f5f3ff;

        &:hover {
          background: #8b5cf6;
          color: white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
      }
    }

    .loading-state, .empty-state-modern {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem 2rem;
      text-align: center;
      background: white;
      border-radius: 1.75rem;
      border: 2px dashed #e2e8f0;
    }

    .spinner {
      border: 4px solid rgba(14, 165, 233, 0.1);
      border-top: 4px solid #0ea5e9;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
      margin-bottom: 1.5rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state p {
      color: #64748b;
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }

    .empty-icon {
      font-size: 7rem;
      margin-bottom: 2rem;
      opacity: 0.4;
      filter: grayscale(1);
    }

    .empty-state-modern h3 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.75rem 0;
    }

    .empty-state-modern p {
      color: #64748b;
      margin: 0 0 2.5rem 0;
      max-width: 480px;
      font-size: 1.0625rem;
      line-height: 1.6;
    }

    .btn-empty-action {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 1.125rem 2.5rem;
      background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
      color: white;
      border: none;
      border-radius: 0.875rem;
      font-size: 1.0625rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba(14, 165, 233, 0.4);
      }

      &:active {
        transform: translateY(-1px);
      }
    }
  `]
})
export class MyRequestsComponent implements OnInit {
  loading = signal(true);
  requests = signal<ImportRequest[]>([]);
  filteredRequests = signal<ImportRequest[]>([]);
  selectedStatus = '';
  searchTerm = '';

  constructor(
    private i18nService: I18nService,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading.set(true);
    setTimeout(() => {
      this.requestService.getRequests().subscribe({
        next: (requests) => {
          this.requests.set(requests);
          this.filteredRequests.set(requests);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading requests:', error);
          this.loading.set(false);
        }
      });
    }, 500);
  }

  filterRequests() {
    let filtered = this.requests();

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter(r => r.status === this.selectedStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.requestNumber.toLowerCase().includes(term) ||
        r.productInfo.productName.toLowerCase().includes(term)
      );
    }

    this.filteredRequests.set(filtered);
  }

  t(key: string): string {
    return this.i18nService.translate(key);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
