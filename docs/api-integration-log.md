# API 연동 작업 로그

마지막 갱신: 2026-07-19
대상: `cheatft_web`
백엔드 폴더 수정 여부: 최종 상태 기준 수정하지 않음. 2026-07-16 실수로 인증 컨트롤러를 수정했으나 즉시 원상복구함.

## 작업 목적

`cheatft_api/README.md`에 정리된 더미 API 명세와 배포 더미 API를 기준으로 `cheatft_web` 주요 화면이 실제 API를 우선 호출하도록 연결했다. 초기 연동 당시 조회 화면은 API 서버가 없거나 요청이 실패하면 기존 목업 데이터로 화면을 유지했다. 2026-07-15 이후 홈/검증하기는 프론트 더미 fallback을 제거하고 백엔드 API 응답만 표시한다. 로그인, 회원가입, 게시글 등록처럼 서버 반영이 필요한 동작은 실패 시 오류를 보여준다.

2026-07-12 추가 작업으로 검증하기 검색 결과는 백엔드 API 결과와 프론트 더미데이터를 구분해서 함께 보여주도록 바뀌었다. 로그인/회원가입은 입력 검증과 보호 라우트 흐름을 보강했다.

2026-07-15 추가 작업으로 실제 백엔드 코드의 `PRESS_MAPPING`, 인증 요구사항, 배포 API 관측값을 반영해 프론트 검증/알고리즘 화면을 다시 조정했다. 이후 이번 창에서 홈/검증하기의 프론트 더미 fallback, URL 링크 검색, 마이페이지 화면을 제거했고, 검증하기 카드 클릭은 뉴스 상세로 연결했다.

2026-07-16 추가 작업으로 배포 프론트가 여전히 Vite dev HTML을 서빙하는 문제를 다시 확인하고, 운영 배포 점검법을 `cheatft_web/README.md`에 추가했다. 백엔드 pull 후 user model 복구를 읽기 전용으로 확인했고, 로그인/회원가입 흐름을 실제 배포 API 계정으로 검증했다. 실수로 백엔드 컨트롤러를 수정했으나 사용자 요청으로 원상복구했으며, 이후 원칙은 `cheatft_api` 절대 수정 금지다.

2026-07-16 추가 작업으로 로그인 후 오른쪽 상단에 현재 사용자 닉네임을 표시하도록 프론트 세션 저장을 보강했다. 또한 브라우저 탭 제목을 `Cheat F/T`로 바꾸고, 사용자가 제공한 Cheat F/T 돋보기 이미지를 흰 배경이 투명한 `public/favicon.png`로 만들어 주소창 아이콘에 적용했다.

2026-07-19 추가 작업으로 신뢰도 분석 화면의 분석 API 호출 트리거를 질문 입력 → 추천 키워드 칩 선택 방식으로 바꿨다. 추천 키워드는 프론트에서 생성하며, 사용자가 키워드를 누를 때 기존 `runAnalysis()` 흐름으로 `POST /analysis`, `GET /analysis/{id}`를 호출한다. 화면 우선순위는 `AI 주요 인사이트`와 `신뢰도 분석 요약`을 먼저, 관련 뉴스/반박 기사 탭을 그 아래로 배치하도록 바꿨다. 이후 리포트 관련 내보내기/다운로드 버튼과 `총 검색 시간` 통계도 제거했다.

## 2026-07-19 신뢰도 분석 화면 흐름 조정

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `AlgoView.jsx`에서 분석 API 호출 트리거를 단일 입력 버튼에서 질문 입력 → 추천 키워드 칩 선택 방식으로 바꿨다.
- 추천 키워드는 프론트에서 생성하며, 사용자가 키워드를 누를 때 기존 `runAnalysis()` 흐름으로 `POST /analysis`, `GET /analysis/{id}`를 호출한다.
- 화면 우선순위는 `AI 주요 인사이트`와 `신뢰도 분석 요약`을 먼저, 관련 뉴스/반박 기사 탭을 그 아래로 배치하도록 바꿨다.
- `AlgoView.jsx`의 `분석 리포트 다운로드` 버튼을 제거했다.
- 상단 nav의 `리포트 내보내기`, `ReportView.jsx`의 `총 검색 시간`, 상세 `전체 요약 다운로드` 버튼을 제거했다. 리포트 API 호출 방식은 바꾸지 않았다.
- `/community` 전용 상단바 버튼 분기를 제거해 `/report`와 같은 전역 상단바를 쓰게 했다. 커뮤니티 `글 작성하기`와 `정정 요청하기` 버튼은 커뮤니티 화면 내부에서 `/community/write`로 이동한다.
- 검증: `npm run lint` 통과.

