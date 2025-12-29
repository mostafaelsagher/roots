import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-header 
        (toggleSidebar)="toggleSidebar()"
        [sidebarOpen]="sidebarOpen()" />
      
      <div class="layout-container">
        <app-sidebar 
          [isOpen]="sidebarOpen()"
          (closeSidebar)="closeSidebar()" />
        
        <main class="main-content" [class.sidebar-open]="sidebarOpen()">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f5f7fa;
    }

    .layout-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      transition: margin-inline-start 0.3s ease;

      @media (max-width: 768px) {
        padding: 1rem;
      }
    }

    .main-content.sidebar-open {
      @media (max-width: 1024px) {
        &::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
      }
    }
  `]
})
export class LayoutComponent {
  sidebarOpen = signal(true);

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}

