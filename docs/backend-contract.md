# 프론트-백엔드 계약 지도

마지막 갱신: 2026-07-26
기준 문서: `cheatft_api/src`, `cheatft_api/README.md`, `cheatft_web/docs/backend-handoff.md`, `cheatft_web/src`

이 문서는 `cheatft_web` 화면과 `cheatft_api` 구현/명세를 빠르게 맞춰보기 위한 요약이다. 실제 동작은 `cheatft_api/src`를 우선 확인하고, README는 보조 명세로 본다.

## 현재 결론

- 로컬 `cheatft_api`는 Express/PostgreSQL/JWT 기반 백엔드 구현체이다.
- Codex는 `cheatft_api`를 수정하지 않는다. 백엔드는 계약 확인을 위해 읽기 전용으로만 참고하고, 로그인/회원가입 구현 요청도 프론트 범위에서만 처리한다.
- 배포 API는 `https://cheatft.leegeon.com/api`에서 응답한다.
- `summary/reports/posts/profile`은 여전히 dummy controller 기반 응답이며, `checks/analysis/auth`는 실제 라우트/서비스/모델 흐름을 탄다.
- 프론트는 주요 화면에서 실제 API를 우선 호출한다. 홈/검증하기는 프론트 더미 fallback을 제거하고 API 응답만 표시한다.
- `src/services/apiClient.js`는 API base URL, JSON 요청/오류 처리, Bearer 토큰 첨부를 담당하고, `src/services/cheatftApi.js`가 명세 기반 도메인 함수를 제공한다.
- 백엔드 명세의 실제 경로는 `/api/...` 형태이다.
- 백엔드 폴더는 2026-07-05, 2026-07-10, 2026-07-12, 2026-07-15 프론트 연동 작업에서 수정하지 않았다.
- 프론트는 API 성공 후 빈 배열을 받으면 프론트 목업을 섞지 않고 빈 상태를 보여주는 방향으로 보강했다.
- 검증하기 검색 결과는 API 성공 시 백엔드 결과만 표시한다. 2026-07-15 이후 검증하기의 API 실패/미설정 프론트 더미데이터 fallback도 제거됐다.
- 검증하기 언론사 표기는 백엔드 `src/services/checks.service.js`의 `PRESS_MAPPING`을 기준으로 프론트 `src/utils/press.js`에서 정규화한다.
- 2026-07-15 추가 보강으로 프론트는 알려진 oid에 네이버 `office_logo` 로고 URL을 매핑하고, `언론사(021)` 같은 미매핑 fallback 문자열은 브라우저 `localStorage`에 관측 목록으로 누적한다. 이는 백엔드에 전달할 보완 목록 수집용이며 서버 저장은 아니다.
- 2026-07-26 이후 프론트는 `src/data/pressReliability.js`의 언론사 기준표로 분류와 신뢰도 fallback을 제공한다. 백엔드 기사에 신뢰도 점수가 없으면 언론사 기준 점수를 사용한다. 판단 이유 검토용 문서는 `docs/press-reliability.md`이다.
- `/algo`는 보호 라우트로 변경했다. 백엔드 `analysis` 라우트도 `verifyToken`을 요구한다. 프론트 입력 흐름은 질문 영역 강조 → 추천 키워드 생성 후 키워드 영역 강조 → 키워드 선택 후 질문 영역 강조로 안내하며 API 호출 구조는 그대로 유지한다.
- `/mypage` 화면/라우트와 `MyPageView.jsx`는 2026-07-15 작업에서 제거됐다. `/api/profile`은 백엔드 dummy endpoint로 남아 있지만 현재 프론트 화면은 사용하지 않는다.
- 2026-07-26 기준 `UserModel.findByEmail is not a function` 오류는 해결된 상태로 확인했다. `POST /api/login`은 테스트 계정으로 200을 반환하고 `data.accessToken`을 내려준다.
- 2026-07-26 기준 `GET /api/summary`는 `recentChecks` 3개를 반환한다.
- 2026-07-26 기준 `GET /api/checks/{id}?page=1&limit=100`은 `경제` 검색어에서 `totalArticles: 12`, `articles.length: 12`, `pagination.totalPages: 1`로 관측됐다. `page=2&limit=5`도 12건 전체와 `currentPage: 1`을 반환해 서버 페이지네이션은 아직 적용되지 않은 상태로 보이며, 프론트는 최대 100건 수신 후 10건씩 클라이언트 페이지네이션한다.
- 2026-07-26 기준 `GET /api/reports`, `GET /api/posts`는 query parameter를 받아도 같은 dummy 응답과 `currentPage: 1`을 반환한다.
- 2026-07-26 기준 `GET /api/analysis/{id}?limit=1`과 `limit=4`는 같은 결과를 반환하고, 응답 body에 `limit` 필드는 없다.
- 2026-07-26 기준 `GET /api/health`는 서버 상태 확인 라우트로 존재하지만 공통 래핑 없이 `{ message }`만 반환한다.
- 기존 `cheatft_web/docs/backend-handoff.md`는 회의 전 제안 문서라 `/auth/login`, `/fact-checks` 같은 다른 경로가 섞여 있었다. 현재 연결 상태와 향후 협의는 아래 매핑을 기준으로 본다.