## 핵심 설계

- `.env.local`의 `VITE_API_BASE_URL`을 API 기본 URL로 사용한다.
- 현재 권장 값은 `https://cheatft.leegeon.com/api`이다.
- 기본 URL에 `/api`가 포함되어 있으므로 프론트 내부에서는 `/summary`, `/login`, `/posts`처럼 호출한다.
- 백엔드 응답 래핑 `{ status, message, data }`는 `apiData()`에서 `data` 중심으로 푼다.
- 로그인 accessToken은 `localStorage`의 `cheat-ft-access-token`에 저장한다.
- 저장된 토큰은 이후 요청에 `Authorization: Bearer ...`로 첨부한다.
- `/community/write`, `/algo`는 로그인 필요 화면으로 처리한다. `/mypage` 화면/라우트는 2026-07-15에 제거됐다.
- 로컬 `cheatft_api`는 현재 Express/PostgreSQL/JWT 기반 백엔드 구현체이다. 프론트 작업 중에는 읽기 전용 확인만 가능하며 수정하지 않는다.
- 배포 API는 `https://cheatft.leegeon.com/api`에서 응답한다.
- `summary/reports/posts/profile`은 dummy controller 응답이고, `checks/analysis/auth`는 실제 라우트/서비스/DB 흐름을 사용한다.

## 2026-07-16 배포/인증 추가 반영

- 배포 프론트 문제:
  - `https://cheatft.leegeon.com/`은 여전히 Vite dev HTML(`/@vite/client`, `/src/main.jsx`, `/@react-refresh`)을 서빙한다.
  - `/src/services/apiClient.js`는 404다.
  - `/assets/index-*.js`, `/assets/index-*.css`도 실제 정적 파일이 아니라 HTML fallback으로 내려오는 상태를 확인했다.
  - 운영 서버는 `cheatft_web` 프로젝트 루트가 아니라 `cheatft_web/dist`를 web root로 서빙해야 한다.
- `cheatft_web/README.md`:
  - `운영 배포` 섹션을 추가했다.
  - 루트 HTML에 `/@vite/client`가 보이면 개발용 HTML 배포 상태라고 명시했다.
  - `/assets/*.js` 응답이 `<!doctype html>`로 시작하면 SPA fallback 또는 web root 설정이 잘못된 상태라고 명시했다.
- 백엔드 인증 확인:
  - pull 이후 `cheatft_api/src/models/user.model.js`에 `findByEmail`, `createUser`, `findById`가 복구된 것을 확인했다.
  - 실수로 `cheatft_api/src/controllers/auth.controller.js`를 수정했으나 즉시 원상복구했다.
  - 앞으로 `cheatft_api`는 어떤 경우에도 수정하지 않고 읽기 전용으로만 확인한다.
  - 회원가입 성공 응답은 password hash를 노출하지 않는다.
- 프론트 로그인:
  - `cheatft_web/src/components/views/LoginView.jsx`에서 로그인 요청 전 password 앞뒤 공백을 trim한다.
  - 이메일은 기존처럼 trim한다.
  - `cheatft_web/src/services/apiClient.js`에 현재 사용자 정보 저장/조회/삭제 유틸을 추가했다.
  - `cheatft_web/src/services/cheatftApi.js`는 로그인 성공 시 `accessToken`과 함께 `nickname/email/userId` 후보를 `localStorage`에 저장한다.
  - `cheatft_web/src/App.jsx`는 로그인 후 오른쪽 상단에 닉네임을 표시하고, 로그아웃 시 토큰과 현재 사용자 정보를 함께 삭제한다.
