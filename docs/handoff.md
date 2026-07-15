# Handoff

마지막 갱신: 2026-07-15
마지막 전체 프로젝트 스캔: 2026-07-15

새 채팅에서 이어받을 때는 이 파일을 먼저 읽고, 필요한 경우 `cheatft_web/docs/code-map.md`, `cheatft_web/docs/backend-contract.md`, `cheatft_web/docs/api-integration-log.md`만 추가로 확인한다. 기존 루트 `docs/` 문서들은 2026-07-15에 `cheatft_web/docs/`로 이동했다. `cheatft_web`과 `cheatft_api`는 2026-07-15 기준 전체 텍스트 소스/문서를 다시 확인해 문서들에 요약해 두었다. 같은 날 `understand` 스킬 pre-flight/scan을 실행해 92개 파일을 스캔했고, `.understand-anything/` 분석 산출물 폴더가 생성됐다.

## 현재 상태

- 프로젝트 기준 폴더는 `C:\Users\eunhy\Desktop\동아리`이다.
- 루트 폴더에는 `.git` 디렉터리가 보이지만 `HEAD`가 없어 루트 git 저장소로 동작하지 않는다. 작업 기준은 여전히 하위 프로젝트별로 본다.
- 핵심 개발 대상은 `cheatft_web` React/Vite 프론트엔드이다.
- 로컬 `cheatft_api`는 이제 Express/PostgreSQL/JWT 기반 Node 백엔드 코드와 API 명세 `README.md`를 포함한다.
- `cheatft_api`는 확인/분석을 위해 읽을 수 있다. 단, 백엔드 수정은 사용자가 명시적으로 요청하기 전까지 하지 않는다.
- 배포 API는 `https://cheatft.leegeon.com/api`에서 응답한다. 일부 라우트는 실제 DB/토큰/네이버 뉴스 검색 흐름이고, `summary/reports/posts/profile`은 아직 더미 컨트롤러 중심이다.
- `cheatft_web`과 `cheatft_api`는 각각 `.git`이 있지만 Codex sandbox 사용자 기준으로 `dubious ownership`가 발생한다. Git 상태 확인이 필요하면 safe.directory 설정 여부를 먼저 확인한다.
- `cheatft_web`에는 `node_modules/`와 `dist/`가 이미 있으나 생성물/의존성 폴더이므로 일반 맥락 파악 때는 다시 훑지 않는다.
- `.understand-anything/`은 2026-07-15 전체 스캔용 산출물이다. 일반 맥락 파악 때는 다시 훑지 않는다.

## 빠른 시작 절차

1. `cheatft_web/docs/handoff.md`를 읽는다.
2. 문서 역할을 먼저 확인해야 하면 `cheatft_web/docs/README.md`를 읽는다.
3. 코드 위치나 화면 구조가 필요하면 `cheatft_web/docs/code-map.md`를 읽는다.
4. API 연동이나 백엔드와의 계약 확인이 필요하면 `cheatft_web/docs/backend-contract.md`와 `cheatft_web/docs/api-integration-log.md`를 읽는다.
5. 프론트 실행/환경변수 중심이면 `cheatft_web/README.md`도 읽는다.
6. 실제 구현 확인이 필요한 파일만 추가로 연다.
7. 백엔드 확인이 필요하면 `cheatft_api`의 관련 파일을 읽는다. 수정은 별도 요청 없이는 하지 않는다.

## 프론트엔드 요약

