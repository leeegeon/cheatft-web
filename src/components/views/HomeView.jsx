import { useEffect, useState } from 'react';
import { getSummary } from '../../services/cheatftApi.js';
import { cleanDisplayText } from '../../utils/text.js';
import homeFactScale from '../../assets/home-fact-scale.png';

function getCheckTitle(check) {
  return cleanDisplayText(check?.title || check?.query || check?.content, '제목 없음');
}

function normalizeResult(result) {
  return String(result || '').toUpperCase();
}

function formatNumber(value) {
  return value === undefined || value === null || value === '' ? '-' : Number(value).toLocaleString('ko-KR');
}

export default function HomeView({ onSearch, onNavigate }) {
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState(null);
  const [summaryStatus, setSummaryStatus] = useState('loading');
  const [summaryError, setSummaryError] = useState('');

  useEffect(() => {
    let ignore = false;

    getSummary()
      .then((data) => {
        if (!ignore) {
          setSummary(data || {});
          setSummaryStatus('done');
          setSummaryError('');
        }
      })
      .catch((error) => {
        if (!ignore) {
          setSummary(null);
          setSummaryStatus('error');
          setSummaryError(error.message || '홈 데이터를 불러오지 못했습니다.');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const isSummaryLoading = summaryStatus === 'loading';
  const recentChecks = Array.isArray(summary?.recentChecks) ? summary.recentChecks : [];
  const todayStats = summary?.todayStats || {};

  const styles = {
    container: { padding: '0', backgroundColor: '#f8f9fa', minHeight: '100%', fontFamily: 'sans-serif', color: '#202124' },
    heroWrapper: { background: 'linear-gradient(135deg, #f0f4fd 0%, #ffffff 100%)', padding: '72px 40px', display: 'flex', justifyContent: 'center' },
    heroContent: { display: 'flex', maxWidth: '1180px', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: '34px' },
    heroLeft: { flex: '0 1 500px', maxWidth: '500px' },
    heroSubText: { fontSize: '14px', fontWeight: 'bold', color: '#5f6368', marginBottom: '14px' },
    heroTitle: { fontSize: '42px', fontWeight: '900', lineHeight: '1.28', color: '#1a2b49', marginBottom: '20px', letterSpacing: '-0.5px' },
    heroTitleHighlight: { color: '#0056d2' },
    heroDesc: { fontSize: '16px', color: '#5f6368', lineHeight: '1.58', marginBottom: '32px' },
    searchBox: { display: 'flex', gap: '10px', width: '100%', maxWidth: '470px', marginBottom: '10px' },
    searchInput: { flex: 1, minWidth: 0, padding: '15px 20px', fontSize: '15px', border: '1px solid #dadce0', borderRadius: '8px', outline: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' },
    searchBtn: { padding: '0 26px', backgroundColor: '#0056d2', color: '#ffffff', fontSize: '15px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    searchHint: { fontSize: '13px', color: '#80868b', marginBottom: '14px' },
    heroRight: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    heroImage: { width: 'min(100%, 640px)', height: 'auto', display: 'block' },
    mainContent: { maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' },
    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' },
    featureCard: { backgroundColor: '#ffffff', padding: '22px 24px', borderRadius: '16px', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' },
    featureIconWrap: { width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
    featureTitle: { fontSize: '19px', fontWeight: 'bold', marginBottom: '10px', color: '#202124' },
    featureDesc: { fontSize: '14px', color: '#5f6368', lineHeight: '1.45', marginBottom: '14px', flex: 1 },
    featureLink: { fontSize: '15px', fontWeight: 'bold', color: '#0056d2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
    bottomGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'stretch' },
    sideColumn: { display: 'flex', flexDirection: 'column', height: '100%' },
    sectionCard: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e0e0e0', padding: '28px', display: 'flex', flexDirection: 'column' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    sectionTitle: { fontSize: '20px', fontWeight: 'bold', color: '#202124' },
    sectionMore: { fontSize: '14px', color: '#80868b', cursor: 'pointer' },
    factCheckItem: { display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f1f3f4', gap: '20px' },
    factImagePlaceholder: { width: '80px', height: '60px', backgroundColor: '#f1f3f4', borderRadius: '8px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px' },
    factBadge: (isTrue) => ({ padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', color: '#ffffff', backgroundColor: isTrue ? '#34a853' : '#ea4335', marginBottom: '8px', display: 'inline-block' }),
    factTitle: { fontSize: '17px', fontWeight: 'bold', color: '#202124', marginBottom: '6px' },
    factMeta: { fontSize: '14px', color: '#80868b' },
    emptyState: { padding: '32px 20px', borderRadius: '12px', border: '1px dashed #dadce0', backgroundColor: '#fafbfc', color: '#5f6368', textAlign: 'center', lineHeight: '1.6' },
    responsibilityCard: { flex: 1, minHeight: '132px', justifyContent: 'center' },
    responsibilityIcon: { width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#e8f0fe', color: '#0056d2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
    responsibilityTitle: { fontSize: '18px', fontWeight: '800', color: '#202124', lineHeight: '1.45' },
    responsibilityDesc: { marginTop: '8px', fontSize: '14px', color: '#5f6368', lineHeight: '1.5' },
    statBox: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '20px 22px', display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
    statItem: { display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', gap: '8px', textAlign: 'center' },
    statLabel: { fontSize: '14px', color: '#5f6368', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statValue: { fontSize: '28px', fontWeight: 'bold', color: '#202124' }
  };

  return (
    <div style={styles.container}>
      <div className="home-hero-wrapper" style={styles.heroWrapper}>
        <div className="home-hero-content" style={styles.heroContent}>
          <div className="home-hero-left" style={styles.heroLeft}>
            <div className="korean-copy" style={styles.heroSubText}>가짜뉴스를 잡고, 신뢰할 수 있는 정보를 함께 만들어요</div>
            <div className="hero-title-copy" style={styles.heroTitle}>
              <span className="phrase-keep">진실은 <span style={styles.heroTitleHighlight}>검증</span>으로,</span>{' '}
              <span className="phrase-keep">정보는 <span style={styles.heroTitleHighlight}>공정하게.</span></span>
            </div>
            <div className="korean-copy hero-desc-copy" style={styles.heroDesc}>
              Cheat F/T는 가짜뉴스를 판별하고 정보의 신뢰도를 높여 더 나은 판단을 돕습니다.
            </div>
            <div className="home-search-box" style={styles.searchBox}>
              <input 
                type="text" 
                style={styles.searchInput} 
                placeholder="뉴스 제목이나 내용을 입력하세요" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onSearch(query)}
              />
              <button className="home-search-button" style={styles.searchBtn} onClick={() => onSearch(query)}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                신뢰도 분석
              </button>
            </div>
            <div style={styles.searchHint}>검증할 뉴스 제목이나 본문을 입력해보세요.</div>
          </div>
          <div className="home-hero-visual" style={styles.heroRight}>
            <img
              src={homeFactScale}
              alt="가짜뉴스 탐지와 사실 정보 확인을 저울로 표현한 Cheat F/T 일러스트"
              style={styles.heroImage}
            />
          </div>
        </div>
      </div>
      <div className="home-main-content" style={styles.mainContent}>
        <div className="home-features-grid" style={styles.featuresGrid}>
          <div className="home-feature-card" style={styles.featureCard}>
            <div className="home-feature-icon" style={{ ...styles.featureIconWrap, backgroundColor: '#e8f0fe', color: '#1a73e8' }}>
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            </div>
            <div className="home-feature-copy">
              <div className="home-feature-title" style={styles.featureTitle}>신뢰도 분석</div>
              <div className="home-feature-desc" style={styles.featureDesc}>기사나 콘텐츠의 출처 신뢰도를 다양한 근거로 분석합니다.</div>
              <div className="home-feature-link" style={styles.featureLink} onClick={() => onNavigate('search')}>신뢰도 분석하기 &gt;</div>
            </div>
          </div>
          <div className="home-feature-card" style={styles.featureCard}>
            <div className="home-feature-icon" style={{ ...styles.featureIconWrap, backgroundColor: '#e6f4ea', color: '#34a853' }}>
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99l7.76-4.47A9.957 9.957 0 0 0 13 2zm0 10.99V22c5.07-.5 9-4.79 9-10 0-1.7-.42-3.29-1.16-4.68z"/></svg>
            </div>
            <div className="home-feature-copy">
              <div className="home-feature-title" style={styles.featureTitle}>편향성 분석</div>
              <div className="home-feature-desc" style={styles.featureDesc}>뉴스 묶음의 관점 분포와 반박 기사를 비교해 정보 편향을 살펴봅니다.</div>
              <div className="home-feature-link" style={styles.featureLink} onClick={() => onNavigate('algo')}>편향성 분석하기 &gt;</div>
            </div>
          </div>
          <div className="home-feature-card" style={styles.featureCard}>
            <div className="home-feature-icon" style={{ ...styles.featureIconWrap, backgroundColor: '#f3e8fd', color: '#9334e6' }}>
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </div>
            <div className="home-feature-copy">
              <div className="home-feature-title" style={styles.featureTitle}>함께 만드는 건강한 정보 생태계</div>
              <div className="home-feature-desc" style={styles.featureDesc}>사용자의 참여로 더 정확한 검증과 신뢰할 수 있는 정보 환경을 만듭니다.</div>
              <div className="home-feature-link" style={styles.featureLink} onClick={() => onNavigate('community')}>참여하기 &gt;</div>
            </div>
          </div>
        </div>
        <div className="home-bottom-grid" style={styles.bottomGrid}>
          <div>
            <div className="home-section-card" style={styles.sectionCard}>
              <div style={{...styles.sectionHeader, cursor: 'pointer'}} onClick={() => onNavigate('search')}>
                <div style={styles.sectionTitle}>최신 팩트체크</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={styles.sectionMore}>더보기 &gt;</div>
                </div>
              </div>
              {isSummaryLoading ? (
                <div style={styles.emptyState}>
                  최신 팩트체크를 불러오는 중입니다.
                </div>
              ) : summaryStatus === 'error' ? (
                <div style={styles.emptyState}>
                  {summaryError}
                </div>
              ) : recentChecks.length === 0 ? (
                <div style={styles.emptyState}>
                  최신 팩트체크 목록이 비어 있습니다.<br/>
                  표시할 항목이 없습니다.
                </div>
              ) : recentChecks.map((check, index) => {
                const title = getCheckTitle(check);
                const result = normalizeResult(check.result);
                return (
                  <div
                    className="home-fact-check-item"
                    key={check.id ?? title}
                    style={index === 2 ? { ...styles.factCheckItem, borderBottom: 'none', cursor: 'pointer' } : { ...styles.factCheckItem, cursor: 'pointer' }}
                    onClick={() => onSearch(title)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onSearch(title);
                      }
                    }}
                  >
                    <div className="home-fact-image" style={styles.factImagePlaceholder}>📰</div>
                    <div className="home-fact-copy" style={{ flex: 1 }}>
                      <div style={styles.factBadge(result === 'TRUE')}>{result || '확인중'}</div>
                      <div style={styles.factTitle}>{title}</div>
                      <div style={styles.factMeta}>검증 결과: {result || '확인중'} &nbsp;|&nbsp; {check.timeAgo || '방금 전'}</div>
                    </div>
                    <div style={{ color: '#80868b' }}>&gt;</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="home-side-column" style={styles.sideColumn}>
            <div className="home-section-card" style={{ ...styles.sectionCard, marginBottom: '24px' }}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>오늘의 검증 통계 ⓘ</div>
              </div>
              <div className="home-stat-box" style={styles.statBox}>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statLabel, gap: '6px' }}>
                    <div style={{ width: '14px', height: '18px', backgroundColor: '#e8f0fe', borderRadius: '3px', border: '1px solid #1a73e8' }}></div> 검증 요청
                  </div>
                  <div style={styles.statValue}>{formatNumber(todayStats.requests)}</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statLabel, gap: '6px' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="14" height="14" fill="#34a853" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></div> 검증 완료
                  </div>
                  <div style={styles.statValue}>{formatNumber(todayStats.completed)}</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statLabel, gap: '6px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#9334e6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> 정확도
                  </div>
                  <div style={styles.statValue}>{todayStats.accuracyRate === undefined || todayStats.accuracyRate === null ? '-' : `${todayStats.accuracyRate}%`}</div>
                </div>
              </div>
            </div>
            <div className="home-section-card home-responsibility-card" style={{ ...styles.sectionCard, ...styles.responsibilityCard }}>
              <div style={styles.responsibilityIcon} aria-hidden="true">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15.59-3.59-3.58L8.83 11.6 11 13.76l4.59-4.59L17 10.59l-6 6z"/></svg>
              </div>
              <div style={styles.responsibilityTitle}>신뢰할 수 있는 정보, 모두의 책임입니다.</div>
              <div style={styles.responsibilityDesc}>확인하고 비교하는 작은 습관이 더 건강한 정보 환경을 만듭니다.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
