import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteReport, getAnalysisResult, getReports } from '../../services/cheatftApi.js';
import { getPressLabel, getPressLogoUrl, getPressReliability, recordObservedPress } from '../../utils/press.js';
import { buildNewsSourceSearchUrl } from '../../utils/search.js';
import { cleanDisplayText } from '../../utils/text.js';

const FAVORITE_REPORTS_KEY = 'cheat-ft-favorite-report-ids';
const REPORTS_PAGE_SIZE = 10;

function readFavoriteReportIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITE_REPORTS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    localStorage.removeItem(FAVORITE_REPORTS_KEY);
    return [];
  }
}

function writeFavoriteReportIds(ids) {
  localStorage.setItem(FAVORITE_REPORTS_KEY, JSON.stringify(ids));
}

function formatDateTime(value) {
  if (!value) return '날짜 미상';
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

function getSortTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function mapApiReport(report, index) {
  const rawPresses = Array.isArray(report.mainPresses) ? report.mainPresses : [];
  const presses = rawPresses.filter((press) => typeof press === 'string' && press.trim());

  return {
    id: report.id ?? index + 1,
    title: cleanDisplayText(report.topic, '제목 없음'),
    date: formatDateTime(report.searchTime),
    sortTime: getSortTime(report.searchTime),
    status: report.status || '분석 완료',
    relatedCount: report.relatedCount ?? 0,
    unrelatedCount: report.counterCount ?? 0,
    score: Number(report.averageReliability ?? 0),
    sources: presses.slice(0, 3).map((press, pressIndex) => {
      recordObservedPress(press);
      const pressLabel = getPressLabel(press);
      const pressReliability = getPressReliability(press);

      return {
        name: typeof press === 'number' && pressLabel === String(press) ? `언론사 ${press}` : pressLabel,
        logo: ['#1a2b49', '#1a73e8', '#ea4335'][pressIndex % 3],
        logoUrl: getPressLogoUrl(press),
        score: pressReliability.reliabilityScore ? `${pressReliability.reliabilityScore}/5` : report.averageReliability ? `${report.averageReliability}/5` : null,
      };
    }),
    extraCount: Math.max(0, presses.length - 3),
    summaryDesc: cleanDisplayText(report.summary, '리포트 요약이 여기에 표시됩니다.'),
  };
}

function mapReportDetailArticle(article, index, fallbackStance) {
  const pressValue = article.press ?? article.pressName ?? article.publisher ?? article.mediaName;
  recordObservedPress(pressValue, article.pressName ?? article.publisher ?? article.mediaName);
  const pressLabel = getPressLabel(pressValue);
  const title = cleanDisplayText(article.title, '제목 없음');
  const exactUrl = cleanDisplayText(article.url || article.link || article.originalLink || article.originallink, '');
  const fallbackUrl = buildNewsSourceSearchUrl({ title, press: pressLabel });

  return {
    id: article.articleId ?? article.id ?? index,
    press: pressLabel,
    date: cleanDisplayText(article.publishedAt || article.createdAt || article.date || article.pubDate, ''),
    title,
    url: exactUrl || fallbackUrl,
    stance: cleanDisplayText(article.stance, fallbackStance),
  };
}

export default function ReportView({ onAuthExpired }) {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [innerTab, setInnerTab] = useState('related'); // 'related' | 'unrelated'
  const [reportData, setReportData] = useState(null);
  const [reportStatus, setReportStatus] = useState('loading');
  const [apiError, setApiError] = useState('');
  const [detailDataById, setDetailDataById] = useState({});
  const [detailStatusById, setDetailStatusById] = useState({});
  const [detailErrorById, setDetailErrorById] = useState({});
  const [keyword, setKeyword] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [activeMenu, setActiveMenu] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [favoriteReportIds, setFavoriteReportIds] = useState(() => readFavoriteReportIds());
  const [actionMessage, setActionMessage] = useState('');
  const [periodCounts, setPeriodCounts] = useState({ today: 0, sevenDays: 0, thirtyDays: 0 });
  const [page, setPage] = useState(1);
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    getReports({
      keyword: keyword.trim(),
      date: dateFilter,
      score: scoreFilter,
      page,
      limit: REPORTS_PAGE_SIZE,
    })
      .then((data) => {
        if (!ignore) {
          setReportData(data || {});
          setReportStatus('done');
          setApiError('');
        }
      })
      .catch((error) => {
        const isAuthError = error.status === 401 || error.status === 403;
        if (!ignore && error.code !== 'API_NOT_CONFIGURED') {
          setApiError(isAuthError
            ? '로그인이 만료되었거나 인증이 필요합니다. 다시 로그인해주세요.'
            : error.message || '리포트를 불러오지 못했습니다.');
        }
        if (!ignore) {
          setReportData(null);
          setReportStatus('error');
        }
        if (isAuthError && onAuthExpired) {
          onAuthExpired();
        }
      });

    return () => {
      ignore = true;
    };
  }, [dateFilter, keyword, onAuthExpired, page, reportsRefreshKey, scoreFilter]);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      getReports({ keyword: keyword.trim(), date: '1', score: scoreFilter, page: 1, limit: 1 }),
      getReports({ keyword: keyword.trim(), date: '7', score: scoreFilter, page: 1, limit: 1 }),
      getReports({ keyword: keyword.trim(), date: '30', score: scoreFilter, page: 1, limit: 1 }),
    ])
      .then(([todayData, sevenDaysData, thirtyDaysData]) => {
        if (ignore) return;
        setPeriodCounts({
          today: todayData?.pagination?.totalItems ?? todayData?.reports?.length ?? 0,
          sevenDays: sevenDaysData?.pagination?.totalItems ?? sevenDaysData?.reports?.length ?? 0,
          thirtyDays: thirtyDaysData?.pagination?.totalItems ?? thirtyDaysData?.reports?.length ?? 0,
        });
      })
      .catch((error) => {
        const isAuthError = error.status === 401 || error.status === 403;
        if (isAuthError && onAuthExpired) {
          onAuthExpired();
        }
      });

    return () => {
      ignore = true;
    };
  }, [keyword, onAuthExpired, reportsRefreshKey, scoreFilter]);

  const loadReportDetail = (reportId) => {
    if (!reportId || detailDataById[reportId] || detailStatusById[reportId] === 'loading') return;

    setDetailStatusById((previous) => ({ ...previous, [reportId]: 'loading' }));
    setDetailErrorById((previous) => ({ ...previous, [reportId]: '' }));

    getAnalysisResult(reportId, { limit: 10 })
      .then((data) => {
        setDetailDataById((previous) => ({ ...previous, [reportId]: data || {} }));
        setDetailStatusById((previous) => ({ ...previous, [reportId]: 'done' }));
      })
      .catch((error) => {
        const isAuthError = error.status === 401 || error.status === 403;
        setDetailErrorById((previous) => ({
          ...previous,
          [reportId]: isAuthError
            ? '로그인이 만료되었거나 인증이 필요합니다. 다시 로그인해주세요.'
            : error.message || '리포트 상세를 불러오지 못했습니다.',
        }));
        setDetailStatusById((previous) => ({ ...previous, [reportId]: 'error' }));
        if (isAuthError && onAuthExpired) {
          onAuthExpired();
        }
      });
  };

  const toggleReport = (report) => {
    if (expandedId === report.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(report.id);
    setInnerTab('related');
    loadReportDetail(report.id);
  };

  const setDateMenu = (menu, dateValue) => {
    setActiveMenu(menu);
    setDateFilter(dateValue);
    setPage(1);
    setExpandedId(null);
  };

  const updateKeyword = (value) => {
    setKeyword(value);
    setPage(1);
    setExpandedId(null);
  };

  const updateScoreFilter = (value) => {
    setScoreFilter(value);
    setPage(1);
    setExpandedId(null);
  };

  const toggleFavorite = (reportId) => {
    const id = String(reportId);
    setFavoriteReportIds((previous) => {
      const next = previous.includes(id)
        ? previous.filter((favoriteId) => favoriteId !== id)
        : [...previous, id];
      writeFavoriteReportIds(next);
      return next;
    });
  };

  const goToReportPage = (nextPage) => {
    setPage(nextPage);
    setExpandedId(null);
    setInnerTab('related');
  };

  const copyReportSummary = (report, summaryText) => {
    if (!navigator.clipboard?.writeText) {
      setActionMessage('이 브라우저에서는 클립보드 복사를 지원하지 않습니다.');
      return;
    }

    navigator.clipboard.writeText(summaryText)
      .then(() => setActionMessage(`'${report.title}' 리포트 요약을 복사했습니다.`))
      .catch(() => setActionMessage('클립보드 복사에 실패했습니다.'));
  };

  const removeReport = (report) => {
    if (!window.confirm(`'${report.title}' 리포트를 삭제할까요?`)) return;

    deleteReport(report.id)
      .then(() => {
        setActionMessage(`'${report.title}' 리포트를 삭제했습니다.`);
        setExpandedId(null);
        setDetailDataById((previous) => {
          const next = { ...previous };
          delete next[report.id];
          return next;
        });
        setFavoriteReportIds((previous) => {
          const next = previous.filter((id) => id !== String(report.id));
          writeFavoriteReportIds(next);
          return next;
        });
        setReportsRefreshKey((value) => value + 1);
      })
      .catch((error) => {
        const isAuthError = error.status === 401 || error.status === 403;
        setActionMessage(isAuthError
          ? '로그인이 만료되었거나 인증이 필요합니다. 다시 로그인해주세요.'
          : error.message || '리포트 삭제에 실패했습니다.');
        if (isAuthError && onAuthExpired) {
          onAuthExpired();
        }
      });
  };

  const styles = {
    container: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif', color: '#202124', display: 'flex', borderTop: '1px solid #e8eaed' },
    
    // Left Sidebar
    sidebar: { width: '260px', flexShrink: 0, borderRight: '1px solid #e0e0e0', backgroundColor: '#fafbfc', padding: '24px 0', display: 'flex', flexDirection: 'column' },
    sidebarSection: { padding: '0 24px', marginBottom: '24px' },
    sidebarTitle: { fontSize: '16px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' },
    sidebarDesc: { fontSize: '13px', color: '#5f6368', marginBottom: '16px', lineHeight: '1.4' },
    primaryBtn: { width: '100%', padding: '12px', backgroundColor: '#0056d2', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
    
    menuList: { display: 'flex', flexDirection: 'column', padding: '0 16px', marginBottom: '24px' },
    menuItem: (isActive) => ({ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', fontWeight: isActive ? 'bold' : 'normal', backgroundColor: isActive ? '#e8f0fe' : 'transparent', color: isActive ? '#1a73e8' : '#3c4043', transition: 'background 0.2s' }),
    menuBadge: { fontSize: '13px', color: '#80868b' },
    menuIcon: { display: 'flex', alignItems: 'center', gap: '8px' },
    
    divider: { height: '1px', backgroundColor: '#e0e0e0', margin: '0 24px 24px 24px' },
    filterTitle: { fontSize: '14px', fontWeight: 'bold', color: '#202124', marginBottom: '16px' },
    select: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '13px', outline: 'none', marginBottom: '12px', color: '#3c4043' },
    
    tipBox: { backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '16px' },
    tipTitle: { fontSize: '14px', fontWeight: 'bold', color: '#1a73e8', marginBottom: '8px' },
    tipDesc: { fontSize: '13px', color: '#5f6368', lineHeight: '1.5', marginBottom: '16px' },
    
    // Main Content
    main: { flex: 1, padding: '40px', backgroundColor: '#f8f9fa' },
    mainHeader: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', padding: '28px', border: '1px solid #e8eaed', borderRadius: '16px', backgroundColor: '#ffffff' },
    mainTitle: { fontSize: '26px', fontWeight: '800', color: '#202124' },
    mainDesc: { fontSize: '14px', color: '#5f6368' },
    sourceNotice: (source) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      alignSelf: 'flex-start',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 'bold',
      color: source === 'api' ? '#174ea6' : source === 'loading' ? '#80868b' : source === 'error' ? '#c5221f' : '#5f6368',
      backgroundColor: source === 'api' ? '#e8f0fe' : source === 'error' ? '#fce8e6' : '#f8f9fa',
      border: source === 'api' ? '1px solid #d2e3fc' : source === 'error' ? '1px solid #fad2cf' : '1px solid #e0e0e0',
      marginTop: '6px',
    }),
    
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' },
    statCard: { backgroundColor: '#ffffff', border: '1px solid #e8eaed', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' },
    statIconWrapper: (bg) => ({ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }),
    statLabel: { fontSize: '13px', color: '#5f6368', marginBottom: '4px' },
    statValue: { fontSize: '20px', fontWeight: 'bold', color: '#202124' },
    
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '16px', border: '1px solid #e8eaed', borderRadius: '12px', backgroundColor: '#ffffff' },
    searchInput: { padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '14px', outline: 'none', width: '300px', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%2380868b\' viewBox=\'0 0 24 24\'><path d=\'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\'/></svg>")', backgroundPosition: '12px center', backgroundRepeat: 'no-repeat' },
    toolsRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    
    // List Item
    listContainer: { display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' },
    emptyState: { padding: '48px 24px', borderRadius: '12px', border: '1px dashed #dadce0', backgroundColor: '#fafbfc', color: '#5f6368', textAlign: 'center', lineHeight: '1.6' },
    reportCard: (isExpanded) => ({ backgroundColor: '#ffffff', border: isExpanded ? '1px solid #1a73e8' : '1px solid #e8eaed', borderRadius: '14px', padding: '24px', transition: 'all 0.2s', boxShadow: isExpanded ? '0 8px 24px rgba(26, 115, 232, 0.1)' : '0 1px 2px rgba(60,64,67,0.04)' }),
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    cardTitleRow: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', minWidth: 0 },
    cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#202124' },
    cardMeta: { fontSize: '13px', color: '#80868b', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', minWidth: 0 },
    statusBadge: { display: 'inline-flex', alignItems: 'center', padding: '3px 6px', borderRadius: '4px', backgroundColor: '#e6f4ea', color: '#137333', fontSize: '11px', fontWeight: 'bold', lineHeight: 1.2, whiteSpace: 'nowrap' },
    
    cardContentRow: { display: 'flex', alignItems: 'center', gap: '24px' },
    infoBlock: { display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid #e0e0e0', paddingRight: '24px' },
    infoLabel: { fontSize: '13px', color: '#5f6368', display: 'flex', flexDirection: 'column', gap: '4px' },
    infoValue: { fontSize: '16px', fontWeight: 'bold', color: '#202124' },
    iconBox: (bg) => ({ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }),
    
    sourceGroup: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
    sourceItem: { display: 'flex', alignItems: 'center', gap: '8px' },
    sourceLogo: (bg) => ({ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: bg, color: '#fff', fontSize: '9px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', flexShrink: 0 }),
    sourceLogoImage: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '50%' },
    sourceScore: { fontSize: '13px', fontWeight: 'bold', color: '#3c4043' },
    
    detailBtn: { marginLeft: 'auto', padding: '8px 16px', border: '1px solid #dadce0', borderRadius: '20px', backgroundColor: '#ffffff', color: '#1a73e8', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 },
    actionBtn: { border: '1px solid #dadce0', borderRadius: '999px', backgroundColor: '#ffffff', color: '#5f6368', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '7px 10px', whiteSpace: 'nowrap' },
    paginationBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '20px', padding: '14px 16px', border: '1px solid #e8eaed', borderRadius: '12px', backgroundColor: '#ffffff', flexWrap: 'wrap' },
    paginationInfo: { fontSize: '13px', color: '#5f6368' },
    paginationControls: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
    paginationBtn: (isActive = false, isDisabled = false) => ({
      minWidth: '36px',
      height: '36px',
      padding: '0 12px',
      borderRadius: '8px',
      border: isActive ? '1px solid #1a73e8' : '1px solid #dadce0',
      backgroundColor: isActive ? '#e8f0fe' : '#ffffff',
      color: isDisabled ? '#bdc1c6' : isActive ? '#1a73e8' : '#3c4043',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: isDisabled ? 'default' : 'pointer',
    }),
    
    // Expanded Section
    expandedDivider: { height: '1px', backgroundColor: '#e0e0e0', margin: '24px 0', border: 'none' },
    expandedSection: { backgroundColor: '#fafbfc', borderRadius: '8px', padding: '0' },
    expandedHeader: { display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 20px', fontSize: '15px', fontWeight: 'bold', color: '#1a73e8' },
    expandedTabs: { display: 'flex', gap: '24px', padding: '0 20px', borderBottom: '1px solid #e0e0e0', marginBottom: '20px' },
    expandedTab: (isActive) => ({ padding: '12px 0', fontSize: '14px', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#1a73e8' : '#5f6368', borderBottom: isActive ? '2px solid #1a73e8' : '2px solid transparent', cursor: 'pointer' }),
    
    expandedContentBody: { display: 'flex', padding: '0 20px 20px 20px', gap: '32px' },
    articleListCol: { flex: 2, display: 'flex', flexDirection: 'column', gap: '12px' },
    articleListItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px' },
    articleListPublisher: { fontWeight: 'bold', color: '#202124', width: '60px', flexShrink: 0 },
    articleListDate: { color: '#80868b', fontSize: '12px', flexShrink: 0 },
    articleListText: { color: '#3c4043', flex: 1, lineHeight: '1.5' },
    articleListLink: { color: '#3c4043', flex: 1, lineHeight: '1.5', textDecoration: 'none' },
    articleListAction: { color: '#1a73e8', fontWeight: 'bold', fontSize: '13px', cursor: 'default', width: '70px', textAlign: 'right', flexShrink: 0 },
    
    summaryCol: { flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '20px', display: 'flex', flexDirection: 'column' },
    summaryColTitle: { fontSize: '14px', fontWeight: 'bold', color: '#202124', marginBottom: '12px' },
    summaryColText: { fontSize: '13px', color: '#5f6368', lineHeight: '1.6', flex: 1 },

    globalFooter: { borderTop: '1px solid #e0e0e0', padding: '16px 40px', fontSize: '12px', color: '#80868b', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff' }
  };

  const hasApiReports = reportStatus === 'done';
  const reportItems = reportData?.reports;
  const apiReports = useMemo(() => {
    if (!hasApiReports || !Array.isArray(reportItems)) return [];
    return reportItems.map(mapApiReport);
  }, [hasApiReports, reportItems]);
  const favoriteReportIdSet = useMemo(() => new Set(favoriteReportIds), [favoriteReportIds]);
  const displayReports = useMemo(() => {
    const filteredReports = activeMenu === 'favorites'
      ? apiReports.filter((report) => favoriteReportIdSet.has(String(report.id)))
      : apiReports;

    return [...filteredReports].sort((a, b) => {
      if (sortBy === 'reliabilityDesc') return b.score - a.score || b.sortTime - a.sortTime;
      if (sortBy === 'reliabilityAsc') return a.score - b.score || b.sortTime - a.sortTime;
      if (sortBy === 'topic') return a.title.localeCompare(b.title, 'ko-KR');
      return b.sortTime - a.sortTime;
    });
  }, [activeMenu, apiReports, favoriteReportIdSet, sortBy]);
  const favoriteCount = apiReports.filter((report) => favoriteReportIdSet.has(String(report.id))).length;
  const totalStats = hasApiReports ? {
    searchedTopics: reportData?.totalStats?.searchedTopics ?? 0,
    analyzedArticles: reportData?.totalStats?.analyzedArticles ?? 0,
    averageReliability: reportData?.totalStats?.averageReliability ?? 0,
  } : {
    searchedTopics: 0,
    analyzedArticles: 0,
    averageReliability: 0,
  };
  const reportsPagination = reportData?.pagination ?? {};
  const currentReportPage = Number(reportsPagination.currentPage ?? page) || page;
  const totalReportPages = Math.max(1, Number(reportsPagination.totalPages ?? 1) || 1);
  const totalReportItems = Number(reportsPagination.totalItems ?? displayReports.length) || 0;
  const paginationPages = useMemo(() => {
    const endPage = Math.min(totalReportPages, Math.max(5, currentReportPage + 2));
    const startPage = Math.max(1, Math.min(currentReportPage - 2, endPage - 4));
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }, [currentReportPage, totalReportPages]);

  return (
    <div className="report-page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="report-layout" style={styles.container}>
        {/* Left Sidebar */}
        <div className="report-sidebar" style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarTitle}>팩트체크 리포트</div>
            <div style={styles.sidebarDesc}>이전에 검색하고 분석한 내용을 한눈에 확인할 수 있습니다.</div>
            <button type="button" style={styles.primaryBtn} onClick={() => navigate('/algo')}>+ 새 검색 시작</button>
          </div>

          <div style={styles.menuList}>
            <button type="button" style={{ ...styles.menuItem(activeMenu === 'all'), border: 0 }} onClick={() => setDateMenu('all', '')}>
              <span style={styles.menuIcon}>📄 전체 리포트</span>
              <span style={styles.menuBadge}>{reportData?.pagination?.totalItems ?? displayReports.length}</span>
            </button>
            <button type="button" style={{ ...styles.menuItem(activeMenu === 'favorites'), border: 0 }} onClick={() => setDateMenu('favorites', '')}>
              <span style={styles.menuIcon}>⭐ 즐겨찾기</span>
              <span style={styles.menuBadge}>{favoriteCount}</span>
            </button>
            <button type="button" style={{ ...styles.menuItem(activeMenu === 'today'), border: 0 }} onClick={() => setDateMenu('today', '1')}>
              <span style={styles.menuIcon}>🕒 오늘</span>
              <span style={styles.menuBadge}>{periodCounts.today}</span>
            </button>
            <button type="button" style={{ ...styles.menuItem(activeMenu === '7days'), border: 0 }} onClick={() => setDateMenu('7days', '7')}>
              <span style={styles.menuIcon}>📅 최근 7일</span>
              <span style={styles.menuBadge}>{periodCounts.sevenDays}</span>
            </button>
            <button type="button" style={{ ...styles.menuItem(activeMenu === '30days'), border: 0 }} onClick={() => setDateMenu('30days', '30')}>
              <span style={styles.menuIcon}>🗓️ 최근 30일</span>
              <span style={styles.menuBadge}>{periodCounts.thirtyDays}</span>
            </button>
          </div>

          <div className="report-divider" style={styles.divider}></div>

          <div style={styles.sidebarSection}>
            <div style={styles.filterTitle}>리포트 필터</div>
            <select style={styles.select} value={dateFilter} onChange={(event) => setDateMenu('custom', event.target.value)}>
              <option value="">날짜 선택</option>
              <option value="1">최근 1일</option>
              <option value="7">최근 7일</option>
              <option value="30">최근 30일</option>
            </select>
            <select style={styles.select} value={scoreFilter} onChange={(event) => updateScoreFilter(event.target.value)}>
              <option value="">전체 신뢰도 등급</option>
              <option value="4">4점 이상</option>
              <option value="3">3점 이상</option>
              <option value="2">2점 이상</option>
            </select>
          </div>

          <div className="report-divider" style={styles.divider}></div>

          <div style={styles.sidebarSection}>
            <div style={styles.filterTitle}>활용 팁</div>
            <div style={styles.sidebarDesc}>기사 요약을 통해 핵심 내용을 빠르게 파악하고, 다양한 관점을 비교하여 균형 잡힌 시각을 가져보세요.</div>
            <div style={{ textAlign: 'center', fontSize: '64px' }}>📋🔍</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="report-main" style={styles.main}>
          <div className="report-main-header" style={styles.mainHeader}>
            <div style={styles.mainTitle}>전체 리포트</div>
            <div style={styles.mainDesc}>지금까지 검색하고 분석한 모든 주제와 기사들을 확인하세요.</div>
          </div>

          <div className="report-stats-grid" style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIconWrapper('#e8f0fe')}><span style={{color:'#1a73e8'}}>📄</span></div>
              <div>
                <div style={styles.statLabel}>검색 주제 수</div>
                <div style={styles.statValue}>{totalStats.searchedTopics}<span style={{fontSize:'14px', fontWeight:'normal'}}>건</span></div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIconWrapper('#e6f4ea')}><span style={{color:'#137333'}}>🏢</span></div>
              <div>
                <div style={styles.statLabel}>분석한 기사 수</div>
                <div style={styles.statValue}>{totalStats.analyzedArticles}<span style={{fontSize:'14px', fontWeight:'normal'}}>건</span></div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIconWrapper('#e6f4ea')}><span style={{color:'#137333'}}>✓</span></div>
              <div>
                <div style={styles.statLabel}>평균 신뢰도</div>
                <div style={styles.statValue}>{totalStats.averageReliability} <span style={{fontSize:'14px', color:'#80868b', fontWeight:'normal'}}>/ 5</span></div>
              </div>
            </div>
          </div>

          <div className="report-toolbar" style={styles.toolbar}>
            <input
              type="text"
              placeholder="검색한 주제나 키워드로 검색하세요"
              style={styles.searchInput}
              value={keyword}
              onChange={(event) => updateKeyword(event.target.value)}
            />
            <div className="report-tools-right" style={styles.toolsRight}>
              <select style={{...styles.select, marginBottom: 0, width: '150px'}} value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="리포트 정렬">
                <option value="latest">최신순</option>
                <option value="reliabilityDesc">신뢰도 높은순</option>
                <option value="reliabilityAsc">신뢰도 낮은순</option>
                <option value="topic">주제명순</option>
              </select>
            </div>
          </div>

          {apiError && <div className="form-error" role="alert">{apiError}</div>}
          {actionMessage && <div className="report-action-message" style={styles.sourceNotice('api')}>{actionMessage}</div>}

          <div className="report-list" style={styles.listContainer}>
            {displayReports.length === 0 ? (
              <div style={styles.emptyState}>
                리포트 목록이 비어 있습니다.<br/>
                표시할 리포트가 없습니다.
              </div>
            ) : displayReports.map((report) => {
              const isExpanded = expandedId === report.id;
              const detail = detailDataById[report.id] ?? {};
              const detailStatus = detailStatusById[report.id] ?? 'idle';
              const detailError = detailErrorById[report.id] ?? '';
              const relatedArticles = Array.isArray(detail.relatedArticles)
                ? detail.relatedArticles.map((article, index) => mapReportDetailArticle(article, index, '관련'))
                : [];
              const counterArticles = Array.isArray(detail.counterArticles)
                ? detail.counterArticles.map((article, index) => mapReportDetailArticle(article, index, '반박'))
                : [];
              const activeArticles = innerTab === 'related' ? relatedArticles : counterArticles;
              const insights = Array.isArray(detail.insights)
                ? detail.insights.map((insight) => cleanDisplayText(insight, '')).filter(Boolean)
                : [];
              const summaryText = insights.length > 0 ? insights.join('\n\n') : report.summaryDesc;
              
              return (
                <div className="report-card" key={report.id} style={styles.reportCard(isExpanded)}>
                  <div className="report-card-header" style={styles.cardHeader}>
                    <div className="report-card-title-row" style={styles.cardTitleRow}>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(report.id)}
                        aria-label={favoriteReportIdSet.has(String(report.id)) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                        style={{ border: 0, background: 'transparent', color: favoriteReportIdSet.has(String(report.id)) ? '#fbbc04' : '#bdc1c6', fontSize: '20px', cursor: 'pointer', padding: 0 }}
                      >
                        ★
                      </button>
                      <span style={styles.cardTitle}>{report.title}</span>
                      <span style={styles.cardMeta}>검색일: {report.date} <span style={styles.statusBadge}>{report.status}</span></span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <button type="button" style={styles.actionBtn} onClick={() => copyReportSummary(report, summaryText)}>요약 복사</button>
                      <button type="button" style={{ ...styles.actionBtn, color: '#ea4335', borderColor: '#ea4335' }} onClick={() => removeReport(report)}>삭제</button>
                    </div>
                  </div>
                  
                  <div className="report-card-content-row" style={styles.cardContentRow}>
                    <div className="report-info-block" style={styles.infoBlock}>
                      <div style={styles.iconBox('#e8f0fe')}><span style={{fontSize:'18px'}}>📄</span></div>
                      <div style={styles.infoLabel}>관련 기사 <span style={styles.infoValue}>{report.relatedCount}건</span></div>
                    </div>
                    
                    <div className="report-info-block" style={styles.infoBlock}>
                      <div style={styles.iconBox('#fce8e6')}><span style={{fontSize:'18px'}}>🏛️</span></div>
                      <div style={styles.infoLabel}>반박 기사 <span style={styles.infoValue}>{report.unrelatedCount}건</span></div>
                    </div>
                    
                    <div className="report-info-block" style={{ ...styles.infoBlock, borderRight: 0, paddingRight: 0 }}>
                       <svg viewBox="0 0 40 20" style={{width: '40px', height: '20px', overflow: 'visible'}}>
                         <path d="M 5 20 A 15 15 0 0 1 35 20" fill="none" stroke="#e0e0e0" strokeWidth="4" />
                         <path d="M 5 20 A 15 15 0 0 1 25 5" fill="none" stroke="#fbbc04" strokeWidth="4" />
                       </svg>
                       <div style={styles.infoLabel}>신뢰도 평균 <span style={styles.infoValue}>{report.score} <span style={{fontSize:'12px', color:'#80868b', fontWeight:'normal'}}>/ 5</span></span></div>
                    </div>

                    {report.sources.length > 0 && (
                      <div className="report-source-wrap" style={{ flex: 1, paddingLeft: '12px' }}>
                        <div style={{fontSize: '12px', color: '#80868b', marginBottom: '8px'}}>주요 출처 신뢰도</div>
                        <div className="report-source-group" style={styles.sourceGroup}>
                          {report.sources.map((src, i) => (
                          <div key={i} style={styles.sourceItem}>
                            <div style={styles.sourceLogo(src.logo)}>
                              {src.name.charAt(0)}
                              {src.logoUrl && <img src={src.logoUrl} alt={`${src.name} 로고`} style={styles.sourceLogoImage} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
                            </div>
                            <span style={{fontSize:'12px', color:'#3c4043'}}>{src.name}</span>
                            {src.score && <span style={{fontSize:'12px', fontWeight:'bold', color:'#34a853', display:'flex', alignItems:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> {src.score}</span>}
                          </div>
                          ))}
                          {report.extraCount > 0 && (
                            <button type="button" style={{ ...styles.actionBtn, padding: '4px 8px' }} onClick={() => toggleReport(report)}>
                              +{report.extraCount} 더보기
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {!isExpanded && (
                      <div className="report-card-summary" style={{ width: '250px', fontSize: '13px', color: '#5f6368', lineHeight: '1.5', paddingLeft: '24px', borderLeft: '1px solid #e0e0e0' }}>
                        {report.summaryDesc}
                      </div>
                    )}

                    <button type="button" style={styles.detailBtn} onClick={() => toggleReport(report)}>
                      {isExpanded ? '접기' : '상세 보기'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={styles.expandedSection}>
                      <hr style={styles.expandedDivider} />
                      <div style={styles.expandedHeader}>
                         ✨ 기사 요약
                      </div>
                      <div className="report-expanded-tabs" style={styles.expandedTabs}>
                         <button type="button" style={{ ...styles.expandedTab(innerTab === 'related'), borderTop: 0, borderLeft: 0, borderRight: 0, background: 'transparent' }} onClick={() => setInnerTab('related')}>관련 기사 요약 ({relatedArticles.length})</button>
                         <button type="button" style={{ ...styles.expandedTab(innerTab === 'unrelated'), borderTop: 0, borderLeft: 0, borderRight: 0, background: 'transparent' }} onClick={() => setInnerTab('unrelated')}>반박 기사 요약 ({counterArticles.length})</button>
                      </div>
                      
                      <div className="report-expanded-content" style={styles.expandedContentBody}>
                         <div className="report-article-list-col" style={styles.articleListCol}>
                           {detailStatus === 'loading' ? (
                             <div style={styles.emptyState}>리포트 상세를 불러오는 중입니다.</div>
                           ) : detailStatus === 'error' ? (
                             <div style={styles.emptyState}>{detailError || '리포트 상세를 불러오지 못했습니다.'}</div>
                           ) : activeArticles.length === 0 ? (
                             <div style={styles.emptyState}>{innerTab === 'related' ? '관련 기사' : '반박 기사'} 목록이 비어 있습니다.</div>
                           ) : activeArticles.map((article) => (
                             <div className="report-article-list-item" key={article.id} style={styles.articleListItem}>
                               <span style={{fontSize:'16px', color:'#80868b'}}>•</span>
                               <span className="report-article-list-publisher" style={styles.articleListPublisher}>{article.press}</span>
                               {article.date && <span className="report-article-list-date" style={styles.articleListDate}>{article.date}</span>}
                               {article.url ? (
                                 <a href={article.url} target="_blank" rel="noopener noreferrer" style={styles.articleListLink}>
                                   {article.title}
                                 </a>
                               ) : (
                                 <span style={styles.articleListText}>{article.title}</span>
                               )}
                               <span className="report-article-list-action" style={styles.articleListAction}>{article.stance}</span>
                             </div>
                           ))}
                         </div>
                         <div className="report-summary-col" style={styles.summaryCol}>
                            <div style={styles.summaryColTitle}>종합 요약</div>
                            <div style={{ ...styles.summaryColText, whiteSpace: 'pre-line' }}>
                              {detailStatus === 'loading'
                                ? '상세 분석 요약을 불러오는 중입니다.'
                                : detailStatus === 'error'
                                  ? detailError || '상세 분석 요약을 불러오지 못했습니다.'
                                  : summaryText}
                            </div>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {hasApiReports && totalReportItems > REPORTS_PAGE_SIZE && (
            <div className="report-pagination" style={styles.paginationBar}>
              <div style={styles.paginationInfo}>
                총 {totalReportItems}개 중 {currentReportPage} / {totalReportPages}페이지
              </div>
              <div style={styles.paginationControls} aria-label="리포트 페이지 이동">
                <button
                  type="button"
                  style={styles.paginationBtn(false, currentReportPage <= 1)}
                  onClick={() => goToReportPage(currentReportPage - 1)}
                  disabled={currentReportPage <= 1}
                >
                  이전
                </button>
                {paginationPages.map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    style={styles.paginationBtn(pageNumber === currentReportPage)}
                    onClick={() => goToReportPage(pageNumber)}
                    aria-current={pageNumber === currentReportPage ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  style={styles.paginationBtn(false, currentReportPage >= totalReportPages)}
                  onClick={() => goToReportPage(currentReportPage + 1)}
                  disabled={currentReportPage >= totalReportPages}
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="report-global-footer" style={styles.globalFooter}>
        <span style={{fontSize:'16px'}}>🛡️</span> 모든 정보는 다양한 출처를 기반으로 수집되며, 최종 판단은 사용자에게 있습니다.
      </div>
    </div>
  );
}