- 실행 위치: `C:\Users\eunhy\Desktop\동아리\cheatft_web`
- 권장 Node: `.nvmrc` 기준 Node 22
- 프레임워크: React 19, React Router 7, Vite 8
- 화면 데이터: 홈/검증하기는 프론트 더미 fallback을 제거하고 백엔드 API 응답만 표시한다. 리포트/커뮤니티/알고리즘 분석 등 일부 화면에는 아직 실패 시 기존 목업 fallback이 남아 있다.
- API 응답이 성공했지만 배열이 비어 있으면 해당 빈 상태를 그대로 보여주며 프론트 목업을 섞지 않는다. 검증하기 검색 결과는 API 실패 시에도 프론트 더미데이터를 섞지 않고 오류/빈 상태를 보여준다.
- 현재 API 기본 URL: `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`
- API 준비: `src/services/apiClient.js`에 공통 요청/토큰 처리, `src/services/cheatftApi.js`에 명세 기반 도메인 호출 함수가 있음
- 인증: `/login`의 `accessToken`을 `localStorage`에 저장하고 Bearer 토큰으로 첨부. `/login` 응답에 `accessToken`이 없으면 실패 처리. `/signup`은 성공 후 로그인 화면으로 이동. `/community/write`, `/algo`는 비로그인 상태에서 `/login`으로 보내고, 로그인 성공 후 원래 경로로 복귀한다. 마이페이지 화면/라우트는 2026-07-15 작업에서 제거됐다.
- 검색 URL: `src/utils/search.js`가 `/search?q=...`를 만든다
- 언론사 표시: `src/utils/press.js`가 백엔드 oid/name 정규화, 네이버 `office_logo` 기반 로고 URL, 미매핑 `언론사(021)` 관측 저장을 담당한다. 관측값은 브라우저 `localStorage`의 `cheat-ft-observed-press-map`에 origin별로 저장되고, 개발자도구 Console에서 `cheatFtPressList()`로 `번호 - 언론사명` 목록을 복사할 수 있다.
- API 표시 텍스트: `src/utils/text.js`의 `cleanDisplayText()`가 `&quot;`, `&amp;`, `&#39;` 같은 HTML entity를 디코딩하고 남은 HTML 태그를 제거한다.
- 글 작성: `CommunityWriteView.jsx`가 `sessionStorage`에 임시 저장하고, 등록 시 `POST /posts`를 호출한다. API 기본 URL이 없거나 요청이 실패하면 오류를 보여주고 임시 저장은 유지된다.
- 로컬 `cheatft_api`는 실제 서버 코드가 있으나 DB 환경변수, `pg` 의존성 설치, JWT secret, 네이버 API 키 등이 필요하다. 프론트는 현재 배포 API 주소를 사용한다.

## 2026-07-15 전체 스캔/문서 최신화

- `understand` 스킬의 pre-flight를 실행했고, 플러그인 core 빌드를 위해 `pnpm install`, `pnpm approve-builds --all`, `pnpm --filter @understand-anything/core build`를 수행했다.
- `.understand-anything/.understandignore`와 `intermediate/scan-result.json`, `intermediate/batches.json`이 생성됐다.
- scan 결과는 92개 파일, 8개 semantic batch였다. `node_modules`, `.git`, `dist`, lock/minified 파일은 기본 ignore 대상이다.
- 스캔에는 `세미나/claude/__MACOSX` 압축 부산물과 `회의록` 변환본도 포함됐다. 문서 최신화 기준으로는 `cheatft_web`, `cheatft_api`, `cheatft_web/docs`를 우선 신뢰한다.
- 루트 `.git`은 실제 저장소로 동작하지 않고, 하위 프로젝트 git은 `dubious ownership`가 재현됐다.
- `cheatft_web/README.md`의 오래된 “cheatft_api는 명세 문서뿐” 설명과 이동 전 docs 경로를 최신 상태로 수정했다.

## 2026-07-15 백엔드 코드 반영/프론트 조정

- 기존 루트 `docs/` 문서를 `cheatft_web/docs/`로 이동했다. 이후 문서 기준 위치는 `cheatft_web/docs`이다.
- `cheatft_api`는 실제 Node/Express 백엔드 프로젝트로 바뀌었다.
  - 주요 파일: `src/index.js`, `src/routes/*.js`, `src/controllers/*.js`, `src/services/*.js`, `src/models/*.js`, `src/middlewares/auth.middleware.js`, `src/config/db.config.js`
  - 의존성: `express`, `pg`, `jsonwebtoken`, `bcrypt`, `cors`, `dotenv`, `axios`
  - `POST /api/checks`는 선택 인증이고, 네이버 뉴스 API 키가 없거나 실패하면 fallback article을 DB에 저장한다.
  - `POST /api/analysis`, `GET /api/analysis/{id}`는 `verifyToken`을 요구한다.
- 배포 API 확인 결과:
  - `/api/summary`와 `/api/profile`은 200 응답.
  - `/api/me`는 토큰 없으면 401.
  - `/api/login`은 현재 `UserModel.findByEmail is not a function` 메시지와 함께 401 응답. 로컬 `cheatft_api/src/models/user.model.js`가 사용자 모델이 아니라 checks 모델 내용으로 들어간 상태와 일치한다.
  - `/api/checks/452`는 새 DB 기반 API에서는 기존 더미 id가 없어 404.
  - `/api/health`는 서버 상태 확인 라우트로 로컬 코드에 존재한다.
