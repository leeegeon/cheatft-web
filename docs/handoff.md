# Handoff

마지막 갱신: 2026-07-19
마지막 전체 프로젝트 스캔: 2026-07-15

새 채팅에서 이어받을 때는 루트 `AGENTS.md` → `cheatft_web/AGENTS.md` → 이 파일 순서로 본다. 필요한 경우 `cheatft_web/docs/code-map.md`, `cheatft_web/docs/backend-contract.md`, `cheatft_web/docs/api-integration-log.md`만 추가로 확인한다. 기존 루트 `docs/` 문서들은 2026-07-15에 `cheatft_web/docs/`로 이동했다.

## 현재 상태

- 프로젝트 기준 폴더는 `C:\Users\eunhy\Desktop\동아리`이다.
- 루트 폴더에는 `.git` 디렉터리가 보이지만 `HEAD`가 없어 루트 git 저장소로 동작하지 않는다. 작업 기준은 여전히 하위 프로젝트별로 본다.
- 핵심 개발 대상은 `cheatft_web` React/Vite 프론트엔드이다.
- 로컬 `cheatft_api`는 이제 Express/PostgreSQL/JWT 기반 Node 백엔드 코드와 API 명세 `README.md`를 포함한다.
- `cheatft_api`는 확인/분석을 위해 읽을 수 있다. 단, 앞으로 Codex는 `cheatft_api`를 수정하지 않는다. 로그인/회원가입 구현처럼 표현이 넓은 요청도 프론트만 수정하고, 백엔드는 읽기 전용으로만 확인한다.
- 배포 API는 `https://cheatft.leegeon.com/api`에서 응답한다. 일부 라우트는 실제 DB/토큰/네이버 뉴스 검색 흐름이고, `summary/reports/posts/profile`은 아직 더미 컨트롤러 중심이다.
- `cheatft_web`과 `cheatft_api`는 각각 `.git`이 있지만 Codex sandbox 사용자 기준으로 `dubious ownership`가 발생한다. Git 상태 확인이 필요하면 safe.directory 설정 여부를 먼저 확인한다.
- `cheatft_web`에는 `node_modules/`와 `dist/`가 이미 있으나 생성물/의존성 폴더이므로 일반 맥락 파악 때는 다시 훑지 않는다.
- `.understand-anything/`은 2026-07-15 전체 스캔용 산출물이다. 일반 맥락 파악 때는 다시 훑지 않는다.

## 빠른 시작 절차

1. 루트 `AGENTS.md`와 `cheatft_web/AGENTS.md`의 고정 지침을 우선한다.
2. `cheatft_web/docs/handoff.md`를 읽는다.
3. 필요할 때만 `docs/README.md`, `code-map.md`, `backend-contract.md`, `api-integration-log.md`, `cheatft_web/README.md`를 추가로 읽는다.
4. 실제 구현 확인이 필요한 파일만 추가로 연다.
5. 백엔드 확인이 필요하면 `cheatft_api`의 관련 파일을 읽기 전용으로만 확인한다. `cheatft_api`는 절대 수정하지 않는다.

## 문서 갱신 원칙

- 프론트 동작, 라우트, 배포, 환경변수, API 연동, 인증 흐름, 주요 제약을 바꾸면 `cheatft_web/README.md`도 매번 함께 갱신한다.
- 세부 작업 인수인계는 `cheatft_web/docs/handoff.md`, 파일 위치/구조는 `code-map.md`, API 계약은 `backend-contract.md`, 작업 검증 로그는 `api-integration-log.md`에 같이 반영한다.
- `cheatft_web/README.md`는 외부/팀원이 바로 보는 실행·배포·현재 제약 요약이고, `cheatft_web/docs/*`는 Codex 인수인계와 세부 작업 기록으로 본다.
- 반복 시작 프롬프트로 매번 전달하던 규칙은 `cheatft_web/AGENTS.md`에 고정한다. 규칙이 바뀌면 이 파일도 함께 갱신한다.
- 사용자가 `종료`라고만 말하면 작업 마무리 요청으로 보고, 이번 창 변경사항을 확인한 뒤 필요한 `README.md`, `AGENTS.md`, `docs/*.md`를 최신화하고 한글 push용 제목/내용을 전달한다.
- 종료 답변의 push용 내용은 파일명 나열보다 변경 의도 중심의 2~4줄로 작성한다. 점 목록으로 렌더링되지 않도록 코드블록 안에서 각 줄이 하이픈(`-`)으로 시작하게 한다.

```text
- cheatft_web/AGENTS.md에 시작/종료 처리와 백엔드 수정 금지 원칙 강화
- docs 문서의 중복 지침을 줄이고 최신 지침 위치로 정리
- README와 handoff에 문서 갱신 및 종료 처리 규칙 반영
```

## 프론트엔드 요약

