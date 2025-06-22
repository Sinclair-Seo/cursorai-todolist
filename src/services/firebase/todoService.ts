// Firestore 함수 import
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  type Timestamp 
} from 'firebase/firestore';
import { checkFirebaseConnection } from './config';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../../types/todo';

// Firestore 컬렉션 이름
const COLLECTION_NAME = 'todos';

// Firestore Timestamp를 Date로 변환하는 헬퍼 함수
const convertTimestamp = (timestamp: Timestamp | null | undefined): Date => {
  if (!timestamp) {
    return new Date(); // null 또는 undefined인 경우 현재 시간 반환
  }
  
  try {
    return timestamp.toDate();
  } catch (error) {
    console.warn('타임스탬프 변환 실패, 현재 시간 사용:', error);
    return new Date();
  }
};

// Firestore 문서를 Todo 객체로 변환하는 헬퍼 함수
const convertFirestoreDoc = (doc: any): Todo => {
  try {
    const data = doc.data();
    if (!data) {
      throw new Error('문서 데이터가 없습니다.');
    }

    return {
      id: doc.id,
      title: data.title || '',
      description: data.description || '',
      priority: data.priority || 2,
      completed: Boolean(data.completed),
      status: data.status || 'todo', // 기본값 설정
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt)
    };
  } catch (error) {
    console.error('문서 변환 실패:', error, doc.id);
    // 기본 Todo 객체 반환
    return {
      id: doc.id,
      title: '오류가 발생한 항목',
      description: '데이터를 불러오는 중 오류가 발생했습니다.',
      priority: 2,
      completed: false,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
};

// 할 일 추가 (Create)
export const addTodo = async (todoInput: CreateTodoInput): Promise<string> => {
  try {
    const { db } = await checkFirebaseConnection();
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...todoInput,
      status: todoInput.status || 'todo', // 기본값 설정
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding todo: ', error);
    throw new Error('할 일을 추가하는 중 오류가 발생했습니다.');
  }
};

// 할 일 조회 (Read) - 실시간 구독
export const subscribeToTodos = (callback: (todos: Todo[]) => void) => {
  let unsubscribe: (() => void) | null = null;
  
  const setupSubscription = async () => {
    try {
      const { db } = await checkFirebaseConnection();
      
      const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy('createdAt', 'desc')
      );
      
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todos: Todo[] = [];
        querySnapshot.forEach((doc) => {
          try {
            const todo = convertFirestoreDoc(doc);
            todos.push(todo);
          } catch (error) {
            console.error('Error converting document:', error, doc.id);
            // 에러가 발생한 문서는 건너뛰고 계속 진행
          }
        });
        callback(todos);
      }, (error) => {
        console.error('Error fetching todos: ', error);
        // 에러 발생 시 빈 배열로 콜백 호출
        callback([]);
      });
    } catch (error) {
      console.error('Firebase connection error:', error);
      // Firebase 연결 실패 시 빈 배열로 콜백 호출
      callback([]);
    }
  };

  // 초기 구독 설정
  setupSubscription();

  // cleanup 함수 반환
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// 할 일 수정 (Update)
export const updateTodo = async (id: string, updates: UpdateTodoInput): Promise<void> => {
  try {
    const { db } = await checkFirebaseConnection();
    
    const todoRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating todo: ', error);
    throw new Error('할 일을 수정하는 중 오류가 발생했습니다.');
  }
};

// 할 일 삭제 (Delete)
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    const { db } = await checkFirebaseConnection();
    
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting todo: ', error);
    throw new Error('할 일을 삭제하는 중 오류가 발생했습니다.');
  }
};

// 완료 상태 토글
export const toggleTodoComplete = async (id: string, completed: boolean): Promise<void> => {
  try {
    await updateTodo(id, { completed });
  } catch (error) {
    console.error('Error toggling todo completion: ', error);
    throw new Error('완료 상태를 변경하는 중 오류가 발생했습니다.');
  }
}; 