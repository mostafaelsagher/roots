import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { RequestService } from '../../../core/services/request.service';
import { AuthService } from '../../../core/services/auth.service';
import { StepperComponent, Step } from '../../../shared/components/stepper/stepper.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ProductType, ShippingType, ImportRequest } from '../../../core/models/request.model';

@Component({
  selector: 'app-request-create',
  imports: [CommonModule, FormsModule, StepperComponent, CardComponent, LoadingComponent],
  template: `
    <div class="request-create">
      <div class="page-header">
        <h1>{{ t('importerRequest.title') }}</h1>
        <p>{{ t('importerRequest.subtitle') }}</p>
      </div>

      <app-stepper 
        [steps]="steps()" 
        [currentStep]="currentStep()"
        (stepChange)="goToStep($event)" />

      @if (loading()) {
        <app-loading [message]="t('common.loading')" />
      } @else {
        <form (ngSubmit)="onSubmit()">
          <!-- Step 1: Product Info -->
          @if (currentStep() === 0) {
            <app-card [title]="t('importerRequest.step1')">
              <div class="form-grid">
                <div class="form-group">
                  <label>{{ t('importerRequest.productType') }} *</label>
                  <div class="radio-group">
                    <label class="radio-label">
                      <input type="radio" name="productType" value="fresh" [(ngModel)]="formData.productType">
                      <span>{{ t('importerRequest.fresh') }}</span>
                    </label>
                    <label class="radio-label">
                      <input type="radio" name="productType" value="frozen" [(ngModel)]="formData.productType">
                      <span>{{ t('importerRequest.frozen') }}</span>
                    </label>
                  </div>
                </div>

                <div class="form-group full-width">
                  <label>{{ t('importerRequest.productName') }} *</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.productName" name="productName" required>
                </div>

                <div class="form-group full-width">
                  <label>{{ t('importerRequest.productCategory') }} *</label>
                  <select class="form-control" [(ngModel)]="formData.productCategory" name="productCategory" required>
                    <option value="">اختر الفئة</option>
                    <option value="فواكه طازجة">فواكه طازجة</option>
                    <option value="خضروات طازجة">خضروات طازجة</option>
                    <option value="لحوم مجمدة">لحوم مجمدة</option>
                    <option value="أسماك مجمدة">أسماك مجمدة</option>
                    <option value="منتجات ألبان">منتجات ألبان</option>
                    <option value="حبوب ومواد غذائية">حبوب ومواد غذائية</option>
                  </select>
                </div>

                <div class="form-group full-width">
                  <label>{{ t('importerRequest.specifications') }} *</label>
                  <textarea class="form-control" rows="3" [(ngModel)]="formData.specifications" name="specifications" required></textarea>
                </div>

                <div class="form-group full-width">
                  <label>{{ t('importerRequest.qualityStandards') }} *</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.qualityStandards" name="qualityStandards" placeholder="مثال: ISO 9001, HACCP" required>
                </div>
              </div>
            </app-card>
          }

          <!-- Step 2: Quantity -->
          @if (currentStep() === 1) {
            <app-card [title]="t('importerRequest.step2')">
              <div class="form-grid">
                <div class="form-group">
                  <label>{{ t('importerRequest.quantity') }} *</label>
                  <input type="number" class="form-control" [(ngModel)]="formData.quantity" name="quantity" min="1" required>
                </div>

                <div class="form-group">
                  <label>{{ t('importerRequest.unit') }} *</label>
                  <select class="form-control" [(ngModel)]="formData.unit" name="unit" required>
                    <option value="كيلوجرام">كيلوجرام</option>
                    <option value="طن">طن</option>
                    <option value="صندوق">صندوق</option>
                    <option value="حاوية">حاوية</option>
                    <option value="لتر">لتر</option>
                  </select>
                </div>
              </div>
            </app-card>
          }

          <!-- Step 3: Shipping Info -->
          @if (currentStep() === 2) {
            <app-card [title]="t('importerRequest.step3')">
              <div class="form-grid">
                <div class="form-group">
                  <label>{{ t('importerRequest.destinationCountry') }} *</label>
                  <select class="form-control" [(ngModel)]="formData.destinationCountry" name="destinationCountry" required>
                    <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                    <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                    <option value="الكويت">الكويت</option>
                    <option value="قطر">قطر</option>
                    <option value="البحرين">البحرين</option>
                    <option value="عمان">عمان</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>{{ t('importerRequest.destinationPort') }} *</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.destinationPort" name="destinationPort" required>
                </div>

                <div class="form-group full-width">
                  <label>{{ t('importerRequest.destinationAddress') }} *</label>
                  <textarea class="form-control" rows="2" [(ngModel)]="formData.destinationAddress" name="destinationAddress" required></textarea>
                </div>

                <div class="form-group">
                  <label>{{ t('importerRequest.expectedDeliveryDate') }} *</label>
                  <input type="date" class="form-control" [(ngModel)]="formData.expectedDeliveryDate" name="expectedDeliveryDate" required>
                </div>
              </div>
            </app-card>
          }

          <!-- Step 4: Optional Services -->
          @if (currentStep() === 3) {
            <app-card [title]="t('importerRequest.step4')">
              <div class="services-list">
                <label class="service-item">
                  <input type="checkbox" [(ngModel)]="formData.qualityInspection" name="qualityInspection">
                  <div class="service-content">
                    <h4>{{ t('importerRequest.qualityInspection') }}</h4>
                    <p>فحص شامل للجودة قبل الشحن</p>
                  </div>
                  <div class="service-price">200 USD</div>
                </label>

                <label class="service-item">
                  <input type="checkbox" [(ngModel)]="formData.shipping" name="shipping">
                  <div class="service-content">
                    <h4>{{ t('importerRequest.shipping') }}</h4>
                    <p>خدمات شحن متكاملة</p>
                  </div>
                </label>

                @if (formData.shipping) {
                  <div class="shipping-options">
                    <label class="radio-label">
                      <input type="radio" name="shippingType" value="sea" [(ngModel)]="formData.shippingType">
                      <span>{{ t('importerRequest.seaShipping') }}</span>
                    </label>
                    <label class="radio-label">
                      <input type="radio" name="shippingType" value="air" [(ngModel)]="formData.shippingType">
                      <span>{{ t('importerRequest.airShipping') }}</span>
                    </label>
                    <label class="radio-label">
                      <input type="radio" name="shippingType" value="land" [(ngModel)]="formData.shippingType">
                      <span>{{ t('importerRequest.landShipping') }}</span>
                    </label>
                  </div>
                }

                <label class="service-item">
                  <input type="checkbox" [(ngModel)]="formData.doorToDoor" name="doorToDoor">
                  <div class="service-content">
                    <h4>{{ t('importerRequest.doorToDoor') }}</h4>
                    <p>توصيل من الباب إلى الباب</p>
                  </div>
                </label>

                <label class="service-item">
                  <input type="checkbox" [(ngModel)]="formData.documentsManagement" name="documentsManagement">
                  <div class="service-content">
                    <h4>{{ t('importerRequest.documentsManagement') }}</h4>
                    <p>إدارة شاملة لجميع مستندات الشحن</p>
                  </div>
                  <div class="service-price">150 USD</div>
                </label>
              </div>

              <div class="form-group">
                <label>{{ t('importerRequest.additionalNotes') }}</label>
                <textarea class="form-control" rows="3" [(ngModel)]="formData.additionalNotes" name="additionalNotes"></textarea>
              </div>
            </app-card>
          }

          <!-- Step 5: Review -->
          @if (currentStep() === 4) {
            <app-card [title]="t('importerRequest.step5')">
              <div class="review-section">
                <h3>{{ t('importerRequest.requestSummary') }}</h3>
                
                <div class="review-group">
                  <h4>{{ t('importerRequest.step1') }}</h4>
                  <dl class="review-list">
                    <dt>{{ t('importerRequest.productType') }}</dt>
                    <dd>{{ formData.productType === 'fresh' ? t('importerRequest.fresh') : t('importerRequest.frozen') }}</dd>
                    
                    <dt>{{ t('importerRequest.productName') }}</dt>
                    <dd>{{ formData.productName }}</dd>
                    
                    <dt>{{ t('importerRequest.productCategory') }}</dt>
                    <dd>{{ formData.productCategory }}</dd>
                    
                    <dt>{{ t('importerRequest.specifications') }}</dt>
                    <dd>{{ formData.specifications }}</dd>
                    
                    <dt>{{ t('importerRequest.qualityStandards') }}</dt>
                    <dd>{{ formData.qualityStandards }}</dd>
                  </dl>
                </div>

                <div class="review-group">
                  <h4>{{ t('importerRequest.step2') }}</h4>
                  <dl class="review-list">
                    <dt>{{ t('importerRequest.quantity') }}</dt>
                    <dd>{{ formData.quantity }} {{ formData.unit }}</dd>
                  </dl>
                </div>

                <div class="review-group">
                  <h4>{{ t('importerRequest.step3') }}</h4>
                  <dl class="review-list">
                    <dt>{{ t('importerRequest.destinationCountry') }}</dt>
                    <dd>{{ formData.destinationCountry }}</dd>
                    
                    <dt>{{ t('importerRequest.destinationPort') }}</dt>
                    <dd>{{ formData.destinationPort }}</dd>
                    
                    <dt>{{ t('importerRequest.destinationAddress') }}</dt>
                    <dd>{{ formData.destinationAddress }}</dd>
                    
                    <dt>{{ t('importerRequest.expectedDeliveryDate') }}</dt>
                    <dd>{{ formData.expectedDeliveryDate }}</dd>
                  </dl>
                </div>

                <div class="review-group">
                  <h4>{{ t('importerRequest.step4') }}</h4>
                  <div class="selected-services">
                    @if (formData.qualityInspection) {
                      <span class="service-badge">✓ {{ t('importerRequest.qualityInspection') }}</span>
                    }
                    @if (formData.shipping) {
                      <span class="service-badge">✓ {{ t('importerRequest.shipping') }} - {{ formData.shippingType === 'sea' ? t('importerRequest.seaShipping') : formData.shippingType === 'air' ? t('importerRequest.airShipping') : t('importerRequest.landShipping') }}</span>
                    }
                    @if (formData.doorToDoor) {
                      <span class="service-badge">✓ {{ t('importerRequest.doorToDoor') }}</span>
                    }
                    @if (formData.documentsManagement) {
                      <span class="service-badge">✓ {{ t('importerRequest.documentsManagement') }}</span>
                    }
                  </div>
                </div>
              </div>
            </app-card>
          }

          <!-- Navigation Buttons -->
          <div class="form-actions">
            @if (currentStep() > 0) {
              <button type="button" class="btn-secondary" (click)="previousStep()">
                {{ t('common.previous') }}
              </button>
            }
            
            <div class="spacer"></div>

            @if (currentStep() < 4) {
              <button type="button" class="btn-primary" (click)="nextStep()" [disabled]="!isStepValid()">
                {{ t('common.next') }}
              </button>
            } @else {
              <button type="submit" class="btn-primary" [disabled]="submitting()">
                @if (submitting()) {
                  {{ t('common.loading') }}
                } @else {
                  {{ t('importerRequest.submitRequest') }}
                }
              </button>
            }
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .request-create {
      max-width: 900px;
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-group {
      label {
        display: block;
        font-size: 0.9375rem;
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

      textarea.form-control {
        resize: vertical;
      }
    }

    .radio-group {
      display: flex;
      gap: 1rem;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      transition: all 0.2s;

      &:has(input:checked) {
        background: #d1fae5;
        border-color: #059669;
        color: #059669;
        font-weight: 600;
      }

      input[type="radio"],
      input[type="checkbox"] {
        cursor: pointer;
      }
    }

    .services-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .service-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;

      &:has(input:checked) {
        background: #d1fae5;
        border-color: #059669;
      }

      input[type="checkbox"] {
        width: 1.25rem;
        height: 1.25rem;
        cursor: pointer;
      }

      .service-content {
        flex: 1;

        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }
      }

      .service-price {
        font-weight: 600;
        color: #059669;
      }
    }

    .shipping-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 0 0 0 2.5rem;
      margin-top: -0.5rem;
    }

    .review-section {
      h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 1.5rem 0;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e5e7eb;
      }
    }

    .review-group {
      margin-bottom: 2rem;

      h4 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #059669;
        margin: 0 0 1rem 0;
      }
    }

    .review-list {
      display: grid;
      gap: 0.75rem;
      margin: 0;

      dt {
        font-weight: 600;
        color: #6b7280;
        font-size: 0.875rem;
      }

      dd {
        color: #1f2937;
        margin: 0 0 1rem 0;
        padding: 0.75rem;
        background: #f9fafb;
        border-radius: 0.5rem;
      }
    }

    .selected-services {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .service-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1rem;
      background: #d1fae5;
      color: #059669;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .spacer {
      flex: 1;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
      }
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;

      &:hover:not(:disabled) {
        background: #e5e7eb;
      }
    }
  `]
})
export class RequestCreateComponent {
  currentStep = signal(0);
  loading = signal(false);
  submitting = signal(false);

