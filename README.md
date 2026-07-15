# Cheat F/T frontend

가짜뉴스 검증, 출처 신빙성 확인, 추천 알고리즘 편향 분석을 위한 React 프런트엔드입니다. 현재 배포 API를 우선 호출합니다. 조회 화면은 API가 없거나 실패하면 기존 목업 데이터로 유지되고, 로그인/회원가입/게시글 등록처럼 서버 반영이 필요한 동작은 실패 시 오류를 보여줍니다.

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
VITE_API_BASE_URL=https://cheatft.leegeon.com/api
```

환경변수가 있으면 백엔드 API를 우선 호출합니다. 조회 화면은 API가 없거나 실패하면 기존 목업 데이터로 유지되고, 로그인/회원가입/게시글 등록은 실패 시 오류를 보여줍니다. API 호출 공통 처리는 `src/services/apiClient.js`, 도메인별 호출 함수는 `src/services/cheatftApi.js`에 있습니다.

주의: 현재 `../cheatft_api`는 Express/PostgreSQL/JWT 기반 백엔드 구현체와 API 명세를 함께 포함합니다. 로컬 실행에는 PostgreSQL 접속 정보, JWT secret, 네이버 API 키 등 환경변수가 필요합니다. 프론트 로컬 개발의 기본 API 주소는 `https://cheatft.leegeon.com/api`입니다.

현재 백엔드는 `summary/reports/posts/profile` 계열은 dummy controller 응답이고, `auth/checks/analysis` 계열은 실제 라우트/서비스/DB 흐름을 사용합니다. 배포 API 기준 로그인은 `UserModel.findByEmail is not a function` 오류가 관측되어 인증 흐름이 정상 동작하지 않을 수 있습니다.

## API 연동 상태

2026-07-15 기준 다음 화면은 백엔드 명세 경로를 호출합니다.

| 화면 | 호출 API | fallback |
|---|---|---|
| 홈 | `GET /summary` | 기존 홈 통계/최신 팩트체크 목업 |
| 검증하기 | `POST /checks`, `GET /checks/{id}`, 기본 화면 `GET /summary` | API/목업 출처 배지 표시, API 성공 시 기사 배열만 사용, 실패 시 기존 검색 결과/최신 팩트체크 목업 |
| 알고리즘 분석 | `POST /analysis`, `GET /analysis/{id}` | 보호 라우트, 기존 분석 결과 목업 |
| 리포트 | `GET /reports?keyword=&date=&score=&page=&limit=` | 기존 리포트 목록 목업 |
| 커뮤니티 | `GET /posts?category=&keyword=&page=&limit=` | 기존 게시글/참여 현황 목업 |
| 글 작성 | `POST /posts` | 실패 시 오류, 임시 저장 가능 |
| 로그인 | `POST /login` | 실패 시 오류 |
| 회원가입 | `POST /signup` | 성공 후 로그인 화면 이동, 실패 시 오류 |
| 마이페이지 | `GET /profile` | 기존 개인 분석 목업 |

주의: `VITE_API_BASE_URL`에 `/api`가 포함되어 있으므로 프론트 코드에서는 `/summary`, `/login`처럼 호출합니다.

## 연동 확인 방법

1. `.env.local`에 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`를 설정합니다.
2. `.env.local`을 새로 만들거나 수정했다면 Vite dev server를 재시작합니다.
3. `npm run dev`로 프론트를 실행합니다.
4. 브라우저 개발자도구 Network 탭에서 `summary`, `checks`, `analysis`, `reports`, `posts`, `profile`, `login`, `signup` 요청을 확인합니다.

조회 API 요청이 실패해도 화면은 fallback 목업으로 유지될 수 있으므로, 실제 연동 여부는 Network 탭의 요청/응답 상태로 확인하는 것이 가장 정확합니다. 로그인, 회원가입, 게시글 등록은 실패 시 오류 메시지를 보여줍니다.

## 주요 경로

- `/`: 홈
- `/search?q=검색어`: 팩트체크 검색
- `/article/:id`: 뉴스 상세
- `/algo`: 알고리즘 분석, 로그인 필요
- `/report`: 검증 리포트
- `/community`: 커뮤니티
- `/community/write`: 글 작성 및 탭 단위 임시 저장
- `/community/:id`: 게시글 상세
- `/login`, `/signup`, `/mypage`: 사용자 화면

백엔드 협의 전에 `docs/backend-contract.md`를 우선 확인하고, 초기 제안 메모가 필요할 때만 `docs/backend-handoff.md`를 확인하세요.

## 현재 제약

- 홈, 검증하기, 알고리즘 분석, 리포트, 커뮤니티, 마이페이지는 API 응답을 우선 사용하고 실패 시 목업으로 fallback합니다.
- 홈 최신 팩트체크와 검증하기 기본 화면의 최신 팩트체크는 `GET /summary`의 `recentChecks`를 사용합니다.
- 검증하기 결과는 `백엔드 API` 또는 `프론트 목업` 배지로 데이터 출처를 표시합니다.
- 검증하기 API 요청이 성공하면 API의 `articles` 배열만 사용합니다. `articles`가 비어 있으면 프론트 예시를 섞지 않고 빈 상태를 표시합니다. 다른 조회 화면도 API 성공 후 빈 배열을 목업으로 덮지 않습니다.
- 2026-07-15 확인 기준 `GET /summary`와 `GET /profile`은 200 응답이 관측되었습니다. 기존 더미 `GET /checks/452`는 새 DB 기반 라우트에서는 404가 관측되었습니다.
- 리포트 목록은 `keyword`, `date`, `score`, `page`, `limit` query parameter를 `GET /reports`에 전달합니다.
- 커뮤니티 목록은 `category`, `keyword`, `page`, `limit` query parameter를 `GET /posts`에 전달합니다.
- 로그인은 `/login` 응답의 accessToken을 `localStorage`에 저장하고, 이후 API 요청에 Bearer 토큰으로 첨부합니다. accessToken이 없으면 실패로 처리합니다.
- 회원가입은 `/signup`을 호출하지만 현재 명세에는 accessToken이 없어 성공 후 로그인 화면으로 이동합니다.
- 게시물 등록은 `/posts`로 전송합니다. 실패하면 오류를 보여주고 임시 저장은 유지됩니다.
- 마이페이지는 `/profile` 응답의 사용자 정보, 기여 현황, 성향 분포, 신뢰도 분포, 관심 주제, 뱃지, 최근 활동, 월간 요약을 표시합니다.
- 현재 Windows/Node 24.13 환경에서는 Vite 프로덕션 빌드가 네이티브 예외로 종료됩니다. Node 22 LTS에서 설치 후 빌드하는 구성을 권장합니다.