- 실행 위치: `C:\Users\eunhy\Desktop\동아리\cheatft_web`
- 권장 Node: `.nvmrc` 기준 Node 22
- 프레임워크: React 19, React Router 7, Vite 8
- 화면 데이터: 홈/검증하기는 프론트 더미 fallback을 제거하고 백엔드 API 응답만 표시한다. 리포트/커뮤니티/알고리즘 분석 등 일부 화면에는 아직 실패 시 기존 목업 fallback이 남아 있다.
- API 응답이 성공했지만 배열이 비어 있으면 해당 빈 상태를 그대로 보여주며 프론트 목업을 섞지 않는다. 검증하기 검색 결과는 API 실패 시에도 프론트 더미데이터를 섞지 않고 오류/빈 상태를 보여준다.
- 현재 API 기본 URL: `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`
- API 준비: `src/services/apiClient.js`에 공통 요청/토큰 처리, `src/services/cheatftApi.js`에 명세 기반 도메인 호출 함수가 있음
- 인증: `/login`의 `accessToken`을 `localStorage`에 저장하고 Bearer 토큰으로 첨부. 로그인 성공 시 현재 사용자 정보도 `cheat-ft-current-user`에 저장해 오른쪽 상단에 닉네임을 표시한다. `/login` 응답에 `accessToken`이 없으면 실패 처리. `/signup`은 성공 후 로그인 화면으로 이동. `/community/write`, `/algo`는 비로그인 상태에서 `/login`으로 보내고, 로그인 성공 후 원래 경로로 복귀한다. 마이페이지 화면/라우트는 2026-07-15 작업에서 제거됐다.
- 검색 URL: `src/utils/search.js`가 `/search?q=...`를 만든다
- 언론사 표시: `src/utils/press.js`가 백엔드 oid/name 정규화, 네이버 `office_logo` 기반 로고 URL, 미매핑 `언론사(021)` 관측 저장을 담당한다. 관측값은 브라우저 `localStorage`의 `cheat-ft-observed-press-map`에 origin별로 저장되고, 개발자도구 Console에서 `cheatFtPressList()`로 `번호 - 언론사명` 목록을 복사할 수 있다.
- API 표시 텍스트: `src/utils/text.js`의 `cleanDisplayText()`가 `&quot;`, `&amp;`, `&#39;` 같은 HTML entity를 디코딩하고 남은 HTML 태그를 제거한다.
- 글 작성: `CommunityWriteView.jsx`가 `sessionStorage`에 임시 저장하고, 등록 시 `POST /posts`를 호출한다. API 기본 URL이 없거나 요청이 실패하면 오류를 보여주고 임시 저장은 유지된다.
- 로컬 `cheatft_api`는 실제 서버 코드가 있으나 DB 환경변수, `pg` 의존성 설치, JWT secret, 네이버 API 키 등이 필요하다. 프론트는 현재 배포 API 주소를 사용한다.

## 2026-07-19 신뢰도 분석 UI 흐름 조정

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 상단 nav에서 `/report` 진입 시 보이던 `리포트 내보내기` 버튼을 제거했다.
- 상단 nav에서 `/community` 진입 시 보이던 알림/`글 작성하기` 전용 버튼도 제거해 `/report`와 `/community`가 다른 화면과 같은 상단바를 쓰도록 통일했다.
- `cheatft_web/src/components/views/AlgoView.jsx`를 수정했다.
  - 기존 단일 키워드 입력/분석 버튼 흐름을 질문 입력 → 추천 키워드 제시 → 키워드 칩 선택 시 분석 API 호출 흐름으로 바꿨다.
  - 추천 키워드는 현재 프론트에서 질문 문장을 정리해 5개 이하로 생성한다. 실제 분석 API 호출은 사용자가 추천 키워드 칩을 누를 때만 실행한다.
  - `POST /analysis`, `GET /analysis/{id}` API 호출 구조와 실패 시 목업 fallback 구조는 유지했다.
  - 메인 영역에서 `AI 주요 인사이트`와 `신뢰도 분석 요약`을 관련 뉴스/반박 기사 탭보다 위로 올렸다.
  - 관련 뉴스/반박 기사는 인사이트 아래의 서브 섹션으로 배치했다.
- `AlgoView.jsx`의 `분석 리포트 다운로드` 버튼을 제거했다.
- `cheatft_web/src/components/views/ReportView.jsx`를 수정했다.
  - `총 검색 시간` 통계 카드를 제거하고 통계 그리드를 3칸으로 재정렬했다.
  - 상세 확장 영역의 `전체 요약 다운로드` 버튼을 제거했다.
  - 리포트 메인 영역 배경, 헤더 카드, 툴바, 리포트 카드 테두리/그림자를 정돈했다.
- `cheatft_web/src/components/views/CommunityView.jsx`를 수정했다.
  - 커뮤니티 `글 작성하기` 버튼을 전역 상단바에서 커뮤니티 목록 상단의 검색/필터 영역으로 옮겼다.
  - 오른쪽 `정정 요청하기` 배너 버튼도 `/community/write`로 이동하도록 연결했다.
  - `키뮤니티 참여 현황` 오타를 `커뮤니티 참여 현황`으로 수정했다.
- 검증: `npm run lint` 통과.

## 2026-07-16 상단 사용자 표시/favicon 변경

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 백엔드 요청사항으로 로그인 후 오른쪽 상단에 현재 사용자 이름을 표시하도록 프론트만 보강했다.
- `cheatft_web/src/services/apiClient.js`
  - `cheat-ft-current-user` localStorage key를 추가했다.
  - `getCurrentUser()`, `setCurrentUser()`, `clearCurrentUser()`를 추가했다.
  - JSON 파싱 실패 시 저장값을 삭제하고 `null`을 반환한다.
