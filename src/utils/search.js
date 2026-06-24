export function normalizeSearchQuery(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function buildSearchPath(value) {
  const query = normalizeSearchQuery(value)
  return query ? `/search?q=${encodeURIComponent(query)}` : '/search'
}
