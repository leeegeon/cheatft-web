# Cheat F/T frontend

가짜뉴스 검증, 출처 신뢰도 확인, 정보 편향성 분석을 위한 React 프런트엔드입니다. 현재 배포 API를 우선 호출합니다. 홈/신뢰도 분석/편향성 분석/팩트체크 리포트/커뮤니티는 프론트 더미 fallback을 제거하고 서비스 응답 기반 데이터, 오류, 빈 상태를 보여줍니다.

## 문서 갱신 원칙

프론트 동작, 배포 방식, API 연동, 인증 흐름, 라우트, 주요 제약이 바뀌면 이 `README.md`도 함께 갱신합니다. 세부 인수인계는 `docs/handoff.md`, 구조와 파일 위치는 `docs/code-map.md`, API 계약은 `docs/backend-contract.md`, 작업 로그는 `docs/api-integration-log.md`를 같이 갱신합니다.

Codex 작업 시작 시 반복해서 전달하던 규칙은 `AGENTS.md`에 고정합니다. 시작 절차, 전체 스캔 금지, 백엔드 읽기 전용 원칙, 문서 갱신 원칙이 바뀌면 `AGENTS.md`도 함께 갱신합니다.

작업을 마무리할 때 사용자가 `종료`라고만 말하면 Codex는 이번 창의 변경 내용을 정리하고, 필요한 `README.md`, `AGENTS.md`, `docs/*.md` 문서를 최신화한 뒤 한글 push용 제목과 내용을 제공합니다.

종료 답변의 push용 내용은 변경 파일 목록만 쓰지 않고 실제 의도를 2~4줄로 요약합니다. 점 목록으로 렌더링되지 않도록 코드블록 안에서 각 줄을 하이픈(`-`)으로 시작하게 작성합니다.

```text
- cheatft_web/AGENTS.md에 시작/종료 처리와 백엔드 수정 금지 원칙 강화
- docs 문서의 중복 지침을 줄이고 최신 지침 위치로 정리
- README와 handoff에 문서 갱신 및 종료 처리 규칙 반영
```

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

## 운영 배포

운영 서버에는 프로젝트 루트가 아니라 `npm run build`로 생성된 `dist/` 안의 파일을 배포합니다. 정상 배포된 첫 화면 HTML에는 `/@vite/client`, `/src/main.jsx`, `/@react-refresh`가 없어야 하며, `/assets/index-*.js`와 `/assets/index-*.css`를 참조해야 합니다.

```powershell
cd C:\Users\eunhy\Desktop\동아리\cheatft_web
fnm use
npm run build
```

서버의 web root 또는 nginx `root`는 `cheatft_web/dist`를 가리키게 합니다. React Router 새로고침을 위해 존재하지 않는 프론트 경로는 `dist/index.html`로 fallback하되, 실제 `/assets/*` 파일은 HTML fallback이 아니라 JS/CSS 파일로 내려와야 합니다.

운영 점검 예시:

```powershell
(Invoke-WebRequest https://cheatft.leegeon.com/ -UseBasicParsing).Content
$r = Invoke-WebRequest https://cheatft.leegeon.com/assets/index-파일명.js -UseBasicParsing
$r.Headers['Content-Type']
$r.Content.Substring(0, 80)
```

루트 HTML에 `/@vite/client`가 보이거나 `/assets/*.js` 응답이 `<!doctype html>`로 시작하면 개발용 HTML 또는 SPA fallback이 잘못 서빙되는 상태입니다.

## 환경변수

`.env.example`을 `.env.local`로 복사한 뒤 백엔드 주소를 설정합니다.

```dotenv
VITE_API_BASE_URL=https://cheatft.leegeon.com/api
```

환경변수가 있으면 백엔드 API를 우선 호출합니다. 홈/신뢰도 분석/편향성 분석/팩트체크 리포트/커뮤니티는 API 실패 시 프론트 더미 결과를 섞지 않습니다. 로그인/회원가입/비밀번호 찾기/게시글 등록·수정·삭제/댓글 작성·삭제는 실패 시 오류를 보여줍니다. API 호출 공통 처리는 `src/services/apiClient.js`, 도메인별 호출 함수는 `src/services/cheatftApi.js`에 있습니다.

