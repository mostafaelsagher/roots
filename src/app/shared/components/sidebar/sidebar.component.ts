import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { UserRole } from '../../../core/models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.open]="isOpen()">
      <nav class="nav-menu">
        @for (item of filteredMenuItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
            (click)="onNavClick()">
            <span class="nav-icon" [innerHTML]="item.icon"></span>
            <span class="nav-label">{{ t(item.label) }}</span>
          </a>
        }
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      background: white;
      border-inline-end: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      z-index: 1000;

      @media (max-width: 1024px) {
        position: fixed;
        top: 73px;
        inset-inline-start: 0;
        bottom: 0;
        transform: translateX(-100%);
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

        &.open {
          transform: translateX(0);
        }

        [dir="rtl"] & {
          transform: translateX(100%);
          
          &.open {
            transform: translateX(0);
          }
        }
      }
    }

    .nav-menu {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 0.5rem;
      color: #4b5563;
      text-decoration: none;
      transition: all 0.2s;
      font-size: 0.9375rem;

      &:hover {
        background: #f3f4f6;
        color: #059669;
      }

      &.active {
        background: #d1fae5;
        color: #059669;
        font-weight: 600;
      }
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      :deep(svg) {
        width: 20px;
        height: 20px;
        stroke: currentColor;
      }
    }
  `]
})
export class SidebarComponent {
  isOpen = input<boolean>(true);
  closeSidebar = output<void>();

  private menuItems: MenuItem[] = [
    {
      label: 'nav.dashboard',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
      route: '/dashboard',
      roles: ['exporter', 'logistics', 'quality', 'admin']
    },
    {
      label: 'importer.dashboard.title',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
      route: '/importer/dashboard',
      roles: ['importer']
    },
    {
      label: 'importer.myRequests.title',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>',
      route: '/importer/requests',
      roles: ['importer']
    },
    {
      label: 'nav.requests',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
      route: '/requests',
      roles: ['importer', 'exporter', 'admin']
    },
    {
      label: 'nav.quotations',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
      route: '/quotations',
      roles: ['importer', 'exporter', 'admin']
    },
    {
      label: 'nav.shipments',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
      route: '/shipments',
      roles: ['importer', 'exporter', 'logistics', 'admin']
    },
    {
      label: 'nav.documents',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>',
      route: '/documents',
      roles: ['importer', 'exporter', 'logistics', 'quality', 'admin']
    },
    {
      label: 'nav.reports',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
      route: '/reports',
      roles: ['admin']
    },
    {
      label: 'nav.settings',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m0-12a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9"></path></svg>',
      route: '/settings',
      roles: ['importer', 'exporter', 'logistics', 'quality', 'admin']
    }
  ];

  constructor(
    private authService: AuthService,
    private i18nService: I18nService
  ) {}

  filteredMenuItems = computed(() => {
    const user = this.authService.getCurrentUser();
    if (!user) return [];
    return this.menuItems.filter(item => item.roles.includes(user.role));
  });

  t(key: string): string {
    return this.i18nService.translate(key);
  }

  onNavClick() {
    if (window.innerWidth <= 1024) {
      this.closeSidebar.emit();
    }
  }
}

