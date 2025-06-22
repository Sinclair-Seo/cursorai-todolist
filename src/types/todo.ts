export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 1 | 2 | 3; // 1: 높음, 2: 중간, 3: 낮음
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description: string;
  priority: 1 | 2 | 3;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: 1 | 2 | 3;
  completed?: boolean;
}

export type PriorityLevel = 1 | 2 | 3;

export interface PriorityOption {
  value: PriorityLevel;
  label: string;
  color: string;
  bgColor: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    value: 1,
    label: '높음',
    color: 'text-danger-600',
    bgColor: 'bg-danger-100 dark:bg-danger-900'
  },
  {
    value: 2,
    label: '중간',
    color: 'text-warning-600',
    bgColor: 'bg-warning-100 dark:bg-warning-900'
  },
  {
    value: 3,
    label: '낮음',
    color: 'text-success-600',
    bgColor: 'bg-success-100 dark:bg-success-900'
  }
];

export interface TodoFilter {
  priority?: PriorityLevel;
  completed?: boolean;
  search?: string;
}

export interface TodoSort {
  field: 'createdAt' | 'priority' | 'title';
  direction: 'asc' | 'desc';
} 