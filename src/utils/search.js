export function normalizeSearchQuery(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function buildSearchPath(value) {
  const query = normalizeSearchQuery(value)
  return query ? `/search?q=${encodeURIComponent(query)}` : '/search'
}

export function buildNewsSourceSearchUrl({ title, press }) {
  const query = normalizeSearchQuery([press, title].filter(Boolean).join(' '))
  return query ? `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(query)}` : ''
}