- 배포 프론트 `https://cheatft.leegeon.com/`는 현재 Vite dev server 형태로 소스를 서빙한다. 확인 시 `#root`가 비어 있었고 배포 소스는 `/algo`가 아직 보호 라우트가 아닌 이전 프론트였다.
- 프론트 변경:
  - `src/App.jsx`: `/algo`를 보호 라우트로 변경하고, 로그아웃 시 `/algo`에서도 홈으로 이동.
  - `src/utils/press.js`: 백엔드 `checks.service.js`의 `PRESS_MAPPING` 기준 언론사 매핑 공용 유틸 추가.
  - `VerificationView.jsx`: 네이버 전체 officeList 순번 매핑 제거, 백엔드 press 표 기준 분류만 사용, API 성공 시 프론트 더미 섞기 제거, 정렬 변경 때 `POST /checks` 재요청하던 동작 제거, `description/date/pubDate/pub_date` 수신 보강.
  - `AlgoView.jsx`: 같은 press 유틸을 사용하고 `description/date` 후보를 받도록 보강.
- 검증:
  - `npm run lint` 통과
  - `npm test` 통과
  - Codex 번들 Node 기반 `vite build` 통과

## 2026-07-15 이번 창 UI/실데이터 전환 정리

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 배포 실패 원인 확인:
  - `https://cheatft.leegeon.com/`은 Vite dev HTML(`/@vite/client`, `/src/main.jsx`)을 서빙한다.
  - 배포된 `/src/App.jsx`는 `/src/services/apiClient.js`를 import하지만 서버에서 해당 파일이 404라 현재 프론트 배포 산출물이 불완전하다.
  - `/api/summary`, `/api/health`, `/api/checks`는 응답하므로 주된 실패 원인은 백엔드 전체 중단이 아니라 프론트 배포 방식/파일 누락이다.
  - `/api/login`은 여전히 `UserModel.findByEmail is not a function` 오류를 반환한다.
- UI 문구/구조 변경:
  - 사이트 전반의 `알고리즘 편향성` 표현을 `신뢰도` 중심 표현으로 바꿨다.
  - 뉴스 상세의 `편향성 지수`를 `신뢰도`로 바꾸고, 관련 키워드/관련 뉴스/관련 댓글/AI 분석 코멘트 영역을 제거했다.
  - `교육 & 정보` 탭 이름을 `커뮤니티`로 바꾸고 공지사항, 가이드, 튜토리얼 항목을 제거했다.
  - 마이페이지 라우트/nav/import/컴포넌트를 제거했고 `MyPageView.jsx`를 삭제했다.
  - 홈 프로모션 배너의 `Cheat F/T 소개 보기 >` 버튼만 제거했다.
- 홈/검증하기 실데이터 전환:
  - `HomeView.jsx`와 `VerificationView.jsx`에서 프론트 더미 데이터와 fallback 결과를 제거했다.
  - 홈 최신 팩트체크는 `recentChecks.slice(0, 3)` 제한 없이 백엔드가 주는 항목을 모두 표시한다. 현재 배포 `/api/summary`가 `recentChecks` 1개만 주면 화면에도 1개만 나온다.
  - 검증하기는 텍스트 검색만 남기고 URL 링크 검색 탭을 제거했다.
  - 검색 결과는 `POST /checks` 후 `GET /checks/{id}`의 `articles`만 표시한다. 현재 실제 응답 필드는 `articleId`, `press`, `title`, `description`, `date`, `url` 중심이다.
  - 검증하기 초기 화면의 최신 팩트체크 카드와 검색 결과 카드는 제목 재검색이 아니라 뉴스 상세로 이동한다.
  - `DetailView.jsx`는 클릭한 기사 객체를 route state와 `sessionStorage`로 받아 제목, 언론사, 날짜, 설명, 원문 URL, 신뢰도를 표시한다. 직접 URL 진입이나 새로고침 후 저장된 기사 정보가 없으면 상세를 복원할 백엔드 API가 아직 없다.
- 검증:
  - `npm run lint` 통과
  - `npm test` 통과
  - Codex 번들 Node 기반 `vite build` 통과

