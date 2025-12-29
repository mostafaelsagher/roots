import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class.fullscreen]="fullscreen()">
      <div class="spinner" [style.width.px]="size()" [style.height.px]="size()">
        <div class="spinner-ring"></div>
      </div>
      @if (message()) {
        <p class="loading-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;

      &.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        z-index: 9999;
      }
    }

    .spinner {
      position: relative;
      animation: rotate 1s linear infinite;
    }

    .spinner-ring {
      width: 100%;
      height: 100%;
      border: 3px solid #e5e7eb;
      border-top-color: #059669;
      border-radius: 50%;
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .loading-message {
      margin-top: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
      text-align: center;
    }
  `]
})
export class LoadingComponent {
  size = input<number>(40);
  message = input<string>('');
  fullscreen = input<boolean>(false);
}

