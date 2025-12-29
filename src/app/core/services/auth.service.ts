import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole, AuthResponse } from '../models/user.model';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string, role: UserRole): Observable<AuthResponse> {
    // Mock authentication
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: this.getMockName(role),
      email,
      role,
      company: this.getMockCompany(role),
      phone: '+966501234567',
      country: role === 'exporter' ? 'مصر' : 'المملكة العربية السعودية',
      isVerified: true,
      rating: 4.5,
      certifications: ['ISO 9001', 'HACCP'],
      createdAt: new Date()
    };

    const response: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token-' + Math.random().toString(36)
    };

    // Simulate API delay
    return of(response).pipe(
      delay(500)
    );
  }

  setCurrentUser(user: User, token: string) {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    
    // Store in localStorage
    localStorage.setItem('jozour_user', JSON.stringify(user));
    localStorage.setItem('jozour_token', token);
  }

  logout() {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('jozour_user');
    localStorage.removeItem('jozour_token');
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }

  private loadUserFromStorage() {
    const userStr = localStorage.getItem('jozour_user');
    const token = localStorage.getItem('jozour_token');
    
    if (userStr && token) {
      const user = JSON.parse(userStr);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  private getMockName(role: UserRole): string {
    const names = {
      importer: 'أحمد محمد السعيد',
      exporter: 'محمد حسن الشريف',
      logistics: 'خالد عبدالله النقل',
      quality: 'فاطمة علي الجودة',
      admin: 'مدير النظام'
    };
    return names[role];
  }

  private getMockCompany(role: UserRole): string {
    const companies = {
      importer: 'شركة الاستيراد المتقدمة',
      exporter: 'شركة التصدير الدولية',
      logistics: 'شركة الخدمات اللوجستية',
      quality: 'شركة فحص الجودة المعتمدة',
      admin: 'جوزور'
    };
    return companies[role];
  }
}