- 브라우저 표시:
  - `cheatft_web/index.html`의 title을 `news-project`에서 `Cheat F/T`로 변경하고 `lang="ko"`를 적용했다.
  - 주소창 favicon은 `/favicon.png`를 사용한다.
  - `cheatft_web/public/favicon.png`는 사용자가 제공한 아이콘 이미지의 흰 배경을 투명 처리한 512x512 PNG다.
- 배포 API 테스트 계정:
  - 이메일: `codex.test.20260716@example.com`
  - 닉네임: `Codex테스트0716`
  - 비밀번호: `Test!20260716#Codex`
  - 생성 응답: `201`, `userId: 2`, `level: 1`, `user_title: 신규 사용자`
  - 로그인 응답: `200`, `data.accessToken` 수신 확인
  - `/api/me` 응답: `200`, 사용자 정보 조회 확인
- 로컬 프론트 확인:
  - `http://localhost:3001/src/services/apiClient.js`에 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`가 주입되는 것을 확인했다.
  - 로컬 로그인 폼은 `https://cheatft.leegeon.com/api/login`으로 `{ email, password }`를 전송한다.
  - 사용자가 실제 브라우저에서 위 테스트 계정으로 로그인 성공을 확인했다.
- 검증:
  - `cheatft_api`: `npm ci` 후 인증 모듈 로드 확인을 했으나, 이후 생성된 `node_modules/`를 삭제하고 백엔드 수정분을 원상복구했다.
  - `cheatft_web`: `npm run lint` 통과
  - `cheatft_web`: `npm test` 통과
  - `cheatft_web`: Codex 번들 Node로 `vite build` 통과
  - 일반 셸 Node의 `npm run build`는 기존 Vite/Node 네이티브 종료 이슈로 `41 modules transformed` 이후 exit 1 재현

## 추가/수정 파일