## 2026-07-26 배포 API 재확인 메모

- 확인 시각: 2026-07-26 18:14~18:15 KST.
- `GET /api/summary`: `todayStats`, `recentChecks`, `biasStatus` 반환. `recentChecks`는 3개.
- `POST /api/signup`: 성공 시 `id`, `email`, `nickname`, `level`, `user_title`, `created_at` 반환. 중복 이메일은 현재 `409`가 아니라 `500`으로 내려온다.
- `POST /api/login`: 성공 시 `accessToken`, `userId`, `nickname` 반환.
- `GET /api/me`: 토큰 없으면 `401`, 유효 토큰이면 `id`, `email`, `nickname`, `level`, `user_title`, `created_at` 반환.
- `POST /api/checks`: `type=text`, `type=url` 모두 `202`와 `checkId`를 반환한다. 다만 `type=url`은 URL 본문 파싱 없이 검색어처럼 저장되며, 확인한 네이버 기사 URL 요청은 기사 0건이었다.
- `GET /api/checks/{id}`: 기사 필드는 `articleId`, `press`, `title`, `description`, `date`, `url`이다. `press`는 README 예시처럼 숫자가 아니라 `"연합뉴스"` 또는 `"언론사(050)"` 같은 문자열이다. 제목/설명에는 `&quot;` 같은 HTML entity가 남을 수 있다.
- `POST /api/analysis`: 인증 필요. 성공 메시지는 `분석이 성공적으로 요청되었습니다.`이고 `analysisId`를 반환한다.
- `GET /api/analysis/{id}`: `analysisId`, `keyword`, `biasAnalysis`, `insights`, `relatedArticles`, `counterArticles`, `summaryStats`, `pagination` 반환. `limit` query는 실제 결과 개수에 반영되지 않고, 관련/반박 기사 `press`는 숫자가 아니라 언론사명 문자열이다.
- `POST /api/posts`: 성공 시 `id`, `title`, `category`만 반환한다.
- `GET /api/health`: 공통 래핑 없이 `{ message }`만 반환한다.

## 2026-07-16 인증/배포 계약 메모

- 백엔드 pull 후 `cheatft_api/src/models/user.model.js`는 사용자 모델로 복구됐다.
  - `findByEmail(email)`: `SELECT * FROM users WHERE email = $1`
  - `createUser(email, password, nickname)`: bcrypt hash 저장 후 `id, email, nickname, level, user_title, created_at` 반환
  - `findById(id)`: password를 제외한 사용자 기본 정보 반환
- `cheatft_api/src/controllers/auth.controller.js`는 실수로 수정했다가 사용자 요청으로 즉시 원상복구했다.
  - 최종 상태 기준 백엔드 소스 변경은 남기지 않는다.
  - 이후 원칙: `cheatft_api`는 어떤 경우에도 수정하지 않고 읽기 전용으로만 확인한다.
- `cheatft_web/src/components/views/LoginView.jsx` 수정:
  - 로그인 요청 전 password 앞뒤 공백 제거
  - 프론트 로그인 성공 조건은 그대로 `data.accessToken` 존재 여부
- `cheatft_web/src/services/apiClient.js`, `src/services/cheatftApi.js`, `src/App.jsx` 수정:
  - 로그인 성공 시 `accessToken`과 별도로 현재 사용자 정보를 `localStorage` key `cheat-ft-current-user`에 저장한다.
  - 저장 후보 필드는 `userId/id`, `email`, `nickname`이며, `user.nickname` 같은 중첩 응답도 받는다.
  - 상단 nav에는 `nickname`, `name`, 이메일 앞부분, `사용자` 순서로 표시 이름을 선택해 보여준다.
  - 로그아웃 시 `cheat-ft-access-token`과 `cheat-ft-current-user`를 함께 삭제한다.
- 프론트 테스트용 실제 계정:
  - 이메일: `codex.test.20260716@example.com`
  - 닉네임: `Codex테스트0716`
  - 비밀번호: `Test!20260716#Codex`
  - 배포 API에서 생성/로그인/`GET /api/me` 확인 완료
- 배포 API 관측:
  - `POST /api/signup`: 위 계정 생성 시 `201`
  - `POST /api/login`: 위 계정 로그인 시 `200`, `data.accessToken`, `userId: 2`, `nickname: Codex테스트0716`
  - `GET /api/me`: 발급 토큰으로 `200`
  - `OPTIONS /api/login`: `204`, CORS 허용 헤더 확인
- 배포 프론트 관측:
  - `https://cheatft.leegeon.com/`은 아직 Vite dev HTML을 서빙한다.
  - 정상 운영 배포는 `cheatft_web/dist` 산출물이 web root가 되어야 한다.
  - 운영 HTML에 `/@vite/client`, `/src/main.jsx`, `/@react-refresh`가 있으면 잘못 배포된 상태다.
  - `/assets/*.js` 또는 `/assets/*.css`가 `<!doctype html>`로 시작하면 정적 파일 대신 SPA fallback이 내려오는 상태다.