- `cheatft_web/src/services/cheatftApi.js`
  - 로그인 성공 시 `accessToken` 저장과 함께 `userId/id`, `email`, `nickname` 후보를 현재 사용자 정보로 저장한다.
  - `session.nickname`과 `session.user.nickname` 형태를 모두 받는다.
- `cheatft_web/src/App.jsx`
  - 저장된 토큰과 현재 사용자 정보로 로그인 초기 상태를 만든다.
  - 로그인 후 nav 오른쪽에 닉네임을 표시한다.
  - 표시 이름 fallback은 `nickname`, `name`, 이메일 앞부분, `사용자` 순서다.
  - 로그아웃 시 accessToken과 현재 사용자 정보를 함께 삭제한다.
- 주소창/탭 표시:
  - `cheatft_web/index.html`의 `lang`을 `ko`, title을 `Cheat F/T`로 변경했다.
  - favicon 참조를 `/favicon.png`로 바꿨다.
  - `cheatft_web/public/favicon.png`는 사용자가 제공한 Cheat F/T 돋보기 아이콘 이미지의 흰 배경을 투명 처리한 512x512 PNG다.
  - 기존 `public/favicon.svg`는 남아 있지만 현재 `index.html`에서는 사용하지 않는다.
- 검증:
  - `npm run lint` 통과
  - `npm test` 통과
  - 일반 셸 Node의 `npm run build`는 기존 Vite/Node 네이티브 종료 이슈로 `41 modules transformed` 이후 exit 1 재현
  - Codex 번들 Node 기반 `npm run build` 통과

## 2026-07-16 배포/인증 점검 및 로그인 회원가입 보강

- 사용자가 최신 프론트를 배포했지만 `https://cheatft.leegeon.com/`에서 화면이 안 나오는 문제를 확인했다.
  - 운영 `/`은 여전히 Vite dev HTML(`/@vite/client`, `/src/main.jsx`, `/@react-refresh`)을 서빙한다.
  - `/src/services/apiClient.js`는 404다.
  - `/assets/index-*.js`, `/assets/index-*.css` 요청도 실제 JS/CSS가 아니라 HTML fallback이 내려오는 상태를 확인했다.
  - 결론: 프론트 코드 문제가 아니라 운영 서버 web root/SPA fallback 설정 문제다. `cheatft_web` 루트가 아니라 `cheatft_web/dist` 산출물을 배포해야 한다.
- `cheatft_web/README.md`에 운영 배포 섹션을 추가했다.
  - 정상 운영 HTML에는 `/@vite/client`, `/src/main.jsx`, `/@react-refresh`가 없어야 한다.
  - 정상 운영 HTML은 `/assets/index-*.js`, `/assets/index-*.css`를 참조해야 한다.
  - `/assets/*.js` 응답이 `<!doctype html>`로 시작하면 fallback 설정이 잘못된 상태다.
- 백엔드 pull 후 `cheatft_api/src/models/user.model.js`가 사용자 모델로 복구된 것을 확인했다.
  - `findByEmail(email)`, `createUser(email, password, nickname)`, `findById(id)`가 존재한다.
  - 회원가입 응답은 `id, email, nickname, level, user_title, created_at`만 반환하고 password hash는 노출하지 않는다.
- 이번 창에서 실수로 `cheatft_api/src/controllers/auth.controller.js`를 수정했으나, 사용자 요청으로 즉시 원상복구했다.
  - 백엔드 컨트롤러는 다시 pull 직후 형태로 돌아갔다.
  - 이후 작업 원칙: `cheatft_api`는 어떤 경우에도 수정하지 않고, 필요한 경우 읽기 전용 확인만 한다.
- 이번 창에서 `cheatft_web/src/components/views/LoginView.jsx`를 수정했다.
  - 로그인 요청 전 password 앞뒤 공백을 제거한다. 복붙 중 끝 공백이 붙어 `401`이 나는 경우를 줄이기 위한 최소 보강이다.
- `cheatft_api`에는 기존에 `node_modules/`가 없어 인증 모듈 로드 검증이 `Cannot find module 'bcrypt'`로 실패했다.
  - 승인 후 `cheatft_api`에서 `npm ci`를 실행해 검증했으나, 사용자 요청으로 생성된 `cheatft_api/node_modules/`도 삭제했다.
- 검증:
  - `cheatft_web`: `npm run lint` 통과
  - `cheatft_web`: `npm test` 통과
  - `cheatft_web`: Codex 번들 Node로 `vite build` 통과
  - `cheatft_api`: 최종 상태에서는 수정하지 않음. 테스트 스크립트는 아직 `echo "Error: no test specified" && exit 1`이라 의미 있는 `npm test` 없음
- 배포 API 인증 확인:
  - `POST https://cheatft.leegeon.com/api/login`은 테스트 계정으로 200 로그인 성공.
  - `GET https://cheatft.leegeon.com/api/me`는 발급 토큰으로 200 사용자 정보 조회 성공.
  - `OPTIONS https://cheatft.leegeon.com/api/login`은 `204`, `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Headers: content-type`.
