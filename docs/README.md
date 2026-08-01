# Cheat F/T 문서 색인

마지막 갱신: 2026-08-02

이 폴더는 `cheatft_web`과 로컬 `cheatft_api`를 이어 작업할 때 보는 기준 문서 모음이다. 새 작업을 시작할 때는 전체 스캔보다 아래 순서를 우선한다.

## 최신 기준 문서

- `../../AGENTS.md`: `동아리` 폴더에서 `시작`/`종료`처럼 짧게 말했을 때 `cheatft_web/AGENTS.md`로 연결하는 루트 라우팅 지침.
- `../AGENTS.md`: Codex가 `cheatft_web` 작업 시작/종료 시 따라야 하는 고정 지침. 반복 시작 프롬프트 대신 이 파일을 우선한다.
- `../README.md`: 프론트 실행, 배포, 환경변수, 현재 API 연동 상태와 주요 제약 요약. 사용자/팀원이 바로 보는 문서이므로 관련 작업 때 매번 함께 갱신한다.
- `handoff.md`: 새 채팅 인수인계 요약. 먼저 읽을 파일.
- `code-map.md`: 폴더/파일/화면별 역할 지도.
- `backend-contract.md`: 프론트 화면과 실제 백엔드 API 구현/명세 매핑.
- `api-integration-log.md`: API 연동 작업 기록과 검증 로그. 현재 동작 요약은 최신 섹션을 우선 본다.
- `press-reliability.md`: 언론사별 분류, 신뢰도, AI 별점 참고값, 판단 이유를 사람이 검토하기 쉽게 정리한 표. 사이트 반영 원본은 `../src/data/pressReliability.js`이다.
- `AGENTS.md`: 실제 지침 위치를 안내하는 최소 백업본. 세부 규칙은 중복 기록하지 않고 루트 `AGENTS.md`와 `../AGENTS.md`를 우선한다.

## 역사/협의 문서

- `backend-handoff.md`: 초기 백엔드 협의 제안 메모. `/auth/login`, `/fact-checks` 같은 제안 경로가 남아 있으므로 최신 계약으로 보지 않는다. 실제 구현/연동 기준은 `backend-contract.md`이다.

## 현재 주의점

- `cheatft_api`는 절대 수정하지 않는다. 필요한 경우 읽기 전용으로만 확인하고, 로그인/회원가입/인증 요청도 프론트 범위에서 처리한다.
- 현재 API 성격: 2026-08-02 로컬 백엔드 pull 기준 `auth/checks/keywords/analysis/reports`는 실제 라우트/서비스/DB 흐름이고, `summary/posts/profile`은 dummy controller 중심이다.
- 2026-07-16 기준 `/api/login`, `/api/signup`, `/api/me`는 배포 API에서 테스트 계정으로 동작 확인했다.
- 2026-07-26 기준 검증하기 검색 결과는 최대 100건을 요청하지만 배포 API는 12건 반환으로 관측됐고, 화면은 수신 결과를 10건씩 클라이언트 페이지네이션한다. 정렬은 백엔드 기본 연관도순과 최신순만 제공한다.
- 2026-08-02 기준 신뢰도 분석은 `POST /keywords`로 추천 키워드를 받고, `GET /analysis/{id}?limit=10`으로 관련/반박 기사를 각각 최대 10건까지 표시한다.
- 2026-08-02 기준 팩트체크 리포트는 로그인 필요 화면이며, `GET /reports` 목록과 `GET /analysis/{id}?limit=10` 상세를 사용하고 실패 시 리포트 목업 fallback을 쓰지 않는다.
- 최신 프론트 상태는 `handoff.md`와 `code-map.md`, API 계약은 `backend-contract.md`, 검증 로그는 `api-integration-log.md`를 우선 본다.
- 프론트 동작/라우트/배포/API/인증/제약이 바뀌면 `cheatft_web/README.md`와 필요한 `docs/*.md`, 반복 규칙은 `cheatft_web/AGENTS.md`까지 함께 갱신한다. 세부 시작/종료 규칙은 `../AGENTS.md`를 기준으로 한다.
- 사용자가 `종료`라고만 말하면 문서 최신화와 한글 push용 제목/내용 전달까지 수행한다. push용 내용은 파일명 나열보다 변경 의도 중심의 2~4줄로 작성하고, 점 목록이 아니라 코드블록 안에서 각 줄이 하이픈(`-`)으로 시작하게 한다.
- 루트 `.git`은 2026-07-15 확인 기준 git 저장소로 동작하지 않는다. `cheatft_web`, `cheatft_api`의 git 명령은 Codex sandbox 사용자 기준 `dubious ownership`가 발생할 수 있다.
- 2026-07-31에 과거 전체 스캔 산출물 `.understand-anything/`과 임시 로그 파일을 정리했다.
