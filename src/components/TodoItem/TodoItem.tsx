import React, { useState } from 'react';
import { Button } from '../common';
import { Todo, PRIORITY_OPTIONS } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
  onCancelEdit?: () => void;
  isEditing?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  onCancelEdit,
  isEditing = false
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const priorityOption = PRIORITY_OPTIONS.find(option => option.value === todo.priority);

  const handleToggleComplete = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(todo.id, !todo.completed);
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 할 일을 삭제하시겠습니까?')) {
      setIsDeleting(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`card p-4 transition-all duration-200 animate-slide-up ${
      todo.completed ? 'opacity-75 bg-gray-50 dark:bg-gray-800' : ''
    }`}>
      <div className="flex items-start gap-3">
        {/* 완료 체크박스 */}
        <button
          onClick={handleToggleComplete}
          disabled={isToggling || isEditing}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 mt-1 ${
            todo.completed
              ? 'bg-success-500 border-success-500 text-white'
              : 'border-gray-300 hover:border-primary-500 dark:border-gray-600'
          } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {todo.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* 할 일 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${
                  todo.completed ? 'line-through' : ''
                }`}>
                  {todo.description}
                </p>
              )}
            </div>

            {/* 우선순위 배지 */}
            {priorityOption && (
              <span className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${priorityOption.bgColor} ${priorityOption.color}`}>
                {priorityOption.label}
              </span>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span>생성: {formatDate(todo.createdAt)}</span>
            {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
              <span>수정: {formatDate(todo.updatedAt)}</span>
            )}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              className="p-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(todo)}
                disabled={isDeleting}
                className="p-1 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                loading={isDeleting}
                className="p-1 text-gray-600 hover:text-danger-600 dark:text-gray-400 dark:hover:text-danger-400"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 