## 2026-07-05 API 연동 작업 기록

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 프론트에 `src/services/cheatftApi.js`를 추가했다.
- `src/services/apiClient.js`에 `apiData`, accessToken 저장/삭제/첨부 로직을 추가했다.
- `VITE_API_BASE_URL=https://cheatft.leegeon.com/api` 기준으로 프론트 내부에서는 `/summary`, `/login`, `/checks`처럼 호출한다.
- 연결된 화면:
  - 홈: `GET /summary`
    - 최신 팩트체크 클릭 시 해당 제목으로 검증 화면 이동
  - 검증하기: `POST /checks`, `GET /checks/{id}`
    - 검색어 없는 기본 화면도 `GET /summary`의 `recentChecks`로 최신 팩트체크 표시
    - 결과 카드에 `백엔드 API` 또는 `프론트 목업` 출처 배지 표시
    - API 성공 후 기사 배열이 비어 있으면 프론트 예시를 섞지 않고 빈 상태 표시
  - 알고리즘 분석: `POST /analysis`, `GET /analysis/{id}`
  - 리포트: `GET /reports`에 `keyword`, `date`, `score`, `page`, `limit` 전달
  - 커뮤니티: `GET /posts`에 `category`, `keyword`, `page`, `limit` 전달
  - 글 작성: `POST /posts`
  - 로그인: `POST /login`, `accessToken` 필수
  - 회원가입: `POST /signup`, 성공 후 로그인 화면 이동
  - 마이페이지: 당시에는 `GET /profile`을 연결했으나 2026-07-15 이후 화면/라우트가 제거됐다.
- 당시 조회 화면은 API가 없거나 실패하면 기존 목업 데이터를 사용하도록 fallback을 유지했다. 2026-07-15 이후 홈/검증하기는 프론트 더미 fallback을 제거했다. 로그인, 회원가입, 게시글 등록은 실패 시 오류를 보여준다.
- 검증: `npm run lint`, `npm test`, 번들 Node로 `vite build` 통과.
- 일반 `npm run build`는 현재 셸 Node 24.13.0에서 기존 Vite 네이티브 종료 이슈가 재현될 수 있다. Node 22 LTS 또는 Codex 번들 Node에서는 빌드가 통과했다.

## 2026-07-10 백엔드 더미 API 반영

- 백엔드 담당자가 `README.md`의 dummy data를 반환하는 배포 API를 제공했다.
- 주소는 `https://cheatft.leegeon.com/api`이고, 프론트 `.env.local`과 `.env.example`은 이 주소를 기준으로 맞췄다.
- 백엔드 설명상 parameter 처리는 아직 구현되지 않아 입력과 무관하게 같은 더미 데이터가 반환될 수 있다.
- `GET /summary` 실제 응답은 `todayStats`, `recentChecks`, `biasStatus`를 포함한다.
- 2026-07-10 직접 확인한 `/summary`의 `recentChecks`는 1개였다.
- `POST /checks`는 현재 `checkId: 452`를 반환했고, `GET /checks/452`는 기사 배열 `articles`에 1개 기사를 반환했다. 다만 응답의 `totalArticles`와 `pagination.totalItems`는 12로 표시된다.
- 검증하기 화면은 API 응답으로 만든 결과에 `백엔드 API` 배지를 보여주고, 실패로 기존 예시를 표시할 때는 `프론트 목업` 배지를 보여준다.
- API 요청이 성공했지만 `articles`가 비어 있으면 KBS/뉴스1 프론트 예시를 섞지 않고 빈 상태를 보여준다.
- API 실패 시에만 기존 프론트 목업 예시로 fallback한다.
- `.env.local`을 바꾼 뒤에는 Vite dev server를 재시작해야 새 API 주소가 반영된다.

