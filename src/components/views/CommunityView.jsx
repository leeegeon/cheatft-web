import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPosts } from '../../services/cheatftApi.js';
import { cleanDisplayText } from '../../utils/text.js';

function formatDateTime(value) {
  if (!value) return '';
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

function getTimeValue(value) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function mapApiPost(post) {
  const category = cleanDisplayText(post.category, '정보 공유 커뮤니티');
  const viewsCount = Number(post.views ?? 0);
  const commentsCount = Number(post.commentCount ?? 0);

  return {
    id: post.id,
    type: category,
    title: cleanDisplayText(post.title, '제목 없음'),
    desc: cleanDisplayText(post.preview || post.content, '게시글 미리보기가 없습니다.'),
    author: cleanDisplayText(post.author, '작성자 미상'),
    date: formatDateTime(post.createdAt),
    sortTime: getTimeValue(post.createdAt),
    views: viewsCount.toLocaleString(),
    viewsCount,
    comments: commentsCount.toLocaleString(),
    commentsCount,
  };
}

const CATEGORY_PARAM_BY_TAB = {
  '정보 공유 커뮤니티': '정보 공유 커뮤니티',
  '정정 요청': '정정 요청',
  '토론 게시판': '토론 게시판',
};

const COMMUNITY_TABS = ['정보 공유 커뮤니티', '정정 요청', '토론 게시판'];
const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'comments', label: '댓글 많은 순' },
];

function sortPostsBy(posts, sortBy) {
  return [...posts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.viewsCount - a.viewsCount || b.commentsCount - a.commentsCount || b.sortTime - a.sortTime;
    }

    if (sortBy === 'comments') {
      return b.commentsCount - a.commentsCount || b.viewsCount - a.viewsCount || b.sortTime - a.sortTime;
    }

    return b.sortTime - a.sortTime || b.viewsCount - a.viewsCount;
  });
}

