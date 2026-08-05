const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || ''
const API_BASE_URL = configuredBaseUrl.replace(/\/$/, '')
const ACCESS_TOKEN_KEY = 'cheat-ft-access-token'
const CURRENT_USER_KEY = 'cheat-ft-current-user'

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'UNKNOWN', details = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function isApiConfigured() {
  return Boolean(API_BASE_URL)
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || ''
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getCurrentUser() {
  const storedUser = localStorage.getItem(CURRENT_USER_KEY)
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY)
    return null
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export async function apiRequest(path, options = {}) {
  if (!isApiConfigured()) {
    throw new ApiError('서비스 연결 설정을 확인해주세요.', { code: 'API_NOT_CONFIGURED' })
  }

  const { body, headers, auth = true, ...requestOptions } = options
  const accessToken = auth ? getAccessToken() : ''
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(payload?.message || '요청 처리 중 오류가 발생했습니다.', {
      status: response.status,
      code: payload?.code || 'HTTP_ERROR',
      details: payload?.details || null,
    })
  }

  if (payload?.status && Number(payload.status) >= 400) {
    throw new ApiError(payload?.message || '요청 처리 중 오류가 발생했습니다.', {
      status: payload.status,
      code: payload?.code || 'API_ERROR',
      details: payload?.details || payload?.data || null,
    })
  }

  return payload
}

export async function apiData(path, options = {}) {
  const payload = await apiRequest(path, options)
  return payload?.data ?? payload
}
