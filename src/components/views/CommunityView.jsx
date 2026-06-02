
import { useLocation, useNavigate } from 'react-router-dom';

export default function CommunityView({ onPostClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const activeTab = new URLSearchParams(location.search).get('tab') || '정보 공유 커뮤니티';
  
  const setActiveTab = (tab) => {
    navigate(`?tab=${encodeURIComponent(tab)}`, { replace: true });
  };

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
        {['정보 공유 커뮤니티', '정정 요청', '토론 게시판', '공지사항', '가이드 & 튜토리얼'].map(tab => (
          <div key={tab} style={styles.subnavItem(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab}
          </div>
        ))}
      </div>

      <div style={styles.heroWrapper}>
        {activeTab === '정보 공유 커뮤니티' && (
          <>
            <div>
              <div style={styles.heroTitle}>함께 만드는 더 나은 <span style={styles.heroTitleHighlight}>정보</span> 환경</div>
              <div style={styles.heroDesc}>정보 오류를 발견했다면 공유해주세요.<br/>여러분의 참여가 더 정확하고 공정한 정보를 만듭니다.</div>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
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
          </>
        )}
        {activeTab !== '정보 공유 커뮤니티' && (
          <div>
            <div style={styles.heroTitle}><span style={styles.heroTitleHighlight}>{activeTab}</span> 공간입니다.</div>
            <div style={styles.heroDesc}>이곳은 {activeTab} 관련 내용을 다루는 페이지입니다.<br/>사용자들과 함께 다양한 의견과 정보를 교환해 보세요.</div>
          </div>
        )}
      </div>

      <div style={styles.mainLayout}>
        <div style={styles.leftSidebar}>
          <div style={styles.menuSection}>
            <div style={styles.menuTitle}>카테고리</div>
            <div style={styles.menuItem(activeTab === '정보 공유 커뮤니티')} onClick={() => setActiveTab('정보 공유 커뮤니티')}>📄 정보 공유 커뮤니티</div>
            <div style={styles.menuItem(activeTab === '정정 요청')} onClick={() => setActiveTab('정정 요청')}>✏️ 정정 요청</div>
            <div style={styles.menuItem(activeTab === '토론 게시판')} onClick={() => setActiveTab('토론 게시판')}>🗣️ 토론 게시판</div>
            <div style={styles.menuItem(activeTab === '공지사항')} onClick={() => setActiveTab('공지사항')}>📢 공지사항</div>
            <div style={styles.menuItem(activeTab === '가이드 & 튜토리얼')} onClick={() => setActiveTab('가이드 & 튜토리얼')}>💡 가이드 & 튜토리얼</div>
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

          {activeTab === '정보 공유 커뮤니티' ? (
          <>
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
          </>
          ) : (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0', padding: '60px', textAlign: 'center', color: '#5f6368', fontSize: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{activeTab === '가이드 & 튜토리얼' ? '📖' : (activeTab === '공지사항' ? '📢' : '💬')}</div>
              <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#202124', marginBottom: '8px' }}>{activeTab} 화면 준비중입니다.</div>
              <div>해당 기능은 현재 개발 진행 중이며, 곧 만나보실 수 있습니다.</div>
            </div>
          )}
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