- 프론트 로컬 확인:
  - `http://localhost:3001/src/services/apiClient.js`에 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`가 주입된 것을 확인했다.
  - Playwright+로컬 Chrome headless에서 `http://localhost:3001/login` 폼이 정확한 payload를 `https://cheatft.leegeon.com/api/login`으로 보내는 것을 확인했다.
  - headless Chrome에서는 응답이 `Failed to fetch`로 관측됐지만, 같은 Origin/preflight/API 직접 호출은 성공했다. 실제 사용자 브라우저에서는 이후 로그인 성공 확인됨.
- 프론트 테스트용 계정:
  - 이메일: `codex.test.20260716@example.com`
  - 닉네임: `Codex테스트0716`
  - 비밀번호: `Test!20260716#Codex`
  - 배포 API에서 실제 생성된 계정이며 `userId: 2`, `level: 1`, `user_title: 신규 사용자`.
  - 이 계정은 앞으로 프론트 로그인/보호 라우트 테스트에 사용한다.

## 2026-07-16 문서 지침 정리

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `cheatft_web/AGENTS.md`에 종료 답변의 push용 내용 작성 방식을 추가했다.
  - 파일명만 나열하지 않고 실제 변경 의도를 2~4줄로 요약한다.
  - 점 목록이 아니라 코드블록 안에서 `-`로 시작하는 줄 형태로 출력하도록 명시했다.
- `cheatft_web/docs/AGENTS.md`는 세부 규칙을 반복하지 않고 최신 지침 위치를 안내하는 최소 문서로 정리했다.
- `cheatft_web/docs/README.md`, `cheatft_web/README.md`, `cheatft_web/docs/handoff.md`에 문서 갱신 및 종료 처리 규칙과 push용 내용 작성 기준을 반영했다.
- 검증: 문서만 수정했으므로 lint/test/build는 실행하지 않았다.

## 2026-07-15 전체 스캔/문서 최신화

- `understand` 스킬의 pre-flight를 실행했고, 플러그인 core 빌드를 위해 `pnpm install`, `pnpm approve-builds --all`, `pnpm --filter @understand-anything/core build`를 수행했다.
- `.understand-anything/.understandignore`와 `intermediate/scan-result.json`, `intermediate/batches.json`이 생성됐다.
- scan 결과는 92개 파일, 8개 semantic batch였다. `node_modules`, `.git`, `dist`, lock/minified 파일은 기본 ignore 대상이다.
- 스캔에는 `세미나/claude/__MACOSX` 압축 부산물과 `회의록` 변환본도 포함됐다. 문서 최신화 기준으로는 `cheatft_web`, `cheatft_api`, `cheatft_web/docs`를 우선 신뢰한다.
- 루트 `.git`은 실제 저장소로 동작하지 않고, 하위 프로젝트 git은 `dubious ownership`가 재현됐다.
- `cheatft_web/README.md`의 오래된 “cheatft_api는 명세 문서뿐” 설명과 이동 전 docs 경로를 최신 상태로 수정했다.

## 2026-07-15 백엔드 코드 반영/프론트 조정

- 기존 루트 `docs/` 문서를 `cheatft_web/docs/`로 이동했다. 이후 문서 기준 위치는 `cheatft_web/docs`이다.
- `cheatft_api`는 실제 Node/Express 백엔드 프로젝트로 바뀌었다.
  - 주요 파일: `src/index.js`, `src/routes/*.js`, `src/controllers/*.js`, `src/services/*.js`, `src/models/*.js`, `src/middlewares/auth.middleware.js`, `src/config/db.config.js`
  - 의존성: `express`, `pg`, `jsonwebtoken`, `bcrypt`, `cors`, `dotenv`, `axios`
  - `POST /api/checks`는 선택 인증이고, 네이버 뉴스 API 키가 없거나 실패하면 fallback article을 DB에 저장한다.
  - `POST /api/analysis`, `GET /api/analysis/{id}`는 `verifyToken`을 요구한다.
- 배포 API 확인 결과:
  - `/api/summary`와 `/api/profile`은 200 응답.
  - `/api/me`는 토큰 없으면 401.
  - `/api/login`은 현재 `UserModel.findByEmail is not a function` 메시지와 함께 401 응답. 로컬 `cheatft_api/src/models/user.model.js`가 사용자 모델이 아니라 checks 모델 내용으로 들어간 상태와 일치한다.
  - `/api/checks/452`는 새 DB 기반 API에서는 기존 더미 id가 없어 404.
  - `/api/health`는 서버 상태 확인 라우트로 로컬 코드에 존재한다.
- 배포 프론트 `https://cheatft.leegeon.com/`는 현재 Vite dev server 형태로 소스를 서빙한다. 확인 시 `#root`가 비어 있었고 배포 소스는 `/algo`가 아직 보호 라우트가 아닌 이전 프론트였다.
- 프론트 변경:
  - `src/App.jsx`: `/algo`를 보호 라우트로 변경하고, 로그아웃 시 `/algo`에서도 홈으로 이동.
  - `src/utils/press.js`: 백엔드 `checks.service.js`의 `PRESS_MAPPING` 기준 언론사 매핑 공용 유틸 추가.
  - `VerificationView.jsx`: 네이버 전체 officeList 순번 매핑 제거, 백엔드 press 표 기준 분류만 사용, API 성공 시 프론트 더미 섞기 제거, 정렬 변경 때 `POST /checks` 재요청하던 동작 제거, `description/date/pubDate/pub_date` 수신 보강.
  - `AlgoView.jsx`: 같은 press 유틸을 사용하고 `description/date` 후보를 받도록 보강.