- `cheatft_web/src/services/apiClient.js`: `apiData`, accessToken 저장/조회/삭제, Bearer 토큰 자동 첨부 추가.
- `cheatft_web/src/services/cheatftApi.js`: 명세 기반 도메인 API 함수 신규 추가.
- `cheatft_web/src/App.jsx`: 저장된 accessToken 기반 로그인 초기 상태, 로그아웃 시 토큰 삭제, 상세 이동 id/article state 반영.
- `cheatft_web/src/components/views/*.jsx`: 홈, 검증하기, 알고리즘 분석, 리포트, 커뮤니티, 글 작성, 로그인, 회원가입에 API 우선 호출 적용. 마이페이지는 이후 제거됨.
- `cheatft_web/.env.local`: 로컬 개발용 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api` 설정.
- `cheatft_web/.env.example`: 예시 API URL을 배포 더미 API로 갱신.
- `cheatft_web/src/index.css`: `.form-error` 스타일 추가.

## 화면별 연결

| 화면 | 프론트 파일 | API |
|---|---|---|
| 홈 | `HomeView.jsx` | `GET /summary` |
| 검증하기 | `VerificationView.jsx` | `POST /checks`, `GET /checks/{id}` |
| 알고리즘 분석 | `AlgoView.jsx` | `POST /analysis`, `GET /analysis/{id}` |
| 리포트 | `ReportView.jsx` | `GET /reports?keyword=&date=&score=&page=&limit=` |
| 커뮤니티 | `CommunityView.jsx` | `GET /posts?category=&keyword=&page=&limit=` |
| 글 작성 | `CommunityWriteView.jsx` | `POST /posts` |
| 로그인 | `LoginView.jsx` | `POST /login` |
| 회원가입 | `SignupView.jsx` | `POST /signup` |

## 2026-07-05 추가 반영

- 홈의 최신 팩트체크 항목을 클릭하면 해당 제목으로 검증 화면으로 이동한다.
- 검색어 없이 `/search`에 들어간 검증하기 화면도 `GET /summary`의 `recentChecks`를 사용해 최신 팩트체크를 표시한다.
- 로그인은 `POST /login` 응답에 `accessToken`이 있을 때만 성공 처리한다. API 미설정이나 토큰 없는 응답은 오류로 보여준다.
- 회원가입은 `POST /signup` 성공 후 자동 로그인하지 않고 로그인 화면으로 이동한다. 현재 명세의 signup 응답에는 `accessToken`이 없기 때문이다.
- 커뮤니티 목록은 탭/카테고리/검색어/페이지 값을 `GET /posts` query parameter로 전달한다.
- 리포트 목록은 검색어/날짜/신뢰도 필터 값을 `GET /reports` query parameter로 전달한다.
- 당시 마이페이지는 `/profile` 응답의 `infoConsumptionBias`, `reliabilityDistribution`, `interestTopicsTop5`, `earnedBadges`, `recentActivities`, `monthlySummary`까지 화면에 반영했다. 2026-07-15 이후 마이페이지 화면/라우트는 제거됐다.

## 2026-07-10 추가 반영

- 배포 더미 API 주소 `https://cheatft.leegeon.com/api`를 `.env.local`과 `.env.example`에 반영했다.
- 백엔드 담당자 안내상 현재 API는 README dummy data를 반환하며 parameter 처리는 아직 구현되지 않았다.
- 검증하기 결과 화면에 상단 안내와 카드 배지로 `백엔드 API`/`프론트 목업` 출처를 표시한다.
- API 요청이 성공하면 API의 `articles` 배열만 표시한다.
- API 성공 후 `articles`가 비어 있으면 프론트 KBS/뉴스1 예시를 섞지 않고 빈 결과 상태를 표시한다.
- API 요청이 실패할 때만 기존 프론트 목업으로 fallback한다.
- 2026-07-10 확인 기준 `GET /summary`의 `recentChecks`는 1개다.
- 2026-07-10 확인 기준 `POST /checks`는 `checkId: 452`를 반환했고, `GET /checks/452`의 `articles` 배열은 1개다. 단, 응답 메타데이터의 `totalArticles`와 `pagination.totalItems`는 12다.

## 2026-07-12 추가 반영

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다. API 예시 구조 확인을 위해 `README.md`를 읽기만 했다.
- `apiClient.js`에서 HTTP status가 성공이어도 응답 body의 `status`가 400 이상이면 `ApiError`로 처리한다.
- 지난번 검증하기 화면에 적용했던 원칙을 다른 조회 화면에도 확장했다.
- API 요청 실패 또는 API 미설정일 때만 프론트 목업 fallback을 사용한다.
- API 요청이 성공했지만 응답 배열이 비어 있으면 프론트 목업을 섞지 않고 빈 상태를 보여준다.

추가/수정 파일:

- `cheatft_web/src/services/apiClient.js`
- `cheatft_web/src/components/views/HomeView.jsx`
- `cheatft_web/src/components/views/AlgoView.jsx`
- `cheatft_web/src/components/views/ReportView.jsx`
- `cheatft_web/src/components/views/CommunityView.jsx`
- `cheatft_web/src/components/views/MyPageView.jsx`

화면별 세부 내용:

- 홈: `GET /summary` 성공 시 `recentChecks`, `biasStatus.categories`가 빈 배열이어도 기본 예시로 덮지 않는다.
- 알고리즘 분석: API 성공/로딩/fallback 상태와 출처 안내를 분리하고, `relatedArticles`, `counterArticles`, `insights`가 빈 배열이면 빈 안내를 표시한다.
- 리포트: `GET /reports` 성공 시 `reports`가 빈 배열이면 빈 리포트 상태를 표시한다.
- 커뮤니티: `GET /posts` 성공 시 `posts`가 빈 배열이면 빈 게시글 상태를 표시한다.
- 마이페이지: 당시 `GET /profile`의 중첩 객체가 일부 빠져도 화면이 깨지지 않도록 기본값과 병합했다. 2026-07-15 이후 마이페이지 화면/라우트는 제거됐다.

