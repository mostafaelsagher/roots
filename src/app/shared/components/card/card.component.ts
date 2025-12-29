import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div class="card" [class.hover]="hover()">
      @if (title()) {
        <div class="card-header">
          <h3 class="card-title">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="card-subtitle">{{ subtitle() }}</p>
          }
        </div>
      }
      
      <div class="card-content">
        <ng-content></ng-content>
      </div>

      @if (hasFooter()) {
        <div class="card-footer">
          <ng-content select="[footer]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.2s;

      &.hover:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0.25rem 0 0 0;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-footer {
      padding: 1rem 1.5rem;
      background: #f9fafb;
      border-top: 1px solid #f3f4f6;
    }
  `]
})
export class CardComponent {
  title = input<string>();
  subtitle = input<string>();
  hover = input<boolean>(false);
  hasFooter = input<boolean>(false);
}

