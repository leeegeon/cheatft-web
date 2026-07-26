# 백엔드 협의 체크리스트

마지막 갱신: 2026-07-26

이 문서는 프런트엔드에서 필요한 계약을 정리한 협의 메모입니다. 현재 백엔드 담당자 구현의 기준 위치는 `../../cheatft_api/src`이고, 프론트 화면별 최신 매핑은 `./backend-contract.md`에 정리되어 있습니다.

주의: 아래 "제안 API 목록"은 초기 회의용 제안 경로를 보존한 것입니다. 실제 `cheatft_api`의 현재 경로는 `/api/login`, `/api/signup`, `/api/checks`, `/api/analysis`처럼 `/api/...` 형태입니다. 구현 전에는 `./backend-contract.md`의 차이 정리를 먼저 확인하세요.

현재 배포 API는 `https://cheatft.leegeon.com/api`입니다. `summary/reports/posts/profile`은 dummy controller 응답이고, `auth/checks/analysis`는 실제 라우트/서비스/DB 흐름을 사용합니다. 2026-07-26 관측 기준 로그인과 `/api/me`는 테스트 계정으로 정상 동작합니다. 다만 `reports/posts` query, `checks` page/limit, `analysis` limit은 실제 결과에 반영되지 않고, 중복 회원가입은 현재 `409`가 아니라 `500`으로 내려옵니다.

## 먼저 결정할 항목

1. 개발·운영 API 기본 URL과 CORS 허용 origin
2. 인증 방식: HttpOnly 세션 쿠키 또는 Bearer access/refresh token
3. 공통 오류 응답 형태와 HTTP 상태 코드 기준
4. 목록 API의 페이지네이션 방식: page/size 또는 cursor
5. 날짜 형식과 시간대: ISO 8601 UTC 권장
6. 팩트체크가 동기 응답인지 비동기 작업인지
7. 출처 신빙성·편향성 점수의 범위와 산정 근거 필드

## 현재 백엔드 명세 기준 경로

| 기능 | 메서드 | 현재 명세 경로 | 프런트 화면 |
|---|---|---|---|
| 홈 요약 | GET | `/api/summary` | 홈 |
| 회원가입 | POST | `/api/signup` | 회원가입 |
| 로그인 | POST | `/api/login` | 로그인 |
| 팩트체크 요청 | POST | `/api/checks` | 홈, 검증하기 |
| 팩트체크 결과 | GET | `/api/checks/{id}` | 검증하기 |
| 알고리즘 분석 요청 | POST | `/api/analysis` | 알고리즘 분석 |
| 알고리즘 분석 결과 | GET | `/api/analysis/{id}` | 알고리즘 분석 |
| 리포트 목록 | GET | `/api/reports` | 팩트체크 리포트 |
| 게시글 목록 | GET | `/api/posts` | 커뮤니티 |
| 게시글 작성 | POST | `/api/posts` | 글 작성 |
| 프로필 | GET | `/api/profile` | 마이페이지 |
| 내 정보 | GET | `/api/me` | 인증 사용자 정보 |
| 헬스체크 | GET | `/api/health` | 서버 상태 확인 |

현재 명세에 아직 없는 화면 요구사항:

- 뉴스 상세: `/article/:id`
- 커뮤니티 게시글 상세: `/community/:id`
- 댓글 목록/작성
- 로그아웃/토큰 갱신
- 알림
- 리포트/분석 다운로드

## 제안 API 목록

| 기능 | 메서드 | 제안 경로 | 프런트에서 필요한 핵심 값 |
|---|---|---|---|
| 로그인 | POST | `/auth/login` | 사용자, 인증 상태 |
| 회원가입 | POST | `/auth/signup` | 생성된 사용자 |
| 내 정보 | GET | `/users/me` | id, email, nickname, role |
| 로그아웃 | POST | `/auth/logout` | 성공 여부 |
| 팩트체크 요청 | POST | `/fact-checks` | 작업 또는 결과 id, 상태 |
| 팩트체크 결과 | GET | `/fact-checks/:id` | 판정, 근거, 출처, 점수 |
| 검색 기록 | GET | `/fact-checks` | 목록, 페이지 정보 |
| 기사 상세 | GET | `/articles/:id` | 본문, 언론사, 날짜, 분석 |
| 알고리즘 분석 | POST | `/bias-analyses` | 분석 id, 점수, 관련 기사 |
| 게시글 목록 | GET | `/posts` | 글 목록, 페이지 정보 |
| 게시글 작성 | POST | `/posts` | 생성된 게시글 id |
| 게시글 상세 | GET | `/posts/:id` | 본문, 작성자, 댓글 |
| 댓글 작성 | POST | `/posts/:id/comments` | 생성된 댓글 |

