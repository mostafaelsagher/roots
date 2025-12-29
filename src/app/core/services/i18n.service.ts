import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private translations = signal<any>({});
  private currentLanguage = signal<string>('ar');
  private isLoaded = signal<boolean>(false);

  constructor(private http: HttpClient) {
    // Set RTL immediately
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }

  async loadTranslations(lang: string): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get(`/assets/i18n/${lang}.json`)
      );
      this.translations.set(data);
      this.currentLanguage.set(lang);
      this.isLoaded.set(true);
      
      // Set document direction
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      
      console.log('Translations loaded successfully:', Object.keys(data || {}));
    } catch (error) {
      console.error('Failed to load translations:', error);
      this.isLoaded.set(true); // Set to true anyway to prevent infinite loading
    }
  }

  translate(key: string, params?: Record<string, any>): string {
    if (!this.isLoaded()) {
      return key; // Return key if not loaded yet
    }

    const keys = key.split('.');
    let value = this.translations();
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    if (typeof value === 'string' && params) {
      return this.interpolate(value, params);
    }
    
    return typeof value === 'string' ? value : key;
  }

  private interpolate(text: string, params: Record<string, any>): string {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  getCurrentLanguage() {
    return this.currentLanguage();
  }

  getTranslations() {
    return this.translations();
  }
}

