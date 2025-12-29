import { Injectable, signal } from '@angular/core';
import { Document, DocumentType, DocumentStatus } from '../models/document.model';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents = signal<Document[]>([]);

  constructor() {
    this.initializeMockData();
  }

  uploadDocument(document: Partial<Document>): Observable<Document> {
    const newDocument: Document = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending_verification',
      uploadDate: new Date(),
      ...document
    } as Document;

    const documents = this.documents();
    documents.push(newDocument);
    this.documents.set([...documents]);

    return of(newDocument).pipe(delay(800));
  }

  getDocumentsByRequestId(requestId: string): Observable<Document[]> {
    const filtered = this.documents().filter(d => d.requestId === requestId);
    return of(filtered).pipe(delay(200));
  }

  verifyDocument(id: string, verifiedBy: string): Observable<Document> {
    const documents = this.documents();
    const index = documents.findIndex(d => d.id === id);
    
    if (index !== -1) {
      documents[index] = {
        ...documents[index],
        status: 'verified',
        verifiedBy,
        verifiedDate: new Date()
      };
      this.documents.set([...documents]);
      return of(documents[index]).pipe(delay(300));
    }
    
    throw new Error('Document not found');
  }

  downloadDocument(id: string): Observable<Blob> {
    // Mock file download
    const mockBlob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
    return of(mockBlob).pipe(delay(500));
  }

  private initializeMockData() {
    this.documents.set([
      {
        id: '1',
        requestId: '1',
        documentType: 'commercial_invoice',
        fileName: 'فاتورة تجارية - REQ-00001.pdf',
        fileUrl: '/mock/invoice.pdf',
        fileSize: 245000,
        uploadedBy: 'exp1',
        uploadedByName: 'شركة التصدير المصرية',
        uploadedByRole: 'exporter',
        uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'verified',
        verifiedBy: 'admin1',
        verifiedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        requestId: '1',
        documentType: 'certificate_of_origin',
        fileName: 'شهادة منشأ - REQ-00001.pdf',
        fileUrl: '/mock/certificate.pdf',
        fileSize: 180000,
        uploadedBy: 'exp1',
        uploadedByName: 'شركة التصدير المصرية',
        uploadedByRole: 'exporter',
        uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'pending_verification'
      },
      {
        id: '3',
        requestId: '2',
        documentType: 'packing_list',
        fileName: 'بيان تعبئة - REQ-00002.pdf',
        fileUrl: '/mock/packing.pdf',
        fileSize: 120000,
        uploadedBy: 'exp2',
        uploadedByName: 'شركة الدواجن الدولية',
        uploadedByRole: 'exporter',
        uploadDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'verified',
        verifiedBy: 'admin1',
        verifiedDate: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]);
  }
}

