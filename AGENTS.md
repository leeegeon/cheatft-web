# Codex 작업 지침

이 파일은 `cheatft_web` 프로젝트에서 Codex가 새 작업을 시작할 때 우선 따라야 하는 고정 지침이다.

## 시작 절차

- 사용자가 `시작`, `AGENTS대로 시작`, `이어서 작업`처럼 짧게 말하면 프로젝트 파악만 한다.
- 이 경우 구현, 파일 수정, 새 파일 생성, 테스트/빌드, 개발 서버 실행을 자동으로 시작하지 않는다.
- 마지막에는 현재 프로젝트 상태와 다음 작업 후보만 요약하고, 사용자가 구체적인 작업을 지시할 때까지 멈춘다.
- 전체 스캔을 먼저 하지 않는다.
- 먼저 `docs/handoff.md`를 읽어 현재 맥락을 잡는다.
- 필요할 때만 다음 문서를 추가로 읽는다.
  - 문서 역할 확인: `docs/README.md`
  - 코드 위치/화면 구조: `docs/code-map.md`
  - API 계약/백엔드 연동: `docs/backend-contract.md`
  - 작업 기록/검증 로그: `docs/api-integration-log.md`
  - 실행/배포/환경변수/현재 제약: `README.md`
- 실제 작업에 필요한 소스 파일만 추가로 연다.
- `node_modules/`, `dist/`, lock/minified 파일은 의존성/빌드 문제 분석이 필요할 때만 확인한다.

## 백엔드 원칙

- `../cheatft_api`는 읽기 전용으로만 확인한다.
- 어떤 경우에도 `../cheatft_api` 파일을 수정하지 않는다.
- `../cheatft_api`의 코드, 문서, 설정, lockfile, 의존성 폴더를 생성/수정/삭제하지 않는다.
- 사용자가 로그인/회원가입/인증 구현처럼 넓게 말해도 프론트엔드 범위에서만 수정한다.
- 백엔드 변경이 필요해 보이면 직접 수정하지 말고, 필요한 백엔드 요청사항을 사용자에게 설명한다.
- 백엔드 구현 확인이 필요하면 관련 파일만 읽고, 최신 계약은 `docs/backend-contract.md`를 우선한다.
- `cheatft_api/README.md`는 실제 배포/구현보다 늦게 반영될 수 있다. API 연동 작업은 README만 기준으로 판단하지 말고, 가능한 경우 실제 배포 API 응답과 `cheatft_api/src` 구현을 함께 확인한 뒤 프론트에 반영한다.

## 문서 갱신

- 프론트 동작, 라우트, 배포, 환경변수, API 연동, 인증 흐름, 주요 제약이 바뀌면 `README.md`를 매번 함께 갱신한다.
- 세부 인수인계는 `docs/handoff.md`, 파일 위치/구조는 `docs/code-map.md`, API 계약은 `docs/backend-contract.md`, 작업 검증 로그는 `docs/api-integration-log.md`에 같이 반영한다.
- 새 작업에서 반복적으로 알아야 하는 규칙은 이 `AGENTS.md`에도 반영한다.

## 종료 요청 처리

사용자가 `종료`라고만 말하면 현재 창의 작업 마무리 요청으로 처리한다.

- 이번 창에서 바뀐 작업 내용을 확인한다.
- 필요한 문서를 최신화한다.
  - `README.md`
  - `AGENTS.md`
  - `docs/handoff.md`
  - `docs/README.md`
  - `docs/code-map.md`
  - `docs/backend-contract.md`
  - `docs/api-integration-log.md`
- 변경 범위와 관련 없는 문서는 억지로 수정하지 않는다.
- 가능하면 `git status --short`로 변경 파일을 확인한다.
- 검증을 이미 수행했다면 결과를 문서와 답변에 반영한다. 수행하지 못했다면 수행하지 못했다고 명시한다.
- 최종 답변에는 한글 push용 제목과 내용을 제공한다.
- push용 내용은 변경 파일 이름만 나열하지 말고, 실제 변경 의도를 2~4줄로 요약한다.
- push용 내용 줄은 Markdown 목록으로 렌더링되는 점 목록이 아니라, 코드블록 안에서 각 줄이 하이픈(`-`)으로 시작하게 작성한다.
  ```text
  - cheatft_web/AGENTS.md에 시작/종료 처리와 백엔드 수정 금지 원칙 강화
  - docs 문서의 중복 지침을 줄이고 최신 지침 위치로 정리
  - README와 handoff에 문서 갱신 및 종료 처리 규칙 반영
  ```
- `cheatft_api`는 종료 정리 중에도 절대 수정하지 않는다.

## 현재 주요 메모

- API 기본 URL은 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`를 기준으로 한다.
- 로그인 accessToken은 `localStorage`의 `cheat-ft-access-token`에 저장한다.
- 로그인 후 현재 사용자 정보는 `localStorage`의 `cheat-ft-current-user`에 저장하고 오른쪽 상단에 닉네임을 표시한다.
- 보호 라우트는 `/community/write`, `/algo`, `/report`이다.
- 마이페이지 화면과 `/mypage` 라우트는 제거됐다.
- 홈/신뢰도 분석(`/search`)/편향성 분석(`/algo`)/팩트체크 리포트/커뮤니티는 프론트 더미 fallback 없이 API 응답, 오류, 빈 상태를 표시한다.
- 비밀번호 찾기는 `/password-reset`에서 코드 발송, 인증번호 검증, 새 비밀번호 설정 순서로 `/api/password/*` 라우트를 호출한다.
- 신뢰도 분석은 `GET /checks/{id}?page=1&limit=100`으로 받은 결과를 프론트에서 10건씩 페이지네이션하고, 기사 상세에서 뒤로가기 시 검색어별 `sessionStorage` 캐시로 기존 결과를 복원한다. 현재 배포 API는 서버 `page/limit`을 실제 분할에 반영하지 않는 것으로 관측됐다.
- 언론사별 분류/신뢰도 기준은 `src/data/pressReliability.js`, 사람이 검토할 이유 표는 `docs/press-reliability.md`를 우선 본다.
- 프론트 테스트 계정은 `codex.test.20260716@example.com / Codex테스트0716 / Test!20260716#Codex`이다.

## 검증

일반적으로 `cheatft_web`에서 다음을 확인한다.

```powershell
npm run lint
npm test
npm run build
```

현재 일부 Windows/Node 24.13 환경에서는 Vite 프로덕션 빌드가 네이티브 예외로 종료된 이력이 있다. Node 22 LTS 또는 검증된 배포 workflow Node 버전에서 빌드하는 것을 우선한다.
