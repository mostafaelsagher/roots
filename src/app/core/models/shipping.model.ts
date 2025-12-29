export type ReliabilityLevel = 'high' | 'medium' | 'low';
export type ShipmentStatus = 'preparing' | 'ready_to_ship' | 'in_transit' | 'in_customs' | 'out_for_delivery' | 'delivered';

export interface ShippingProvider {
  id: string;
  name: string;
  country: string;
  shippingCost: number;
  currency: string;
  duration: number;
  reliability: ReliabilityLevel;
  rating: number;
  isPreferred: boolean;
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  trackingNumber: string;
  requestId: string;
  providerId: string;
  providerName: string;
  status: ShipmentStatus;
  currentLocation: string;
  origin: string;
  destination: string;
  estimatedArrival: Date;
  actualArrival?: Date;
  lastUpdate: Date;
  timeline: ShipmentTimeline[];
}

export interface ShipmentTimeline {
  id: string;
  status: string;
  location: string;
  timestamp: Date;
  description: string;
}

