import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomeView from './components/views/HomeView.jsx';
import VerificationView from './components/views/VerificationView.jsx';
import MyPageView from './components/views/MyPageView.jsx';
import CommunityView from './components/views/CommunityView.jsx';
import DetailView from './components/views/DetailView.jsx';
import AlgoView from './components/views/AlgoView.jsx';
import ReportView from './components/views/ReportView.jsx';
import LoginView from './components/views/LoginView.jsx';
import SignupView from './components/views/SignupView.jsx';
import CommunityWriteView from './components/views/CommunityWriteView.jsx';
import NotFoundView from './components/views/NotFoundView.jsx';
import { clearAccessToken, getAccessToken } from './services/apiClient.js';
import { buildSearchPath, normalizeSearchQuery } from './utils/search.js';
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getAccessToken()));

  const handleSearch = (query) => {
    if (!normalizeSearchQuery(query)) return;
    navigate(buildSearchPath(query));
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    clearAccessToken();
    setIsLoggedIn(false);
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
    { path: '/', label: '홈' },
    { path: '/search', label: '검증하기' },
    { path: '/algo', label: '알고리즘 분석' },
    { path: '/report', label: '팩트체크 리포트' },
    { path: '/community', label: '교육 & 정보' },
    { path: '/mypage', label: '마이페이지' },
  ];

  return (
    <div className="app-shell" style={styles.container}>
      {/* Top Navbar */}
      <header className="top-navbar" style={styles.navbar}>
        <button className="brand-button" type="button" onClick={() => navigate('/')} aria-label="Cheat F/T 홈으로 이동">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="44" height="44" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient id="blueG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a73e8" />
                  <stop offset="100%" stopColor="#0d47a1" />
                </linearGradient>
                <linearGradient id="greenG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00df9a" />
                  <stop offset="100%" stopColor="#007f5f" />
                </linearGradient>
                <mask id="e-mask">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <rect x="0" y="34" width="60" height="10" fill="black" />
                  <rect x="0" y="56" width="60" height="10" fill="black" />
                  <polygon points="46,0 100,0 100,100 36,100" fill="black" />
                </mask>
                <mask id="d-mask">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <circle cx="50" cy="50" r="18" fill="black" />
                  <polygon points="0,0 52,0 42,100 0,100" fill="black" />
                </mask>
              </defs>
              <rect x="66" y="66" width="14" height="34" rx="7" fill="#111827" transform="rotate(-45 73 83)" />
              <circle cx="50" cy="50" r="36" fill="url(#blueG)" mask="url(#e-mask)" />
              <g mask="url(#d-mask)">
                <circle cx="50" cy="50" r="36" fill="url(#greenG)" />
              </g>
            </svg>
            <div style={{ fontSize: '36px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-1.5px', marginTop: '4px' }}>
              <span style={{ color: '#1a2b49' }}>Cheat </span>
              <span style={{ color: '#1a73e8' }}>F/</span>
              <span style={{ color: '#00c4b4' }}>T</span>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#5f6368', paddingLeft: '52px', marginTop: '-8px', letterSpacing: '-0.5px' }}>
            진실을 검증하고, 편향을 줄여 더 나은 정보를 만듭니다.
          </div>
        </button>
        <nav className="nav-links" style={styles.navLinks} aria-label="주요 메뉴">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
            return (
              <button
                type="button"
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer',
                  fontWeight: isActive ? 'bold' : '500', color: isActive ? '#0056d2' : '#3c4043',
                  borderBottom: isActive ? '3px solid #0056d2' : '3px solid transparent',
                  borderTop: 0, borderLeft: 0, borderRight: 0, background: 'transparent',
                  boxSizing: 'border-box', fontSize: '15px', whiteSpace: 'nowrap'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="nav-right" style={styles.navRight}>
          <button type="button" style={styles.iconBtn} onClick={() => navigate('/search')} aria-label="검색 화면 열기">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
          {location.pathname === '/mypage' ? (
            <>
               <button type="button" style={styles.iconBtn} aria-label="알림" disabled title="알림 API 연동 후 활성화됩니다"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg></button>
               <button style={styles.signupBtn} onClick={() => navigate('/community/write')}>검증 기록</button>
            </>
          ) : location.pathname.startsWith('/community') ? (
             <>
               <button type="button" style={styles.iconBtn} aria-label="알림" disabled title="알림 API 연동 후 활성화됩니다"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg></button>
               <button type="button" style={styles.iconBtn} aria-label="마이페이지" onClick={() => navigate('/mypage')}><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></button>
               <button type="button" style={styles.signupBtn} onClick={() => navigate('/community/write')}>글 작성하기</button>
             </>
          ) : location.pathname === '/report' ? (
            <>
              <button type="button" style={styles.iconBtn} aria-label="알림" disabled title="알림 API 연동 후 활성화됩니다"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg></button>
              <button type="button" disabled title="리포트 API 연동 후 활성화됩니다" style={{ ...styles.signupBtn, display: 'flex', alignItems: 'center', gap: '8px' }}>
                리포트 내보내기 
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              </button>
            </>
          ) : isLoggedIn ? (
            <>
              <button style={styles.iconBtn} onClick={() => navigate('/mypage')}><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></button>
              <button style={{...styles.loginBtn, color: '#ea4335', borderColor: '#ea4335'}} onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button style={styles.loginBtn} onClick={() => navigate('/login')}>로그인</button>
              <button style={styles.signupBtn} onClick={() => navigate('/signup')}>회원가입</button>
            </>
          )}
        </div>
      </header>

      <main className="app-main" style={styles.main}>
        <Routes>
          <Route path="/" element={<HomeView onNavigate={(path) => navigate(`/${path}`)} onSearch={handleSearch} />} />
          <Route path="/search" element={<VerificationView key={location.search} onSearch={handleSearch} onArticleClick={(id = 1) => navigate(`/article/${id}`)} />} />
          <Route path="/article/:id" element={<DetailView type="뉴스" />} />
          <Route path="/community" element={<CommunityView onPostClick={(id = 1) => navigate(`/community/${id}`)} />} />
          <Route path="/community/write" element={<CommunityWriteView />} />
          <Route path="/community/:id" element={<DetailView type="커뮤니티" />} />
          <Route path="/mypage" element={<MyPageView />} />
          <Route path="/algo" element={<AlgoView />} />
          <Route path="/report" element={<ReportView />} />
          <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>
    </div>
  );
}
