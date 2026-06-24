# 백엔드 협의 체크리스트

이 문서는 프런트엔드에서 필요한 계약을 정리한 초안입니다. 아래 경로와 응답 형태는 제안이며, 회의에서 확정한 뒤 실제 API 연결을 시작합니다.

## 먼저 결정할 항목

1. 개발·운영 API 기본 URL과 CORS 허용 origin
2. 인증 방식: HttpOnly 세션 쿠키 또는 Bearer access/refresh token
3. 공통 오류 응답 형태와 HTTP 상태 코드 기준
4. 목록 API의 페이지네이션 방식: page/size 또는 cursor
5. 날짜 형식과 시간대: ISO 8601 UTC 권장
6. 팩트체크가 동기 응답인지 비동기 작업인지
7. 출처 신빙성·편향성 점수의 범위와 산정 근거 필드

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

프런트엔드는 현재 인증 성공 여부를 메모리에만 저장합니다. 계약 전에는 이를 실제 인증으로 간주하지 않습니다.

## 프런트 준비 상태

- API 기본 URL: `VITE_API_BASE_URL`
- 공통 JSON 요청·오류 처리: `src/services/apiClient.js`
- 검색어 공유 URL: `/search?q=...`
- 글 작성 초안: `sessionStorage`에 탭 단위 저장
- 목업 데이터는 API 연결 시 별도 데이터 모듈로 이동 예정
