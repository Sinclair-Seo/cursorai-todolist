// Firebase 앱과 Firestore 초기화
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Firebase 설정 (환경 변수 또는 기본값 사용)
const firebaseConfig = {
  apiKey: "AIzaSyB5QwdMBKdKv7vin8_5476bmj-tjgggfpM",
  authDomain: "fastcampus-todo-list.firebaseapp.com",
  projectId: "fastcampus-todo-list",
  storageBucket: "fastcampus-todo-list.firebasestorage.app",
  messagingSenderId: "469956581840",
  appId: "1:469956581840:web:301bc3f3ac0763528b81d5"
};

// Firebase 초기화 상태
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let isInitialized = false;
let isInitializing = false;
let initializationError: Error | null = null;
let initializationPromise: Promise<{ app: FirebaseApp; db: Firestore }> | null = null;

console.log('Firebase 설정 로드 중...', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
  nodeEnv: process.env.NODE_ENV
});

// Firebase 초기화 함수 (Promise 기반)
const initializeFirebase = async (): Promise<{ app: FirebaseApp; db: Firestore }> => {
  // 이미 초기화된 경우
  if (isInitialized && app && db) {
    return { app, db };
  }

  // 이미 초기화 중인 경우 기존 Promise 반환
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }

  // 초기화 시작
  isInitializing = true;
  initializationError = null;

  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      console.log('🔄 Firebase 초기화 시작...');

      // Firebase 앱 초기화
      if (!app) {
        app = initializeApp(firebaseConfig);
        console.log('✅ Firebase 앱 초기화 성공');
      }

      // Firestore 초기화
      if (!db) {
        db = getFirestore(app);
        console.log('✅ Firestore 초기화 성공');
      }

      // 초기화 완료
      isInitialized = true;
      isInitializing = false;
      console.log('✅ Firebase 전체 초기화 완료:', firebaseConfig.projectId);
      
      resolve({ app, db });
    } catch (error) {
      console.error('❌ Firebase 초기화 에러:', error);
      initializationError = error as Error;
      isInitializing = false;
      
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        console.error('에러 스택:', error.stack);
      }
      
      reject(error);
    }
  });

  return initializationPromise;
};

// Firebase 연결 상태 확인 함수
export const checkFirebaseConnection = async (): Promise<{ app: FirebaseApp; db: Firestore }> => {
  try {
    if (initializationError) {
      throw new Error(`Firebase 초기화 실패: ${initializationError.message}`);
    }
    
    if (!isInitialized) {
      return await initializeFirebase();
    }
    
    if (!app || !db) {
      throw new Error('Firebase 인스턴스가 없습니다.');
    }
    
    return { app, db };
  } catch (error) {
    console.error('Firebase 연결 확인 실패:', error);
    throw new Error('Firebase가 초기화되지 않았습니다. 설정을 확인해주세요.');
  }
};

// Firebase 초기화 상태 확인
export const isFirebaseReady = (): boolean => {
  return isInitialized && !initializationError && !!app && !!db;
};

// Firebase 초기화 시도 (비동기)
const initializeFirebaseAsync = async () => {
  try {
    await initializeFirebase();
  } catch (error) {
    console.warn('Firebase 초기화 실패, 나중에 다시 시도됩니다:', error);
  }
};

// 앱 시작 시 Firebase 초기화 시도
initializeFirebaseAsync();

export { db };
export default app; 