## 2026-07-12 백엔드 예시 구조 수신 보강

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다. API 명세 `README.md`는 읽기만 했다.
- `src/services/apiClient.js`는 HTTP status가 성공이어도 응답 body의 `status`가 400 이상이면 `ApiError`로 처리한다.
- `HomeView.jsx`는 `GET /summary` 성공 시 `recentChecks` 또는 `biasStatus.categories`가 빈 배열이어도 프론트 기본 예시로 덮지 않는다.
- `AlgoView.jsx`는 `POST /analysis` 후 `GET /analysis/{id}` 응답의 `relatedArticles`, `counterArticles`, `insights`, `summaryStats`를 API 성공 상태와 fallback 상태로 분리한다. API 성공 후 배열이 비면 빈 상태를 보여준다.
- `ReportView.jsx`는 `GET /reports` 성공 시 `reports`가 비어 있으면 빈 리포트 상태를 보여주고, 실패할 때만 기존 리포트 목업을 쓴다.
- `CommunityView.jsx`는 `GET /posts` 성공 시 `posts`가 비어 있으면 빈 게시글 상태를 보여주고, 실패할 때만 기존 커뮤니티 목업을 쓴다.
- 당시 `MyPageView.jsx`는 `GET /profile`의 중첩 객체(`personalDashboard`, `infoConsumptionBias`, `reliabilityDistribution`, `monthlySummary` 등)가 부분적으로 빠져도 화면이 깨지지 않도록 프론트 기본값과 병합했다. 2026-07-15 이후 마이페이지 화면/라우트는 제거됐다.
- 조회 화면 일부에 `백엔드 API 응답 표시 중`, `프론트 목업 fallback 표시 중` 같은 출처 안내가 추가되었다.
- 검증: `npm run lint`, `npm test`, Codex 번들 Node 기반 `vite build` 통과.
- 일반 `npm run build`는 현재 기본 셸 Node/Vite 네이티브 이슈로 `38 modules transformed` 이후 exit 1이 재현되었다. Codex 번들 Node에서는 빌드가 통과했다.

## 2026-07-12 홈 UI/브랜딩 조정

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 홈 화면과 전역 CSS 중심으로 시각/반응형 조정을 진행했다.
- 상단 navbar 로고를 기존 JSX/SVG 조합에서 이미지 asset으로 교체했다.
  - 추가 asset: `cheatft_web/src/assets/cheatft-logo.png`
  - 반영 파일: `cheatft_web/src/App.jsx`, `cheatft_web/src/index.css`
  - 로고 아래 소개 문구는 제거했다.
- 홈 히어로 오른쪽 저울 일러스트를 생성 이미지 asset으로 교체했다.
  - 추가 asset: `cheatft_web/src/assets/home-fact-scale.png`
  - 반영 파일: `cheatft_web/src/components/views/HomeView.jsx`
  - 기존 JSX/CSS 도형 조립 방식의 저울 그림은 제거하고 `<img>`로 표시한다.
- 홈 히어로 왼쪽 문구/검색 영역은 오른쪽 이미지와 균형이 맞도록 크기, 폭, 여백을 줄였다.
- 한국어 줄바꿈이 글자 단위로 깨지지 않도록 전역 `word-break: keep-all`, `overflow-wrap: break-word` 계열 보정을 추가했다.
- 기능 카드 3개는 아이콘이 왼쪽, 텍스트가 오른쪽에 오도록 구조를 조정했다. 창이 좁아지면 카드 그리드는 1열로 내려가 글자가 세로로 찢어지지 않게 했다.
- 홈 하단의 최신 팩트체크/오늘의 검증 통계/알고리즘 편향성/프로모션 배너 영역은 중간 폭부터 1열로 내려가도록 조정했다.
- `오늘의 검증 통계` 내부 3개 항목은 창이 줄어도 세로로 쌓이지 않고 가로 3칸 중앙 정렬을 유지하도록 보정했다.
- 프로모션 배너의 `Cheat F/T 소개 보기 >` 버튼은 줄바꿈되지 않도록 `white-space: nowrap`으로 보정했다.
- 검증: `npm run lint`, Codex 번들 Node 기반 `npm run build` 통과.

## 2026-07-12 검증하기 필터/정렬/언론사 매핑 보강

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 아래 항목은 2026-07-12 당시 작업 기록이다. 현재 동작은 2026-07-15 백엔드 반영으로 일부 대체됐다.
- 이 섹션의 기록 당시 `VerificationView.jsx`는 API가 성공하면 백엔드 API 결과만 보여주고, 프론트 더미데이터는 API 실패/미설정 fallback으로만 표시했다. 2026-07-15 이번 창 작업 이후 검증하기의 프론트 더미 fallback은 제거됐다.
- 이 섹션의 기록 당시 카드에는 `백엔드 API` 또는 `프론트 더미` 배지와 출처 분류, 조회수, 연관도 값을 표시했다. 현재 검증하기 카드의 프론트 더미 배지는 제거됐다.
- 정렬 select는 `최신순`, `조회수순`, `연관도순`을 제공한다. 현재 API 요청에는 `sort`를 보내지 않고, 프론트에서 현재 수신 결과를 정렬한다.
- `article.press`가 백엔드 `PRESS_MAPPING`의 oid 또는 언론사명으로 오면 `src/utils/press.js`에서 언론사명과 분류로 변환한다.
- 이 섹션의 기록 당시 화면 필터는 `전체 출처`, `방송/통신사`, `종합지`, `경제지`, `인터넷/IT지`, `기타 출처`, `프론트 더미`였다. 현재 검증하기 필터에서는 `프론트 더미`가 제거됐다.
- `언론사(047)`처럼 백엔드 fallback 문자열에 oid가 들어간 경우도 백엔드 표로 보정한다.
- `press`, `pressName`, `publisher`, `mediaName` 필드 후보를 순서대로 확인해 언론사명과 분류를 만든다.
- 검증: `npm run lint` 통과.

