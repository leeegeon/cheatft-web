# API 연동 작업 로그

마지막 갱신: 2026-08-02
대상: `cheatft_web`
백엔드 폴더 수정 여부: 최종 상태 기준 수정하지 않음. 2026-07-16 실수로 인증 컨트롤러를 수정했으나 즉시 원상복구함.
API 계약 확인 원칙: `cheatft_api/README.md`는 실제 구현 또는 배포 API보다 늦게 반영될 수 있으므로, API 연동 작업은 가능한 경우 실제 배포 API 응답과 `cheatft_api/src` 구현을 함께 확인한다.

## 2026-08-02 키워드/분석/리포트 API 재연동

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 후속 화면명 조정:
  - `/search`의 사용자 표시 이름을 `검증하기`에서 `신뢰도 분석`으로 변경했다.
  - `/algo`의 사용자 표시 이름을 `신뢰도 분석`에서 `편향성 분석`으로 변경했다.
  - 기존 `/algo` 화면의 `정보 신뢰도 분석`, `종합 신뢰도`, `신뢰도 분석 요약` 문구를 편향성 분석 기준 표현으로 바꿨다.
  - 편향성 분석 패널의 긍정/중립/반박 집계 위에 비율 막대그래프를 추가하고 각 항목에 퍼센트를 함께 표시했다.
- 후속 뉴스 상세 조정:
  - `POST /api/article` 배포 API 응답을 직접 확인했고, 현재 `data.content`는 기사 전문 필드지만 예시 응답 자체가 `...`로 끝나는 축약 문자열이다.
  - 뉴스 상세 본문 위에 상세 API `content` 반환 본문을 쓰는지 알 수 있는 라벨을 표시한다.
- 후속 편향성 분석 UX 조정:
  - 질문창에서 Enter는 `POST /keywords` 키워드 추천을 실행하고 Shift+Enter는 줄바꿈으로 유지한다.
  - 추천 중에는 버튼에 스피너를 표시한다.
  - 분석 기사 배지는 백엔드 `stance` 값인 `긍정`, `중립`, `반박`을 그대로 표시한다.
  - 분석 기사 응답에 `url/link/originalLink`가 있으면 카드 클릭 시 원문을 새 탭으로 연다. URL이 없는 현재 운영 응답에는 임의 링크를 만들지 않는다.
  - 앱 진입/보호 라우트 이동/창 재포커스 시 저장된 accessToken을 `GET /me`로 재확인하고, 401/403이면 저장 세션을 정리한다.
- 후속 신뢰도 분석 UX 조정:
  - `/search` 화면 문구를 현재 서비스 용어인 `신뢰도`로 통일했다.
  - 검증 결과 정렬에 `신뢰도 높은순`, `신뢰도 낮은순`을 추가했다.
  - 검색어가 있는 검증 요청 중에는 전체 화면 로딩 팝업을 표시한다.
  - 검색 결과를 검색어별 `sessionStorage` 캐시에 저장해 기사 상세에서 뒤로가기 시 `POST /checks` 재요청과 긴 로딩 팝업을 피한다.
  - 신뢰도 분석 완료 제목은 `'키워드' 분석 결과` 형식으로 표시한다.
- 후속 뉴스 상세 UX 조정:
  - 지원되는 네이버 기사 URL이 있으면 `POST /article` 전용 API 응답을 우선 병합해 상세 본문/기자/입력 시간/주제를 표시한다.
  - 상세 API 응답은 URL별 `sessionStorage` 캐시에 저장해 같은 탭에서 같은 기사 재진입 시 재요청을 줄인다.
- 사용자가 백엔드 API 수정본을 pull한 뒤 로컬 백엔드 소스를 읽기 전용으로 확인했다.
- 로컬 백엔드 최신 커밋 기준 변경:
  - `POST /api/keywords`: `verifyToken` 필요, body `{ content }`, 응답 `data.keywords`.
  - `POST /api/analysis`: `verifyToken` 필요, body `{ keyword, period }`, OpenAI 기반 분석 플랜 생성 후 DB 저장.
  - `GET /api/analysis/{id}?limit=10`: 관련/반박 기사 배열 각각에 `limit` 적용.
  - `GET /api/reports`: `verifyToken` 필요, 인증 사용자의 분석 기록을 `keyword/date/score/page/limit` 기준으로 반환.
- 프론트 변경:
  - `src/services/cheatftApi.js`: `recommendKeywords(content)` 추가, `runAnalysis()` 기본 조회 limit을 10으로 변경.
  - `AlgoView.jsx`: 프론트 임의 키워드 생성 함수를 제거하고 `POST /keywords` 응답으로 추천 키워드 칩을 표시.
  - `AlgoView.jsx`: 분석 요청 중 전체 화면 로딩 팝업을 표시하고 추천/분석 중복 클릭을 비활성화.
  - `AlgoView.jsx`: 분석 결과 조회를 `GET /analysis/{id}?limit=10`으로 변경해 관련 뉴스와 반박 기사를 각각 최대 10건까지 표시.
  - `AlgoView.jsx`: 후속 UI 정리로 초기 질문/키워드 예시값을 비우고, 별도 `선택 키워드 분석` 버튼을 제거했다. 분석 전 메인 제목도 특정 예시 키워드 결과처럼 보이지 않게 조정했다.
  - `App.jsx`: `/report`를 보호 라우트로 전환하고 401/403 인증 실패 시 기존 `handleAuthExpired()` 흐름으로 로그인 화면 이동.
  - `ReportView.jsx`: 리포트 목록 API 실패 시 기존 목업 fallback을 제거하고 오류/빈 상태를 표시.
  - `ReportView.jsx`: 상세 보기를 펼칠 때 리포트 id를 분석 id로 보고 `GET /analysis/{id}?limit=10`을 호출해 실제 관련/반박 기사와 인사이트를 표시. 기존 하드코딩 기사 상세 목업은 제거.
  - `ReportView.jsx`: `+ 새 검색 시작`은 `/algo` 이동으로, 사이드바 기간 메뉴는 `date` query 변경으로 연결했다. 즐겨찾기는 서버 API가 없어 `localStorage` 기반으로 토글한다.
  - `ReportView.jsx`: 정렬 select(`최신순`, `신뢰도 높은순`, `신뢰도 낮은순`, `주제명순`), 종합 요약 클립보드 복사, 주요 출처 더보기/상세 펼침 버튼을 실제 동작에 연결했다.
  - `ReportView.jsx`: 오늘/최근 7일/최근 30일 개수는 클릭 전에도 보이도록 기간별 `GET /reports` 조회로 미리 채운다.
  - `ReportView.jsx`: 상세 보기에서 종합 요약 탭을 제거하고 오른쪽 종합 요약 패널만 유지했다. 상세 기사 날짜가 없으면 `-` 문자를 표시하지 않는다.
  - `ReportView.jsx`: 정사각형식 보기 전환을 제거하고 리포트 목록형으로 단순화했다. `분석 완료` 배지는 카드 폭에 맞게 줄였다.
  - `ReportView.jsx`: 모바일 폭에서도 상세 기사 행의 점, 언론사명, 제목, `stance`가 세로로 쪼개지지 않도록 한 줄형 레이아웃을 유지한다.
  - `index.css`: 모바일 폭에서 리포트 카드 즐겨찾기 별 버튼이 제목과 분리된 한 줄을 차지하지 않도록 카드 제목 행을 가로 흐름으로 보정했다.
  - `HomeView.jsx`, `index.css`: 홈 최신 팩트체크/프로모션/통계 카드가 320px 모바일 폭에서 가로로 밀리지 않도록 카드 폭, 최소폭, 줄바꿈을 보정했다.
  - `ReportView.jsx`: `GET /reports`의 `mainPresses`가 언론사명 문자열이 아니라 숫자/집계값이면 주요 출처명으로 표시하지 않는다.
  - `AlgoView.jsx`: 후속 확인에서 기사 `stance`가 백엔드 반환값임을 확인해, 프론트의 `긍정 -> 높음`, `중립 -> 보통`, `반박 -> 주의` 변환을 제거하고 기사 배지와 하단 집계를 `긍정/중립/반박`으로 되돌렸다.
