import { Injectable, signal } from '@angular/core';
import { ImportRequest, RequestStatus } from '../models/request.model';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private requests = signal<ImportRequest[]>([]);
  private mockRequests: ImportRequest[] = [];

  constructor() {
    this.initializeMockData();
  }

  createRequest(request: Partial<ImportRequest>): Observable<ImportRequest> {
    const newRequest: ImportRequest = {
      id: Math.random().toString(36).substr(2, 9),
      requestNumber: 'REQ-' + Date.now().toString().substr(-8),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...request
    } as ImportRequest;

    this.mockRequests.push(newRequest);
    this.requests.set([...this.mockRequests]);

    return of(newRequest).pipe(delay(500));
  }

  getRequests(): Observable<ImportRequest[]> {
    return of(this.requests()).pipe(delay(300));
  }

  getRequestById(id: string): Observable<ImportRequest | undefined> {
    const request = this.requests().find(r => r.id === id);
    return of(request).pipe(delay(200));
  }

  getRequestsByStatus(status: RequestStatus): Observable<ImportRequest[]> {
    const filtered = this.requests().filter(r => r.status === status);
    return of(filtered).pipe(delay(200));
  }

  updateRequestStatus(id: string, status: RequestStatus): Observable<ImportRequest> {
    const requests = this.requests();
    const index = requests.findIndex(r => r.id === id);
    
    if (index !== -1) {
      requests[index] = {
        ...requests[index],
        status,
        updatedAt: new Date()
      };
      this.requests.set([...requests]);
      return of(requests[index]).pipe(delay(300));
    }
    
    throw new Error('Request not found');
  }

  private initializeMockData() {
    this.mockRequests = [
      {
        id: '1',
        requestNumber: 'REQ-00001',
        importerId: 'imp1',
        importerName: 'شركة الاستيراد المتقدمة',
        status: 'pending',
        productInfo: {
          productType: 'fresh',
          productName: 'تفاح',
          productCategory: 'فواكه طازجة',
          specifications: 'تفاح أحمر درجة أولى',
          qualityStandards: 'ISO 9001'
        },
        quantityInfo: {
          quantity: 1000,
          unit: 'كيلوجرام'
        },
        shippingInfo: {
          destinationCountry: 'المملكة العربية السعودية',
          destinationPort: 'ميناء جدة الإسلامي',
          destinationAddress: 'جدة، حي الروضة',
          expectedDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        optionalServices: {
          qualityInspection: true,
          shipping: true,
          shippingType: 'sea',
          doorToDoor: true,
          documentsManagement: true
        },
        additionalNotes: 'يرجى التعبئة في صناديق خشبية',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        requestNumber: 'REQ-00002',
        importerId: 'imp1',
        importerName: 'شركة الاستيراد المتقدمة',
        status: 'awaiting_quotes',
        productInfo: {
          productType: 'frozen',
          productName: 'دجاج مجمد',
          productCategory: 'لحوم مجمدة',
          specifications: 'دجاج كامل مجمد',
          qualityStandards: 'HACCP'
        },
        quantityInfo: {
          quantity: 5000,
          unit: 'كيلوجرام'
        },
        shippingInfo: {
          destinationCountry: 'المملكة العربية السعودية',
          destinationPort: 'ميناء الدمام',
          destinationAddress: 'الدمام، الخبر',
          expectedDeliveryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
        },
        optionalServices: {
          qualityInspection: true,
          shipping: true,
          shippingType: 'air',
          doorToDoor: false,
          documentsManagement: true
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    this.requests.set([...this.mockRequests]);
  }
}

