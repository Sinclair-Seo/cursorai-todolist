export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 1 | 2 | 3; // 1: 높음, 2: 중간, 3: 낮음
  completed: boolean;
  status: 'todo' | 'in-progress' | 'completed'; // 칸반보드 상태
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description: string;
  priority: 1 | 2 | 3;
  status?: 'todo' | 'in-progress' | 'completed';
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: 1 | 2 | 3;
  completed?: boolean;
  status?: 'todo' | 'in-progress' | 'completed';
}

export type PriorityLevel = 1 | 2 | 3;
export type TodoStatus = 'todo' | 'in-progress' | 'completed';

export interface PriorityOption {
  value: PriorityLevel;
  label: string;
  color: string;
  bgColor: string;
}

export interface KanbanColumn {
  id: TodoStatus;
  title: string;
  color: string;
  bgColor: string;
  icon: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    value: 1,
    label: '높음',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900'
  },
  {
    value: 2,
    label: '중간',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900'
  },
  {
    value: 3,
    label: '낮음',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900'
  }
];

export const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'todo',
    title: '할 일',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    icon: '📋'
  },
  {
    id: 'in-progress',
    title: '진행 중',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    icon: '🔄'
  },
  {
    id: 'completed',
    title: '완료',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    icon: '✅'
  }
];

export interface TodoFilter {
  priority?: PriorityLevel;
  status?: TodoStatus;
  search?: string;
}

export interface TodoSort {
  field: 'createdAt' | 'priority' | 'title';
  direction: 'asc' | 'desc';
} 