- 백엔드 확인 필요:
  - `analysis.service.js`는 조회 매핑에서 `articleId: article.id`를 사용하지만 모델 쿼리는 `id as "articleId"`를 반환하므로 `articleId`가 비어 내려올 가능성이 있다.
  - `analysis.model.js`의 `mainPresses`는 현재 언론사명 배열이 아니라 언론사별 기사 수 배열로 만들어지는 것으로 보여, 프론트는 숫자 값을 주요 출처명으로 표시하지 않는다.
- 검증:
  - `npm run lint` 통과.
  - `npm test` 통과.
  - Codex 번들 Node 기반 `vite build` 통과.
  - Playwright 로컬 Chrome으로 390/360/320px 폭에서 `/`, `/search`, 검색 결과, `/algo`, `/report`, `/community`, `/article/1` 문서 가로 overflow 0을 확인했다.

## 작업 목적

`cheatft_api/README.md`에 정리된 더미 API 명세와 배포 더미 API를 기준으로 `cheatft_web` 주요 화면이 실제 API를 우선 호출하도록 연결했다. 초기 연동 당시 조회 화면은 API 서버가 없거나 요청이 실패하면 기존 목업 데이터로 화면을 유지했다. 2026-07-15 이후 홈/검증하기는 프론트 더미 fallback을 제거하고 백엔드 API 응답만 표시한다. 로그인, 회원가입, 게시글 등록처럼 서버 반영이 필요한 동작은 실패 시 오류를 보여준다.

2026-07-12 추가 작업으로 검증하기 검색 결과는 백엔드 API 결과와 프론트 더미데이터를 구분해서 함께 보여주도록 바뀌었다. 로그인/회원가입은 입력 검증과 보호 라우트 흐름을 보강했다.

2026-07-15 추가 작업으로 실제 백엔드 코드의 `PRESS_MAPPING`, 인증 요구사항, 배포 API 관측값을 반영해 프론트 검증/알고리즘 화면을 다시 조정했다. 이후 이번 창에서 홈/검증하기의 프론트 더미 fallback, URL 링크 검색, 마이페이지 화면을 제거했고, 검증하기 카드 클릭은 뉴스 상세로 연결했다.

2026-07-16 추가 작업으로 배포 프론트가 여전히 Vite dev HTML을 서빙하는 문제를 다시 확인하고, 운영 배포 점검법을 `cheatft_web/README.md`에 추가했다. 백엔드 pull 후 user model 복구를 읽기 전용으로 확인했고, 로그인/회원가입 흐름을 실제 배포 API 계정으로 검증했다. 실수로 백엔드 컨트롤러를 수정했으나 사용자 요청으로 원상복구했으며, 이후 원칙은 `cheatft_api` 절대 수정 금지다.

2026-07-16 추가 작업으로 로그인 후 오른쪽 상단에 현재 사용자 닉네임을 표시하도록 프론트 세션 저장을 보강했다. 또한 브라우저 탭 제목을 `Cheat F/T`로 바꾸고, 사용자가 제공한 Cheat F/T 돋보기 이미지를 흰 배경이 투명한 `public/favicon.png`로 만들어 주소창 아이콘에 적용했다.

2026-07-19 추가 작업으로 신뢰도 분석 화면의 분석 API 호출 트리거를 질문 입력 → 추천 키워드 칩 선택 방식으로 바꿨다. 추천 키워드는 프론트에서 생성하며, 사용자가 키워드를 누를 때 기존 `runAnalysis()` 흐름으로 `POST /analysis`, `GET /analysis/{id}`를 호출한다. 화면 우선순위는 `AI 주요 인사이트`와 `신뢰도 분석 요약`을 먼저, 관련 뉴스/반박 기사 탭을 그 아래로 배치하도록 바꿨다. 이후 리포트 관련 내보내기/다운로드 버튼과 `총 검색 시간` 통계도 제거했다.

2026-07-26 추가 작업으로 배포 API의 검증 결과 반환 개수를 확인했다. `limit=100` 요청에도 현재 관측값은 12건이고, 서버 `page/limit` 분할은 아직 적용되지 않은 것으로 보여 `VerificationView.jsx`에서 최대 100건을 받아온 뒤 10건씩 클라이언트 페이지네이션하도록 변경했다.

같은 날짜에 `파일/신뢰도` 이미지 자료를 참고해 언론사별 분류/신뢰도/판단 이유 기준표를 만들었다. AI 별점은 참고값으로만 저장했고, 사이트 반영 원본은 `src/data/pressReliability.js`, 사람이 보는 이유 문서는 `docs/press-reliability.md`이다.

같은 날짜에 신뢰도 분석 화면의 입력 흐름을 더 직관적으로 보이게 조정했다. API 호출 구조는 그대로 두고, 기본/키워드 선택 직후에는 질문 영역을 강조하며 추천 키워드 생성 직후에는 키워드 영역을 강조한다.

