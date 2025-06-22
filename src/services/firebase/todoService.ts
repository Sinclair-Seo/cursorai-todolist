// 동적 import를 사용한 Firestore 함수 로드 (번들 크기 최적화)
import { checkFirebaseConnection } from './config';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../../types/todo';

// Firestore 컬렉션 이름
const COLLECTION_NAME = 'todos';

// Firestore Timestamp를 Date로 변환하는 헬퍼 함수
const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) {
    return new Date(); // null인 경우 현재 시간 반환
  }
  return timestamp.toDate();
};

// Firestore 문서를 Todo 객체로 변환하는 헬퍼 함수
const convertFirestoreDoc = (doc: any): Todo => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    priority: data.priority || 2,
    completed: data.completed || false,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt)
  };
};

// 할 일 추가 (Create) - 동적 import 사용
export const addTodo = async (todoInput: CreateTodoInput): Promise<string> => {
  try {
    const { db: firestoreDb } = await checkFirebaseConnection();
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    
    const docRef = await addDoc(collection(firestoreDb, COLLECTION_NAME), {
      ...todoInput,
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

// 할 일 조회 (Read) - 실시간 구독 (동적 import 사용)
export const subscribeToTodos = (callback: (todos: Todo[]) => void) => {
  let unsubscribe: (() => void) | null = null;
  
  const setupSubscription = async () => {
    try {
      const { db: firestoreDb } = await checkFirebaseConnection();
      const { collection, query, orderBy, onSnapshot } = await import('firebase/firestore');
      
      const q = query(
        collection(firestoreDb, COLLECTION_NAME), 
        orderBy('createdAt', 'desc')
      );
      
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todos: Todo[] = [];
        querySnapshot.forEach((doc) => {
          try {
            todos.push(convertFirestoreDoc(doc));
          } catch (error) {
            console.error('Error converting document:', error, doc.id);
            // 에러가 발생한 문서는 건너뛰고 계속 진행
          }
        });
        callback(todos);
      }, (error) => {
        console.error('Error fetching todos: ', error);
        throw new Error('할 일을 불러오는 중 오류가 발생했습니다.');
      });
    } catch (error) {
      console.error('Firebase connection error:', error);
      // Firebase 연결 실패 시 빈 배열로 콜백 호출
      callback([]);
    }
  };
  
  setupSubscription();
  
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// 할 일 수정 (Update) - 동적 import 사용
export const updateTodo = async (id: string, updates: UpdateTodoInput): Promise<void> => {
  try {
    const { db: firestoreDb } = await checkFirebaseConnection();
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    
    const todoRef = doc(firestoreDb, COLLECTION_NAME, id);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating todo: ', error);
    throw new Error('할 일을 수정하는 중 오류가 발생했습니다.');
  }
};

// 할 일 삭제 (Delete) - 동적 import 사용
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    const { db: firestoreDb } = await checkFirebaseConnection();
    const { doc, deleteDoc } = await import('firebase/firestore');
    
    await deleteDoc(doc(firestoreDb, COLLECTION_NAME, id));
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