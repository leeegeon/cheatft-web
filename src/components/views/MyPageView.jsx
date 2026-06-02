export default function MyPageView() {
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