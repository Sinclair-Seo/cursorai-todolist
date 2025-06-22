import React, { useState } from 'react';
import { Button, Input } from '../common';
import TodoItem from '../TodoItem';
import TodoForm from '../TodoForm';
import Loading from '../Loading';
import Error from '../Error';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter, TodoSort, PriorityLevel } from '../../types/todo';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onCreateTodo: (data: CreateTodoInput) => Promise<void>;
  onEditTodo: (id: string, data: UpdateTodoInput) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onUpdateFilter: (filter: Partial<TodoFilter>) => void;
  onUpdateSort: (sort: TodoSort) => void;
  filter: TodoFilter;
  sort: TodoSort;
  stats: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
  };
  onClearError: () => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  error,
  onCreateTodo,
  onEditTodo,
  onDeleteTodo,
  onToggleComplete,
  onUpdateFilter,
  onUpdateSort,
  filter,
  sort,
  stats,
  onClearError
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 다크모드 토글
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  // 할 일 추가 처리
  const handleCreateTodo = async (data: CreateTodoInput | UpdateTodoInput) => {
    if ('title' in data && data.title && 'description' in data && data.description && 'priority' in data && data.priority) {
      await onCreateTodo(data as CreateTodoInput);
      setShowForm(false);
    }
  };

  // 할 일 수정 처리
  const handleEditTodo = async (data: CreateTodoInput | UpdateTodoInput) => {
    if (editingTodo) {
      await onEditTodo(editingTodo.id, data as UpdateTodoInput);
      setEditingTodo(null);
    }
  };

  // 할 일 수정 시작
  const handleStartEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(false);
  };

  // 할 일 수정 취소
  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  // 검색 처리
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateFilter({ search: e.target.value });
  };

  // 우선순위 필터 처리
  const handlePriorityFilter = (priority: PriorityLevel | undefined) => {
    onUpdateFilter({ priority });
  };

  // 완료 상태 필터 처리
  const handleCompletedFilter = (completed: boolean | undefined) => {
    if (completed === undefined) {
      onUpdateFilter({ status: undefined });
    } else if (completed) {
      onUpdateFilter({ status: 'completed' });
    } else {
      onUpdateFilter({ status: 'todo' });
    }
  };

  // 정렬 처리
  const handleSort = (field: TodoSort['field']) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    onUpdateSort({ field, direction });
  };

  if (loading) {
    return <Loading size="lg" text="할 일을 불러오는 중..." />;
  }

  if (error) {
    return <Error message={error} onRetry={onClearError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              할 일 관리
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              효율적으로 할 일을 관리하세요
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="p-2"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </Button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">전체</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-success-600">{stats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">완료</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-warning-600">{stats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">대기</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-danger-600">{stats.highPriority}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">높은 우선순위</div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <Input
                  placeholder="할 일 검색..."
                  value={filter.search || ''}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              필터
            </Button>
          </div>

          {/* 필터 옵션들 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  우선순위
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={filter.priority === undefined ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handlePriorityFilter(undefined)}
                  >
                    전체
                  </Button>
                  <Button
                    variant={filter.priority === 1 ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handlePriorityFilter(1)}
                  >
                    높음
                  </Button>
                  <Button
                    variant={filter.priority === 2 ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handlePriorityFilter(2)}
                  >
                    중간
                  </Button>
                  <Button
                    variant={filter.priority === 3 ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handlePriorityFilter(3)}
                  >
                    낮음
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  상태
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={filter.status === undefined ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handleCompletedFilter(undefined)}
                  >
                    전체
                  </Button>
                  <Button
                    variant={filter.status === 'completed' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handleCompletedFilter(true)}
                  >
                    완료
                  </Button>
                  <Button
                    variant={filter.status === 'todo' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => handleCompletedFilter(false)}
                  >
                    미완료
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  정렬
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1"
                  >
                    생성일
                    {sort.field === 'createdAt' && (
                      sort.direction === 'asc' ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSort('priority')}
                    className="flex items-center gap-1"
                  >
                    우선순위
                    {sort.field === 'priority' && (
                      sort.direction === 'asc' ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-1"
                  >
                    제목
                    {sort.field === 'title' && (
                      sort.direction === 'asc' ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 할 일 추가 폼 */}
        {showForm && (
          <div className="mb-6">
            <TodoForm
              onSubmit={handleCreateTodo}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* 할 일 수정 폼 */}
        {editingTodo && (
          <div className="mb-6">
            <TodoForm
              onSubmit={handleEditTodo}
              initialData={editingTodo}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {/* 할 일 추가 버튼 */}
        {!showForm && !editingTodo && (
          <div className="mb-6">
            <Button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              새 할 일 추가
            </Button>
          </div>
        )}

        {/* 할 일 목록 */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                할 일이 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filter.search || filter.priority || filter.status !== undefined
                  ? '검색 조건에 맞는 할 일이 없습니다.'
                  : '새로운 할 일을 추가해보세요!'}
              </p>
              {!filter.search && filter.priority === undefined && filter.status === undefined && (
                <Button onClick={() => setShowForm(true)}>
                  첫 번째 할 일 추가하기
                </Button>
              )}
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onEdit={handleStartEdit}
                onDelete={onDeleteTodo}
                onCancelEdit={handleCancelEdit}
                isEditing={editingTodo?.id === todo.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList; 