## 2026-07-12 검증하기/인증 추가 반영

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 이 섹션의 검증하기 언론사 매핑/더미 혼합 방식은 2026-07-15 백엔드 코드 반영 작업으로 대체됐다.
- `VerificationView.jsx`
  - 당시 검색 결과에서 API가 성공하면 `백엔드 API 결과`와 `프론트 더미데이터`를 별도 섹션으로 함께 표시했다.
  - API 실패 시에는 프론트 더미데이터만 표시한다.
  - 각 카드에 `백엔드 API`/`프론트 더미` 배지, 출처 분류, 조회수, 연관도를 표시한다.
  - `전체 출처` 필터를 실제 동작하도록 바꿨다.
  - 당시 필터 옵션: `전체 출처`, `방송/통신사`, `종합지`, `경제지`, `인터넷/IT지`, `지역지`, `전문지/매거진`, `해외 통신사`, `프론트 더미`.
  - 네이버 언론사 목록의 실제 그룹은 `종합`, `방송/통신`, `경제`, `인터넷`, `IT`, `매거진`, `전문지`, `지역`, `포토`로 확인했다.
  - 화면 분류에서는 `인터넷+IT`, `매거진+전문지`, `포토=해외 통신사`로 묶었다.
  - `article.press`가 숫자이면 네이버 언론사 목록 순서 기준 0번부터 이름과 분류를 매핑한다.
  - `pressName`, `publisher`, `mediaName` 후보와 `KBS 뉴스` 같은 일부 별칭도 처리한다.
  - 정렬 옵션은 `최신순`, `조회수순`, `연관도순`이다. API에는 `sort` query parameter를 보내고, 프론트에서도 수신 데이터를 정렬한다.
- `LoginView.jsx`
  - 이메일 형식 검증, 제출 중 입력/버튼 비활성화, `401`/`403`/API 미설정 오류 메시지를 추가했다.
  - 보호 라우트에서 로그인 화면으로 온 경우 로그인 성공 후 원래 경로로 돌아간다.
- `SignupView.jsx`
  - 이메일 형식, 닉네임 2~20자, 비밀번호 8자 이상, 비밀번호 확인 일치 검증을 추가했다.
  - `409`는 이메일/닉네임 중복 안내로 표시한다.
- `App.jsx`
  - 당시 `/mypage`, `/community/write`를 보호 라우트로 처리했다. 2026-07-15 이후 `/mypage`는 제거됐고 `/community/write`, `/algo`가 보호 라우트로 남아 있다.
  - 보호 라우트에서 로그아웃하면 홈으로 이동한다.

백엔드에서 추가로 확정하면 좋은 항목:

- `POST /login` 성공 `data`: `accessToken`, `userId`, 선택적으로 `nickname`
- `POST /login` 실패: `401` 이메일/비밀번호 불일치, `403` 계정 제한
- `POST /signup` 성공 `data`: `userId`, `nickname`
- `POST /signup` 실패: `400` 입력 오류, `409` 이메일/닉네임 중복
- 토큰 만료 시간, refresh token 여부, logout API 필요 여부
- `GET /checks/{id}` article 필드: `press` 번호 또는 `pressName`, `publishedAt`, `viewCount`, `relevanceScore`, `articleId`, `url`, `summary`

## 2026-07-15 백엔드 코드 반영