## 2026-07-12 로그인/회원가입 UX 보강

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `LoginView.jsx`는 이메일 형식 검증, 제출 중 입력/버튼 비활성화, `401`/`403`/API 미설정 오류 메시지를 보강했다.
- 로그인 성공 시 `location.state.from`이 있으면 원래 접근하려던 경로로 복귀하고, 없으면 홈으로 이동한다.
- `SignupView.jsx`는 이메일 형식, 닉네임 2~20자, 비밀번호 8자 이상, 비밀번호 확인 일치 검증을 추가했다.
- 회원가입 실패 시 `409`는 이메일/닉네임 중복 안내로 표시하고, 성공 시 로그인 화면으로 이동한다.
- 당시 `App.jsx`는 `/mypage`, `/community/write`를 보호 경로로 처리했다. 2026-07-15 이후 `/mypage`는 제거됐고 `/community/write`, `/algo`가 보호 경로로 남아 있다.
- 검증: `npm run lint`, `npm test` 통과.

## 2026-07-15 이번 창 언론사 로고/텍스트 표시 보강

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 사용자가 전체 스캔을 원하지 않아 실제 작업에 필요한 프론트 파일과 지정 문서만 확인했다.
- `src/utils/press.js`
  - 백엔드 `PRESS_MAPPING` 18개 oid에 대해 네이버 언론사 홈 `office_logo` CDN URL을 매핑했다.
  - `getPressOid()`, `getPressLogoUrl()`, `recordObservedPress()`를 추가했다.
  - `언론사(021)`처럼 미매핑 fallback 문자열이 화면 데이터에 등장하면 브라우저 `localStorage`의 `cheat-ft-observed-press-map`에 `021: "언론사(021)"` 형태로 누적 저장한다.
  - 이미 아는 oid는 `056: "KBS"`처럼 저장한다. 같은 응답에 `pressName/publisher/mediaName` 후보가 있으면 이름 후보를 함께 저장할 수 있다.
  - 개발자도구 Console 헬퍼: `cheatFtPressList()`는 `021 - 언론사(021)` 같은 복사용 문자열을 반환, `cheatFtPressMap()`은 객체 반환, `cheatFtClearPressList()`는 저장값 삭제.
  - 저장은 `localStorage`라 창을 닫아도 유지되지만 origin별로 분리된다. 예: `http://localhost:3001`, `http://localhost:5173`, `https://cheatft.leegeon.com`은 서로 다른 저장소를 쓴다.
- `VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`
  - 언론사 원형 텍스트 배지에 로고 이미지 fallback을 추가했다. `logoUrl`이 있으면 `<img>`를 표시하고 이미지 로드 실패 시 기존 앞글자 텍스트가 보인다.
  - API 기사/분석/리포트 매핑 시 `recordObservedPress()`를 호출해 미매핑 언론사 번호를 누적한다.
- `src/utils/text.js`
  - `decodeHtmlEntities()`, `cleanDisplayText()`를 추가했다.
  - `&quot;SK하이닉스&quot;`처럼 보이던 제목/요약을 `"SK하이닉스"`처럼 표시하도록 HTML entity를 디코딩한다.
- `HomeView.jsx`, `VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`, `CommunityView.jsx`, `DetailView.jsx`
  - API에서 온 제목/요약/게시글/상세 표시 문자열에 `cleanDisplayText()`를 적용했다.
- 인증 메모:
  - 프론트 로그인/회원가입 UI와 API 호출 흐름은 있다.
  - 실제 동작을 완성하려면 백엔드 `cheatft_api/src/models/user.model.js`를 user model로 복구하고 `findByEmail/createUser/findById`, DB users 테이블, bcrypt/JWT 흐름을 맞춰야 한다. 현재 배포 `/api/login`은 `UserModel.findByEmail is not a function` 오류가 알려져 있다.