  formData = {
    // Step 1
    productType: 'fresh' as ProductType,
    productName: '',
    productCategory: '',
    specifications: '',
    qualityStandards: '',
    
    // Step 2
    quantity: 0,
    unit: 'كيلوجرام',
    
    // Step 3
    destinationCountry: 'المملكة العربية السعودية',
    destinationPort: '',
    destinationAddress: '',
    expectedDeliveryDate: '',
    
    // Step 4
    qualityInspection: false,
    shipping: false,
    shippingType: 'sea' as ShippingType,
    doorToDoor: false,
    documentsManagement: false,
    additionalNotes: ''
  };

  constructor(
    private i18nService: I18nService,
    private requestService: RequestService,
    private authService: AuthService,
    private router: Router
  ) {}

  steps = computed((): Step[] => [
    { label: this.t('importerRequest.step1'), completed: this.currentStep() > 0 },
    { label: this.t('importerRequest.step2'), completed: this.currentStep() > 1 },
    { label: this.t('importerRequest.step3'), completed: this.currentStep() > 2 },
    { label: this.t('importerRequest.step4'), completed: this.currentStep() > 3 },
    { label: this.t('importerRequest.step5'), completed: this.currentStep() > 4 }
  ]);

  t(key: string): string {
    return this.i18nService.translate(key);
  }