같은 날짜에 배포 API 실제 응답과 `cheatft_web` 문서의 현재 상태를 다시 대조했다. `cheatft_api/README.md`는 수정하지 않았고, 프론트 문서에는 실제 응답 기준 차이를 반영했다.

같은 날짜에 홈 외 화면의 반응형/스크롤 구조를 정리했다. API 호출 구조는 바꾸지 않았고, 검증하기/신뢰도 분석/리포트/커뮤니티/상세/인증 화면이 노트북 절반 폭과 모바일 폭에서 깨지지 않도록 전역 CSS 보정을 추가했다. 앱 본문은 내부 이중 세로 스크롤 대신 브라우저 기본 페이지 스크롤을 사용한다.

2026-07-31 추가 작업으로 백엔드 pull 후 새로 확인된 `POST /api/article`을 뉴스 상세 화면에 연결했다. 검증하기 카드 클릭으로 전달된 기사 URL이 있으면 상세 API로 본문/기자/입력 시간/주제를 보강하고, 실패하면 별도 오류 문구 없이 목록에서 받은 기사 정보를 그대로 표시한다. 상세 API 응답에 신뢰도 점수가 없으면 기존 언론사 기준 신뢰도 표를 사용하고, 상세 패널은 0~5 눈금과 현재 점수 마커로 표시한다.

2026-07-31 사용자 전달 메모 기준 `cheatft_api/README.md`와 운영 API 사이에 추가 차이가 있다. 공통 응답 포맷은 `/health`와 404 HTML 응답에는 적용되지 않고, `POST /checks`는 `type`과 `content`가 모두 필요하다. README에 문서화된 `POST /article`, `POST /keywords`는 운영 API에 아직 미배포라 `Cannot POST ...` HTML 응답을 반환한다. `GET /summary`의 `recentChecks` 3개는 모두 `id: 1`일 수 있다.

2026-07-31 추가 작업으로 백엔드 `checks.service.js`의 확장된 `PRESS_MAPPING`을 읽기 전용으로 확인하고, 프론트 `src/utils/press.js`에도 69개 oid/name 매핑을 맞췄다. 네이버 언론사 홈에서 확인한 `office_logo` URL 69개를 추가해 검증하기/신뢰도 분석/리포트의 언론사 배지에 이미지 로고가 출력되게 했다. 이미지 로드 실패 시에는 기존 텍스트 배지 fallback을 유지한다.

2026-07-31 임시 파일 정리로 과거 Vite 로그 파일, preview/dev 로그 파일, 전체 스캔 산출물 `.understand-anything/`, 코드에서 참조하지 않는 기본/레거시 에셋(`hero.png`, `react.svg`, `vite.svg`, `icons.svg`, `favicon.svg`)을 삭제했다. `cheatft_api`는 수정하지 않았다.

2026-07-31 미매핑 언론사 재관측으로 배포 API에 30개 키워드(`정치`, `경제`, `사회`, `국제`, `문화`, `스포츠`, `연예`, `인공지능`, `반도체`, `코로나`, `기후`, `부동산`, `주식`, `금리`, `소상공인`, `검찰`, `국회`, `입시`, `세금`, `탄소중립`, `태풍`, `과학`, `IT`, `삼성전자`, `SK하이닉스`, `건강`, `교육`, `대통령`, `청년`, `금융`)를 요청했다. 응답에는 아직 `언론사(002)`처럼 보이는 값도 있었지만, 현재 로컬 백엔드 `PRESS_MAPPING` 69개와 대조해 소스에도 없는 oid만 `docs/observed-unmapped-press-names.csv`에 이름 확인본으로 남겼다. 관리 단순화를 위해 원본 관측 CSV는 제거하고 이 파일 하나를 기준으로 본다. 남은 후보는 `293: 블로터`, `586: 시사저널`이다.

2026-07-31 추가 작업으로 백엔드 69개 매핑 중 신뢰도 기준표에 없던 12개(`스포츠조선`, `노컷뉴스`, `스타뉴스`, `OSEN`, `일간스포츠`, `스포츠동아`, `MBC연예`, `MK스포츠`, `연합뉴스TV`, `스포츠서울`, `뉴스엔`, `비즈워치`)를 `src/data/pressReliability.js`와 `docs/press-reliability.md`에 추가했다. 기존 AI 별점 자료에 없던 항목이라 `aiReferenceStars`는 `null`로 두고, 운영 기준에 따라 점수/라벨/판단 이유를 새로 산정했다. 확인 결과 백엔드 `PRESS_MAPPING` 69개 모두 신뢰도 기준으로 연결된다.

2026-07-31 추가 작업으로 검증하기 카드와 뉴스 상세 화면의 신뢰도 표시 기준을 `src/utils/reliability.js`로 통합했다. 백엔드/목록 점수는 5점 만점으로 정규화하며, 10점 척도 값은 `/2`, 100점 척도 값은 `/20`으로 환산한다. 라벨과 색상은 현재 `높음` 3.9 이상 초록, `보통` 3.3 이상 3.9 미만 노랑, `주의` 3.3 미만 빨강으로 통일했다.

2026-07-31 추가 조정으로 검색 결과가 `높음`과 `보통`에 과하게 몰리는 문제를 줄이기 위해 신뢰도 라벨 기준을 기존 `높음` 3.7 이상, `보통` 3.0 이상에서 `높음` 3.9 이상, `보통` 3.3 이상으로 상향했다. 기준 조정 후 전체 신뢰도 표 91개 기준 분포는 `높음` 19개(20.9%), `보통` 51개(56.0%), `주의` 21개(23.1%)이고, 백엔드 매핑 69개 기준 분포는 `높음` 17개(24.6%), `보통` 32개(46.4%), `주의` 20개(29.0%)이다.

2026-07-31 추가 작업으로 신뢰도 분석 화면(`/algo`)을 실제 운영 API 응답 기준으로 정리했다. 테스트 계정으로 `POST /api/analysis`, `GET /api/analysis/{id}?limit=4`를 직접 호출해 응답 구조를 확인했고, 현재 기사 항목은 `articleId`, `press`, `title`, `stance` 중심이며 `description/date/url/views`가 오지 않는 것을 기준으로 화면 표시를 조정했다. `AlgoView.jsx`의 정적 관련/반박 기사 목업과 실패 시 fallback 표시를 제거했고, 분석 전/로딩/API 응답/오류 상태를 분리했다. 신뢰도 게이지와 요약은 실제 `biasAnalysis`와 `summaryStats`를 사용한다.

