import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter, TodoSort, TodoStatus } from '../types/todo';
import { 
  addTodo, 
  updateTodo, 
  deleteTodo, 
  subscribeToTodos, 
  toggleTodoComplete 
} from '../services/firebase/todoService';
import { isFirebaseReady } from '../services/firebase/config';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>({});
  const [sort, setSort] = useState<TodoSort>({ field: 'createdAt', direction: 'desc' });
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [connectionRetries, setConnectionRetries] = useState(0);

  // Firebase 준비 상태 확인
  useEffect(() => {
    const checkFirebaseStatus = () => {
      const ready = Boolean(isFirebaseReady());
      setFirebaseReady(ready);
      
      if (!ready && connectionRetries < 5) {
        // Firebase가 준비되지 않은 경우 최대 5번까지 재시도
        setTimeout(() => {
          setConnectionRetries(prev => prev + 1);
          checkFirebaseStatus();
        }, 2000); // 2초마다 재시도
      } else if (!ready && connectionRetries >= 5) {
        setError('Firebase 연결에 실패했습니다. 페이지를 새로고침해주세요.');
        setLoading(false);
      }
    };

    checkFirebaseStatus();
  }, [connectionRetries]);

  // Firebase 실시간 구독 설정
  useEffect(() => {
    if (!firebaseReady) {
      setLoading(true);
      return;
    }

    console.log('🔄 Firebase 구독 시작...');
    const unsubscribe = subscribeToTodos((newTodos) => {
      console.log('✅ Firebase에서 데이터 수신:', newTodos.length, '개');
      setTodos(newTodos);
      setLoading(false);
      setError(null);
    });

    return () => {
      console.log('🔄 Firebase 구독 해제...');
      unsubscribe();
    };
  }, [firebaseReady]);

  // 필터링된 Todo 목록
  const filteredTodos = useCallback(() => {
    let filtered = [...todos];

    // 우선순위 필터
    if (filter.priority) {
      filtered = filtered.filter(todo => todo.priority === filter.priority);
    }

    // 상태 필터
    if (filter.status) {
      filtered = filtered.filter(todo => todo.status === filter.status);
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
      if (!firebaseReady) {
        throw new Error('Firebase가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      }
      
      setError(null);
      await addTodo(todoInput);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '할 일을 추가하는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('할 일 추가 실패:', errorMessage);
      throw err;
    }
  }, [firebaseReady]);

  // 할 일 수정
  const editTodo = useCallback(async (id: string, updates: UpdateTodoInput) => {
    try {
      if (!firebaseReady) {
        throw new Error('Firebase가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      }
      
      setError(null);
      await updateTodo(id, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '할 일을 수정하는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('할 일 수정 실패:', errorMessage);
      throw err;
    }
  }, [firebaseReady]);

  // 할 일 삭제
  const removeTodo = useCallback(async (id: string) => {
    try {
      if (!firebaseReady) {
        throw new Error('Firebase가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      }
      
      setError(null);
      await deleteTodo(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '할 일을 삭제하는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('할 일 삭제 실패:', errorMessage);
      throw err;
    }
  }, [firebaseReady]);

  // 완료 상태 토글
  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    try {
      if (!firebaseReady) {
        throw new Error('Firebase가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      }
      
      setError(null);
      await toggleTodoComplete(id, completed);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '완료 상태를 변경하는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('완료 상태 변경 실패:', errorMessage);
      throw err;
    }
  }, [firebaseReady]);

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
    const completed = todos.filter(todo => todo.status === 'completed').length;
    const inProgress = todos.filter(todo => todo.status === 'in-progress').length;
    const todo = todos.filter(todo => todo.status === 'todo').length;
    const highPriority = todos.filter(todo => todo.priority === 1 && todo.status !== 'completed').length;

    return { total, completed, inProgress, todo, highPriority };
  }, [todos]);

  // 연결 재시도
  const retryConnection = useCallback(() => {
    setConnectionRetries(0);
    setError(null);
    setLoading(true);
  }, []);

  return {
    todos: filteredTodos(),
    loading: loading || !firebaseReady,
    error,
    filter,
    sort,
    stats: stats(),
    firebaseReady,
    createTodo,
    editTodo,
    removeTodo,
    toggleComplete,
    updateFilter,
    updateSort,
    clearError: () => setError(null),
    retryConnection
  };
}; 