export interface CostBreakdown {
  requestId: string;
  productPrice: number;
  shippingCost: number;
  qualityInspectionCost: number;
  jozourFees: number;
  insuranceFees: number;
  customsFees: number;
  otherFees: number;
  subtotal: number;
  vat: number;
  vatPercentage: number;
  grandTotal: number;
  currency: string;
  exporterApproved: boolean;
  importerApproved: boolean;
  exporterApprovedDate?: Date;
  importerApprovedDate?: Date;
}