export default function CommunityView({ onPostClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [communityData, setCommunityData] = useState(null);
  const [communityStatus, setCommunityStatus] = useState('loading');
  const [apiError, setApiError] = useState('');
  const [recentCorrectionPosts, setRecentCorrectionPosts] = useState([]);
  const [recentCorrectionStatus, setRecentCorrectionStatus] = useState('loading');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  
  const requestedTab = new URLSearchParams(location.search).get('tab');
  const activeTab = COMMUNITY_TABS.includes(requestedTab) ? requestedTab : '정보 공유 커뮤니티';
  const categoryParam = CATEGORY_PARAM_BY_TAB[activeTab] || '';
  
  const setActiveTab = (tab) => {
    setPage(1);
    navigate(`?tab=${encodeURIComponent(tab)}`, { replace: true });
  };

  useEffect(() => {
    let ignore = false;

    getPosts({
      category: categoryParam,
      keyword: searchKeyword.trim(),
      page,
      limit: 10,
    })
      .then((data) => {
        if (!ignore) {
          setCommunityData(data || {});
          setCommunityStatus('done');
        }
      })
      .catch((error) => {
        if (!ignore && error.code !== 'API_NOT_CONFIGURED') {
          setApiError(error.message || '게시글을 불러오지 못했습니다.');
        }
        if (!ignore) {
          setCommunityData(null);
          setCommunityStatus('error');
        }
      });

    return () => {
      ignore = true;
    };
  }, [categoryParam, page, searchKeyword]);

  useEffect(() => {
    let ignore = false;

    getPosts({
      category: '정정 요청',
      page: 1,
      limit: 3,
    })
      .then((data) => {
        if (ignore) return;
        const posts = Array.isArray(data?.posts) ? data.posts.map(mapApiPost) : [];
        setRecentCorrectionPosts(posts.filter((post) => post.type === '정정 요청').slice(0, 3));
        setRecentCorrectionStatus('done');
      })
      .catch(() => {
        if (!ignore) {
          setRecentCorrectionPosts([]);
          setRecentCorrectionStatus('error');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const styles = {
    container: { backgroundColor: '#f8f9fa', minHeight: '100%', fontFamily: 'sans-serif', color: '#202124' },
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
    leftStatRow: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' },
    leftStatBox: { minWidth: 0, backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '8px 4px', textAlign: 'center' },
    leftStatLabel: { fontSize: '10px', color: '#5f6368', lineHeight: 1.2, whiteSpace: 'nowrap' },
    leftStatValue: { fontSize: '14px', fontWeight: 'bold', color: '#202124', lineHeight: 1.25, whiteSpace: 'nowrap' },
    
    centerHeader: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px 20px', marginBottom: '20px' },
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
      marginBottom: '16px',
    }),
    tabGroup: { display: 'flex', flexShrink: 0, gap: '8px' },
    sortButton: (isActive) => ({
      minHeight: '36px',
      padding: '8px 12px',
      borderRadius: '8px',
      border: isActive ? '1px solid #1a73e8' : '1px solid #dadce0',
      backgroundColor: isActive ? '#e8f0fe' : '#ffffff',
      color: isActive ? '#174ea6' : '#5f6368',
      fontSize: '14px',
      fontWeight: isActive ? 'bold' : '500',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    }),
    searchBox: { display: 'flex', flex: '1 1 420px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' },
    writeButton: { padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#0056d2', color: '#ffffff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    searchInput: { padding: '10px 16px 10px 40px', borderRadius: '20px', border: '1px solid #dadce0', fontSize: '14px', outline: 'none', width: '200px', maxWidth: '100%' },
    
    postCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0', padding: '24px', marginBottom: '16px', display: 'flex', gap: '24px', cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': {boxShadow: '0 2px 8px rgba(0,0,0,0.05)'} },
    postContent: { flex: 1 },
    badge: (type) => {
      const colors = { '공지': '#1a73e8', '정보 공유 커뮤니티': '#00c4b4', '정보 공유': '#00c4b4', '정정 요청': '#ea4335', '토론 게시판': '#9334e6', '토론': '#9334e6' };
      const bg = colors[type] || '#80868b';
      return { padding: '4px 8px', borderRadius: '4px', backgroundColor: bg, color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px' };
    },
    postTitle: { fontSize: '18px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' },
    postDesc: { fontSize: '14px', color: '#5f6368', marginBottom: '16px', lineHeight: '1.5' },
    postMeta: { fontSize: '13px', color: '#80868b', display: 'flex', alignItems: 'center', gap: '12px' },
    emptyState: { padding: '48px 24px', borderRadius: '12px', border: '1px dashed #dadce0', backgroundColor: '#fafbfc', color: '#5f6368', textAlign: 'center', lineHeight: '1.6' },
    
    pagination: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' },
    pageBtn: (isActive) => ({ width: '32px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer', backgroundColor: isActive ? '#1a73e8' : 'transparent', color: isActive ? '#fff' : '#5f6368', fontWeight: isActive ? 'bold' : 'normal' }),
    
    sidePanel: { display: 'grid', gap: '16px', alignItems: 'stretch' },
    rightCard: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '18px', marginBottom: 0, minHeight: '210px', display: 'flex', flexDirection: 'column' },
    rightCardTitle: { fontSize: '15px', fontWeight: 'bold', color: '#202124', marginBottom: '14px' },
    popularItem: { display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' },
    rankBadge: (rank) => ({ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: rank<=3 ? (rank===1?'#1a73e8':(rank===2?'#00c4b4':'#fbbc04')) : '#e0e0e0', color: '#fff', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
    sidePostTitle: { border: 0, background: 'transparent', padding: 0, width: '100%', color: '#202124', fontSize: '14px', textAlign: 'left', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    sidePostMeta: { fontSize: '12px', color: '#80868b', display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' },
    
    reportBanner: { backgroundColor: '#e8f0fe', borderRadius: '10px', border: '1px solid #d2e3fc', padding: '18px', textAlign: 'center', minHeight: '210px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    reportBtn: { width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '16px', cursor: 'pointer' }
  };

  const hasApiPosts = communityStatus === 'done';
  const displayPosts = hasApiPosts
    ? (Array.isArray(communityData?.posts) ? communityData.posts.map(mapApiPost) : [])
    : [];
  const sortedDisplayPosts = sortPostsBy(displayPosts, sortBy);
  const communityStats = hasApiPosts ? {
    todayPosts: communityData?.communityStats?.todayPosts ?? 0,
    todayComments: communityData?.communityStats?.todayComments ?? 0,
    totalMembers: communityData?.communityStats?.totalMembers ?? 0,
  } : {
    todayPosts: 0,
    todayComments: 0,
    totalMembers: 0,
  };
  const sourceState = communityStatus === 'loading' ? 'loading' : hasApiPosts ? 'api' : 'error';
  const sourceText = sourceState === 'api'
    ? '백엔드 API 응답 표시 중'
    : sourceState === 'loading'
      ? '백엔드 API 응답 대기 중'
      : '게시글 요청 실패';
  const popularPosts = [...displayPosts]
    .sort((a, b) => b.viewsCount - a.viewsCount || b.commentsCount - a.commentsCount || b.sortTime - a.sortTime)
    .slice(0, 5);
  const correctionPosts = recentCorrectionPosts.length > 0
    ? recentCorrectionPosts
    : displayPosts.filter((post) => post.type === '정정 요청').slice(0, 3);

  return (
    <div className="community-page" style={styles.container}>
      <div className="community-hero" style={styles.heroWrapper}>
        {activeTab === '정보 공유 커뮤니티' && (
          <>
            <div>
              <div style={styles.heroTitle}>함께 만드는 더 나은 <span style={styles.heroTitleHighlight}>정보</span> 환경</div>
              <div style={styles.heroDesc}>정보 오류를 발견했다면 공유해주세요.<br/>여러분의 참여가 더 정확하고 공정한 정보를 만듭니다.</div>
            </div>
            <div className="community-hero-visual" style={{ display: 'flex', gap: '24px' }}>
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

      <div className="community-main-layout" style={styles.mainLayout}>
        <div className="community-left-sidebar" style={styles.leftSidebar}>
          <div style={styles.menuSection}>
            <div style={styles.menuTitle}>카테고리</div>
            <div style={styles.menuItem(activeTab === '정보 공유 커뮤니티')} onClick={() => setActiveTab('정보 공유 커뮤니티')}>📄 정보 공유 커뮤니티</div>
            <div style={styles.menuItem(activeTab === '정정 요청')} onClick={() => setActiveTab('정정 요청')}>✏️ 정정 요청</div>
            <div style={styles.menuItem(activeTab === '토론 게시판')} onClick={() => setActiveTab('토론 게시판')}>🗣️ 토론 게시판</div>
          </div>

          <div style={styles.menuSection}>
            <div style={styles.menuTitle}>커뮤니티 참여 현황</div>
            <div className="community-left-stat-row" style={styles.leftStatRow}>
              <div style={styles.leftStatBox}>
                <div style={styles.leftStatLabel}>게시글</div>
                <div style={styles.leftStatValue}>{communityStats.todayPosts}<span style={{fontSize:'11px', fontWeight:'normal'}}>건</span></div>
              </div>
              <div style={styles.leftStatBox}>
                <div style={styles.leftStatLabel}>댓글</div>
                <div style={styles.leftStatValue}>{communityStats.todayComments}<span style={{fontSize:'11px', fontWeight:'normal'}}>개</span></div>
              </div>
              <div style={styles.leftStatBox}>
                <div style={styles.leftStatLabel}>회원</div>
                <div style={styles.leftStatValue}>{communityStats.totalMembers?.toLocaleString?.() ?? communityStats.totalMembers}<span style={{fontSize:'11px', fontWeight:'normal'}}>명</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="community-center-content" style={styles.centerContent}>
          <div className="community-center-header" style={styles.centerHeader}>
            <div className="community-tab-group" style={styles.tabGroup}>
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  style={styles.sortButton(sortBy === option.value)}
                  onClick={() => setSortBy(option.value)}
                  aria-pressed={sortBy === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="community-search-box" style={styles.searchBox}>
              <button type="button" className="community-write-button" style={styles.writeButton} onClick={() => navigate('/community/write')}>
                글 작성하기
              </button>
              <div className="community-input-wrapper" style={styles.inputWrapper}>
                <svg width="18" height="18" fill="#5f6368" viewBox="0 0 24 24" style={{position:'absolute', left:'12px'}}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                <input
                  className="community-search-input"
                  style={styles.searchInput}
                  placeholder="검색어를 입력하세요"
                  value={searchKeyword}
                  onChange={(event) => {
                    setSearchKeyword(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          <>
          <div style={styles.sourceNotice(sourceState)}>{sourceText}</div>
          <div>
            {apiError && <div className="form-error" role="alert">{apiError}</div>}
            {sortedDisplayPosts.length === 0 ? (
              <div style={styles.emptyState}>
                {sourceState === 'error' ? '게시글을 불러오지 못했습니다.' : '백엔드에서 받은 게시글 목록이 비어 있습니다.'}<br/>
                프론트 예시 데이터는 섞지 않았습니다.
              </div>
            ) : sortedDisplayPosts.map((post, i) => (
              <div className="community-post-card" key={post.id ?? post.title ?? i} style={{ ...styles.postCard, padding: post.type==='공지' ? '16px 24px' : '24px' }} onClick={() => onPostClick(post.id ?? i + 1)}>
                <div style={styles.postContent}>
                  <div className="community-post-topline" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={styles.badge(post.type)}>{post.type}</div>
                  </div>
                  <div className="community-post-title-row" style={{ ...styles.postTitle, fontSize: post.type==='공지'?'15px':'18px', marginBottom: post.type==='공지'?'0':'8px', display: 'flex', justifyContent: 'space-between' }}>
                    {post.title}
                    {post.type==='공지' && <span style={{fontSize:'13px', color:'#80868b', fontWeight:'normal'}}>{post.date}</span>}
                  </div>
                  {post.desc && <div style={styles.postDesc}>{post.desc}</div>}
                  {post.author && (
                    <div className="community-post-meta" style={styles.postMeta}>
                      <span style={{ color: '#3c4043', fontWeight: 'bold' }}>{post.author}</span>
                      <span>{post.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> {post.views}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg> {post.comments}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.pagination}>
            <div style={styles.pageBtn(false)} onClick={() => setPage((current) => Math.max(1, current - 1))}>&lt;</div>
            {Array.from({ length: Math.min(5, communityData?.pagination?.totalPages ?? 5) }, (_, index) => index + 1).map((pageNumber) => (
              <div key={pageNumber} style={styles.pageBtn(page === pageNumber)} onClick={() => setPage(pageNumber)}>{pageNumber}</div>
            ))}
            {(communityData?.pagination?.totalPages ?? 5) > 5 && <div style={styles.pageBtn(false)}>...</div>}
            {(communityData?.pagination?.totalPages ?? 0) > 5 && (
              <div style={styles.pageBtn(false)} onClick={() => setPage(communityData.pagination.totalPages)}>{communityData.pagination.totalPages}</div>
            )}
            <div
              style={styles.pageBtn(false)}
              onClick={() => setPage((current) => Math.min(communityData?.pagination?.totalPages ?? current + 1, current + 1))}
            >
              &gt;
            </div>
          </div>
          </>
        </div>

        <div className="community-right-sidebar" style={styles.rightSidebar}>
          <div className="community-side-panel" style={styles.sidePanel}>
            <div className="community-side-card" style={styles.rightCard}>
              <div style={styles.rightCardTitle}>인기 게시글</div>
              <div>
                {popularPosts.length === 0 ? (
                  <div style={{ fontSize: '13px', color: '#5f6368', lineHeight: '1.6' }}>표시할 API 게시글이 없습니다.</div>
                ) : popularPosts.map((item, i) => (
                  <div key={item.id ?? item.title} style={styles.popularItem}>
                    <div style={styles.rankBadge(i+1)}>{i+1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <button
                        type="button"
                        onClick={() => onPostClick(item.id)}
                        style={styles.sidePostTitle}
                      >
                        {item.title}
                      </button>
                      <div style={styles.sidePostMeta}>
                        <span>조회 {item.views}</span>
                        <span>댓글 {item.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="community-side-card" style={styles.rightCard}>
              <div style={styles.rightCardTitle}>최근 정정 요청</div>
              <div>
                {correctionPosts.length === 0 ? (
                  <div style={{ fontSize: '13px', color: '#5f6368', lineHeight: '1.6' }}>
                    {recentCorrectionStatus === 'error' ? '정정 요청 게시글을 불러오지 못했습니다.' : '표시할 정정 요청 게시글이 없습니다.'}
                  </div>
                ) : correctionPosts.map((post, index) => (
                  <div key={post.id ?? post.title} style={styles.popularItem}>
                    <div style={styles.rankBadge(index + 1)}>{index + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <button type="button" onClick={() => onPostClick(post.id)} style={styles.sidePostTitle}>
                        {post.title}
                      </button>
                      <div style={styles.sidePostMeta}>
                        <span>조회 {post.views}</span>
                        <span>댓글 {post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="community-side-card" style={styles.reportBanner}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124', marginBottom: '8px' }}>정보 오류를 발견하셨나요?</div>
              <div style={{ fontSize: '14px', color: '#5f6368' }}>정정 요청을 통해 더 정확한 정보를 함께 만들어주세요.</div>
              <button type="button" style={styles.reportBtn} onClick={() => navigate('/community/write')}>정정 요청하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