주의: 현재 `../cheatft_api`는 Express/PostgreSQL/JWT 기반 백엔드 구현체와 API 명세를 함께 포함합니다. 로컬 실행에는 PostgreSQL 접속 정보, JWT secret, 네이버 API 키 등 환경변수가 필요합니다. 프론트 로컬 개발의 기본 API 주소는 `https://cheatft.leegeon.com/api`입니다.

현재 로컬 백엔드는 `auth/checks/analysis/reports` 계열은 실제 라우트/서비스/DB 흐름을 사용하고, `summary/posts/profile` 계열은 dummy controller 응답입니다. 2026-08-02 기준 pull된 로컬 백엔드에는 인증이 필요한 `POST /api/keywords`, `GET /api/reports`가 포함됩니다.

`cheatft_api/README.md`는 실제 구현 또는 배포 API보다 늦게 갱신될 수 있습니다. API 연동 작업은 README만 기준으로 판단하지 말고, 가능한 경우 실제 배포 API 응답과 `cheatft_api/src` 구현을 함께 확인한 뒤 반영합니다.

## API 연동 상태

2026-08-05 기준 다음 화면은 백엔드 명세 경로를 호출합니다.

| 화면 | 호출 API | fallback |
|---|---|---|
| 홈 | `GET /summary` | 프론트 더미 fallback 없음. 현재 홈은 `todayStats`, `recentChecks`만 표시하고 신뢰도 현황 블록 대신 책임 메시지 카드를 표시함 |
| 신뢰도 분석 | `POST /checks`, `GET /checks/{id}?page=1&limit=100`, 기본 화면 `GET /summary` | 프론트 더미 fallback 없음, 검색 중 로딩 팝업 표시, 검색 결과는 10건씩 화면 페이지네이션 |
| 뉴스 상세 | `POST /article` | 신뢰도 분석에서 전달된 네이버 기사 URL이 있으면 상세 API의 `content` 본문을 우선 표시하고, 실패 시 별도 오류 노출 없이 목록에서 받은 기사 정보 표시. 상세 응답은 URL별 세션 캐시 사용. 네이버 뉴스와 네이버 연예 URL을 지원하고, 비지원 언론사 URL은 원문 확인 안내 표시 |
| 편향성 분석 | `POST /keywords`, `POST /analysis`, `GET /analysis/{id}?limit=10` | 보호 라우트, 키워드 추천/분석 모두 API 호출, 질문창 Enter는 키워드 추천 실행, Shift+Enter는 줄바꿈, 추천 중 버튼 스피너와 긴 분석 중 로딩 팝업 표시, 인증 실패 시 로그인 화면으로 이동, 프론트 목업 fallback 없음 |
| 리포트 | `GET /reports?keyword=&date=&score=&page=&limit=`, `DELETE /reports/{id}`, 펼침 상세 `GET /analysis/{id}?limit=10` | 보호 라우트, 실제 분석 기록과 상세 결과 표시, 사이드바 기간/신뢰도 필터와 10개 단위 페이지 이동은 API query 반영, 즐겨찾기/정렬/종합 요약 복사는 프론트 처리, 실패 시 프론트 목업 fallback 없음. 삭제 버튼 연결 |
| 커뮤니티 | `GET /posts?category=&keyword=&page=&limit=`, `GET /posts/{id}`, `POST /posts`, `PUT /posts/{id}`, `DELETE /posts/{id}`, `POST /posts/{id}/comments`, `DELETE /posts/{id}/comments/{commentId}` | 목록/작성/상세/수정/삭제/댓글 API 연결. 실패 시 프론트 목업 fallback 없음 |
| 글 작성 | `POST /posts` | 실패 시 오류, 임시 저장 가능. API 허용 카테고리는 `정보 공유 커뮤니티`, `정정 요청`, `토론 게시판` |
| 로그인 | `POST /login` | 실패 시 오류, 성공 시 accessToken과 현재 사용자 정보 저장 |
| 회원가입 | `POST /signup` | 성공 후 로그인 화면 이동, 실패 시 오류 |
| 비밀번호 찾기 | `POST /password/code`, `POST /password/verify`, `POST /password/reset` | `/password-reset` 3단계 화면 연결 |