## 2026-07-31 신뢰도 분석 실제 API 기준 정리

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 운영 API 직접 확인 결과:
  - `POST /api/analysis`: Bearer token 필요, 성공 시 `analysisId` 반환.
  - `GET /api/analysis/{id}?limit=4`: `analysisId`, `keyword`, `biasAnalysis`, `insights`, `relatedArticles`, `counterArticles`, `summaryStats`, `pagination` 반환.
  - `limit` query는 현재 결과 개수에 반영되지 않는다.
  - 관련/반박 기사에는 현재 `articleId`, `press`, `title`, `stance`가 내려오며, 날짜/요약/원문 URL/조회수 필드는 없다.
- 프론트 변경:
  - `AlgoView.jsx`: 분석 전 상태를 빈 안내로 표시.
  - `AlgoView.jsx`: API 실패 시 기존 예시 기사 fallback을 제거하고 오류/빈 상태만 표시.
  - `AlgoView.jsx`: 실제 `stance`를 기사 배지로 표시하고, 없는 `description/date/views`는 지어내지 않음.
  - `AlgoView.jsx`: 정적 검색 시간, `더보기`, 신뢰도 분석 자세히 보기 버튼 제거.
  - `AlgoView.jsx`: 당시에는 선택된 키워드를 다시 분석하는 `선택 키워드 분석` 버튼을 추가했으나, 2026-08-02 후속 UI 정리에서 제거했다.
  - `AlgoView.jsx`: 신뢰도 게이지 SVG 내부 라벨/건수 텍스트를 제거하고, 점수/등급은 중앙에, 긍정/중립/반박 건수는 하단 미니 카드로 분리.
  - `App.jsx`, `AlgoView.jsx`, `LoginView.jsx`: 잘못되거나 만료된 토큰으로 분석 요청이 401/403을 반환하면 저장 토큰/사용자 정보를 지우고 로그인 화면으로 이동하며 안내 메시지를 표시.
- 검증:
  - 운영 API 직접 호출 통과.
  - 잘못된 Bearer token으로 `POST /api/analysis` 호출 시 운영 API가 `403 유효하지 않은 토큰입니다.`를 반환하는 것 확인.
  - `npm run lint` 통과.
  - `npm test` 통과.
  - Codex 번들 Node 기반 `npm run build` 통과.
  - 기본 셸 `npm run build`는 기존 Node/Vite 네이티브 이슈로 `43 modules transformed` 뒤 실패.

## 2026-07-31 뉴스 상세 API 반영

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 백엔드 2026-07-31 pull 내용에서 `POST /api/article`과 `POST /api/keywords` 추가를 확인했다.
- 2026-07-31 운영 API 직접 확인 기준 `POST /api/article`은 아직 배포되지 않아 `Cannot POST /api/article`을 반환한다.
- 2026-07-31 사용자 전달 메모 기준 `POST /api/keywords`도 운영 API에는 아직 미배포라 토큰이 있어도 `Cannot POST /api/keywords`를 반환한다.
- 프론트 변경:
  - `src/services/cheatftApi.js`: `getArticleFromUrl(url)` 추가.
  - `DetailView.jsx`: 뉴스 상세 진입 시 `article.url`이 있으면 네이버 `/mnews/article/` URL을 `/article/` 형식으로 정규화해 `POST /article` 호출 후 기존 route state/sessionStorage 기사 데이터와 병합.
  - `DetailView.jsx`: 상세 API 실패는 빨간 오류 문구로 노출하지 않고 목록 기사 정보만 유지.
  - `DetailView.jsx`: 상세 API의 `content`, `press`, `reporter`, `inputTime`, `topic` 필드를 표시 후보로 추가.
  - `DetailView.jsx`: 상세 API 또는 목록 데이터의 신뢰도 점수를 우선 표시하고, 없으면 `src/data/pressReliability.js`의 언론사 기준 점수/라벨/판단 이유를 표시.
  - `DetailView.jsx`: 오른쪽 신뢰도 패널을 `낮음/보통/높음` 텍스트 축에서 0~5 숫자 눈금과 현재 점수 마커가 있는 진행 막대로 변경.
- 제약:
  - `POST /article`은 URL 기반 상세 보강 API라 저장 정보나 URL이 없는 `/article/:id` 직접 진입은 아직 완전 복원할 수 없다.
- 검증:
  - `npm run lint` 통과.
  - `npm test` 통과.

## 2026-07-26 홈 외 화면 반응형/스크롤 정리

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- API 호출 구조는 바꾸지 않았다.
- 프론트 변경:
  - `App.jsx`: 앱 루트/본문의 고정 100vh와 내부 `overflowY: auto`를 제거해 브라우저 기본 페이지 스크롤을 사용.
  - `VerificationView.jsx`: 반응형 제어용 클래스 추가. 좁은 폭에서 검색창 아이콘/입력/버튼 배치, 기사 메타 줄바꿈, 신뢰도 게이지 표시를 보정.
  - `AlgoView.jsx`: `분석 안내` 버튼 제거. 신뢰도 분석 요약은 가능하면 가로 배치를 유지하고, 좁은 폭에서만 줄바꿈.
  - `ReportView.jsx`: 리포트 내부 세로 스크롤 제거. 통계 카드와 리포트 카드 여백/줄바꿈 보정.
  - `CommunityView.jsx`: 글 작성 버튼/필터/검색창이 과하게 커지지 않도록 보정하고, 참여 현황은 가능하면 가로 배치 유지.
  - `DetailView.jsx`, `LoginView.jsx`, `SignupView.jsx`: 좁은 폭 반응형 제어용 클래스 추가.
- 화면 확인:
  - Chrome headless로 `/search`, `/algo`, `/report`, `/community`, `/community/write`, `/login`, `/signup`, `/article/1`의 1366/1180/820/700/600/390px 계열 폭을 확인.
  - 확인 범위에서 문서 전체 가로 넘침은 0으로 관측.
- 검증:
  - `npm run lint` 통과.
  - `npm test` 통과.
  - Codex 번들 Node 기반 `vite build` 통과.

## 2026-07-26 검증하기 결과 페이지네이션

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 배포 API 확인:
  - `POST /api/checks` 후 `GET /api/checks/{id}?page=1&limit=100` 호출.
  - `인공지능 뉴스`, `정치`, `경제`, `대통령` 모두 `totalArticles: 12`, `articles.length: 12`, `pagination.totalPages: 1`.
  - `page=2&limit=5`도 12건 전체를 반환해 서버 페이지네이션은 아직 적용되지 않은 상태로 관측.
