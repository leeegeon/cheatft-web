import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getArticleFromUrl } from '../../services/cheatftApi.js';
import { getPressCategory, getPressLabel, getPressReliability } from '../../utils/press.js';
import { cleanDisplayText } from '../../utils/text.js';

function getStoredArticle(id) {
  try {
    const stored = sessionStorage.getItem(`cheat-ft-article-${id}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getSupportedArticleDetailUrl(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== 'n.news.naver.com') return '';

    const articleMatch = parsedUrl.pathname.match(/^\/(?:mnews\/)?article\/(\d+)\/(\d+)$/);
    if (!articleMatch) return '';

    const [, oid, aid] = articleMatch;
    return `https://n.news.naver.com/article/${oid}/${aid}${parsedUrl.search}`;
  } catch {
    return '';
  }
}

function getOptionalNumber(...values) {
  const matched = values.find((value) => value !== undefined && value !== null && value !== '' && value !== '-');
  if (matched === undefined) return null;

  const numericValue = typeof matched === 'string'
    ? Number(matched.match(/\d+(?:\.\d+)?/)?.[0])
    : Number(matched);

  return Number.isFinite(numericValue) ? numericValue : null;
}

function normalizeReliabilityScore(...values) {
  const numericValue = getOptionalNumber(...values);
  if (numericValue === null) return null;
  return Math.max(0, Math.min(5, numericValue > 5 ? numericValue / 20 : numericValue));
}

function getScoreText(scoreValue) {
  if (scoreValue === null) return '확인중';
  if (scoreValue >= 4) return '신뢰 가능';
  if (scoreValue >= 3) return '보통';
  return '주의';
}

function getScoreColor(scoreValue) {
  if (scoreValue === null) return '#dadce0';
  if (scoreValue >= 4) return '#8bc34a';
  if (scoreValue >= 3) return '#fbbc04';
  return '#ff9800';
}

function getArticlePressValue(article) {
  return article?.press ?? article?.pressName ?? article?.publisher ?? article?.mediaName ?? article?.pub;
}

function getReliabilityDisplay(article) {
  const pressValue = getArticlePressValue(article);
  const apiScoreValue = normalizeReliabilityScore(
    article?.reliabilityScore,
    article?.reliability,
    article?.trustScore,
    article?.credibilityScore,
    article?.scoreValue,
    article?.score
  );
  const pressReliability = getPressReliability(pressValue);
  const scoreValue = apiScoreValue ?? pressReliability.reliabilityScore;

  return {
    scoreText: article?.scoreText
      || article?.reliabilityLabel
      || article?.credibilityLabel
      || (apiScoreValue !== null ? getScoreText(scoreValue) : pressReliability.reliabilityLabel || getScoreText(scoreValue)),
    scoreValue,
    score: scoreValue === null ? '-' : `${scoreValue.toFixed(1).replace(/\.0$/, '')} / 5`,
    scoreColor: article?.scoreColor || getScoreColor(scoreValue),
    reliabilityReason: article?.reliabilityReason || pressReliability.rationaleSummary,
    reliabilityCategory: article?.reliabilityCategory || article?.sourceCategory || pressReliability.category || getPressCategory(pressValue),
  };
}

function mergeArticleDetail(baseArticle, detailArticle) {
  return {
    ...baseArticle,
    ...detailArticle,
    articleId: detailArticle?.articleId ?? baseArticle?.articleId,
    scoreText: detailArticle?.scoreText ?? baseArticle?.scoreText,
    scoreValue: detailArticle?.scoreValue ?? baseArticle?.scoreValue,
    score: detailArticle?.score ?? baseArticle?.score,
    scoreColor: detailArticle?.scoreColor ?? baseArticle?.scoreColor,
    reliabilityReason: detailArticle?.reliabilityReason ?? baseArticle?.reliabilityReason,
    reliabilityCategory: detailArticle?.reliabilityCategory ?? baseArticle?.reliabilityCategory,
    sourceCategory: detailArticle?.sourceCategory ?? baseArticle?.sourceCategory,
  };
}

function getDisplayArticle(article, isNews) {
  if (!isNews) {
    return {
      title: '커뮤니티 팩트체크 게시글 제목입니다.',
      author: '작성자명',
      date: '2024.05.20 15:30',
      views: '1,234',
      body: '사용자가 작성한 커뮤니티 분석 내용 및 팩트체크 근거 데이터가 여기에 표시됩니다. 다양한 의견과 통계 자료가 함께 첨부될 수 있습니다.',
    };
  }

  const reliability = getReliabilityDisplay(article);
  const pressValue = getArticlePressValue(article);
  const reporter = cleanDisplayText(article?.reporter || article?.author, '');
  const pressLabel = cleanDisplayText(getPressLabel(pressValue), '언론사 미상');

  return {
    title: cleanDisplayText(article?.title, '선택한 뉴스 정보를 찾을 수 없습니다.'),
    author: reporter ? `${pressLabel} · ${reporter}` : pressLabel,
    date: article?.inputTime || article?.date || article?.publishedAt || article?.createdAt || article?.pubDate || article?.pub_date || '날짜 미상',
    views: article?.viewCount ? article.viewCount.toLocaleString('ko-KR') : '-',
    body: cleanDisplayText(article?.content || article?.body || article?.desc || article?.summary || article?.description, '목록에서 전달된 기사 요약이 없습니다.'),
    url: article?.url,
    topic: cleanDisplayText(article?.topic, ''),
    ...reliability,
  };
}

export default function DetailView({ type }) {
  const location = useLocation();
  const { id } = useParams();
  const isNews = type === '뉴스';
  const stateArticle = location.state?.article;
  const initialArticle = useMemo(() => stateArticle || getStoredArticle(id), [id, stateArticle]);
  const [detailResult, setDetailResult] = useState({ url: '', status: 'idle', article: null, error: '' });
  const detailUrl = isNews ? getSupportedArticleDetailUrl(initialArticle?.url) : '';
  const activeDetailResult = detailResult.url === detailUrl
    ? detailResult
    : { url: detailUrl, status: detailUrl ? 'loading' : 'idle', article: null, error: '' };
  const article = activeDetailResult.article ? mergeArticleDetail(initialArticle, activeDetailResult.article) : initialArticle;
  const detailStatus = activeDetailResult.status;
  const displayArticle = getDisplayArticle(article, isNews);
  const reliabilityPercent = displayArticle.scoreValue === null || displayArticle.scoreValue === undefined
    ? 0
    : Math.max(0, Math.min(100, (displayArticle.scoreValue / 5) * 100));
  const reliabilityTicks = [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    if (!detailUrl) {
      return;
    }

    let ignore = false;

    getArticleFromUrl(detailUrl)
      .then((detailArticle) => {
        if (ignore) return;
        const mergedArticle = mergeArticleDetail(initialArticle, detailArticle);
        sessionStorage.setItem(`cheat-ft-article-${id}`, JSON.stringify(mergedArticle));
        setDetailResult({ url: detailUrl, status: 'done', article: detailArticle, error: '' });
      })
      .catch((error) => {
        if (ignore) return;
        setDetailResult({
          url: detailUrl,
          status: 'error',
          article: null,
          error: error.message || '기사 상세 정보를 불러오지 못했습니다.',
        });
      });

    return () => {
      ignore = true;
    };
  }, [detailUrl, id, initialArticle]);

  return (
    <div className="detail-page" style={{ display: 'flex', padding: '40px', gap: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <div className="detail-main" style={{ flex: 2 }}>
        <div style={{ display: 'inline-block', backgroundColor: isNews ? '#1a73e8' : '#00c4b4', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px' }}>{type}</div>
        <h2 style={{ fontSize: '32px', marginBottom: '24px', lineHeight: '1.4' }}>{displayArticle.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#5f6368', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 'bold', color: '#202124' }}>{displayArticle.author}</span>
          <span>|</span>
          <span>{displayArticle.date}</span>
          <span>|</span>
          <span>조회수 {displayArticle.views}</span>
        </div>
        <div style={{ lineHeight: '1.8', fontSize: '18px', color: '#3c4043', minHeight: '300px', whiteSpace: 'pre-wrap' }}>
          {displayArticle.body}
        </div>
        {isNews && detailStatus === 'loading' && (
          <div style={{ marginTop: '20px', color: '#5f6368', fontSize: '14px' }}>백엔드 기사 상세 정보를 불러오는 중입니다.</div>
        )}

        {isNews && displayArticle.url && (
          <a
            href={displayArticle.url}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', marginTop: '32px', color: '#0056d2', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none' }}
          >
            원문 기사 보기 ↗
          </a>
        )}

        {!isNews && (
          <>
            <hr style={{ margin: '40px 0', border: '0px', height: '1px', backgroundColor: '#e0e0e0' }} />
            <h4 style={{ fontSize: '20px', marginBottom: '20px' }}>댓글 (12)</h4>
            <div className="detail-comment-form" style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#e8f0fe', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
              <input style={{ flex: 1, padding: '14px 16px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '15px' }} placeholder="의견을 남겨보세요..." />
              <button style={{ padding: '0 24px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>등록</button>
            </div>
          </>
        )}
      </div>

      <div className="detail-aside" style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '32px', borderRadius: '16px', height: 'fit-content', border: '1px solid #e0e0e0' }}>
        <div style={{ marginBottom: isNews ? 0 : '32px' }}>
          <strong style={{ display: 'block', marginBottom: '16px', fontSize: '18px' }}>신뢰도</strong>
          <div
            aria-label={`신뢰도 ${displayArticle.score}`}
            style={{ position: 'relative', paddingTop: '10px', paddingBottom: '18px' }}
          >
            <div style={{ height: '12px', backgroundColor: '#e8eaed', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${reliabilityPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(to right, #ea4335, #fbbc04, #34a853)',
                  borderRadius: '999px',
                }}
              ></div>
            </div>
            {isNews && displayArticle.scoreValue !== null && displayArticle.scoreValue !== undefined && (
              <div
                style={{
                  position: 'absolute',
                  left: `${reliabilityPercent}%`,
                  top: '3px',
                  width: '4px',
                  height: '26px',
                  borderRadius: '999px',
                  backgroundColor: displayArticle.scoreColor,
                  boxShadow: '0 0 0 3px #ffffff, 0 1px 6px rgba(60,64,67,0.22)',
                  transform: 'translateX(-50%)',
                }}
              ></div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', marginTop: '10px', fontSize: '12px', color: '#5f6368', fontWeight: 'bold' }}>
              {reliabilityTicks.map((tick) => (
                <span key={tick} style={{ textAlign: tick === 0 ? 'left' : tick === 5 ? 'right' : 'center' }}>{tick}</span>
              ))}
            </div>
          </div>
          {isNews && (
            <div style={{ marginTop: '18px', fontSize: '15px', color: '#3c4043', fontWeight: 'bold' }}>
              {displayArticle.scoreText} <span style={{ color: '#80868b', fontWeight: 'normal' }}>{displayArticle.score}</span>
            </div>
          )}
          {isNews && displayArticle.reliabilityCategory && (
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#5f6368' }}>
              분류: {displayArticle.reliabilityCategory}
            </div>
          )}
          {isNews && displayArticle.topic && (
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#5f6368' }}>
              주제: {displayArticle.topic}
            </div>
          )}
          {isNews && displayArticle.reliabilityReason && (
            <div style={{ marginTop: '14px', padding: '14px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e0e0e0', color: '#5f6368', fontSize: '13px', lineHeight: '1.6' }}>
              {displayArticle.reliabilityReason}
            </div>
          )}

          {!isNews && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #34A853', fontSize: '15px', color: '#3c4043', lineHeight: '1.6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <strong style={{ display: 'block', color: '#1a73e8', marginBottom: '8px', fontSize: '14px' }}>AI 분석 코멘트</strong>
              해당 게시글은 다양한 출처를 인용하고 있으나, 결론 부분에서 특정 진영의 논리를 강화하는 경향이 보입니다.
            </div>
          )}
        </div>

        {!isNews && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <strong style={{ display: 'block', marginBottom: '16px', fontSize: '18px' }}>관련 키워드</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['#팩트체크', '#교차검증', '#데이터분석', '#최신동향'].map(tag => (
                  <span key={tag} style={{ backgroundColor: '#ffffff', border: '1px solid #dadce0', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', color: '#5f6368', cursor: 'pointer' }}>{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <strong style={{ display: 'block', marginBottom: '16px', fontSize: '18px' }}>관련 뉴스 (다양성 모드)</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>해당 주장과 상반된 전문가 인터뷰</div>
                  <div style={{ fontSize: '12px', color: '#80868b' }}>OO뉴스 | 2024.05.19</div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>통계청 발표 공식 데이터 리포트</div>
                  <div style={{ fontSize: '12px', color: '#80868b' }}>국가통계포털 | 2024.05.18</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
