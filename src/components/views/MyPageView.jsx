import { useEffect, useState } from 'react'
import { getProfile } from '../../services/cheatftApi.js'

export default function MyPageView() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let ignore = false

    getProfile({ period: 1 })
      .then((data) => {
        if (!ignore) setProfile(data)
      })
      .catch(() => {
        if (!ignore) setProfile(null)
      })

    return () => {
      ignore = true
    }
  }, [])

  const userInfo = profile?.userInfo || {
    nickname: '사용자 님',
    level: 4,
    userTitle: '신뢰 탐색자',
    joinDate: '2024.04.12',
  }
  const contribution = profile?.myContribution || {
    opinionShareCount: 23,
    editRequestCount: 7,
    knowledgeCommunityAnswerCount: 15,
    totalLikesReceived: 128,
  }
  const streak = profile?.streakReward || {
    currentStreakDays: 7,
    targetStreakDays: 14,
    rewardMessage: '14일 연속 시 뱃지 지급!',
  }
  const dashboard = profile?.personalDashboard || {
    totalSearch: { count: 58, changeRate: 16 },
    checkedArticles: { count: 42, changeRate: 22 },
    factCheckReports: { count: 19, changeRate: 19 },
    communityActivities: { count: 31, changeRate: 8 },
    averageReliabilityScore: { score: 3.2, changeRate: 0.4 },
  }
  const infoBias = profile?.infoConsumptionBias || {
    biasDistribution: { positiveRatio: 71, neutralRatio: 14, negativeRatio: 0 },
    alertMessage: '현재 긍정적인 정보가 다소 많습니다. 다양한 관점의 정보를 확인해보세요.',
    categoryBiasDistribution: [
      { category: '정치', positive: 8, neutral: 2, negative: 0 },
      { category: '경제', positive: 6, neutral: 1, negative: 0 },
      { category: '사회', positive: 5, neutral: 1, negative: 0 },
      { category: '과학/기술', positive: 4, neutral: 0, negative: 0 },
      { category: '국제', positive: 3, neutral: 3, negative: 0 },
    ],
  }
  const biasDistribution = infoBias.biasDistribution
  const reliabilityDistribution = profile?.reliabilityDistribution || {
    trustworthy4_5: { count: 18, ratio: 42 },
    reliable3: { count: 15, ratio: 36 },
    normal2: { count: 7, ratio: 17 },
    caution1: { count: 2, ratio: 5 },
    untrustworthy0: { count: 0, ratio: 0 },
  }
  const reliabilityRows = [
    { label: '신뢰 가능 (4~5점)', value: reliabilityDistribution.trustworthy4_5 },
    { label: '신뢰 가능 (3점)', value: reliabilityDistribution.reliable3 },
    { label: '보통 (2점)', value: reliabilityDistribution.normal2 },
    { label: '주의 (1점)', value: reliabilityDistribution.caution1 },
    { label: '신뢰 불가 (0점)', value: reliabilityDistribution.untrustworthy0 },
  ]
  const recentActivities = profile?.recentActivities || [
    { title: '백신 부작용 사망자 급증?', date: '2024.05.20', score: 3.1 },
    { title: '기후변화는 인간의 영향이 아니다?', date: '2024.05.18', score: 2.6 },
    { title: 'AI가 일자리를 대체한다?', date: '2024.05.15', score: 3.4 },
    { title: '일본 후쿠시마 오염수 방류 안전하다?', date: '2024.05.12', score: 2.9 },
    { title: '우크라이나 전쟁, 미국의 개입이 원인?', date: '2024.05.10', score: 3.0 },
  ]
  const interestTopics = profile?.interestTopicsTop5 || [
    { rank: 1, category: '정치', searchCount: 25, ratio: 43 },
    { rank: 2, category: '경제', searchCount: 18, ratio: 31 },
    { rank: 3, category: '사회', searchCount: 12, ratio: 21 },
    { rank: 4, category: '과학/기술', searchCount: 7, ratio: 12 },
    { rank: 5, category: '국제', searchCount: 5, ratio: 9 },
  ]
  const earnedBadges = profile?.earnedBadges || [
    { name: '신뢰 탐색자', level: 'Lv. 4', condition: '' },
    { name: '팩트 체크 마스터', level: null, condition: '10회 검증' },
    { name: '소통 전문가', level: null, condition: '20회 참여' },
    { name: '지식 공유자', level: null, condition: '15회 기여' },
  ]
  const monthlySummary = profile?.monthlySummary || {
    yearMonth: '2024.05',
    searchCount: { count: 22, changeRate: 10 },
    checkedArticles: { count: 16, changeRate: 14 },
    communityActivities: { count: 9, changeRate: 13 },
    averageReliabilityScore: { score: 3.2, changeRate: 0.3 },
  }

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
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#202124' }}>{userInfo.nickname}</span>
              <span style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Lv. {userInfo.level}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#5f6368' }}>{userInfo.userTitle}<br/>가입일 {userInfo.joinDate}</div>
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
          <div style={styles.statRow}><span>의견 공유</span><span style={styles.statVal}>{contribution.opinionShareCount} 회</span></div>
          <div style={styles.statRow}><span>정정 요청</span><span style={styles.statVal}>{contribution.editRequestCount} 회</span></div>
          <div style={styles.statRow}><span>지식 공동체 답변</span><span style={styles.statVal}>{contribution.knowledgeCommunityAnswerCount} 회</span></div>
          <div style={styles.statRow}><span>좋아요 받은 수</span><span style={styles.statVal}>{contribution.totalLikesReceived} 회</span></div>
          <div style={styles.detailBtn}>상세 보기 &gt;</div>
        </div>

        <div style={styles.streakBox}>
          <div style={styles.streakTitle}><span style={{fontSize:'24px'}}>🔥</span> {streak.currentStreakDays}일 연속<br/>연속 활동 중!</div>
          <div style={styles.circles}>
            {Array.from({ length: 7 }, (_, i) => i < Math.min(streak.currentStreakDays, 7)).map((active, i) => (
              <div key={i} style={styles.circle(active)}>{active ? '✓' : ''}</div>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: '#5f6368', textAlign: 'center' }}>{streak.rewardMessage || `${streak.targetStreakDays}일 연속 시 뱃지 지급!`}</div>
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
            <div style={styles.statCardVal}>{dashboard.totalSearch.count} <span style={{fontSize:'16px'}}>회</span></div>
            <div style={styles.statCardTrend(true)}>↑ {dashboard.totalSearch.changeRate}%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIconBox('#e8f0fe')}><span style={{fontSize:'20px'}}>📄</span></div>
            <div style={styles.statCardTitle}>검증한 기사 수</div>
            <div style={styles.statCardVal}>{dashboard.checkedArticles.count} <span style={{fontSize:'16px'}}>건</span></div>
            <div style={styles.statCardTrend(true)}>↑ {dashboard.checkedArticles.changeRate}%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIconBox('#f3e8fd')}><span style={{fontSize:'20px'}}>📊</span></div>
            <div style={styles.statCardTitle}>팩트체크 리포트</div>
            <div style={styles.statCardVal}>{dashboard.factCheckReports.count} <span style={{fontSize:'16px'}}>개</span></div>
            <div style={styles.statCardTrend(true)}>↑ {dashboard.factCheckReports.changeRate}%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIconBox('#fce8e6')}><span style={{fontSize:'20px'}}>💬</span></div>
            <div style={styles.statCardTitle}>커뮤니티 활동</div>
            <div style={styles.statCardVal}>{dashboard.communityActivities.count} <span style={{fontSize:'16px'}}>회</span></div>
            <div style={styles.statCardTrend(true)}>↑ {dashboard.communityActivities.changeRate}%</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIconBox('#e6f4ea')}><span style={{fontSize:'20px'}}>✓</span></div>
            <div style={styles.statCardTitle}>평균 신뢰도 점수</div>
            <div style={styles.statCardVal}>{dashboard.averageReliabilityScore.score} / 5</div>
            <div style={styles.statCardTrend(true)}>↑ {dashboard.averageReliabilityScore.changeRate}점</div>
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
                  <div style={{ color: '#34a853', textAlign: 'center' }}>긍정<br/>{biasDistribution.positiveRatio}%</div>
                  <div style={{ color: '#fbbc04', textAlign: 'center' }}>중도<br/>{biasDistribution.neutralRatio}%</div>
                  <div style={{ color: '#ea4335', textAlign: 'center' }}>부정<br/>{biasDistribution.negativeRatio}%</div>
                </div>
                <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#fff8e1', border: '1px solid #ffecb3', borderRadius: '8px', fontSize: '12px', color: '#d84315', lineHeight: '1.4' }}>
                  <strong>! {infoBias.alertMessage}</strong>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '16px', textAlign: 'right' }}>주제별 성향 분포 &nbsp;&nbsp; <span style={{color:'#34a853'}}>●</span> 긍정 <span style={{color:'#fbbc04'}}>●</span> 중도 <span style={{color:'#ea4335'}}>●</span> 부정</div>
                {infoBias.categoryBiasDistribution.map(item => {
                  const total = Math.max(1, item.positive + item.neutral + item.negative)
                  return (
                  <div key={item.category} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '60px', fontSize: '13px', color: '#3c4043' }}>{item.category}</div>
                    <div style={{ flex: 1, display: 'flex', height: '6px', backgroundColor: '#f1f3f4', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(item.positive / total) * 100}%`, backgroundColor: '#34a853' }}></div>
                      <div style={{ width: `${(item.neutral / total) * 100}%`, backgroundColor: '#fbbc04' }}></div>
                      <div style={{ width: `${(item.negative / total) * 100}%`, backgroundColor: '#ea4335' }}></div>
                    </div>
                    <div style={{ fontSize: '12px', width: '32px', display: 'flex', justifyContent: 'space-between', color: '#5f6368' }}>
                      <span>{item.positive}</span><span>{item.neutral}</span><span>{item.negative}</span>
                    </div>
                  </div>
                )})}
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
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#202124' }}>{dashboard.averageReliabilityScore.score} <span style={{fontSize:'16px', color:'#5f6368', fontWeight:'normal'}}>/ 5</span></div>
              </div>
              <div style={{ width: '100%' }}>
                {reliabilityRows.map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', color: '#3c4043' }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: 'bold' }}>{item.value.count}건 ({item.value.ratio}%)</span>
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
              {recentActivities.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f3f4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#80868b' }}>{item.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 'bold', color: '#202124' }}>
                    <span style={{ color: item.score >= 3.2 ? '#00c4b4' : item.score >= 2.8 ? '#fbbc04' : '#ea4335' }}>●</span> {Number(item.score).toFixed(1)}
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
              {interestTopics.map(item => (
                <div key={item.rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: item.rank===1 ? '#1a73e8' : (item.rank===2 ? '#4285f4' : (item.rank===3 ? '#fbbc04' : '#e0e0e0')), color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{item.rank}</div>
                  <div style={{ width: '40px', height: `${Math.max(30, item.ratio * 2)}px`, backgroundColor: '#f1f3f4', borderRadius: '40px 40px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}>
                    <span style={{fontSize: '16px'}}>{item.rank===1 ? '🏛️' : (item.rank===2 ? '💰' : (item.rank===3 ? '👥' : (item.rank===4 ? '🔬' : '🌐')))}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#202124' }}>{item.category}</div>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>{item.searchCount}회</div>
                    <div style={{ fontSize: '11px', color: '#80868b' }}>{item.ratio}%</div>
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
              {earnedBadges.map((badge, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '64px', height: '64px', backgroundColor: ['#00c4b4', '#1a73e8', '#9334e6', '#fbbc04'][i % 4], borderRadius: '16px', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ transform: 'rotate(-45deg)', fontSize: '24px', color: '#fff', fontWeight: 'bold' }}>{i === 0 ? '✓' : i === 1 ? '🔍' : i === 2 ? '💬' : '⭐'}</div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#202124', marginBottom: '4px' }}>{badge.name}</div>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>{badge.level || badge.condition}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 이번 달 활동 요약 */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>이번 달 활동 요약</div>
              <div style={{ fontSize: '12px', color: '#80868b' }}>{monthlySummary.yearMonth} 기준</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3c4043' }}><span style={{fontSize:'16px'}}>🔍</span> 검색 횟수</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124' }}>{monthlySummary.searchCount.count} <span style={{fontSize:'13px', fontWeight:'normal'}}>회</span></span>
                  <span style={{ fontSize: '12px', color: '#34a853', width: '40px', textAlign: 'right' }}>↑ {monthlySummary.searchCount.changeRate}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3c4043' }}><span style={{fontSize:'16px'}}>📄</span> 검증한 기사 수</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124' }}>{monthlySummary.checkedArticles.count} <span style={{fontSize:'13px', fontWeight:'normal'}}>건</span></span>
                  <span style={{ fontSize: '12px', color: '#34a853', width: '40px', textAlign: 'right' }}>↑ {monthlySummary.checkedArticles.changeRate}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3c4043' }}><span style={{fontSize:'16px'}}>💬</span> 커뮤니티 활동</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124' }}>{monthlySummary.communityActivities.count} <span style={{fontSize:'13px', fontWeight:'normal'}}>회</span></span>
                  <span style={{ fontSize: '12px', color: '#34a853', width: '40px', textAlign: 'right' }}>↑ {monthlySummary.communityActivities.changeRate}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#3c4043' }}><span style={{fontSize:'16px'}}>✓</span> 평균 신뢰도 점수</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#202124' }}>{monthlySummary.averageReliabilityScore.score} <span style={{fontSize:'13px', fontWeight:'normal'}}>/ 5</span></span>
                  <span style={{ fontSize: '12px', color: '#34a853', width: '40px', textAlign: 'right' }}>↑ {monthlySummary.averageReliabilityScore.changeRate}</span>
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
