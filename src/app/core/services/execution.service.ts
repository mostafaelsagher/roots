import { Injectable, signal } from '@angular/core';
import { Execution, ExecutionPhase, TaskStatus } from '../models/execution.model';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {
  private executions = signal<Execution[]>([]);

  constructor() {
    this.initializeMockData();
  }

  createExecution(execution: Partial<Execution>): Observable<Execution> {
    const newExecution: Execution = {
      id: Math.random().toString(36).substr(2, 9),
      currentPhase: 'preparation',
      startDate: new Date(),
      progress: 0,
      tasks: [],
      timeline: [],
      ...execution
    } as Execution;

    const executions = this.executions();
    executions.push(newExecution);
    this.executions.set([...executions]);

    return of(newExecution).pipe(delay(500));
  }

  getExecutionByRequestId(requestId: string): Observable<Execution | undefined> {
    const execution = this.executions().find(e => e.requestId === requestId);
    return of(execution).pipe(delay(200));
  }

  updateTaskStatus(executionId: string, taskId: string, status: TaskStatus): Observable<Execution> {
    const executions = this.executions();
    const index = executions.findIndex(e => e.id === executionId);
    
    if (index !== -1) {
      const execution = executions[index];
      const taskIndex = execution.tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        execution.tasks[taskIndex] = {
          ...execution.tasks[taskIndex],
          status,
          completedDate: status === 'completed' ? new Date() : undefined,
          progress: status === 'completed' ? 100 : execution.tasks[taskIndex].progress
        };

        // Recalculate overall progress
        const totalProgress = execution.tasks.reduce((sum, task) => sum + task.progress, 0);
        execution.progress = Math.round(totalProgress / execution.tasks.length);

        this.executions.set([...executions]);
        return of(execution).pipe(delay(300));
      }
    }
    
    throw new Error('Execution or Task not found');
  }

  private initializeMockData() {
    this.executions.set([
      {
        id: '1',
        requestId: '2',
        currentPhase: 'shipping',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        estimatedCompletionDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        progress: 45,
        tasks: [
          {
            id: '1',
            title: 'تجهيز البضاعة',
            description: 'تجهيز وتغليف المنتجات',
            assignedTo: 'exp2',
            assignedToRole: 'exporter',
            status: 'completed',
            dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            completedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            progress: 100
          },
          {
            id: '2',
            title: 'فحص الجودة',
            description: 'إجراء فحص جودة شامل للمنتجات',
            assignedTo: 'qua1',
            assignedToRole: 'quality',
            status: 'completed',
            dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            progress: 100
          },
          {
            id: '3',
            title: 'الشحن',
            description: 'شحن البضاعة من المنشأ',
            assignedTo: 'log1',
            assignedToRole: 'logistics',
            status: 'in_progress',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            progress: 60
          },
          {
            id: '4',
            title: 'التخليص الجمركي',
            description: 'إجراءات التخليص الجمركي',
            assignedTo: 'log1',
            assignedToRole: 'logistics',
            status: 'not_started',
            dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            progress: 0,
            dependencies: ['3']
          },
          {
            id: '5',
            title: 'التسليم النهائي',
            description: 'تسليم البضاعة للمستورد',
            assignedTo: 'log1',
            assignedToRole: 'logistics',
            status: 'not_started',
            dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
            progress: 0,
            dependencies: ['4']
          }
        ],
        timeline: [
          {
            id: '1',
            phase: 'preparation',
            title: 'التجهيز',
            status: 'completed',
            startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            assignedParties: ['شركة الدواجن الدولية']
          },
          {
            id: '2',
            phase: 'quality_check',
            title: 'فحص الجودة',
            status: 'completed',
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            assignedParties: ['شركة فحص الجودة المعتمدة']
          },
          {
            id: '3',
            phase: 'packaging',
            title: 'التعبئة والتغليف',
            status: 'completed',
            startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            assignedParties: ['شركة الدواجن الدولية']
          },
          {
            id: '4',
            phase: 'shipping',
            title: 'الشحن',
            status: 'in_progress',
            startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            assignedParties: ['شركة الشحن البحري السريع']
          },
          {
            id: '5',
            phase: 'customs',
            title: 'التخليص الجمركي',
            status: 'not_started',
            assignedParties: ['وكيل التخليص الجمركي']
          },
          {
            id: '6',
            phase: 'delivery',
            title: 'التسليم',
            status: 'not_started',
            assignedParties: ['شركة الشحن البحري السريع']
          }
        ]
      }
    ]);
  }
}

