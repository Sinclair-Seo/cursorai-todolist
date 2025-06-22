# CursorAI TodoList

React와 Firebase를 사용한 현대적인 Todo List 애플리케이션입니다.

## 🚀 주요 기능

- ✅ Todo 항목 추가/수정/삭제
- 🎯 우선순위 설정 (높음/보통/낮음)
- 📊 상태별 관리 (할 일/진행 중/완료)
- 🔄 드래그 앤 드롭으로 상태 변경
- 📱 반응형 디자인
- 🔥 Firebase 실시간 데이터베이스 연동
- 🎨 TailwindCSS를 활용한 모던 UI

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth (준비 중)
- **Deployment**: Firebase Hosting

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/[your-username]/cursorai-todolist.git
cd cursorai-todolist
```

### 2. 의존성 설치
```bash
npm install
```

### 3. Firebase 설정
1. Firebase Console에서 새 프로젝트 생성: **"CursorAI ToDo List App"**
2. Firestore Database 활성화
3. `.env` 파일 생성 후 Firebase 설정 추가:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=cursorai-todolist.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=cursorai-todolist
REACT_APP_FIREBASE_STORAGE_BUCKET=cursorai-todolist.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. 개발 서버 실행
```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 🏗️ 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/         # 공통 컴포넌트 (Button, Input)
│   ├── TodoForm/       # Todo 입력 폼
│   ├── TodoItem/       # 개별 Todo 항목
│   ├── TodoList/       # Todo 목록
│   ├── KanbanBoard/    # 칸반 보드
│   ├── PrioritySelector/ # 우선순위 선택기
│   ├── Loading/        # 로딩 컴포넌트
│   └── Error/          # 에러 컴포넌트
├── hooks/              # 커스텀 훅
├── services/           # Firebase 서비스
├── types/              # TypeScript 타입 정의
└── App.tsx             # 메인 앱 컴포넌트
```

## 🎯 사용 방법

1. **Todo 추가**: 상단 입력창에 할 일을 입력하고 우선순위를 선택한 후 추가
2. **상태 변경**: 드래그 앤 드롭으로 Todo를 다른 상태로 이동
3. **수정/삭제**: 각 Todo 항목의 편집/삭제 버튼 사용
4. **우선순위 필터링**: 상단 필터 버튼으로 우선순위별 정렬

## 🔧 개발 스크립트

- `npm start`: 개발 서버 실행
- `npm test`: 테스트 실행
- `npm run build`: 프로덕션 빌드
- `npm run eject`: 설정 추출 (주의: 되돌릴 수 없음)

## 🚀 배포

### Firebase Hosting 배포
```bash
npm run build
firebase deploy
```

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**CursorAI TodoList** - 효율적인 할 일 관리를 위한 현대적인 웹 애플리케이션