- 루트 `docs/`의 md 파일을 `cheatft_web/docs/`로 옮겨 프론트 저장소 안의 문서로 사용한다.
- 백엔드 폴더(`cheatft_api`)는 읽기 전용으로 확인했고 수정하지 않았다.
- 실제 백엔드는 Express/PostgreSQL/JWT 프로젝트이며, `summary/reports/posts/profile`은 dummy controller, `checks/analysis/auth`는 실제 라우트/서비스/모델 구조를 사용한다.
- `checks.service.js`의 `PRESS_MAPPING`을 기준으로 프론트 언론사 매핑을 정리했다.
- 배포 프론트 `https://cheatft.leegeon.com/`은 Vite dev HTML을 서빙하고 있었고, 현재 로컬 프론트 수정사항보다 오래된 소스로 보였다.
- 배포 API 관측상 `POST /api/login`은 `UserModel.findByEmail is not a function` 오류가 확인됐다. 로컬 `src/models/user.model.js`가 user model 함수 대신 checks model 함수를 export하는 상태로 보인다.
- 같은 모델 불일치 때문에 `POST /api/signup`, 토큰이 있는 `GET /api/me`도 백엔드 auth service 계약을 만족하지 못할 가능성이 높다.

추가/수정 파일:

- `cheatft_web/src/App.jsx`: `/algo` 보호 라우팅 추가, `/algo` 로그아웃 시 홈 이동.
- `cheatft_web/src/utils/press.js`: 백엔드 `PRESS_MAPPING` 기반 `getPressLabel()`, `getPressCategory()` 추가.
- `cheatft_web/src/components/views/VerificationView.jsx`
  - 기존 네이버 `officeList` 순번 매핑 제거.
  - 백엔드 oid/name 표 기반 언론사 정규화 적용.
  - 당시 필터를 `전체 출처`, `방송/통신사`, `종합지`, `경제지`, `인터넷/IT지`, `기타 출처`, `프론트 더미`로 정리했다. 2026-07-15 이번 창 작업 이후 `프론트 더미` 필터는 제거됐다.
  - 당시 API 성공 시 백엔드 결과만 표시하고, 실패/미설정 시에만 프론트 더미 fallback을 사용했다. 2026-07-15 이번 창 작업 이후 검증하기의 프론트 더미 fallback은 제거됐다.
  - `GET /checks/{id}`에 `sort` query를 보내지 않고, 정렬 변경은 수신 결과를 로컬 정렬.
- `cheatft_web/src/components/views/AlgoView.jsx`: `description`, `publishedAt/createdAt/date`, `press/pressName/publisher/mediaName` 후보를 반영하고 `getPressLabel()` 사용.
- 실제 route map은 `backend-contract.md`의 "실제/더미 구분" 표를 우선 본다.

## 2026-07-15 이번 창 추가 반영

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 배포 실패 원인:
  - `https://cheatft.leegeon.com/`이 빌드 산출물이 아니라 Vite dev HTML과 `/src/main.jsx`를 서빙한다.
  - 배포된 소스에서 필요한 `/src/services/apiClient.js`가 404라 프론트가 정상 부팅하지 못한다.
  - `/api/summary`, `/api/health`, `/api/checks`는 응답하므로 API 서버 전체 중단보다 프론트 배포 누락/혼재가 핵심 원인이다.
- 홈:
  - `DEFAULT_SUMMARY`, fallback 통계/카테고리/최신 팩트체크 목업을 제거했다.
  - `GET /summary`의 `recentChecks`를 제한 없이 모두 표시한다. 현재 배포 API가 1개만 주면 최신 팩트체크도 1개만 보인다.
  - `알고리즘 편향성` 문구를 `신뢰도` 중심 표현으로 바꾸고 `Cheat F/T 소개 보기 >` 버튼만 제거했다.
- 검증하기:
  - URL 링크 검색 탭, 예시 검색 버튼, `MOCK_*`/`mockResults`, `프론트 더미` 필터/배지를 제거했다.
  - 검색 결과는 `POST /checks` 후 `GET /checks/{id}`의 `articles`만 표시한다.
  - 검색어 없는 초기 화면은 `GET /summary`의 `recentChecks`를 표시하고, 카드 클릭 시 제목 검색이 아니라 뉴스 상세로 이동한다.
  - 검색 결과 카드 클릭도 뉴스 상세로 이동한다. 원문 URL 버튼은 별도로 외부 링크를 연다.