- 검증:
  - `npm run lint` 통과
  - `npm test` 통과
  - Codex 번들 Node 기반 `vite build` 통과

## 2026-07-15 이번 창 UI/실데이터 전환 정리

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 배포 실패 원인 확인:
  - `https://cheatft.leegeon.com/`은 Vite dev HTML(`/@vite/client`, `/src/main.jsx`)을 서빙한다.
  - 배포된 `/src/App.jsx`는 `/src/services/apiClient.js`를 import하지만 서버에서 해당 파일이 404라 현재 프론트 배포 산출물이 불완전하다.
  - `/api/summary`, `/api/health`, `/api/checks`는 응답하므로 주된 실패 원인은 백엔드 전체 중단이 아니라 프론트 배포 방식/파일 누락이다.
  - `/api/login`은 여전히 `UserModel.findByEmail is not a function` 오류를 반환한다.
- UI 문구/구조 변경:
  - 사이트 전반의 `알고리즘 편향성` 표현을 `신뢰도` 중심 표현으로 바꿨다.
  - 뉴스 상세의 `편향성 지수`를 `신뢰도`로 바꾸고, 관련 키워드/관련 뉴스/관련 댓글/AI 분석 코멘트 영역을 제거했다.
  - `교육 & 정보` 탭 이름을 `커뮤니티`로 바꾸고 공지사항, 가이드, 튜토리얼 항목을 제거했다.
  - 마이페이지 라우트/nav/import/컴포넌트를 제거했고 `MyPageView.jsx`를 삭제했다.
  - 홈 프로모션 배너의 `Cheat F/T 소개 보기 >` 버튼만 제거했다.
- 홈/검증하기 실데이터 전환:
  - `HomeView.jsx`와 `VerificationView.jsx`에서 프론트 더미 데이터와 fallback 결과를 제거했다.
  - 홈 최신 팩트체크는 `recentChecks.slice(0, 3)` 제한 없이 백엔드가 주는 항목을 모두 표시한다. 현재 배포 `/api/summary`가 `recentChecks` 1개만 주면 화면에도 1개만 나온다.
  - 검증하기는 텍스트 검색만 남기고 URL 링크 검색 탭을 제거했다.
  - 검색 결과는 `POST /checks` 후 `GET /checks/{id}`의 `articles`만 표시한다. 현재 실제 응답 필드는 `articleId`, `press`, `title`, `description`, `date`, `url` 중심이다.
  - 검증하기 초기 화면의 최신 팩트체크 카드와 검색 결과 카드는 제목 재검색이 아니라 뉴스 상세로 이동한다.
  - `DetailView.jsx`는 클릭한 기사 객체를 route state와 `sessionStorage`로 받아 제목, 언론사, 날짜, 설명, 원문 URL, 신뢰도를 표시한다. 직접 URL 진입이나 새로고침 후 저장된 기사 정보가 없으면 상세를 복원할 백엔드 API가 아직 없다.
- 검증:
  - `npm run lint` 통과
  - `npm test` 통과
  - Codex 번들 Node 기반 `vite build` 통과

## 2026-07-05 API 연동 작업 기록

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 프론트에 `src/services/cheatftApi.js`를 추가했다.
- `src/services/apiClient.js`에 `apiData`, accessToken 저장/삭제/첨부 로직을 추가했다.
- `VITE_API_BASE_URL=https://cheatft.leegeon.com/api` 기준으로 프론트 내부에서는 `/summary`, `/login`, `/checks`처럼 호출한다.
- 연결된 화면:
  - 홈: `GET /summary`
    - 최신 팩트체크 클릭 시 해당 제목으로 검증 화면 이동
  - 검증하기: `POST /checks`, `GET /checks/{id}`
    - 검색어 없는 기본 화면도 `GET /summary`의 `recentChecks`로 최신 팩트체크 표시
    - 결과 카드에 `백엔드 API` 또는 `프론트 목업` 출처 배지 표시
    - API 성공 후 기사 배열이 비어 있으면 프론트 예시를 섞지 않고 빈 상태 표시
  - 알고리즘 분석: `POST /analysis`, `GET /analysis/{id}`
  - 리포트: `GET /reports`에 `keyword`, `date`, `score`, `page`, `limit` 전달
  - 커뮤니티: `GET /posts`에 `category`, `keyword`, `page`, `limit` 전달
  - 글 작성: `POST /posts`
  - 로그인: `POST /login`, `accessToken` 필수
  - 회원가입: `POST /signup`, 성공 후 로그인 화면 이동
  - 마이페이지: 당시에는 `GET /profile`을 연결했으나 2026-07-15 이후 화면/라우트가 제거됐다.
- 당시 조회 화면은 API가 없거나 실패하면 기존 목업 데이터를 사용하도록 fallback을 유지했다. 2026-07-15 이후 홈/검증하기는 프론트 더미 fallback을 제거했다. 로그인, 회원가입, 게시글 등록은 실패 시 오류를 보여준다.
- 검증: `npm run lint`, `npm test`, 번들 Node로 `vite build` 통과.
- 일반 `npm run build`는 현재 셸 Node 24.13.0에서 기존 Vite 네이티브 종료 이슈가 재현될 수 있다. Node 22 LTS 또는 Codex 번들 Node에서는 빌드가 통과했다.

