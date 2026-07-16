# Cheat F/T 문서 색인

마지막 갱신: 2026-07-15

이 폴더는 `cheatft_web`과 로컬 `cheatft_api`를 이어 작업할 때 보는 기준 문서 모음이다. 새 작업을 시작할 때는 전체 스캔보다 아래 순서를 우선한다.

## 최신 기준 문서

- `handoff.md`: 새 채팅 인수인계 요약. 먼저 읽을 파일.
- `code-map.md`: 폴더/파일/화면별 역할 지도.
- `backend-contract.md`: 프론트 화면과 실제 백엔드 API 구현/명세 매핑.
- `api-integration-log.md`: API 연동 작업 기록과 검증 로그. 현재 동작 요약은 최신 섹션을 우선 본다.
- `AGENTS.md`: Codex 작업 안내 백업본.

## 역사/협의 문서

- `backend-handoff.md`: 초기 백엔드 협의 제안 메모. `/auth/login`, `/fact-checks` 같은 제안 경로가 남아 있으므로 최신 계약으로 보지 않는다. 실제 구현/연동 기준은 `backend-contract.md`이다.

## 현재 주의점

- `cheatft_api`는 Express/PostgreSQL/JWT 백엔드 구현체이지만, Codex는 수정하지 않는다. 필요한 경우 읽기 전용으로만 확인하고, 로그인/회원가입 구현 같은 요청도 프론트 범위에서 처리한다.
- `summary/reports/posts/profile`은 dummy controller 응답이고, `auth/checks/analysis`는 실제 라우트/서비스/DB 흐름을 사용한다.
- `/api/login`, `/api/signup`, `/api/me`는 현재 `src/models/user.model.js`가 auth service 계약과 맞지 않아 정상 동작하지 않을 가능성이 높다.
- 2026-07-15 최신 프론트 보강: 언론사 로고 표시, `언론사(021)` 같은 미매핑 oid의 `localStorage` 관측 저장, API 문자열 HTML entity 디코딩은 `handoff.md`, `code-map.md`, `backend-contract.md`, `api-integration-log.md` 최신 섹션에 정리돼 있다.
- 루트 `.git`은 2026-07-15 확인 기준 git 저장소로 동작하지 않는다. `cheatft_web`, `cheatft_api`의 git 명령은 Codex sandbox 사용자 기준 `dubious ownership`가 발생할 수 있다.
- `.understand-anything/`은 2026-07-15 전체 스캔 산출물이며 일반 맥락 파악 때는 다시 훑지 않는다.
