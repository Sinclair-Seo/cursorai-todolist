import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'demo-app-id'
};

// Firebase 초기화
let app: FirebaseApp | undefined;
let db: Firestore | undefined;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase 초기화 에러:', error);
  // 개발 환경에서는 더미 데이터를 사용할 수 있도록 설정
  if (process.env.NODE_ENV === 'development') {
    console.warn('Firebase 설정이 없습니다. 개발 모드에서는 더미 데이터를 사용합니다.');
  }
}

export { db };
export default app; 