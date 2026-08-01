import { useMemo, useState } from 'react';
import { recommendKeywords, runAnalysis } from '../../services/cheatftApi.js';
import { getPressLabel, getPressLogoUrl, getPressReliability, recordObservedPress } from '../../utils/press.js';
import { getReliabilityLabel, normalizeReliabilityScoreValue } from '../../utils/reliability.js';
import { cleanDisplayText } from '../../utils/text.js';

const SCORE_COLORS = {
  high: '#34a853',
  normal: '#fbbc04',
  low: '#ea4335',
};

function clampScore(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 0;
  return Math.max(0, Math.min(100, numberValue));
}

function formatCount(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function formatReliability(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue.toFixed(1) : '0.0';
}

function getReliabilityTone(score) {
  if (score >= 70) {
    return {
      label: '높음',
      color: SCORE_COLORS.high,
      title: '교차 확인 가능한 출처 비중이 높습니다.',
      desc: '다만 개별 기사 원문과 반박 관점까지 함께 확인하면 더 안정적으로 판단할 수 있습니다.',
    };
  }

  if (score >= 45) {
    return {
      label: '보통',
      color: SCORE_COLORS.normal,
      title: '일부 근거는 확인되지만 추가 검토가 필요합니다.',
      desc: '출처가 다른 기사와 반박 기사까지 함께 비교해보세요.',
    };
  }

  return {
    label: '주의',
    color: SCORE_COLORS.low,
    title: '출처와 근거를 더 꼼꼼히 확인해야 합니다.',
    desc: '단일 기사나 자극적인 표현만으로 결론을 내리지 않는 것이 좋습니다.',
  };
}

function normalizeReliabilityBadge(value, fallbackBadge = '보통') {
  const label = cleanDisplayText(value, '');
  if (label === '높음' || label === '보통' || label === '주의') return label;
  if (label === '낮음' || label === '반박' || label === '부정') return '주의';
  if (label === '중도' || label === '중립') return '보통';
  if (label === '긍정') return '높음';
  return fallbackBadge;
}

function getArticleReliabilityBadge(article, pressValue, fallbackBadge) {
  const scoreValue = normalizeReliabilityScoreValue(
    article.reliabilityScore,
    article.reliability,
    article.trustScore,
    article.credibilityScore,
    article.score
  );

  if (scoreValue !== null) return getReliabilityLabel(scoreValue);

  const explicitLabel = normalizeReliabilityBadge(article.reliabilityLabel || article.credibilityLabel, '');
  if (explicitLabel) return explicitLabel;

  const pressReliability = getPressReliability(pressValue);
  if (pressReliability.reliabilityLabel) return pressReliability.reliabilityLabel;

  const stance = cleanDisplayText(article.stance, '');
  return normalizeReliabilityBadge(stance, fallbackBadge);
}

function mapAnalysisArticle(article, index, fallbackBadge = '보통') {
  const pressValue = article.press ?? article.pressName ?? article.publisher ?? article.mediaName;
  recordObservedPress(pressValue, article.pressName ?? article.publisher ?? article.mediaName);

  const pressLabel = getPressLabel(pressValue);
  const description = cleanDisplayText(article.summary || article.description || article.content, '');
  const date = cleanDisplayText(article.publishedAt || article.createdAt || article.date || article.pubDate, '');
  const url = cleanDisplayText(article.url || article.link || article.originalLink || article.originallink, '');

  return {
    id: article.articleId ?? article.id ?? index,
    logo: ['#1a2b49', '#1a73e8', '#e65100', '#00c4b4'][index % 4],
    logoText: String(pressLabel || '출처').slice(0, 4),
    logoUrl: getPressLogoUrl(pressValue),
    press: pressLabel,
    title: cleanDisplayText(article.title, '제목 없음'),
    desc: description,
    date,
    url,
    badge: getArticleReliabilityBadge(article, pressValue, fallbackBadge),
  };
}

function Icon({ type, size = 20 }) {
  const commonProps = {
    width: size,
    height: size,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
  };

  if (type === 'search') {
    return (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }

  if (type === 'play') {
    return (
      <svg {...commonProps}>
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  }

  if (type === 'file') {
    return (
      <svg {...commonProps}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    );
  }

  if (type === 'building') {
    return (
      <svg {...commonProps}>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 9h.01" />
        <path d="M15 9h.01" />
      </svg>
    );
  }

  if (type === 'check') {
    return (
      <svg {...commonProps}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M12 20h.01" />
      <path d="M12 4v12" />
    </svg>
  );
}

export default function AlgoView({ onAuthExpired }) {
  const [activeTab, setActiveTab] = useState('related');
  const [question, setQuestion] = useState('');
  const [keyword, setKeyword] = useState('');
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [period, setPeriod] = useState(1);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('idle');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [guideFocus, setGuideFocus] = useState('question');
  const [completedAt, setCompletedAt] = useState('');

  const suggestKeywords = () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setApiError('키워드를 추천받을 질문을 먼저 입력해주세요.');
      setGuideFocus('question');
      return;
    }

    setApiError('');
    setIsSuggesting(true);

    recommendKeywords(trimmedQuestion)
      .then((data) => {
        const nextSuggestions = Array.isArray(data?.keywords)
          ? data.keywords.map((item) => cleanDisplayText(item, '').trim()).filter(Boolean)
          : [];

        setSuggestedKeywords(nextSuggestions);
        setKeyword('');
        setGuideFocus(nextSuggestions.length > 0 ? 'keywords' : 'question');

        if (nextSuggestions.length === 0) {
          setApiError('추천된 키워드가 없습니다. 질문을 조금 더 구체적으로 입력해주세요.');
        }
      })
      .catch((error) => {
        const isAuthError = error.status === 401 || error.status === 403;
        const message = isAuthError
          ? '로그인이 만료되었거나 인증이 필요합니다. 다시 로그인한 뒤 추천해주세요.'
          : error.message || '키워드를 추천받지 못했습니다.';
        setApiError(message);
        setSuggestedKeywords([]);
        setGuideFocus('question');
        if (isAuthError && onAuthExpired) {
          onAuthExpired();
        }
      })
      .finally(() => setIsSuggesting(false));
  };

  const analyze = (nextKeyword = keyword) => {
    const trimmedKeyword = nextKeyword.trim();
    if (!trimmedKeyword) {
      setApiError('분석할 키워드를 먼저 선택해주세요.');
      setGuideFocus('keywords');
      return;
    }

    setKeyword(trimmedKeyword);
    setGuideFocus('question');
    setIsLoading(true);
    setApiError('');
    setAnalysisStatus('loading');
    setCompletedAt('');

    runAnalysis({ keyword: trimmedKeyword, period, limit: 10 })
      .then((data) => {
        setAnalysisData(data || {});
        setAnalysisStatus('done');
        setCompletedAt(new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }));
      })
      .catch((error) => {
        const isAuthError = error.status === 401 || error.status === 403;
        const message = isAuthError
          ? '로그인이 만료되었거나 인증이 필요합니다. 다시 로그인한 뒤 분석해주세요.'
          : error.message || '분석 결과를 불러오지 못했습니다.';
        setApiError(message);
        setAnalysisData(null);
        setAnalysisStatus('error');
        if (isAuthError && onAuthExpired) {
          onAuthExpired();
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleQuestionKeyDown = (event) => {
    if (event.nativeEvent?.isComposing) return;
    if (event.key !== 'Enter' || event.shiftKey) return;

    event.preventDefault();
    suggestKeywords();
  };

  const styles = {
    container: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif', color: '#202124', padding: '40px', display: 'flex', gap: '32px', maxWidth: '1440px', margin: '0 auto' },
    sidebar: { width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' },
    card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e0e0e0' },
    focusPanel: (isActive) => ({
      padding: '16px',
      borderRadius: '8px',
      border: isActive ? '1px solid #0056d2' : '1px solid #e8eaed',
      backgroundColor: isActive ? '#f7faff' : '#ffffff',
      boxShadow: isActive ? '0 0 0 3px rgba(0, 86, 210, 0.12)' : 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
    }),
    cardTitle: { fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
    cardDesc: { fontSize: '13px', color: '#5f6368', marginBottom: '16px', lineHeight: '1.5' },
    questionInput: { width: '100%', minHeight: '108px', padding: '14px 16px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px', boxSizing: 'border-box', outline: 'none', resize: 'vertical' },
    primaryBtn: { width: '100%', padding: '12px', backgroundColor: '#0056d2', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' },
    buttonSpinner: { width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.45)', borderTopColor: '#ffffff', animation: 'spin 1s linear infinite', flexShrink: 0 },
    keywordPanel: { marginTop: '12px', marginBottom: '16px' },
    keywordTitle: { fontSize: '13px', fontWeight: 'bold', color: '#3c4043', marginBottom: '10px' },
    keywordChips: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    keywordChip: (isActive) => ({
      padding: '8px 11px',
      borderRadius: '999px',
      border: isActive ? '1px solid #0056d2' : '1px solid #dadce0',
      backgroundColor: isActive ? '#e8f0fe' : '#ffffff',
      color: isActive ? '#0056d2' : '#3c4043',
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
    }),
    selectRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' },
    select: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' },
    gaugeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' },
    gaugeContainer: { position: 'relative', width: '100%', textAlign: 'center', marginBottom: '18px' },
    gaugeDial: { position: 'relative', width: '100%', maxWidth: '260px', margin: '0 auto' },
    gaugeCenter: { marginTop: '-18px', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' },
    gaugeScore: (color) => ({ fontSize: '42px', lineHeight: 1, fontWeight: '900', color }),
    gaugeScoreSub: { fontSize: '16px', color: '#80868b', fontWeight: 'normal' },
    gaugeCaption: { marginTop: '8px', color: '#5f6368', fontSize: '13px', fontWeight: '700' },
    statusBox: (tone) => ({ backgroundColor: tone === 'high' ? '#e6f4ea' : tone === 'normal' ? '#fef7e0' : '#fce8e6', border: `1px solid ${tone === 'high' ? '#ceead6' : tone === 'normal' ? '#feefc3' : '#fad2cf'}`, padding: '16px', borderRadius: '8px', marginBottom: '24px' }),
    statusTitle: (color) => ({ fontSize: '14px', fontWeight: 'bold', color, marginBottom: '6px', lineHeight: '1.5' }),
    statusDesc: { fontSize: '13px', color: '#5f6368', lineHeight: '1.5' },
    legendBox: { backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px', fontSize: '12px', color: '#5f6368', lineHeight: '1.6' },
    metricRow: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px', marginBottom: '16px' },
    metricItem: { padding: '12px 10px', borderRadius: '8px', border: '1px solid #e8eaed', backgroundColor: '#ffffff', textAlign: 'left' },
    metricLabel: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#5f6368', marginBottom: '6px', whiteSpace: 'nowrap' },
    metricDot: (color) => ({ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }),
    metricValue: { fontSize: '18px', fontWeight: '800' },
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 },
    mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0', gap: '16px' },
    mainTitle: { fontSize: '28px', fontWeight: 'bold', color: '#202124', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: '1.3' },
    mainDesc: { fontSize: '15px', color: '#5f6368', lineHeight: '1.5' },
    metaInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 },
    metaText: { fontSize: '13px', color: '#80868b' },
    tabContainer: { display: 'flex', gap: '16px', marginBottom: '8px' },
    tabBtn: (isActive) => ({
      flex: 1,
      padding: '16px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: isActive ? '#ffffff' : '#f1f3f4',
      border: isActive ? '1px solid #0056d2' : '1px solid transparent',
      color: isActive ? '#0056d2' : '#5f6368',
      boxShadow: isActive ? '0 4px 12px rgba(0, 86, 210, 0.1)' : 'none',
    }),
    listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 8px', gap: '12px' },
    listTitle: { fontSize: '15px', fontWeight: 'bold', color: '#3c4043' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px', marginBottom: '24px' },
    newsCard: { width: '100%', boxSizing: 'border-box', backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', border: '1px solid #e0e0e0', display: 'flex', gap: '16px' },
    newsCardLink: { color: 'inherit', textDecoration: 'none', display: 'flex', minWidth: 0, width: '100%' },
    newsLogo: (bg) => ({ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold', flexShrink: 0, position: 'relative', overflow: 'hidden' }),
    newsLogoImage: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '50%' },
    newsContent: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    newsTitle: { fontSize: '16px', fontWeight: 'bold', color: '#202124', marginBottom: '8px', lineHeight: '1.4' },
    newsDesc: { fontSize: '13px', color: '#5f6368', marginBottom: '14px', lineHeight: '1.5' },
    newsFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', marginTop: 'auto' },
    newsMeta: { fontSize: '12px', color: '#80868b', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' },
    badge: (type) => {
      const colors = {
        긍정: { bg: '#e6f4ea', text: '#137333' },
        중도: { bg: '#fef7e0', text: '#b06000' },
        반박: { bg: '#fce8e6', text: '#c5221f' },
        높음: { bg: '#e6f4ea', text: '#137333' },
        보통: { bg: '#fef7e0', text: '#b06000' },
        주의: { bg: '#fce8e6', text: '#c5221f' },
        낮음: { bg: '#fce8e6', text: '#c5221f' },
      };
      const color = colors[type] || colors['보통'];
      return { padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: color.bg, color: color.text, whiteSpace: 'nowrap' };
    },
    sourceNotice: (source) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 'bold',
      color: source === 'api' ? '#174ea6' : source === 'loading' ? '#80868b' : source === 'error' ? '#c5221f' : '#5f6368',
      backgroundColor: source === 'api' ? '#e8f0fe' : source === 'error' ? '#fce8e6' : '#f8f9fa',
      border: source === 'api' ? '1px solid #d2e3fc' : source === 'error' ? '1px solid #fad2cf' : '1px solid #e0e0e0',
    }),
    emptyState: { gridColumn: '1 / -1', padding: '40px 24px', borderRadius: '8px', border: '1px dashed #dadce0', backgroundColor: '#fafbfc', color: '#5f6368', textAlign: 'center', lineHeight: '1.6' },
    bottomLayout: { display: 'flex', alignItems: 'flex-start', gap: '24px', marginTop: '0' },
    insightBox: { flex: 1.5, backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d2e3fc', padding: '28px', boxShadow: '0 8px 24px rgba(26,115,232,0.06)' },
    insightTitle: { fontSize: '20px', fontWeight: '800', color: '#202124', marginBottom: '16px' },
    insightList: { margin: 0, paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' },
    insightItem: { display: 'flex', gap: '12px', fontSize: '14px', color: '#3c4043', lineHeight: '1.5', alignItems: 'flex-start' },
    summaryBox: { flex: 1, alignSelf: 'flex-start', backgroundColor: '#f0f4fd', borderRadius: '12px', border: '1px solid #d2e3fc', padding: '24px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', gap: '12px' },
    statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: 0 },
    statLabel: { fontSize: '13px', color: '#5f6368', textAlign: 'center' },
    statIcon: { width: '32px', height: '32px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', color: '#1a73e8' },
    statValue: { fontSize: '20px', fontWeight: 'bold', color: '#1a73e8' },
    footer: { marginTop: '16px', padding: '20px 24px', backgroundColor: '#f1f3f4', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px', color: '#5f6368', fontSize: '13px', lineHeight: '1.5' },
    loadingOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(32, 33, 36, 0.36)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' },
    loadingDialog: { width: 'min(420px, 100%)', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d2e3fc', padding: '28px', boxShadow: '0 20px 60px rgba(32, 33, 36, 0.22)', textAlign: 'center' },
    loadingSpinner: { width: '42px', height: '42px', borderRadius: '50%', border: '4px solid #d2e3fc', borderTopColor: '#0056d2', margin: '0 auto 18px', animation: 'spin 1s linear infinite' },
    loadingTitle: { fontSize: '18px', fontWeight: '800', color: '#202124', marginBottom: '8px' },
    loadingDesc: { fontSize: '14px', color: '#5f6368', lineHeight: '1.6' },
  };

  const hasApiAnalysis = analysisStatus === 'done';
  const bias = analysisData?.biasAnalysis ?? {};
  const positiveCount = formatCount(bias.positiveCount);
  const neutralCount = formatCount(bias.neutralCount);
  const negativeCount = formatCount(bias.negativeCount);
  const score = clampScore(bias.biasScore);
  const tone = getReliabilityTone(score);
  const toneKey = score >= 70 ? 'high' : score >= 45 ? 'normal' : 'low';
  const gaugeRotation = -90 + score * 1.8;
  const displayKeyword = hasApiAnalysis ? analysisData?.keyword || keyword : '';

  const displayRelatedList = useMemo(() => {
    if (!hasApiAnalysis) return [];
    return Array.isArray(analysisData?.relatedArticles)
      ? analysisData.relatedArticles.map((article, index) => mapAnalysisArticle(article, index, '높음'))
      : [];
  }, [analysisData, hasApiAnalysis]);

  const displayCounterList = useMemo(() => {
    if (!hasApiAnalysis) return [];
    return Array.isArray(analysisData?.counterArticles)
      ? analysisData.counterArticles.map((article, index) => mapAnalysisArticle(article, index, '주의'))
      : [];
  }, [analysisData, hasApiAnalysis]);

  const displayInsights = hasApiAnalysis && Array.isArray(analysisData?.insights)
    ? analysisData.insights.map((insight) => cleanDisplayText(insight, '')).filter(Boolean)
    : [];

  const summaryStats = hasApiAnalysis ? {
    collectedArticles: formatCount(analysisData?.summaryStats?.collectedArticles),
    pressCount: formatCount(analysisData?.summaryStats?.pressCount),
    averageReliability: formatReliability(analysisData?.summaryStats?.averageReliability),
  } : {
    collectedArticles: 0,
    pressCount: 0,
    averageReliability: '0.0',
  };

  const pagination = analysisData?.pagination;
  const activeList = activeTab === 'related' ? displayRelatedList : displayCounterList;
  const sourceState = analysisStatus === 'loading' ? 'loading' : hasApiAnalysis ? 'api' : analysisStatus === 'error' ? 'error' : 'idle';
  const sourceText = sourceState === 'api'
    ? '실제 분석 결과 표시 중'
    : sourceState === 'loading'
      ? '분석 결과 대기 중'
      : sourceState === 'error'
        ? '분석 요청 실패'
        : '분석 전';

  return (
    <div className="algo-page" style={styles.container}>
      {isLoading && (
        <div style={styles.loadingOverlay} role="status" aria-live="polite">
          <div style={styles.loadingDialog}>
            <div className="loading-spinner" style={styles.loadingSpinner} aria-hidden="true" />
            <div style={styles.loadingTitle}>기사 수집과 신뢰도 분석을 진행 중입니다</div>
            <div style={styles.loadingDesc}>최대 10건의 관련 뉴스와 반박 기사를 분류하고 인사이트를 정리하고 있습니다. 잠시만 기다려주세요.</div>
          </div>
        </div>
      )}
      <div className="algo-sidebar" style={styles.sidebar}>
        <div style={styles.card}>
          <div style={styles.focusPanel(guideFocus === 'question')}>
            <div style={styles.cardTitle}>질문하기 <span style={{ color: '#80868b', fontSize: '14px' }}>ⓘ</span></div>
            <div style={styles.cardDesc}>분석하고 싶은 내용을 먼저 질문하면, 아래에 검색할 키워드를 제안합니다.</div>
            <textarea
              style={styles.questionInput}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onFocus={() => setGuideFocus('question')}
              onKeyDown={handleQuestionKeyDown}
              placeholder="분석하고 싶은 질문을 입력하세요."
              aria-label="분석 질문"
              disabled={isSuggesting || isLoading}
            />
            <button type="button" style={styles.primaryBtn} onClick={suggestKeywords} disabled={isSuggesting || isLoading}>
              {isSuggesting ? <span style={styles.buttonSpinner} aria-hidden="true" /> : <Icon type="search" size={18} />}
              {isSuggesting ? '추천 중' : '키워드 추천'}
            </button>
          </div>
          <div style={styles.keywordPanel}>
            <div style={styles.focusPanel(guideFocus === 'keywords')}>
              <div style={styles.keywordTitle}>추천 키워드</div>
              <div style={styles.keywordChips}>
                {suggestedKeywords.length === 0 ? (
                  <span style={{ fontSize: '13px', color: '#80868b' }}>질문을 입력하면 키워드가 표시됩니다.</span>
                ) : suggestedKeywords.map((suggestedKeyword) => (
                  <button
                    type="button"
                    key={suggestedKeyword}
                    style={styles.keywordChip(keyword === suggestedKeyword)}
                    onClick={() => analyze(suggestedKeyword)}
                    disabled={isSuggesting || isLoading}
                  >
                    {suggestedKeyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.selectRow}>
            <span style={{ color: '#5f6368' }}>기간 설정</span>
            <select style={styles.select} value={period} onChange={(event) => setPeriod(Number(event.target.value))}>
              <option value={1}>최근 1개월</option>
              <option value={3}>최근 3개월</option>
              <option value={6}>최근 6개월</option>
            </select>
          </div>
          {apiError && <div className="form-error" role="alert" style={{ marginTop: '12px' }}>{apiError}</div>}
        </div>

        <div style={styles.card}>
          <div style={styles.gaugeHeader}>
            <div style={{ ...styles.cardTitle, margin: 0, fontSize: '16px', fontWeight: 'bold' }}>정보 신뢰도 분석 <span style={{ color: '#80868b', fontSize: '14px' }}>ⓘ</span></div>
            <div style={{ fontSize: '12px', color: '#80868b' }}>{hasApiAnalysis ? `최근 ${period}개월 기준` : '분석 대기'}</div>
          </div>

          <div style={styles.gaugeContainer}>
            <div style={styles.gaugeDial}>
              <svg viewBox="0 0 220 132" style={{ width: '100%', overflow: 'visible' }} aria-hidden="true">
                <path d="M 26 104 A 84 84 0 0 1 194 104" fill="none" stroke="#eef1f5" strokeWidth="18" strokeLinecap="round" />
                <path d="M 26 104 A 84 84 0 0 1 68 31" fill="none" stroke={SCORE_COLORS.low} strokeWidth="18" strokeLinecap="round" />
                <path d="M 68 31 A 84 84 0 0 1 152 31" fill="none" stroke={SCORE_COLORS.normal} strokeWidth="18" strokeLinecap="round" />
                <path d="M 152 31 A 84 84 0 0 1 194 104" fill="none" stroke={SCORE_COLORS.high} strokeWidth="18" strokeLinecap="round" />
                <g transform={`translate(110, 104) rotate(${gaugeRotation})`}>
                  <line x1="0" y1="0" x2="0" y2="-68" stroke="#202124" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="0" cy="0" r="8" fill="#202124" />
                </g>
              </svg>
            </div>
            <div style={styles.gaugeCenter}>
              <span style={styles.gaugeScore(tone.color)}>{score}</span>
              <span style={styles.gaugeScoreSub}>/ 100</span>
            </div>
            <div style={styles.gaugeCaption}>종합 신뢰도 · {tone.label}</div>
          </div>

          <div style={styles.statusBox(toneKey)}>
            <div style={styles.statusTitle(tone.color)}>{tone.title}</div>
            <div style={styles.statusDesc}>{hasApiAnalysis ? tone.desc : '키워드를 선택해 실제 백엔드 분석 결과를 불러오면 이 영역이 갱신됩니다.'}</div>
          </div>

          <div style={styles.metricRow}>
            <div style={styles.metricItem}>
              <div style={styles.metricLabel}><span style={styles.metricDot(SCORE_COLORS.high)} />높음</div>
              <div style={{ ...styles.metricValue, color: SCORE_COLORS.high }}>{positiveCount}건</div>
            </div>
            <div style={styles.metricItem}>
              <div style={styles.metricLabel}><span style={styles.metricDot(SCORE_COLORS.normal)} />보통</div>
              <div style={{ ...styles.metricValue, color: SCORE_COLORS.normal }}>{neutralCount}건</div>
            </div>
            <div style={styles.metricItem}>
              <div style={styles.metricLabel}><span style={styles.metricDot(SCORE_COLORS.low)} />주의</div>
              <div style={{ ...styles.metricValue, color: SCORE_COLORS.low }}>{negativeCount}건</div>
            </div>
          </div>

          <div style={styles.legendBox}>
            <strong style={{ display: 'block', marginBottom: '8px', color: '#3c4043' }}>분석 기준</strong>
            <div>서버가 반환한 분석 점수, 인사이트, 관련/반박 기사, 요약 통계를 그대로 반영합니다.</div>
          </div>
        </div>
      </div>

      <div className="algo-main" style={styles.mainContent}>
        <div>
          <div className="algo-main-header" style={styles.mainHeader}>
            <div>
              <div style={styles.mainTitle}>{displayKeyword ? `'${displayKeyword}' 분석 결과` : '신뢰도 분석'}</div>
              <div style={styles.mainDesc}>수집한 뉴스의 출처, 관점, 요약 통계를 실제 백엔드 분석 결과 기준으로 표시합니다.</div>
              <div style={{ marginTop: '12px' }}><span style={styles.sourceNotice(sourceState)}>{sourceText}</span></div>
            </div>
            <div className="algo-meta-info" style={styles.metaInfo}>
              {hasApiAnalysis && <span style={styles.metaText}>분석 ID: {analysisData?.analysisId}</span>}
              {completedAt && <span style={styles.metaText}>분석 완료: {completedAt}</span>}
              {pagination && <span style={styles.metaText}>총 {pagination.totalItems ?? 0}건</span>}
            </div>
          </div>
        </div>

        <div className="algo-bottom-layout" style={styles.bottomLayout}>
          <div className="algo-insight-box" style={styles.insightBox}>
            <div style={styles.insightTitle}>AI 주요 인사이트</div>
            <ul style={styles.insightList}>
              {analysisStatus === 'idle' ? (
                <li style={styles.insightItem}><span style={{ color: '#80868b', fontSize: '16px' }}>•</span> 키워드를 선택하면 실제 분석 인사이트가 표시됩니다.</li>
              ) : displayInsights.length === 0 ? (
                <li style={styles.insightItem}><span style={{ color: '#80868b', fontSize: '16px' }}>•</span> 백엔드에서 받은 인사이트가 없습니다.</li>
              ) : displayInsights.map((insight, index) => (
                <li key={`${insight}-${index}`} style={styles.insightItem}><span style={{ color: '#34a853', fontSize: '16px' }}>✓</span> {insight}</li>
              ))}
            </ul>
          </div>

          <div className="algo-summary-box" style={styles.summaryBox}>
            <div style={{ ...styles.insightTitle, color: '#1a73e8' }}>신뢰도 분석 요약</div>
            <div className="algo-summary-row" style={styles.summaryRow}>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>수집 기사 수</div>
                <span style={styles.statIcon}><Icon type="file" size={18} /></span>
                <span style={styles.statValue}>{summaryStats.collectedArticles}<span style={{ fontSize: '14px', color: '#202124', fontWeight: 'normal' }}>건</span></span>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>언론사 수</div>
                <span style={styles.statIcon}><Icon type="building" size={18} /></span>
                <span style={styles.statValue}>{summaryStats.pressCount}<span style={{ fontSize: '14px', color: '#202124', fontWeight: 'normal' }}>개</span></span>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>평균 신뢰도</div>
                <span style={{ ...styles.statIcon, color: '#34a853' }}><Icon type="check" size={18} /></span>
                <span style={{ ...styles.statValue, color: '#202124' }}>{summaryStats.averageReliability} <span style={{ fontSize: '14px', color: '#80868b', fontWeight: 'normal' }}>/ 5</span></span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="algo-list-header" style={styles.listHeader}>
            <div style={{ ...styles.listTitle, fontSize: '18px' }}>분석 기사</div>
            {hasApiAnalysis && <div style={{ fontSize: '13px', color: '#80868b' }}>총 {pagination?.totalItems ?? activeList.length}건 수집</div>}
          </div>

          <div className="algo-tabs" style={styles.tabContainer}>
            <button type="button" style={styles.tabBtn(activeTab === 'related')} onClick={() => setActiveTab('related')}>
              <Icon type="file" size={20} />
              관련 뉴스 ({displayRelatedList.length})
            </button>
            <button type="button" style={styles.tabBtn(activeTab === 'unrelated')} onClick={() => setActiveTab('unrelated')}>
              <Icon type="check" size={20} />
              반박 기사 ({displayCounterList.length})
            </button>
          </div>

          <div style={{ ...styles.listTitle, padding: '0 8px', marginBottom: '16px' }}>
            {activeTab === 'related' ? '해당 주장/의견을 지지하거나 다루는 기사' : '다른 관점에서 반박하거나 보완하는 기사'}
          </div>

          <div className="algo-news-grid" style={styles.grid}>
            {analysisStatus === 'idle' ? (
              <div style={styles.emptyState}>
                키워드 추천 후 분석을 실행하면 실제 수집 기사 목록이 표시됩니다.
              </div>
            ) : activeList.length === 0 ? (
              <div style={styles.emptyState}>
                {activeTab === 'related' ? '관련 뉴스' : '반박 기사'} 목록이 비어 있습니다.
              </div>
            ) : activeList.map((item) => {
              const card = (
                <div className="algo-news-card" style={{ ...styles.newsCard, cursor: item.url ? 'pointer' : 'default' }}>
                  <div style={{ ...styles.newsLogo(item.logo), whiteSpace: 'pre-wrap', textAlign: 'center', lineHeight: '1.2' }}>
                    {item.logoText}
                    {item.logoUrl && <img src={item.logoUrl} alt={`${item.logoText} 로고`} style={styles.newsLogoImage} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
                  </div>
                  <div style={styles.newsContent}>
                    <div style={styles.newsTitle}>{item.title}</div>
                    {item.desc && <div style={styles.newsDesc}>{item.desc}</div>}
                    <div className="algo-news-footer" style={styles.newsFooter}>
                      <div style={styles.newsMeta}>
                        <span>{item.press}</span>
                        {item.date && (
                          <>
                            <span>|</span>
                            <span>{item.date}</span>
                          </>
                        )}
                      </div>
                      <div style={styles.badge(item.badge)}>{item.badge}</div>
                    </div>
                  </div>
                </div>
              );

              return item.url ? (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" style={styles.newsCardLink} aria-label={`${item.title} 원문 열기`}>
                  {card}
                </a>
              ) : (
                <div key={item.id} style={styles.newsCardLink}>
                  {card}
                </div>
              );
            })}
          </div>
        </div>

        <div className="algo-footer" style={styles.footer}>
          <Icon type="check" size={20} />
          <div>
            <div>Cheat F/T는 분석 결과를 제공하며, 최종 판단은 사용자가 원문 출처와 반박 관점을 함께 확인한 뒤 내립니다.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
