import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSummary, runFactCheck } from '../../services/cheatftApi.js';
import { getPressCategory, getPressLabel } from '../../utils/press.js';

const PRESS_COLORS = ['#1a73e8', '#00c4b4', '#ea4335', '#8ab4f8', '#202124'];
const SORT_LABELS = {
  latest: '최신순',
  views: '조회수순',
  relevance: '연관도순',
};
const SOURCE_FILTERS = [
  { value: 'all', label: '전체 출처' },
  { value: '방송/통신사', label: '방송/통신사' },
  { value: '종합지', label: '종합지' },
  { value: '경제지', label: '경제지' },
  { value: '인터넷/IT지', label: '인터넷/IT지' },
  { value: '기타 출처', label: '기타 출처' },
];
function matchesSourceFilter(item, sourceFilter) {
  if (sourceFilter === 'all') return true;
  return item.sourceCategory === sourceFilter;
}

function getNumericValue(...values) {
  const matched = values.find((value) => value !== undefined && value !== null && value !== '');
  const numericValue = Number(matched);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function getOptionalNumber(...values) {
  const matched = values.find((value) => value !== undefined && value !== null && value !== '');
  const numericValue = Number(matched);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function normalizeReliabilityScore(...values) {
  const numericValue = getOptionalNumber(...values);
  if (numericValue === null) return null;
  return Math.max(1, Math.min(5, numericValue > 5 ? numericValue / 20 : numericValue));
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

function getDateValue(value) {
  if (!value) return 0;
  const directDate = new Date(value);
  if (!Number.isNaN(directDate.getTime())) return directDate.getTime();

  const parts = String(value).match(/\d+/g);
  if (!parts || parts.length < 3) return 0;
  const [year, month, day] = parts.map(Number);
  return new Date(year, month - 1, day).getTime();
}

function sortResultsBy(items, sortBy) {
  return [...items].sort((a, b) => {
    if (sortBy === 'views') {
      return (b.viewCount || 0) - (a.viewCount || 0) || (a.sortIndex || 0) - (b.sortIndex || 0);
    }

    if (sortBy === 'relevance') {
      return (b.relevanceScore || 0) - (a.relevanceScore || 0) || (a.sortIndex || 0) - (b.sortIndex || 0);
    }

    return getDateValue(b.date) - getDateValue(a.date) || (a.sortIndex || 0) - (b.sortIndex || 0);
  });
}

function formatDate(value) {
  if (!value) return '날짜 미상';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '');
}

function formatDateTime(value) {
  if (!value) return '확인중';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');
}

function mapApiArticle(article, index) {
  const pressValue = article.press ?? article.pressName ?? article.publisher ?? article.mediaName;
  const pressLabel = getPressLabel(pressValue);
  const articleDate = article.publishedAt || article.createdAt || article.date || article.pubDate || article.pub_date;
  const scoreValue = normalizeReliabilityScore(
    article.reliabilityScore,
    article.reliability,
    article.trustScore,
    article.credibilityScore,
    article.score
  );

  return {
    articleId: article.articleId,
    sourceLabel: '백엔드 API',
    sourceCategory: getPressCategory(pressValue),
    sortIndex: index,
    viewCount: getNumericValue(article.viewCount, article.views, article.readCount),
    relevanceScore: getNumericValue(article.relevanceScore, article.relevance, article.similarity),
    pub: pressLabel,
    logo: String(pressLabel).slice(0, 2),
    color: PRESS_COLORS[index % PRESS_COLORS.length],
    date: formatDate(articleDate),
    title: article.title || article.headline || '제목 없음',
    desc: article.summary || article.description || article.content || article.url || '요약이 제공되지 않았습니다.',
    scoreText: article.reliabilityLabel || article.credibilityLabel || getScoreText(scoreValue),
    score: scoreValue === null ? '-' : `${scoreValue.toFixed(1).replace(/\.0$/, '')} / 5`,
    scoreColor: getScoreColor(scoreValue),
    rotation: scoreValue === null ? 0 : -99 + (scoreValue - 1) * 36,
    hint: article.url ? '기사 원문 URL이 연결된 백엔드 결과입니다.' : '백엔드 기사 결과입니다.',
    url: article.url,
  };
}

function normalizeCheckResult(result) {
  const normalized = String(result || '').toUpperCase();
  if (['TRUE', 'FACT', 'REAL'].includes(normalized)) return 'TRUE';
  if (['FALSE', 'FAKE'].includes(normalized)) return 'FALSE';
  return normalized;
}

function getRecentCheckTitle(check) {
  return check?.title || check?.query || check?.content || '제목 없음';
}

function mapRecentCheck(check, index) {
  const result = normalizeCheckResult(check.result);
  const title = getRecentCheckTitle(check);
  const scoreValue = normalizeReliabilityScore(
    check.reliabilityScore,
    check.reliability,
    check.trustScore,
    check.credibilityScore,
    check.score
  );

  return {
    articleId: check.id,
    checkQuery: title,
    sourceLabel: '백엔드 API',
    sourceCategory: '기타 출처',
    sortIndex: index,
    viewCount: getNumericValue(check.viewCount, check.views, check.readCount),
    relevanceScore: getNumericValue(check.relevanceScore, check.relevance, check.similarity),
    pub: 'Cheat F/T',
    logo: 'FT',
    color: PRESS_COLORS[index % PRESS_COLORS.length],
    date: check.timeAgo || '방금 전',
    title,
    desc: check.summary || check.description || `검증 결과: ${result || '확인중'}`,
    scoreText: check.reliabilityLabel || check.credibilityLabel || getScoreText(scoreValue),
    score: scoreValue === null ? '-' : `${scoreValue.toFixed(1).replace(/\.0$/, '')} / 5`,
    scoreColor: getScoreColor(scoreValue),
    rotation: scoreValue === null ? 0 : -99 + (scoreValue - 1) * 36,
    hint: '카드를 누르면 이 주제로 상세 검증을 요청합니다.',
  };
}

export default function VerificationView({ onSearch, onArticleClick }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [val, setVal] = useState(query || '');
  const [checkResult, setCheckResult] = useState(null);
  const [apiStatus, setApiStatus] = useState(query ? 'loading' : 'idle');
  const [apiError, setApiError] = useState('');
  const [recentChecks, setRecentChecks] = useState([]);
  const [latestStatus, setLatestStatus] = useState(query ? 'idle' : 'loading');
  const [sortBy, setSortBy] = useState('latest');
  const [sourceFilter, setSourceFilter] = useState('all');

  function handleSortChange(nextSortBy) {
    setSortBy(nextSortBy);
  }

  useEffect(() => {
    if (!query) {
      return;
    }

    let ignore = false;

    runFactCheck(query, { page: 1, limit: 10 })
      .then((data) => {
        if (!ignore) {
          setCheckResult(data);
          setApiStatus('done');
        }
      })
      .catch((error) => {
        if (!ignore && error.code !== 'API_NOT_CONFIGURED') {
          setApiError(error.message || '검증 결과를 불러오지 못했습니다.');
        }
        if (!ignore) {
          setApiStatus('error');
        }
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  useEffect(() => {
    if (query) {
      return;
    }

    let ignore = false;

    getSummary()
      .then((data) => {
        if (ignore) return;
        setRecentChecks(Array.isArray(data?.recentChecks) ? data.recentChecks : []);
        setLatestStatus('done');
      })
      .catch((error) => {
        if (ignore) return;
        setApiError(error.message || '최신 팩트체크를 불러오지 못했습니다.');
        setRecentChecks([]);
        setLatestStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  const styles = {
    container: { display: 'flex', gap: '24px', padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100%', maxWidth: '1400px', margin: '0 auto' },
    leftPanel: { width: '340px', flexShrink: 0 },
    rightPanel: { flex: 1, backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e0e0e0', padding: '32px' },
    searchCard: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '16px' },
    titleInfo: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#202124', display: 'flex', alignItems: 'center', gap: '8px' },
    descInfo: { fontSize: '14px', color: '#5f6368', marginBottom: '20px', lineHeight: '1.5' },
    tabContainer: { display: 'flex', marginBottom: '16px', backgroundColor: '#f1f3f4', borderRadius: '8px', padding: '4px' },
    tab: (isActive) => ({ flex: 1, padding: '10px 0', textAlign: 'center', cursor: 'pointer', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#0056d2' : '#5f6368', backgroundColor: isActive ? '#ffffff' : 'transparent', borderRadius: '6px', boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }),
    textarea: { width: '100%', height: '180px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', resize: 'none', marginBottom: '8px', boxSizing: 'border-box', fontSize: '15px', outline: 'none' },
    charCount: { textAlign: 'right', fontSize: '12px', color: '#80868b', marginBottom: '24px' },
    exampleText: { fontSize: '13px', color: '#5f6368', marginBottom: '12px' },
    exampleBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '8px', color: '#3c4043', cursor: 'pointer', fontSize: '14px' },
    searchBtn: { width: '100%', padding: '16px', backgroundColor: '#0056d2', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '16px' },
    infoBox: { backgroundColor: '#f0f4f9', padding: '20px', borderRadius: '12px', border: '1px solid #d2e3fc' },
    infoTitle: { color: '#174ea6', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    infoDesc: { color: '#5f6368', fontSize: '13px', lineHeight: '1.5' },
    
    // FactCheck section styles
    sectionCard: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e0e0e0', padding: '32px', display: 'flex', flexDirection: 'column', height: '100%' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    sectionTitle: { fontSize: '20px', fontWeight: 'bold', color: '#202124' },
    sectionMore: { fontSize: '14px', color: '#80868b', cursor: 'pointer' },
    factCheckItem: { display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f1f3f4', gap: '20px' },
    factImagePlaceholder: { width: '80px', height: '60px', backgroundColor: '#f1f3f4', borderRadius: '8px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px' },
    factBadge: (isTrue) => ({ padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', color: '#ffffff', backgroundColor: isTrue ? '#34a853' : '#ea4335', marginBottom: '8px', display: 'inline-block' }),
    factTitle: { fontSize: '17px', fontWeight: 'bold', color: '#202124', marginBottom: '6px' },
    factMeta: { fontSize: '14px', color: '#80868b' },

    // Right panel styles
    resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f3f4', paddingBottom: '24px' },
    resultQuery: { fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: '#202124' },
    resultMeta: { color: '#80868b', fontSize: '14px' },
    filters: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    articleCard: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } },
    articleMeta: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
    publisherLogo: (color) => ({ width: '28px', height: '28px', backgroundColor: color, borderRadius: '50%', color: '#fff', textAlign: 'center', lineHeight: '28px', fontSize: '11px', fontWeight: 'bold' }),
    publisher: { fontWeight: 'bold', fontSize: '15px', color: '#202124' },
    date: { color: '#80868b', fontSize: '13px' },
    articleTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#202124' },
    articleDesc: { color: '#5f6368', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' },
    linkBtn: { color: '#0056d2', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' },
    gaugeContainer: { width: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    gaugeTitle: { fontSize: '13px', color: '#5f6368', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' },
    gaugeArc: () => ({ width: '120px', height: '60px', overflow: 'hidden', position: 'relative', marginBottom: '8px' }),
    gaugeArcInner: (color, percent) => ({ width: '120px', height: '120px', borderRadius: '50%', border: '16px solid #f1f3f4', borderTopColor: color, borderRightColor: color, transform: `rotate(${percent}deg)`, boxSizing: 'border-box' }),
    gaugeScore: { fontWeight: 'bold', fontSize: '16px', color: '#202124', textAlign: 'center', marginTop: '-20px' },
    gaugeSub: { fontSize: '12px', color: '#80868b', marginTop: '4px' },
    gaugeHint: { fontSize: '12px', color: '#80868b', textAlign: 'center', marginTop: '12px', lineHeight: '1.4' },
    bottomDisclaimer: { marginTop: '32px', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' },
    sourceBadge: (source) => ({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: source === '백엔드 API' ? '#174ea6' : '#5f6368',
      backgroundColor: source === '백엔드 API' ? '#e8f0fe' : '#f1f3f4',
      border: source === '백엔드 API' ? '1px solid #d2e3fc' : '1px solid #e0e0e0',
    }),
    sourceNotice: (source) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 'bold',
      color: source === 'api' || source === 'mixed' ? '#174ea6' : source === 'error' ? '#ea4335' : '#80868b',
      backgroundColor: source === 'api' || source === 'mixed' ? '#e8f0fe' : source === 'error' ? '#fce8e6' : '#ffffff',
      border: source === 'api' || source === 'mixed' ? '1px solid #d2e3fc' : '1px solid #e0e0e0',
      marginTop: '12px',
    }),
    resultGroupLabel: (source) => ({
      margin: '24px 0 12px',
      padding: '10px 14px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: source === 'api' ? '#174ea6' : '#5f6368',
      backgroundColor: source === 'api' ? '#e8f0fe' : '#f8f9fa',
      border: source === 'api' ? '1px solid #d2e3fc' : '1px solid #e0e0e0',
    }),
    emptyState: { padding: '48px 24px', borderRadius: '12px', border: '1px dashed #dadce0', backgroundColor: '#fafbfc', color: '#5f6368', textAlign: 'center', lineHeight: '1.6' }
  };

  const apiResults = Array.isArray(checkResult?.articles) ? checkResult.articles.map(mapApiArticle) : [];
  const latestResults = recentChecks.map(mapRecentCheck);
  const sortedApiResults = sortResultsBy(apiResults, sortBy);
  const sortedLatestResults = sortResultsBy(latestResults, sortBy);
  const filteredApiResults = sortedApiResults.filter((result) => matchesSourceFilter(result, sourceFilter));
  const filteredLatestResults = sortedLatestResults.filter((result) => matchesSourceFilter(result, sourceFilter));
  const hasApiCheckResult = query && apiStatus === 'done';
  const hasApiLatestResult = !query && latestStatus === 'done';
  const isLoading = query && apiStatus === 'loading';
  const isLatestLoading = !query && latestStatus === 'loading';
  const hasError = query ? apiStatus === 'error' : latestStatus === 'error';
  const displayResults = query ? filteredApiResults : filteredLatestResults;
  const dataSource = query
    ? (isLoading ? 'loading' : hasApiCheckResult ? 'api' : hasError ? 'error' : 'idle')
    : (isLatestLoading ? 'loading' : hasApiLatestResult ? 'api' : hasError ? 'error' : 'idle');
  const dataSourceText = dataSource === 'api'
    ? '백엔드 API 응답 표시 중'
    : dataSource === 'error'
      ? '백엔드 API 응답 실패'
      : '백엔드 API 응답 대기 중';
  const totalArticles = hasApiCheckResult ? (checkResult?.totalArticles ?? apiResults.length) : apiResults.length;
  const queryResultGroups = hasApiCheckResult
    ? [
        { key: 'api', label: `백엔드 API 결과 ${filteredApiResults.length}건`, source: 'api', items: filteredApiResults },
      ]
    : [];
  const searchTime = formatDateTime(checkResult?.searchTime);

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.searchCard}>
          <div style={styles.titleInfo}>검증할 정보를 입력하세요 ⓘ</div>
          <div style={styles.descInfo}>뉴스, 게시글, 영상 등 다양한 정보를 검색하여 관련 출처의 신빙성을 확인해보세요.</div>
          
          <textarea
            style={styles.textarea}
            placeholder="검증하고 싶은 내용이나 문장을 입력하세요."
            value={val}
            onChange={(e) => setVal(e.target.value)}
            maxLength={5000}
            aria-label="검증할 정보"
          />
          <div style={styles.charCount}>{val.length} / 5,000</div>
          
          <button style={styles.searchBtn} onClick={() => onSearch(val)}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{verticalAlign:'middle', marginRight:'8px'}}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            검색하기
          </button>
        </div>
        
        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>Cheat F/T는 알려드립니다 <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg></div>
          <div style={styles.infoDesc}>여러 언론사와 기관의 기사를 수집하여 출처의 신빙성을 객관적으로 평가합니다. 최종 판단은 사용자에게 맡깁니다.</div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        {query ? (
          <>
            <div style={styles.resultHeader}>
              <div>
                <div style={styles.resultQuery}>
                  <svg width="24" height="24" fill="#1a73e8" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                  "{query}"
                </div>
                <div style={{ color: '#5f6368', marginTop: '8px' }}>
                  {isLoading
                    ? '백엔드 검증 결과를 불러오는 중입니다.'
                    : apiStatus === 'error'
                      ? '백엔드 검증 결과를 불러오지 못했습니다.'
                      : hasApiCheckResult && apiResults.length === 0
                      ? '백엔드 API 응답은 성공했지만 관련 기사 목록이 비어 있습니다.'
                      : hasApiCheckResult
                        ? `백엔드 API 기준 ${totalArticles}건을 표시합니다.`
                        : '검색어를 입력하면 백엔드 검증 결과를 표시합니다.'}
                  {apiError && <span style={{ color: '#ea4335', marginLeft: '8px' }}>{apiError}</span>}
                </div>
                <div style={styles.sourceNotice(dataSource)}>{dataSourceText}</div>
              </div>
              <div style={styles.resultMeta}>검색 시간: {searchTime}</div>
            </div>

            <div style={styles.filters}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value)}
                  style={{ padding: '8px 32px 8px 12px', borderRadius: '6px', border: '1px solid #dadce0', backgroundColor: '#fff', fontSize: '14px', outline: 'none' }}
                  aria-label="출처 분류 필터"
                >
                  {SOURCE_FILTERS.map((filter) => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(event) => handleSortChange(event.target.value)}
                  style={{ padding: '8px 32px 8px 12px', borderRadius: '6px', border: '1px solid #dadce0', backgroundColor: '#fff', fontSize: '14px', outline: 'none' }}
                  aria-label="검색 결과 정렬"
                >
                  <option value="latest">최신순</option>
                  <option value="views">조회수순</option>
                  <option value="relevance">연관도순</option>
                </select>
              </div>
              <div style={{ fontSize: '13px', color: '#5f6368', cursor: 'pointer' }}>신빙성 등급 안내 ⓘ</div>
            </div>

            {queryResultGroups.length === 0 || queryResultGroups.every((group) => group.items.length === 0) ? (
              <div style={styles.emptyState}>
                {apiStatus === 'error' ? apiError || '검증 결과를 불러오지 못했습니다.' : '표시할 검색 결과가 없습니다.'}
              </div>
            ) : queryResultGroups.map((group) => (
              <div key={group.key}>
                <div style={styles.resultGroupLabel(group.source)}>{group.label} · {SORT_LABELS[sortBy]}</div>
                {group.items.length === 0 ? (
                  <div style={styles.emptyState}>이 섹션에 표시할 결과가 없습니다.</div>
                ) : group.items.map((res, i) => (
                  <div key={`${group.key}-${res.articleId ?? res.title ?? i}`} style={styles.articleCard} onClick={() => onArticleClick(res.articleId ?? i + 1, res)}>
                    <div style={{ flex: 1, paddingRight: '40px' }}>
                      <div style={styles.articleMeta}>
                        <div style={styles.publisherLogo(res.color)}>{res.logo}</div>
                        <span style={styles.publisher}>{res.pub}</span>
                        <span style={styles.date}>{res.date}</span>
                        <span style={styles.sourceBadge(res.sourceLabel)}>{res.sourceLabel}</span>
                        {res.sourceCategory && <span style={styles.date}>{res.sourceCategory}</span>}
                        {res.viewCount > 0 && <span style={styles.date}>조회 {res.viewCount.toLocaleString('ko-KR')}</span>}
                        {res.relevanceScore > 0 && <span style={styles.date}>연관도 {res.relevanceScore}</span>}
                      </div>
                      <div style={styles.articleTitle}>{res.title}</div>
                      <div style={styles.articleDesc}>{res.desc}</div>
                      
                      {res.opposing && (
                        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f0f4f9', borderRadius: '8px', borderLeft: '4px solid #1a73e8' }}>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#174ea6', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
                            다양성 모드: 반대되는 관점의 기사
                          </div>
                          <div style={{ fontSize: '15px', color: '#202124', fontWeight: '500' }}>{res.opposing.title}</div>
                          <div style={{ fontSize: '13px', color: '#5f6368', marginTop: '4px' }}>{res.opposing.pub} • {res.opposing.date}</div>
                        </div>
                      )}

                      {res.url ? (
                        <a style={{ ...styles.linkBtn, textDecoration: 'none' }} href={res.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                          기사 보기 <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                        </a>
                      ) : (
                        <div style={styles.linkBtn}>기사 보기 <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg></div>
                      )}
                    </div>
                    <div style={{ width: '1px', backgroundColor: '#f1f3f4', margin: '0 24px' }}></div>
                    <div style={styles.gaugeContainer}>
                      <div style={styles.gaugeTitle}>신빙성 등급 ⓘ</div>
                      <div style={styles.gaugeArc(res.scoreColor)}>
                        <div style={styles.gaugeArcInner(res.scoreColor, res.rotation)}></div>
                      </div>
                      <div style={styles.gaugeScore}>{res.scoreText}</div>
                      <div style={styles.gaugeSub}>{res.score}</div>
                      <div style={styles.gaugeHint}>{res.hint}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div style={styles.bottomDisclaimer}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#e8f0fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" fill="#1a73e8" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' }}>최종 판단은 사용자의 몫입니다</div>
                <div style={{ fontSize: '14px', color: '#5f6368', lineHeight: '1.5' }}>Cheat F/T는 출처의 신빙성을 객관적으로 평가할 뿐, 정보의 진위 여부를 단정하지 않습니다.<br/>다양한 출처를 참고하여 스스로 판단해주세요.</div>
              </div>
              <button style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#0056d2', border: '1px solid #d2e3fc', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>신빙성 등급 안내 보기 ⓘ</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ ...styles.resultHeader, borderBottom: 'none', paddingBottom: '0' }}>
              <div>
                <div style={styles.resultQuery}>최신 팩트체크</div>
                <div style={{ color: '#5f6368', marginTop: '8px' }}>
                  {isLatestLoading
                    ? '홈 요약 API에서 최신 팩트체크를 불러오는 중입니다.'
                    : latestResults.length
                      ? '홈 요약 API에서 불러온 최신 팩트체크입니다.'
                      : latestStatus === 'error'
                        ? '최신 팩트체크를 불러오지 못했습니다.'
                        : '백엔드에서 받은 최신 팩트체크 목록이 비어 있습니다.'}
                </div>
                <div style={styles.sourceNotice(dataSource)}>{dataSourceText}</div>
              </div>
            </div>
            <div style={styles.filters}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  value={sourceFilter}
                  onChange={(event) => setSourceFilter(event.target.value)}
                  style={{ padding: '8px 32px 8px 12px', borderRadius: '6px', border: '1px solid #dadce0', backgroundColor: '#fff', fontSize: '14px', outline: 'none' }}
                  aria-label="출처 분류 필터"
                >
                  {SOURCE_FILTERS.map((filter) => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(event) => handleSortChange(event.target.value)}
                  style={{ padding: '8px 32px 8px 12px', borderRadius: '6px', border: '1px solid #dadce0', backgroundColor: '#fff', fontSize: '14px', outline: 'none' }}
                  aria-label="최신 팩트체크 정렬"
                >
                  <option value="latest">최신순</option>
                  <option value="views">조회수순</option>
                  <option value="relevance">연관도순</option>
                </select>
              </div>
              <div style={{ fontSize: '13px', color: '#5f6368', cursor: 'pointer' }}>신빙성 등급 안내 ⓘ</div>
            </div>

            {displayResults.length === 0 ? (
              <div style={styles.emptyState}>
                백엔드에서 받은 최신 팩트체크 목록이 비어 있습니다.<br/>
                표시할 항목이 없습니다.
              </div>
            ) : displayResults.map((res, i) => (
              <div
                key={res.articleId ?? res.title ?? i}
                style={styles.articleCard}
                onClick={() => onArticleClick(res.articleId ?? i + 1, res)}
              >
                <div style={{ flex: 1, paddingRight: '40px' }}>
                  <div style={styles.articleMeta}>
                    <div style={styles.publisherLogo(res.color)}>{res.logo}</div>
                    <span style={styles.publisher}>{res.pub}</span>
                    <span style={styles.date}>{res.date}</span>
                    <span style={styles.sourceBadge(res.sourceLabel)}>{res.sourceLabel}</span>
                    {res.sourceCategory && <span style={styles.date}>{res.sourceCategory}</span>}
                    {res.viewCount > 0 && <span style={styles.date}>조회 {res.viewCount.toLocaleString('ko-KR')}</span>}
                    {res.relevanceScore > 0 && <span style={styles.date}>연관도 {res.relevanceScore}</span>}
                  </div>
                  <div style={styles.articleTitle}>{res.title}</div>
                  <div style={styles.articleDesc}>{res.desc}</div>
                  <div style={styles.linkBtn}>
                    뉴스 상세 보기 <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                  </div>
                </div>
                <div style={{ width: '1px', backgroundColor: '#f1f3f4', margin: '0 24px' }}></div>
                <div style={styles.gaugeContainer}>
                  <div style={styles.gaugeTitle}>신빙성 등급 ⓘ</div>
                  <div style={styles.gaugeArc(res.scoreColor)}>
                    <div style={styles.gaugeArcInner(res.scoreColor, res.rotation)}></div>
                  </div>
                  <div style={styles.gaugeScore}>{res.scoreText}</div>
                  <div style={styles.gaugeSub}>{res.score}</div>
                  <div style={styles.gaugeHint}>{res.hint}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