  isStepValid(): boolean {
    switch (this.currentStep()) {
      case 0:
        return !!(this.formData.productName && this.formData.productCategory && 
                 this.formData.specifications && this.formData.qualityStandards);
      case 1:
        return this.formData.quantity > 0;
      case 2:
        return !!(this.formData.destinationPort && this.formData.destinationAddress && 
                 this.formData.expectedDeliveryDate);
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  }

  nextStep() {
    if (this.isStepValid() && this.currentStep() < 4) {
      this.currentStep.set(this.currentStep() + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep() {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStep(step: number) {
    this.currentStep.set(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit() {
    if (this.submitting()) return;

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.submitting.set(true);

    const request: Partial<ImportRequest> = {
      importerId: user.id,
      importerName: user.company,
      productInfo: {
        productType: this.formData.productType,
        productName: this.formData.productName,
        productCategory: this.formData.productCategory,
        specifications: this.formData.specifications,
        qualityStandards: this.formData.qualityStandards
      },
      quantityInfo: {
        quantity: this.formData.quantity,
        unit: this.formData.unit
      },
      shippingInfo: {
        destinationCountry: this.formData.destinationCountry,
        destinationPort: this.formData.destinationPort,
        destinationAddress: this.formData.destinationAddress,
        expectedDeliveryDate: new Date(this.formData.expectedDeliveryDate)
      },
      optionalServices: {
        qualityInspection: this.formData.qualityInspection,
        shipping: this.formData.shipping,
        shippingType: this.formData.shippingType,
        doorToDoor: this.formData.doorToDoor,
        documentsManagement: this.formData.documentsManagement
      },
      additionalNotes: this.formData.additionalNotes
    };

    this.requestService.createRequest(request).subscribe({
      next: (createdRequest) => {
        this.submitting.set(false);
        alert(this.t('importerRequest.requestSubmitted') + '\n' + 
              this.t('importerRequest.requestNumber') + ': ' + createdRequest.requestNumber);
        this.router.navigate(['/requests']);
      },
      error: (error) => {
        this.submitting.set(false);
        alert(this.t('common.error'));
        console.error('Error creating request:', error);
      }
    });
  }
}

