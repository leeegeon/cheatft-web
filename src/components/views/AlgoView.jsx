import { useState } from 'react';
import { runAnalysis } from '../../services/cheatftApi.js';
import { getPressLabel, getPressLogoUrl, recordObservedPress } from '../../utils/press.js';
import { cleanDisplayText } from '../../utils/text.js';

function mapAnalysisArticle(article, index, fallbackBadge = '보통') {
  const pressValue = article.press ?? article.pressName ?? article.publisher ?? article.mediaName;
  recordObservedPress(pressValue, article.pressName ?? article.publisher ?? article.mediaName);
  const pressLabel = getPressLabel(pressValue);

  return {
    id: article.articleId ?? index,
    logo: ['#1a2b49', '#1a73e8', '#e65100', '#00c4b4'][index % 4],
    logoText: String(pressLabel).slice(0, 4),
    logoUrl: getPressLogoUrl(pressValue),
    title: cleanDisplayText(article.title, '제목 없음'),
    desc: cleanDisplayText(article.summary || article.description, '백엔드 분석 결과에서 반환된 기사입니다.'),
    date: article.publishedAt || article.createdAt || article.date || '분석 결과',
    views: '-',
    badge: article.reliabilityLabel || article.reliability || fallbackBadge,
  };
}

function buildKeywordSuggestions(question) {
  const normalizedQuestion = cleanDisplayText(question, '')
    .replace(/[?!.,/#!$%^&*;:{}=\-_`~()[\]"'<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalizedQuestion) return [];

  const stopWords = new Set(['그리고', '하지만', '관련', '대한', '으로', '에서', '에게', '까지', '부터', '하면', '인가', '정말', '진짜']);
  const words = normalizedQuestion
    .split(' ')
    .map((word) => word.trim())
    .filter((word) => word.length >= 2 && !stopWords.has(word));

  const suggestions = [
    normalizedQuestion,
    words.slice(0, 3).join(' '),
    words.slice(0, 2).join(' '),
    words[0] ? `${words[0]} 팩트체크` : '',
    words[1] ? `${words[1]} 신뢰도` : '',
    words.length > 2 ? `${words[0]} ${words[words.length - 1]}` : '',
  ];

  return [...new Set(suggestions.filter(Boolean))].slice(0, 5);
}

export default function AlgoView() {
  const [activeTab, setActiveTab] = useState('related');
  const [question, setQuestion] = useState('백신 부작용 사망자 급증?');
  const [keyword, setKeyword] = useState('백신 부작용 사망자 급증');
  const [suggestedKeywords, setSuggestedKeywords] = useState(() => buildKeywordSuggestions('백신 부작용 사망자 급증?'));
  const [period, setPeriod] = useState(1);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('fallback');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const suggestKeywords = () => {
    setApiError('');
    setSuggestedKeywords(buildKeywordSuggestions(question));
  };

  const analyze = (nextKeyword = keyword) => {
    const trimmedKeyword = nextKeyword.trim();
    if (!trimmedKeyword) return;

    setKeyword(trimmedKeyword);
    setIsLoading(true);
    setApiError('');
    setAnalysisStatus('loading');
    runAnalysis({ keyword: trimmedKeyword, period, limit: 4 })
      .then((data) => {
        setAnalysisData(data || {});
        setAnalysisStatus('done');
      })
      .catch((error) => {
        if (error.code !== 'API_NOT_CONFIGURED') {
          setApiError(error.message || '분석 결과를 불러오지 못했습니다.');
        }
        setAnalysisData(null);
        setAnalysisStatus('fallback');
      })
      .finally(() => setIsLoading(false));
  };

  const styles = {
    container: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif', color: '#202124', padding: '40px', display: 'flex', gap: '32px', maxWidth: '1440px', margin: '0 auto' },
    
    // Sidebar Styles
    sidebar: { width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' },
    card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e0e0e0' },
    cardTitle: { fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
    cardDesc: { fontSize: '13px', color: '#5f6368', marginBottom: '16px' },
    inputLabel: { display: 'block', fontSize: '14px', color: '#3c4043', marginBottom: '8px', fontWeight: 'bold' },
    input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' },
    questionInput: { width: '100%', minHeight: '108px', padding: '14px 16px', borderRadius: '12px', border: '1px solid #dadce0', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px', boxSizing: 'border-box', outline: 'none', resize: 'vertical' },
    primaryBtn: { width: '100%', padding: '12px', backgroundColor: '#0056d2', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' },
    keywordPanel: { paddingTop: '8px', borderTop: '1px solid #f1f3f4', marginBottom: '16px' },
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
    select: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '13px', outline: 'none' },
    
    // Gauge Chart Styles
    gaugeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    gaugeContainer: { position: 'relative', width: '100%', textAlign: 'center', marginBottom: '24px' },
    gaugeScore: { marginTop: '8px', fontSize: '32px', fontWeight: '900', color: '#e65100' },
    gaugeScoreSub: { fontSize: '16px', color: '#80868b', fontWeight: 'normal' },
    warningBox: { backgroundColor: '#fff3e0', border: '1px solid #ffe0b2', padding: '16px', borderRadius: '12px', marginBottom: '24px' },
    warningTitle: { fontSize: '14px', fontWeight: 'bold', color: '#e65100', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' },
    warningDesc: { fontSize: '13px', color: '#ef6c00', textAlign: 'center' },
    legendBox: { backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '12px', fontSize: '12px', color: '#5f6368', lineHeight: '1.6', marginBottom: '16px' },
    outlineBtn: { width: '100%', padding: '12px', backgroundColor: '#ffffff', color: '#0056d2', border: '1px solid #d2e3fc', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },

    // Main Content Styles
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' },
    mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' },
    mainTitle: { fontSize: '28px', fontWeight: 'bold', color: '#202124', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
    mainDesc: { fontSize: '15px', color: '#5f6368' },
    metaInfo: { display: 'flex', alignItems: 'center', gap: '16px' },
    metaText: { fontSize: '13px', color: '#80868b' },
    
    // Tabs
    tabContainer: { display: 'flex', gap: '16px', marginBottom: '8px' },
    tabBtn: (isActive) => ({
      flex: 1, padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
      backgroundColor: isActive ? '#ffffff' : '#f1f3f4',
      border: isActive ? '1px solid #0056d2' : '1px solid transparent',
      color: isActive ? '#0056d2' : '#5f6368',
      boxShadow: isActive ? '0 4px 12px rgba(0, 86, 210, 0.1)' : 'none'
    }),
    
    // List Area
    listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 8px' },
    listTitle: { fontSize: '15px', fontWeight: 'bold', color: '#3c4043' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' },
    newsCard: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e0e0e0', display: 'flex', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', ':hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } },
    newsLogo: (bg) => ({ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold', flexShrink: 0, position: 'relative', overflow: 'hidden' }),
    newsLogoImage: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '50%' },
    newsContent: { flex: 1, display: 'flex', flexDirection: 'column' },
    newsTitle: { fontSize: '16px', fontWeight: 'bold', color: '#202124', marginBottom: '8px', lineHeight: '1.4' },
    newsDesc: { fontSize: '13px', color: '#5f6368', marginBottom: '16px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    newsFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' },
    newsMeta: { fontSize: '12px', color: '#80868b', display: 'flex', alignItems: 'center', gap: '8px' },
    badge: (type) => {
      const colors = { '높음': { bg: '#e6f4ea', text: '#137333' }, '보통': { bg: '#e8f0fe', text: '#1a73e8' }, '주의': { bg: '#fef7e0', text: '#b06000' }, '낮음': { bg: '#fce8e6', text: '#c5221f' }, '반박': { bg: '#fce8e6', text: '#c5221f' } };
      const color = colors[type] || colors['보통'];
      return { padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: color.bg, color: color.text };
    },
    moreBtn: { width: '100%', padding: '16px', backgroundColor: '#ffffff', border: '1px solid #dadce0', borderRadius: '12px', color: '#0056d2', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', textAlign: 'center' },
    sourceNotice: (source) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 'bold',
      color: source === 'api' ? '#174ea6' : source === 'loading' ? '#80868b' : '#5f6368',
      backgroundColor: source === 'api' ? '#e8f0fe' : '#f8f9fa',
      border: source === 'api' ? '1px solid #d2e3fc' : '1px solid #e0e0e0',
    }),
    emptyState: { gridColumn: '1 / -1', padding: '40px 24px', borderRadius: '12px', border: '1px dashed #dadce0', backgroundColor: '#fafbfc', color: '#5f6368', textAlign: 'center', lineHeight: '1.6' },

    // Bottom Insight
    bottomLayout: { display: 'flex', alignItems: 'flex-start', gap: '24px', marginTop: '0' },
    insightBox: { flex: 1.5, backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #d2e3fc', padding: '28px', boxShadow: '0 8px 24px rgba(26,115,232,0.06)' },
    insightTitle: { fontSize: '20px', fontWeight: '800', color: '#202124', marginBottom: '16px' },
    insightList: { margin: 0, paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' },
    insightItem: { display: 'flex', gap: '12px', fontSize: '14px', color: '#3c4043', lineHeight: '1.5', alignItems: 'flex-start' },
    
    summaryBox: { flex: 1, alignSelf: 'flex-start', backgroundColor: '#f0f4fd', borderRadius: '12px', border: '1px solid #d2e3fc', padding: '24px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between' },
    statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
    statLabel: { fontSize: '13px', color: '#5f6368' },
    statValue: { fontSize: '20px', fontWeight: 'bold', color: '#1a73e8' },
    
    footer: { marginTop: '40px', padding: '24px', backgroundColor: '#f1f3f4', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }
  };

  const relatedList = [
    { id: 1, logo: '#1a2b49', logoText: 'KBS', title: '질병청 "백신 접종 후 사망 사례, 인과성 확인 안돼"', desc: '질병관리청은 최근 제기된 백신 접종 후 사망 급증 주장에 대해 현재까지 인과성이 확인된 사례는 없다고 밝혔습니다.', date: '2024.05.20', views: '12,345', badge: '높음' },
    { id: 2, logo: '#1a73e8', logoText: '연합뉴스', title: '전문가 "백신과 사망 간 연관성 매우 낮아"', desc: '의료 전문가들은 백신 접종과 사망 간의 연관성을 입증할 과학적 근거가 부족하다고 설명했습니다.', date: '2024.05.20', views: '9,876', badge: '높음' },
    { id: 3, logo: '#e65100', logoText: 'n', title: '일부 지자체서 백신 접종 후 사망 신고 잇따라', desc: '전국 일부 지역에서 백신 접종 후 사망 신고가 잇따르고 있어 당국이 조사에 나섰습니다.', date: '2024.05.19', views: '8,234', badge: '보통' },
    { id: 4, logo: '#ffffff', logoBorder: '#1a73e8', logoText: 'OO일보', title: '백신 부작용으로 인한 사망자 수 급증 추세', desc: '백신 접종 이후 예상치 못한 사망 사례가 빠르게 늘어나고 있다는 주장이 제기되고 있습니다.', date: '2024.05.19', views: '6,543', badge: '주의' },
  ];

  const unrelatedList = [
    { id: 1, logo: '#3c4043', logoText: '서울경제', title: '"백신 부작용 사망 급증" 주장은 사실과 달라', desc: '통계청 자료에 따르면 백신 접종 이후 사망자 수는 과거와 비교해 유의미한 증가가 없는 것으로 나타났습니다.', date: '2024.05.20', views: '10,321', badge: '반박' },
    { id: 2, logo: '#00c4b4', logoText: 'YTN', title: '전문가 "백신보다 기저질환이 사망 원인"', desc: '전문가들은 백신 접종 후 사망 사례 대부분이 고령층의 기저질환 악화로 인한 것이라고 설명합니다.', date: '2024.05.20', views: '8,765', badge: '반박' },
    { id: 3, logo: '#34a853', logoText: '한겨레', title: '사망 신고=백신 부작용? "인과성" 입증 어려워', desc: '보건당국은 백신 접종과 사망 사이의 인과성을 입증하기 어렵다며 신중한 해석을 당부했습니다.', date: '2024.05.19', views: '7,654', badge: '반박' },
    { id: 4, logo: '#4285f4', logoText: '메디컬\n투데이', title: '국내외 연구 결과, 백신 안전성 이상 "문제 없어"', desc: '국내외 다수 연구에서 코로나19 백신의 안전성이 지속적으로 확인되고 있습니다.', date: '2024.05.19', views: '6,789', badge: '반박' },
  ];

  const hasApiAnalysis = analysisStatus === 'done';
  const bias = analysisData?.biasAnalysis;
  const displayKeyword = analysisData?.keyword || `"${keyword}"`;
  const displayRelatedList = hasApiAnalysis
    ? (Array.isArray(analysisData?.relatedArticles) ? analysisData.relatedArticles.map((article, index) => mapAnalysisArticle(article, index, '높음')) : [])
    : relatedList;
  const displayCounterList = hasApiAnalysis
    ? (Array.isArray(analysisData?.counterArticles) ? analysisData.counterArticles.map((article, index) => mapAnalysisArticle(article, index, '반박')) : [])
    : unrelatedList;
  const displayInsights = hasApiAnalysis
    ? (Array.isArray(analysisData?.insights) ? analysisData.insights : [])
    : [
        '관련 뉴스 중 신뢰도 보통 이상으로 분류된 기사가 다수를 차지합니다.',
        "반박 기사는 주로 '인과성 부족'과 '기저질환 영향'을 근거로 반박하고 있습니다.",
        '다양한 관점을 확인하여 균형 잡힌 시각을 가지는 것이 중요합니다.',
      ];
  const summaryStats = hasApiAnalysis ? {
    collectedArticles: analysisData?.summaryStats?.collectedArticles ?? 0,
    pressCount: analysisData?.summaryStats?.pressCount ?? 0,
    averageReliability: analysisData?.summaryStats?.averageReliability ?? 0,
  } : {
    collectedArticles: 21,
    pressCount: 15,
    averageReliability: 3.2,
  };
  const activeList = activeTab === 'related' ? displayRelatedList : displayCounterList;
  const sourceState = analysisStatus === 'loading' ? 'loading' : hasApiAnalysis ? 'api' : 'fallback';
  const sourceText = sourceState === 'api'
    ? '백엔드 API 응답 표시 중'
    : sourceState === 'loading'
      ? '백엔드 API 응답 대기 중'
      : '프론트 목업 fallback 표시 중';

  return (
    <div style={styles.container}>
      {/* Left Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>질문하기 <span style={{color:'#80868b', fontSize:'14px'}}>ⓘ</span></div>
          <div style={styles.cardDesc}>분석하고 싶은 내용을 먼저 질문하면, 아래에 검색할 키워드를 제안합니다.</div>
          <textarea
            style={styles.questionInput}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                suggestKeywords();
              }
            }}
            placeholder="예: 백신 부작용으로 사망자가 급증했다는 주장이 사실인가요?"
            aria-label="분석 질문"
          />
          <button type="button" style={styles.primaryBtn} onClick={suggestKeywords}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            키워드 추천
          </button>
          <div style={styles.keywordPanel}>
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
                  disabled={isLoading}
                >
                  {suggestedKeyword}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.selectRow}>
            <span style={{color:'#5f6368'}}>기간 설정</span>
            <select style={styles.select} value={period} onChange={(event) => setPeriod(Number(event.target.value))}>
              <option value={1}>최근 1개월</option>
              <option value={3}>최근 3개월</option>
              <option value={6}>최근 6개월</option>
            </select>
          </div>
          {apiError && <div className="form-error" role="alert">{apiError}</div>}
        </div>

        <div style={styles.card}>
          <div style={styles.gaugeHeader}>
            <div style={{...styles.cardTitle, margin:0, fontSize:'16px', fontWeight:'bold'}}>정보 신뢰도 분석 <span style={{color:'#80868b', fontSize:'14px'}}>ⓘ</span></div>
            <div style={{fontSize:'12px', color:'#80868b'}}>최근 30일 기준</div>
          </div>
          
          <div style={styles.gaugeContainer}>
            <svg viewBox="0 0 200 120" style={{ width: '100%', maxWidth: '240px', overflow: 'visible' }}>
              {/* Background Arc */}
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f3f4" strokeWidth="16" strokeLinecap="round" />
              {/* Red Arc (Negative) */}
              <path d="M 140 30 A 80 80 0 0 1 180 100" fill="none" stroke="#ea4335" strokeWidth="16" strokeLinecap="round" />
              {/* Yellow Arc (Neutral) */}
              <path d="M 60 30 A 80 80 0 0 1 140 30" fill="none" stroke="#fbbc04" strokeWidth="16" strokeLinecap="round" />
              {/* Green Arc (Positive) */}
              <path d="M 20 100 A 80 80 0 0 1 60 30" fill="none" stroke="#34a853" strokeWidth="16" strokeLinecap="round" />
              
              {/* Labels on arcs */}
              <text x="30" y="60" fontSize="12" fill="#137333" fontWeight="bold" textAnchor="middle">높음</text>
              <text x="30" y="76" fontSize="12" fill="#137333" textAnchor="middle">{bias?.positiveCount ?? 10}건</text>
              
              <text x="100" y="20" fontSize="12" fill="#b06000" fontWeight="bold" textAnchor="middle">보통</text>
              <text x="100" y="36" fontSize="12" fill="#b06000" textAnchor="middle">{bias?.neutralCount ?? 2}건</text>
              
              <text x="170" y="60" fontSize="12" fill="#c5221f" fontWeight="bold" textAnchor="middle">낮음</text>
              <text x="170" y="76" fontSize="12" fill="#c5221f" textAnchor="middle">{bias?.negativeCount ?? 0}건</text>

              {/* Needle pointing to positive */}
              <g transform="translate(100, 100) rotate(-45)">
                 <line x1="0" y1="0" x2="0" y2="-65" stroke="#202124" strokeWidth="3" strokeLinecap="round" />
                 <circle cx="0" cy="0" r="6" fill="#202124" />
              </g>
            </svg>
            <div style={{marginTop: '-10px'}}>
              <div style={{fontSize: '13px', color: '#5f6368', fontWeight: 'bold'}}>신뢰도</div>
              <div style={styles.gaugeScore}>{bias?.biasScore ?? 80} <span style={styles.gaugeScoreSub}>/ 100</span></div>
            </div>
          </div>

          <div style={styles.warningBox}>
            <div style={styles.warningTitle}><span style={{fontSize:'16px'}}>!</span> 현재 분석된 정보는<br/>추가 확인이 필요할 수 있습니다.</div>
            <div style={styles.warningDesc}>원문 출처와 교차 근거를 함께 확인해보세요.</div>
          </div>

          <div style={styles.legendBox}>
            <strong style={{display:'block', marginBottom:'8px', color:'#3c4043'}}>신뢰도 분석 기준</strong>
            <ul style={{margin:0, paddingLeft:'16px', display:'flex', flexDirection:'column', gap:'4px'}}>
              <li><strong style={{color:'#34a853'}}>높음:</strong> 출처와 근거가 명확하고 교차 확인이 쉬운 내용</li>
              <li><strong style={{color:'#fbbc04'}}>보통:</strong> 근거는 있으나 추가 확인이 필요한 내용</li>
              <li><strong style={{color:'#ea4335'}}>낮음:</strong> 출처가 불분명하거나 검증 근거가 부족한 내용</li>
            </ul>
          </div>

          <button style={styles.outlineBtn}>신뢰도 분석 자세히 보기 ↗</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div>
          <div style={styles.mainHeader}>
             <div>
               <div style={styles.mainTitle}>{displayKeyword} 분석 결과 <span style={{color:'#80868b', fontSize:'18px', fontWeight:'normal'}}>ⓘ</span></div>
               <div style={styles.mainDesc}>수집한 뉴스의 출처와 근거를 바탕으로 신뢰도를 분석해드립니다.</div>
               <div style={{ marginTop: '12px' }}><span style={styles.sourceNotice(sourceState)}>{sourceText}</span></div>
             </div>
             <div style={styles.metaInfo}>
               <span style={styles.metaText}>검색 시간: 2024.05.20 14:30</span>
               <button style={{padding:'8px 16px', backgroundColor:'#ffffff', border:'1px solid #dadce0', borderRadius:'8px', color:'#0056d2', fontWeight:'bold', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'}}>
                 분석 안내 ↗
               </button>
             </div>
          </div>
        </div>

        <div style={styles.bottomLayout}>
          <div style={styles.insightBox}>
             <div style={styles.insightTitle}>AI 주요 인사이트</div>
             <ul style={styles.insightList}>
               {displayInsights.length === 0 ? (
                 <li style={styles.insightItem}><span style={{color:'#80868b', fontSize:'16px'}}>•</span> 백엔드에서 받은 인사이트가 없습니다.</li>
               ) : displayInsights.map((insight) => (
                 <li key={insight} style={styles.insightItem}><span style={{color:'#34a853', fontSize:'16px'}}>✓</span> {insight}</li>
               ))}
             </ul>
          </div>
          
          <div style={styles.summaryBox}>
             <div style={{...styles.insightTitle, color:'#1a73e8'}}>신뢰도 분석 요약</div>
             <div style={styles.summaryRow}>
               <div style={styles.statItem}>
                 <div style={styles.statLabel}>수집 기사 수</div>
                 <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{fontSize:'24px'}}>📄</span>
                    <span style={styles.statValue}>{summaryStats.collectedArticles}<span style={{fontSize:'14px', color:'#202124', fontWeight:'normal'}}>건</span></span>
                 </div>
               </div>
               <div style={styles.statItem}>
                 <div style={styles.statLabel}>언론사 수</div>
                 <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{fontSize:'24px'}}>🏢</span>
                    <span style={styles.statValue}>{summaryStats.pressCount}<span style={{fontSize:'14px', color:'#202124', fontWeight:'normal'}}>개</span></span>
                 </div>
               </div>
               <div style={styles.statItem}>
                 <div style={styles.statLabel}>평균 신뢰도</div>
                 <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{fontSize:'24px', color:'#34a853'}}>✓</span>
                   <span style={{...styles.statValue, color:'#202124'}}>{summaryStats.averageReliability} <span style={{fontSize:'14px', color:'#80868b', fontWeight:'normal'}}>/ 5</span></span>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div>
          <div style={styles.listHeader}>
            <div style={{ ...styles.listTitle, fontSize: '18px' }}>관련 뉴스</div>
            <select style={styles.select}><option>최신순</option></select>
          </div>

          <div style={styles.tabContainer}>
            <div style={styles.tabBtn(activeTab === 'related')} onClick={() => setActiveTab('related')}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              관련 뉴스 ({displayRelatedList.length})
            </div>
            <div style={styles.tabBtn(activeTab === 'unrelated')} onClick={() => setActiveTab('unrelated')}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
              반박 기사 ({displayCounterList.length})
            </div>
          </div>

          <div style={{ ...styles.listTitle, padding: '0 8px', marginBottom: '16px' }}>
            {activeTab === 'related' ? '해당 주장/의견을 지지하거나 다루는 기사' : '다른 관점에서 반박하거나 보완하는 기사'}
          </div>

          <div style={styles.grid}>
            {activeList.length === 0 ? (
              <div style={styles.emptyState}>
                백엔드에서 받은 {activeTab === 'related' ? '관련 뉴스' : '반박 기사'} 목록이 비어 있습니다.<br/>
                프론트 예시 데이터는 섞지 않았습니다.
              </div>
            ) : activeList.map(item => (
              <div key={item.id} style={styles.newsCard}>
                <div style={{...styles.newsLogo(item.logo), color: item.logoBorder ? '#000' : '#fff', border: item.logoBorder ? `1px solid ${item.logoBorder}` : 'none', whiteSpace: 'pre-wrap', textAlign: 'center', lineHeight: '1.2'}}>
                  {item.logoText}
                  {item.logoUrl && <img src={item.logoUrl} alt={`${item.logoText} 로고`} style={styles.newsLogoImage} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
                </div>
                <div style={styles.newsContent}>
                  <div style={styles.newsTitle}>{item.title}</div>
                  <div style={styles.newsDesc}>{item.desc}</div>
                  <div style={styles.newsFooter}>
                    <div style={styles.newsMeta}>
                      <span>{item.date}</span>
                      <span>|</span>
                      <span>조회 {item.views}</span>
                    </div>
                    <div style={styles.badge(item.badge)}>{item.badge}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button style={styles.moreBtn}>더보기 v</button>
        </div>

        <div style={styles.footer}>
          <span style={{fontSize:'24px'}}>💡</span>
          <div>
            <div style={{fontSize:'13px', color:'#5f6368', marginBottom:'4px'}}>Cheat F/T는 정보를 수집하고 분석할 뿐, 결론을 내리지 않습니다.</div>
            <div style={{fontSize:'13px', color:'#5f6368'}}>기사의 출처와 내용을 확인하고 최종 판단은 사용자에게 있습니다.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
