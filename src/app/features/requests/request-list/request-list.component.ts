import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { RequestService } from '../../../core/services/request.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ImportRequest } from '../../../core/models/request.model';

@Component({
  selector: 'app-request-list',
  imports: [CommonModule, RouterLink, CardComponent, StatusBadgeComponent, LoadingComponent],
  template: `
    <div class="request-list">
      <div class="page-header">
        <div>
          <h1>{{ t('nav.requests') }}</h1>
          <p>{{ t('dashboard.viewAllRequests') }}</p>
        </div>
        <button class="btn-primary" routerLink="/requests/new">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          {{ t('dashboard.createRequest') }}
        </button>
      </div>

      @if (loading()) {
        <app-loading [message]="t('common.loading')" />
      } @else {
        <app-card>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ t('importerRequest.requestNumber') }}</th>
                  <th>{{ t('importerRequest.productName') }}</th>
                  <th>{{ t('importerRequest.quantity') }}</th>
                  <th>{{ t('importerRequest.destinationCountry') }}</th>
                  <th>{{ t('common.status') }}</th>
                  <th>{{ t('common.date') }}</th>
                  <th>{{ t('common.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                @if (requests().length > 0) {
                  @for (request of requests(); track request.id) {
                    <tr>
                      <td>
                        <strong>{{ request.requestNumber }}</strong>
                      </td>
                      <td>{{ request.productInfo.productName }}</td>
                      <td>{{ request.quantityInfo.quantity }} {{ request.quantityInfo.unit }}</td>
                      <td>{{ request.shippingInfo.destinationCountry }}</td>
                      <td>
                        <app-status-badge [status]="request.status" />
                      </td>
                      <td>{{ formatDate(request.createdAt) }}</td>
                      <td>
                        <button class="btn-action" [routerLink]="['/requests', request.id]">
                          {{ t('common.view') }}
                        </button>
                      </td>
                    </tr>
                  }
                } @else {
                  <tr>
                    <td colspan="7" class="empty-state">
                      {{ t('common.noData') }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </app-card>
      }
    </div>
  `,
  styles: [`
    .request-list {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
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

      p {
        color: #6b7280;
        margin: 0;
      }

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
      }
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;

      thead {
        background: #f9fafb;
        border-bottom: 2px solid #e5e7eb;

        th {
          padding: 1rem;
          text-align: start;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      tbody {
        tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.2s;

          &:hover {
            background: #f9fafb;
          }
        }

        td {
          padding: 1rem;
          font-size: 0.9375rem;
          color: #1f2937;

          &.empty-state {
            text-align: center;
            color: #9ca3af;
            padding: 3rem;
          }
        }
      }
    }

    .btn-action {
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-block;

      &:hover {
        background: #e5e7eb;
        color: #059669;
      }
    }
  `]
})
export class RequestListComponent implements OnInit {
  loading = signal(true);
  requests = signal<ImportRequest[]>([]);

  constructor(
    private i18nService: I18nService,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading.set(true);
    this.requestService.getRequests().subscribe({
      next: (requests) => {
        this.requests.set(requests);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.loading.set(false);
      }
    });
  }

  t(key: string): string {
    return this.i18nService.translate(key);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('ar-SA');
  }
}

