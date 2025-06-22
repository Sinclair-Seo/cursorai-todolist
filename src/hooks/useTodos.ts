import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter, TodoSort } from '../types/todo';
import { 
  addTodo, 
  updateTodo, 
  deleteTodo, 
  subscribeToTodos, 
  toggleTodoComplete 
} from '../services/firebase/todoService';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>({});
  const [sort, setSort] = useState<TodoSort>({ field: 'createdAt', direction: 'desc' });

  // Firebase 실시간 구독 설정
  useEffect(() => {
    const unsubscribe = subscribeToTodos((newTodos) => {
      setTodos(newTodos);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  // 필터링된 Todo 목록
  const filteredTodos = useCallback(() => {
    let filtered = [...todos];

    // 우선순위 필터
    if (filter.priority) {
      filtered = filtered.filter(todo => todo.priority === filter.priority);
    }

    // 완료 상태 필터
    if (filter.completed !== undefined) {
      filtered = filtered.filter(todo => todo.completed === filter.completed);
    }

    // 검색 필터
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description.toLowerCase().includes(searchLower)
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sort.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [todos, filter, sort]);

  // 할 일 추가
  const createTodo = useCallback(async (todoInput: CreateTodoInput) => {
    try {
      setError(null);
      await addTodo(todoInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : '할 일을 추가하는 중 오류가 발생했습니다.');
      throw err;
    }
  }, []);

  // 할 일 수정
  const editTodo = useCallback(async (id: string, updates: UpdateTodoInput) => {
    try {
      setError(null);
      await updateTodo(id, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : '할 일을 수정하는 중 오류가 발생했습니다.');
      throw err;
    }
  }, []);

  // 할 일 삭제
  const removeTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      await deleteTodo(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : '할 일을 삭제하는 중 오류가 발생했습니다.');
      throw err;
    }
  }, []);

  // 완료 상태 토글
  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    try {
      setError(null);
      await toggleTodoComplete(id, completed);
    } catch (err) {
      setError(err instanceof Error ? err.message : '완료 상태를 변경하는 중 오류가 발생했습니다.');
      throw err;
    }
  }, []);

  // 필터 설정
  const updateFilter = useCallback((newFilter: Partial<TodoFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  // 정렬 설정
  const updateSort = useCallback((newSort: TodoSort) => {
    setSort(newSort);
  }, []);

  // 통계
  const stats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const highPriority = todos.filter(todo => todo.priority === 1 && !todo.completed).length;

    return { total, completed, pending, highPriority };
  }, [todos]);

  return {
    todos: filteredTodos(),
    loading,
    error,
    filter,
    sort,
    stats: stats(),
    createTodo,
    editTodo,
    removeTodo,
    toggleComplete,
    updateFilter,
    updateSort,
    clearError: () => setError(null)
  };
}; 