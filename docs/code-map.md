# 코드맵

마지막 갱신: 2026-08-02
마지막 전체 프로젝트 스캔: 2026-07-15

이 문서는 새 채팅에서 전체 코드를 다시 훑지 않도록 만든 지도이다. 정확한 구현 확인이 필요할 때만 해당 파일을 직접 연다.

## 전체 구조

```text
C:\Users\eunhy\Desktop\동아리
├─ cheatft_web/     React/Vite 프론트엔드
├─ cheatft_api/     Express/PostgreSQL/JWT 백엔드 API 구현체
├─ 회의록/          회의록 문서와 변환 Markdown
├─ 자료/            기획안, 가이드 PDF
├─ 파일/            이미지와 기타 자료
├─ 세미나/          Claude 설정/스킬 관련 압축 자료
└─ cheatft_web/docs/ Codex 온보딩, 코드맵, API 계약 요약
```

## docs

- `cheatft_web/docs/handoff.md`: 다음 세션 시작용 요약. 먼저 읽을 파일.
- `cheatft_web/docs/README.md`: 문서 색인과 최신/역사 문서 구분.
- `cheatft_web/docs/code-map.md`: 현재 파일. 프로젝트 구조와 파일별 역할.
- `cheatft_web/docs/backend-contract.md`: 프론트 화면과 백엔드 API 구현의 최신 매핑.
- `cheatft_web/docs/api-integration-log.md`: API 연동 작업 기록과 확인 방법.
- `cheatft_web/docs/press-reliability.md`: 언론사별 분류, 신뢰도, AI 별점 참고값, 판단 이유 검토표.
- `cheatft_web/docs/AGENTS.md`: Codex 작업 안내 백업/문서화본.
- `cheatft_web/docs/backend-handoff.md`: 초기 백엔드 협의 제안 메모. 최신 계약 문서가 아니라 역사/협의용으로 본다.
- `cheatft_web/docs/observed-unmapped-press-names.csv`: 배포 API 재검색에서 관측됐고 현재 백엔드 `PRESS_MAPPING`에도 없는 fallback oid를 네이버 언론사 홈 이름까지 확인한 목록. 관리 단순화를 위해 이 CSV 하나만 유지한다.

## cheatft_web 개요

Cheat F/T 프론트엔드이다. 가짜뉴스 검증, 출처 신뢰도 확인, 신뢰도 분석, 커뮤니티 화면을 제공한다. 현재는 백엔드 API(`https://cheatft.leegeon.com/api`)를 우선 호출한다. 홈/검증하기/신뢰도 분석/팩트체크 리포트는 프론트 더미 fallback을 제거하고 API 응답만 표시하며, 커뮤니티 일부 화면에는 아직 실패 시 기존 목업 fallback이 남아 있다. API 요청이 성공했지만 응답 배열이 비어 있으면 프론트 목업을 섞지 않고 빈 상태를 보여준다. 로컬 `cheatft_api`는 Express/PostgreSQL/JWT 기반 구현체이며, Codex는 수정하지 않고 읽기 전용으로만 확인한다.

기술 스택:

- React `^19.2.5`
- React DOM `^19.2.5`
- React Router DOM `^7.16.0`
- Vite `^8.0.10`
- ESLint `^10.2.1`
- Tailwind CSS 의존성은 설치되어 있으나 현재 화면은 대부분 인라인 스타일과 일부 전역 CSS를 사용한다.

스크립트:

- `npm run dev`: Vite 개발 서버
- `npm run lint`: ESLint
- `npm test`: Node 내장 test runner
- `npm run build`: Vite production build
- `npm run check`: lint, test, build 순차 실행

환경:

- `.nvmrc`: `22`
- `.env.example`: `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`
- `.env.local`: 로컬 개발용 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`가 추가되어 있음
- `README.md`: 실행/배포/환경변수/API 연동 상태/현재 제약 요약. 프론트 동작, 라우트, 배포, 환경변수, API 연동, 인증 흐름, 주요 제약이 바뀌면 매번 함께 갱신한다.
- `AGENTS.md`: Codex 새 작업 시작/종료용 고정 지침. 반복 프롬프트 대신 시작 절차, 백엔드 읽기 전용 원칙, 문서 갱신 원칙, `종료` 요청 처리 규칙을 기록한다.

생성물/의존성:

- `node_modules/`: 재스캔 제외
- `dist/`: 빌드 산출물, 재스캔 제외
- 과거 Vite build 로그와 `.understand-anything/` 전체 스캔 산출물은 2026-07-31 임시 파일 정리에서 삭제했다.

## cheatft_web 주요 파일

- `package.json`: 실행/검증 스크립트와 의존성.
- `vite.config.js`: React plugin, dev server `port: 3001`, `allowedHosts: ["cheatft.leegeon.com"]` 설정.
- `eslint.config.js`: JS recommended, React Hooks, React Refresh 설정. `dist`는 ignore.
- `index.html`: Vite HTML 진입점. 문서 제목은 `Cheat F/T`, favicon은 `public/favicon.png`를 참조한다.
- `src/main.jsx`: `BrowserRouter`로 `App`을 감싸서 렌더링.
- `src/App.jsx`: 전역 nav, 저장된 accessToken 기반 로그인 상태와 현재 사용자 이름 표시, 보호 라우팅, 검색 URL 이동, 기사 상세 route state/sessionStorage 전달의 중심. 앱 진입/보호 라우트 이동/창 재포커스 시 저장 토큰을 `GET /me`로 재확인하고, 신뢰도 분석/리포트 API가 401/403 인증 실패를 받으면 저장 토큰/사용자 정보를 지우고 로그인 화면으로 이동시키는 `handleAuthExpired()`를 `AlgoView`, `ReportView`에 전달한다. 앱 본문은 내부 이중 세로 스크롤 없이 브라우저 기본 페이지 스크롤을 사용한다.
  - `/report`, `/community`용 별도 오른쪽 상단 버튼 분기는 제거되어 다른 화면과 같은 상단바를 사용한다.
- `src/index.css`: 전역 리셋, navbar 반응형, form/status 공용 스타일, 로딩 스피너 애니메이션, 홈 외 주요 화면의 노트북 절반 폭/모바일 폭 반응형 보정.
- `src/App.css`: 현재 비어 있음.
- `src/services/apiClient.js`: `VITE_API_BASE_URL` 기반 `apiRequest`, `apiData`, `ApiError`, 토큰 저장/삭제/첨부, 현재 사용자 정보 저장/삭제 처리.
- `src/services/cheatftApi.js`: `/summary`, `/login`, `/signup`, `/checks`, `/article`, `/keywords`, `/analysis`, `/reports`, `/posts`, `/profile` 도메인 API 함수. 로그인 성공 시 accessToken과 현재 사용자 정보를 저장한다. `/profile` 함수는 남아 있지만 마이페이지 화면은 제거됨.
- `public/favicon.png`: 브라우저 주소창/탭용 Cheat F/T 아이콘. 첨부 이미지의 흰 배경을 투명 처리한 PNG.
- `src/data/pressReliability.js`: 언론사별 분류, 신뢰도 점수/라벨, AI 별점 참고값, 판단 이유 요약을 담은 사이트 반영 원본 데이터. 2026-07-31 기준 백엔드 `PRESS_MAPPING` 69개 모두 신뢰도 기준으로 연결된다.
- `src/utils/press.js`: 백엔드 `checks.service.js`의 `PRESS_MAPPING` 기반 언론사 oid/name 정규화, `pressReliability.js` 기반 화면 필터 분류/신뢰도 조회, 네이버 `office_logo` 로고 URL 매핑, 미매핑 `언론사(021)` 관측값 `localStorage` 누적. 2026-07-31 기준 백엔드 69개 oid와 프론트 oid/name 및 로고 매핑을 맞췄다.
- `src/utils/reliability.js`: 검증하기/뉴스 상세 공용 신뢰도 표시 기준. 입력 점수를 5점 만점으로 정규화하고, `높음` 3.9 이상, `보통` 3.3 이상 3.9 미만, `주의` 3.3 미만 라벨과 색상/게이지 채움 비율을 반환한다.
- `src/utils/search.js`: 검색어 trim과 `/search?q=...` URL 생성.
- `src/utils/text.js`: API 표시 문자열의 HTML entity 디코딩과 HTML 태그 제거.
- `tests/search.test.js`: `normalizeSearchQuery`, `buildSearchPath` 단위 테스트.
- `tests/press.test.js`: 언론사 oid/별칭/미등록 fallback의 분류·신뢰도 조회 단위 테스트.
- `cheatft_web/docs/backend-handoff.md`: 프론트 관점 백엔드 협의 메모. 실제 최신 매핑은 `cheatft_web/docs/backend-contract.md`와 함께 볼 것.

## cheatft_web 라우팅

`src/App.jsx` 기준:

| 경로 | 컴포넌트 | 현재 동작 |
|---|---|---|
| `/` | `HomeView` | 홈, `GET /summary` 응답만 표시. 프론트 더미 fallback 없음. 최신 팩트체크는 백엔드 `recentChecks` 전체 표시 |
| `/search?q=...` | `VerificationView` | 검색어가 있으면 검색 중 로딩 팝업을 표시하고 `POST /checks` 후 `GET /checks/{id}` 응답만 표시. URL 링크 검색/프론트 더미 fallback 없음. 카드 클릭은 뉴스 상세 이동 |
| `/search` | `VerificationView` | `GET /summary`의 `recentChecks`로 최신 팩트체크 표시. 카드 클릭은 뉴스 상세 이동 |
| `/article/:id` | `DetailView type="뉴스"` | 클릭한 기사 객체를 route state/sessionStorage로 먼저 표시하고, 지원 URL이면 `POST /article`로 상세 본문/기자/입력 시간/주제를 보강. API 실패는 화면 오류로 노출하지 않음 |
| `/algo` | `AlgoView` | 보호 라우트. 빈 질문 입력에서 시작하고 Enter는 키워드 추천 실행, Shift+Enter는 줄바꿈, `POST /keywords`로 추천 키워드 조회, 추천 키워드 칩 선택 시 `POST /analysis` 후 `GET /analysis/{id}?limit=10`, 긴 분석 중 로딩 팝업, 실제 API 응답/오류/빈 상태 표시, 인증 실패 시 로그인 화면 이동, 프론트 목업 fallback 없음 |
| `/report` | `ReportView` | 보호 라우트. `GET /reports` 우선, `keyword/date/score/page/limit` 전달, 상세 펼침 시 `GET /analysis/{id}?limit=10`, 사이드바 기간/신뢰도 필터는 API query 반영, 즐겨찾기/정렬/종합 요약 복사는 프론트 처리, API/오류/빈 상태 표시, 실패 시 리포트 목록/상세 목업 없음 |
| `/community` | `CommunityView` | `GET /posts` 우선, `category/keyword/page/limit` 전달, API/목업 출처 안내, 실패 시 커뮤니티 목록 목업 |
| `/community/write` | `CommunityWriteView` | 보호 라우트. 글 작성 임시 저장, 등록 시 `POST /posts` |
| `/community/:id` | `DetailView type="커뮤니티"` | 게시글 상세 placeholder |
| `/login` | `LoginView` | `/login` 호출, accessToken 저장, accessToken 없는 응답은 실패 처리, 보호 라우트에서 온 경우 로그인 후 원래 경로 복귀 |
| `/signup` | `SignupView` | `/signup` 호출, 입력 검증 후 성공 시 로그인 화면 이동 |
| `*` | `NotFoundView` | 404 |

## 화면별 메모

- `HomeView.jsx`
  - 검색 입력을 `onSearch`로 전달한다.
  - `getSummary()`로 홈 요약을 가져오고 API 응답만 표시한다. 실패 시 프론트 더미 fallback을 사용하지 않는다.
  - API 성공 시 `recentChecks` 또는 `biasStatus/reliabilityStatus.categories`가 빈 배열이어도 기본 목업으로 덮지 않고 빈 상태를 유지한다.
  - 최신 팩트체크는 `slice(0, 3)` 제한 없이 백엔드가 주는 `recentChecks` 전체를 표시한다. 2026-07-26 배포 API 확인 기준 `recentChecks`는 3개다.
  - 최신 팩트체크 항목을 누르면 해당 제목으로 검색/검증 화면으로 이동한다.
  - 백엔드 명세: `GET /api/summary`.

- `VerificationView.jsx`
  - `useSearchParams`로 `q`를 읽고, 검색어가 있으면 결과 목록을 보여준다.
  - `runFactCheck()`로 `POST /checks`와 `GET /checks/{id}`를 순차 호출하고, 검색 요청 중에는 전체 화면 로딩 팝업을 표시한다. 현재 결과 조회에는 `page=1&limit=100`을 전달하고, 정렬값은 백엔드로 보내지 않는다.
  - 검색 결과는 수신한 `articles` 배열을 프론트에서 정렬/필터링한 뒤 10건씩 페이지를 나눠 표시한다. 2026-07-26 배포 API 확인 기준 서버 `page/limit` 분할은 아직 적용되지 않아 클라이언트 페이지네이션으로 처리한다.
  - 검색어 없이 들어오면 `getSummary()`로 최신 팩트체크 목록을 표시한다.
  - 검색 결과는 백엔드 API 결과만 표시한다. 프론트 더미데이터 fallback, 예시 검색 버튼, URL 링크 검색 탭은 제거됐다.
  - 결과 필터는 `전체 출처`, `방송/통신사`, `종합지`, `경제지`, `인터넷/IT지`, `전문/산업지`, `시사/탐사지`, `지역지`, `스포츠/연예지`, `영문매체`, `기타 출처`를 제공한다.
  - `src/utils/press.js`를 통해 백엔드 `PRESS_MAPPING`의 oid/name 표를 언론사명으로 변환한다. `언론사(047)` 같은 fallback 문자열도 처리한다.
  - 백엔드 기사에 신뢰도 점수가 없으면 `src/data/pressReliability.js`의 언론사 기준 신뢰도를 표시한다. 점수/라벨/색상/게이지 채움 비율은 `src/utils/reliability.js`의 5점 만점 공통 기준을 쓴다.
  - 언론사 로고 URL이 있으면 네이버 `office_logo` 이미지를 표시하고, 실패하면 기존 텍스트 배지를 표시한다.
  - `언론사(021)`처럼 미매핑 fallback 문자열이 등장하면 `recordObservedPress()`로 브라우저 `localStorage`에 누적한다. Console에서 `cheatFtPressList()`로 백엔드 전달용 목록을 복사한다.
  - `cleanDisplayText()`로 `&quot;` 같은 HTML entity를 표시 전에 디코딩한다.
  - 정렬은 `연관도순`, `최신순`, `신뢰도 높은순`, `신뢰도 낮은순`을 제공한다. 백엔드 응답 필드가 있으면 `relevanceScore/relevance/similarity`를 사용하고, 현재 배포 API처럼 연관도 점수 필드가 없으면 백엔드 기본 반환 순서를 유지한다. 신뢰도 정렬은 백엔드 점수 또는 언론사 기준 fallback 점수를 5점 만점으로 정규화한 값을 사용한다. 조회수순은 제거됐다.
  - 검색어 없는 초기 화면 카드와 검색 결과 카드 클릭은 제목 재검색이 아니라 `onArticleClick()`을 통해 `/article/:id` 뉴스 상세로 이동한다.
  - 좁은 폭에서는 검색창 아이콘/입력/버튼 배치, 기사 메타 줄바꿈, 신뢰도 게이지 표시가 깨지지 않도록 `verification-*` 클래스와 전역 CSS로 보정한다.

- `DetailView.jsx`
  - 뉴스 상세와 커뮤니티 상세을 `type` prop으로 구분한다.
  - 뉴스 상세는 클릭한 기사 객체를 `location.state.article` 또는 `sessionStorage`에서 읽어 제목, 언론사, 날짜, 설명, 원문 URL, 신뢰도를 먼저 표시한다.
  - 기사 URL이 지원되는 네이버 뉴스 형식이면 `/mnews/article/`을 `/article/`로 정규화한 뒤 `POST /article`을 호출해 상세 API의 본문, 기자, 입력 시간, 주제 정보를 병합한다. 실패하면 화면 오류 없이 목록에서 받은 기사 정보를 유지한다.
  - 백엔드/목록 데이터의 신뢰도 점수를 우선 표시하고, 없으면 `src/data/pressReliability.js`의 언론사 기준 신뢰도와 판단 이유를 오른쪽 신뢰도 패널에 표시한다.
  - 오른쪽 신뢰도 패널은 `src/utils/reliability.js`의 5점 만점 공통 기준으로 0~5 숫자 눈금, 점수만큼 채워지는 막대, 현재 점수 마커를 표시한다.
  - 뉴스 상세 제목/본문은 `cleanDisplayText()`로 HTML entity를 디코딩한다.
  - 뉴스 상세의 관련 키워드/관련 뉴스/관련 댓글/AI 분석 코멘트 영역은 제거됐다.
  - 직접 id 조회 API는 아직 없다. 저장된 기사 정보나 URL이 없으면 선택한 뉴스 정보를 찾을 수 없다는 상태를 보여준다.
  - 커뮤니티 상세은 아직 placeholder 성격이 남아 있다. 커뮤니티 상세/댓글 API도 없음.

- `AlgoView.jsx`
  - `activeTab`으로 관련 뉴스/반박 기사 탭 전환.
  - 질문 입력 후 `recommendKeywords()`로 `POST /keywords`를 호출해 추천 키워드 칩을 생성한다. 사용자가 키워드 칩을 선택하면 `runAnalysis()`로 `POST /analysis`와 `GET /analysis/{id}?limit=10`을 호출한다.
  - 질문창은 Enter로 키워드 추천을 실행하고 Shift+Enter는 줄바꿈으로 유지한다. 추천 중에는 버튼에 스피너를 표시한다.
  - 초기 질문/키워드 값은 비워두고, 분석 전 메인 제목은 특정 키워드 결과처럼 보이지 않게 표시한다. 분석 완료 후에는 `'키워드' 분석 결과` 형식으로 제목을 표시한다.
  - 분석 요청이 오래 걸릴 수 있어 `analysisStatus=loading` 동안 전체 화면 로딩 팝업을 표시하고 추천/분석 버튼 중복 클릭을 막는다.
  - 입력 흐름을 직관적으로 보이게 하기 위해 기본/키워드 선택 직후에는 질문 영역, 추천 키워드 생성 직후에는 키워드 영역을 테두리와 배경으로 강조한다.
  - 메인 영역은 `AI 주요 인사이트`와 `신뢰도 분석 요약`을 먼저 표시하고, 관련 뉴스/반박 기사 탭은 그 아래 서브 섹션으로 표시한다.
  - `biasAnalysis`, `relatedArticles`, `counterArticles`, `insights`, `summaryStats`, `pagination`을 실제 운영 API 응답 기준으로 표시하고 실패 시 목업을 사용하지 않는다.
  - `POST /analysis` 또는 `GET /analysis/{id}`에서 401/403이 오면 `onAuthExpired()`를 호출해 저장 토큰을 비우고 로그인 화면으로 보낸다.
  - 기사 변환에서 `articleId`, `press`, `title`, `stance`를 우선 처리한다. 기사 배지는 API/언론사 기준 신뢰도를 우선해 `높음/보통/주의` 체계로 표시하고, 점수/라벨이 없으면 stance를 같은 체계로 변환한다. `url/link/originalLink`가 있으면 카드 클릭 시 원문을 새 탭으로 열고, 현재 운영 API처럼 URL이 없으면 지어내지 않는다.
  - 신뢰도 게이지는 호 안쪽 라벨/건수 텍스트를 제거하고, 중앙 점수/등급과 하단 높음/보통/주의 미니 카드로 분리해 겹침을 피한다.
  - 언론사는 `src/utils/press.js`의 `getPressLabel()`로 백엔드 oid/name 표에 맞춰 정규화하고, `getPressLogoUrl()` 로고 이미지와 `recordObservedPress()` 미매핑 oid 관측 저장을 사용한다.
  - API 기사 제목/설명은 `cleanDisplayText()`로 HTML entity를 디코딩한다.
  - API 성공 후 관련/반박 기사 또는 인사이트 배열이 비어 있으면 목업을 섞지 않고 빈 상태/빈 안내를 표시한다.
  - API 응답 표시, 로딩, 오류, 분석 전 상태를 상단 안내로 구분한다.
  - `분석 안내` 버튼은 제거됐다. 넓이가 충분하면 좌우형 레이아웃과 신뢰도 요약 가로 배치를 유지하고, 좁은 폭에서만 세로형으로 전환한다.

- `ReportView.jsx`
  - `expandedId`, `innerTab`으로 리포트 펼침/요약 탭 제어.
  - `getReports()`로 `totalStats`, `reports`, `pagination`을 가져오고 실패 시 기존 목업을 사용하지 않는다.
  - 검색어, 날짜 필터, 신뢰도 필터를 `keyword`, `date`, `score` query parameter로 전달한다. 2026-08-02 로컬 백엔드 pull 기준 인증 사용자의 분석 기록을 반환한다.
  - `+ 새 검색 시작`은 `/algo`로 이동한다. 사이드바 전체/오늘/최근 7일/최근 30일 메뉴와 날짜 select는 `dateFilter`를 갱신하고, 오늘/최근 7일/최근 30일 개수는 별도 `GET /reports` 조회로 미리 채운다. 즐겨찾기 메뉴는 브라우저 `localStorage`에 저장된 리포트 id만 보여준다.
  - 카드 별 버튼은 로컬 즐겨찾기를 토글하고, `요약 복사`는 종합 요약 본문만 클립보드에 복사한다. 정렬 select는 `최신순`, `신뢰도 높은순`, `신뢰도 낮은순`, `주제명순`을 프론트에서 처리한다.
  - 상세 보기를 펼치면 리포트 id를 분석 id로 보고 `getAnalysisResult(id, { limit: 10 })`를 호출해 실제 관련/반박 기사와 인사이트를 표시한다. 상세 탭은 관련 기사/반박 기사만 두고, 오른쪽 종합 요약 패널은 항상 표시한다.
  - 상단 nav의 리포트 내보내기 버튼, `총 검색 시간` 통계 카드, 상세 요약 다운로드 버튼은 제거됐다.
  - 통계는 검색 주제 수, 분석한 기사 수, 평균 신뢰도 3개 카드로 표시한다.
  - 주요 출처는 `getPressLabel()`, `getPressLogoUrl()`, `recordObservedPress()`를 사용한다. `mainPresses`가 언론사명 문자열이 아닌 숫자/집계값이면 주요 출처명으로 표시하지 않는다. API 리포트 제목/요약은 `cleanDisplayText()`로 디코딩한다.
  - API 성공 후 `reports`가 비어 있으면 빈 리포트 상태를 표시하고, 실패 시 오류 상태를 표시한다.
  - API 응답 표시 중인지, 요청 실패 상태인지 상단 안내로 구분한다.
  - 내부 `height: calc(100vh - 71px)`/`overflowY: auto` 스크롤 구조는 제거됐다. 충분한 폭에서는 좌측 사이드바와 가로 통계를 유지하고, 좁은 폭에서만 세로형으로 전환한다.

- `CommunityView.jsx`
  - `tab` query param으로 상단/사이드 탭 상태를 공유한다.
  - `getPosts()`로 게시글과 `communityStats`를 가져오고 실패 시 기존 목업을 사용한다.
  - 탭/카테고리/검색어/페이지를 `category`, `keyword`, `page`, `limit` query parameter로 전달한다. 2026-07-26 배포 API 확인 기준 실제 응답은 query와 무관한 dummy 고정값이며 `currentPage: 1`을 반환한다.
  - `글 작성하기` 버튼은 전역 상단바가 아니라 커뮤니티 목록 상단의 검색/필터 영역에 표시한다.
  - 오른쪽 정정 요청 배너의 `정정 요청하기` 버튼은 `/community/write`로 이동한다.
  - API 게시글 제목/본문/작성자/카테고리는 `cleanDisplayText()`로 HTML entity를 디코딩한다.
  - API 성공 후 `posts`가 비어 있으면 빈 게시글 상태를 표시하고, 실패 시에만 기존 커뮤니티 목업을 사용한다.
  - API 응답 표시 중인지, 프론트 목업 fallback인지 목록 상단 안내로 구분한다.
  - 정보 공유 탭 외에는 준비중 placeholder.
  - 좁은 폭에서도 글 작성 버튼/필터가 과하게 커지지 않도록 하고, 참여 현황은 가능한 폭에서 가로 배치를 유지한다.

- `CommunityWriteView.jsx`
  - `cheat-ft-community-draft` 키로 `sessionStorage` 임시 저장.
  - 등록 버튼은 `createPost()`로 `POST /posts`를 호출한다.
  - API 기본 URL이 없거나 요청 실패 시 오류 메시지를 보여준다.

- `LoginView.jsx`
  - email/password 필수 입력과 이메일 형식을 확인한다.
  - `login()`으로 `POST /login`을 호출하고 accessToken이 있으면 저장한다.
  - accessToken이 없거나 API 기본 URL이 없으면 오류 메시지를 보여준다. `401`, `403`도 별도 메시지로 표시한다.
  - 제출 중에는 입력과 버튼을 비활성화한다.
  - 보호 라우트에서 로그인 화면으로 온 경우 성공 후 원래 경로로 돌아간다.
  - `location.state.noticeMessage`가 있으면 로그인 폼 위 안내로 표시한다.

- `SignupView.jsx`
  - email/nickname/password/passwordConfirm 필수, 이메일 형식, 닉네임 2~20자, 비밀번호 일치, 8자 이상 검증.
  - `signup()`으로 `POST /signup`을 호출한다.
  - 현재 명세에는 accessToken이 없어 성공 후 로그인 화면으로 이동한다.
  - 프론트는 `409` 중복 오류 메시지를 별도로 처리하지만, 2026-07-26 배포 API 확인 기준 중복 이메일은 `500`과 `이미 사용 중인 이메일입니다.` 메시지로 내려온다.

- `NotFoundView.jsx`
  - 전역 CSS의 status-page 스타일을 사용하는 404.

## API 클라이언트 상태

`src/services/apiClient.js`와 `src/services/cheatftApi.js`는 주요 화면에서 호출된다.

동작:

1. `import.meta.env.VITE_API_BASE_URL`을 읽고 마지막 `/`를 제거한다.
2. 값이 없으면 `API_NOT_CONFIGURED` 코드의 `ApiError`를 throw한다.
3. JSON body가 있으면 `Content-Type: application/json`을 붙인다.
4. 응답이 JSON이면 parse하고, `!response.ok`이면 `ApiError`를 throw한다.
5. HTTP status가 성공이어도 body의 `status`가 400 이상이면 `ApiError`를 throw한다.
6. `apiRequest`는 payload 전체를 반환하고, `apiData`는 `payload.data ?? payload`를 반환한다.
7. 저장된 accessToken이 있으면 `Authorization: Bearer ...` 헤더를 붙인다.

주의:

- 백엔드 명세는 `{ status, message, data }` 래핑 응답이며, 도메인 서비스 함수는 `apiData`로 `data` 중심 값을 반환한다.
- 인증 토큰은 `localStorage`의 `cheat-ft-access-token` 키에 저장한다.
- 현재 사용자 표시용 정보는 `localStorage`의 `cheat-ft-current-user` 키에 저장한다. `nickname`을 우선 표시하고, 없으면 `name`, 이메일 앞부분, `사용자` 순서로 fallback한다.
- API 오류 응답의 `code`, `details`는 프론트 handoff 제안에는 있지만 `cheatft_api/README.md`에는 아직 없음.

## cheatft_api

현재 로컬 백엔드는 Express/PostgreSQL/JWT 기반 Node 프로젝트이다. Codex는 읽기 전용으로만 확인하고 수정하지 않는다. 로그인/회원가입 구현처럼 표현이 넓은 요청도 프론트만 수정한다.

주요 구조:

- `package.json`, `package-lock.json`: Express, pg, jsonwebtoken, bcrypt, axios, dotenv 등 백엔드 의존성.
- `src/index.js`: Express 앱, CORS/JSON middleware, `/api` 라우트 연결.
- `src/config/db.config.js`: PostgreSQL pool 설정.
- `src/middlewares/auth.middleware.js`: Bearer token 검증.
- `src/routes/*.routes.js`: auth, checks, analysis, reports, dummy 라우트.
- `src/controllers/*.controller.js`: 요청/응답 래핑.
- `src/services/checks.service.js`: Naver 검색 또는 fallback 기사 생성, `PRESS_MAPPING` 보유.
- `src/services/analysis.service.js`: 분석 요청/조회 흐름.
- `src/controllers/dummy.controller.js`: summary, posts, profile 더미 응답.
- `src/models/*.model.js`: DB 접근 계층.

현재 관측된 API 성격:

- 대부분의 응답은 `{ status, message, data }` 형식이다. 단, `GET /api/health`는 공통 래핑 없이 `{ message }`만 반환한다.
- 2026-08-02 로컬 백엔드 pull 기준 `POST /api/keywords`, `POST /api/analysis`, `GET /api/analysis/:id`, `GET /api/reports`는 `verifyToken`이 필요하며 DB/서비스 흐름을 사용한다. `GET /api/analysis/:id`의 `limit` query는 관련/반박 기사 각각에 적용된다.
- `GET /api/summary`, `GET /api/posts`, `POST /api/posts`, `GET /api/profile`은 dummy controller 기반이며 query/auth/DB 저장을 거의 처리하지 않는다. 2026-07-26 배포 API 확인 기준 `posts` query parameter는 실제 필터/페이지에 반영되지 않는다.
- `POST /api/checks`는 optional auth이고, Naver API 키가 있으면 검색 결과를 저장한다. 키가 없거나 검색 결과가 없으면 빈 `articles` 또는 fallback article이 될 수 있다.
- `GET /api/checks/:id`는 DB에 저장된 check/article을 조회한다. 현재 article 필드는 `articleId`, `press`, `title`, `description`, `date`, `url`이고 `press`는 숫자보다 언론사명 문자열로 내려온다.
- `POST /api/login`, `POST /api/signup`, `GET /api/me`는 2026-07-26 배포 API에서 정상 흐름을 확인했다. 단, 중복 회원가입은 `409`가 아니라 `500`으로 내려온다.
- `GET /api/health`는 서버 상태 확인 라우트이다.

세부 화면/API 매핑과 미정 사항은 `cheatft_web/docs/backend-contract.md`에 정리했다.

## 2026-07-05 변경된 프론트 파일

- `src/services/apiClient.js`: `apiData`, accessToken 저장/삭제/첨부 추가.
- `src/services/cheatftApi.js`: 명세 기반 API 함수 신규 추가.
- `src/App.jsx`: 저장된 accessToken 기반 로그인 초기 상태, 로그아웃 시 토큰 삭제, 상세 이동 id 반영.
- `src/components/views/HomeView.jsx`: `GET /summary` 연동.
- `src/components/views/VerificationView.jsx`: `POST /checks`, `GET /checks/{id}`, 기본 화면 `GET /summary` 연동.
- `src/components/views/AlgoView.jsx`: `POST /analysis`, `GET /analysis/{id}` 연동.
- `src/components/views/ReportView.jsx`: `GET /reports` 연동, `keyword/date/score/page/limit` 전달.
- `src/components/views/CommunityView.jsx`: `GET /posts` 연동, `category/keyword/page/limit` 전달.
- `src/components/views/CommunityWriteView.jsx`: `POST /posts` 등록 연동.
- `src/components/views/LoginView.jsx`: `POST /login` 연동, accessToken 필수 처리.
- `src/components/views/SignupView.jsx`: `POST /signup` 연동, 성공 후 로그인 화면 이동.
- `src/components/views/MyPageView.jsx`: 당시 `GET /profile` 응답의 하위 분석/활동/뱃지/월간 요약을 반영했으나, 2026-07-15 이후 파일과 라우트가 제거됨.
- `src/index.css`: `.form-error` 스타일 추가.

검증 결과:

- `npm run lint`: 통과
- `npm test`: 통과
- Codex 번들 Node로 `vite build`: 통과
- 현재 기본 `node v24.13.0`의 `npm run build`: 기존 Vite 네이티브 종료 이슈로 실패 가능

## 2026-07-10 추가 변경/확인

- `.env.local`과 `.env.example`의 API 주소를 `https://cheatft.leegeon.com/api`로 맞췄다.
- `VerificationView.jsx`는 API 응답 결과와 프론트 fallback 결과를 구분하는 상단 안내와 카드 배지를 표시한다.
- API 성공 시 `articles`가 비어 있으면 프론트 KBS/뉴스1 예시를 섞지 않고 빈 결과 상태를 표시한다.
- 2026-07-10 당시 확인 기준 `GET /summary`의 `recentChecks`는 1개였다. 2026-07-26 배포 API 재확인 기준은 3개다.
- 2026-07-10 당시 `GET /checks/452`의 `articles` 배열은 1개였지만, 응답의 `totalArticles`와 pagination 총합은 12로 표시됐다. 2026-07-26 기준 기존 더미 id `452`는 새 DB 기반 라우트에서 404로 관측됐다.
- 검증 결과: `npm run lint`, `npm test`, Codex 번들 Node 기반 `vite build` 통과.

## 2026-07-12 추가 변경/확인

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `src/services/apiClient.js`: body의 `status >= 400`을 `ApiError`로 처리하도록 보강.
- `src/components/views/HomeView.jsx`: API 성공 후 빈 `recentChecks`/`biasStatus.categories`를 목업으로 덮지 않음.
- `src/components/views/AlgoView.jsx`: API 성공/로딩/fallback 상태와 출처 안내를 분리하고, 빈 `relatedArticles`/`counterArticles`/`insights`를 목업으로 덮지 않음.
- `src/components/views/ReportView.jsx`: API 성공 후 빈 `reports`를 목업으로 덮지 않고 빈 상태 표시.
- `src/components/views/CommunityView.jsx`: API 성공 후 빈 `posts`를 목업으로 덮지 않고 빈 상태 표시.
- `src/components/views/MyPageView.jsx`: 당시 `profile` 하위 중첩 객체를 기본값과 안전하게 병합했으나, 2026-07-15 이후 파일과 라우트가 제거됨.
- 검증 결과: `npm run lint`, `npm test`, Codex 번들 Node 기반 `vite build` 통과.
- 현재 기본 셸 `npm run build`는 기존 Node/Vite 네이티브 종료 이슈로 `38 modules transformed` 이후 실패가 재현됨.

## 2026-07-12 검증하기/인증 추가 변경

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 이 섹션의 검증하기 언론사 매핑/더미 혼합 방식은 2026-07-15 백엔드 코드 반영 작업으로 대체됐다.
- `src/components/views/VerificationView.jsx`: 당시 검색 결과에서 API 결과와 프론트 더미데이터를 별도 섹션으로 함께 표시했다.
- `src/components/views/VerificationView.jsx`: 당시 네이버 언론사 목록 순서 기반 `press` 번호 매핑, 언론사 분류 필터, 최신순/조회수순/연관도순 정렬을 추가했다.
- `src/components/views/LoginView.jsx`: 이메일 형식 검증, 제출 중 비활성화, 인증 오류 메시지, 로그인 후 원래 경로 복귀를 추가했다.
- `src/components/views/SignupView.jsx`: 이메일/닉네임/비밀번호 검증과 중복 오류 메시지를 보강했다.
- `src/App.jsx`: 당시 `/mypage`, `/community/write` 보호 라우팅을 추가했다. 2026-07-15 이후 `/mypage`는 제거됐고 `/community/write`와 `/algo`가 보호 라우트로 남아 있다.
- 검증 결과: `npm run lint`, `npm test` 통과.

## 2026-07-15 백엔드 반영 프론트 조정

- 루트 `docs/`의 md 파일을 `cheatft_web/docs/`로 옮겨 이 위치를 문서 기준으로 사용한다.
- 백엔드 `cheatft_api`가 README-only가 아니라 Express/PostgreSQL/JWT 구현체임을 확인했다. 백엔드는 확인 가능하지만 이번 작업에서는 수정하지 않았다.
- `src/utils/press.js`: 백엔드 `checks.service.js`의 `PRESS_MAPPING` 기준 언론사 oid/name 정규화와 화면 분류 유틸을 추가했다.
- `src/components/views/VerificationView.jsx`: 기존 네이버 `officeList` 순번 매핑과 지역지/전문지/해외 통신사 필터를 제거하고, 백엔드 표 기반 분류를 사용하도록 수정했다.
- `src/components/views/VerificationView.jsx`: 당시 API 성공 시 프론트 더미 결과를 함께 섞지 않고 백엔드 결과만 표시했다. 2026-07-15 이번 창 작업 이후 검증하기의 프론트 더미 fallback도 제거됐다.
- `src/components/views/VerificationView.jsx`: 정렬 변경 시 백엔드 재요청을 하지 않고 현재 수신 결과를 프론트에서 정렬한다. `GET /checks/{id}`에는 `page=1&limit=10`만 전달한다.
- `src/components/views/AlgoView.jsx`: 백엔드 기사 필드 후보에 `description`, `publishedAt/createdAt/date`, `press/pressName/publisher/mediaName`을 반영하고 언론사명은 `getPressLabel()`로 정규화한다.
- `src/App.jsx`: `/algo`를 보호 라우트에 포함하고, 로그아웃 시 `/algo`에서도 홈으로 이동하도록 수정했다.
- `cheatft_web/README.md`: `cheatft_api`를 명세 문서로만 설명하던 오래된 문구와 이동 전 docs 경로를 최신화했다.
- 배포 확인: `https://cheatft.leegeon.com/`은 200 응답이지만 Vite dev HTML(`/@vite/client`, `/src/main.jsx`)을 서빙했고, 현재 배포 프론트는 과거 소스라 `/algo`가 보호되지 않은 상태로 보였다.
- 당시 배포 API 확인: `/api/summary`, `/api/profile`은 200, `/api/me`는 토큰 없이 401, `/api/checks/452`는 새 DB 백엔드 기준 404, `/api/login`은 `UserModel.findByEmail is not a function` 오류를 반환했다. 2026-07-16/2026-07-26 확인 기준 배포 로그인과 `/api/me`는 정상 동작한다.
- 검증 결과: `npm run lint`, `npm test`, Codex 번들 Node 기반 `vite build` 통과.

## 2026-07-15 이번 창 UI/API 정리

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 배포 실패 원인:
  - `https://cheatft.leegeon.com/`은 Vite dev HTML을 서빙한다.
  - 배포된 `/src/App.jsx`가 import하는 `/src/services/apiClient.js`가 404다.
  - `/api/summary`, `/api/health`, `/api/checks`는 응답하므로 프론트 배포 산출물 누락/혼재가 핵심이다.
- `src/components/views/HomeView.jsx`
  - 프론트 기본 summary/fallback 더미 제거.
  - `GET /summary`의 `recentChecks` 전체 표시.
  - `알고리즘 편향성` 표현을 `신뢰도` 기준으로 변경.
  - 프로모션 배너의 `Cheat F/T 소개 보기 >` 버튼 제거.
- `src/components/views/VerificationView.jsx`
  - URL 링크 검색 탭, 예시 검색 버튼, 프론트 더미 결과/필터/배지 제거.
  - 검색 결과와 초기 최신 팩트체크 카드 클릭을 `/article/:id` 상세 이동으로 변경.
  - 백엔드 article 필드 후보: `articleId`, `press`, `title`, `description`, `date`, `url`.
- `src/components/views/DetailView.jsx`
  - 뉴스 상세를 route state/sessionStorage의 클릭 기사 데이터와 연결.
  - `편향성 지수`를 `신뢰도`로 변경.
  - 관련 키워드/관련 뉴스/관련 댓글/AI 분석 코멘트 제거.
  - 직접 조회 API가 없어서 저장 정보 없는 deep link 복원은 제한적이다.
- `src/App.jsx`
  - `handleArticleOpen(id, article)`로 기사 데이터를 저장하고 `/article/:id`로 이동.
  - `/mypage` 라우트/nav/import 제거.
  - nav의 `교육 & 정보`를 `커뮤니티`로 변경하고 `알고리즘 분석`을 `신뢰도 분석`으로 변경.
- `src/components/views/CommunityView.jsx`
  - 공지사항, 가이드, 튜토리얼 탭/항목 제거.
- 삭제 파일:
  - `src/components/views/MyPageView.jsx`
- 검증 결과:
  - `npm run lint` 통과
  - `npm test` 통과
  - Codex 번들 Node 기반 `vite build` 통과

## 2026-07-15 이번 창 언론사 로고/표시 정리

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `src/utils/press.js`
  - 네이버 언론사 홈에서 확인한 `office_logo` CDN URL을 백엔드 `PRESS_MAPPING` 18개 oid에 매핑했다.
  - `getPressOid()`, `getPressLogoUrl()`, `recordObservedPress()`를 추가했다.
  - `언론사(021)`처럼 미매핑 fallback 문자열이 API 데이터에 나타나면 `localStorage` key `cheat-ft-observed-press-map`에 누적한다.
  - Console 헬퍼 `cheatFtPressList()`, `cheatFtPressMap()`, `cheatFtClearPressList()`를 노출한다.
- `src/components/views/VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`
  - 언론사 배지에 로고 이미지 표시를 추가하고, 실패 시 기존 텍스트 배지를 유지한다.
  - API 결과 매핑 중 `recordObservedPress()`로 미매핑 oid를 저장한다.
- `src/utils/text.js`
  - API 문자열 표시용 `decodeHtmlEntities()`, `cleanDisplayText()`를 추가했다.
  - `&quot;`, `&amp;`, `&#39;`, `&apos;`, `&lt;`, `&gt;`, `&nbsp;`를 디코딩하고 남은 HTML 태그를 제거한다.
- `src/components/views/HomeView.jsx`, `VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`, `CommunityView.jsx`, `DetailView.jsx`
  - API 제목/요약/본문/상세 표시 문자열에 `cleanDisplayText()`를 적용했다.
- 검증 결과:
  - `npm run lint` 통과
  - `npm test` 통과
  - Codex 번들 Node 기반 `npm run build` 통과

## 2026-07-16 상단 사용자 표시/favicon 변경

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `src/services/apiClient.js`
  - `cheat-ft-current-user` localStorage key를 추가했다.
  - `getCurrentUser()`, `setCurrentUser()`, `clearCurrentUser()`를 추가했다.
  - 저장값 JSON 파싱 실패 시 해당 key를 삭제하고 `null`을 반환한다.
- `src/services/cheatftApi.js`
  - 로그인 성공 시 `accessToken` 저장과 함께 `userId/id`, `email`, `nickname` 후보를 현재 사용자 정보로 저장한다.
  - 백엔드가 `nickname`을 직접 주거나 `user.nickname` 형태로 주는 경우를 모두 받는다.
- `src/App.jsx`
  - 저장된 토큰과 현재 사용자 정보로 초기 로그인 상태를 만든다.
  - 로그인 후 오른쪽 상단에 닉네임을 표시하고, 로그아웃 시 토큰과 현재 사용자 정보를 함께 삭제한다.
  - 표시 이름은 `nickname`, `name`, 이메일 앞부분, `사용자` 순서로 fallback한다.
- `index.html`
  - `lang="ko"`로 변경했다.
  - 브라우저 탭 제목을 `news-project`에서 `Cheat F/T`로 변경했다.
  - favicon 참조를 `/favicon.png`로 변경했다.
- `public/favicon.png`
  - 사용자가 제공한 Cheat F/T 돋보기 아이콘 이미지를 주소창 아이콘용 PNG로 추가했다.
  - 흰색/거의 흰색 배경은 투명 처리했고 512x512 캔버스에 약간의 여백을 뒀다.
- 2026-07-31 임시 파일 정리에서 사용하지 않는 기본/레거시 에셋 `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg`, `public/favicon.svg`를 삭제했다.
- 검증:
  - `npm run lint`: 통과
  - `npm test`: 통과
  - 일반 셸 Node의 `npm run build`: 기존 Vite/Node 네이티브 종료 이슈로 `41 modules transformed` 이후 exit 1 재현
  - Codex 번들 Node 기반 `npm run build`: 통과

## Git 주의

- 루트에는 `.git` 폴더가 보이지만 2026-07-15 확인 기준 `HEAD`가 없어 git 저장소로 동작하지 않는다.
- Codex sandbox 사용자는 `cheatft_web`, `cheatft_api`에서 `fatal: detected dubious ownership`를 만난다.
- Git 작업이 필요하면 safe.directory 설정을 사용자 승인 또는 명시 지시 후 처리한다.

## 일반 작업 요령

- 다음 작업부터는 `cheatft_web`과 `cheatft_api` 전체를 다시 스캔하지 말고 이 파일과 `cheatft_web/docs/backend-contract.md`를 먼저 본다.
- 실제 수정 대상 화면의 컴포넌트와 연관 유틸/API 문서만 추가로 연다.
- `node_modules`, `dist`, `package-lock.json`은 의존성 변경이나 빌드 문제 분석이 필요할 때만 확인한다.
- 회의록/PDF/이미지/압축 파일은 직접 요청받았을 때만 연다.