- 검증:
  - `cheatft_api`: `npm ci` 후 인증 모듈 로드 확인 통과
  - `cheatft_web`: `npm run lint`, `npm test`, Codex 번들 Node 기반 `vite build` 통과

## 2026-07-05 프론트 구현 요약

- 현재 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`를 기준으로 사용한다.
- 프론트 내부 API 함수는 `/summary`, `/login`, `/checks`처럼 `/api`를 제외한 path를 넘긴다.
- API 응답은 `{ status, message, data }` 래핑을 예상하고 `apiData()`에서 `data` 중심으로 반환한다.
- `/login` 응답의 `accessToken`은 `localStorage`의 `cheat-ft-access-token`에 저장한다.
- 저장된 토큰은 이후 요청에 `Authorization: Bearer ...`로 첨부한다.
- 조회 화면은 API가 설정되지 않았거나 요청이 실패하면 기존 목업으로 fallback한다.
- 로그인은 `accessToken`이 있는 응답만 성공으로 처리한다.
- 회원가입은 명세상 `accessToken`을 반환하지 않으므로 성공 후 로그인 화면으로 이동한다.
- 당시 `cheatft_api`는 README 명세 중심으로 확인했다. 2026-07-15 현재는 Express/PostgreSQL/JWT 구현체가 들어와 있으며, 실행에는 백엔드 의존성/환경변수/DB가 필요하다.

연동 확인은 브라우저 개발자도구 Network 탭에서 한다. 화면은 fallback 때문에 API 실패 시에도 정상처럼 보일 수 있으므로, 요청의 status code와 response body를 직접 확인해야 한다.

## 2026-07-10 배포 더미 API 관측값

- Base URL: `https://cheatft.leegeon.com/api`
- `GET /summary`
  - `todayStats.requests`: 1248
  - `todayStats.completed`: 842
  - `todayStats.accuracyRate`: 91
  - 2026-07-10 당시 `recentChecks`: 1개. 2026-07-26 재확인 기준은 3개
  - 첫 항목 제목: `"OOO 백신 부작용 사망자 급증?"`
  - `biasStatus.overallScore`: 32
  - `biasStatus.overallLevel`: `보통`
- `POST /checks`
  - 현재 더미 응답의 `checkId`: 452
- `GET /checks/452`
  - `articles` 배열: 1개
  - 첫 기사 언론사: `KBS 뉴스`
  - 첫 기사 제목: `질병청 "백신 접종 후 사망 사례, 인과성 확인 안돼"`
  - `totalArticles`: 12
  - `pagination.totalItems`: 12
  - 즉, 현재 화면에 렌더링 가능한 기사 객체는 1개지만 총합 메타데이터는 12개로 표시된다.

프런트는 더미 API가 성공 응답을 주면 API의 `articles` 배열만 표시한다. API 성공 후 빈 배열이 오면 프론트 KBS/뉴스1 예시를 섞지 않고 빈 상태를 보여주며, API 실패 시에만 기존 목업으로 fallback한다.

## 2026-07-12 프론트 수신 정책 보강

- `src/services/apiClient.js`는 HTTP status가 성공이어도 응답 body의 `status`가 400 이상이면 `ApiError`로 처리한다.
- `apiData()`는 기존처럼 `{ status, message, data }`의 `data`를 반환한다.
- 조회 화면은 API 요청 실패 또는 API 미설정일 때만 프론트 목업으로 fallback한다.
- 단, 2026-07-15 이후 홈/검증하기는 이 fallback 정책에서 제외되어 API 응답/오류/빈 상태만 표시한다.
- API 요청이 성공했지만 백엔드 응답 배열이 비어 있으면 프론트 목업을 섞지 않고 빈 상태를 보여준다.
- 이 정책이 반영된 화면:
  - 검증 결과: `articles`
  - 홈 최신 팩트체크: `recentChecks`
  - 홈 편향 카테고리: `biasStatus.categories`
  - 알고리즘 분석: `relatedArticles`, `counterArticles`, `insights`
  - 리포트: `reports`
  - 커뮤니티: `posts`
- 당시 `MyPageView.jsx`는 `profile` 하위 중첩 객체가 부분적으로 빠진 경우 프론트 기본값과 병합했다. 2026-07-15 이후 마이페이지 화면/라우트는 제거됐다.
- 백엔드 폴더(`cheatft_api`)는 수정하지 않았고, API 명세는 읽기 전용 참고로만 사용했다.

## 2026-07-12 검증하기 필터/정렬 계약 메모