## 공통 응답 제안

성공 응답은 실제 데이터가 바로 오거나 `data`로 감싸는 방식 중 하나로 통일해야 합니다.

```json
{
  "data": {},
  "meta": {}
}
```

오류는 사용자가 볼 메시지와 프로그램이 처리할 코드를 분리하는 형태를 권장합니다.

```json
{
  "code": "VALIDATION_ERROR",
  "message": "입력값을 확인해주세요.",
  "details": {
    "field": "email"
  }
}
```

## 팩트체크 결과에 필요한 정보

- 판정: true, false, mixed, insufficient 중 사용할 값
- 전체 신뢰도 점수와 점수 범위
- 출처별 이름, URL, 게시일, 신뢰도 점수
- 주장에 찬성·반박하는 근거 구분
- 알고리즘 분석 설명과 모델/규칙 버전
- 분석 시작·완료 시간 및 처리 상태

분석이 오래 걸리면 `POST /fact-checks`에서 `202 Accepted`와 작업 id를 받고 상태를 조회하는 방식을 협의해야 합니다. 폴링, SSE, WebSocket 중 전달 방식도 함께 결정해야 합니다.

## 인증 협의 시 확인할 내용

- 쿠키 사용 시 SameSite, Secure, CSRF 정책
- 토큰 사용 시 저장 위치와 갱신 방식
- 로그인 실패 횟수 제한과 오류 메시지
- 역할과 권한: 일반 사용자, 운영자 등
- 보호 대상 화면 및 API

프런트엔드는 현재 `/login` 응답의 `accessToken`을 `localStorage`에 저장하고 이후 요청에 Bearer 토큰으로 첨부합니다.
`/login` 응답에 `accessToken`이 없으면 로그인 실패로 처리합니다.
`/signup` 명세에는 `accessToken`이 없어서 회원가입 성공 후 로그인 화면으로 이동합니다. 회원가입 직후 자동 로그인 여부를 어떻게 처리할지 확정이 필요합니다.
로그아웃 API와 refresh token 정책은 아직 명세에 없습니다.

## 프런트 준비 상태

- API 기본 URL: `VITE_API_BASE_URL`
- 공통 JSON 요청·오류 처리와 토큰 첨부: `src/services/apiClient.js`
- 명세 기반 도메인 API 함수: `src/services/cheatftApi.js`
- 검색어 공유 URL: `/search?q=...`
- 글 작성 초안: `sessionStorage`에 탭 단위 저장
- 홈/검증하기는 API 응답을 우선 사용하고 실패 시 기존 목업으로 fallback하지 않음
- 리포트/커뮤니티/알고리즘 분석은 아직 일부 목업 fallback 유지
- 검증하기는 API 요청 성공 시 API의 `articles` 배열만 표시하고, 빈 배열이면 프론트 예시를 섞지 않고 빈 상태 표시
- 로그인, 회원가입, 게시글 등록은 실패 시 오류 표시
- 홈/검증하기 기본 화면은 `GET /summary`의 `recentChecks`로 최신 팩트체크 표시
- 커뮤니티 목록은 `GET /posts`에 `category`, `keyword`, `page`, `limit` 전달. 2026-07-26 배포 API 기준 실제 응답은 query와 무관한 dummy 고정값
- 리포트 목록은 `GET /reports`에 `keyword`, `date`, `score`, `page`, `limit` 전달. 2026-07-26 배포 API 기준 실제 응답은 query와 무관한 dummy 고정값
- 마이페이지 화면/라우트는 제거됨. `/api/profile`은 공개 dummy endpoint로 남아 있음
- 목업 데이터는 추후 `src/mocks/` 또는 `src/data/`로 분리 예정