- 검증:
  - `npm run lint` 통과
  - `npm test` 통과
  - Codex 번들 Node 기반 `npm run build` 통과

다음 창 시작 명령 예시:

```text
cheatft_web/docs/handoff.md 먼저 읽고, 필요하면 cheatft_web/docs/README.md, code-map.md, backend-contract.md, api-integration-log.md만 추가로 읽어서 현재 맥락 잡아줘.
이번엔 전체 스캔하지 말고, 실제 작업에 필요한 파일만 열어봐.
cheatft_api는 확인 가능하지만 내가 명시적으로 요청하기 전에는 수정하지 마.
이전 창 마지막 작업은 언론사 로고 표시, 미매핑 언론사 번호 localStorage 누적 저장, HTML entity 디코딩 보강이야.
```

검증 명령:

```powershell
cd C:\Users\eunhy\Desktop\동아리\cheatft_web
npm run lint
npm test
npm run build
npm run check
```

`README.md`와 기존 메모에 따르면 Node 24 계열에서는 Vite 프로덕션 빌드가 네이티브 예외로 종료된 이력이 있다. Node 22 LTS에서 검증하는 것을 우선한다.

연동 확인은 브라우저 개발자도구 Network 탭에서 `summary`, `checks`, `analysis`, `reports`, `posts`, `login`, `signup` 요청이 나가는지 확인한다. 홈/검증하기는 API 실패 시 더미 결과를 섞지 않으므로 오류/빈 상태를 확인한다. 리포트/커뮤니티/알고리즘 분석 등 fallback이 남아 있는 화면은 실제 연동 성공 여부를 Network 탭의 status code와 response body로 확인한다. 로그인, 회원가입, 게시글 등록은 API 실패 시 오류가 보인다.

## 백엔드/API 요약

- 위치: `C:\Users\eunhy\Desktop\동아리\cheatft_api`
- 성격: Express/PostgreSQL/JWT 백엔드 구현체와 공통 응답 포맷/더미 데이터 형태를 포함한 API 명세
- 작업 원칙: `cheatft_api`는 사용자가 명시적으로 요청하기 전까지 수정하지 않는다. 구현 확인이 필요하면 관련 파일만 읽기 전용으로 참고한다.
- 공통 응답: `{ "status": number, "message": string, "data": ... }`
- 현재 명세 경로:
  - `GET /api/summary`
  - `POST /api/signup`
  - `POST /api/login`
  - `POST /api/checks`
  - `GET /api/checks/{id}`
  - `POST /api/analysis`
  - `GET /api/analysis/{id}`
  - `GET /api/reports`
  - `GET /api/posts`
  - `POST /api/posts`
  - `GET /api/profile`
  - `GET /api/me`
  - `GET /api/health`

프론트의 `cheatft_web/docs/backend-handoff.md`는 원래 회의용 제안 문서였고, 실제 `cheatft_api` 구현/README와 일부 경로가 다르다. 최신 매핑은 `cheatft_web/docs/backend-contract.md`를 우선 본다.

## 다음 작업 후보

- `cheatft_web`의 남은 목업 배열을 `src/mocks/` 또는 `src/data/`로 분리
- 기사 상세 직접 조회, 커뮤니티 상세, 댓글처럼 현재 API 명세에 없는 화면 계약 추가
- 백엔드 담당자와 인증 방식, 오류 응답, 토큰 만료/갱신, 페이지네이션, 비동기 분석 상태 조회 방식 확정
- 검증하기의 조회수/연관도/언론사 필드명을 백엔드 실제 응답과 최종 확정
- 실제 백엔드 응답 필드가 더 풍부해지면 화면별 변환 로직 정리
- 남은 프론트 목업 배열은 리포트/알고리즘 분석/커뮤니티 등 필요한 화면별로 분리하거나 제거

## 자료 폴더 주의

- `회의록/`, `자료/`, `파일/`, `세미나/`는 이번 전체 스캔 대상이 아니었다. 요청한 날짜/주제와 직접 관련 있을 때만 연다.
- PDF, Word, 이미지, 압축 파일은 필요한 경우에만 열고, 일반 코드 작업 시작 시에는 읽지 않는다.