- `VerificationView.jsx`는 `GET /checks/{id}` 결과의 `articles` 항목에서 언론사 필드를 다음 후보 순서로 읽는다: `press`, `pressName`, `publisher`, `mediaName`.
- 2026-07-15 이후 `press`가 숫자 또는 숫자 문자열이면 백엔드 `PRESS_MAPPING`의 oid 기준으로 매핑한다. 예: `056` -> `KBS`, `047` -> `오마이뉴스`.
- `언론사(047)`처럼 백엔드 fallback 문자열에 oid가 들어간 경우도 같은 표로 보정한다.
- `언론사(021)`처럼 프론트 표에 없는 fallback 문자열이 실제 화면 데이터에 등장하면 `recordObservedPress()`가 `localStorage` key `cheat-ft-observed-press-map`에 `021: "언론사(021)"` 형태로 저장한다. 백엔드 담당자에게 전달할 때는 브라우저 Console에서 `cheatFtPressList()`를 실행해 `021 - 언론사(021)` 형태로 복사한다.
- 이 저장은 `http://localhost:3001`, `http://localhost:5173`, 배포 도메인처럼 origin별로 분리된다. `localStorage`이므로 일반 창을 닫아도 유지되지만, 시크릿 모드 종료/사이트 데이터 삭제/`cheatFtClearPressList()` 실행 시 사라진다.
- 화면 필터 매핑:
  - `방송/통신사`: 연합뉴스, 뉴시스, 뉴스1, KBS, MBC, SBS, YTN
  - `종합지`: 한겨레, 경향신문, 조선일보, 중앙일보, 동아일보
  - `경제지`: 한국경제, 매일경제, 이데일리, 머니투데이
  - `인터넷/IT지`: 데일리안, 오마이뉴스
  - `기타 출처`: 위 목록에 속하지 않는 백엔드/외부 출처
- 결과 정렬 select는 2026-07-26 이후 `relevance`, `latest` 값만 사용한다. `runFactCheck()`는 `GET /checks/{id}?page=1&limit=100`을 호출하고, 정렬 변경은 프론트 수신 결과를 로컬에서 재정렬한다.
- 검증하기 화면은 API에서 받은 `articles`를 프론트에서 10건씩 페이지네이션한다. 서버 `page/limit`이 실제 분할을 지원하면 이후 `page` 상태를 API 요청과 연결할 수 있다.
- 프론트 정렬 후보 필드:
  - 연관도: `relevanceScore`, `relevance`, `similarity`. 현재 배포 API에는 이 필드가 없으므로 백엔드 반환 순서를 유지한다.
  - 최신순: `publishedAt`, `createdAt`, `date`, `pubDate`, `pub_date`를 표시용 날짜로 변환한 값
- 백엔드 `checks.service.js`는 네이버 뉴스 검색에 `sort=sim`을 설정하므로 기본 반환 순서는 연관도순이다.
- 백엔드가 정렬/필터 parameter를 공식 지원하기 전까지 프론트에서 수신 결과를 한 번 정렬한다.

## 2026-07-12 로그인/회원가입 계약 메모

- `LoginView.jsx`는 로그인 성공 응답에 `accessToken`이 있어야 성공으로 처리한다.
- 로그인 요청 body는 `{ email, password }`이다.
- 회원가입 요청 body는 `{ email, password, nickname }`이다.
- 회원가입 성공 응답은 현재 명세상 `{ userId, nickname }` 정도를 기대하고, accessToken은 기대하지 않는다.
- 당시 프론트는 `/mypage`, `/community/write`를 보호 라우트로 처리했다. 2026-07-15 이후 `/mypage`는 제거됐고 `/community/write`, `/algo`가 보호 라우트로 남아 있다.
- 프론트 오류 처리 기대:
  - 로그인 `401`: 이메일 또는 비밀번호 불일치
  - 로그인 `403`: 계정 제한 또는 권한 없음
- 회원가입 `400`: 입력값 오류
- 회원가입 중복은 프론트 UX상 `409`가 가장 자연스럽지만, 2026-07-26 배포 API는 중복 이메일을 `500`으로 반환한다.

## 2026-07-15 실제 백엔드 관측/프론트 반영

백엔드 코드:

- `cheatft_api/src/index.js`는 auth routes와 checks/dummy routes를 `/api`에, analysis routes를 `/api/analysis`에 연결한다.
- 실제 등록 코드는 `authRoutes`를 `/api`에 붙이므로 auth 경로는 `/api/login`, `/api/signup`, `/api/me`이다.
- `checks.routes.js`의 `POST /checks`는 optional auth이고, `GET /checks/:id`는 id 기반 조회이다.
- `analysis.routes.js`의 `POST /analysis`, `GET /analysis/:id`는 `verifyToken`을 요구한다.
- `checks.service.js`는 `PRESS_MAPPING` 표를 갖고, Naver `link/title/description/pubDate`를 article로 저장한다. `originallink`는 현재 저장하지 않는다.
- `dummy.controller.js`는 `summary/reports/posts/profile` 계열 응답을 제공한다.
- 2026-07-15 당시 `auth.service.js`는 `UserModel.findByEmail/createUser/findById`를 기대했지만, 당시 `src/models/user.model.js`는 checks model 함수만 export했다. 2026-07-16 pull 이후 user model은 복구됐다.
- `analysis.service.js`는 실제 추천 알고리즘 분석이라기보다 고정 stats, 기사 2개, insight 2개를 DB에 저장하는 DB-backed stub이다.
- `checks.service.js`는 Node 전역 `fetch`를 사용하므로 백엔드 실행 환경은 Node 18 이상을 전제로 한다.

