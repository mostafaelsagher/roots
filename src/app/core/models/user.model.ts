export type UserRole = 'importer' | 'exporter' | 'logistics' | 'quality' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  phone: string;
  country: string;
  avatar?: string;
  rating?: number;
  certifications?: string[];
  isVerified: boolean;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

