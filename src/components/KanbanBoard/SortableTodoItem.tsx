import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../../types/todo';
import TodoItem from '../TodoItem';

interface SortableTodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
}

export const SortableTodoItem: React.FC<SortableTodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  onToggleComplete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = (todoToEdit: Todo) => {
    // 편집 모드에서는 상태 변경을 막음
    console.log('편집 모드에서는 상태 변경이 제한됩니다.');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${isDragging ? 'opacity-50 rotate-2 shadow-lg' : ''} cursor-grab active:cursor-grabbing`}
    >
      <TodoItem
        todo={todo}
        onEdit={handleEdit}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
      />
    </div>
  );
}; 