- 프론트 변경:
  - `src/data/pressReliability.js` 신규 추가: 79개 언론사의 분류, 1~5점 신뢰도, 라벨, AI 별점 참고값, 판단 이유 요약 저장.
  - `docs/press-reliability.md` 신규 추가: 사람이 검토하기 쉬운 언론사별 이유 표.
  - `press.js`가 새 기준표를 사용해 언론사 분류와 신뢰도를 반환하도록 변경.
  - 검증하기/상세/신뢰도 분석/리포트 화면에서 백엔드 신뢰도 점수가 없을 때 언론사 기준 신뢰도를 fallback으로 사용.
  - `VerificationView.jsx`의 검증 결과 조회 limit을 10에서 100으로 변경.
  - 수신한 `articles`를 정렬/필터링한 뒤 10건씩 화면 페이지네이션.
  - 출처 필터 또는 정렬 변경 시 결과 페이지를 1페이지로 초기화.
  - 정렬 옵션에서 조회수순을 제거하고 `연관도순`, `최신순`만 제공.
  - 로컬 백엔드 `checks.service.js` 확인 기준 네이버 뉴스 검색은 `sort=sim`이라 기본 반환 순서는 연관도순. 현재 배포 API article에는 연관도 점수/조회수 필드가 없어 기본 연관도순은 백엔드 반환 순서를 유지한다.
- 검증:
  - `npm run lint` 통과.
  - `npm test` 통과.
  - Codex 번들 Node 기반 `vite build` 통과.

## 2026-07-26 신뢰도 분석 입력 강조

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `AlgoView.jsx`에서 질문 영역과 추천 키워드 영역을 독립된 강조 박스로 나눴다.
- 기본 상태와 추천 키워드 선택 직후에는 질문 영역을 강조한다.
- `키워드 추천`으로 추천 키워드가 생성되면 키워드 영역을 강조한다.
- `POST /analysis`, `GET /analysis/{id}` 호출 구조는 바꾸지 않았다.
- 검증:
  - `npm run lint` 통과.
  - `npm test` 통과.
  - Codex 번들 Node 기반 `vite build` 통과.

## 2026-07-26 배포 API 문서 차이 재확인

- 백엔드 폴더(`cheatft_api`)와 `cheatft_api/README.md`는 수정하지 않았다.
- 실제 호출 기준:
  - `GET /api/summary`: `recentChecks` 3개.
  - `GET /api/reports`: `keyword/date/score/page/limit`을 바꿔도 같은 dummy 응답과 `currentPage: 1`.
  - `GET /api/posts`: `category/keyword/page/limit`을 바꿔도 같은 dummy 응답과 `currentPage: 1`.
  - `POST /api/signup`: 성공 시 `id/email/nickname/level/user_title/created_at`, 중복 이메일은 현재 `500`.
  - `POST /api/login`, `GET /api/me`: 테스트 계정으로 정상 확인.
- `POST /api/checks`: `type=url`도 202로 받지만 URL 본문 파싱 없이 검색어처럼 저장된다.
- `POST /api/checks`: README에는 `content`만 필수처럼 보이나, 실제 배포 API는 `type`과 `content`가 모두 필요하고 `content`만 보내면 `400`을 반환한다.
  - `GET /api/checks/{id}`: `page/limit` 미반영, article `press`는 숫자보다 언론사명 문자열, 제목/설명에는 HTML entity가 남을 수 있음.
  - `GET /api/analysis/{id}`: `limit` query 미반영, 응답 `limit` 필드 없음, 기사 `press`는 언론사명 문자열.
  - `POST /api/posts`: 성공 시 `id/title/category`만 반환.
- `GET /api/health`: 공통 래핑 없이 `{ message }` 반환.
- 404와 미배포 라우트 응답은 공통 `{ status, message, data }` JSON이 아니라 HTML일 수 있다.

## 2026-07-19 신뢰도 분석 화면 흐름 조정

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `AlgoView.jsx`에서 분석 API 호출 트리거를 단일 입력 버튼에서 질문 입력 → 추천 키워드 칩 선택 방식으로 바꿨다.
- 추천 키워드는 프론트에서 생성하며, 사용자가 키워드를 누를 때 기존 `runAnalysis()` 흐름으로 `POST /analysis`, `GET /analysis/{id}`를 호출한다.
- 2026-07-26 추가로 기본/키워드 선택 직후에는 질문 영역, 추천 키워드 생성 직후에는 키워드 영역이 강조되도록 보강했다.
- 화면 우선순위는 `AI 주요 인사이트`와 `신뢰도 분석 요약`을 먼저, 관련 뉴스/반박 기사 탭을 그 아래로 배치하도록 바꿨다.
- `AlgoView.jsx`의 `분석 리포트 다운로드` 버튼을 제거했다.
- 상단 nav의 `리포트 내보내기`, `ReportView.jsx`의 `총 검색 시간`, 상세 `전체 요약 다운로드` 버튼을 제거했다. 리포트 API 호출 방식은 바꾸지 않았다.
- `/community` 전용 상단바 버튼 분기를 제거해 `/report`와 같은 전역 상단바를 쓰게 했다. 커뮤니티 `글 작성하기`와 `정정 요청하기` 버튼은 커뮤니티 화면 내부에서 `/community/write`로 이동한다.
- 검증: `npm run lint` 통과.

## 핵심 설계

- `.env.local`의 `VITE_API_BASE_URL`을 API 기본 URL로 사용한다.
- 현재 권장 값은 `https://cheatft.leegeon.com/api`이다.
- 기본 URL에 `/api`가 포함되어 있으므로 프론트 내부에서는 `/summary`, `/login`, `/posts`처럼 호출한다.
- 백엔드 응답 래핑 `{ status, message, data }`는 `apiData()`에서 `data` 중심으로 푼다.
- 로그인 accessToken은 `localStorage`의 `cheat-ft-access-token`에 저장한다.
- 저장된 토큰은 이후 요청에 `Authorization: Bearer ...`로 첨부한다.
- `/community/write`, `/algo`는 로그인 필요 화면으로 처리한다. `/mypage` 화면/라우트는 2026-07-15에 제거됐다.
- 로컬 `cheatft_api`는 현재 Express/PostgreSQL/JWT 기반 백엔드 구현체이다. 프론트 작업 중에는 읽기 전용 확인만 가능하며 수정하지 않는다.
- 배포 API는 `https://cheatft.leegeon.com/api`에서 응답한다.
- `summary/reports/posts/profile`은 dummy controller 응답이고, `checks/analysis/auth`는 실제 라우트/서비스/DB 흐름을 사용한다.