## 2026-07-10 백엔드 더미 API 반영

- 백엔드 담당자가 `README.md`의 dummy data를 반환하는 배포 API를 제공했다.
- 주소는 `https://cheatft.leegeon.com/api`이고, 프론트 `.env.local`과 `.env.example`은 이 주소를 기준으로 맞췄다.
- 백엔드 설명상 parameter 처리는 아직 구현되지 않아 입력과 무관하게 같은 더미 데이터가 반환될 수 있다.
- `GET /summary` 실제 응답은 `todayStats`, `recentChecks`, `biasStatus`를 포함한다.
- 2026-07-10 직접 확인한 `/summary`의 `recentChecks`는 1개였다.
- `POST /checks`는 현재 `checkId: 452`를 반환했고, `GET /checks/452`는 기사 배열 `articles`에 1개 기사를 반환했다. 다만 응답의 `totalArticles`와 `pagination.totalItems`는 12로 표시된다.
- 검증하기 화면은 API 응답으로 만든 결과에 `백엔드 API` 배지를 보여주고, 실패로 기존 예시를 표시할 때는 `프론트 목업` 배지를 보여준다.
- API 요청이 성공했지만 `articles`가 비어 있으면 KBS/뉴스1 프론트 예시를 섞지 않고 빈 상태를 보여준다.
- API 실패 시에만 기존 프론트 목업 예시로 fallback한다.
- `.env.local`을 바꾼 뒤에는 Vite dev server를 재시작해야 새 API 주소가 반영된다.

## 2026-07-12 백엔드 예시 구조 수신 보강

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다. API 명세 `README.md`는 읽기만 했다.
- `src/services/apiClient.js`는 HTTP status가 성공이어도 응답 body의 `status`가 400 이상이면 `ApiError`로 처리한다.
- `HomeView.jsx`는 `GET /summary` 성공 시 `recentChecks` 또는 `biasStatus.categories`가 빈 배열이어도 프론트 기본 예시로 덮지 않는다.
- `AlgoView.jsx`는 `POST /analysis` 후 `GET /analysis/{id}` 응답의 `relatedArticles`, `counterArticles`, `insights`, `summaryStats`를 API 성공 상태와 fallback 상태로 분리한다. API 성공 후 배열이 비면 빈 상태를 보여준다.
- `ReportView.jsx`는 `GET /reports` 성공 시 `reports`가 비어 있으면 빈 리포트 상태를 보여주고, 실패할 때만 기존 리포트 목업을 쓴다.
- `CommunityView.jsx`는 `GET /posts` 성공 시 `posts`가 비어 있으면 빈 게시글 상태를 보여주고, 실패할 때만 기존 커뮤니티 목업을 쓴다.
- 당시 `MyPageView.jsx`는 `GET /profile`의 중첩 객체(`personalDashboard`, `infoConsumptionBias`, `reliabilityDistribution`, `monthlySummary` 등)가 부분적으로 빠져도 화면이 깨지지 않도록 프론트 기본값과 병합했다. 2026-07-15 이후 마이페이지 화면/라우트는 제거됐다.
- 조회 화면 일부에 `백엔드 API 응답 표시 중`, `프론트 목업 fallback 표시 중` 같은 출처 안내가 추가되었다.
- 검증: `npm run lint`, `npm test`, Codex 번들 Node 기반 `vite build` 통과.
- 일반 `npm run build`는 현재 기본 셸 Node/Vite 네이티브 이슈로 `38 modules transformed` 이후 exit 1이 재현되었다. Codex 번들 Node에서는 빌드가 통과했다.

## 2026-07-12 홈 UI/브랜딩 조정

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 홈 화면과 전역 CSS 중심으로 시각/반응형 조정을 진행했다.
- 상단 navbar 로고를 기존 JSX/SVG 조합에서 이미지 asset으로 교체했다.
  - 추가 asset: `cheatft_web/src/assets/cheatft-logo.png`
  - 반영 파일: `cheatft_web/src/App.jsx`, `cheatft_web/src/index.css`
  - 로고 아래 소개 문구는 제거했다.
- 홈 히어로 오른쪽 저울 일러스트를 생성 이미지 asset으로 교체했다.
  - 추가 asset: `cheatft_web/src/assets/home-fact-scale.png`
  - 반영 파일: `cheatft_web/src/components/views/HomeView.jsx`
  - 기존 JSX/CSS 도형 조립 방식의 저울 그림은 제거하고 `<img>`로 표시한다.
- 홈 히어로 왼쪽 문구/검색 영역은 오른쪽 이미지와 균형이 맞도록 크기, 폭, 여백을 줄였다.
- 한국어 줄바꿈이 글자 단위로 깨지지 않도록 전역 `word-break: keep-all`, `overflow-wrap: break-word` 계열 보정을 추가했다.
- 기능 카드 3개는 아이콘이 왼쪽, 텍스트가 오른쪽에 오도록 구조를 조정했다. 창이 좁아지면 카드 그리드는 1열로 내려가 글자가 세로로 찢어지지 않게 했다.
- 홈 하단의 최신 팩트체크/오늘의 검증 통계/알고리즘 편향성/프로모션 배너 영역은 중간 폭부터 1열로 내려가도록 조정했다.
- `오늘의 검증 통계` 내부 3개 항목은 창이 줄어도 세로로 쌓이지 않고 가로 3칸 중앙 정렬을 유지하도록 보정했다.
- 프로모션 배너의 `Cheat F/T 소개 보기 >` 버튼은 줄바꿈되지 않도록 `white-space: nowrap`으로 보정했다.
- 검증: `npm run lint`, Codex 번들 Node 기반 `npm run build` 통과.