배포 API 관측:

- `GET https://cheatft.leegeon.com/api/summary`: 200.
- `GET https://cheatft.leegeon.com/api/profile`: 200.
- `GET https://cheatft.leegeon.com/api/me`: 토큰 없이 401.
- `GET https://cheatft.leegeon.com/api/checks/452`: 새 DB 백엔드 기준 404.
- 2026-07-15 당시 `POST https://cheatft.leegeon.com/api/login`: `401 {"status":401,"message":"UserModel.findByEmail is not a function"}`. 2026-07-16에는 테스트 계정 로그인 200을 확인했다.
- `https://cheatft.leegeon.com/`은 200이지만 Vite dev HTML(`/@vite/client`, `/src/main.jsx`)을 서빙했고, 배포 프론트는 최신 로컬 프론트 수정 전 상태로 보였다.

프론트 반영:

- `src/App.jsx`: `/algo` 보호 라우팅 추가. `/algo`에서 로그아웃하면 홈으로 이동.
- `src/utils/press.js`: 백엔드 `PRESS_MAPPING` 기반 `getPressLabel()`, `getPressCategory()` 추가.
- `src/components/views/VerificationView.jsx`: 백엔드 표 기반 언론사 분류 사용, API 성공 시 프론트 더미 혼합 제거. 당시에는 API 실패 시 fallback을 유지했으나 이번 창에서 검증하기 fallback은 제거됐다.
- `src/components/views/VerificationView.jsx`: `sort` query 전달 제거. 정렬 변경은 로컬 결과 정렬만 수행.
- `src/components/views/AlgoView.jsx`: 기사 변환에서 `description`, `publishedAt/createdAt/date`, 백엔드 언론사 필드 후보를 반영.

## 2026-07-15 이번 창 반영 계약 메모

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 배포 프론트 실패 원인은 API 전체 중단이 아니라 프론트 배포 누락/혼재로 본다.
  - `/`은 Vite dev HTML을 서빙한다.
  - `/src/App.jsx`는 응답하지만 그 import 대상인 `/src/services/apiClient.js`가 404다.
  - `/api/summary`, `/api/health`, `/api/checks`는 응답한다.
- 홈:
  - `GET /api/summary` 응답만 사용한다. 프론트 기본 summary/fallback 더미를 제거했다.
  - 최신 팩트체크는 `recentChecks` 전체를 표시한다. 프론트에서 3개로 자르지 않는다.
  - 2026-07-26 배포 API 확인 기준 `recentChecks`는 3개이며, 프론트는 받은 개수만큼 표시한다.
  - `biasStatus`와 `reliabilityStatus` 후보를 모두 받을 수 있으나 화면 표현은 `신뢰도` 기준이다.
- 검증하기:
  - URL 링크 검색은 제거됐다. 현재 프론트 입력은 텍스트 검색만 사용한다.
  - `POST /api/checks` 후 `GET /api/checks/{id}`의 `articles`만 표시한다.
  - 프론트 `MOCK_*`/`mockResults`, 프론트 더미 필터/배지, API 실패 fallback 결과를 제거했다.
  - 검색어 없는 초기 화면은 `GET /api/summary`의 `recentChecks`를 표시한다.
  - 초기 화면 카드와 검색 결과 카드 클릭은 제목 재검색이 아니라 `/article/:id` 뉴스 상세 이동이다.
- 뉴스 상세:
  - 현재 상세 화면은 별도 백엔드 detail fetch가 아니라 클릭한 기사 객체를 route state와 `sessionStorage`로 전달받아 렌더링한다.
  - 표시 후보 필드: `articleId`, `press/pressName/publisher/mediaName`, `title/headline`, `description/summary/content`, `date/publishedAt/createdAt/pubDate/pub_date`, `url`, `reliabilityScore/reliability/trustScore/credibilityScore/score`.
  - 직접 URL 진입, 다른 기기 공유 링크, 저장 정보 없는 새로고침까지 지원하려면 `GET /api/articles/{id}` 또는 `GET /api/checks/{checkId}/articles/{articleId}` 같은 상세 API가 필요하다.
- 화면 구조:
  - `교육 & 정보`는 `커뮤니티`로 이름이 바뀌었고 공지사항/가이드/튜토리얼 항목은 제거됐다.
  - 마이페이지 화면과 `/mypage` 라우트는 제거됐다.

## 2026-07-15 표시/로고 보강 계약 메모

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 프론트는 알려진 언론사 oid에 대해 네이버 언론사 홈의 `office_logo` CDN URL을 사용한다. 예: `056` -> KBS 로고, `047` -> 오마이뉴스 로고.
- 장기 계약 권장:
  - 백엔드가 `pressId` 또는 `oid`를 명시 반환한다.
  - 가능하면 `pressName`, `pressId`, `pressLogoUrl`을 함께 반환한다.
  - 프론트가 이름별 수동 매핑을 늘리지 않아도 되도록 `press`에는 정규화된 언론사명 또는 oid 문자열 중 하나를 안정적으로 제공한다.
