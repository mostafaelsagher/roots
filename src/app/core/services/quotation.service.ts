import { Injectable, signal } from '@angular/core';
import { Quotation, QuotationStatus } from '../models/quotation.model';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private quotations = signal<Quotation[]>([]);
  private mockQuotations: Quotation[] = [];

  constructor() {
    this.initializeMockData();
  }

  createQuotation(quotation: Partial<Quotation>): Observable<Quotation> {
    const newQuotation: Quotation = {
      id: Math.random().toString(36).substr(2, 9),
      quotationNumber: 'QUO-' + Date.now().toString().substr(-8),
      status: 'submitted',
      createdAt: new Date(),
      updatedAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ...quotation
    } as Quotation;

    this.mockQuotations.push(newQuotation);
    this.quotations.set([...this.mockQuotations]);

    return of(newQuotation).pipe(delay(500));
  }

  getQuotations(): Observable<Quotation[]> {
    return of(this.quotations()).pipe(delay(300));
  }

  getQuotationsByRequestId(requestId: string): Observable<Quotation[]> {
    const filtered = this.quotations().filter(q => q.requestId === requestId);
    return of(filtered).pipe(delay(200));
  }

  getQuotationsByExporterId(exporterId: string): Observable<Quotation[]> {
    const filtered = this.quotations().filter(q => q.exporterId === exporterId);
    return of(filtered).pipe(delay(200));
  }

  updateQuotationStatus(id: string, status: QuotationStatus): Observable<Quotation> {
    const quotations = this.quotations();
    const index = quotations.findIndex(q => q.id === id);
    
    if (index !== -1) {
      quotations[index] = {
        ...quotations[index],
        status,
        updatedAt: new Date()
      };
      this.quotations.set([...quotations]);
      return of(quotations[index]).pipe(delay(300));
    }
    
    throw new Error('Quotation not found');
  }

  private initializeMockData() {
    this.mockQuotations = [
      {
        id: '1',
        quotationNumber: 'QUO-00001',
        requestId: '1',
        exporterId: 'exp1',
        exporterName: 'شركة التصدير المصرية',
        exporterCountry: 'مصر',
        status: 'under_review',
        pricing: {
          unitPrice: 2.5,
          currency: 'USD',
          totalPrice: 2500,
          packaging: 'صناديق خشبية',
          packagingType: 'قياسي'
        },
        productDetails: {
          originCountry: 'مصر',
          availability: 'متوفر',
          availableDays: 0,
          qualityGrade: 'درجة أولى'
        },
        terms: {
          paymentTerms: 'دفعة مقدمة 30%، والباقي عند الاستلام',
          deliveryTerms: 'FOB',
          validityPeriod: 30,
          additionalTerms: 'الأسعار قابلة للتفاوض للكميات الكبيرة'
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        quotationNumber: 'QUO-00002',
        requestId: '1',
        exporterId: 'exp2',
        exporterName: 'شركة الفواكه التركية',
        exporterCountry: 'تركيا',
        status: 'submitted',
        pricing: {
          unitPrice: 2.3,
          currency: 'USD',
          totalPrice: 2300,
          packaging: 'كرتون',
          packagingType: 'مبرد'
        },
        productDetails: {
          originCountry: 'تركيا',
          availability: 'متوفر خلال 5 أيام',
          availableDays: 5,
          qualityGrade: 'ممتاز'
        },
        terms: {
          paymentTerms: 'دفع عند الشحن',
          deliveryTerms: 'CIF',
          validityPeriod: 14,
          additionalTerms: 'شحن مجاني للكميات فوق 2 طن'
        },
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000)
      }
    ];

    this.quotations.set([...this.mockQuotations]);
  }
}

