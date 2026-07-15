# API 연동 작업 로그

마지막 갱신: 2026-07-15
대상: `cheatft_web`
백엔드 폴더 수정 여부: 수정하지 않음

## 작업 목적

`cheatft_api/README.md`에 정리된 더미 API 명세와 배포 더미 API를 기준으로 `cheatft_web` 주요 화면이 실제 API를 우선 호출하도록 연결했다. 조회 화면은 API 서버가 없거나 요청이 실패하면 기존 목업 데이터로 화면을 유지한다. 로그인, 회원가입, 게시글 등록처럼 서버 반영이 필요한 동작은 실패 시 오류를 보여준다.

2026-07-12 추가 작업으로 검증하기 검색 결과는 백엔드 API 결과와 프론트 더미데이터를 구분해서 함께 보여주도록 바뀌었다. 로그인/회원가입은 입력 검증과 보호 라우트 흐름을 보강했다.

2026-07-15 추가 작업으로 실제 백엔드 코드의 `PRESS_MAPPING`, 인증 요구사항, 배포 API 관측값을 반영해 프론트 검증/알고리즘 화면을 다시 조정했다. API 성공 시에는 프론트 더미 결과를 섞지 않고, API 실패/미설정일 때만 fallback한다.

## 핵심 설계

- `.env.local`의 `VITE_API_BASE_URL`을 API 기본 URL로 사용한다.
- 현재 권장 값은 `https://cheatft.leegeon.com/api`이다.
- 기본 URL에 `/api`가 포함되어 있으므로 프론트 내부에서는 `/summary`, `/login`, `/posts`처럼 호출한다.
- 백엔드 응답 래핑 `{ status, message, data }`는 `apiData()`에서 `data` 중심으로 푼다.
- 로그인 accessToken은 `localStorage`의 `cheat-ft-access-token`에 저장한다.
- 저장된 토큰은 이후 요청에 `Authorization: Bearer ...`로 첨부한다.
- `/mypage`, `/community/write`는 로그인 필요 화면으로 처리한다.
- 로컬 `cheatft_api`는 현재 Express/PostgreSQL/JWT 기반 백엔드 구현체이다. 프론트 작업 중에는 확인 가능하지만 수정하지 않는다.
- 배포 API는 `https://cheatft.leegeon.com/api`에서 응답한다.

## 추가/수정 파일

- `cheatft_web/src/services/apiClient.js`: `apiData`, accessToken 저장/조회/삭제, Bearer 토큰 자동 첨부 추가.
- `cheatft_web/src/services/cheatftApi.js`: 명세 기반 도메인 API 함수 신규 추가.
- `cheatft_web/src/App.jsx`: 저장된 accessToken 기반 로그인 초기 상태, 로그아웃 시 토큰 삭제, 상세 이동 id 반영.
- `cheatft_web/src/components/views/*.jsx`: 홈, 검증하기, 알고리즘 분석, 리포트, 커뮤니티, 글 작성, 로그인, 회원가입, 마이페이지에 API 우선 호출 적용.
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
| 마이페이지 | `MyPageView.jsx` | `GET /profile` |

## 2026-07-05 추가 반영

- 홈의 최신 팩트체크 항목을 클릭하면 해당 제목으로 검증 화면으로 이동한다.
- 검색어 없이 `/search`에 들어간 검증하기 화면도 `GET /summary`의 `recentChecks`를 사용해 최신 팩트체크를 표시한다.
- 로그인은 `POST /login` 응답에 `accessToken`이 있을 때만 성공 처리한다. API 미설정이나 토큰 없는 응답은 오류로 보여준다.
- 회원가입은 `POST /signup` 성공 후 자동 로그인하지 않고 로그인 화면으로 이동한다. 현재 명세의 signup 응답에는 `accessToken`이 없기 때문이다.
- 커뮤니티 목록은 탭/카테고리/검색어/페이지 값을 `GET /posts` query parameter로 전달한다.
- 리포트 목록은 검색어/날짜/신뢰도 필터 값을 `GET /reports` query parameter로 전달한다.
- 마이페이지는 `/profile` 응답의 `infoConsumptionBias`, `reliabilityDistribution`, `interestTopicsTop5`, `earnedBadges`, `recentActivities`, `monthlySummary`까지 화면에 반영한다.

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
- 마이페이지: `GET /profile`의 중첩 객체가 일부 빠져도 화면이 깨지지 않도록 기본값과 병합한다. 배열 필드는 API가 빈 배열을 주면 빈 배열을 유지한다.

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
  - `/mypage`, `/community/write`를 보호 라우트로 처리한다.
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

추가/수정 파일:

- `cheatft_web/src/App.jsx`: `/algo` 보호 라우팅 추가, `/algo` 로그아웃 시 홈 이동.
- `cheatft_web/src/utils/press.js`: 백엔드 `PRESS_MAPPING` 기반 `getPressLabel()`, `getPressCategory()` 추가.
- `cheatft_web/src/components/views/VerificationView.jsx`
  - 기존 네이버 `officeList` 순번 매핑 제거.
  - 백엔드 oid/name 표 기반 언론사 정규화 적용.
  - 필터를 `전체 출처`, `방송/통신사`, `종합지`, `경제지`, `인터넷/IT지`, `기타 출처`, `프론트 더미`로 정리.
  - API 성공 시 백엔드 결과만 표시하고, 실패/미설정 시에만 프론트 더미 fallback 사용.
  - `GET /checks/{id}`에 `sort` query를 보내지 않고, 정렬 변경은 수신 결과를 로컬 정렬.
- `cheatft_web/src/components/views/AlgoView.jsx`: `description`, `publishedAt/createdAt/date`, `press/pressName/publisher/mediaName` 후보를 반영하고 `getPressLabel()` 사용.

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
- `profile`
- `login`
- `signup`

조회 화면은 API 실패 시에도 목업으로 fallback할 수 있으므로, 실제 연동 성공 여부는 Network 탭의 status code와 response body로 확인한다. 로그인, 회원가입, 게시글 등록은 API 실패 시 오류 메시지를 보여준다.

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
- 커뮤니티 게시글 상세/댓글 API 명세 추가
- 로그아웃, refresh token, 토큰 만료 처리 방식 확정
- 로그인/회원가입 실제 DB 저장, 비밀번호 검증, accessToken 발급 방식 구현 여부 확인
- 검증 결과 정렬/필터용 `press`, `viewCount`, `relevanceScore` 필드 확정
- 리포트/분석 다운로드 API 명세 추가
- 화면 내부 목업 배열을 `src/mocks/` 또는 `src/data/`로 분리
- 실제 백엔드 응답 필드가 확정되면 변환 로직 정리
