import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSummary, runFactCheck } from '../../services/cheatftApi.js';

const PRESS_COLORS = ['#1a73e8', '#00c4b4', '#ea4335', '#8ab4f8', '#202124'];
const SORT_LABELS = {
  latest: '최신순',
  views: '조회수순',
  relevance: '연관도순',
};
const MOCK_VIEW_COUNTS = [18420, 12680, 9310, 6420, 2880];
const MOCK_RELEVANCE_SCORES = [96, 88, 81, 73, 58];
const MOCK_SOURCE_CATEGORIES = ['방송/통신사', '방송/통신사', '방송/통신사', '종합지', '전문지/매거진'];
const SOURCE_FILTERS = [
  { value: 'all', label: '전체 출처' },
  { value: '방송/통신사', label: '방송/통신사' },
  { value: '종합지', label: '종합지' },
  { value: '경제지', label: '경제지' },
  { value: '인터넷/IT지', label: '인터넷/IT지' },
  { value: '지역지', label: '지역지' },
  { value: '전문지/매거진', label: '전문지/매거진' },
  { value: '해외 통신사', label: '해외 통신사' },
  { value: 'mock', label: '프론트 더미' },
];
const NAVER_PRESS_CATEGORY_RANGES = [
  { end: 9, category: '종합지' },
  { end: 23, category: '방송/통신사' },
  { end: 34, category: '경제지' },
  { end: 47, category: '인터넷/IT지' },
  { end: 71, category: '전문지/매거진' },
  { end: 83, category: '지역지' },
  { end: 86, category: '해외 통신사' },
];
const PRESS_NAME_ALIASES = {
  'KBS 뉴스': 'KBS',
  'MBC 뉴스': 'MBC',
  'SBS 뉴스': 'SBS',
  'YTN 뉴스': 'YTN',
  'TV조선 뉴스': 'TV조선',
};
const NAVER_PRESS_NAMES = [
  '경향신문',
  '국민일보',
  '동아일보',
  '문화일보',
  '서울신문',
  '세계일보',
  '조선일보',
  '중앙일보',
  '한겨레',
  '한국일보',
  '뉴스1',
  '뉴시스',
  '연합뉴스',
  '연합뉴스TV',
  '채널A',
  '한국경제TV',
  'JTBC',
  'KBS',
  'MBC',
  'MBN',
  'SBS',
  'SBS Biz',
  'TV조선',
  'YTN',
  '매일경제',
  '머니투데이',
  '비즈워치',
  '서울경제',
  '아시아경제',
  '이데일리',
  '조선비즈',
  '조세일보',
  '파이낸셜뉴스',
  '한국경제',
  '헤럴드경제',
  '노컷뉴스',
  '더팩트',
  '데일리안',
  '동행미디어 시대',
  '미디어오늘',
  '아이뉴스24',
  '오마이뉴스',
  '프레시안',
  '디지털데일리',
  '디지털타임스',
  '블로터',
  '전자신문',
  '지디넷코리아',
  '더스쿠프',
  '레이디경향',
  '매경이코노미',
  '시사IN',
  '시사저널',
  '신동아',
  '월간 산',
  '이코노미스트',
  '주간경향',
  '주간동아',
  '주간조선',
  '중앙SUNDAY',
  '한겨레21',
  '한경비즈니스',
  '기자협회보',
  '농민신문',
  '뉴스타파',
  '동아사이언스',
  '여성신문',
  '일다',
  '코리아중앙데일리',
  '코리아헤럴드',
  '코메디닷컴',
  '헬스조선',
  '강원도민일보',
  '강원일보',
  '경기일보',
  '국제신문',
  '대구MBC',
  '대전일보',
  '매일신문',
  '부산일보',
  '전주MBC',
  'CJB청주방송',
  'JIBS',
  'kbc광주방송',
  '신화사 연합뉴스',
  'AP연합뉴스',
  'EPA연합뉴스',
];

function normalizePressName(value) {
  return String(value || '').replace(/\s+/g, '').toLowerCase();
}

function getPressIndex(press) {
  if (typeof press === 'number' || (typeof press === 'string' && press.trim() !== '' && Number.isInteger(Number(press)))) {
    const pressIndex = Number(press);
    return pressIndex >= 0 && pressIndex < NAVER_PRESS_NAMES.length ? pressIndex : -1;
  }

  const pressName = String(press || '').trim();
  const aliasName = PRESS_NAME_ALIASES[pressName] || pressName.replace(/\s+뉴스$/, '');
  const exactIndex = NAVER_PRESS_NAMES.indexOf(aliasName);
  if (exactIndex >= 0) return exactIndex;

  const normalizedName = normalizePressName(aliasName);
  return NAVER_PRESS_NAMES.findIndex((name) => normalizePressName(name) === normalizedName);
}