주의: `VITE_API_BASE_URL`에 `/api`가 포함되어 있으므로 프론트 코드에서는 `/summary`, `/login`처럼 호출합니다. 운영 API는 대부분 `{ status, message, data }` 형식을 쓰지만 `/health`, 404, 아직 배포되지 않은 라우트의 HTML 응답처럼 예외가 있습니다.

## 연동 확인 방법

1. `.env.local`에 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`를 설정합니다.
2. `.env.local`을 새로 만들거나 수정했다면 Vite dev server를 재시작합니다.
3. `npm run dev`로 프론트를 실행합니다.
4. 브라우저 개발자도구 Network 탭에서 `summary`, `checks`, `keywords`, `analysis`, `reports`, `posts`, `password`, `login`, `signup` 요청을 확인합니다.

홈/신뢰도 분석/편향성 분석/팩트체크 리포트/커뮤니티는 API 실패 시 더미 결과를 섞지 않으므로 오류/빈 상태를 확인합니다. 로그인, 회원가입, 비밀번호 찾기, 게시글 등록/수정/삭제, 댓글 작성/삭제는 API 실패 시 오류 메시지를 보여줍니다.

## 주요 경로

- `/`: 홈
- `/search?q=검색어`: 신뢰도 분석
- `/article/:id`: 뉴스 상세
- `/algo`: 편향성 분석, 로그인 필요
- `/report`: 검증 리포트, 로그인 필요
- `/community`: 커뮤니티
- `/community/write`: 글 작성 및 탭 단위 임시 저장
- `/community/:id`: 게시글 상세
- `/password-reset`: 비밀번호 찾기
- `/login`, `/signup`: 사용자 화면

백엔드 협의 전에 `docs/backend-contract.md`를 우선 확인하고, 초기 제안 메모가 필요할 때만 `docs/backend-handoff.md`를 확인하세요.

## 현재 제약

- 홈/신뢰도 분석/편향성 분석/팩트체크 리포트/커뮤니티는 API 응답을 우선 사용하고 실패 시 목업으로 fallback하지 않습니다.
- 화면에는 `백엔드 API`, `API 응답 표시 중`, `분석 전` 같은 개발자용 출처/상태 문구를 표시하지 않고, 로딩/오류/빈 상태를 사용자용 문구로 안내합니다.
- 홈 최신 팩트체크와 신뢰도 분석 기본 화면의 최신 팩트체크는 `GET /summary`의 `recentChecks`를 사용합니다. 2026-07-26 배포 API 재확인 기준 `recentChecks`는 3개입니다.
- 2026-07-31 전달 메모 기준 `GET /summary`의 `recentChecks` 3개는 모두 `id: 1`로 내려올 수 있어, 카드 이동 시 프론트에서 기사 객체를 route state와 `sessionStorage`로 함께 전달합니다.
- 신뢰도 분석 API 요청 중에는 로딩 팝업을 표시하고, 성공하면 API의 `articles` 배열만 사용합니다. `articles`가 비어 있으면 프론트 예시를 섞지 않고 빈 상태를 표시합니다. 다른 조회 화면도 API 성공 후 빈 배열을 목업으로 덮지 않습니다.
- 신뢰도 분석 검색 결과는 `sessionStorage`에 검색어별로 저장합니다. 기사 상세로 들어갔다가 브라우저 뒤로가기로 돌아오면 같은 탭에서는 기존 결과를 즉시 복원하고 `POST /checks` 재요청과 긴 로딩 팝업을 피합니다.
- 신뢰도 분석 검색 결과는 현재 최대 100건을 요청한 뒤 프론트에서 10건씩 페이지를 나눠 표시합니다. 2026-07-26 배포 API 확인 기준 `limit=100` 요청에도 실제 응답은 12건이며, `page=2&limit=5`도 12건 전체와 `totalPages: 1`을 반환해 서버 페이지네이션은 아직 적용되지 않은 상태로 관측됐습니다.
- 신뢰도 분석 정렬은 `연관도순`, `최신순`, `신뢰도 높은순`, `신뢰도 낮은순`을 제공합니다. 로컬 백엔드 확인 기준 네이버 뉴스 검색은 `sort=sim`을 사용하므로 기본 반환 순서는 연관도순입니다. 신뢰도 정렬은 백엔드 점수 또는 언론사 기준 fallback 점수를 5점 만점으로 정규화한 값으로 처리합니다.
- 언론사 oid/name 정규화와 로고 표시는 `src/utils/press.js`에서 처리합니다. 2026-07-31 기준 백엔드 `PRESS_MAPPING` 69개 oid와 네이버 `office_logo` URL 69개를 프론트에도 반영했습니다. 이미지 로드에 실패하면 기존 텍스트 배지를 표시합니다.
- 언론사별 분류와 신뢰도 기준은 `src/data/pressReliability.js`에 저장합니다. 2026-07-31 기준 백엔드 `PRESS_MAPPING` 69개 모두 신뢰도 점수/라벨/판단 이유까지 연결됩니다. 검증하기 기사에 백엔드 신뢰도 점수가 없으면 이 언론사 기준 점수를 fallback으로 표시하고, 상세 화면에서는 분류와 판단 이유 요약도 확인할 수 있습니다.
- 신뢰도 UI 기준은 `src/utils/reliability.js`에서 공통 관리합니다. 화면 점수는 5점 만점으로 정규화하며, 라벨은 `높음` 3.9 이상, `보통` 3.3 이상 3.9 미만, `주의` 3.3 미만입니다. 10점 척도 API 값은 2로 나누고, 100점 척도 값은 20으로 나눠 표시합니다.
- 사람이 검토하기 쉬운 이유 표는 `docs/press-reliability.md`에서 확인합니다. `파일/신뢰도`의 AI 별점 이미지는 참고값으로만 반영했습니다.
- 신뢰도 분석은 텍스트 검색만 지원합니다. URL 링크 검색 탭은 제거됐습니다. 배포 API는 `type=url` 요청도 `202`로 받지만 URL 본문 파싱 없이 검색어처럼 저장되며, 확인한 네이버 기사 URL 요청은 기사 0건을 반환했습니다.
- `POST /checks`는 2026-08-05 배포 API 확인 기준 `type` 없이 `content`만 보내면 `202`와 `checkId`를 반환합니다. 프론트 서비스 함수도 더 이상 `type`을 전송하지 않습니다.
- 신뢰도 분석 카드와 최신 팩트체크 카드는 제목 재검색이 아니라 `/article/:id` 뉴스 상세로 이동합니다.
- 뉴스 상세는 클릭한 기사 객체를 route state와 `sessionStorage`로 받아 둔 뒤, 기사 URL이 있으면 `POST /article` 백엔드 상세 응답의 `content`를 기사 전문 영역에 우선 표시합니다. 검증 결과의 `https://n.news.naver.com/mnews/article/...` URL은 백엔드가 받는 `https://n.news.naver.com/article/...` 형식으로 정규화합니다. 2026-08-05 배포 API 확인 기준 `m.entertain.naver.com` 네이버 연예 기사 전문도 지원합니다. 상세 응답은 URL별 `sessionStorage` 캐시에 저장해 같은 탭에서 같은 기사를 다시 열 때 재요청을 줄입니다. 뉴스 상세 상단 메타에는 조회수를 표시하지 않습니다.
- `POST /api/keywords`는 2026-08-02 로컬 백엔드 pull 기준 구현되어 있으며 Bearer token이 필요합니다. 운영 배포 API에 반영되지 않은 환경에서는 키워드 추천이 오류 상태를 표시합니다.
- 뉴스 상세 신뢰도는 백엔드/목록 데이터의 점수를 우선 쓰고, 점수가 없으면 `src/data/pressReliability.js`의 언론사 기준 신뢰도와 판단 이유를 표시합니다. 오른쪽 신뢰도 패널은 `src/utils/reliability.js`의 공통 기준으로 0~5 눈금과 현재 점수 위치를 시각화합니다. 저장 정보 없는 직접 URL 진입은 여전히 복원할 기사 URL이 없어 제한적입니다.
- 편향성 분석(`/algo`)은 빈 질문 입력에서 시작합니다. 질문창에서 Enter를 누르면 `키워드 추천`을 실행하고, Shift+Enter는 줄바꿈으로 유지합니다. 질문을 입력하고 `키워드 추천`을 누르면 `POST /keywords`로 추천 키워드를 받고, 추천 중에는 버튼에 스피너를 표시합니다. 사용자가 추천 키워드 칩을 누르면 `POST /analysis`, `GET /analysis/{id}?limit=10`을 호출합니다. 긴 분석 중에는 로딩 팝업을 표시하며, 분석 완료 후 제목은 `'키워드' 분석 결과` 형식으로 표시합니다. 실제 운영 응답의 `biasAnalysis`, `insights`, `relatedArticles`, `counterArticles`, `summaryStats`, `pagination`만 표시합니다. 분석 기사 배지와 하단 집계는 백엔드 `stance`/count 값인 `긍정`, `중립`, `반박`을 그대로 표시하고, API 실패 시 기존 예시 기사를 섞지 않습니다. 분석 기사에 `url/link/originalLink`가 있으면 원문을 새 탭으로 열고, URL이 없으면 기사 제목과 언론사 기준 네이버 뉴스 검색을 엽니다.
- 팩트체크 리포트(`/report`)는 로그인 필요 화면입니다. `GET /reports`로 분석 기록 목록을 10개씩 표시하고, 백엔드 `pagination`으로 이전/다음/페이지 번호 이동을 제공합니다. 상세 보기 시 해당 리포트 id로 `GET /analysis/{id}?limit=10`을 호출해 실제 관련/반박 기사와 인사이트를 표시합니다. 상세 기사에 `url/link/originalLink`가 있으면 제목을 원문 링크로 열고, URL이 없으면 기사 제목과 언론사 기준 네이버 뉴스 검색을 엽니다. 새 검색 시작은 `/algo`로 이동하고, 사이드바 기간 메뉴와 신뢰도 필터는 `date`, `score` query로 반영합니다. 오늘/최근 7일/최근 30일 개수는 별도 리포트 조회로 미리 표시합니다. 즐겨찾기는 서버 API가 없어 브라우저 `localStorage`에 저장하며, 정렬과 종합 요약 복사는 프론트에서 처리합니다. 실패 시 기존 리포트/상세 목업을 섞지 않습니다.
- `GET /reports`의 `mainPresses`가 언론사명 문자열 배열이 아니라 숫자/집계값으로 내려오면 주요 출처 영역에 표시하지 않습니다.
- 커뮤니티와 팩트체크 리포트는 전역 상단바를 다른 화면과 동일하게 사용합니다. 커뮤니티 글 작성 버튼은 상단바가 아니라 커뮤니티 목록 상단의 검색 영역에 표시합니다. 커뮤니티 카테고리 이동은 왼쪽 세로 메뉴만 사용하며, 중복 상단 가로 탭과 카테고리 select는 제거했습니다. 커뮤니티 게시글 카드의 북마크 장식은 제거했고, 오른쪽 `인기 게시글`과 `최근 정정 요청`은 같은 번호 배지/제목/조회·댓글 메타 양식으로 표시합니다.
- 홈과 주요 화면이 노트북 절반 폭과 모바일 폭에서 깨지지 않도록 반응형 보정을 적용했습니다. 홈 검색창과 `신뢰도 분석` 버튼은 모바일에서 가로폭을 꽉 쓰며, 최신 팩트체크/프로모션/통계 카드는 320px 폭에서도 내부 요소가 가로로 밀리지 않게 줄바꿈과 폭 제한을 둡니다. 편향성 분석/리포트는 넓이가 충분하면 기존 좌우형과 가로 통계를 유지하고, 좁은 폭에서만 세로형으로 전환합니다. 앱 본문은 내부 이중 세로 스크롤 대신 브라우저 기본 페이지 스크롤을 사용합니다.
- 2026-07-26 확인 기준 `GET /summary`, `POST /login`, `GET /me`는 배포 API에서 정상 응답이 관측되었습니다. 기존 더미 `GET /checks/452`는 새 DB 기반 라우트에서는 404가 관측되었습니다.
- 2026-08-02 로컬 백엔드 pull 기준 리포트 목록은 `keyword`, `date`, `score`, `page`, `limit` query parameter를 `GET /reports`에 전달하며 인증된 사용자의 분석 기록을 반환합니다. 운영 배포 API 반영 여부는 Network 탭에서 status와 response body로 확인합니다.
- 커뮤니티 목록은 `category`, `keyword`, `page`, `limit` query parameter를 `GET /posts`에 전달합니다. 2026-08-05 배포 API 기준 목록/상세/작성/수정/삭제/댓글 API가 동작하며, 작성/수정 허용 카테고리는 `정보 공유 커뮤니티`, `정정 요청`, `토론 게시판`입니다. 목록 API 응답에는 인기 태그 목록이 없어 하드코딩 인기 태그 영역은 제거했고, `최신순`, `인기순`, `댓글 많은 순`은 수신한 게시글을 프론트에서 정렬합니다. 현재 배포 API의 `communityStats.todayComments`는 게시글별 `commentCount`와 별개로 0을 반환하는 것으로 확인됐습니다.
- 2026-08-02 로컬 백엔드 pull 기준 편향성 분석 결과 조회는 `limit` query를 반영하며 프론트는 관련 뉴스와 반박 기사를 각각 최대 10건까지 요청합니다. 2026-08-05 배포 API 직접 확인 시 기존 분석 조회는 정상이나 신규 `POST /analysis`는 `500`을 반환해 백엔드 확인이 필요합니다.
- 로그인은 `/login` 응답의 accessToken을 `localStorage`에 저장하고, 이후 API 요청에 Bearer 토큰으로 첨부합니다. accessToken이 없으면 실패로 처리합니다. 로그인 성공 시 현재 사용자 정보도 `cheat-ft-current-user`에 저장해 오른쪽 상단에 닉네임을 표시합니다.
- 앱 진입, 보호 라우트 이동, 창 재포커스/다시 표시 시 저장된 accessToken이 있으면 `GET /me`로 세션을 재확인합니다. `401` 또는 `403`이면 저장된 accessToken과 현재 사용자 정보를 삭제하고, 보호 화면에서는 로그인 화면으로 이동합니다. 편향성 분석과 리포트 요청 중 인증 실패가 와도 같은 흐름으로 처리합니다.
- 회원가입은 `/signup`을 호출하지만 현재 명세에는 accessToken이 없어 성공 후 로그인 화면으로 이동합니다. 2026-07-26 배포 API 확인 기준 중복 이메일은 `409`가 아니라 `500`과 `이미 사용 중인 이메일입니다.` 메시지로 내려옵니다.
- 게시물 등록은 `/posts`로 전송합니다. 실패하면 오류를 보여주고 임시 저장은 유지됩니다.
- `GET /health`는 서버 상태 확인용으로 존재하지만 `{ status, message, data }` 공통 래핑이 아니라 `{ message }`만 반환합니다.
- 마이페이지 화면과 `/mypage` 라우트는 제거됐습니다. `/api/profile`은 백엔드 dummy endpoint로 남아 있지만 현재 프론트 화면은 사용하지 않습니다.
- 주소창 favicon은 `public/favicon.png`를 사용합니다. 사용자가 제공한 Cheat F/T 돋보기 아이콘에서 흰 배경을 투명 처리한 PNG입니다.
- 현재 Windows/Node 24.13 환경에서는 Vite 프로덕션 빌드가 네이티브 예외로 종료됩니다. Node 22 LTS 또는 배포 workflow의 검증된 Node 버전에서 빌드하는 구성을 권장합니다.
