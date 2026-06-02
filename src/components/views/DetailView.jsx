export default function DetailView({ type }) {
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