`VITE_API_BASE_URL=https://cheatft.leegeon.com/api`처럼 `/api`까지 포함하면 프론트 서비스 함수는 `apiRequest('/login')`처럼 호출해야 합니다. `apiRequest('/api/login')`로 작성하면 `/api/api/login`이 됩니다.
2026-07-15 현재 로컬 `../../cheatft_api`는 Express/PostgreSQL/JWT 기반 실제 백엔드 구현체입니다. 다만 실행에는 의존성, 환경변수, PostgreSQL 연결이 필요하고, Codex는 `cheatft_api`를 수정하지 않습니다. 최신 실제 관측값과 프론트 반영 내용은 `./backend-contract.md`를 우선 확인하세요.

## 2026-07-26 배포 API 재확인

- `GET /summary`의 `recentChecks`는 3개입니다.
- `POST /signup` 성공 응답은 `id`, `email`, `nickname`, `level`, `user_title`, `created_at`입니다.
- `POST /signup` 중복 이메일은 현재 `500`, `이미 사용 중인 이메일입니다.` 메시지를 반환합니다.
- `POST /login`과 `GET /me`는 테스트 계정으로 정상 동작합니다.
- `GET /checks/{id}`는 `page/limit`을 실제 분할에 반영하지 않고, article `press`는 숫자가 아니라 언론사명 문자열로 반환합니다.
- `POST /checks`의 `type=url`은 202로 접수되지만 URL 본문 파싱이 아니라 검색어처럼 처리됩니다.
- `GET /analysis/{id}`는 `limit` query를 실제 결과 개수에 반영하지 않고, 응답 body에 `limit` 필드가 없습니다.
- `GET /reports`, `GET /posts`는 filter/page query와 무관하게 같은 dummy 응답을 반환합니다.
- `POST /posts`는 성공 시 `id`, `title`, `category`만 반환합니다.
- `GET /health`는 `{ status, message, data }` 공통 래핑이 아니라 `{ message }`만 반환합니다.

## 2026-07-10 배포 더미 API 확인

- 2026-07-10 당시 `GET /summary`의 `recentChecks`는 1개였습니다.
- 2026-07-10 당시 `POST /checks`는 `checkId: 452`를 반환했습니다.
- 2026-07-10 당시 `GET /checks/452`의 `articles` 배열은 1개였습니다.
- 같은 응답에서 `totalArticles`와 `pagination.totalItems`는 12로 표시됩니다.
- 따라서 현재 프런트 화면에 실제 카드로 렌더링되는 검증 기사 수는 1개이고, 총합 메타데이터는 12개로 표시될 수 있습니다.

## 2026-07-05 프론트 연동 작업 기록

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `src/services/cheatftApi.js`를 추가해 명세 기반 API 호출을 한 곳에 모았다.
- `src/services/apiClient.js`에 `apiData`, accessToken 저장/삭제/첨부 로직을 추가했다.
- 홈, 검증하기, 알고리즘 분석, 리포트, 커뮤니티, 글 작성, 로그인, 회원가입, 마이페이지를 API 우선 방식으로 연결했다.
- 백엔드가 꺼져 있거나 `.env.local`이 없을 때 화면이 깨지지 않도록 기존 목업을 fallback으로 유지했다.
- 로그인은 accessToken 필수, 회원가입은 성공 후 로그인 화면 이동으로 정리했다.
- 커뮤니티/리포트 목록 필터 query parameter와 마이페이지 profile 하위 필드를 추가 반영했다.
- 검증 결과: `npm run lint`, `npm test`, 번들 Node 기반 `vite build` 통과.

## 2026-07-10 프론트 연동 작업 기록

- `.env.local`과 `.env.example`의 API 기본 URL을 `https://cheatft.leegeon.com/api`로 갱신했다.
- 검증하기 화면에서 API 응답과 프론트 fallback 목업을 사용자가 구분할 수 있도록 안내/배지를 추가했다.
- API 성공 후 `articles`가 비어 있을 때 기존 KBS/뉴스1 예시를 섞지 않고 빈 상태를 보여주도록 정리했다.
- 검증 결과: `npm run lint`, `npm test`, 번들 Node 기반 `vite build` 통과.