## 2026-07-12 검증하기 필터/정렬/언론사 매핑 보강

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 아래 항목은 2026-07-12 당시 작업 기록이다. 현재 동작은 2026-07-15 백엔드 반영으로 일부 대체됐다.
- 이 섹션의 기록 당시 `VerificationView.jsx`는 API가 성공하면 백엔드 API 결과만 보여주고, 프론트 더미데이터는 API 실패/미설정 fallback으로만 표시했다. 2026-07-15 이번 창 작업 이후 검증하기의 프론트 더미 fallback은 제거됐다.
- 이 섹션의 기록 당시 카드에는 `백엔드 API` 또는 `프론트 더미` 배지와 출처 분류, 조회수, 연관도 값을 표시했다. 현재 검증하기 카드의 프론트 더미 배지는 제거됐다.
- 정렬 select는 `최신순`, `조회수순`, `연관도순`을 제공한다. 현재 API 요청에는 `sort`를 보내지 않고, 프론트에서 현재 수신 결과를 정렬한다.
- `article.press`가 백엔드 `PRESS_MAPPING`의 oid 또는 언론사명으로 오면 `src/utils/press.js`에서 언론사명과 분류로 변환한다.
- 이 섹션의 기록 당시 화면 필터는 `전체 출처`, `방송/통신사`, `종합지`, `경제지`, `인터넷/IT지`, `기타 출처`, `프론트 더미`였다. 현재 검증하기 필터에서는 `프론트 더미`가 제거됐다.
- `언론사(047)`처럼 백엔드 fallback 문자열에 oid가 들어간 경우도 백엔드 표로 보정한다.
- `press`, `pressName`, `publisher`, `mediaName` 필드 후보를 순서대로 확인해 언론사명과 분류를 만든다.
- 검증: `npm run lint` 통과.

## 2026-07-12 로그인/회원가입 UX 보강

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `LoginView.jsx`는 이메일 형식 검증, 제출 중 입력/버튼 비활성화, `401`/`403`/API 미설정 오류 메시지를 보강했다.
- 로그인 성공 시 `location.state.from`이 있으면 원래 접근하려던 경로로 복귀하고, 없으면 홈으로 이동한다.
- `SignupView.jsx`는 이메일 형식, 닉네임 2~20자, 비밀번호 8자 이상, 비밀번호 확인 일치 검증을 추가했다.
- 회원가입 실패 시 `409`는 이메일/닉네임 중복 안내로 표시하고, 성공 시 로그인 화면으로 이동한다.
- 당시 `App.jsx`는 `/mypage`, `/community/write`를 보호 경로로 처리했다. 2026-07-15 이후 `/mypage`는 제거됐고 `/community/write`, `/algo`가 보호 경로로 남아 있다.
- 검증: `npm run lint`, `npm test` 통과.

## 2026-07-15 이번 창 언론사 로고/텍스트 표시 보강

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 사용자가 전체 스캔을 원하지 않아 실제 작업에 필요한 프론트 파일과 지정 문서만 확인했다.
- `src/utils/press.js`
  - 백엔드 `PRESS_MAPPING` 18개 oid에 대해 네이버 언론사 홈 `office_logo` CDN URL을 매핑했다.
  - `getPressOid()`, `getPressLogoUrl()`, `recordObservedPress()`를 추가했다.
  - `언론사(021)`처럼 미매핑 fallback 문자열이 화면 데이터에 등장하면 브라우저 `localStorage`의 `cheat-ft-observed-press-map`에 `021: "언론사(021)"` 형태로 누적 저장한다.
  - 이미 아는 oid는 `056: "KBS"`처럼 저장한다. 같은 응답에 `pressName/publisher/mediaName` 후보가 있으면 이름 후보를 함께 저장할 수 있다.
  - 개발자도구 Console 헬퍼: `cheatFtPressList()`는 `021 - 언론사(021)` 같은 복사용 문자열을 반환, `cheatFtPressMap()`은 객체 반환, `cheatFtClearPressList()`는 저장값 삭제.
  - 저장은 `localStorage`라 창을 닫아도 유지되지만 origin별로 분리된다. 예: `http://localhost:3001`, `http://localhost:5173`, `https://cheatft.leegeon.com`은 서로 다른 저장소를 쓴다.
- `VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`
  - 언론사 원형 텍스트 배지에 로고 이미지 fallback을 추가했다. `logoUrl`이 있으면 `<img>`를 표시하고 이미지 로드 실패 시 기존 앞글자 텍스트가 보인다.
  - API 기사/분석/리포트 매핑 시 `recordObservedPress()`를 호출해 미매핑 언론사 번호를 누적한다.
