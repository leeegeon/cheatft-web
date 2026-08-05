import { apiData, setAccessToken, setCurrentUser } from './apiClient.js'

function buildPath(path, params = {}) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })

  const queryString = query.toString()
  return queryString ? `${path}?${queryString}` : path
}

export function getSummary() {
  return apiData('/summary')
}

export async function login(credentials) {
  const session = await apiData('/login', {
    method: 'POST',
    body: credentials,
    auth: false,
  })

  if (session?.accessToken) {
    setAccessToken(session.accessToken)
    setCurrentUser({
      id: session.userId ?? session.id ?? session.user?.id ?? null,
      email: session.email ?? session.user?.email ?? credentials.email,
      nickname: session.nickname ?? session.user?.nickname ?? '',
    })
  }

  return session
}

export function signup(account) {
  return apiData('/signup', {
    method: 'POST',
    body: account,
    auth: false,
  })
}

export function requestCheck({ content }) {
  return apiData('/checks', {
    method: 'POST',
    body: { content },
  })
}

export function getCheckResult(id, params = {}) {
  return apiData(buildPath(`/checks/${id}`, params))
}

export function getArticleFromUrl(url) {
  return apiData('/article', {
    method: 'POST',
    body: { url },
    auth: false,
  })
}

export function recommendKeywords(content) {
  return apiData('/keywords', {
    method: 'POST',
    body: { content },
  })
}

export async function runFactCheck(content, params = {}) {
  const request = await requestCheck({ content })
  return request?.checkId ? getCheckResult(request.checkId, params) : request
}

export function requestAnalysis({ keyword, period = 1 }) {
  return apiData('/analysis', {
    method: 'POST',
    body: { keyword, period },
  })
}

export function getAnalysisResult(id, params = {}) {
  return apiData(buildPath(`/analysis/${id}`, params))
}

export async function runAnalysis({ keyword, period = 1, limit = 10 }) {
  const request = await requestAnalysis({ keyword, period })
  return request?.analysisId ? getAnalysisResult(request.analysisId, { limit }) : request
}

export function getReports(params = {}) {
  return apiData(buildPath('/reports', params))
}

export function deleteReport(id) {
  return apiData(`/reports/${id}`, {
    method: 'DELETE',
  })
}

export function getPosts(params = {}) {
  return apiData(buildPath('/posts', params))
}

export function getPost(id) {
  return apiData(`/posts/${id}`)
}

export function createPost(post) {
  return apiData('/posts', {
    method: 'POST',
    body: post,
  })
}

export function updatePost(id, post) {
  return apiData(`/posts/${id}`, {
    method: 'PUT',
    body: post,
  })
}

export function deletePost(id) {
  return apiData(`/posts/${id}`, {
    method: 'DELETE',
  })
}

export function createComment(postId, comment) {
  return apiData(`/posts/${postId}/comments`, {
    method: 'POST',
    body: comment,
  })
}

export function deleteComment(postId, commentId) {
  return apiData(`/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  })
}

export function requestPasswordCode(email) {
  return apiData('/password/code', {
    method: 'POST',
    body: { email },
    auth: false,
  })
}

export function verifyPasswordCode({ email, code }) {
  return apiData('/password/verify', {
    method: 'POST',
    body: { email, code },
    auth: false,
  })
}

export function resetPassword({ resetToken, newPassword }) {
  return apiData('/password/reset', {
    method: 'POST',
    body: { resetToken, newPassword },
    auth: false,
  })
}

export function getProfile(params = {}) {
  return apiData(buildPath('/profile', params))
}
