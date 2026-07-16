# Codex 작업 안내

이 폴더의 기준 프로젝트 루트는 `C:\Users\eunhy\Desktop\동아리`이다.

새 채팅이나 새 작업을 시작할 때는 전체 파일을 무작정 스캔하지 말고, 먼저 `cheatft_web/docs/handoff.md`, 필요하면 `cheatft_web/docs/README.md`, `cheatft_web/docs/code-map.md`, `cheatft_web/docs/backend-contract.md`, `cheatft_web/docs/api-integration-log.md`만 읽어 맥락을 잡는다. 이후 실제 요청에 필요한 하위 폴더와 파일만 추가로 확인한다.

## 프로젝트 성격

이 폴더는 동아리 프로젝트 작업 공간이다. 현재 핵심 개발 대상은 `cheatft_web` 프론트엔드이며, 로컬 `cheatft_api`는 Express/PostgreSQL/JWT 기반 백엔드 구현체이다. 백엔드는 확인 가능하지만, Codex는 `cheatft_api`를 수정하지 않는다. 로그인/회원가입 구현처럼 표현이 넓은 요청도 프론트만 수정한다. 현재 API 기본 주소는 `https://cheatft.leegeon.com/api`이다. 그 외 `회의록`, `자료`, `파일`, `세미나`는 회의/발표/자료 보관 성격이 강하다.

## 주요 폴더

- `cheatft_web/`: Cheat F/T React 프론트엔드. Vite 기반이며 API 우선 호출, 실패 시 목업 fallback 구조.
- `cheatft_api/`: Express 백엔드 API 구현체. 읽기/확인만 가능하며 수정하지 않는다.
- `회의록/`: 회의록 문서와 변환된 Markdown 자료.
- `자료/`: 기획안/가이드 PDF 등 참고 자료.
- `파일/`: 사진과 기타 문서 자료.
- `세미나/`: Claude 설정/스킬 자료 압축 파일 등 세미나 관련 자료.
- `cheatft_web/docs/`: Codex 온보딩, 코드맵, 인수인계 메모, 프론트-백엔드 계약 요약, API 연동 작업 로그. 2026-07-15에 루트 `docs/`에서 이 위치로 옮겼다.

## 기본 작업 규칙

- 새 채팅에서는 `cheatft_web/docs/handoff.md` → 문서 역할 확인이 필요하면 `cheatft_web/docs/README.md` → 코드 구조가 필요하면 `cheatft_web/docs/code-map.md` → API 연동이면 `cheatft_web/docs/backend-contract.md`와 `cheatft_web/docs/api-integration-log.md` 순서로 읽는다.
- 큰 파일, 압축 파일, 이미지, PDF, Word 문서는 요청과 직접 관련 있을 때만 연다.
- `cheatft_web` 작업 전에는 `cheatft_web/README.md`와 필요한 소스 파일만 확인한다.
- 프론트엔드-백엔드 계약은 먼저 `cheatft_web/docs/backend-contract.md`를 보고, 실제 구현 확인이 필요하면 `cheatft_api/src`를 읽기 전용으로 확인한다.
- 회의록이나 자료 문서는 사용자가 요청한 날짜/주제와 관련된 파일만 읽는다.
- 기존 파일을 덮어쓰기 전에 사용자의 의도와 현재 변경 범위를 확인한다.
- 루트에는 `.git` 폴더가 보이지만 2026-07-15 확인 기준 `HEAD`가 없어 루트 git 저장소로 동작하지 않는다. `cheatft_web`, `cheatft_api`는 각각 git 저장소이지만 Codex sandbox 사용자 기준 `dubious ownership`가 발생하므로 git 명령이 필요하면 safe.directory 설정 여부를 먼저 확인한다.
- `cheatft_web/node_modules`, `cheatft_web/dist`, `package-lock.json`은 의존성 변경이나 빌드 문제 분석이 필요할 때만 확인한다.
- `.understand-anything/`은 2026-07-15 전체 스캔용으로 생성된 분석 산출물 폴더이다. 일반 프론트 작업 맥락 파악 때는 다시 훑지 않는다.

## 프론트엔드 실행/검증

`cheatft_web` 기준:

```powershell
cd C:\Users\eunhy\Desktop\동아리\cheatft_web
npm install
npm run dev
```

검증:

```powershell
npm run lint
npm test
npm run build
npm run check
```

`cheatft_web/README.md`에 따르면 Node.js 22 LTS 권장이다.

## Codex에게 권장하는 시작 프롬프트

```text
전체 스캔하지 말고 cheatft_web/docs/handoff.md, cheatft_web/docs/code-map.md, cheatft_web/docs/backend-contract.md, cheatft_web/docs/api-integration-log.md만 먼저 읽고 현재 맥락을 파악해줘.
프론트 실행이나 환경변수 확인이 필요할 때만 cheatft_web/README.md도 읽고, 실제 구현 확인이 필요한 파일만 추가로 열어봐. 백엔드 cheatft_api는 확인 가능하지만 수정하지 마. 로그인/회원가입 구현처럼 말해도 프론트만 수정해.
```