- `src/utils/text.js`
  - `decodeHtmlEntities()`, `cleanDisplayText()`를 추가했다.
  - `&quot;SK하이닉스&quot;`처럼 보이던 제목/요약을 `"SK하이닉스"`처럼 표시하도록 HTML entity를 디코딩한다.
- `HomeView.jsx`, `VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`, `CommunityView.jsx`, `DetailView.jsx`
  - API에서 온 제목/요약/게시글/상세 표시 문자열에 `cleanDisplayText()`를 적용했다.
- 인증 메모:
  - 프론트 로그인/회원가입 UI와 API 호출 흐름은 있다.
  - 실제 동작을 완성하려면 백엔드 `cheatft_api/src/models/user.model.js`를 user model로 복구하고 `findByEmail/createUser/findById`, DB users 테이블, bcrypt/JWT 흐름을 맞춰야 한다. 현재 배포 `/api/login`은 `UserModel.findByEmail is not a function` 오류가 알려져 있다.
- 검증:
  - `npm run lint` 통과
  - `npm test` 통과
  - Codex 번들 Node 기반 `npm run build` 통과

다음 창 시작 명령 예시:

```text
cheatft_web/docs/handoff.md 먼저 읽고, 필요하면 cheatft_web/docs/README.md, code-map.md, backend-contract.md, api-integration-log.md만 추가로 읽어서 현재 맥락 잡아줘.
이번엔 전체 스캔하지 말고, 실제 작업에 필요한 파일만 열어봐.
cheatft_api는 어떤 경우에도 수정하지 말고 읽기 전용으로만 확인해. 로그인/회원가입 구현처럼 말해도 프론트만 수정해.
이전 창 마지막 작업은 배포 프론트가 Vite dev HTML을 서빙하는 문제 확인, README 운영 배포 가이드 추가, 실수로 건드린 cheatft_api 변경 원상복구, 프론트 로그인 password trim, 테스트 계정 생성/검증이야.
프론트 테스트 계정은 codex.test.20260716@example.com / Codex테스트0716 / Test!20260716#Codex 야.
```

검증 명령:

```powershell
cd C:\Users\eunhy\Desktop\동아리\cheatft_web
npm run lint
npm test
npm run build
npm run check
```

`README.md`와 기존 메모에 따르면 Node 24 계열에서는 Vite 프로덕션 빌드가 네이티브 예외로 종료된 이력이 있다. Node 22 LTS에서 검증하는 것을 우선한다.

연동 확인은 브라우저 개발자도구 Network 탭에서 `summary`, `checks`, `analysis`, `reports`, `posts`, `login`, `signup` 요청이 나가는지 확인한다. 홈/검증하기는 API 실패 시 더미 결과를 섞지 않으므로 오류/빈 상태를 확인한다. 리포트/커뮤니티/알고리즘 분석 등 fallback이 남아 있는 화면은 실제 연동 성공 여부를 Network 탭의 status code와 response body로 확인한다. 로그인, 회원가입, 게시글 등록은 API 실패 시 오류가 보인다.

## 백엔드/API 요약

- 위치: `C:\Users\eunhy\Desktop\동아리\cheatft_api`
- 성격: Express/PostgreSQL/JWT 백엔드 구현체와 공통 응답 포맷/더미 데이터 형태를 포함한 API 명세
- 작업 원칙: `cheatft_api`는 수정하지 않는다. 구현 확인이 필요하면 관련 파일만 읽기 전용으로 참고한다.
- 공통 응답: `{ "status": number, "message": string, "data": ... }`
- 현재 명세 경로:
  - `GET /api/summary`
  - `POST /api/signup`
  - `POST /api/login`
  - `POST /api/checks`
  - `GET /api/checks/{id}`
  - `POST /api/analysis`
  - `GET /api/analysis/{id}`
  - `GET /api/reports`
  - `GET /api/posts`
  - `POST /api/posts`
  - `GET /api/profile`
  - `GET /api/me`
  - `GET /api/health`

프론트의 `cheatft_web/docs/backend-handoff.md`는 원래 회의용 제안 문서였고, 실제 `cheatft_api` 구현/README와 일부 경로가 다르다. 최신 매핑은 `cheatft_web/docs/backend-contract.md`를 우선 본다.

## 다음 작업 후보

- `cheatft_web`의 남은 목업 배열을 `src/mocks/` 또는 `src/data/`로 분리
- 기사 상세 직접 조회, 커뮤니티 상세, 댓글처럼 현재 API 명세에 없는 화면 계약 추가
- 백엔드 담당자와 인증 방식, 오류 응답, 토큰 만료/갱신, 페이지네이션, 비동기 분석 상태 조회 방식 확정
- 검증하기의 조회수/연관도/언론사 필드명을 백엔드 실제 응답과 최종 확정
- 실제 백엔드 응답 필드가 더 풍부해지면 화면별 변환 로직 정리
- 남은 프론트 목업 배열은 리포트/알고리즘 분석/커뮤니티 등 필요한 화면별로 분리하거나 제거

## 자료 폴더 주의

- `회의록/`, `자료/`, `파일/`, `세미나/`는 이번 전체 스캔 대상이 아니었다. 요청한 날짜/주제와 직접 관련 있을 때만 연다.
- PDF, Word, 이미지, 압축 파일은 필요한 경우에만 열고, 일반 코드 작업 시작 시에는 읽지 않는다.
