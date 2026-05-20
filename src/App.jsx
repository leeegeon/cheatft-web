import { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setCurrentView('search');
  };

  const styles = {
    container: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#ffffff', overflow: 'hidden', fontFamily: 'sans-serif' },
    navbar: { height: '70px', display: 'flex', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid #e0e0e0', flexShrink: 0, justifyContent: 'space-between', backgroundColor: '#ffffff' },
    logoContainer: { display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' },
    logoText: { fontSize: '24px', fontWeight: '900', fontStyle: 'italic', color: '#1a2b49', letterSpacing: '-0.5px' },
    logoAccent: { color: '#0056d2' },
    navLinks: { display: 'flex', gap: '32px', height: '100%' },
    navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#5f6368', padding: '8px' },
    loginBtn: { background: '#ffffff', border: '1px solid #dadce0', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#3c4043', fontSize: '14px' },
    signupBtn: { backgroundColor: '#0056d2', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#ffffff', fontSize: '14px' },
    main: { flex: 1, backgroundColor: '#ffffff', color: '#000000', overflowY: 'auto', position: 'relative' }
  };

  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'search', label: '검증하기' },
    { id: 'algo', label: '알고리즘 분석' },
    { id: 'report', label: '팩트체크 리포트' },
    { id: 'community', label: '교육 & 정보' },
    { id: 'mypage', label: '마이페이지' },
  ];

  return (
    <div style={styles.container}>
      {/* Top Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logoContainer} onClick={() => { setCurrentView('home'); setSearchQuery(''); }}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2C10.059 2 2 10.059 2 20C2 29.941 10.059 38 20 38C29.941 38 38 29.941 38 20C38 10.059 29.941 2 20 2ZM13 13H27V16H13V13ZM13 18.5H27V21.5H13V18.5ZM13 24H27V27H13V24Z" fill="#0056d2"/>
            <path d="M28 28L36 36" stroke="#1a2b49" strokeWidth="4" strokeLinecap="round"/>
          </svg>
          <div style={styles.logoText}>Cheat F/<span style={styles.logoAccent}>T</span></div>
        </div>
        <div style={styles.navLinks}>
          {navItems.map(item => {
            const isActive = currentView === item.id || (item.id === 'list' && item.id === 'search');
            return (
              <div
                key={item.id}
                onClick={() => { setCurrentView(item.id); if(item.id === 'search') setSearchQuery(''); }}
                style={{
                  display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer',
                  fontWeight: isActive ? 'bold' : '500', color: isActive ? '#0056d2' : '#3c4043',
                  borderBottom: isActive ? '3px solid #0056d2' : '3px solid transparent',
                  boxSizing: 'border-box', fontSize: '15px'
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
        <div style={styles.navRight}>
          <button style={styles.iconBtn}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
          {currentView === 'mypage' ? (
            <>
               <button style={styles.iconBtn}><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg></button>
               <button style={styles.signupBtn} onClick={() => setCurrentView('community_write')}>검증 기록</button>
            </>
          ) : currentView === 'community' ? (
             <>
               <button style={styles.iconBtn}><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg></button>
               <button style={styles.iconBtn}><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></button>
               <button style={styles.signupBtn}>글 작성하기</button>
             </>
          ) : (
            <>
              <button style={styles.loginBtn}>로그인</button>
              <button style={styles.signupBtn}>회원가입</button>
            </>
          )}
        </div>
      </div>

      <div style={styles.main}>
        {currentView === 'home' && <HomeView onNavigate={setCurrentView} onSearch={handleSearch} />}
        {(currentView === 'search' || currentView === 'list') && (
          <VerificationView query={searchQuery} onSearch={handleSearch} onArticleClick={() => setCurrentView('article')} />
        )}
        {currentView === 'article' && <DetailView type="뉴스" />}
        {currentView === 'community' && <CommunityView onPostClick={() => setCurrentView('community_detail')} />}
        {currentView === 'community_detail' && <DetailView type="커뮤니티" />}
        {currentView === 'mypage' && <MyPageView />}
        
        {currentView === 'algo' && <div style={{padding: '60px', textAlign: 'center', fontSize: '18px', color: '#5f6368'}}>알고리즘 분석 화면 준비중입니다.</div>}
        {currentView === 'report' && <div style={{padding: '60px', textAlign: 'center', fontSize: '18px', color: '#5f6368'}}>팩트체크 리포트 화면 준비중입니다.</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// HomeView
// ---------------------------------------------------------
function HomeView({ onSearch, onNavigate }) {
  const [query, setQuery] = useState('');

  const styles = {
    container: { padding: '0', backgroundColor: '#f8f9fa', minHeight: '100%', fontFamily: 'sans-serif', color: '#202124' },
    heroWrapper: { background: 'linear-gradient(135deg, #f0f4fd 0%, #ffffff 100%)', padding: '80px 40px', display: 'flex', justifyContent: 'center' },
    heroContent: { display: 'flex', maxWidth: '1200px', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: '40px' },
    heroLeft: { flex: 1, maxWidth: '560px' },
    heroSubText: { fontSize: '15px', fontWeight: 'bold', color: '#5f6368', marginBottom: '16px' },
    heroTitle: { fontSize: '48px', fontWeight: '900', lineHeight: '1.3', color: '#1a2b49', marginBottom: '24px', letterSpacing: '-1px' },
    heroTitleHighlight: { color: '#0056d2' },
    heroDesc: { fontSize: '18px', color: '#5f6368', lineHeight: '1.6', marginBottom: '40px' },
    searchBox: { display: 'flex', gap: '12px', marginBottom: '12px' },
    searchInput: { flex: 1, padding: '18px 24px', fontSize: '16px', border: '1px solid #dadce0', borderRadius: '8px', outline: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' },
    searchBtn: { padding: '0 32px', backgroundColor: '#0056d2', color: '#ffffff', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    searchHint: { fontSize: '14px', color: '#80868b' },
    heroRight: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    mainContent: { maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' },
    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' },
    featureCard: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' },
    featureIconWrap: { width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
    featureTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#202124' },
    featureDesc: { fontSize: '15px', color: '#5f6368', lineHeight: '1.5', marginBottom: '24px', flex: 1 },
    featureLink: { fontSize: '15px', fontWeight: 'bold', color: '#0056d2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
    bottomGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' },
    sectionCard: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e0e0e0', padding: '32px', display: 'flex', flexDirection: 'column' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    sectionTitle: { fontSize: '20px', fontWeight: 'bold', color: '#202124' },
    sectionMore: { fontSize: '14px', color: '#80868b', cursor: 'pointer' },
    factCheckItem: { display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f1f3f4', gap: '20px' },
    factImagePlaceholder: { width: '80px', height: '60px', backgroundColor: '#f1f3f4', borderRadius: '8px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px' },
    factBadge: (isTrue) => ({ padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', color: '#ffffff', backgroundColor: isTrue ? '#34a853' : '#ea4335', marginBottom: '8px', display: 'inline-block' }),
    factTitle: { fontSize: '17px', fontWeight: 'bold', color: '#202124', marginBottom: '6px' },
    factMeta: { fontSize: '14px', color: '#80868b' },
    promoBanner: { marginTop: '24px', backgroundColor: '#3b5bdb', borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ffffff' },
    statBox: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' },
    statItem: { display: 'flex', flexDirection: 'column', gap: '8px' },
    statLabel: { fontSize: '14px', color: '#5f6368' },
    statValue: { fontSize: '28px', fontWeight: 'bold', color: '#202124' },
    algoGaugeContainer: { display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '24px' },
    algoGauge: { width: '120px', height: '120px', borderRadius: '50%', border: '16px solid #e8f0fe', borderLeftColor: '#00c4b4', borderBottomColor: '#00c4b4', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transform: 'rotate(-45deg)' },
    algoGaugeInner: { transform: 'rotate(45deg)', textAlign: 'center' },
    algoGaugeScore: { fontSize: '32px', fontWeight: 'bold', color: '#202124', lineHeight: '1' },
    algoGaugeLabel: { fontSize: '14px', color: '#5f6368', marginTop: '4px' },
    algoBarRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' },
    algoBarLabel: { width: '40px', fontSize: '14px', color: '#5f6368' },
    algoBarTrack: { flex: 1, height: '8px', backgroundColor: '#f1f3f4', borderRadius: '4px', overflow: 'hidden' },
    algoBarFill: (width, color) => ({ height: '100%', width, backgroundColor: color, borderRadius: '4px' }),
    algoBarValue: { width: '40px', fontSize: '14px', color: '#202124', textAlign: 'right' },
    algoBarStatus: { width: '60px', fontSize: '13px', color: '#80868b', textAlign: 'right' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.heroWrapper}>
        <div style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <div style={styles.heroSubText}>가짜뉴스를 잡고, 편향 없는 정보를 함께 만들어요</div>
            <div style={styles.heroTitle}>
              진실은 <span style={styles.heroTitleHighlight}>검증</span>으로,<br/>
              정보는 <span style={styles.heroTitleHighlight}>공정하게.</span>
            </div>
            <div style={styles.heroDesc}>
              Cheat F/T는 가짜뉴스를 판별하고<br/>
              알고리즘의 편향성을 줄여 더 나은 정보를 만듭니다.
            </div>
            <div style={styles.searchBox}>
              <input 
                type="text" 
                style={styles.searchInput} 
                placeholder="뉴스 제목이나 내용을 입력하세요" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onSearch(query)}
              />
              <button style={styles.searchBtn} onClick={() => onSearch(query)}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                검증하기
              </button>
            </div>
            <div style={styles.searchHint}>예시: "OOO 백신 부작용 사망자 급증?"</div>
          </div>
          <div style={styles.heroRight}>
            <div style={{ width: '360px', height: '280px', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '0', left: '10%', width: '80%', height: '30px', background: 'radial-gradient(ellipse, #e8f0fe 0%, transparent 70%)' }}></div>
              <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '160px', height: '40px', backgroundColor: '#e8f0fe', borderRadius: '50% 50% 0 0' }}></div>
              <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '24px', height: '200px', backgroundColor: '#1a2b49', borderRadius: '12px' }}></div>
              <div style={{ position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '8px', backgroundColor: '#1a2b49', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', top: '58px', left: '30px', width: '2px', height: '100px', backgroundColor: '#1a2b49' }}></div>
              <div style={{ position: 'absolute', top: '158px', left: '-20px', width: '102px', height: '20px', backgroundColor: '#ffcdd2', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', top: '70px', left: '-10px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', textAlign: 'center', width: '80px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' }}>FALSE</div>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#fce8e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <span style={{ color: '#ea4335', fontWeight: 'bold', fontSize: '20px' }}>!</span>
                </div>
              </div>
              <div style={{ position: 'absolute', top: '58px', right: '30px', width: '2px', height: '120px', backgroundColor: '#1a2b49' }}></div>
              <div style={{ position: 'absolute', top: '178px', right: '-20px', width: '102px', height: '20px', backgroundColor: '#c8e6c9', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', top: '90px', right: '-10px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', textAlign: 'center', width: '80px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' }}>TRUE</div>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <svg width="24" height="24" fill="#34a853" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                </div>
              </div>
              <div style={{ position: 'absolute', top: '20px', left: '-50px', backgroundColor: '#ffffff', padding: '8px 16px', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', fontSize: '13px', color: '#ea4335', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                <span style={{ fontSize: '16px' }}>×</span> 가짜뉴스 탐지
              </div>
              <div style={{ position: 'absolute', top: '120px', right: '-80px', backgroundColor: '#ffffff', padding: '8px 16px', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', fontSize: '13px', color: '#34a853', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg> 사실 정보 확인
              </div>
              <div style={{ position: 'absolute', bottom: '0px', left: '120px', backgroundColor: '#e8f0fe', padding: '8px 16px', borderRadius: '24px', fontSize: '13px', color: '#1a73e8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                📊 알고리즘 편향성 분석
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={styles.mainContent}>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={{ ...styles.featureIconWrap, backgroundColor: '#e8f0fe', color: '#1a73e8' }}>
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            </div>
            <div style={styles.featureTitle}>가짜뉴스 검증</div>
            <div style={styles.featureDesc}>기사나 콘텐츠의 사실 여부를 다양한 출처와 근거로 검증합니다.</div>
            <div style={styles.featureLink} onClick={() => onNavigate('search')}>지금 검증해보기 &gt;</div>
          </div>
          <div style={styles.featureCard}>
            <div style={{ ...styles.featureIconWrap, backgroundColor: '#e6f4ea', color: '#34a853' }}>
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99l7.76-4.47A9.957 9.957 0 0 0 13 2zm0 10.99V22c5.07-.5 9-4.79 9-10 0-1.7-.42-3.29-1.16-4.68z"/></svg>
            </div>
            <div style={styles.featureTitle}>알고리즘 편향성 분석</div>
            <div style={styles.featureDesc}>추천 알고리즘의 편향성을 분석하고 균형 잡힌 정보 소비를 돕습니다.</div>
            <div style={styles.featureLink} onClick={() => onNavigate('algo')}>분석해보기 &gt;</div>
          </div>
          <div style={styles.featureCard}>
            <div style={{ ...styles.featureIconWrap, backgroundColor: '#f3e8fd', color: '#9334e6' }}>
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </div>
            <div style={styles.featureTitle}>함께 만드는 건강한 정보 생태계</div>
            <div style={styles.featureDesc}>사용자의 참여로 더 정확한 검증과 공정한 알고리즘 환경을 만듭니다.</div>
            <div style={styles.featureLink} onClick={() => onNavigate('community')}>참여하기 &gt;</div>
          </div>
        </div>
        <div style={styles.bottomGrid}>
          <div>
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>최신 팩트체크</div>
                <div style={styles.sectionMore}>더보기 &gt;</div>
              </div>
              <div style={styles.factCheckItem}>
                <div style={styles.factImagePlaceholder}>💊</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.factBadge(false)}>FALSE</div>
                  <div style={styles.factTitle}>"OOO 백신 부작용 사망자 급증?"</div>
                  <div style={styles.factMeta}>검증 결과: False &nbsp;|&nbsp; 2시간 전</div>
                </div>
                <div style={{ color: '#80868b' }}>&gt;</div>
              </div>
              <div style={styles.factCheckItem}>
                <div style={styles.factImagePlaceholder}>🌍</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.factBadge(true)}>TRUE</div>
                  <div style={styles.factTitle}>"지구온난화는 인위적인 조작이다?"</div>
                  <div style={styles.factMeta}>검증 결과: True &nbsp;|&nbsp; 5시간 전</div>
                </div>
                <div style={{ color: '#80868b' }}>&gt;</div>
              </div>
              <div style={{ ...styles.factCheckItem, borderBottom: 'none' }}>
                <div style={styles.factImagePlaceholder}>🍲</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.factBadge(false)}>FALSE</div>
                  <div style={styles.factTitle}>"OOO 식품이 암을 치료한다?"</div>
                  <div style={styles.factMeta}>검증 결과: False &nbsp;|&nbsp; 1일 전</div>
                </div>
                <div style={{ color: '#80868b' }}>&gt;</div>
              </div>
            </div>
            <div style={styles.promoBanner}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" fill="#ffffff" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px' }}>신뢰할 수 있는 정보, 모두의 책임입니다.</div>
                  <div style={{ fontSize: '15px', opacity: '0.9' }}>Cheat F/T와 함께 더 나은 디지털 세상을 만들어가요.</div>
                </div>
              </div>
              <button style={{ padding: '14px 24px', backgroundColor: '#ffffff', color: '#3b5bdb', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                Cheat F/T 소개 보기 &gt;
              </button>
            </div>
          </div>
          <div>
            <div style={{ ...styles.sectionCard, marginBottom: '24px' }}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>오늘의 검증 통계 ⓘ</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statLabel, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '14px', height: '18px', backgroundColor: '#e8f0fe', borderRadius: '3px', border: '1px solid #1a73e8' }}></div> 검증 요청
                  </div>
                  <div style={styles.statValue}>1,248</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statLabel, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="14" height="14" fill="#34a853" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></div> 검증 완료
                  </div>
                  <div style={styles.statValue}>842</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statLabel, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#9334e6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> 정확도
                  </div>
                  <div style={styles.statValue}>91%</div>
                </div>
              </div>
            </div>
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>알고리즘 편향성 현황 ⓘ</div>
                <div style={styles.sectionMore}>자세히 보기 &gt;</div>
              </div>
              <div style={styles.algoGaugeContainer}>
                <div style={styles.algoGauge}>
                  <div style={styles.algoGaugeInner}>
                    <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '2px' }}>편향 지수</div>
                    <div style={styles.algoGaugeScore}>32</div>
                    <div style={styles.algoGaugeLabel}>보통</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[
                    { label: '정치', value: 28, max: 100, color: '#00c4b4', status: '보통' },
                    { label: '사회', value: 45, max: 100, color: '#1a73e8', status: '다소 높음' },
                    { label: '경제', value: 31, max: 100, color: '#1a73e8', status: '보통' },
                    { label: '과학', value: 22, max: 100, color: '#34a853', status: '낮음' },
                    { label: '문화', value: 18, max: 100, color: '#34a853', status: '낮음' }
                  ].map(item => (
                    <div key={item.label} style={styles.algoBarRow}>
                      <div style={styles.algoBarLabel}>{item.label}</div>
                      <div style={styles.algoBarTrack}>
                        <div style={styles.algoBarFill(`${item.value}%`, item.color)}></div>
                      </div>
                      <div style={styles.algoBarValue}>{item.value}</div>
                      <div style={styles.algoBarStatus}>{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// VerificationView (검증하기)
// ---------------------------------------------------------
function VerificationView({ query, onSearch, onArticleClick }) {
  const [val, setVal] = useState(query || '');

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
    gaugeArc: (color) => ({ width: '120px', height: '60px', overflow: 'hidden', position: 'relative', marginBottom: '8px' }),
    gaugeArcInner: (color, percent) => ({ width: '120px', height: '120px', borderRadius: '50%', border: '16px solid #f1f3f4', borderTopColor: color, borderRightColor: color, transform: `rotate(${percent}deg)`, boxSizing: 'border-box' }),
    gaugeScore: { fontWeight: 'bold', fontSize: '16px', color: '#202124', textAlign: 'center', marginTop: '-20px' },
    gaugeSub: { fontSize: '12px', color: '#80868b', marginTop: '4px' },
    gaugeHint: { fontSize: '12px', color: '#80868b', textAlign: 'center', marginTop: '12px', lineHeight: '1.4' },
    bottomDisclaimer: { marginTop: '32px', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' }
  };

  const results = [
    { pub: 'KBS 뉴스', logo: 'KBS', color: '#1a73e8', date: '2024.05.20', title: '질병청 “백신 접종 후 사망 사례, 인과성 확인 안돼”', desc: '질병관리청은 최근 제기된 백신 접종 후 사망 급증 주장에 대해 현재까지 인과성이 확인된 사례는 없다고 밝혔습니다...', scoreText: '신용 가능', score: '5 / 5', scoreColor: '#00c4b4', rotation: 45, hint: '이 출처는 높은 신뢰도를 가진 공식력 있는 언론/기관입니다.' },
    { pub: '연합뉴스', logo: '연합', color: '#1a73e8', date: '2024.05.20', title: '전문가 “백신과 사망 간 연관성 매우 낮아”', desc: '의료 전문가들은 백신 접종과 사망 간의 연관성을 입증할 과학적 근거가 부족하다고 설명했습니다...', scoreText: '신뢰 가능', score: '4 / 5', scoreColor: '#8bc34a', rotation: 9, hint: '이 출처는 비교적 신뢰할 수 있는 언론/기관입니다.' },
    { pub: '뉴스1', logo: 'n', color: '#ea4335', date: '2024.05.19', title: '일부 지자체서 백신 접종 후 사망 신고 잇따라', desc: '전국 일부 지역에서 백신 접종 후 사망 신고가 잇따르고 있어 당국이 조사에 나섰습니다...', scoreText: '보통', score: '3 / 5', scoreColor: '#fbbc04', rotation: -27, hint: '이 출처의 정보는 일부 사실 기반이나 검증이 더 필요할 수 있습니다.' },
    { pub: 'OO일보', logo: 'OO', color: '#8ab4f8', date: '2024.05.19', title: '백신 부작용으로 인한 사망자 수 급증 추세', desc: '백신 접종 이후 예상치 못한 사망 사례가 빠르게 늘어나고 있다는 주장이 제기되고 있습니다...', scoreText: '주의', score: '2 / 5', scoreColor: '#ff9800', rotation: -63, hint: '이 출처는 신뢰도가 낮거나 편향된 보도일 가능성이 있습니다.' },
    { pub: 'Truth News', logo: 'TN', color: '#202124', date: '2024.05.18', title: '숨겨진 진실! 백신이 사망 원인이다', desc: '정부와 제약회사가 숨기고 있는 백신의 치명적 부작용 실체를 밝힙니다. 더 이상 침묵하지 마세요...', scoreText: '신뢰 불가', score: '1 / 5', scoreColor: '#ea4335', rotation: -99, hint: '이 출처는 검증되지 않은 정보나 허위 정보일 가능성이 매우 높습니다.' },
  ];

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
                <div style={{ color: '#5f6368', marginTop: '8px' }}>검색 결과 총 12건의 관련 기사를 찾았습니다.</div>
              </div>
              <div style={styles.resultMeta}>검색 시간: 2024.05.20 14:30</div>
            </div>

            <div style={styles.filters}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select style={{ padding: '8px 32px 8px 12px', borderRadius: '6px', border: '1px solid #dadce0', backgroundColor: '#fff', fontSize: '14px', outline: 'none' }}><option>전체 출처</option></select>
                <select style={{ padding: '8px 32px 8px 12px', borderRadius: '6px', border: '1px solid #dadce0', backgroundColor: '#fff', fontSize: '14px', outline: 'none' }}><option>최신순</option></select>
              </div>
              <div style={{ fontSize: '13px', color: '#5f6368', cursor: 'pointer' }}>신빙성 등급 안내 ⓘ</div>
            </div>

            {results.map((res, i) => (
              <div key={i} style={styles.articleCard} onClick={onArticleClick}>
                <div style={{ flex: 1, paddingRight: '40px' }}>
                  <div style={styles.articleMeta}>
                    <div style={styles.publisherLogo(res.color)}>{res.logo}</div>
                    <span style={styles.publisher}>{res.pub}</span>
                    <span style={styles.date}>{res.date}</span>
                  </div>
                  <div style={styles.articleTitle}>{res.title}</div>
                  <div style={styles.articleDesc}>{res.desc}</div>
                  <div style={styles.linkBtn}>기사 보기 <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg></div>
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
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#80868b' }}>
            <svg width="64" height="64" fill="#dadce0" viewBox="0 0 24 24" style={{marginBottom:'16px'}}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            <div style={{ fontSize: '18px' }}>좌측에서 검증할 정보를 검색해주세요.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// MyPageView (마이페이지)
// ---------------------------------------------------------
function MyPageView() {
  const styles = {
    container: { display: 'flex', backgroundColor: '#f8f9fa', minHeight: '100%', padding: '40px', gap: '32px', maxWidth: '1400px', margin: '0 auto' },
    sidebar: { width: '280px', flexShrink: 0 },
    profileBox: { backgroundColor: '#f0f4f9', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
    avatar: { width: '56px', height: '56px', backgroundColor: '#d2e3fc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    menuList: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '32px' },
    menuItem: (isActive) => ({ padding: '14px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: isActive ? 'bold' : 'normal', backgroundColor: isActive ? '#e8f0fe' : 'transparent', color: isActive ? '#1a73e8' : '#3c4043', transition: 'background 0.2s' }),
    boxInfo: { backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '24px', marginBottom: '24px' },
    boxTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#202124' },
    statRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#5f6368' },
    statVal: { fontWeight: 'bold', color: '#202124' },
    detailBtn: { color: '#0056d2', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'right', marginTop: '8px' },
    streakBox: { backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '24px' },
    streakTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '16px', color: '#202124', marginBottom: '16px' },
    circles: { display: 'flex', gap: '8px', marginBottom: '12px' },
    circle: (active) => ({ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: active ? '#00c4b4' : '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }),
    
    mainPanel: { flex: 1 },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' },
    pageTitle: { fontSize: '28px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' },
    pageDesc: { fontSize: '15px', color: '#5f6368' },
    datePicker: { padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    
    topStatsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative' },
    statIconBox: (color) => ({ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }),
    statCardTitle: { fontSize: '13px', color: '#5f6368', marginBottom: '8px' },
    statCardVal: { fontSize: '24px', fontWeight: 'bold', color: '#202124' },
    statCardTrend: (isUp) => ({ fontSize: '13px', fontWeight: 'bold', color: isUp ? '#34a853' : '#ea4335', position: 'absolute', bottom: '20px', right: '20px' }),

    middleGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '24px', marginBottom: '24px' },
    card: { backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    cardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#202124' },
    
    // Bottom grid
    bottomGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '24px' },
  };

  return (
    <div style={styles.container}>
      {/* Left Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.profileBox}>
          <div style={styles.avatar}>
            <svg width="32" height="32" fill="#1a73e8" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#202124' }}>사용자 님</span>
              <span style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Lv. 4</span>
            </div>
            <div style={{ fontSize: '13px', color: '#5f6368' }}>신뢰 탐색자<br/>가입일 2024.04.12</div>
          </div>
        </div>

        <div style={styles.menuList}>
          <div style={styles.menuItem(true)}>📊 개인 분석</div>
          <div style={styles.menuItem(false)}>📋 검증 기록</div>
          <div style={styles.menuItem(false)}>⭐ 관심 주제</div>
          <div style={styles.menuItem(false)}>🔖 저장한 기사</div>
          <div style={styles.menuItem(false)}>💬 내 활동 <span style={{marginLeft:'auto'}}>v</span></div>
          <div style={styles.menuItem(false)}>🔔 알림 설정</div>
          <div style={styles.menuItem(false)}>⚙️ 계정 설정</div>
        </div>

        <div style={styles.boxInfo}>
          <div style={styles.boxTitle}>나의 기여 현황</div>
          <div style={styles.statRow}><span>의견 공유</span><span style={styles.statVal}>23 회</span></div>
          <div style={styles.statRow}><span>정정 요청</span><span style={styles.statVal}>7 회</span></div>
          <div style={styles.statRow}><span>지식 공동체 답변</span><span style={styles.statVal}>15 회</span></div>
          <div style={styles.statRow}><span>좋아요 받은 수</span><span style={styles.statVal}>128 회</span></div>
          <div style={styles.detailBtn}>상세 보기 &gt;</div>
        </div>

        <div style={styles.streakBox}>
          <div style={styles.streakTitle}><span style={{fontSize:'24px'}}>🔥</span> 7일 연속<br/>연속 활동 중!</div>
          <div style={styles.circles}>
            {[1,1,1,1,1,0,0].map((active, i) => (
              <div key={i} style={styles.circle(active)}>{active ? '✓' : ''}</div>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: '#5f6368', textAlign: 'center' }}>14일 연속 시 뱃지 지급!</div>
        </div>
      </div>

      {/* Main Panel */}
      <div style={styles.mainPanel}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.pageTitle}>개인 분석</div>
            <div style={styles.pageDesc}>Cheat F/T와 함께한 활동을 분석하고, 더 균형 잡힌 시각을 가져보세요.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#5f6368' }}>분석 기간</span>
            <div style={styles.datePicker}>최근 30일 📅</div>
          </div>
        </div>

        <div style={styles.topStatsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIconBox('#e8f0fe')}><span style={{fontSize:'20px'}}>🔍</span></div>
            <div style={styles.statCardTitle}>총 검색 횟수</div>
            <div style={styles.statCardVal}>58 <span style={{fontSize:'16px'}}>회</span></div>
            <div style={styles.statCardTrend(true)}>↑ 16%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIconBox('#e8f0fe')}><span style={{fontSize:'20px'}}>📄</span></div>
            <div style={styles.statCardTitle}>검증한 기사 수</div>
            <div style={styles.statCardVal}>42 <span style={{fontSize:'16px'}}>건</span></div>
            <div style={styles.statCardTrend(true)}>↑ 22%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIconBox('#f3e8fd')}><span style={{fontSize:'20px'}}>📊</span></div>
            <div style={styles.statCardTitle}>팩트체크 리포트</div>
            <div style={styles.statCardVal}>19 <span style={{fontSize:'16px'}}>개</span></div>
            <div style={styles.statCardTrend(true)}>↑ 19%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIconBox('#fce8e6')}><span style={{fontSize:'20px'}}>💬</span></div>
            <div style={styles.statCardTitle}>커뮤니티 활동</div>
            <div style={styles.statCardVal}>31 <span style={{fontSize:'16px'}}>회</span></div>
            <div style={styles.statCardTrend(true)}>↑ 8%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIconBox('#e6f4ea')}><span style={{fontSize:'20px'}}>✓</span></div>
            <div style={styles.statCardTitle}>평균 신뢰도 점수</div>
            <div style={styles.statCardVal}>3.2 / 5</div>
            <div style={styles.statCardTrend(true)}>↑ 0.4점</div>
          </div>
        </div>

        <div style={styles.middleGrid}>
          {/* 성향 분석 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>나의 정보 소비 성향 분석 ⓘ</div>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '16px', alignSelf: 'flex-start' }}>최근 30일 기준</div>
                <div style={{ width: '160px', height: '80px', overflow: 'hidden', position: 'relative', marginBottom: '16px' }}>
                  {/* Mock Arc */}
                  <div style={{ width: '160px', height: '160px', borderRadius: '50%', border: '16px solid #ea4335', borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: 'rotate(45deg)', boxSizing: 'border-box', position: 'absolute' }}></div>
                  <div style={{ width: '160px', height: '160px', borderRadius: '50%', border: '16px solid #fbbc04', borderBottomColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(45deg)', boxSizing: 'border-box', position: 'absolute' }}></div>
                  <div style={{ width: '160px', height: '160px', borderRadius: '50%', border: '16px solid #34a853', borderBottomColor: 'transparent', borderRightColor: 'transparent', borderTopColor: 'transparent', transform: 'rotate(45deg)', boxSizing: 'border-box', position: 'absolute' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '12px', fontWeight: 'bold' }}>
                  <div style={{ color: '#34a853', textAlign: 'center' }}>긍정<br/>10 (71%)</div>
                  <div style={{ color: '#fbbc04', textAlign: 'center' }}>중도<br/>2 (14%)</div>
                  <div style={{ color: '#ea4335', textAlign: 'center' }}>부정<br/>0 (0%)</div>
                </div>
                <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#fff8e1', border: '1px solid #ffecb3', borderRadius: '8px', fontSize: '12px', color: '#d84315', lineHeight: '1.4' }}>
                  <strong>! 현재 긍정적인 정보가 다소 많습니다.</strong><br/>다양한 관점의 정보를 확인해보세요.
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '16px', textAlign: 'right' }}>주제별 성향 분포 &nbsp;&nbsp; <span style={{color:'#34a853'}}>●</span> 긍정 <span style={{color:'#fbbc04'}}>●</span> 중도 <span style={{color:'#ea4335'}}>●</span> 부정</div>
                {[
                  { label: '정치', val1: 8, val2: 2, val3: 0 },
                  { label: '경제', val1: 6, val2: 1, val3: 0 },
                  { label: '사회', val1: 5, val2: 1, val3: 0 },
                  { label: '과학/기술', val1: 4, val2: 0, val3: 0 },
                  { label: '국제', val1: 3, val2: 3, val3: 0 },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '60px', fontSize: '13px', color: '#3c4043' }}>{item.label}</div>
                    <div style={{ flex: 1, display: 'flex', height: '6px', backgroundColor: '#f1f3f4', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.val1*10}%`, backgroundColor: '#34a853' }}></div>
                      <div style={{ width: `${item.val2*10}%`, backgroundColor: '#fbbc04' }}></div>
                      <div style={{ width: `${item.val3*10}%`, backgroundColor: '#ea4335' }}></div>
                    </div>
                    <div style={{ fontSize: '12px', width: '32px', display: 'flex', justifyContent: 'space-between', color: '#5f6368' }}>
                      <span>{item.val1}</span><span>{item.val2}</span><span>{item.val3}</span>
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: 'center', color: '#0056d2', fontSize: '13px', fontWeight: 'bold', marginTop: '16px', cursor: 'pointer' }}>더보기 v</div>
              </div>
            </div>
          </div>

          {/* 신뢰도 분포 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>신뢰도 분포</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '140px', height: '70px', overflow: 'hidden', position: 'relative', marginBottom: '8px' }}>
                <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: '12px solid #e0e0e0', transform: 'rotate(45deg)', boxSizing: 'border-box', position: 'absolute' }}></div>
                <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: '12px solid #00c4b4', borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: 'rotate(70deg)', boxSizing: 'border-box', position: 'absolute' }}></div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '-30px', marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', color: '#5f6368' }}>평균 신뢰도</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#202124' }}>3.2 <span style={{fontSize:'16px', color:'#5f6368', fontWeight:'normal'}}>/ 5</span></div>
              </div>
              <div style={{ width: '100%' }}>
                {[
                  { label: '신용 가능 (4~5점)', val: '18건 (42%)' },
                  { label: '신뢰 가능 (3점)', val: '15건 (36%)' },
                  { label: '보통 (2점)', val: '7건 (17%)' },
                  { label: '주의 (1점)', val: '2건 (5%)' },
                  { label: '신뢰 불가 (0점)', val: '0건 (0%)' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', color: '#3c4043' }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: 'bold' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 최근 검증 활동 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>최근 검증 활동</div>
              <div style={{ fontSize: '13px', color: '#0056d2', cursor: 'pointer' }}>전체 보기 &gt;</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: '백신 부작용 사망자 급증?', date: '2024.05.20', score: 3.1, color: '#fbbc04', icon: '📄' },
                { title: '기후변화는 인간의 영향이 아니다?', date: '2024.05.18', score: 2.6, color: '#ea4335', icon: '🌍' },
                { title: 'AI가 일자리를 대체한다?', date: '2024.05.15', score: 3.4, color: '#00c4b4', icon: '🏛️' },
                { title: '일본 후쿠시마 오염수 방류 안전하다?', date: '2024.05.12', score: 2.9, color: '#fbbc04', icon: '🏛️' },
                { title: '우크라이나 전쟁, 미국의 개입이 원인?', date: '2024.05.10', score: 3.0, color: '#fbbc04', icon: '💬' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f3f4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#80868b' }}>{item.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 'bold', color: '#202124' }}>
                    <span style={{ color: item.color }}>●</span> {item.score.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', color: '#0056d2', fontSize: '13px', fontWeight: 'bold', marginTop: '16px', cursor: 'pointer' }}>더보기 v</div>
          </div>
        </div>

        <div style={styles.bottomGrid}>
          {/* 관심 주제 TOP 5 */}
          <div style={styles.card}>
             <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>관심 주제 TOP 5</div>
              <div style={{ fontSize: '12px', color: '#80868b' }}>최근 30일 기준</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', paddingBottom: '20px' }}>
              {[
                { rank: 1, label: '정치', val: 25, pct: '43%', h: 100 },
                { rank: 2, label: '경제', val: 18, pct: '31%', h: 80 },
                { rank: 3, label: '사회', val: 12, pct: '21%', h: 60 },
                { rank: 4, label: '과학/기술', val: 7, pct: '12%', h: 40 },
                { rank: 5, label: '국제', val: 5, pct: '9%', h: 30 },
              ].map(item => (
                <div key={item.rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: item.rank===1 ? '#1a73e8' : (item.rank===2 ? '#4285f4' : (item.rank===3 ? '#fbbc04' : '#e0e0e0')), color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{item.rank}</div>
                  <div style={{ width: '40px', height: `${item.h}px`, backgroundColor: '#f1f3f4', borderRadius: '40px 40px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}>
                    <span style={{fontSize: '16px'}}>{item.rank===1 ? '🏛️' : (item.rank===2 ? '💰' : (item.rank===3 ? '👥' : (item.rank===4 ? '🔬' : '🌐')))}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#202124' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>{item.val}회</div>
                    <div style={{ fontSize: '11px', color: '#80868b' }}>{item.pct}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', color: '#0056d2', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>더보기 v</div>
          </div>

          {/* 획득 뱃지 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>획득 뱃지</div>
              <div style={{ fontSize: '13px', color: '#0056d2', cursor: 'pointer' }}>전체 보기 &gt;</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flex: 1 }}>
              {[
                { name: '신뢰 탐색자', sub: 'Lv. 4', color: '#00c4b4', icon: '✓' },
                { name: '팩트 체크 마스터', sub: '10회 검증', color: '#1a73e8', icon: '🔍' },
                { name: '소통 전문가', sub: '20회 참여', color: '#9334e6', icon: '💬' },
                { name: '지식 공유자', sub: '15회 기여', color: '#fbbc04', icon: '⭐' }
              ].map((badge, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: badge.color, borderRadius: '16px', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ transform: 'rotate(-45deg)', fontSize: '24px', color: '#fff', fontWeight: 'bold' }}>{badge.icon}</div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#202124', marginBottom: '4px' }}>{badge.name}</div>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>{badge.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 이번 달 활동 요약 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>이번 달 활동 요약</div>
              <div style={{ fontSize: '12px', color: '#80868b' }}>2024.05 기준</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3c4043' }}><span style={{fontSize:'16px'}}>🔍</span> 검색 횟수</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124' }}>22 <span style={{fontSize:'13px', fontWeight:'normal'}}>회</span></span>
                  <span style={{ fontSize: '12px', color: '#34a853', width: '40px', textAlign: 'right' }}>↑ 10%</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3c4043' }}><span style={{fontSize:'16px'}}>📄</span> 검증한 기사 수</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124' }}>16 <span style={{fontSize:'13px', fontWeight:'normal'}}>건</span></span>
                  <span style={{ fontSize: '12px', color: '#34a853', width: '40px', textAlign: 'right' }}>↑ 14%</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3c4043' }}><span style={{fontSize:'16px'}}>💬</span> 커뮤니티 활동</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124' }}>9 <span style={{fontSize:'13px', fontWeight:'normal'}}>회</span></span>
                  <span style={{ fontSize: '12px', color: '#34a853', width: '40px', textAlign: 'right' }}>↑ 13%</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3c4043' }}><span style={{fontSize:'16px'}}>✓</span> 평균 신뢰도 점수</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124' }}>3.2 <span style={{fontSize:'13px', fontWeight:'normal'}}>/ 5</span></span>
                  <span style={{ fontSize: '12px', color: '#34a853', width: '40px', textAlign: 'right' }}>↑ 0.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', backgroundColor: '#e8f0fe', borderRadius: '12px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>💡</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a73e8', marginBottom: '4px' }}>균형 잡힌 시각을 위한 TIP</div>
              <div style={{ fontSize: '13px', color: '#5f6368' }}>다양한 관점의 정보를 수집할수록 더 정확한 판단을 내릴 수 있습니다.</div>
            </div>
          </div>
          <button style={{ backgroundColor: '#ffffff', border: '1px solid #d2e3fc', padding: '8px 16px', borderRadius: '8px', color: '#1a73e8', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>다양한 관점의 기사 보기 ↗</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// CommunityView (교육 & 정보)
// ---------------------------------------------------------
function CommunityView({ onPostClick }) {
  const styles = {
    container: { backgroundColor: '#f8f9fa', minHeight: '100%', fontFamily: 'sans-serif', color: '#202124' },
    subnav: { backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0', display: 'flex', padding: '0 60px', gap: '32px' },
    subnavItem: (isActive) => ({ padding: '16px 0', fontSize: '15px', fontWeight: isActive ? 'bold' : '500', color: isActive ? '#0056d2' : '#5f6368', borderBottom: isActive ? '3px solid #0056d2' : '3px solid transparent', cursor: 'pointer' }),
    
    heroWrapper: { backgroundColor: '#f0f4fd', padding: '48px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    heroTitle: { fontSize: '32px', fontWeight: 'bold', color: '#202124', marginBottom: '16px' },
    heroTitleHighlight: { color: '#0056d2' },
    heroDesc: { fontSize: '16px', color: '#5f6368', lineHeight: '1.6' },
    
    mainLayout: { display: 'flex', padding: '40px 60px', gap: '32px', maxWidth: '1600px', margin: '0 auto' },
    leftSidebar: { width: '220px', flexShrink: 0 },
    centerContent: { flex: 1 },
    rightSidebar: { width: '300px', flexShrink: 0 },
    
    menuSection: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0', padding: '16px', marginBottom: '24px' },
    menuTitle: { fontSize: '14px', fontWeight: 'bold', color: '#202124', marginBottom: '16px', paddingLeft: '8px' },
    menuItem: (isActive) => ({ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: isActive ? 'bold' : 'normal', backgroundColor: isActive ? '#e8f0fe' : 'transparent', color: isActive ? '#1a73e8' : '#3c4043', transition: 'background 0.2s' }),
    tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    tag: { padding: '6px 12px', backgroundColor: '#f1f3f4', borderRadius: '16px', fontSize: '13px', color: '#5f6368', cursor: 'pointer' },
    guideBox: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0', padding: '20px' },
    guideList: { margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#5f6368', lineHeight: '1.8' },
    
    centerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    tabGroup: { display: 'flex', gap: '20px' },
    tab: (isActive) => ({ fontSize: '15px', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#202124' : '#80868b', cursor: 'pointer' }),
    searchBox: { display: 'flex', alignItems: 'center', gap: '12px' },
    select: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '14px', outline: 'none' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    searchInput: { padding: '10px 16px 10px 40px', borderRadius: '20px', border: '1px solid #dadce0', fontSize: '14px', outline: 'none', width: '200px' },
    
    postCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0', padding: '24px', marginBottom: '16px', display: 'flex', gap: '24px', cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': {boxShadow: '0 2px 8px rgba(0,0,0,0.05)'} },
    postContent: { flex: 1 },
    badge: (type) => {
      const colors = { '공지': '#1a73e8', '정보 공유': '#00c4b4', '정정 요청': '#ea4335', '토론': '#9334e6', '질문': '#fbbc04' };
      const bg = colors[type] || '#80868b';
      return { padding: '4px 8px', borderRadius: '4px', backgroundColor: bg, color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px' };
    },
    postTitle: { fontSize: '18px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' },
    postDesc: { fontSize: '14px', color: '#5f6368', marginBottom: '16px', lineHeight: '1.5' },
    postMeta: { fontSize: '13px', color: '#80868b', display: 'flex', alignItems: 'center', gap: '12px' },
    postImage: (bg) => ({ width: '160px', height: '100px', borderRadius: '8px', backgroundColor: bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 'bold' }),
    
    pagination: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' },
    pageBtn: (isActive) => ({ width: '32px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer', backgroundColor: isActive ? '#1a73e8' : 'transparent', color: isActive ? '#fff' : '#5f6368', fontWeight: isActive ? 'bold' : 'normal' }),
    
    rightCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0', padding: '24px', marginBottom: '24px' },
    rightCardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#202124', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    statRow: { display: 'flex', justifyContent: 'space-between', gap: '12px' },
    statBox: { flex: 1, backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '12px', textAlign: 'center' },
    statLabel: { fontSize: '12px', color: '#5f6368', marginBottom: '8px' },
    statValue: { fontSize: '18px', fontWeight: 'bold', color: '#202124' },
    
    popularItem: { display: 'flex', gap: '12px', marginBottom: '16px' },
    rankBadge: (rank) => ({ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: rank<=3 ? (rank===1?'#1a73e8':(rank===2?'#00c4b4':'#fbbc04')) : '#e0e0e0', color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
    
    correctionItem: { display: 'flex', gap: '8px', marginBottom: '12px', fontSize: '13px', color: '#3c4043', lineHeight: '1.5' },
    
    reportBanner: { backgroundColor: '#e8f0fe', borderRadius: '12px', padding: '24px', textAlign: 'center' },
    reportBtn: { width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '16px', cursor: 'pointer' }
  };

  const posts = [
    { type: '공지', title: '커뮤니티 이용 가이드라인 안내', desc: '', author: '', date: '2024.05.10', views: '', comments: '', bg: '' },
    { type: '공지', title: '정정 요청 처리 프로세스 업데이트 안내', desc: '', author: '', date: '2024.05.02', views: '', comments: '', bg: '' },
    { type: '정보 공유', title: '백신 부작용 사망자 급증? 관련 추가 자료 공유합니다.', desc: '최근 백신 부작용과 관련된 통계 자료와 해외 사례들을 정리해 보았습니다.', author: 'user_123', date: '2024.05.20 14:30', views: '1,245', comments: '23', bg: '#4285f4', icon: '💉' },
    { type: '정정 요청', title: '"일본 후쿠시마 오염수 방류 안전하다" 기사 내용 정정 요청합니다.', desc: '해당 기사에서 인용한 수치에 오류가 있는 것 같습니다. 확인 부탁드립니다.', author: 'green_leaf', date: '2024.05.20 11:15', views: '892', comments: '18', bg: '#34a853', icon: '🏭' },
    { type: '토론', title: 'AI가 일자리를 대체하는 것은 피할 수 없는 미래일까?', desc: 'AI 기술 발전에 따른 일자리 변화에 대해 다양한 관점에서 이야기 나눠요.', author: 'think_together', date: '2024.05.19 20:45', views: '642', comments: '37', bg: '#1a2b49', icon: 'AI' },
    { type: '질문', title: '팩트체크 등급 신뢰도는 어떻게 계산되나요?', desc: '신빙성 등급(5단계)은 어떤 기준과 알고리즘으로 산정되는지 궁금합니다.', author: 'curious_cat', date: '2024.05.19 16:20', views: '411', comments: '12', bg: '', icon: '' },
    { type: '정보 공유', title: '기후변화에 대한 과학적 근거 정리 (최신 연구 업데이트)', desc: 'IPCC 최신 보고서를 기반으로 핵심 내용을 요약했습니다.', author: 'earth_love', date: '2024.05.19 10:05', views: '1,102', comments: '25', bg: '#8ab4f8', icon: '🧊' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.subnav}>
        <div style={styles.subnavItem(true)}>정보 공유 커뮤니티</div>
        <div style={styles.subnavItem(false)}>정정 요청</div>
        <div style={styles.subnavItem(false)}>토론 게시판</div>
        <div style={styles.subnavItem(false)}>공지사항</div>
        <div style={styles.subnavItem(false)}>가이드 & 튜토리얼</div>
      </div>

      <div style={styles.heroWrapper}>
        <div>
          <div style={styles.heroTitle}>함께 만드는 더 나은 <span style={styles.heroTitleHighlight}>정보</span> 환경</div>
          <div style={styles.heroDesc}>정보 오류를 발견했다면 공유해주세요.<br/>여러분의 참여가 더 정확하고 공정한 정보를 만듭니다.</div>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Custom Illustration block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', padding: '12px 20px', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
               <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f3f4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</div>
               <div>
                 <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#202124' }}>의견 공유</div>
                 <div style={{ fontSize: '12px', color: '#5f6368' }}>다양한 관점에서 정보를 바라보세요.</div>
               </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', padding: '12px 20px', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
               <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f3f4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</div>
               <div>
                 <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#202124' }}>정정 요청</div>
                 <div style={{ fontSize: '12px', color: '#5f6368' }}>오류를 발견했다면 정정을 요청하세요.</div>
               </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', padding: '12px 20px', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
               <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f3f4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👥</div>
               <div>
                 <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#202124' }}>지식 공동체</div>
                 <div style={{ fontSize: '12px', color: '#5f6368' }}>함께 검증하고 더 나은 정보를 만들어가요.</div>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div style={styles.mainLayout}>
        <div style={styles.leftSidebar}>
          <div style={styles.menuSection}>
            <div style={styles.menuTitle}>카테고리</div>
            <div style={styles.menuItem(true)}>📄 전체 게시글</div>
            <div style={styles.menuItem(false)}>💬 정보 공유</div>
            <div style={styles.menuItem(false)}>✏️ 정정 요청</div>
            <div style={styles.menuItem(false)}>🗣️ 토론 게시판</div>
            <div style={styles.menuItem(false)}>❓ 질문 & 답변</div>
            <div style={styles.menuItem(false)}>💡 사용 팁 & 가이드</div>
          </div>
          
          <div style={styles.menuSection}>
            <div style={styles.menuTitle}>인기 태그 <span style={{float:'right', color:'#0056d2', fontWeight:'normal', fontSize:'12px', cursor:'pointer'}}>더보기 v</span></div>
            <div style={styles.tagGrid}>
              <span style={styles.tag}>#백신</span>
              <span style={styles.tag}>#기후변화</span>
              <span style={styles.tag}>#정치</span>
              <span style={styles.tag}>#경제</span>
              <span style={styles.tag}>#과학</span>
              <span style={styles.tag}>#건강</span>
              <span style={styles.tag}>#사회</span>
              <span style={styles.tag}>#국제</span>
            </div>
          </div>
          
          <div style={styles.guideBox}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#202124', marginBottom: '12px' }}>커뮤니티 가이드</div>
            <ul style={styles.guideList}>
              <li>사실에 기반한 의견을 남겨주세요.</li>
              <li>다른 사람을 존중하는 태도를 지켜주세요.</li>
              <li>개인정보 및 허위 정보 공유는 금지됩니다.</li>
            </ul>
            <div style={{ textAlign: 'center', color: '#0056d2', fontSize: '13px', fontWeight: 'bold', marginTop: '16px', cursor: 'pointer' }}>자세히 보기 &gt;</div>
          </div>
        </div>

        <div style={styles.centerContent}>
          <div style={styles.centerHeader}>
            <div style={styles.tabGroup}>
              <div style={styles.tab(true)}>최신순</div>
              <div style={styles.tab(false)}>인기순</div>
              <div style={styles.tab(false)}>댓글 많은 순</div>
            </div>
            <div style={styles.searchBox}>
              <select style={styles.select}><option>전체 카테고리</option></select>
              <div style={styles.inputWrapper}>
                <svg width="18" height="18" fill="#5f6368" viewBox="0 0 24 24" style={{position:'absolute', left:'12px'}}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                <input style={styles.searchInput} placeholder="검색어를 입력하세요" />
              </div>
            </div>
          </div>

          <div>
            {posts.map((post, i) => (
              <div key={i} style={{ ...styles.postCard, padding: post.type==='공지' ? '16px 24px' : '24px' }} onClick={onPostClick}>
                <div style={styles.postContent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={styles.badge(post.type)}>{post.type}</div>
                    {post.type !== '공지' && <svg width="20" height="20" fill="#dadce0" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>}
                  </div>
                  <div style={{ ...styles.postTitle, fontSize: post.type==='공지'?'15px':'18px', marginBottom: post.type==='공지'?'0':'8px', display: 'flex', justifyContent: 'space-between' }}>
                    {post.title}
                    {post.type==='공지' && <span style={{fontSize:'13px', color:'#80868b', fontWeight:'normal'}}>{post.date}</span>}
                  </div>
                  {post.desc && <div style={styles.postDesc}>{post.desc}</div>}
                  {post.author && (
                    <div style={styles.postMeta}>
                      <span style={{ color: '#3c4043', fontWeight: 'bold' }}>{post.author}</span>
                      <span>{post.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> {post.views}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg> {post.comments}</span>
                    </div>
                  )}
                </div>
                {post.bg && (
                  <div style={styles.postImage(post.bg)}>{post.icon}</div>
                )}
              </div>
            ))}
          </div>

          <div style={styles.pagination}>
            <div style={styles.pageBtn(false)}>&lt;</div>
            <div style={styles.pageBtn(true)}>1</div>
            <div style={styles.pageBtn(false)}>2</div>
            <div style={styles.pageBtn(false)}>3</div>
            <div style={styles.pageBtn(false)}>4</div>
            <div style={styles.pageBtn(false)}>5</div>
            <div style={styles.pageBtn(false)}>...</div>
            <div style={styles.pageBtn(false)}>20</div>
            <div style={styles.pageBtn(false)}>&gt;</div>
          </div>
        </div>

        <div style={styles.rightSidebar}>
          <div style={styles.rightCard}>
            <div style={styles.rightCardTitle}>키뮤니티 참여 현황 <span style={{ fontSize: '13px', color: '#0056d2', fontWeight: 'normal', cursor: 'pointer' }}>더보기 &gt;</span></div>
            <div style={styles.statRow}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>📝 오늘 게시글</div>
                <div style={styles.statValue}>128<span style={{fontSize:'13px', fontWeight:'normal'}}>건</span></div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>💬 오늘 댓글 수</div>
                <div style={styles.statValue}>342<span style={{fontSize:'13px', fontWeight:'normal'}}>개</span></div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>👥 참여 회원</div>
                <div style={styles.statValue}>2,845<span style={{fontSize:'13px', fontWeight:'normal'}}>명</span></div>
              </div>
            </div>
          </div>

          <div style={styles.rightCard}>
            <div style={styles.rightCardTitle}>인기 게시글</div>
            <div>
              {[
                { title: '백신 부작용 사망자 급증? 관련 추가 자료...', views: '2,345', comments: '56' },
                { title: '일본 후쿠시마 오염수 방류 안전하다? 팩트체...', views: '1,987', comments: '43' },
                { title: '기후변화는 인간의 영향이 아니다? 반박 자료', views: '1,765', comments: '38' },
                { title: 'AI가 일자리를 대체하는 것은 피할 수 없는...', views: '1,432', comments: '29' },
                { title: '팩트체크 등급은 얼마나 신뢰할 수 있나요?', views: '1,210', comments: '24' }
              ].map((item, i) => (
                <div key={i} style={styles.popularItem}>
                  <div style={styles.rankBadge(i+1)}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: '#202124', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '180px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#80868b', display: 'flex', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> {item.views}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg> {item.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.rightCard}>
            <div style={styles.rightCardTitle}>최근 정정 완료 사례 <span style={{ fontSize: '13px', color: '#0056d2', fontWeight: 'normal', cursor: 'pointer' }}>더보기 &gt;</span></div>
            <div>
              <div style={styles.correctionItem}>
                <span style={{color:'#34a853', fontWeight:'bold'}}>✓</span>
                <div>"OOO 화이자 백신은 DNA를 변형시킨다" &rarr; <span style={{color:'#34a853', fontWeight:'bold'}}>정정 완료</span></div>
              </div>
              <div style={styles.correctionItem}>
                <span style={{color:'#34a853', fontWeight:'bold'}}>✓</span>
                <div>"기후변화는 자연적 순환일 뿐이다" &rarr; <span style={{color:'#34a853', fontWeight:'bold'}}>정정 완료</span></div>
              </div>
              <div style={styles.correctionItem}>
                <span style={{color:'#34a853', fontWeight:'bold'}}>✓</span>
                <div>"OOO 제품이 암을 100% 치료한다" &rarr; <span style={{color:'#34a853', fontWeight:'bold'}}>정정 완료</span></div>
              </div>
            </div>
          </div>

          <div style={styles.reportBanner}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' }}>정보 오류를 발견하셨나요?</div>
            <div style={{ fontSize: '14px', color: '#5f6368' }}>정정 요청을 통해 더 정확한 정보를 함께 만들어주세요.</div>
            <button style={styles.reportBtn}>정정 요청하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// DetailView (상세보기)
// ---------------------------------------------------------
function DetailView({ type }) {
  return (
    <div style={{ display: 'flex', padding: '40px', gap: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ flex: 2 }}>
        <div style={{ display: 'inline-block', backgroundColor: type === '뉴스' ? '#1a73e8' : '#00c4b4', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px' }}>{type}</div>
        <h2 style={{ fontSize: '32px', marginBottom: '24px', lineHeight: '1.4' }}>{type === '뉴스' ? '선택한 뉴스 제목이 표시됩니다.' : '커뮤니티 팩트체크 게시글 제목입니다.'}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#5f6368', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
          <span style={{ fontWeight: 'bold', color: '#202124' }}>{type === '뉴스' ? '언론사 이름' : '작성자명'}</span>
          <span>|</span>
          <span>2024.05.20 15:30</span>
          <span>|</span>
          <span>조회수 1,234</span>
        </div>
        <div style={{ lineHeight: '1.8', fontSize: '18px', color: '#3c4043', minHeight: '300px' }}>
          {type === '뉴스' ? '이 곳에 뉴스 본문 내용이 렌더링됩니다. 현재 백엔드 연동이 되지 않아 임시 텍스트가 노출됩니다. 다양한 사실을 기반으로 작성된 뉴스 기사의 상세 내용이 표시될 영역입니다.' : '사용자가 작성한 커뮤니티 분석 내용 및 팩트체크 근거 데이터가 여기에 표시됩니다. 다양한 의견과 통계 자료가 함께 첨부될 수 있습니다.'}
        </div>
        <hr style={{ margin: '40px 0', border: '0px', height: '1px', backgroundColor: '#e0e0e0' }} />
        <h4 style={{ fontSize: '20px', marginBottom: '20px' }}>댓글 (12)</h4>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#e8f0fe', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
          <input style={{ flex: 1, padding: '14px 16px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '15px' }} placeholder="의견을 남겨보세요..." />
          <button style={{ padding: '0 24px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>등록</button>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '32px', borderRadius: '16px', height: 'fit-content', border: '1px solid #e0e0e0' }}>
        <div style={{ marginBottom: '32px' }}>
          <strong style={{ display: 'block', marginBottom: '16px', fontSize: '18px' }}>편향성 지수</strong>
          <div style={{ height: '12px', background: 'linear-gradient(to right, #1a73e8, #fbbc04, #ea4335)', borderRadius: '6px' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '8px', color: '#5f6368', fontWeight: 'bold' }}>
            <span>진보</span><span>중립</span><span>보수</span>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #34A853', fontSize: '15px', color: '#3c4043', lineHeight: '1.6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <strong style={{ display: 'block', color: '#1a73e8', marginBottom: '8px', fontSize: '14px' }}>AI 분석 코멘트</strong>
            {type === '뉴스'
              ? '해당 기사는 특정 정책에 대해 긍정적 형용사를 반복 사용하며 편향된 시각을 내비치고 있습니다. 관련 데이터의 교차 검증이 필요합니다.'
              : '해당 게시글은 다양한 출처를 인용하고 있으나, 결론 부분에서 특정 진영의 논리를 강화하는 경향이 보입니다.'}
          </div>
        </div>

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
      </div>
    </div>
  );
}