- 단기 프론트 동작:
  - `press/pressName/publisher/mediaName` 후보에서 oid/name을 정규화한다.
  - 로고 URL이 있으면 이미지를 표시하고, 이미지 로드 실패 또는 미매핑이면 기존 텍스트 배지를 표시한다.
  - `pressReliability.js`에 등록된 언론사는 분류와 신뢰도 점수/라벨/판단 이유를 함께 조회한다.
  - 미매핑 fallback oid는 `localStorage`에 관측 목록으로 저장한다.
- API 문자열 표시:
  - 네이버/백엔드 응답에 HTML entity가 남아 `&quot;`처럼 보일 수 있어 프론트 `cleanDisplayText()`가 표시 전에 디코딩한다.
  - 백엔드에서도 가능하면 `title`, `description`, `summary`, `content`는 HTML entity와 태그를 제거한 plain text로 내려주는 것을 권장한다.
  - 뉴스 상세의 관련 키워드/관련 뉴스/관련 댓글/AI 분석 코멘트 영역은 제거됐다.

## 공통 응답

`cheatft_api/README.md` 기준:

```json
{
  "status": 200,
  "message": "Success",
  "data": {}
}
```

프론트 구현 시 결정/반영한 점:

- `apiRequest()`는 payload 전체를 반환하고, `apiData()`는 `data`만 반환한다.
- HTTP status가 성공이어도 body의 `status`가 400 이상이면 오류로 처리한다.
- 오류 응답에도 `status/message/data`를 유지할지, `code/details`를 추가할지

## 화면별 API 매핑

| 화면/기능 | 프론트 파일 | 백엔드 명세 | 현재 프론트 상태 |
|---|---|---|---|
| 홈 요약 | `HomeView.jsx` | `GET /api/summary` | API 응답만 표시, 실패/빈 배열은 오류/빈 상태, 프론트 더미 fallback 없음 |
| 검색/검증 요청 | `HomeView.jsx`, `VerificationView.jsx` | `POST /api/checks` | 검색어 이동 후 API 요청 |
| 검증 결과 | `VerificationView.jsx` | `GET /api/checks/{id}` | API 응답만 표시, URL 링크 검색 제거, 프론트 더미 fallback 없음, 백엔드 `PRESS_MAPPING` 기반 출처 필터와 로컬 정렬 제공 |
| 뉴스 상세 | `DetailView.jsx` | 명세 없음 | 클릭한 기사 객체를 route state/sessionStorage로 표시. 직접 조회용 상세 API 없음 |
| 알고리즘 분석 요청 | `AlgoView.jsx` | `POST /api/analysis` | 보호 라우트, 추천 키워드 칩 선택 시 API 요청, 백엔드는 Bearer token 요구 |
| 알고리즘 분석 결과 | `AlgoView.jsx` | `GET /api/analysis/{id}` | 보호 라우트, API 우선, 실패 시 목업, API 성공 후 빈 배열은 빈 상태 |
| 리포트 목록 | `ReportView.jsx` | `GET /api/reports` | API 우선, `keyword/date/score/page/limit` 전달, 실패 시 목업, API 성공 후 빈 배열은 빈 상태 |
| 커뮤니티 목록 | `CommunityView.jsx` | `GET /api/posts` | API 우선, `category/keyword/page/limit` 전달, 실패 시 목업, API 성공 후 빈 배열은 빈 상태 |
| 커뮤니티 작성 | `CommunityWriteView.jsx` | `POST /api/posts` | 보호 라우트, 등록 버튼에서 API 요청 |
| 커뮤니티 상세 | `DetailView.jsx` | 명세 없음 | `/community/:id` placeholder |
| 로그인 | `LoginView.jsx`, `App.jsx` | `POST /api/login` | accessToken과 현재 사용자 정보 저장 후 로그인 상태 반영, 상단 닉네임 표시, 보호 라우트에서 온 경우 원래 경로 복귀 |
| 회원가입 | `SignupView.jsx` | `POST /api/signup` | 입력 검증 후 성공 시 로그인 화면으로 이동 |
| 마이페이지 | 제거됨 | `GET /api/profile` | 프론트 화면/라우트 제거. 백엔드 endpoint 자체는 공개 dummy dashboard 응답으로 남아 있음 |
| 내 정보 | 미사용 | `GET /api/me` | 프론트 미연결. 백엔드는 Bearer token 필요 |
| 헬스체크 | 미사용 | `GET /api/health` | 프론트 미연결. 서버 상태 확인 |

## 명세된 엔드포인트

