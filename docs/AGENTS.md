# Codex 작업 안내 백업본

실제 고정 지침은 다음 파일을 우선한다.

1. 루트 `AGENTS.md`
2. `cheatft_web/AGENTS.md`

이 파일은 문서 폴더 안에서 지침 위치를 찾기 위한 백업 안내다. 새 작업을 시작할 때는 전체 스캔을 하지 말고 `cheatft_web/AGENTS.md`와 `cheatft_web/docs/handoff.md`를 먼저 읽는다.

핵심 규칙:

- `cheatft_api`는 절대 수정하지 않는다.
- 백엔드 확인은 읽기 전용으로만 한다.
- 로그인/회원가입/인증 요청도 프론트 범위에서만 처리한다.
- 프론트 동작, 라우트, 배포, 환경변수, API 연동, 인증 흐름, 주요 제약이 바뀌면 `cheatft_web/README.md`와 필요한 `docs/*.md`를 함께 갱신한다.
- 반복 규칙이 바뀌면 루트 `AGENTS.md` 또는 `cheatft_web/AGENTS.md`에 반영한다.
