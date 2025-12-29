export type QuotationStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';

export interface Quotation {
  id: string;
  quotationNumber: string;
  requestId: string;
  exporterId: string;
  exporterName: string;
  exporterCountry: string;
  status: QuotationStatus;
  pricing: QuotationPricing;
  productDetails: QuotationProductDetails;
  terms: QuotationTerms;
  createdAt: Date;
  updatedAt: Date;
  validUntil: Date;
}

export interface QuotationPricing {
  unitPrice: number;
  currency: string;
  totalPrice: number;
  packaging: string;
  packagingType: string;
}

export interface QuotationProductDetails {
  originCountry: string;
  availability: string;
  availableDays?: number;
  qualityGrade: string;
}

export interface QuotationTerms {
  paymentTerms: string;
  deliveryTerms: string;
  validityPeriod: number;
  additionalTerms?: string;
}

