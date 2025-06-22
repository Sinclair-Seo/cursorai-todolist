import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Todo, TodoStatus, KANBAN_COLUMNS, PriorityLevel } from '../../types/todo';
import TodoItem from '../TodoItem';
import TodoForm from '../TodoForm';
import PrioritySelector from '../PrioritySelector';
import { KanbanColumn } from './KanbanColumn';
import { SortableTodoItem } from './SortableTodoItem';
import Error from '../Error';

interface KanbanBoardProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onCreateTodo: (todo: any) => Promise<void>;
  onUpdateTodo: (id: string, updates: any) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onRetry?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  todos,
  loading,
  error,
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
  onToggleComplete,
  onRetry
}) => {
  const [showForm, setShowForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | null>(null);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 상태별로 할 일을 그룹화
  const groupedTodos = todos.reduce((acc, todo) => {
    if (filterPriority && todo.priority !== filterPriority) {
      return acc;
    }
    
    if (!acc[todo.status]) {
      acc[todo.status] = [];
    }
    acc[todo.status].push(todo);
    return acc;
  }, {} as Record<TodoStatus, Todo[]>);

  // Drag 시작 처리
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const todo = todos.find(t => t.id === active.id);
    setActiveTodo(todo || null);
  };

  // Drag 종료 처리
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);

    if (!over) return;

    const todoId = active.id as string;
    const newStatus = over.id as TodoStatus;
    const todo = todos.find(t => t.id === todoId);
    
    if (todo && todo.status !== newStatus) {
      try {
        await onUpdateTodo(todoId, { 
          status: newStatus,
          completed: newStatus === 'completed' ? true : todo.completed
        });
      } catch (error) {
        console.error('상태 변경 실패:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry}
        className="min-h-64"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            칸반보드
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            할 일을 드래그하여 상태를 변경하세요
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <PrioritySelector
            value={filterPriority}
            onChange={setFilterPriority}
            includeAll={true}
            placeholder="우선순위 필터"
          />
          
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 새 할 일
          </button>
        </div>
      </div>

      {/* 할 일 추가 폼 */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <TodoForm
            onSubmit={async (todoData) => {
              await onCreateTodo(todoData);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* 칸반보드 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              todos={groupedTodos[column.id] || []}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>

        {/* 드래그 오버레이 */}
        <DragOverlay>
          {activeTodo ? (
            <div className="opacity-80">
              <TodoItem
                todo={activeTodo}
                onEdit={() => {}}
                onDelete={onDeleteTodo}
                onToggleComplete={onToggleComplete}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}; 