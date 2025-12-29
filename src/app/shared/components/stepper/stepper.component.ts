import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  label: string;
  completed: boolean;
}

@Component({
  selector: 'app-stepper',
  imports: [CommonModule],
  template: `
    <div class="stepper">
      @for (step of steps(); track $index) {
        <div class="step-wrapper">
          <div 
            class="step"
            [class.active]="$index === currentStep()"
            [class.completed]="step.completed"
            (click)="onStepClick($index)">
            <div class="step-indicator">
              @if (step.completed) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              } @else {
                <span>{{ $index + 1 }}</span>
              }
            </div>
            <span class="step-label">{{ step.label }}</span>
          </div>
          
          @if ($index < steps().length - 1) {
            <div class="step-connector" [class.completed]="step.completed"></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .stepper {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 0;
      }
    }

    .step-wrapper {
      display: flex;
      align-items: center;
      flex: 1;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
      }
    }

    .step {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.8;
      }

      @media (max-width: 768px) {
        width: 100%;
        padding: 0.75rem 0;
      }
    }

    .step-indicator {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #e5e7eb;
      color: #6b7280;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    .step.active .step-indicator {
      background: #059669;
      color: white;
      transform: scale(1.1);
    }

    .step.completed .step-indicator {
      background: #059669;
      color: white;
    }

    .step-label {
      font-size: 0.9375rem;
      color: #6b7280;
      font-weight: 500;
      white-space: nowrap;

      @media (max-width: 768px) {
        white-space: normal;
      }
    }

    .step.active .step-label {
      color: #059669;
      font-weight: 600;
    }

    .step.completed .step-label {
      color: #1f2937;
    }

    .step-connector {
      flex: 1;
      height: 2px;
      background: #e5e7eb;
      margin: 0 1rem;
      transition: all 0.3s;

      &.completed {
        background: #059669;
      }

      @media (max-width: 768px) {
        width: 2px;
        height: 1rem;
        margin: 0;
        margin-inline-start: 1.25rem;
      }
    }
  `]
})
export class StepperComponent {
  steps = input.required<Step[]>();
  currentStep = input<number>(0);
  stepChange = output<number>();

  onStepClick(index: number) {
    const steps = this.steps();
    // Allow clicking on completed steps or the next step
    if (steps[index].completed || index === this.currentStep() + 1 || index < this.currentStep()) {
      this.stepChange.emit(index);
    }
  }
}

