# CursorAI TodoList

Firebase를 활용한 React, TypeScript, TailwindCSS 기반의 현대적인 Todo List 웹 애플리케이션입니다.

## 🚀 주요 기능

- ✅ **CRUD 작업**: 할 일 생성, 조회, 수정, 삭제
- 🔄 **실시간 동기화**: Firebase Firestore를 통한 실시간 데이터 동기화
- 🎯 **우선순위 관리**: 3단계 우선순위 시스템 (높음, 보통, 낮음)
- 📱 **반응형 디자인**: 모바일과 데스크톱에서 최적화된 UI
- 🎨 **모던 UI**: TailwindCSS를 활용한 아름다운 디자인
- ⚡ **TypeScript**: 타입 안전성을 보장하는 개발 환경

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth (준비 중)
- **Deployment**: Firebase Hosting (준비 중)

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/cursorai-todolist.git
cd cursorai-todolist
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 Firebase 설정을 추가하세요:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. 개발 서버 실행
```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 🏗️ 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── common/         # 공통 컴포넌트 (Button, Input)
│   ├── Error/          # 에러 처리 컴포넌트
│   ├── Loading/        # 로딩 컴포넌트
│   ├── PrioritySelector/ # 우선순위 선택 컴포넌트
│   ├── TodoForm/       # 할 일 입력 폼
│   ├── TodoItem/       # 개별 할 일 아이템
│   └── TodoList/       # 할 일 목록
├── hooks/              # 커스텀 훅
├── services/           # Firebase 서비스
│   └── firebase/       # Firebase 설정 및 서비스
├── types/              # TypeScript 타입 정의
└── App.tsx             # 메인 애플리케이션 컴포넌트
```

## 🔧 주요 컴포넌트

### TodoForm
- 할 일 제목과 설명 입력
- 우선순위 선택 (높음/보통/낮음)
- 유효성 검사 및 에러 처리

### TodoList
- 할 일 목록 표시
- 실시간 데이터 동기화
- 로딩 및 에러 상태 처리

### TodoItem
- 개별 할 일 표시
- 완료 상태 토글
- 수정 및 삭제 기능

## 🎨 UI/UX 특징

- **직관적인 인터페이스**: 사용자가 쉽게 이해할 수 있는 UI
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원
- **성능 최적화**: React.memo와 useCallback을 활용한 렌더링 최적화

## 🔒 보안

- Firebase 보안 규칙을 통한 데이터 보호
- 환경 변수를 통한 민감한 정보 관리
- 입력 데이터 검증 및 sanitization

## 🚀 배포

### Firebase Hosting (권장)
```bash
npm run build
firebase deploy
```

### Netlify
```bash
npm run build
# build 폴더를 Netlify에 업로드
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**CursorAI TodoList** - 효율적인 할 일 관리를 위한 현대적인 웹 애플리케이션
