# Cheat F/T frontend

가짜뉴스 검증, 출처 신빙성 확인, 추천 알고리즘 편향 분석을 위한 React 프런트엔드입니다. 현재 화면 데이터는 목업이며 백엔드 연동 전 단계입니다.

## 실행 환경

- Node.js 22 LTS 권장 (`.nvmrc` 제공)
- npm 10 이상

Windows에서 `fnm`을 처음 설치한 뒤에는 PowerShell을 다시 열고 다음 명령으로 이 프로젝트의 Node 버전을 활성화합니다.

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
fnm use
node --version
```

`node --version`이 `v22`로 시작하는지 확인합니다.

```bash
npm install
npm run dev
```

Vite 실행 후 `o`를 누르면 브라우저가 열립니다.

## 확인 명령

```bash
npm run lint
npm test
npm run build
npm run check
```

`npm run check`는 ESLint, 단위 테스트, 프로덕션 빌드를 순서대로 실행합니다.

## 환경변수

`.env.example`을 `.env.local`로 복사한 뒤 백엔드 주소를 설정합니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8080/api
```

환경변수가 없으면 현재 목업 화면만 동작합니다. API 호출 공통 처리는 `src/services/apiClient.js`에 준비되어 있습니다.

## 주요 경로

- `/`: 홈
- `/search?q=검색어`: 팩트체크 검색
- `/article/:id`: 뉴스 상세
- `/algo`: 알고리즘 분석
- `/report`: 검증 리포트
- `/community`: 커뮤니티
- `/community/write`: 글 작성 및 탭 단위 임시 저장
- `/community/:id`: 게시글 상세
- `/login`, `/signup`, `/mypage`: 사용자 화면

백엔드 협의 전에 `docs/backend-handoff.md`를 확인하세요.

## 현재 제약

- 검색 결과, 리포트, 커뮤니티 데이터는 컴포넌트 내부 목업입니다.
- 로그인과 회원가입은 UI 검증만 수행하며 실제 인증이 아닙니다.
- 게시물 등록은 API 계약 전까지 비활성화되어 있습니다.
- 현재 Windows/Node 24.13 환경에서는 Vite 프로덕션 빌드가 네이티브 예외로 종료됩니다. Node 22 LTS에서 설치 후 빌드하는 구성을 권장합니다.
