export type ExecutionPhase = 'preparation' | 'quality_check' | 'packaging' | 'shipping' | 'customs' | 'delivery';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'delayed';

export interface Execution {
  id: string;
  requestId: string;
  currentPhase: ExecutionPhase;
  startDate: Date;
  estimatedCompletionDate: Date;
  actualCompletionDate?: Date;
  progress: number;
  tasks: ExecutionTask[];
  timeline: ExecutionTimeline[];
}

export interface ExecutionTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToRole: string;
  status: TaskStatus;
  dueDate: Date;
  completedDate?: Date;
  progress: number;
  dependencies?: string[];
}

export interface ExecutionTimeline {
  id: string;
  phase: ExecutionPhase;
  title: string;
  status: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  assignedParties: string[];
}

