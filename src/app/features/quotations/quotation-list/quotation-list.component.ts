import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { QuotationService } from '../../../core/services/quotation.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { Quotation } from '../../../core/models/quotation.model';

@Component({
  selector: 'app-quotation-list',
  imports: [CommonModule, RouterLink, CardComponent, StatusBadgeComponent, LoadingComponent],
  template: `
    <div class="quotation-list">
      <div class="page-header">
        <div>
          <h1>{{ t('exporterQuotation.title') }}</h1>
          <p>{{ t('dashboard.viewAllQuotations') }}</p>
        </div>
      </div>

      @if (loading()) {
        <app-loading [message]="t('common.loading')" />
      } @else {
        <app-card>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ t('exporterQuotation.quotationNumber') }}</th>
                  <th>{{ t('exporterQuotation.exporterName') }}</th>
                  <th>{{ t('exporterQuotation.originCountry') }}</th>
                  <th>{{ t('exporterQuotation.unitPrice') }}</th>
                  <th>{{ t('exporterQuotation.totalPrice') }}</th>
                  <th>{{ t('common.status') }}</th>
                  <th>{{ t('common.date') }}</th>
                  <th>{{ t('common.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                @if (quotations().length > 0) {
                  @for (quotation of quotations(); track quotation.id) {
                    <tr>
                      <td>
                        <strong>{{ quotation.quotationNumber }}</strong>
                      </td>
                      <td>{{ quotation.exporterName }}</td>
                      <td>{{ quotation.productDetails.originCountry }}</td>
                      <td>{{ quotation.pricing.unitPrice }} {{ quotation.pricing.currency }}</td>
                      <td>{{ quotation.pricing.totalPrice }} {{ quotation.pricing.currency }}</td>
                      <td>
                        <app-status-badge [status]="quotation.status" />
                      </td>
                      <td>{{ formatDate(quotation.createdAt) }}</td>
                      <td>
                        <button class="btn-action">
                          {{ t('common.view') }}
                        </button>
                      </td>
                    </tr>
                  }
                } @else {
                  <tr>
                    <td colspan="8" class="empty-state">
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
    .quotation-list {
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

      &:hover {
        background: #e5e7eb;
        color: #059669;
      }
    }
  `]
})
export class QuotationListComponent implements OnInit {
  loading = signal(true);
  quotations = signal<Quotation[]>([]);

  constructor(
    private i18nService: I18nService,
    private quotationService: QuotationService
  ) {}

  ngOnInit() {
    this.loadQuotations();
  }

  loadQuotations() {
    this.loading.set(true);
    this.quotationService.getQuotations().subscribe({
      next: (quotations) => {
        this.quotations.set(quotations);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading quotations:', error);
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

