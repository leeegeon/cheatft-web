import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createComment, deleteComment, deletePost, getPost, updatePost } from '../../services/cheatftApi.js';
import { cleanDisplayText } from '../../utils/text.js';

const COMMUNITY_CATEGORIES = ['정보 공유 커뮤니티', '정정 요청', '토론 게시판'];

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

function mapPostDetail(post) {
  return {
    id: post?.id,
    category: cleanDisplayText(post?.category, '정보 공유 커뮤니티'),
    title: cleanDisplayText(post?.title, '제목 없음'),
    content: cleanDisplayText(post?.content, ''),
    tags: Array.isArray(post?.tags) ? post.tags.map((tag) => cleanDisplayText(tag, '')).filter(Boolean) : [],
    views: Number(post?.views ?? 0).toLocaleString(),
    commentCount: Number(post?.commentCount ?? post?.comment_count ?? post?.comments?.length ?? 0).toLocaleString(),
    createdAt: formatDateTime(post?.createdAt ?? post?.created_at),
    author: cleanDisplayText(post?.author, '작성자 미상'),
    comments: Array.isArray(post?.comments) ? post.comments.map((comment) => ({
      id: comment.id,
      content: cleanDisplayText(comment.content, ''),
      author: cleanDisplayText(comment.author, '작성자 미상'),
      createdAt: formatDateTime(comment.createdAt ?? comment.created_at),
    })) : [],
  };
}

function getReadableCommunityError(error, fallback) {
  if (error.code === 'API_NOT_CONFIGURED') return 'API 기본 URL이 설정되지 않았습니다. VITE_API_BASE_URL을 확인해주세요.';
  if (error.status === 401) return '로그인이 필요한 작업입니다.';
  if (error.status === 403) return '작성자 본인만 처리할 수 있습니다.';
  if (error.status === 404) return '게시글을 찾을 수 없습니다.';
  return error.message || fallback;
}

