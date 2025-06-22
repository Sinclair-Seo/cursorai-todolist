import React, { useState, useEffect } from 'react';
import { Button, Input } from '../common';
import PrioritySelector from '../PrioritySelector';
import { CreateTodoInput, UpdateTodoInput, Todo, PriorityLevel, TodoStatus, KANBAN_COLUMNS } from '../../types/todo';

interface TodoFormProps {
  onSubmit: (data: CreateTodoInput | UpdateTodoInput) => Promise<void>;
  initialData?: Todo;
  onCancel?: () => void;
  loading?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateTodoInput>({
    title: '',
    description: '',
    priority: 2,
    status: 'todo'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        status: initialData.status
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      if (!isEditing) {
        // 새 할 일 추가 시 폼 초기화
        setFormData({
          title: '',
          description: '',
          priority: 2,
          status: 'todo'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: keyof CreateTodoInput, value: string | PriorityLevel | TodoStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {isEditing ? '할 일 수정' : '새 할 일 추가'}
        </h3>
        
        <div className="space-y-4">
          <Input
            label="제목"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="할 일의 제목을 입력하세요"
            error={errors.title}
            disabled={loading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="할 일에 대한 자세한 설명을 입력하세요"
              className={`input min-h-[100px] resize-none ${errors.description ? 'border-danger-500 focus:ring-danger-500' : ''}`}
              disabled={loading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PrioritySelector
              value={formData.priority}
              onChange={(priority) => handleInputChange('priority', priority || 2)}
              disabled={loading}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                상태
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as TodoStatus)}
                className="input w-full"
                disabled={loading}
              >
                {KANBAN_COLUMNS.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.icon} {column.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            {isEditing ? '수정하기' : '추가하기'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              취소
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default TodoForm; 