## 2026-07-16 배포/인증 추가 반영

- 배포 프론트 문제:
  - `https://cheatft.leegeon.com/`은 여전히 Vite dev HTML(`/@vite/client`, `/src/main.jsx`, `/@react-refresh`)을 서빙한다.
  - `/src/services/apiClient.js`는 404다.
  - `/assets/index-*.js`, `/assets/index-*.css`도 실제 정적 파일이 아니라 HTML fallback으로 내려오는 상태를 확인했다.
  - 운영 서버는 `cheatft_web` 프로젝트 루트가 아니라 `cheatft_web/dist`를 web root로 서빙해야 한다.
- `cheatft_web/README.md`:
  - `운영 배포` 섹션을 추가했다.
  - 루트 HTML에 `/@vite/client`가 보이면 개발용 HTML 배포 상태라고 명시했다.
  - `/assets/*.js` 응답이 `<!doctype html>`로 시작하면 SPA fallback 또는 web root 설정이 잘못된 상태라고 명시했다.
- 백엔드 인증 확인:
  - pull 이후 `cheatft_api/src/models/user.model.js`에 `findByEmail`, `createUser`, `findById`가 복구된 것을 확인했다.
  - 실수로 `cheatft_api/src/controllers/auth.controller.js`를 수정했으나 즉시 원상복구했다.
  - 앞으로 `cheatft_api`는 어떤 경우에도 수정하지 않고 읽기 전용으로만 확인한다.
  - 회원가입 성공 응답은 password hash를 노출하지 않는다.
- 프론트 로그인:
  - `cheatft_web/src/components/views/LoginView.jsx`에서 로그인 요청 전 password 앞뒤 공백을 trim한다.
  - 이메일은 기존처럼 trim한다.
  - `cheatft_web/src/services/apiClient.js`에 현재 사용자 정보 저장/조회/삭제 유틸을 추가했다.
  - `cheatft_web/src/services/cheatftApi.js`는 로그인 성공 시 `accessToken`과 함께 `nickname/email/userId` 후보를 `localStorage`에 저장한다.
  - `cheatft_web/src/App.jsx`는 로그인 후 오른쪽 상단에 닉네임을 표시하고, 로그아웃 시 토큰과 현재 사용자 정보를 함께 삭제한다.
- 브라우저 표시:
  - `cheatft_web/index.html`의 title을 `news-project`에서 `Cheat F/T`로 변경하고 `lang="ko"`를 적용했다.
  - 주소창 favicon은 `/favicon.png`를 사용한다.
  - `cheatft_web/public/favicon.png`는 사용자가 제공한 아이콘 이미지의 흰 배경을 투명 처리한 512x512 PNG다.
- 배포 API 테스트 계정:
  - 이메일: `codex.test.20260716@example.com`
  - 닉네임: `Codex테스트0716`
  - 비밀번호: `Test!20260716#Codex`
  - 생성 응답: `201`, `userId: 2`, `level: 1`, `user_title: 신규 사용자`
  - 로그인 응답: `200`, `data.accessToken` 수신 확인
  - `/api/me` 응답: `200`, 사용자 정보 조회 확인
- 로컬 프론트 확인:
  - `http://localhost:3001/src/services/apiClient.js`에 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api`가 주입되는 것을 확인했다.
  - 로컬 로그인 폼은 `https://cheatft.leegeon.com/api/login`으로 `{ email, password }`를 전송한다.
  - 사용자가 실제 브라우저에서 위 테스트 계정으로 로그인 성공을 확인했다.
- 검증:
  - `cheatft_api`: `npm ci` 후 인증 모듈 로드 확인을 했으나, 이후 생성된 `node_modules/`를 삭제하고 백엔드 수정분을 원상복구했다.
  - `cheatft_web`: `npm run lint` 통과
  - `cheatft_web`: `npm test` 통과
  - `cheatft_web`: Codex 번들 Node로 `vite build` 통과
  - 일반 셸 Node의 `npm run build`는 기존 Vite/Node 네이티브 종료 이슈로 `41 modules transformed` 이후 exit 1 재현

## 추가/수정 파일

- `cheatft_web/src/services/apiClient.js`: `apiData`, accessToken 저장/조회/삭제, Bearer 토큰 자동 첨부 추가.
- `cheatft_web/src/services/cheatftApi.js`: 명세 기반 도메인 API 함수 신규 추가.
- `cheatft_web/src/App.jsx`: 저장된 accessToken 기반 로그인 초기 상태, 로그아웃 시 토큰 삭제, 상세 이동 id/article state 반영.
- `cheatft_web/src/components/views/*.jsx`: 홈, 검증하기, 알고리즘 분석, 리포트, 커뮤니티, 글 작성, 로그인, 회원가입에 API 우선 호출 적용. 마이페이지는 이후 제거됨.
- `cheatft_web/.env.local`: 로컬 개발용 `VITE_API_BASE_URL=https://cheatft.leegeon.com/api` 설정.
- `cheatft_web/.env.example`: 예시 API URL을 배포 더미 API로 갱신.
- `cheatft_web/src/index.css`: `.form-error` 스타일 추가.

## 화면별 연결

| 화면 | 프론트 파일 | API |
|---|---|---|
| 홈 | `HomeView.jsx` | `GET /summary` |
| 검증하기 | `VerificationView.jsx` | `POST /checks`, `GET /checks/{id}` |
| 뉴스 상세 | `DetailView.jsx` | `POST /article` |
| 알고리즘 분석 | `AlgoView.jsx` | `POST /analysis`, `GET /analysis/{id}` |
| 리포트 | `ReportView.jsx` | `GET /reports?keyword=&date=&score=&page=&limit=` |
| 커뮤니티 | `CommunityView.jsx` | `GET /posts?category=&keyword=&page=&limit=` |
| 글 작성 | `CommunityWriteView.jsx` | `POST /posts` |
| 로그인 | `LoginView.jsx` | `POST /login` |
| 회원가입 | `SignupView.jsx` | `POST /signup` |

## 2026-07-05 추가 반영

