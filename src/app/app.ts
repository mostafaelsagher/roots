import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  isLoading = signal(true);

  constructor(private i18nService: I18nService) {}

  async ngOnInit() {
    // Initialize Arabic language and RTL on app start
    await this.i18nService.loadTranslations('ar');
    this.isLoading.set(false);
  }
}