function getPressLabel(press) {
  const pressIndex = getPressIndex(press);
  if (pressIndex >= 0) return NAVER_PRESS_NAMES[pressIndex];
  if (typeof press === 'number' || (typeof press === 'string' && press.trim() !== '' && Number.isInteger(Number(press)))) return `언론사 ${Number(press)}`;
  return press || '출처 확인중';
}

function getPressCategory(press) {
  const pressIndex = getPressIndex(press);
  const matchedRange = NAVER_PRESS_CATEGORY_RANGES.find((range) => pressIndex <= range.end);
  return pressIndex >= 0 && matchedRange ? matchedRange.category : '기타 출처';
}

function matchesSourceFilter(item, sourceFilter) {
  if (sourceFilter === 'all') return true;
  if (sourceFilter === 'mock') return item.sourceLabel === '프론트 더미';
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
  if (!value) return '2024.05.20';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '');
}

function formatDateTime(value) {
  if (!value) return '2024.05.20 14:30';
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
  const scoreValue = Math.max(1, 5 - Math.min(index, 4));

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
    date: formatDate(article.publishedAt || article.createdAt),
    title: article.title,
    desc: article.summary || article.url || '백엔드에서 반환한 기사입니다. 상세 요약 필드가 확정되면 이 영역에 표시됩니다.',
    scoreText: scoreValue >= 4 ? '신뢰 가능' : scoreValue >= 3 ? '보통' : '주의',
    score: `${scoreValue} / 5`,
    scoreColor: scoreValue >= 4 ? '#8bc34a' : scoreValue >= 3 ? '#fbbc04' : '#ff9800',
    rotation: 45 - index * 36,
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
  const isTrue = result === 'TRUE';
  const isFalse = result === 'FALSE';
  const title = getRecentCheckTitle(check);

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
    color: isTrue ? '#34a853' : isFalse ? '#ea4335' : PRESS_COLORS[index % PRESS_COLORS.length],
    date: check.timeAgo || '방금 전',
    title,
    desc: `홈 요약 API에서 불러온 최신 팩트체크 항목입니다. 결과: ${result || '확인중'}`,
    scoreText: isTrue ? '신뢰 가능' : isFalse ? '주의' : '확인중',
    score: isTrue ? '5 / 5' : isFalse ? '2 / 5' : '3 / 5',
    scoreColor: isTrue ? '#34a853' : isFalse ? '#ea4335' : '#fbbc04',
    rotation: isTrue ? 45 : isFalse ? -63 : 0,
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
    if (query) {
      setApiStatus('loading');
      setApiError('');
    }
  }

  useEffect(() => {
    if (!query) {
      return;
    }

    let ignore = false;

    runFactCheck(query, { page: 1, limit: 10, sort: sortBy })
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
          setApiStatus('fallback');
        }
      });

    return () => {
      ignore = true;
    };
  }, [query, sortBy]);

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
      .catch(() => {
        if (ignore) return;
        setRecentChecks([]);
        setLatestStatus('fallback');
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
      color: source === 'api' || source === 'mixed' ? '#174ea6' : source === 'fallback' ? '#5f6368' : '#80868b',
      backgroundColor: source === 'api' || source === 'mixed' ? '#e8f0fe' : source === 'fallback' ? '#f8f9fa' : '#ffffff',
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

  const mockResults = [
    { pub: 'KBS 뉴스', logo: 'KBS', color: '#1a73e8', date: '2024.05.20', title: '질병청 “백신 접종 후 사망 사례, 인과성 확인 안돼”', desc: '질병관리청은 최근 제기된 백신 접종 후 사망 급증 주장에 대해 현재까지 인과성이 확인된 사례는 없다고 밝혔습니다...', scoreText: '신용 가능', score: '5 / 5', scoreColor: '#00c4b4', rotation: 45, hint: '이 출처는 높은 신뢰도를 가진 공식력 있는 언론/기관입니다.', opposing: { pub: '뉴스1', date: '2024.05.19', title: '일부 지자체서 백신 접종 후 사망 신고 잇따라' } },
    { pub: '연합뉴스', logo: '연합', color: '#1a73e8', date: '2024.05.20', title: '전문가 “백신과 사망 간 연관성 매우 낮아”', desc: '의료 전문가들은 백신 접종과 사망 간의 연관성을 입증할 과학적 근거가 부족하다고 설명했습니다...', scoreText: '신뢰 가능', score: '4 / 5', scoreColor: '#8bc34a', rotation: 9, hint: '이 출처는 비교적 신뢰할 수 있는 언론/기관입니다.', opposing: { pub: 'OO일보', date: '2024.05.19', title: '백신 부작용으로 인한 사망자 수 급증 추세' } },
    { pub: '뉴스1', logo: 'n', color: '#ea4335', date: '2024.05.19', title: '일부 지자체서 백신 접종 후 사망 신고 잇따라', desc: '전국 일부 지역에서 백신 접종 후 사망 신고가 잇따르고 있어 당국이 조사에 나섰습니다...', scoreText: '보통', score: '3 / 5', scoreColor: '#fbbc04', rotation: -27, hint: '이 출처의 정보는 일부 사실 기반이나 검증이 더 필요할 수 있습니다.', opposing: { pub: 'KBS 뉴스', date: '2024.05.20', title: '질병청 “백신 접종 후 사망 사례, 인과성 확인 안돼”' } },
    { pub: 'OO일보', logo: 'OO', color: '#8ab4f8', date: '2024.05.19', title: '백신 부작용으로 인한 사망자 수 급증 추세', desc: '백신 접종 이후 예상치 못한 사망 사례가 빠르게 늘어나고 있다는 주장이 제기되고 있습니다...', scoreText: '주의', score: '2 / 5', scoreColor: '#ff9800', rotation: -63, hint: '이 출처는 신뢰도가 낮거나 편향된 보도일 가능성이 있습니다.' },
    { pub: 'Truth News', logo: 'TN', color: '#202124', date: '2024.05.18', title: '숨겨진 진실! 백신이 사망 원인이다', desc: '정부와 제약회사가 숨기고 있는 백신의 치명적 부작용 실체를 밝힙니다. 더 이상 침묵하지 마세요...', scoreText: '신뢰 불가', score: '1 / 5', scoreColor: '#ea4335', rotation: -99, hint: '이 출처는 검증되지 않은 정보나 허위 정보일 가능성이 매우 높습니다.' },
  ].map((result, index) => ({
    ...result,
    sourceLabel: '프론트 더미',
    sourceCategory: MOCK_SOURCE_CATEGORIES[index] || '프론트 더미',
    sortIndex: index,
    viewCount: MOCK_VIEW_COUNTS[index] || 0,
    relevanceScore: MOCK_RELEVANCE_SCORES[index] || 0,
  }));

  const apiResults = Array.isArray(checkResult?.articles) ? checkResult.articles.map(mapApiArticle) : [];
  const latestResults = recentChecks.map(mapRecentCheck);
  const sortedApiResults = sortResultsBy(apiResults, sortBy);
  const sortedMockResults = sortResultsBy(mockResults, sortBy);
  const sortedLatestResults = sortResultsBy(latestResults, sortBy);
  const filteredApiResults = sortedApiResults.filter((result) => matchesSourceFilter(result, sourceFilter));
  const filteredMockResults = sortedMockResults.filter((result) => matchesSourceFilter(result, sourceFilter));
  const filteredLatestResults = sortedLatestResults.filter((result) => matchesSourceFilter(result, sourceFilter));
  const hasApiCheckResult = query && apiStatus === 'done';
  const hasApiLatestResult = !query && latestStatus === 'done';
  const isLoading = query && apiStatus === 'loading';
  const isLatestLoading = !query && latestStatus === 'loading';
  const displayResults = query
    ? (hasApiCheckResult ? [...filteredApiResults, ...filteredMockResults] : filteredMockResults)
    : (hasApiLatestResult ? filteredLatestResults : filteredMockResults);
  const dataSource = query
    ? (isLoading ? 'loading' : hasApiCheckResult ? 'mixed' : 'fallback')
    : (isLatestLoading ? 'loading' : hasApiLatestResult ? 'api' : 'fallback');
  const dataSourceText = dataSource === 'api'
    ? '백엔드 API 응답 표시 중'
    : dataSource === 'mixed'
      ? '백엔드 API와 프론트 더미데이터 함께 표시 중'
    : dataSource === 'fallback'
      ? '프론트 더미데이터 표시 중'
      : '백엔드 API 응답 대기 중';
  const totalArticles = hasApiCheckResult ? (checkResult?.totalArticles ?? apiResults.length) : apiResults.length;
  const queryResultGroups = hasApiCheckResult
    ? [
        { key: 'api', label: `백엔드 API 결과 ${filteredApiResults.length}건`, source: 'api', items: filteredApiResults },
        { key: 'mock', label: `프론트 더미데이터 ${filteredMockResults.length}건`, source: 'mock', items: filteredMockResults },
      ]
    : [
        { key: 'mock', label: `프론트 더미데이터 ${filteredMockResults.length}건`, source: 'mock', items: filteredMockResults },
      ];
  const searchTime = formatDateTime(checkResult?.searchTime);

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.searchCard}>
          <div style={styles.titleInfo}>검증할 정보를 입력하세요 ⓘ</div>
          <div style={styles.descInfo}>뉴스, 게시글, 영상 등 다양한 정보를 검색하여 관련 출처의 신빙성을 확인해보세요.</div>
          
          <div style={styles.tabContainer}>
            <div style={styles.tab(true)}>T 텍스트</div>
            <div style={styles.tab(false)}>🔗 URL 링크</div>
          </div>
          
          <textarea
            style={styles.textarea}
            placeholder="검증하고 싶은 내용이나 문장을 입력하세요."
            value={val}
            onChange={(e) => setVal(e.target.value)}
            maxLength={5000}
            aria-label="검증할 정보"
          />
          <div style={styles.charCount}>{val.length} / 5,000</div>
          
          <div style={styles.exampleText}>예시로 시작해보세요</div>
          <button style={styles.exampleBtn} onClick={() => setVal('백신 부작용 사망자 급증?')}>"백신 부작용 사망자 급증?"</button>
          <button style={styles.exampleBtn} onClick={() => setVal('지구온난화는 인위적인 조작이다?')}>"지구온난화는 인위적인 조작이다?"</button>
          <button style={styles.exampleBtn} onClick={() => setVal('OOO 식품이 암을 치료한다?')}>"OOO 식품이 암을 치료한다?"</button>
          
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
                    : hasApiCheckResult && apiResults.length === 0
                      ? `백엔드 API 응답은 성공했지만 관련 기사 목록이 비어 있습니다. 아래에 프론트 더미데이터 ${mockResults.length}건을 함께 표시합니다.`
                      : hasApiCheckResult
                        ? `백엔드 API 기준 ${totalArticles}건, 화면 표시용 프론트 더미데이터 ${mockResults.length}건을 함께 보여줍니다.`
                        : `프론트 더미데이터 ${mockResults.length}건을 표시합니다.`}
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

            {queryResultGroups.every((group) => group.items.length === 0) ? (
              <div style={styles.emptyState}>
                표시할 백엔드 API 결과와 프론트 더미데이터가 없습니다.
              </div>
            ) : queryResultGroups.map((group) => (
              <div key={group.key}>
                <div style={styles.resultGroupLabel(group.source)}>{group.label} · {SORT_LABELS[sortBy]}</div>
                {group.items.length === 0 ? (
                  <div style={styles.emptyState}>이 섹션에 표시할 결과가 없습니다.</div>
                ) : group.items.map((res, i) => (
                  <div key={`${group.key}-${res.articleId ?? res.title ?? i}`} style={styles.articleCard} onClick={() => onArticleClick(res.articleId ?? i + 1)}>
                    <div style={{ flex: 1, paddingRight: '40px' }}>
                      <div style={styles.articleMeta}>
                        <div style={styles.publisherLogo(res.color)}>{res.logo}</div>
                        <span style={styles.publisher}>{res.pub}</span>
                        <span style={styles.date}>{res.date}</span>
                        <span style={styles.sourceBadge(res.sourceLabel || '프론트 더미')}>{res.sourceLabel || '프론트 더미'}</span>
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
                      : 'API 연결 전에는 예시 팩트체크를 표시합니다.'}
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
                프론트 예시 뉴스는 표시하지 않았습니다.
              </div>
            ) : displayResults.slice(0, 3).map((res, i) => (
              <div
                key={res.articleId ?? res.title ?? i}
                style={styles.articleCard}
                onClick={() => {
                  const nextQuery = res.checkQuery || res.title;
                  setVal(nextQuery);
                  onSearch(nextQuery);
                }}
              >
                <div style={{ flex: 1, paddingRight: '40px' }}>
                  <div style={styles.articleMeta}>
                    <div style={styles.publisherLogo(res.color)}>{res.logo}</div>
                    <span style={styles.publisher}>{res.pub}</span>
                    <span style={styles.date}>{res.date}</span>
                    <span style={styles.sourceBadge(res.sourceLabel || '프론트 목업')}>{res.sourceLabel || '프론트 목업'}</span>
                    {res.sourceCategory && <span style={styles.date}>{res.sourceCategory}</span>}
                    {res.viewCount > 0 && <span style={styles.date}>조회 {res.viewCount.toLocaleString('ko-KR')}</span>}
                    {res.relevanceScore > 0 && <span style={styles.date}>연관도 {res.relevanceScore}</span>}
                  </div>
                  <div style={styles.articleTitle}>{res.title}</div>
                  <div style={styles.articleDesc}>{res.desc}</div>
                  <div style={styles.linkBtn} onClick={(e) => { e.stopPropagation(); setVal(res.title); onSearch(res.title); }}>
                    이 주제로 검증하기 <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
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