- 홈의 최신 팩트체크 항목을 클릭하면 해당 제목으로 검증 화면으로 이동한다.
- 검색어 없이 `/search`에 들어간 검증하기 화면도 `GET /summary`의 `recentChecks`를 사용해 최신 팩트체크를 표시한다.
- 로그인은 `POST /login` 응답에 `accessToken`이 있을 때만 성공 처리한다. API 미설정이나 토큰 없는 응답은 오류로 보여준다.
- 회원가입은 `POST /signup` 성공 후 자동 로그인하지 않고 로그인 화면으로 이동한다. 현재 명세의 signup 응답에는 `accessToken`이 없기 때문이다.
- 커뮤니티 목록은 탭/카테고리/검색어/페이지 값을 `GET /posts` query parameter로 전달한다.
- 리포트 목록은 검색어/날짜/신뢰도 필터 값을 `GET /reports` query parameter로 전달한다.
- 당시 마이페이지는 `/profile` 응답의 `infoConsumptionBias`, `reliabilityDistribution`, `interestTopicsTop5`, `earnedBadges`, `recentActivities`, `monthlySummary`까지 화면에 반영했다. 2026-07-15 이후 마이페이지 화면/라우트는 제거됐다.

## 2026-07-10 추가 반영

- 배포 더미 API 주소 `https://cheatft.leegeon.com/api`를 `.env.local`과 `.env.example`에 반영했다.
- 백엔드 담당자 안내상 현재 API는 README dummy data를 반환하며 parameter 처리는 아직 구현되지 않았다.
- 검증하기 결과 화면에 상단 안내와 카드 배지로 `백엔드 API`/`프론트 목업` 출처를 표시한다.
- API 요청이 성공하면 API의 `articles` 배열만 표시한다.
- API 성공 후 `articles`가 비어 있으면 프론트 KBS/뉴스1 예시를 섞지 않고 빈 결과 상태를 표시한다.
- API 요청이 실패할 때만 기존 프론트 목업으로 fallback한다.
- 2026-07-10 당시 확인 기준 `GET /summary`의 `recentChecks`는 1개였다. 2026-07-26 배포 API 재확인 기준은 3개다.
- 2026-07-10 당시 `POST /checks`는 `checkId: 452`를 반환했고, `GET /checks/452`의 `articles` 배열은 1개였다. 2026-07-26 기준 기존 더미 id `452`는 새 DB 기반 라우트에서 404로 관측됐다.

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
- 마이페이지: 당시 `GET /profile`의 중첩 객체가 일부 빠져도 화면이 깨지지 않도록 기본값과 병합했다. 2026-07-15 이후 마이페이지 화면/라우트는 제거됐다.

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
  - 프론트는 `409` 이메일/닉네임 중복 안내를 처리한다. 2026-07-26 배포 API 확인 기준 중복 이메일은 현재 `500`으로 내려온다.
- `App.jsx`
  - 당시 `/mypage`, `/community/write`를 보호 라우트로 처리했다. 2026-07-15 이후 `/mypage`는 제거됐고 `/community/write`, `/algo`가 보호 라우트로 남아 있다.
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
- 2026-07-15 당시 배포 API 관측상 `POST /api/login`은 `UserModel.findByEmail is not a function` 오류가 확인됐다. 2026-07-16/2026-07-26 확인 기준 배포 로그인과 `/api/me`는 정상 동작한다.

추가/수정 파일:

- `cheatft_web/src/App.jsx`: `/algo` 보호 라우팅 추가, `/algo` 로그아웃 시 홈 이동.
- `cheatft_web/src/utils/press.js`: 백엔드 `PRESS_MAPPING` 기반 `getPressLabel()`, `getPressCategory()` 추가.
- `cheatft_web/src/components/views/VerificationView.jsx`
  - 기존 네이버 `officeList` 순번 매핑 제거.
  - 백엔드 oid/name 표 기반 언론사 정규화 적용.
  - 당시 필터를 `전체 출처`, `방송/통신사`, `종합지`, `경제지`, `인터넷/IT지`, `기타 출처`, `프론트 더미`로 정리했다. 2026-07-15 이번 창 작업 이후 `프론트 더미` 필터는 제거됐다.
  - 당시 API 성공 시 백엔드 결과만 표시하고, 실패/미설정 시에만 프론트 더미 fallback을 사용했다. 2026-07-15 이번 창 작업 이후 검증하기의 프론트 더미 fallback은 제거됐다.
  - `GET /checks/{id}`에 `sort` query를 보내지 않고, 정렬 변경은 수신 결과를 로컬 정렬.
- `cheatft_web/src/components/views/AlgoView.jsx`: `description`, `publishedAt/createdAt/date`, `press/pressName/publisher/mediaName` 후보를 반영하고 `getPressLabel()` 사용.
- 실제 route map은 `backend-contract.md`의 "실제/더미 구분" 표를 우선 본다.

## 2026-07-15 이번 창 추가 반영

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- 배포 실패 원인:
  - `https://cheatft.leegeon.com/`이 빌드 산출물이 아니라 Vite dev HTML과 `/src/main.jsx`를 서빙한다.
  - 배포된 소스에서 필요한 `/src/services/apiClient.js`가 404라 프론트가 정상 부팅하지 못한다.
  - `/api/summary`, `/api/health`, `/api/checks`는 응답하므로 API 서버 전체 중단보다 프론트 배포 누락/혼재가 핵심 원인이다.
- 홈:
  - `DEFAULT_SUMMARY`, fallback 통계/카테고리/최신 팩트체크 목업을 제거했다.
  - `GET /summary`의 `recentChecks`를 제한 없이 모두 표시한다. 2026-07-26 배포 API 확인 기준 `recentChecks`는 3개다.
  - `알고리즘 편향성` 문구를 `신뢰도` 중심 표현으로 바꾸고 `Cheat F/T 소개 보기 >` 버튼만 제거했다.
- 검증하기:
  - URL 링크 검색 탭, 예시 검색 버튼, `MOCK_*`/`mockResults`, `프론트 더미` 필터/배지를 제거했다.
  - 검색 결과는 `POST /checks` 후 `GET /checks/{id}`의 `articles`만 표시한다.
  - 검색어 없는 초기 화면은 `GET /summary`의 `recentChecks`를 표시하고, 카드 클릭 시 제목 검색이 아니라 뉴스 상세로 이동한다.
  - 검색 결과 카드 클릭도 뉴스 상세로 이동한다. 원문 URL 버튼은 별도로 외부 링크를 연다.
- 뉴스 상세:
  - 클릭한 기사 객체를 `App.jsx`의 route state와 `sessionStorage`에 저장해 `/article/:id`에서 렌더링한다.
  - 제목, 언론사, 날짜, 설명, 원문 URL, 신뢰도 값을 클릭한 기사 데이터와 연결한다.
  - 직접 URL 진입이나 저장 정보 없는 새로고침을 완전히 지원하려면 `GET /api/articles/{id}` 또는 동등한 상세 API가 필요하다.
