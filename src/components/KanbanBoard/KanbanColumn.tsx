import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn as KanbanColumnType, Todo } from '../../types/todo';
import { SortableTodoItem } from './SortableTodoItem';

interface KanbanColumnProps {
  column: KanbanColumnType;
  todos: Todo[];
  onUpdateTodo: (id: string, updates: any) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  todos,
  onUpdateTodo,
  onDeleteTodo,
  onToggleComplete
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-2 border-dashed ${column.bgColor} p-4 min-h-96 transition-colors ${
        isOver ? 'bg-blue-50 dark:bg-blue-900/30' : ''
      }`}
    >
      {/* 컬럼 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{column.icon}</span>
          <h3 className={`font-semibold ${column.color}`}>
            {column.title}
          </h3>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
            {todos.length}
          </span>
        </div>
      </div>

      {/* 드롭 영역 */}
      <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-80 space-y-3">
          {todos.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdateTodo}
              onDelete={onDeleteTodo}
              onToggleComplete={onToggleComplete}
            />
          ))}
          
          {/* 빈 상태 */}
          {todos.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>할 일이 없습니다</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}; 