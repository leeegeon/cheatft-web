const HTML_ENTITY_MAP = {
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  nbsp: ' ',
}

export function decodeHtmlEntities(value) {
  return String(value ?? '').replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity[0] === '#') {
      const isHex = entity[1]?.toLowerCase() === 'x'
      const codePoint = Number.parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10)
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match
    }

    return HTML_ENTITY_MAP[entity] || match
  })
}

export function cleanDisplayText(value, fallback = '') {
  const decoded = decodeHtmlEntities(value).replace(/<[^>]*>/g, '').trim()
  return decoded || fallback
}