- 뉴스 상세:
  - 클릭한 기사 객체를 `App.jsx`의 route state와 `sessionStorage`에 저장해 `/article/:id`에서 렌더링한다.
  - 제목, 언론사, 날짜, 설명, 원문 URL, 신뢰도 값을 클릭한 기사 데이터와 연결한다.
  - 직접 URL 진입이나 저장 정보 없는 새로고침을 완전히 지원하려면 `GET /api/articles/{id}` 또는 동등한 상세 API가 필요하다.
- 화면 정리:
  - `편향성 지수`, `알고리즘 편향성` 등 표시 문구를 `신뢰도`로 바꿨다.
  - 뉴스 상세의 관련 키워드/관련 뉴스/관련 댓글/AI 분석 코멘트 영역을 제거했다.
  - `교육 & 정보` 탭 이름을 `커뮤니티`로 바꾸고 공지사항, 가이드, 튜토리얼 항목을 제거했다.
  - 마이페이지 라우트/nav/import/컴포넌트를 제거하고 `MyPageView.jsx`를 삭제했다.
- 검증:
  - `npm run lint`: 통과
  - `npm test`: 통과
  - Codex 번들 Node로 `vite build`: 통과

## 2026-07-15 언론사 로고/관측 저장/텍스트 디코딩 추가 반영

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `cheatft_web/src/utils/press.js`
  - 백엔드 `PRESS_MAPPING` 18개 oid에 대해 네이버 언론사 홈 `office_logo` CDN URL을 추가했다.
  - `getPressOid()`, `getPressLogoUrl()`, `recordObservedPress()`를 추가했다.
  - `언론사(021)`처럼 fallback 문자열로 내려오는 미매핑 oid는 브라우저 `localStorage`의 `cheat-ft-observed-press-map`에 누적한다.
  - 개발자도구 Console 헬퍼:
    - `cheatFtPressList()`: `021 - 언론사(021)` 형태의 줄바꿈 문자열 반환
    - `cheatFtPressMap()`: 저장 객체 반환
    - `cheatFtClearPressList()`: 저장값 삭제
  - 저장은 `localStorage`라 창을 닫아도 유지되며, origin별로 분리된다. `http://localhost:3001`, `http://localhost:5173`, 배포 도메인은 서로 다른 저장소를 사용한다.
- `VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`
  - 언론사 배지는 `logoUrl`이 있으면 네이버 `office_logo` 이미지를 표시하고, 이미지 로드 실패 시 기존 텍스트 배지로 fallback한다.
  - API 결과 매핑 시 `recordObservedPress()`를 호출해 백엔드 담당자에게 전달할 미매핑 oid 목록을 누적한다.
- `cheatft_web/src/utils/text.js`
  - `decodeHtmlEntities()`, `cleanDisplayText()`를 추가했다.
  - API 문자열의 `&quot;`, `&amp;`, `&#39;`, `&apos;`, `&lt;`, `&gt;`, `&nbsp;`를 표시 전에 디코딩하고 남은 HTML 태그를 제거한다.
- `HomeView.jsx`, `VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`, `CommunityView.jsx`, `DetailView.jsx`
  - API에서 온 제목/요약/게시글/상세 표시 문자열에 `cleanDisplayText()`를 적용했다.
- 로그인/회원가입 상태 확인:
  - 프론트 UI/호출 흐름은 구현되어 있으나, 실제 인증 완성은 백엔드 user model 복구가 필요하다.
  - 현재 알려진 배포 오류는 `/api/login`의 `UserModel.findByEmail is not a function`이다.
- 검증:
  - `npm run lint`: 통과
  - `npm test`: 통과
  - Codex 번들 Node로 `npm run build`: 통과

## 2026-07-15 전체 스캔/문서 정리

- `understand` 스킬을 사용해 pre-flight, ignore 생성, scan, batch 계산을 수행했다.
- 생성 파일:
  - `.understand-anything/.understandignore`
  - `.understand-anything/intermediate/scan-result.json`
  - `.understand-anything/intermediate/batches.json`
