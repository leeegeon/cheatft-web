import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSummary, runFactCheck } from '../../services/cheatftApi.js';
import { getPressCategory, getPressLabel, getPressLogoUrl, getPressReliability, recordObservedPress } from '../../utils/press.js';
import {
  formatReliabilityScore,
  getReliabilityColor,
  getReliabilityGaugeFillPercent,
  getReliabilityLabel,
  normalizeReliabilityScoreValue,
} from '../../utils/reliability.js';
import { cleanDisplayText } from '../../utils/text.js';

const PRESS_COLORS = ['#1a73e8', '#00c4b4', '#ea4335', '#8ab4f8', '#202124'];
const SORT_LABELS = {
  relevance: '연관도순',
  latest: '최신순',
  reliabilityDesc: '신뢰도 높은순',
  reliabilityAsc: '신뢰도 낮은순',
};
const SOURCE_FILTERS = [
  { value: 'all', label: '전체 출처' },
  { value: '방송/통신사', label: '방송/통신사' },
  { value: '종합지', label: '종합지' },
  { value: '경제지', label: '경제지' },
  { value: '인터넷/IT지', label: '인터넷/IT지' },
  { value: '전문/산업지', label: '전문/산업지' },
  { value: '시사/탐사지', label: '시사/탐사지' },
  { value: '지역지', label: '지역지' },
  { value: '스포츠/연예지', label: '스포츠/연예지' },
  { value: '영문매체', label: '영문매체' },
  { value: '기타 출처', label: '기타 출처' },
];
const CHECK_RESULT_FETCH_LIMIT = 100;
const CHECK_RESULT_PAGE_SIZE = 10;
const CHECK_RESULT_CACHE_PREFIX = 'cheat-ft-check-result-';

function getCheckResultCacheKey(query) {
  return `${CHECK_RESULT_CACHE_PREFIX}${encodeURIComponent(query)}`;
}