- 화면 정리:
  - `편향성 지수`, `알고리즘 편향성` 등 표시 문구를 `신뢰도`로 바꿨다.
  - 뉴스 상세의 관련 키워드/관련 뉴스/관련 댓글/AI 분석 코멘트 영역을 제거했다.
  - `교육 & 정보` 탭 이름을 `커뮤니티`로 바꾸고 공지사항, 가이드, 튜토리얼 항목을 제거했다.
  - 마이페이지 라우트/nav/import/컴포넌트를 제거하고 `MyPageView.jsx`를 삭제했다.
- 검증:
  - `npm run lint`: 통과
  - `npm test`: 통과
  - Codex 번들 Node로 `vite build`: 통과

## 2026-07-15 언론사 로고/관측 저장/텍스트 디코딩 추가 반영

- 백엔드 폴더(`cheatft_api`)는 수정하지 않았다.
- `cheatft_web/src/utils/press.js`
  - 백엔드 `PRESS_MAPPING` 18개 oid에 대해 네이버 언론사 홈 `office_logo` CDN URL을 추가했다.
  - `getPressOid()`, `getPressLogoUrl()`, `recordObservedPress()`를 추가했다.
  - `언론사(021)`처럼 fallback 문자열로 내려오는 미매핑 oid는 브라우저 `localStorage`의 `cheat-ft-observed-press-map`에 누적한다.
  - 개발자도구 Console 헬퍼:
    - `cheatFtPressList()`: `021 - 언론사(021)` 형태의 줄바꿈 문자열 반환
    - `cheatFtPressMap()`: 저장 객체 반환
    - `cheatFtClearPressList()`: 저장값 삭제
  - 저장은 `localStorage`라 창을 닫아도 유지되며, origin별로 분리된다. `http://localhost:3001`, `http://localhost:5173`, 배포 도메인은 서로 다른 저장소를 사용한다.
- `VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`
  - 언론사 배지는 `logoUrl`이 있으면 네이버 `office_logo` 이미지를 표시하고, 이미지 로드 실패 시 기존 텍스트 배지로 fallback한다.
  - API 결과 매핑 시 `recordObservedPress()`를 호출해 백엔드 담당자에게 전달할 미매핑 oid 목록을 누적한다.
- `cheatft_web/src/utils/text.js`
  - `decodeHtmlEntities()`, `cleanDisplayText()`를 추가했다.
  - API 문자열의 `&quot;`, `&amp;`, `&#39;`, `&apos;`, `&lt;`, `&gt;`, `&nbsp;`를 표시 전에 디코딩하고 남은 HTML 태그를 제거한다.
- `HomeView.jsx`, `VerificationView.jsx`, `AlgoView.jsx`, `ReportView.jsx`, `CommunityView.jsx`, `DetailView.jsx`
  - API에서 온 제목/요약/게시글/상세 표시 문자열에 `cleanDisplayText()`를 적용했다.
- 로그인/회원가입 상태 확인:
  - 프론트 UI/호출 흐름은 구현되어 있으나, 실제 인증 완성은 백엔드 user model 복구가 필요하다.
  - 위 문장은 2026-07-15 당시 기록이다. 2026-07-16/2026-07-26 확인 기준 배포 `/api/login`, `/api/me`는 테스트 계정으로 정상 동작한다.
- 검증:
  - `npm run lint`: 통과
  - `npm test`: 통과
  - Codex 번들 Node로 `npm run build`: 통과

## 2026-07-15 전체 스캔/문서 정리

- `understand` 스킬을 사용해 pre-flight, ignore 생성, scan, batch 계산을 수행했다.
- 생성 파일:
  - `.understand-anything/.understandignore`
  - `.understand-anything/intermediate/scan-result.json`
  - `.understand-anything/intermediate/batches.json`
- scan 결과: 92개 파일, 8개 batch. `node_modules`, `.git`, `dist`, lock/minified 파일은 기본 제외 대상이다.
- 루트 `.git`은 `HEAD`가 없어 git 저장소로 동작하지 않고, `cheatft_web`/`cheatft_api`는 Codex sandbox 사용자 기준 `dubious ownership`가 재현됐다.
- `cheatft_web/README.md`의 오래된 백엔드 설명과 이동 전 docs 경로를 최신화했다.
- `backend-handoff.md`는 최신 계약 문서가 아니라 초기 백엔드 협의 제안/역사 문서로 명시했다.

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
- `login`
- `signup`

홈/검증하기/신뢰도 분석은 API 실패 시 프론트 더미 결과를 섞지 않는다. 리포트/커뮤니티 등 fallback이 남아 있는 화면은 실제 연동 성공 여부를 Network 탭의 status code와 response body로 확인한다. 로그인, 회원가입, 게시글 등록은 API 실패 시 오류 메시지를 보여준다.

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
- `/profile`을 계속 둘 경우 공개 dummy dashboard로 둘지, 인증 사용자 profile API로 바꿀지 확정. 현재 프론트 마이페이지는 제거됨.
- `GET /checks/{id}`, `GET /analysis/{id}`의 owner check 필요 여부 확정
- `checks/analysis/reports/posts`의 query parameter 지원 범위 확정. 2026-07-26 배포 API 확인 기준 `checks` page/limit, `analysis` limit, `reports/posts` filter/page query는 실제 결과에 반영되지 않는다.
- 백엔드 `checks.service.js`가 전역 `fetch`를 사용하므로 Node 18 이상 실행 전제 문서화
- 회원가입 중복 오류를 `409`로 줄지, 현재처럼 `500`으로 둘지 확정
- `GET /api/health`를 공통 응답 래핑 `{ status, message, data }`에 맞출지 확정
- `POST /api/checks`의 `type=url`을 실제 URL 분석으로 지원할지, 텍스트 검색만 지원한다고 문서화할지 확정
- 커뮤니티 게시글 상세/댓글 API 명세 추가
- 로그아웃, refresh token, 토큰 만료 처리 방식 확정
- 검증 결과 현재 실제 필드는 `articleId`, `press`, `title`, `description`, `date`, `url`이다. 정렬/필터용 `viewCount`, `relevanceScore`, 상세용 `summary/publishedAt` 필드 확정
- 리포트/분석 다운로드 API 명세 추가
- 남은 화면 내부 목업 배열을 `src/mocks/` 또는 `src/data/`로 분리하거나 제거
- 실제 백엔드 응답 필드가 확정되면 변환 로직 정리
