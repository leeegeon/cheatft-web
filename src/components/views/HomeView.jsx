import { useState } from 'react';

export default function HomeView({ onSearch, onNavigate }) {
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
              <div style={{...styles.sectionHeader, cursor: 'pointer'}} onClick={() => onNavigate('search')}>
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
              <button 
                style={{ padding: '14px 24px', backgroundColor: '#ffffff', color: '#3b5bdb', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
                onClick={() => onNavigate(`community?tab=${encodeURIComponent('가이드 & 튜토리얼')}`)}
              >
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