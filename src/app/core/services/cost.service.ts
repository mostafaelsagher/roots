import { Injectable, signal } from '@angular/core';
import { CostBreakdown } from '../models/cost.model';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostService {
  private costs = signal<CostBreakdown[]>([]);

  constructor() {
    this.initializeMockData();
  }

  calculateCost(
    requestId: string,
    productPrice: number,
    shippingCost: number,
    qualityInspectionCost: number = 0
  ): Observable<CostBreakdown> {
    const jozourFees = productPrice * 0.03; // 3% commission
    const insuranceFees = productPrice * 0.02; // 2% insurance
    const customsFees = productPrice * 0.05; // 5% estimated customs
    const otherFees = 100; // Fixed fees

    const subtotal = productPrice + shippingCost + qualityInspectionCost + jozourFees + insuranceFees + customsFees + otherFees;
    const vat = subtotal * 0.15; // 15% VAT
    const grandTotal = subtotal + vat;

    const costBreakdown: CostBreakdown = {
      requestId,
      productPrice,
      shippingCost,
      qualityInspectionCost,
      jozourFees: Math.round(jozourFees * 100) / 100,
      insuranceFees: Math.round(insuranceFees * 100) / 100,
      customsFees: Math.round(customsFees * 100) / 100,
      otherFees,
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      vatPercentage: 15,
      grandTotal: Math.round(grandTotal * 100) / 100,
      currency: 'USD',
      exporterApproved: false,
      importerApproved: false
    };

    return of(costBreakdown).pipe(delay(300));
  }

  getCostByRequestId(requestId: string): Observable<CostBreakdown | undefined> {
    const cost = this.costs().find(c => c.requestId === requestId);
    return of(cost).pipe(delay(200));
  }

  approveByExporter(requestId: string, exporterId: string): Observable<CostBreakdown> {
    const costs = this.costs();
    const index = costs.findIndex(c => c.requestId === requestId);
    
    if (index !== -1) {
      costs[index] = {
        ...costs[index],
        exporterApproved: true,
        exporterApprovedDate: new Date()
      };
      this.costs.set([...costs]);
      return of(costs[index]).pipe(delay(300));
    }
    
    throw new Error('Cost breakdown not found');
  }

  approveByImporter(requestId: string, importerId: string): Observable<CostBreakdown> {
    const costs = this.costs();
    const index = costs.findIndex(c => c.requestId === requestId);
    
    if (index !== -1) {
      costs[index] = {
        ...costs[index],
        importerApproved: true,
        importerApprovedDate: new Date()
      };
      this.costs.set([...costs]);
      return of(costs[index]).pipe(delay(300));
    }
    
    throw new Error('Cost breakdown not found');
  }

  private initializeMockData() {
    this.costs.set([
      {
        requestId: '1',
        productPrice: 2500,
        shippingCost: 1500,
        qualityInspectionCost: 200,
        jozourFees: 75,
        insuranceFees: 50,
        customsFees: 125,
        otherFees: 100,
        subtotal: 4550,
        vat: 682.5,
        vatPercentage: 15,
        grandTotal: 5232.5,
        currency: 'USD',
        exporterApproved: true,
        importerApproved: false,
        exporterApprovedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        requestId: '2',
        productPrice: 7500,
        shippingCost: 3500,
        qualityInspectionCost: 300,
        jozourFees: 225,
        insuranceFees: 150,
        customsFees: 375,
        otherFees: 100,
        subtotal: 12150,
        vat: 1822.5,
        vatPercentage: 15,
        grandTotal: 13972.5,
        currency: 'USD',
        exporterApproved: true,
        importerApproved: true,
        exporterApprovedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        importerApprovedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ]);
  }
}

