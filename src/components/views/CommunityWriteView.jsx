import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DRAFT_KEY = 'cheat-ft-community-draft'
const EMPTY_DRAFT = { category: '정보 공유', title: '', content: '' }

function readDraft() {
  try {
    const saved = sessionStorage.getItem(DRAFT_KEY)
    return saved ? { ...EMPTY_DRAFT, ...JSON.parse(saved) } : EMPTY_DRAFT
  } catch {
    return EMPTY_DRAFT
  }
}

export default function CommunityWriteView() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(readDraft)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [draft])

  const updateField = (event) => {
    const { name, value } = event.target
    setDraft((current) => ({ ...current, [name]: value }))
    setSaveMessage('')
  }

  const saveDraft = () => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    setSaveMessage('이 브라우저 탭에 임시 저장했습니다.')
  }

  return (
    <section className="form-page" aria-labelledby="community-write-title">
      <div className="form-card form-card-wide">
        <div className="form-heading-row">
          <div>
            <h1 id="community-write-title">커뮤니티 글 작성</h1>
            <p>작성 내용은 자동으로 임시 저장됩니다.</p>
          </div>
          <button type="button" className="secondary-button" onClick={() => navigate('/community')}>목록으로</button>
        </div>

        <label htmlFor="post-category">카테고리</label>
        <select id="post-category" name="category" value={draft.category} onChange={updateField}>
          <option>정보 공유</option>
          <option>정정 요청</option>
          <option>토론</option>
          <option>질문</option>
        </select>

        <label htmlFor="post-title">제목</label>
        <input id="post-title" name="title" value={draft.title} onChange={updateField} maxLength={120} placeholder="제목을 입력하세요" />

        <label htmlFor="post-content">내용</label>
        <textarea id="post-content" name="content" value={draft.content} onChange={updateField} maxLength={5000} placeholder="근거와 출처를 함께 작성해주세요." />
        <div className="form-counter">{draft.content.length} / 5,000</div>

        <div className="integration-notice" role="note">
          게시물 등록은 인증·게시물 API 계약 후 연결됩니다. 현재는 임시 저장만 가능합니다.
        </div>
        <div className="form-actions">
          <span className="save-message" aria-live="polite">{saveMessage}</span>
          <button type="button" className="secondary-button" onClick={saveDraft}>임시 저장</button>
          <button type="button" className="primary-button" disabled title="게시물 API 연동 후 활성화됩니다">등록</button>
        </div>
      </div>
    </section>
  )
}
