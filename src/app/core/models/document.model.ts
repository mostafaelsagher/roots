export type DocumentType = 'bill_of_lading' | 'certificate_of_origin' | 'commercial_invoice' | 'packing_list' | 'quality_certificate' | 'insurance_certificate' | 'customs_declaration' | 'other';
export type DocumentStatus = 'uploaded' | 'pending_verification' | 'verified' | 'rejected';

export interface Document {
  id: string;
  requestId: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadedByRole: string;
  uploadDate: Date;
  status: DocumentStatus;
  verifiedBy?: string;
  verifiedDate?: Date;
  notes?: string;
}