| 메서드 | 경로 | 용도 | 주요 data |
|---|---|---|---|
| GET | `/api/summary` | 홈 대시보드 | `todayStats`, `recentChecks`, `biasStatus` |
| POST | `/api/signup` | 회원가입 | 성공 시 `id`, `email`, `nickname`, `level`, `user_title`, `created_at`; 중복 이메일은 현재 `500` |
| POST | `/api/login` | 로그인 | `accessToken`, `userId` |
| GET | `/api/me` | 인증 사용자 정보 | Bearer token 필요. 2026-07-26 배포 API 정상 조회 확인 |
| POST | `/api/checks` | 팩트체크 요청 | `checkId` |
| GET | `/api/checks/{id}` | 검증 결과 | `checkId`, `query`, `articles`, `pagination`; `page/limit` 미구현, pagination은 현재 `1/1/articles.length` |
| POST | `/api/analysis` | 알고리즘 분석 요청 | `analysisId` |
| GET | `/api/analysis/{id}` | 알고리즘 분석 결과 | `biasAnalysis`, `insights`, `relatedArticles`, `counterArticles`, `summaryStats`, `pagination`; `limit` query 미구현, 응답 `limit` 없음 |
| GET | `/api/reports` | 리포트 목록 | `totalStats`, `reports`, `pagination`; query parameter는 현재 dummy 응답에 미반영 |
| GET | `/api/posts` | 커뮤니티 목록 | `communityStats`, `posts`, `pagination`; query parameter는 현재 dummy 응답에 미반영 |
| POST | `/api/posts` | 게시글 작성 | `id`, `title`, `category` |
| GET | `/api/profile` | 마이페이지 dummy dashboard | `userInfo`, `myContribution`, `personalDashboard`, `earnedBadges`, etc. |
| GET | `/api/health` | 서버 상태 확인 | 공통 래핑 없이 `{ message }` |

## 실제/더미 구분

| 구분 | Endpoint | 현재 성격 |
|---|---|---|
| 실제 DB 흐름 | `/api/signup`, `/api/login`, `/api/me` | 배포 API에서 생성/로그인/토큰 조회 정상 확인. 중복 회원가입은 현재 `500` |
| 실제 DB 흐름 | `/api/checks`, `/api/checks/{id}` | 요청 시 check와 article 저장, 네이버 API 실패/키 없음이면 fallback article 저장 |
| DB-backed stub | `/api/analysis`, `/api/analysis/{id}` | 인증 필요, 고정 stats/기사/insight를 DB에 저장/조회 |
| dummy controller | `/api/summary`, `/api/reports`, `/api/posts`, `/api/profile` | query/auth/DB 저장 거의 미처리. `GET /reports`, `GET /posts` query 미반영. `POST /api/posts`도 더미 생성 응답 |
| health | `/api/health` | 공통 래핑 없이 상태 메시지 |

## 프론트에서 필요한 추가 API

현재 백엔드 명세에 없지만 화면이 자연스럽게 필요로 하는 항목:

- `GET /api/articles/{id}` 또는 `GET /api/checks/{checkId}/articles/{articleId}`: `DetailView` 뉴스 상세 직접 진입/새로고침/공유 링크 지원용
- `GET /api/checks/{id}` article 필드 확정: `press` 번호 또는 언론사명, `publishedAt`, `viewCount`, `relevanceScore`, `articleId`, `url`, `summary`
- `POST /api/checks`의 `type=url` 실제 처리 방식 확정. 현재는 URL 본문 분석이 아니라 검색어처럼 처리된다.
- `GET /api/posts/{id}`: 커뮤니티 상세용
- `GET /api/posts/{id}/comments`, `POST /api/posts/{id}/comments`: 댓글 목록/작성
- `POST /api/logout` 또는 토큰 만료/갱신 정책
- `GET /api/me` 또는 `GET /api/profile`의 인증 사용자 정보 분리 여부
- 알림 목록 API: nav의 알림 버튼 활성화용
- 리포트 다운로드 API: `ReportView`, `AlgoView`의 다운로드 버튼용
- `POST /api/posts` 응답 스키마 문서화. 현재는 `id`, `title`, `category`만 반환한다.
- 공통 응답을 모든 API에 적용할지 확정. 현재 `/api/health`는 `{ message }`만 반환한다.
- 즐겨찾기/저장한 기사 API: `ReportView` 또는 향후 개인화 화면 요소용
- 실제 마이페이지를 다시 제공하려면 공개 dummy `/api/profile`과 인증 사용자 `/api/me` 또는 인증 profile API의 역할 분리가 필요하다.
- `GET /api/checks/{id}`와 `GET /api/analysis/{id}`는 현재 owner check가 보이지 않는다. 사용자별 데이터 격리가 필요하면 백엔드 계약을 추가해야 한다.

## 우선 확정할 계약

