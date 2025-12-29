export type ProductType = 'fresh' | 'frozen';
export type ShippingType = 'sea' | 'air' | 'land';
export type RequestStatus = 'draft' | 'pending' | 'in_review' | 'awaiting_quotes' | 'sent_to_exporter' | 'quoted' | 'approved' | 'in_execution' | 'completed' | 'cancelled';

export interface ImportRequest {
  id: string;
  requestNumber: string;
  importerId: string;
  importerName: string;
  status: RequestStatus;
  productInfo: ProductInfo;
  quantityInfo: QuantityInfo;
  shippingInfo: ShippingInfo;
  optionalServices: OptionalServices;
  additionalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInfo {
  productType: ProductType;
  productName: string;
  productCategory: string;
  specifications: string;
  qualityStandards: string;
}

export interface QuantityInfo {
  quantity: number;
  unit: string;
}

export interface ShippingInfo {
  destinationCountry: string;
  destinationPort: string;
  destinationAddress: string;
  expectedDeliveryDate: Date;
}

export interface OptionalServices {
  qualityInspection: boolean;
  shipping: boolean;
  shippingType?: ShippingType;
  doorToDoor: boolean;
  documentsManagement: boolean;
}