function getCachedCheckResult(query) {
  if (!query) return null;

  try {
    const stored = sessionStorage.getItem(getCheckResultCacheKey(query));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function cacheCheckResult(query, data) {
  if (!query || !data) return;

  try {
    sessionStorage.setItem(getCheckResultCacheKey(query), JSON.stringify(data));
  } catch {
    // Session cache is only an optimization for back navigation.
  }
}

function matchesSourceFilter(item, sourceFilter) {
  if (sourceFilter === 'all') return true;
  return item.sourceCategory === sourceFilter;
}

function getNumericValue(...values) {
  const matched = values.find((value) => value !== undefined && value !== null && value !== '');
  const numericValue = Number(matched);
  return Number.isFinite(numericValue) ? numericValue : 0;
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
    if (sortBy === 'relevance') {
      return (b.relevanceScore || 0) - (a.relevanceScore || 0) || (a.sortIndex || 0) - (b.sortIndex || 0);
    }

    if (sortBy === 'reliabilityDesc') {
      const aScore = a.reliabilitySortScore ?? Number.NEGATIVE_INFINITY;
      const bScore = b.reliabilitySortScore ?? Number.NEGATIVE_INFINITY;
      return bScore - aScore || (a.sortIndex || 0) - (b.sortIndex || 0);
    }

    if (sortBy === 'reliabilityAsc') {
      const aScore = a.reliabilitySortScore ?? Number.POSITIVE_INFINITY;
      const bScore = b.reliabilitySortScore ?? Number.POSITIVE_INFINITY;
      return aScore - bScore || (a.sortIndex || 0) - (b.sortIndex || 0);
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
  recordObservedPress(pressValue, article.pressName ?? article.publisher ?? article.mediaName);
  const pressLabel = getPressLabel(pressValue);
  const articleDate = article.publishedAt || article.createdAt || article.date || article.pubDate || article.pub_date;
  const apiScoreValue = normalizeReliabilityScoreValue(
    article.reliabilityScore,
    article.reliability,
    article.trustScore,
    article.credibilityScore,
    article.score
  );
  const pressReliability = getPressReliability(pressValue);
  const scoreValue = apiScoreValue ?? pressReliability.reliabilityScore;
  const usesPressReliability = apiScoreValue === null && pressReliability.reliabilityScore !== null;
  const scoreText = scoreValue !== null
    ? getReliabilityLabel(scoreValue)
    : article.reliabilityLabel || article.credibilityLabel || pressReliability.reliabilityLabel || getReliabilityLabel(scoreValue);

  return {
    articleId: article.articleId,
    sourceCategory: getPressCategory(pressValue),
    sortIndex: index,
    viewCount: getNumericValue(article.viewCount, article.views, article.readCount),
    relevanceScore: getNumericValue(article.relevanceScore, article.relevance, article.similarity),
    pub: pressLabel,
    logo: String(pressLabel).slice(0, 2),
    logoUrl: getPressLogoUrl(pressValue),
    color: PRESS_COLORS[index % PRESS_COLORS.length],
    date: formatDate(articleDate),
    title: cleanDisplayText(article.title || article.headline, '제목 없음'),
    desc: cleanDisplayText(article.summary || article.description || article.content || article.url, '요약이 제공되지 않았습니다.'),
    scoreText,
    score: formatReliabilityScore(scoreValue),
    reliabilitySortScore: scoreValue,
    scoreColor: getReliabilityColor(scoreValue),
    gaugeFillPercent: getReliabilityGaugeFillPercent(scoreValue),
    hint: usesPressReliability
      ? `${pressLabel}의 언론사 기준 신뢰도입니다.`
      : article.url ? '기사 원문을 함께 확인할 수 있습니다.' : '관련 기사입니다.',
    reliabilityReason: pressReliability.rationaleSummary,
    reliabilityCategory: pressReliability.category,
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
  return cleanDisplayText(check?.title || check?.query || check?.content, '제목 없음');
}

function mapRecentCheck(check, index) {
  const result = normalizeCheckResult(check.result);
  const title = getRecentCheckTitle(check);
  const scoreValue = normalizeReliabilityScoreValue(
    check.reliabilityScore,
    check.reliability,
    check.trustScore,
    check.credibilityScore,
    check.score
  );

  return {
    articleId: check.id,
    checkQuery: title,
    sourceCategory: '기타 출처',
    sortIndex: index,
    viewCount: getNumericValue(check.viewCount, check.views, check.readCount),
    relevanceScore: getNumericValue(check.relevanceScore, check.relevance, check.similarity),
    pub: 'Cheat F/T',
    logo: 'FT',
    logoUrl: '',
    color: PRESS_COLORS[index % PRESS_COLORS.length],
    date: check.timeAgo || '방금 전',
    title,
    desc: cleanDisplayText(check.summary || check.description, `검증 결과: ${result || '확인중'}`),
    scoreText: scoreValue !== null ? getReliabilityLabel(scoreValue) : check.reliabilityLabel || check.credibilityLabel || getReliabilityLabel(scoreValue),
    score: formatReliabilityScore(scoreValue),
    reliabilitySortScore: scoreValue,
    scoreColor: getReliabilityColor(scoreValue),
    gaugeFillPercent: getReliabilityGaugeFillPercent(scoreValue),
    hint: '카드를 누르면 이 주제로 신뢰도 분석을 요청합니다.',
  };
}

export default function VerificationView({ onSearch, onArticleClick }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const cachedCheckResult = getCachedCheckResult(query);
  const [val, setVal] = useState(query || '');
  const [checkResult, setCheckResult] = useState(cachedCheckResult);
  const [apiStatus, setApiStatus] = useState(query ? (cachedCheckResult ? 'done' : 'loading') : 'idle');
  const [apiError, setApiError] = useState('');
  const [recentChecks, setRecentChecks] = useState([]);
  const [latestStatus, setLatestStatus] = useState(query ? 'idle' : 'loading');
  const [sortBy, setSortBy] = useState('relevance');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [resultPageState, setResultPageState] = useState({ query: '', page: 1 });
  const resultPage = resultPageState.query === query ? resultPageState.page : 1;

  function setResultPage(nextPage) {
    setResultPageState((previousState) => {
      const previousPage = previousState.query === query ? previousState.page : 1;
      return {
        query,
        page: typeof nextPage === 'function' ? nextPage(previousPage) : nextPage,
      };
    });
  }

  function handleSortChange(nextSortBy) {
    setSortBy(nextSortBy);
    setResultPage(1);
  }

  function handleSourceFilterChange(nextSourceFilter) {
    setSourceFilter(nextSourceFilter);
    setResultPage(1);
  }

  useEffect(() => {
    if (!query) {
      return;
    }

    const cachedResult = getCachedCheckResult(query);
    if (cachedResult) {
      return;
    }

    let ignore = false;

    runFactCheck(query, { page: 1, limit: CHECK_RESULT_FETCH_LIMIT })
      .then((data) => {
        if (!ignore) {
          cacheCheckResult(query, data);
          setCheckResult(data);
          setApiStatus('done');
        }
      })
      .catch((error) => {
        if (!ignore && error.code !== 'API_NOT_CONFIGURED') {
          setApiError(error.message || '신뢰도 분석 결과를 불러오지 못했습니다.');
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
    container: { display: 'flex', flexDirection: 'column', gap: '28px', padding: '32px 40px 48px', backgroundColor: '#f8f9fa', minHeight: '100%', maxWidth: '1240px', margin: '0 auto' },
    leftPanel: { width: '100%', flexShrink: 0 },
    rightPanel: { flex: 1, backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e8eaed', padding: '32px' },
    searchCard: { width: '100%', maxWidth: '920px', margin: '0 auto', backgroundColor: 'transparent', padding: '8px 0 0', border: 'none' },
    titleInfo: { fontSize: '20px', fontWeight: '800', marginBottom: '18px', color: '#202124', textAlign: 'center' },
    descInfo: { display: 'none' },
    tabContainer: { display: 'flex', marginBottom: '16px', backgroundColor: '#f1f3f4', borderRadius: '8px', padding: '4px' },
    tab: (isActive) => ({ flex: 1, padding: '10px 0', textAlign: 'center', cursor: 'pointer', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#0056d2' : '#5f6368', backgroundColor: isActive ? '#ffffff' : 'transparent', borderRadius: '6px', boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }),
    searchShell: { display: 'flex', alignItems: 'center', gap: '12px', minHeight: '58px', padding: '0 8px 0 22px', backgroundColor: '#ffffff', border: '1px solid #dadce0', borderRadius: '999px', boxShadow: '0 2px 10px rgba(60,64,67,0.08)' },
    searchIcon: { flexShrink: 0, color: '#5f6368' },
    textarea: { flex: 1, minWidth: 0, height: '56px', padding: '0', border: 'none', background: 'transparent', boxSizing: 'border-box', fontSize: '16px', outline: 'none', color: '#202124' },
    charCount: { display: 'none' },
    exampleText: { fontSize: '13px', color: '#5f6368', marginBottom: '12px' },
    exampleBtn: { display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '8px', color: '#3c4043', cursor: 'pointer', fontSize: '14px' },
    searchBtn: { flexShrink: 0, minWidth: '84px', height: '42px', padding: '0 18px', backgroundColor: '#0056d2', color: '#ffffff', border: 'none', borderRadius: '999px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
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
    publisherLogo: (color) => ({ width: '28px', height: '28px', backgroundColor: color, borderRadius: '50%', color: '#fff', textAlign: 'center', lineHeight: '28px', fontSize: '11px', fontWeight: 'bold', position: 'relative', overflow: 'hidden', flexShrink: 0 }),
    publisherLogoImage: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '50%' },
    publisher: { fontWeight: 'bold', fontSize: '15px', color: '#202124' },
    date: { color: '#80868b', fontSize: '13px' },
    articleTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#202124' },
    articleDesc: { color: '#5f6368', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' },
    linkBtn: { color: '#0056d2', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' },
    gaugeContainer: { width: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    gaugeTitle: { fontSize: '13px', color: '#5f6368', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' },
    gaugeArc: () => ({ width: '120px', height: '70px', position: 'relative', marginBottom: '0' }),
    gaugeArcSvg: { display: 'block', width: '120px', height: '70px' },
    gaugeArcTrack: { fill: 'none', stroke: '#f1f3f4', strokeWidth: 16 },
    gaugeArcFill: (color, fillPercent) => ({
      fill: 'none',
      stroke: color,
      strokeWidth: 16,
      strokeDasharray: `${fillPercent} 100`,
      transition: 'stroke-dasharray 0.25s ease',
    }),
    gaugeScore: { fontWeight: 'bold', fontSize: '16px', color: '#202124', textAlign: 'center', marginTop: '-20px' },
    gaugeSub: { fontSize: '12px', color: '#80868b', marginTop: '4px' },
    gaugeHint: { fontSize: '12px', color: '#80868b', textAlign: 'center', marginTop: '12px', lineHeight: '1.4' },
    bottomDisclaimer: { marginTop: '32px', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' },
    resultGroupLabel: () => ({
      margin: '24px 0 12px',
      padding: '10px 14px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#174ea6',
      backgroundColor: '#e8f0fe',
      border: '1px solid #d2e3fc',
    }),
    emptyState: { padding: '48px 24px', borderRadius: '12px', border: '1px dashed #dadce0', backgroundColor: '#fafbfc', color: '#5f6368', textAlign: 'center', lineHeight: '1.6' },
    loadingOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(32, 33, 36, 0.36)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' },
    loadingDialog: { width: 'min(420px, 100%)', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d2e3fc', padding: '28px', boxShadow: '0 20px 60px rgba(32, 33, 36, 0.22)', textAlign: 'center' },
    loadingSpinner: { width: '42px', height: '42px', borderRadius: '50%', border: '4px solid #d2e3fc', borderTopColor: '#0056d2', margin: '0 auto 18px', animation: 'spin 1s linear infinite' },
    loadingTitle: { fontSize: '18px', fontWeight: '800', color: '#202124', marginBottom: '8px' },
    loadingDesc: { fontSize: '14px', color: '#5f6368', lineHeight: '1.6' },
    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '18px' },
    pageButton: (isActive, isDisabled) => ({
      minWidth: '36px',
      height: '36px',
      padding: '0 10px',
      borderRadius: '8px',
      border: isActive ? '1px solid #0056d2' : '1px solid #dadce0',
      backgroundColor: isActive ? '#0056d2' : '#ffffff',
      color: isActive ? '#ffffff' : isDisabled ? '#bdc1c6' : '#3c4043',
      fontWeight: 'bold',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
    }),
    paginationMeta: { fontSize: '13px', color: '#5f6368', textAlign: 'center', marginTop: '8px' }
  };

  const apiResults = Array.isArray(checkResult?.articles) ? checkResult.articles.map(mapApiArticle) : [];
  const latestResults = recentChecks.map(mapRecentCheck);
  const sortedApiResults = sortResultsBy(apiResults, sortBy);
  const sortedLatestResults = sortResultsBy(latestResults, sortBy);
  const filteredApiResults = sortedApiResults.filter((result) => matchesSourceFilter(result, sourceFilter));
  const filteredLatestResults = sortedLatestResults.filter((result) => matchesSourceFilter(result, sourceFilter));
  const resultTotalPages = Math.max(1, Math.ceil(filteredApiResults.length / CHECK_RESULT_PAGE_SIZE));
  const currentResultPage = Math.min(resultPage, resultTotalPages);
  const currentPageStartIndex = (currentResultPage - 1) * CHECK_RESULT_PAGE_SIZE;
  const pagedApiResults = filteredApiResults.slice(currentPageStartIndex, currentPageStartIndex + CHECK_RESULT_PAGE_SIZE);
  const hasApiCheckResult = query && apiStatus === 'done';
  const isLoading = query && apiStatus === 'loading';
  const isLatestLoading = !query && latestStatus === 'loading';
  const displayResults = query ? filteredApiResults : filteredLatestResults;
  const totalArticles = hasApiCheckResult ? (checkResult?.totalArticles ?? apiResults.length) : apiResults.length;
  const queryResultGroups = hasApiCheckResult
    ? [
        { key: 'results', label: `검색 결과 ${filteredApiResults.length}건`, source: 'results', items: pagedApiResults },
      ]
    : [];
  const searchTime = formatDateTime(checkResult?.searchTime);
  const shouldShowPagination = query && hasApiCheckResult && filteredApiResults.length > CHECK_RESULT_PAGE_SIZE;
  const pageNumbers = Array.from({ length: resultTotalPages }, (_, index) => index + 1);

  return (
    <div className="verification-page" style={styles.container}>
      {isLoading && (
        <div style={styles.loadingOverlay} role="status" aria-live="polite">
          <div style={styles.loadingDialog}>
            <div className="loading-spinner" style={styles.loadingSpinner} aria-hidden="true" />
            <div style={styles.loadingTitle}>신뢰도 분석 결과를 불러오는 중입니다</div>
            <div style={styles.loadingDesc}>관련 기사를 수집하고 신뢰도 기준을 적용하고 있습니다. 잠시만 기다려주세요.</div>
          </div>
        </div>
      )}
      <div style={styles.leftPanel}>
        <div style={styles.searchCard}>
          <div style={styles.titleInfo}>무엇의 신뢰도를 분석할까요?</div>
          <div className="verification-search-shell" style={styles.searchShell}>
            <svg style={styles.searchIcon} width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            <input
              type="search"
              style={styles.textarea}
              placeholder="뉴스 제목이나 내용을 입력하세요"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSearch(val);
                }
              }}
              maxLength={5000}
              aria-label="신뢰도를 분석할 정보"
            />
            <button style={styles.searchBtn} onClick={() => onSearch(val)}>
              검색
            </button>
          </div>
        </div>
      </div>

      <div className="verification-results-panel" style={styles.rightPanel}>
        {query ? (
          <>
            <div className="verification-result-header" style={styles.resultHeader}>
              <div>
                <div style={styles.resultQuery}>
                  <svg width="24" height="24" fill="#1a73e8" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                  "{query}"
                </div>
                <div style={{ color: '#5f6368', marginTop: '8px' }}>
                  {isLoading
                    ? '신뢰도 분석 결과를 불러오는 중입니다.'
                    : apiStatus === 'error'
                      ? '신뢰도 분석 결과를 불러오지 못했습니다.'
                      : hasApiCheckResult && apiResults.length === 0
                      ? '관련 기사 목록이 비어 있습니다.'
                      : hasApiCheckResult
                        ? `${totalArticles}건 중 최대 ${CHECK_RESULT_FETCH_LIMIT}건을 불러와 ${CHECK_RESULT_PAGE_SIZE}건씩 표시합니다.`
                        : '검색어를 입력하면 신뢰도 분석 결과를 표시합니다.'}
                  {apiError && <span style={{ color: '#ea4335', marginLeft: '8px' }}>{apiError}</span>}
                </div>
              </div>
              <div style={styles.resultMeta}>검색 시간: {searchTime}</div>
            </div>

            <div className="verification-filters" style={styles.filters}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  value={sourceFilter}
                  onChange={(event) => handleSourceFilterChange(event.target.value)}
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
                  <option value="relevance">연관도순</option>
                  <option value="latest">최신순</option>
                  <option value="reliabilityDesc">신뢰도 높은순</option>
                  <option value="reliabilityAsc">신뢰도 낮은순</option>
                </select>
              </div>
              <div style={{ fontSize: '13px', color: '#5f6368', cursor: 'pointer' }}>신뢰도 등급 안내 ⓘ</div>
            </div>

            {queryResultGroups.length === 0 || queryResultGroups.every((group) => group.items.length === 0) ? (
              <div style={styles.emptyState}>
                {apiStatus === 'error' ? apiError || '신뢰도 분석 결과를 불러오지 못했습니다.' : '표시할 검색 결과가 없습니다.'}
              </div>
            ) : queryResultGroups.map((group) => (
              <div key={group.key}>
                <div style={styles.resultGroupLabel(group.source)}>{group.label} · {SORT_LABELS[sortBy]}</div>
                {group.items.length === 0 ? (
                  <div style={styles.emptyState}>이 섹션에 표시할 결과가 없습니다.</div>
                ) : group.items.map((res, i) => (
                  <div className="verification-article-card" key={`${group.key}-${res.articleId ?? res.title ?? i}`} style={styles.articleCard} onClick={() => onArticleClick(res.articleId ?? i + 1, res)}>
                    <div className="verification-article-body" style={{ flex: 1, paddingRight: '40px' }}>
                      <div className="verification-article-meta" style={styles.articleMeta}>
                        <div style={styles.publisherLogo(res.color)}>
                          {res.logo}
                          {res.logoUrl && <img src={res.logoUrl} alt={`${res.pub} 로고`} style={styles.publisherLogoImage} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
                        </div>
                        <span style={styles.publisher}>{res.pub}</span>
                        <span style={styles.date}>{res.date}</span>
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
                    <div className="verification-card-divider" style={{ width: '1px', backgroundColor: '#f1f3f4', margin: '0 24px' }}></div>
                    <div className="verification-gauge" style={styles.gaugeContainer}>
                      <div className="verification-gauge-title" style={styles.gaugeTitle}>신뢰도 등급 ⓘ</div>
                      <div className="verification-gauge-arc" style={styles.gaugeArc(res.scoreColor)} aria-hidden="true">
                        <svg style={styles.gaugeArcSvg} viewBox="0 0 120 70">
                          <path style={styles.gaugeArcTrack} d="M 12 60 A 48 48 0 0 1 108 60" pathLength="100" />
                          <path style={styles.gaugeArcFill(res.scoreColor, res.gaugeFillPercent)} d="M 12 60 A 48 48 0 0 1 108 60" pathLength="100" />
                        </svg>
                      </div>
                      <div className="verification-gauge-score" style={styles.gaugeScore}>{res.scoreText}</div>
                      <div className="verification-gauge-sub" style={styles.gaugeSub}>{res.score}</div>
                      <div className="verification-gauge-hint" style={styles.gaugeHint}>{res.hint}</div>
                    </div>
                  </div>
                ))}
                {shouldShowPagination && (
                  <>
                    <div style={styles.pagination}>
                      <button
                        type="button"
                        style={styles.pageButton(false, currentResultPage === 1)}
                        onClick={() => setResultPage((page) => Math.max(1, page - 1))}
                        disabled={currentResultPage === 1}
                        aria-label="이전 결과 페이지"
                      >
                        이전
                      </button>
                      {pageNumbers.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          style={styles.pageButton(pageNumber === currentResultPage, false)}
                          onClick={() => setResultPage(pageNumber)}
                          aria-current={pageNumber === currentResultPage ? 'page' : undefined}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        type="button"
                        style={styles.pageButton(false, currentResultPage === resultTotalPages)}
                        onClick={() => setResultPage((page) => Math.min(resultTotalPages, page + 1))}
                        disabled={currentResultPage === resultTotalPages}
                        aria-label="다음 결과 페이지"
                      >
                        다음
                      </button>
                    </div>
                    <div style={styles.paginationMeta}>
                      {currentPageStartIndex + 1}-{Math.min(currentPageStartIndex + CHECK_RESULT_PAGE_SIZE, filteredApiResults.length)}번째 결과 표시
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="verification-disclaimer" style={styles.bottomDisclaimer}>
              <div className="verification-disclaimer-icon" style={{ width: '64px', height: '64px', backgroundColor: '#e8f0fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" fill="#1a73e8" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' }}>최종 판단은 사용자의 몫입니다</div>
                <div style={{ fontSize: '14px', color: '#5f6368', lineHeight: '1.5' }}>Cheat F/T는 출처의 신뢰도를 객관적으로 평가할 뿐, 정보의 진위 여부를 단정하지 않습니다.<br/>다양한 출처를 참고하여 스스로 판단해주세요.</div>
              </div>
              <button style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#0056d2', border: '1px solid #d2e3fc', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>신뢰도 등급 안내 보기 ⓘ</button>
            </div>
          </>
        ) : (
          <>
            <div className="verification-result-header" style={{ ...styles.resultHeader, borderBottom: 'none', paddingBottom: '0' }}>
              <div>
                <div style={styles.resultQuery}>최신 팩트체크</div>
                <div style={{ color: '#5f6368', marginTop: '8px' }}>
                  {isLatestLoading
                    ? '최신 팩트체크를 불러오는 중입니다.'
                    : latestResults.length
                      ? '최신 팩트체크입니다.'
                      : latestStatus === 'error'
                        ? '최신 팩트체크를 불러오지 못했습니다.'
                        : '최신 팩트체크 목록이 비어 있습니다.'}
                </div>
              </div>
            </div>
            <div className="verification-filters" style={styles.filters}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  value={sourceFilter}
                  onChange={(event) => handleSourceFilterChange(event.target.value)}
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
                  <option value="relevance">연관도순</option>
                  <option value="latest">최신순</option>
                  <option value="reliabilityDesc">신뢰도 높은순</option>
                  <option value="reliabilityAsc">신뢰도 낮은순</option>
                </select>
              </div>
              <div style={{ fontSize: '13px', color: '#5f6368', cursor: 'pointer' }}>신뢰도 등급 안내 ⓘ</div>
            </div>

            {displayResults.length === 0 ? (
              <div style={styles.emptyState}>
                최신 팩트체크 목록이 비어 있습니다.<br/>
                표시할 항목이 없습니다.
              </div>
            ) : displayResults.map((res, i) => (
              <div
                className="verification-article-card"
                key={res.articleId ?? res.title ?? i}
                style={styles.articleCard}
                onClick={() => onArticleClick(res.articleId ?? i + 1, res)}
              >
                <div className="verification-article-body" style={{ flex: 1, paddingRight: '40px' }}>
                  <div className="verification-article-meta" style={styles.articleMeta}>
                    <div style={styles.publisherLogo(res.color)}>
                      {res.logo}
                      {res.logoUrl && <img src={res.logoUrl} alt={`${res.pub} 로고`} style={styles.publisherLogoImage} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
                    </div>
                    <span style={styles.publisher}>{res.pub}</span>
                    <span style={styles.date}>{res.date}</span>
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
                <div className="verification-card-divider" style={{ width: '1px', backgroundColor: '#f1f3f4', margin: '0 24px' }}></div>
                <div className="verification-gauge" style={styles.gaugeContainer}>
                  <div className="verification-gauge-title" style={styles.gaugeTitle}>신뢰도 등급 ⓘ</div>
                  <div className="verification-gauge-arc" style={styles.gaugeArc(res.scoreColor)} aria-hidden="true">
                    <svg style={styles.gaugeArcSvg} viewBox="0 0 120 70">
                      <path style={styles.gaugeArcTrack} d="M 12 60 A 48 48 0 0 1 108 60" pathLength="100" />
                      <path style={styles.gaugeArcFill(res.scoreColor, res.gaugeFillPercent)} d="M 12 60 A 48 48 0 0 1 108 60" pathLength="100" />
                    </svg>
                  </div>
                  <div className="verification-gauge-score" style={styles.gaugeScore}>{res.scoreText}</div>
                  <div className="verification-gauge-sub" style={styles.gaugeSub}>{res.score}</div>
                  <div className="verification-gauge-hint" style={styles.gaugeHint}>{res.hint}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