1. 인증 방식
   - 현재 명세는 `accessToken`만 반환한다.
   - 프론트는 토큰 저장 위치, refresh token 여부, Authorization header 형식이 필요하다.
   - 로그인은 `accessToken`이 없는 응답을 실패로 본다.
   - 회원가입은 현재 명세상 로그인 상태를 만들지 않으므로, 가입 직후 자동 로그인 여부를 백엔드와 별도 확정해야 한다.
   - 백엔드 `JWT_SECRET`이 없으면 fallback secret을 사용하므로 배포/운영 환경에서는 명시 secret이 필요하다.
   - 로그인 실패 상태 코드는 `401`, 계정 제한/권한 문제는 `403`, 회원가입 중복은 `409`로 주면 프론트 메시지와 잘 맞는다. 현재 배포 API의 중복 회원가입은 `500`이다.

2. API base URL
   - 프론트는 `VITE_API_BASE_URL`을 사용한다.
   - `.env.example`은 `https://cheatft.leegeon.com/api`로 되어 있다.
   - 이 값을 쓰면 `apiRequest('/login')`처럼 호출해야 하고, `apiRequest('/api/login')`로 부르면 `/api/api/login`이 된다.

3. 응답 래핑
   - 백엔드는 `data` 래핑.
   - 프론트 서비스 함수에서 `return payload.data`로 통일하는 편이 화면 컴포넌트가 단순해진다.

4. 비동기 작업 흐름
   - `POST /api/checks`, `POST /api/analysis`는 `202`와 id를 반환한다.
   - 결과 조회 폴링 간격, pending/failed 상태 응답, 완료 전 응답 형태가 필요하다.

5. 페이지네이션
   - 명세는 `page`, `limit`, `pagination` 객체를 사용한다.
   - 프론트는 목록 화면에서 `currentPage`, `totalPages`, `totalItems`를 그대로 쓸 수 있다.
   - 현재 커뮤니티는 `GET /posts`에 `category`, `keyword`, `page`, `limit`을 전달한다.
   - 현재 리포트는 `GET /reports`에 `keyword`, `date`, `score`, `page`, `limit`을 전달한다.
   - 2026-07-26 배포 API 확인 기준 `checks`, `reports`, `posts`, `analysis`의 page/limit/filter query는 실제 분할/필터에 반영되지 않는다.

6. 점수/라벨 체계
   - 신뢰도: 화면은 0~5 또는 1~5 점수와 `신뢰 가능`, `주의` 같은 라벨을 사용한다.
   - 편향성: 화면은 긍정/중도/부정과 0~100 bias score를 사용한다.
   - 백엔드가 숫자만 줄지, 라벨/색상/설명까지 줄지 정해야 한다.

7. 검증 결과 정렬/필터
   - 2026-07-15 현재 프론트는 `sort` query를 보내지 않고 수신 결과를 로컬 정렬한다.
   - 백엔드에서 서버 정렬을 공식 지원하면 `sort=latest|relevance` 계약을 다시 열면 된다.
   - 연관도 기준 필드는 `relevanceScore`를 우선 추천한다. 0~100 정수 또는 0~1 소수 중 하나로 확정해야 한다.
   - 현재 실제 `GET /api/checks/{id}` article 필드는 `articleId`, `press`, `title`, `description`, `date`, `url`이다. `publishedAt`, `viewCount`, `relevanceScore`, `summary`는 아직 오지 않는다.
   - 언론사 필드는 백엔드 `PRESS_MAPPING`의 oid 문자열 또는 정규화된 언론사명 중 하나를 주면 된다. 둘 다 줄 경우 프론트는 `press`를 우선 읽고 `pressName/publisher/mediaName`을 fallback으로 읽는다.

## 연결 순서 추천

1. 완료: `src/services/apiClient.js`의 반환 정책을 `data` 중심으로 확정
2. 완료: `src/services/cheatftApi.js`에 도메인별 API 함수 추가
3. 완료: 홈, 검증, 알고리즘 분석, 리포트, 커뮤니티, 글 작성, 인증 1차 연결. 마이페이지 1차 연결은 과거 작업이며 현재 화면은 제거됨
4. 완료: 조회 화면에서 API 성공 후 빈 배열을 프론트 목업으로 덮지 않도록 보강
5. 진행: 홈/검증하기 프론트 더미 fallback 제거 완료. 다음으로 남은 화면 내부 목업 배열을 `src/mocks/` 또는 `src/data/`로 이동하거나 제거
6. 다음: 기사 상세 직접 조회, 커뮤니티 상세, 댓글, 로그아웃, 토큰 갱신, 다운로드 API 명세 추가
7. 다음: 실제 백엔드 응답이 확정되면 화면별 변환 함수와 표시 필드 정리

## 기존 문서와의 차이

`cheatft_web/docs/backend-handoff.md`의 초기 제안:

- `/auth/login`
- `/auth/signup`
- `/users/me`
- `/fact-checks`
- `/bias-analyses`

`cheatft_api/README.md`의 현재 명세:

- `/api/login`
- `/api/signup`
- `/api/profile`
- `/api/checks`
- `/api/analysis`

따라서 새 endpoint를 추가하거나 기존 경로를 바꾸기 전에는 백엔드 담당자와 경로를 하나로 통일해야 한다. 현재 구현 확인은 `cheatft_api/src`를 우선 보고, `cheatft_api/README.md`는 보조 명세로 본다.
