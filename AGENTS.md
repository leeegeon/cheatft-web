# Codex 작업 지침

이 파일은 `cheatft_web` 프로젝트에서 Codex가 새 작업을 시작할 때 우선 따라야 하는 고정 지침이다.

## 시작 절차

- 전체 스캔을 먼저 하지 않는다.
- 먼저 `docs/handoff.md`를 읽어 현재 맥락을 잡는다.
- 필요할 때만 다음 문서를 추가로 읽는다.
  - 문서 역할 확인: `docs/README.md`
  - 코드 위치/화면 구조: `docs/code-map.md`
  - API 계약/백엔드 연동: `docs/backend-contract.md`
  - 작업 기록/검증 로그: `docs/api-integration-log.md`
  - 실행/배포/환경변수/현재 제약: `README.md`
- 실제 작업에 필요한 소스 파일만 추가로 연다.
- `node_modules/`, `dist/`, lock/minified 파일, `.understand-anything/`은 의존성/빌드 문제 분석이 필요할 때만 확인한다.

## 백엔드 원칙

- `../cheatft_api`는 읽기 전용으로만 확인한다.
- 어떤 경우에도 `../cheatft_api` 파일을 수정하지 않는다.
- `../cheatft_api`의 코드, 문서, 설정, lockfile, 의존성 폴더를 생성/수정/삭제하지 않는다.
- 사용자가 로그인/회원가입/인증 구현처럼 넓게 말해도 프론트엔드 범위에서만 수정한다.
- 백엔드 변경이 필요해 보이면 직접 수정하지 말고, 필요한 백엔드 요청사항을 사용자에게 설명한다.
- 백엔드 구현 확인이 필요하면 관련 파일만 읽고, 최신 계약은 `docs/backend-contract.md`를 우선한다.

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
- `cheatft_api`는 종료 정리 중에도 절대 수정하지 않는다.

## 현재 주요 메모

- API 기본 URL은 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`를 기준으로 한다.
- 로그인 accessToken은 `localStorage`의 `cheat-ft-access-token`에 저장한다.
- 로그인 후 현재 사용자 정보는 `localStorage`의 `cheat-ft-current-user`에 저장하고 오른쪽 상단에 닉네임을 표시한다.
- 보호 라우트는 `/community/write`, `/algo`이다.
- 마이페이지 화면과 `/mypage` 라우트는 제거됐다.
- 홈/검증하기는 프론트 더미 fallback 없이 API 응답, 오류, 빈 상태를 표시한다.
- 프론트 테스트 계정은 `codex.test.20260716@example.com / Codex테스트0716 / Test!20260716#Codex`이다.

## 검증

일반적으로 `cheatft_web`에서 다음을 확인한다.

```powershell
npm run lint
npm test
npm run build
```

현재 일부 Windows/Node 24.13 환경에서는 Vite 프로덕션 빌드가 네이티브 예외로 종료된 이력이 있다. Node 22 LTS 또는 검증된 배포 workflow Node 버전에서 빌드하는 것을 우선한다.
