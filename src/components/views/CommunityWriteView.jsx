import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../../services/cheatftApi.js'

const DRAFT_KEY = 'cheat-ft-community-draft'
const EMPTY_DRAFT = { category: '정보 공유 커뮤니티', title: '', content: '' }

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
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [draft])

  const updateField = (event) => {
    const { name, value } = event.target
    setDraft((current) => ({ ...current, [name]: value }))
    setSaveMessage('')
    setErrorMessage('')
  }

  const saveDraft = () => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    setSaveMessage('이 브라우저 탭에 임시 저장했습니다.')
  }

  const submitPost = async () => {
    if (!draft.title.trim() || !draft.content.trim()) {
      setErrorMessage('제목과 내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setSaveMessage('')

    try {
      await createPost({
        title: draft.title.trim(),
        content: draft.content.trim(),
        category: draft.category,
        tags: [],
      })
      sessionStorage.removeItem(DRAFT_KEY)
      setDraft(EMPTY_DRAFT)
      navigate('/community')
    } catch (error) {
      if (error.code === 'API_NOT_CONFIGURED') {
        setErrorMessage('백엔드 URL이 설정되지 않아 임시 저장만 가능합니다.')
      } else {
        setErrorMessage(error.message || '게시글 등록에 실패했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
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
          <option>정보 공유 커뮤니티</option>
          <option>정정 요청</option>
          <option>토론 게시판</option>
        </select>

        <label htmlFor="post-title">제목</label>
        <input id="post-title" name="title" value={draft.title} onChange={updateField} maxLength={120} placeholder="제목을 입력하세요" />

        <label htmlFor="post-content">내용</label>
        <textarea id="post-content" name="content" value={draft.content} onChange={updateField} maxLength={5000} placeholder="근거와 출처를 함께 작성해주세요." />
        <div className="form-counter">{draft.content.length} / 5,000</div>

        <div className="integration-notice" role="note">
          등록 시 백엔드 `POST /api/posts` 명세에 맞춰 제목, 내용, 카테고리를 전송합니다.
        </div>
        <div className="form-actions">
          <span className="save-message" aria-live="polite">{saveMessage}</span>
          {errorMessage && <span className="form-error" role="alert">{errorMessage}</span>}
          <button type="button" className="secondary-button" onClick={saveDraft}>임시 저장</button>
          <button type="button" className="primary-button" onClick={submitPost} disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </section>
  )
}
