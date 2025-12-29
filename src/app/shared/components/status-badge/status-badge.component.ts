import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'secondary';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="'badge-' + variant()">
      {{ label() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      white-space: nowrap;
    }

    .badge-success {
      background: #d1fae5;
      color: #059669;
    }

    .badge-warning {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .badge-info {
      background: #dbeafe;
      color: #2563eb;
    }

    .badge-secondary {
      background: #f3f4f6;
      color: #6b7280;
    }
  `]
})
export class StatusBadgeComponent {
  status = input.required<string>();
  
  constructor(private i18nService: I18nService) {}

  label = computed(() => {
    const status = this.status();
    return this.getStatusLabel(status);
  });

  variant = computed((): BadgeVariant => {
    const status = this.status();
    return this.getStatusVariant(status);
  });

  private getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      // Request statuses
      'draft': 'مسودة',
      'pending': 'قيد المراجعة',
      'in_review': 'قيد المراجعة',
      'awaiting_quotes': 'بانتظار عروض الأسعار',
      'sent_to_exporter': 'تم الإرسال للمصدر',
      'quoted': 'تم تقديم عروض',
      'approved': 'معتمد',
      'in_execution': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
      
      // Quotation statuses
      'submitted': 'مقدم',
      'under_review': 'قيد المراجعة',
      'accepted': 'مقبول',
      'rejected': 'مرفوض',
      
      // Shipment statuses
      'preparing': 'قيد التجهيز',
      'ready_to_ship': 'جاهز للشحن',
      'in_transit': 'في الطريق',
      'in_customs': 'في الجمارك',
      'out_for_delivery': 'في طريقه للتسليم',
      'delivered': 'تم التسليم',
      
      // Document statuses
      'uploaded': 'تم الرفع',
      'pending_verification': 'بانتظار التوثيق',
      'verified': 'موثق',
      
      // Task statuses
      'not_started': 'لم تبدأ',
      'in_progress': 'قيد التنفيذ',
      'delayed': 'متأخر',
      
      // Reliability
      'high': 'عالي',
      'medium': 'متوسط',
      'low': 'منخفض'
    };

    return statusMap[status] || status;
  }

  private getStatusVariant(status: string): BadgeVariant {
    const variantMap: Record<string, BadgeVariant> = {
      'draft': 'secondary',
      'pending': 'warning',
      'in_review': 'warning',
      'awaiting_quotes': 'info',
      'sent_to_exporter': 'info',
      'quoted': 'info',
      'approved': 'success',
      'in_execution': 'info',
      'completed': 'success',
      'cancelled': 'danger',
      'submitted': 'info',
      'under_review': 'warning',
      'accepted': 'success',
      'rejected': 'danger',
      'preparing': 'warning',
      'ready_to_ship': 'info',
      'in_transit': 'info',
      'in_customs': 'warning',
      'out_for_delivery': 'info',
      'delivered': 'success',
      'uploaded': 'info',
      'pending_verification': 'warning',
      'verified': 'success',
      'not_started': 'secondary',
      'in_progress': 'info',
      'delayed': 'danger',
      'high': 'success',
      'medium': 'warning',
      'low': 'danger'
    };

    return variantMap[status] || 'secondary';
  }
}