- scan 결과: 92개 파일, 8개 batch. `node_modules`, `.git`, `dist`, lock/minified 파일은 기본 제외 대상이다.
- 루트 `.git`은 `HEAD`가 없어 git 저장소로 동작하지 않고, `cheatft_web`/`cheatft_api`는 Codex sandbox 사용자 기준 `dubious ownership`가 재현됐다.
- `cheatft_web/README.md`의 오래된 백엔드 설명과 이동 전 docs 경로를 최신화했다.
- `backend-handoff.md`는 최신 계약 문서가 아니라 초기 백엔드 협의 제안/역사 문서로 명시했다.

## 확인 방법

1. `cheatft_web/.env.local`을 만든다.

```dotenv
VITE_API_BASE_URL=https://cheatft.leegeon.com/api
```

2. `.env.local`을 새로 만들거나 수정했다면 Vite dev server를 재시작한다.
3. 프론트를 실행한다.

```powershell
cd C:\Users\eunhy\Desktop\동아리\cheatft_web
npm run dev
```

4. 브라우저 개발자도구 Network 탭에서 요청을 확인한다.

확인할 요청 이름:

- `summary`
- `checks`
- `analysis`
- `reports`
- `posts`
- `login`
- `signup`

홈/검증하기는 API 실패 시 프론트 더미 결과를 섞지 않는다. 리포트/커뮤니티/알고리즘 분석 등 fallback이 남아 있는 화면은 실제 연동 성공 여부를 Network 탭의 status code와 response body로 확인한다. 로그인, 회원가입, 게시글 등록은 API 실패 시 오류 메시지를 보여준다.

## 검증 결과

- `npm run lint`: 통과
- `npm test`: 통과
- Codex 번들 Node로 `vite build`: 통과

2026-07-12 검증:

- `npm run lint`: 통과
- `npm test`: 통과
- Codex 번들 Node로 `vite build`: 통과
- 현재 기본 셸의 `npm run build`: 기존 Vite/Node 네이티브 종료 이슈로 `38 modules transformed` 이후 exit 1 재현

2026-07-12 검증하기/인증 추가 검증:

- `npm run lint`: 통과
- `npm test`: 통과

2026-07-15 백엔드 코드 반영 검증:

- `npm run lint`: 통과
- `npm test`: 통과
- Codex 번들 Node로 `vite build`: 통과

주의: 현재 기본 셸 Node 계열에서는 기존 Vite 네이티브 종료 이슈로 `npm run build`가 `modules transformed` 이후 종료될 수 있다. Node 22 LTS 또는 Codex 번들 Node 사용을 권장한다.

## 남은 과제

- 기사 상세 API 명세 추가 또는 `GET /checks/{id}` 응답에 상세 필드 포함 여부 확정
- 백엔드 `src/models/user.model.js`가 auth service의 `findByEmail/createUser/findById` 계약을 만족하도록 수정 필요
- `/profile`을 계속 둘 경우 공개 dummy dashboard로 둘지, 인증 사용자 profile API로 바꿀지 확정. 현재 프론트 마이페이지는 제거됨.
- `GET /checks/{id}`, `GET /analysis/{id}`의 owner check 필요 여부 확정
- `checks/analysis/reports/posts`의 query parameter 지원 범위 확정
- 백엔드 `checks.service.js`가 전역 `fetch`를 사용하므로 Node 18 이상 실행 전제 문서화
- 커뮤니티 게시글 상세/댓글 API 명세 추가
- 로그아웃, refresh token, 토큰 만료 처리 방식 확정
- 로그인/회원가입 실제 DB 저장, 비밀번호 검증, accessToken 발급 방식 구현 여부 확인
- 검증 결과 현재 실제 필드는 `articleId`, `press`, `title`, `description`, `date`, `url`이다. 정렬/필터용 `viewCount`, `relevanceScore`, 상세용 `summary/publishedAt` 필드 확정
- 리포트/분석 다운로드 API 명세 추가
- 남은 화면 내부 목업 배열을 `src/mocks/` 또는 `src/data/`로 분리하거나 제거
- 실제 백엔드 응답 필드가 확정되면 변환 로직 정리
