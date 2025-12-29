import { Injectable, signal } from '@angular/core';
import { ShippingProvider, Shipment, ShipmentStatus } from '../models/shipping.model';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private providers = signal<ShippingProvider[]>([]);
  private shipments = signal<Shipment[]>([]);

  constructor() {
    this.initializeMockData();
  }

  getShippingProviders(requestId: string): Observable<ShippingProvider[]> {
    return of(this.providers()).pipe(delay(300));
  }

  getAIRecommendedProviders(requestId: string): Observable<ShippingProvider[]> {
    // Simulate AI recommendation by sorting by a combination of factors
    const providers = [...this.providers()].sort((a, b) => {
      const scoreA = this.calculateProviderScore(a);
      const scoreB = this.calculateProviderScore(b);
      return scoreB - scoreA;
    });

    return of(providers.slice(0, 3)).pipe(delay(800));
  }

  createShipment(shipment: Partial<Shipment>): Observable<Shipment> {
    const newShipment: Shipment = {
      id: Math.random().toString(36).substr(2, 9),
      shipmentNumber: 'SHP-' + Date.now().toString().substr(-8),
      trackingNumber: 'TRK-' + Math.random().toString(36).substr(2, 12).toUpperCase(),
      status: 'preparing',
      lastUpdate: new Date(),
      timeline: [{
        id: '1',
        status: 'preparing',
        location: shipment.origin || '',
        timestamp: new Date(),
        description: 'تم إنشاء الشحنة وجاري التجهيز'
      }],
      ...shipment
    } as Shipment;

    const shipments = this.shipments();
    shipments.push(newShipment);
    this.shipments.set([...shipments]);

    return of(newShipment).pipe(delay(500));
  }

  getShipmentById(id: string): Observable<Shipment | undefined> {
    const shipment = this.shipments().find(s => s.id === id);
    return of(shipment).pipe(delay(200));
  }

  trackShipment(trackingNumber: string): Observable<Shipment | undefined> {
    const shipment = this.shipments().find(s => s.trackingNumber === trackingNumber);
    return of(shipment).pipe(delay(300));
  }

  private calculateProviderScore(provider: ShippingProvider): number {
    const reliabilityScore = provider.reliability === 'high' ? 3 : provider.reliability === 'medium' ? 2 : 1;
    const costScore = 1 / provider.shippingCost * 10000; // Inverse cost
    const speedScore = 1 / provider.duration * 100; // Inverse duration
    const ratingScore = provider.rating * 2;

    return reliabilityScore * 3 + costScore + speedScore + ratingScore;
  }

  private initializeMockData() {
    this.providers.set([
      {
        id: '1',
        name: 'شركة الشحن البحري السريع',
        country: 'المملكة العربية السعودية',
        shippingCost: 1500,
        currency: 'USD',
        duration: 14,
        reliability: 'high',
        rating: 4.8,
        isPreferred: true
      },
      {
        id: '2',
        name: 'الخطوط الجوية للشحن',
        country: 'الإمارات',
        shippingCost: 3500,
        currency: 'USD',
        duration: 3,
        reliability: 'high',
        rating: 4.9,
        isPreferred: false
      },
      {
        id: '3',
        name: 'شركة النقل الدولي',
        country: 'مصر',
        shippingCost: 1200,
        currency: 'USD',
        duration: 21,
        reliability: 'medium',
        rating: 4.2,
        isPreferred: false
      },
      {
        id: '4',
        name: 'خدمات اللوجستيات المتقدمة',
        country: 'البحرين',
        shippingCost: 2000,
        currency: 'USD',
        duration: 10,
        reliability: 'high',
        rating: 4.6,
        isPreferred: false
      },
      {
        id: '5',
        name: 'الشحن الاقتصادي',
        country: 'الأردن',
        shippingCost: 900,
        currency: 'USD',
        duration: 28,
        reliability: 'medium',
        rating: 3.9,
        isPreferred: false
      }
    ]);

    this.shipments.set([
      {
        id: '1',
        shipmentNumber: 'SHP-00001',
        trackingNumber: 'TRK-ABC123XYZ789',
        requestId: '2',
        providerId: '1',
        providerName: 'شركة الشحن البحري السريع',
        status: 'in_transit',
        currentLocation: 'ميناء بور سعيد، مصر',
        origin: 'القاهرة، مصر',
        destination: 'ميناء الدمام، المملكة العربية السعودية',
        estimatedArrival: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        lastUpdate: new Date(),
        timeline: [
          {
            id: '1',
            status: 'preparing',
            location: 'القاهرة، مصر',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            description: 'تم إنشاء الشحنة وجاري التجهيز'
          },
          {
            id: '2',
            status: 'ready_to_ship',
            location: 'القاهرة، مصر',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            description: 'البضاعة جاهزة للشحن'
          },
          {
            id: '3',
            status: 'in_transit',
            location: 'ميناء بور سعيد، مصر',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            description: 'تم شحن البضاعة'
          }
        ]
      }
    ]);
  }
}

