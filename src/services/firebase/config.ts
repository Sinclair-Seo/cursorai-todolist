// Firebase 앱 초기화만 import (가장 가벼운 import)
import { initializeApp, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyB5QwdMBKdKv7vin8_5476bmj-tjgggfpM',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'fastcampus-todo-list.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'fastcampus-todo-list',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'fastcampus-todo-list.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '469956581840',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:469956581840:web:301bc3f3ac0763528b81d5'
};

// Firebase 초기화 (lazy loading 적용)
let app: FirebaseApp | undefined;
let db: any = undefined;

console.log('Firebase 설정 로드 중...', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey
});

try {
  // Firebase 앱이 이미 초기화되었는지 확인
  if (!app) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase 앱 초기화 성공');
  }
  
  console.log('Firebase 초기화 완료:', firebaseConfig.projectId);
} catch (error) {
  console.error('Firebase 초기화 에러:', error);
  
  // 더 자세한 에러 정보 출력
  if (error instanceof Error) {
    console.error('에러 메시지:', error.message);
    console.error('에러 스택:', error.stack);
  }
  
  // 개발 환경에서는 더미 데이터를 사용할 수 있도록 설정
  if (process.env.NODE_ENV === 'development') {
    console.warn('Firebase 설정이 없습니다. 개발 모드에서는 더미 데이터를 사용합니다.');
  }
}

// 동적 import를 사용한 Firestore 초기화 (번들 크기 최적화)
const getFirestoreInstance = async () => {
  if (!db) {
    if (!app) {
      throw new Error('Firebase 앱이 초기화되지 않았습니다.');
    }
    // 동적 import로 Firestore 로드 (코드 스플리팅)
    const { getFirestore } = await import('firebase/firestore');
    db = getFirestore(app);
    console.log('Firestore 동적 로드 성공');
  }
  return db;
};

// Firebase 연결 상태 확인 함수 (lazy loading)
export const checkFirebaseConnection = async () => {
  if (!app) {
    throw new Error('Firebase 앱이 초기화되지 않았습니다. 설정을 확인해주세요.');
  }
  const firestoreDb = await getFirestoreInstance();
  return { app, db: firestoreDb };
};

export { getFirestoreInstance };
export default app; 