export default function CommunityDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState({ title: '', content: '', category: COMMUNITY_CATEGORIES[0], tags: '' });

  const styles = {
    page: { backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '40px' },
    shell: { maxWidth: '980px', margin: '0 auto' },
    card: { backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '14px', padding: '32px', marginBottom: '20px' },
    topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' },
    badge: { display: 'inline-flex', padding: '5px 10px', borderRadius: '6px', backgroundColor: '#e8f0fe', color: '#174ea6', fontSize: '13px', fontWeight: 'bold' },
    title: { fontSize: '30px', lineHeight: '1.35', color: '#202124', margin: '14px 0 16px' },
    meta: { display: 'flex', flexWrap: 'wrap', gap: '10px', color: '#5f6368', fontSize: '14px', paddingBottom: '22px', borderBottom: '1px solid #e8eaed' },
    content: { whiteSpace: 'pre-wrap', fontSize: '17px', lineHeight: '1.8', color: '#3c4043', marginTop: '24px' },
    actionRow: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    button: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #dadce0', backgroundColor: '#ffffff', color: '#3c4043', fontWeight: 'bold', cursor: 'pointer' },
    primaryButton: { padding: '10px 14px', borderRadius: '8px', border: 0, backgroundColor: '#0056d2', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer' },
    dangerButton: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ea4335', backgroundColor: '#ffffff', color: '#ea4335', fontWeight: 'bold', cursor: 'pointer' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '15px', boxSizing: 'border-box' },
    textarea: { width: '100%', minHeight: '180px', padding: '12px 14px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '15px', lineHeight: '1.6', boxSizing: 'border-box' },
    label: { display: 'block', marginBottom: '8px', color: '#3c4043', fontSize: '13px', fontWeight: 'bold' },
    field: { marginBottom: '16px' },
    comment: { padding: '16px 0', borderBottom: '1px solid #e8eaed' },
    empty: { padding: '32px', border: '1px dashed #dadce0', borderRadius: '12px', color: '#5f6368', textAlign: 'center', backgroundColor: '#fafbfc' },
  };

  const loadPost = () => {
    setStatus('loading');
    setErrorMessage('');

    getPost(id)
      .then((data) => {
        const mapped = mapPostDetail(data);
        setPost(mapped);
        setEditDraft({
          title: mapped.title,
          content: mapped.content,
          category: COMMUNITY_CATEGORIES.includes(mapped.category) ? mapped.category : COMMUNITY_CATEGORIES[0],
          tags: mapped.tags.join(', '),
        });
        setStatus('done');
      })
      .catch((error) => {
        setStatus('error');
        setErrorMessage(getReadableCommunityError(error, '게시글을 불러오지 못했습니다.'));
      });
  };

  useEffect(() => {
    let ignore = false;

    getPost(id)
      .then((data) => {
        if (ignore) return;
        const mapped = mapPostDetail(data);
        setPost(mapped);
        setEditDraft({
          title: mapped.title,
          content: mapped.content,
          category: COMMUNITY_CATEGORIES.includes(mapped.category) ? mapped.category : COMMUNITY_CATEGORIES[0],
          tags: mapped.tags.join(', '),
        });
        setStatus('done');
      })
      .catch((error) => {
        if (ignore) return;
        setStatus('error');
        setErrorMessage(getReadableCommunityError(error, '게시글을 불러오지 못했습니다.'));
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const submitEdit = async () => {
    if (!editDraft.title.trim() || !editDraft.content.trim()) {
      setErrorMessage('제목과 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setActionMessage('');

    try {
      await updatePost(id, {
        title: editDraft.title.trim(),
        content: editDraft.content.trim(),
        category: editDraft.category,
        tags: editDraft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setIsEditing(false);
      setActionMessage('게시글을 수정했습니다.');
      loadPost();
    } catch (error) {
      setErrorMessage(getReadableCommunityError(error, '게시글 수정에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitDelete = async () => {
    if (!window.confirm('게시글을 삭제할까요?')) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setActionMessage('');

    try {
      await deletePost(id);
      navigate('/community', { replace: true });
    } catch (error) {
      setErrorMessage(getReadableCommunityError(error, '게시글 삭제에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();

    if (!commentContent.trim()) {
      setErrorMessage('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setActionMessage('');

    try {
      await createComment(id, { content: commentContent.trim() });
      setCommentContent('');
      setActionMessage('댓글을 작성했습니다.');
      loadPost();
    } catch (error) {
      setErrorMessage(getReadableCommunityError(error, '댓글 작성에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeComment = async (commentId) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setActionMessage('');

    try {
      await deleteComment(id, commentId);
      setActionMessage('댓글을 삭제했습니다.');
      loadPost();
    } catch (error) {
      setErrorMessage(getReadableCommunityError(error, '댓글 삭제에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="community-detail-page" style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topRow}>
          <button type="button" style={styles.button} onClick={() => navigate('/community')}>목록으로</button>
          {status === 'done' && (
            <div style={styles.actionRow}>
              <button type="button" style={styles.button} onClick={() => setIsEditing((value) => !value)}>{isEditing ? '수정 취소' : '수정'}</button>
              <button type="button" style={styles.dangerButton} onClick={submitDelete} disabled={isSubmitting}>삭제</button>
            </div>
          )}
        </div>

        {errorMessage && <div className="form-error" role="alert">{errorMessage}</div>}
        {actionMessage && <div className="integration-notice" role="status">{actionMessage}</div>}

        {status === 'loading' && <div style={styles.empty}>게시글을 불러오는 중입니다.</div>}
        {status === 'error' && <div style={styles.empty}>게시글을 표시할 수 없습니다.</div>}

        {status === 'done' && post && (
          <>
            <article style={styles.card}>
              {isEditing ? (
                <>
                  <div style={styles.field}>
                    <label htmlFor="edit-category" style={styles.label}>카테고리</label>
                    <select
                      id="edit-category"
                      style={styles.input}
                      value={editDraft.category}
                      onChange={(event) => setEditDraft((draft) => ({ ...draft, category: event.target.value }))}
                    >
                      {COMMUNITY_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label htmlFor="edit-title" style={styles.label}>제목</label>
                    <input
                      id="edit-title"
                      style={styles.input}
                      value={editDraft.title}
                      onChange={(event) => setEditDraft((draft) => ({ ...draft, title: event.target.value }))}
                      maxLength={120}
                    />
                  </div>
                  <div style={styles.field}>
                    <label htmlFor="edit-content" style={styles.label}>내용</label>
                    <textarea
                      id="edit-content"
                      style={styles.textarea}
                      value={editDraft.content}
                      onChange={(event) => setEditDraft((draft) => ({ ...draft, content: event.target.value }))}
                      maxLength={5000}
                    />
                  </div>
                  <div style={styles.field}>
                    <label htmlFor="edit-tags" style={styles.label}>태그</label>
                    <input
                      id="edit-tags"
                      style={styles.input}
                      value={editDraft.tags}
                      onChange={(event) => setEditDraft((draft) => ({ ...draft, tags: event.target.value }))}
                      placeholder="쉼표로 구분"
                    />
                  </div>
                  <button type="button" style={styles.primaryButton} onClick={submitEdit} disabled={isSubmitting}>수정 저장</button>
                </>
              ) : (
                <>
                  <span style={styles.badge}>{post.category}</span>
                  <h1 style={styles.title}>{post.title}</h1>
                  <div style={styles.meta}>
                    <span>{post.author}</span>
                    <span>{post.createdAt}</span>
                    <span>조회수 {post.views}</span>
                    <span>댓글 {post.commentCount}</span>
                  </div>
                  <div style={styles.content}>{post.content || '본문이 비어 있습니다.'}</div>
                  {post.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
                      {post.tags.map((tag) => <span key={tag} style={styles.badge}>#{tag}</span>)}
                    </div>
                  )}
                </>
              )}
            </article>

            <section style={styles.card} aria-labelledby="comments-title">
              <h2 id="comments-title" style={{ marginTop: 0 }}>댓글 {post.commentCount}</h2>
              <form onSubmit={submitComment} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  style={styles.input}
                  value={commentContent}
                  onChange={(event) => setCommentContent(event.target.value)}
                  placeholder="의견을 남겨보세요."
                  disabled={isSubmitting}
                />
                <button type="submit" style={{ ...styles.primaryButton, flexShrink: 0 }} disabled={isSubmitting}>등록</button>
              </form>

              {post.comments.length === 0 ? (
                <div style={styles.empty}>아직 댓글이 없습니다.</div>
              ) : post.comments.map((comment) => (
                <div key={comment.id} style={styles.comment}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <strong>{comment.author}</strong>
                    <button type="button" style={{ ...styles.button, padding: '6px 10px', fontSize: '12px' }} onClick={() => removeComment(comment.id)} disabled={isSubmitting}>삭제</button>
                  </div>
                  <div style={{ color: '#80868b', fontSize: '13px', marginTop: '4px' }}>{comment.createdAt}</div>
                  <div style={{ color: '#3c4043', lineHeight: '1.6', marginTop: '10px', whiteSpace: 'pre-wrap' }}>{comment.content}</div>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
