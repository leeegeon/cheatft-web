import { useEffect, useState } from 'react';
import { getReports } from '../../services/cheatftApi.js';

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

function mapApiReport(report, index) {
  const presses = report.mainPresses?.length ? report.mainPresses : ['-'];

  return {
    id: report.id ?? index + 1,
    title: report.topic,
    date: formatDateTime(report.searchTime),
    status: report.status || '분석 완료',
    relatedCount: report.relatedCount ?? 0,
    unrelatedCount: report.counterCount ?? 0,
    score: report.averageReliability ?? 0,
    sources: presses.slice(0, 3).map((press, pressIndex) => ({
      name: typeof press === 'number' ? `언론사 ${press}` : String(press),
      logo: ['#1a2b49', '#1a73e8', '#ea4335'][pressIndex % 3],
      score: report.averageReliability ? `${report.averageReliability}/5` : null,
    })),
    extraCount: Math.max(0, presses.length - 3),
    summaryDesc: report.summary || '백엔드 리포트 요약이 여기에 표시됩니다.',
  };
}

export default function ReportView() {
  const [expandedId, setExpandedId] = useState(4); // Default to the 4th item expanded as in the design
  const [innerTab, setInnerTab] = useState('related'); // 'related' | 'unrelated' | 'summary'
  const [reportData, setReportData] = useState(null);
  const [apiError, setApiError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [page] = useState(1);

  useEffect(() => {
    let ignore = false;

    getReports({
      keyword: keyword.trim(),
      date: dateFilter,
      score: scoreFilter,
      page,
      limit: 10,
    })
      .then((data) => {
        if (!ignore) setReportData(data);
      })
      .catch((error) => {
        if (!ignore && error.code !== 'API_NOT_CONFIGURED') {
          setApiError(error.message || '리포트를 불러오지 못했습니다.');
        }
      });

    return () => {
      ignore = true;
    };
  }, [dateFilter, keyword, page, scoreFilter]);

  const styles = {
    container: { backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', color: '#202124', display: 'flex', borderTop: '1px solid #e0e0e0' },
    
    // Left Sidebar
    sidebar: { width: '260px', flexShrink: 0, borderRight: '1px solid #e0e0e0', backgroundColor: '#fafbfc', padding: '24px 0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 71px)', overflowY: 'auto' },
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
    main: { flex: 1, padding: '40px', backgroundColor: '#ffffff', overflowY: 'auto', height: 'calc(100vh - 71px)' },
    mainHeader: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' },
    mainTitle: { fontSize: '24px', fontWeight: 'bold', color: '#202124' },
    mainDesc: { fontSize: '14px', color: '#5f6368' },
    
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
    statCard: { backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' },
    statIconWrapper: (bg) => ({ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }),
    statLabel: { fontSize: '13px', color: '#5f6368', marginBottom: '4px' },
    statValue: { fontSize: '20px', fontWeight: 'bold', color: '#202124' },
    
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    searchInput: { padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '14px', outline: 'none', width: '300px', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%2380868b\' viewBox=\'0 0 24 24\'><path d=\'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\'/></svg>")', backgroundPosition: '12px center', backgroundRepeat: 'no-repeat' },
    toolsRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    viewToggle: { display: 'flex', gap: '4px', backgroundColor: '#f1f3f4', padding: '4px', borderRadius: '8px' },
    viewBtn: (isActive) => ({ width: '32px', height: '32px', borderRadius: '4px', border: 'none', backgroundColor: isActive ? '#ffffff' : 'transparent', color: isActive ? '#1a73e8' : '#80868b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }),
    
    // List Item
    listContainer: { display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' },
    reportCard: (isExpanded) => ({ backgroundColor: '#ffffff', border: isExpanded ? '1px solid #1a73e8' : '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', transition: 'all 0.2s', boxShadow: isExpanded ? '0 4px 12px rgba(26, 115, 232, 0.1)' : 'none' }),
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    cardTitleRow: { display: 'flex', alignItems: 'center', gap: '12px' },
    cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#202124' },
    cardMeta: { fontSize: '13px', color: '#80868b', display: 'flex', alignItems: 'center', gap: '8px' },
    statusBadge: { padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e6f4ea', color: '#137333', fontSize: '12px', fontWeight: 'bold' },
    
    cardContentRow: { display: 'flex', alignItems: 'center', gap: '24px' },
    infoBlock: { display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid #e0e0e0', paddingRight: '24px' },
    infoLabel: { fontSize: '13px', color: '#5f6368', display: 'flex', flexDirection: 'column', gap: '4px' },
    infoValue: { fontSize: '16px', fontWeight: 'bold', color: '#202124' },
    iconBox: (bg) => ({ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }),
    
    sourceGroup: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
    sourceItem: { display: 'flex', alignItems: 'center', gap: '8px' },
    sourceLogo: (bg) => ({ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: bg, color: '#fff', fontSize: '9px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    sourceScore: { fontSize: '13px', fontWeight: 'bold', color: '#3c4043' },
    
    detailBtn: { padding: '8px 16px', border: '1px solid #dadce0', borderRadius: '20px', backgroundColor: '#ffffff', color: '#1a73e8', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' },
    
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
    articleListDate: { color: '#80868b', fontSize: '12px', width: '80px', flexShrink: 0 },
    articleListText: { color: '#3c4043', flex: 1, lineHeight: '1.5' },
    articleListAction: { color: '#1a73e8', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', width: '70px', textAlign: 'right', flexShrink: 0 },
    
    summaryCol: { flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '20px', display: 'flex', flexDirection: 'column' },
    summaryColTitle: { fontSize: '14px', fontWeight: 'bold', color: '#202124', marginBottom: '12px' },
    summaryColText: { fontSize: '13px', color: '#5f6368', lineHeight: '1.6', marginBottom: '24px', flex: 1 },
    downloadBtn: { width: '100%', padding: '10px', backgroundColor: '#ffffff', border: '1px solid #1a73e8', color: '#1a73e8', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },

    globalFooter: { borderTop: '1px solid #e0e0e0', padding: '16px 40px', fontSize: '12px', color: '#80868b', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff' }
  };

  const reports = [
    { id: 1, title: '백신 부작용 사망자 급증?', date: '2024.05.20 14:30', status: '분석 완료', relatedCount: 12, unrelatedCount: 9, score: 3.1, sources: [
      { name: 'KBS 뉴스', logo: '#1a2b49', score: '4/5' }, { name: '연합뉴스', logo: '#1a73e8', score: '4/5' }, { name: '뉴스1', logo: '#ea4335', score: null }
    ], extraCount: 9, summaryDesc: '질병관리청은 최근 제기된 백신 접종 후 사망 급증 주장에 대해 현재까지 인과성이 확인된 사례는 없다고 밝혔습니다.' },
    { id: 2, title: '기후변화는 인간의 영향이 아니다?', date: '2024.05.18 09:15', status: '분석 완료', relatedCount: 15, unrelatedCount: 11, score: 2.6, sources: [
      { name: 'BBC 코리아', logo: '#202124', score: '4/5' }, { name: '사이언스타임즈', logo: '#4285f4', score: '2/5' }, { name: '자유일보', logo: '#ea4335', score: null }
    ], extraCount: 12, summaryDesc: '다수의 과학적 연구는 최근 기후변화의 주요 원인이 인간 활동에 의한 것임을 지지하고 있습니다.' },
    { id: 3, title: '일본 후쿠시마 오염수 방류 안전하다?', date: '2024.05.15 16:40', status: '분석 완료', relatedCount: 14, unrelatedCount: 10, score: 2.9, sources: [
      { name: 'NHK 뉴스', logo: '#1a73e8', score: '4/5' }, { name: 'YTN', logo: '#00c4b4', score: '3/5' }, { name: '한겨레', logo: '#34a853', score: '2/5' }
    ], extraCount: 0, summaryDesc: '국제원자력기구(IAEA)는 일본의 방류 계획이 국제 안전 기준에 부합한다고 평가했습니다.' },
    { id: 4, title: 'AI가 일자리를 대체한다?', date: '2024.05.12 11:20', status: '분석 완료', relatedCount: 10, unrelatedCount: 8, score: 3.4, sources: [
      { name: '매일경제', logo: '#3c4043', score: '4/5' }, { name: '한국경제', logo: '#00c4b4', score: '4/5' }, { name: '조선비즈', logo: '#ea4335', score: null }
    ], extraCount: 7, summaryDesc: '전문가들은 AI가 일부 일자리를 대체할 수 있지만 새로운 일자리 창출도 동시에 일어날 것이라고 전망합니다.' },
  ];

  const displayReports = reportData?.reports?.length ? reportData.reports.map(mapApiReport) : reports;
  const totalStats = reportData?.totalStats || {
    searchedTopics: 18,
    analyzedArticles: 216,
    averageReliability: 3.2,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={styles.container}>
        {/* Left Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <div style={styles.sidebarTitle}>팩트체크 리포트</div>
            <div style={styles.sidebarDesc}>이전에 검색하고 분석한 내용을 한눈에 확인할 수 있습니다.</div>
            <button style={styles.primaryBtn}>+ 새 검색 시작</button>
          </div>

          <div style={styles.menuList}>
            <div style={styles.menuItem(true)}>
              <span style={styles.menuIcon}>📄 전체 리포트</span>
              <span style={styles.menuBadge}>{reportData?.pagination?.totalItems ?? displayReports.length}</span>
            </div>
            <div style={styles.menuItem(false)}>
              <span style={styles.menuIcon}>⭐ 즐겨찾기</span>
              <span style={styles.menuBadge}>3</span>
            </div>
            <div style={styles.menuItem(false)}>
              <span style={styles.menuIcon}>🕒 오늘</span>
              <span style={styles.menuBadge}>4</span>
            </div>
            <div style={styles.menuItem(false)}>
              <span style={styles.menuIcon}>📅 최근 7일</span>
              <span style={styles.menuBadge}>9</span>
            </div>
            <div style={styles.menuItem(false)}>
              <span style={styles.menuIcon}>🗓️ 최근 30일</span>
              <span style={styles.menuBadge}>18</span>
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.sidebarSection}>
            <div style={styles.filterTitle}>리포트 필터</div>
            <select style={styles.select} value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
              <option value="">날짜 선택</option>
              <option value="1">최근 1일</option>
              <option value="7">최근 7일</option>
              <option value="30">최근 30일</option>
            </select>
            <select style={styles.select} value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)}>
              <option value="">전체 신빙성 등급</option>
              <option value="4">4점 이상</option>
              <option value="3">3점 이상</option>
              <option value="2">2점 이상</option>
            </select>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.sidebarSection}>
            <div style={styles.filterTitle}>활용 팁</div>
            <div style={styles.sidebarDesc}>기사 요약을 통해 핵심 내용을 빠르게 파악하고, 다양한 관점을 비교하여 균형 잡힌 시각을 가져보세요.</div>
            <div style={{ textAlign: 'center', fontSize: '64px' }}>📋🔍</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          <div style={styles.mainHeader}>
            <div style={styles.mainTitle}>전체 리포트</div>
            <div style={styles.mainDesc}>지금까지 검색하고 분석한 모든 주제와 기사들을 확인하세요.</div>
          </div>

          <div style={styles.statsGrid}>
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
              <div style={styles.statIconWrapper('#e8f0fe')}><span style={{color:'#1a73e8'}}>🕒</span></div>
              <div>
                <div style={styles.statLabel}>총 검색 시간</div>
                <div style={styles.statValue}>12<span style={{fontSize:'14px', fontWeight:'normal'}}>시간</span> 34<span style={{fontSize:'14px', fontWeight:'normal'}}>분</span></div>
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

          <div style={styles.toolbar}>
            <input
              type="text"
              placeholder="검색한 주제나 키워드로 검색하세요"
              style={styles.searchInput}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <div style={styles.toolsRight}>
              <select style={{...styles.select, marginBottom: 0, width: '120px'}}><option>최신순</option></select>
              <div style={styles.viewToggle}>
                <button style={styles.viewBtn(true)}><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg></button>
                <button style={styles.viewBtn(false)}><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/></svg></button>
              </div>
            </div>
          </div>

          <div style={styles.listContainer}>
            {apiError && <div className="form-error" role="alert">{apiError}</div>}
            {displayReports.map((report) => {
              const isExpanded = expandedId === report.id;
              
              return (
                <div key={report.id} style={styles.reportCard(isExpanded)}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cardTitleRow}>
                      <span style={{color: '#fbbc04', fontSize: '20px', cursor: 'pointer'}}>★</span>
                      <span style={styles.cardTitle}>{report.title}</span>
                      <span style={styles.cardMeta}>검색일: {report.date} <span style={styles.statusBadge}>{report.status}</span></span>
                    </div>
                    <div style={{color: '#80868b', cursor: 'pointer', fontSize: '20px'}}>...</div>
                  </div>
                  
                  <div style={styles.cardContentRow}>
                    <div style={styles.infoBlock}>
                      <div style={styles.iconBox('#e8f0fe')}><span style={{fontSize:'18px'}}>📄</span></div>
                      <div style={styles.infoLabel}>관련 기사 <span style={styles.infoValue}>{report.relatedCount}건</span></div>
                    </div>
                    
                    <div style={styles.infoBlock}>
                      <div style={styles.iconBox('#fce8e6')}><span style={{fontSize:'18px'}}>🏛️</span></div>
                      <div style={styles.infoLabel}>반박 기사 <span style={styles.infoValue}>{report.unrelatedCount}건</span></div>
                    </div>
                    
                    <div style={styles.infoBlock}>
                       <svg viewBox="0 0 40 20" style={{width: '40px', height: '20px', overflow: 'visible'}}>
                         <path d="M 5 20 A 15 15 0 0 1 35 20" fill="none" stroke="#e0e0e0" strokeWidth="4" />
                         <path d="M 5 20 A 15 15 0 0 1 25 5" fill="none" stroke="#fbbc04" strokeWidth="4" />
                       </svg>
                       <div style={styles.infoLabel}>신뢰도 평균 <span style={styles.infoValue}>{report.score} <span style={{fontSize:'12px', color:'#80868b', fontWeight:'normal'}}>/ 5</span></span></div>
                    </div>

                    <div style={{ flex: 1, paddingLeft: '12px' }}>
                      <div style={{fontSize: '12px', color: '#80868b', marginBottom: '8px'}}>주요 출처 신뢰도</div>
                      <div style={styles.sourceGroup}>
                        {report.sources.map((src, i) => (
                          <div key={i} style={styles.sourceItem}>
                            <div style={styles.sourceLogo(src.logo)}>{src.name.charAt(0)}</div>
                            <span style={{fontSize:'12px', color:'#3c4043'}}>{src.name}</span>
                            {src.score && <span style={{fontSize:'12px', fontWeight:'bold', color:'#34a853', display:'flex', alignItems:'center'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> {src.score}</span>}
                          </div>
                        ))}
                        {report.extraCount > 0 && <span style={{fontSize:'12px', color:'#80868b'}}>+{report.extraCount} 더보기</span>}
                      </div>
                    </div>
                    
                    {!isExpanded && (
                      <div style={{ width: '250px', fontSize: '13px', color: '#5f6368', lineHeight: '1.5', paddingLeft: '24px', borderLeft: '1px solid #e0e0e0' }}>
                        {report.summaryDesc}
                      </div>
                    )}

                    <button style={styles.detailBtn} onClick={() => setExpandedId(isExpanded ? null : report.id)}>
                      {isExpanded ? '접기 ^' : '상세 보기 >'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={styles.expandedSection}>
                      <hr style={styles.expandedDivider} />
                      <div style={styles.expandedHeader}>
                         ✨ 기사 요약
                      </div>
                      <div style={styles.expandedTabs}>
                         <div style={styles.expandedTab(innerTab === 'related')} onClick={() => setInnerTab('related')}>관련 기사 요약 (10)</div>
                         <div style={styles.expandedTab(innerTab === 'unrelated')} onClick={() => setInnerTab('unrelated')}>반박 기사 요약 (8)</div>
                         <div style={styles.expandedTab(innerTab === 'summary')} onClick={() => setInnerTab('summary')}>종합 요약</div>
                      </div>
                      
                      <div style={styles.expandedContentBody}>
                         <div style={styles.articleListCol}>
                           {['매일경제', '한국경제', '조선비즈'].map((pub, i) => (
                             <div key={i} style={styles.articleListItem}>
                               <span style={{fontSize:'16px', color:'#80868b'}}>•</span>
                               <span style={styles.articleListPublisher}>{pub}</span>
                               <span style={styles.articleListDate}>(2024.05.12)</span>
                               <span style={styles.articleListText}>AI 기술 발전으로 단순 반복 업무의 자동화 가속화</span>
                               <span style={styles.articleListAction}>요약 보기 v</span>
                             </div>
                           ))}
                           <div style={{textAlign: 'center', color: '#1a73e8', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginTop: '12px'}}>더보기 v</div>
                         </div>
                         <div style={styles.summaryCol}>
                            <div style={styles.summaryColTitle}>종합 요약</div>
                            <div style={styles.summaryColText}>
                              대부분의 전문가들은 AI가 일부 일자리를 대체하겠지만, 새로운 산업과 직무를 창출하여 전체적인 일자리 수는 큰 변동이 없을 것이라고 전망합니다.<br/><br/>
                              핵심은 AI와의 협업 능력과 새로운 기술 습득이 중요하다는 의견이 지배적입니다.
                            </div>
                            <button style={styles.downloadBtn}>
                              전체 요약 다운로드 <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                            </button>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={styles.globalFooter}>
        <span style={{fontSize:'16px'}}>🛡️</span> 모든 정보는 다양한 출처를 기반으로 수집되며, 최종 판단은 사용자에게 있습니다.
      </div>
    </div>
  );
}
