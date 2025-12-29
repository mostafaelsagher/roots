import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { ShippingService } from '../../../core/services/shipping.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { Shipment } from '../../../core/models/shipping.model';

@Component({
  selector: 'app-shipment-tracking',
  imports: [CommonModule, CardComponent, StatusBadgeComponent, LoadingComponent],
  template: `
    <div class="shipment-tracking">
      <div class="page-header">
        <h1>{{ t('tracking.title') }}</h1>
        <p>{{ t('tracking.shipmentTracking') }}</p>
      </div>

      @if (loading()) {
        <app-loading [message]="t('common.loading')" />
      } @else if (shipment()) {
        <div class="tracking-grid">
          <app-card [title]="t('tracking.shipmentTracking')">
            <div class="shipment-info">
              <div class="info-row">
                <span class="label">{{ t('tracking.trackingNumber') }}</span>
                <strong>{{ shipment()?.trackingNumber }}</strong>
              </div>
              <div class="info-row">
                <span class="label">{{ t('common.status') }}</span>
                <app-status-badge [status]="shipment()!.status" />
              </div>
              <div class="info-row">
                <span class="label">{{ t('tracking.currentLocation') }}</span>
                <strong>{{ shipment()?.currentLocation }}</strong>
              </div>
              <div class="info-row">
                <span class="label">{{ t('tracking.estimatedArrival') }}</span>
                <strong>{{ formatDate(shipment()!.estimatedArrival) }}</strong>
              </div>
            </div>

            <div class="timeline">
              @for (event of shipment()?.timeline; track event.id) {
                <div class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <h4>{{ event.description }}</h4>
                    <p class="location">📍 {{ event.location }}</p>
                    <p class="time">{{ formatDateTime(event.timestamp) }}</p>
                  </div>
                </div>
              }
            </div>
          </app-card>

          <app-card [title]="t('tracking.documents')">
            <div class="documents-list">
              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-info">
                  <h4>{{ t('tracking.documentTypes.billOfLading') }}</h4>
                  <p>تم الرفع بواسطة: شركة الشحن</p>
                </div>
                <button class="btn-download">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {{ t('common.download') }}
                </button>
              </div>

              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-info">
                  <h4>{{ t('tracking.documentTypes.certificateOfOrigin') }}</h4>
                  <p>تم الرفع بواسطة: المصدر</p>
                </div>
                <button class="btn-download">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {{ t('common.download') }}
                </button>
              </div>

              <div class="document-item">
                <div class="document-icon">📄</div>
                <div class="document-info">
                  <h4>{{ t('tracking.documentTypes.commercialInvoice') }}</h4>
                  <p>تم الرفع بواسطة: المصدر</p>
                </div>
                <button class="btn-download">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {{ t('common.download') }}
                </button>
              </div>
            </div>

            <button class="btn-upload">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {{ t('tracking.uploadDocument') }}
            </button>
          </app-card>
        </div>
      } @else {
        <app-card>
          <div class="empty-state">
            <p>{{ t('common.noData') }}</p>
          </div>
        </app-card>
      }
    </div>
  `,
  styles: [`
    .shipment-tracking {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
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

    .tracking-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .shipment-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label {
        color: #6b7280;
        font-size: 0.875rem;
      }

      strong {
        color: #1f2937;
      }
    }

    .timeline {
      position: relative;
      padding-inline-start: 2rem;
    }

    .timeline-item {
      position: relative;
      padding-bottom: 2rem;

      &::before {
        content: '';
        position: absolute;
        inset-inline-start: -2rem;
        top: 0.5rem;
        bottom: 0;
        width: 2px;
        background: #e5e7eb;
      }

      &:last-child::before {
        display: none;
      }
    }

    .timeline-marker {
      position: absolute;
      inset-inline-start: -2.5rem;
      top: 0;
      width: 1rem;
      height: 1rem;
      background: #059669;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 2px #059669;
    }

    .timeline-content {
      h4 {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
      }

      p {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0 0 0.25rem 0;

        &.location {
          color: #059669;
        }

        &.time {
          color: #9ca3af;
          font-size: 0.8125rem;
        }
      }
    }

    .documents-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .document-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .document-icon {
      font-size: 1.5rem;
    }

    .document-info {
      flex: 1;

      h4 {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.25rem 0;
      }

      p {
        font-size: 0.8125rem;
        color: #6b7280;
        margin: 0;
      }
    }

    .btn-download,
    .btn-upload {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f9fafb;
        border-color: #059669;
        color: #059669;
      }
    }

    .btn-upload {
      width: 100%;
      justify-content: center;
      background: #f3f4f6;
      border: 2px dashed #d1d5db;

      &:hover {
        background: #e5e7eb;
      }
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: #9ca3af;
    }
  `]
})
export class ShipmentTrackingComponent implements OnInit {
  loading = signal(true);
  shipment = signal<Shipment | null>(null);

  constructor(
    private i18nService: I18nService,
    private shippingService: ShippingService
  ) {}

  ngOnInit() {
    this.loadShipment();
  }

  loadShipment() {
    this.loading.set(true);
    // Load the first shipment from mock data
    this.shippingService.getShipmentById('1').subscribe({
      next: (shipment) => {
        this.shipment.set(shipment || null);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading shipment:', error);
        this.loading.set(false);
      }
    });
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

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

