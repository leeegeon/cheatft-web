import { useLocation, useParams } from 'react-router-dom';
import { cleanDisplayText } from '../../utils/text.js';

function getStoredArticle(id) {
  try {
    const stored = sessionStorage.getItem(`cheat-ft-article-${id}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getDisplayArticle(article, isNews) {
  if (!isNews) {
    return {
      title: '커뮤니티 팩트체크 게시글 제목입니다.',
      author: '작성자명',
      date: '2024.05.20 15:30',
      views: '1,234',
      body: '사용자가 작성한 커뮤니티 분석 내용 및 팩트체크 근거 데이터가 여기에 표시됩니다. 다양한 의견과 통계 자료가 함께 첨부될 수 있습니다.',
    };
  }

  return {
    title: cleanDisplayText(article?.title, '선택한 뉴스 정보를 찾을 수 없습니다.'),
    author: cleanDisplayText(article?.pub || article?.press || article?.publisher, '언론사 미상'),
    date: article?.date || '날짜 미상',
    views: article?.viewCount ? article.viewCount.toLocaleString('ko-KR') : '-',
    body: cleanDisplayText(article?.desc || article?.summary || article?.description, '목록에서 전달된 기사 요약이 없습니다.'),
    url: article?.url,
    score: article?.score || '-',
    scoreText: article?.scoreText || '확인중',
    scoreColor: article?.scoreColor || '#dadce0',
    reliabilityReason: article?.reliabilityReason || '',
    reliabilityCategory: article?.reliabilityCategory || article?.sourceCategory || '',
  };
}

export default function DetailView({ type }) {
  const location = useLocation();
  const { id } = useParams();
  const isNews = type === '뉴스';
  const article = location.state?.article || getStoredArticle(id);
  const displayArticle = getDisplayArticle(article, isNews);

  return (
    <div className="detail-page" style={{ display: 'flex', padding: '40px', gap: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <div className="detail-main" style={{ flex: 2 }}>
        <div style={{ display: 'inline-block', backgroundColor: isNews ? '#1a73e8' : '#00c4b4', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px' }}>{type}</div>
        <h2 style={{ fontSize: '32px', marginBottom: '24px', lineHeight: '1.4' }}>{displayArticle.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#5f6368', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 'bold', color: '#202124' }}>{displayArticle.author}</span>
          <span>|</span>
          <span>{displayArticle.date}</span>
          <span>|</span>
          <span>조회수 {displayArticle.views}</span>
        </div>
        <div style={{ lineHeight: '1.8', fontSize: '18px', color: '#3c4043', minHeight: '300px', whiteSpace: 'pre-wrap' }}>
          {displayArticle.body}
        </div>

        {isNews && displayArticle.url && (
          <a
            href={displayArticle.url}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', marginTop: '32px', color: '#0056d2', fontSize: '15px', fontWeight: 'bold', textDecoration: 'none' }}
          >
            원문 기사 보기 ↗
          </a>
        )}

        {!isNews && (
          <>
            <hr style={{ margin: '40px 0', border: '0px', height: '1px', backgroundColor: '#e0e0e0' }} />
            <h4 style={{ fontSize: '20px', marginBottom: '20px' }}>댓글 (12)</h4>
            <div className="detail-comment-form" style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#e8f0fe', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
              <input style={{ flex: 1, padding: '14px 16px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '15px' }} placeholder="의견을 남겨보세요..." />
              <button style={{ padding: '0 24px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>등록</button>
            </div>
          </>
        )}
      </div>

      <div className="detail-aside" style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '32px', borderRadius: '16px', height: 'fit-content', border: '1px solid #e0e0e0' }}>
        <div style={{ marginBottom: isNews ? 0 : '32px' }}>
          <strong style={{ display: 'block', marginBottom: '16px', fontSize: '18px' }}>신뢰도</strong>
          <div style={{ height: '12px', background: 'linear-gradient(to right, #ea4335, #fbbc04, #34a853)', borderRadius: '6px' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '8px', color: '#5f6368', fontWeight: 'bold' }}>
            <span>낮음</span><span>보통</span><span>높음</span>
          </div>
          {isNews && (
            <div style={{ marginTop: '18px', fontSize: '15px', color: '#3c4043', fontWeight: 'bold' }}>
              {displayArticle.scoreText} <span style={{ color: '#80868b', fontWeight: 'normal' }}>{displayArticle.score}</span>
            </div>
          )}
          {isNews && displayArticle.reliabilityCategory && (
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#5f6368' }}>
              분류: {displayArticle.reliabilityCategory}
            </div>
          )}
          {isNews && displayArticle.reliabilityReason && (
            <div style={{ marginTop: '14px', padding: '14px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e0e0e0', color: '#5f6368', fontSize: '13px', lineHeight: '1.6' }}>
              {displayArticle.reliabilityReason}
            </div>
          )}

          {!isNews && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #34A853', fontSize: '15px', color: '#3c4043', lineHeight: '1.6', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <strong style={{ display: 'block', color: '#1a73e8', marginBottom: '8px', fontSize: '14px' }}>AI 분석 코멘트</strong>
              해당 게시글은 다양한 출처를 인용하고 있으나, 결론 부분에서 특정 진영의 논리를 강화하는 경향이 보입니다.
            </div>
          )}
        </div>

        {!isNews && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
