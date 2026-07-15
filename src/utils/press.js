const BACKEND_PRESS_BY_OID = {
  '001': '연합뉴스',
  '003': '뉴시스',
  '421': '뉴스1',
  '056': 'KBS',
  '214': 'MBC',
  '055': 'SBS',
  '052': 'YTN',
  '028': '한겨레',
  '032': '경향신문',
  '023': '조선일보',
  '025': '중앙일보',
  '020': '동아일보',
  '015': '한국경제',
  '009': '매일경제',
  '018': '이데일리',
  '119': '데일리안',
  '008': '머니투데이',
  '047': '오마이뉴스',
}

const PRESS_LOGO_BY_OID = {
  '001': 'https://mimgnews.pstatic.net/image/upload/office_logo/001/2025/03/07/logo_001_100_20250307145612.png',
  '003': 'https://mimgnews.pstatic.net/image/upload/office_logo/003/2025/03/07/logo_003_100_20250307145615.png',
  '421': 'https://mimgnews.pstatic.net/image/upload/office_logo/421/2025/03/07/logo_421_100_20250307145710.png',
  '056': 'https://mimgnews.pstatic.net/image/upload/office_logo/056/2025/03/07/logo_056_100_20250307145641.png',
  '214': 'https://mimgnews.pstatic.net/image/upload/office_logo/214/2025/03/07/logo_214_100_20250307145647.png',
  '055': 'https://mimgnews.pstatic.net/image/upload/office_logo/055/2025/03/26/logo_055_100_20250326142328.png',
  '052': 'https://mimgnews.pstatic.net/image/upload/office_logo/052/2025/03/07/logo_052_100_20250307145633.png',
  '028': 'https://mimgnews.pstatic.net/image/upload/office_logo/028/2025/03/07/logo_028_100_20250307145718.png',
  '032': 'https://mimgnews.pstatic.net/image/upload/office_logo/032/2025/03/07/logo_032_100_20250307145554.png',
  '023': 'https://mimgnews.pstatic.net/image/upload/office_logo/023/2025/03/07/logo_023_100_20250307145706.png',
  '025': 'https://mimgnews.pstatic.net/image/upload/office_logo/025/2025/03/07/logo_025_100_20250307145712.png',
  '020': 'https://mimgnews.pstatic.net/image/upload/office_logo/020/2025/03/07/logo_020_100_20250307145700.png',
  '015': 'https://mimgnews.pstatic.net/image/upload/office_logo/015/2025/03/07/logo_015_100_20250307145644.png',
  '009': 'https://mimgnews.pstatic.net/image/upload/office_logo/009/2025/03/07/logo_009_100_20250307145623.png',
  '018': 'https://mimgnews.pstatic.net/image/upload/office_logo/018/2025/03/07/logo_018_100_20250307145653.png',
  '119': 'https://mimgnews.pstatic.net/image/upload/office_logo/119/2025/03/07/logo_119_100_20250307145603.png',
  '008': 'https://mimgnews.pstatic.net/image/upload/office_logo/008/2025/03/07/logo_008_100_20250307145621.png',
  '047': 'https://mimgnews.pstatic.net/image/upload/office_logo/047/2025/04/22/logo_047_100_20250422155828.png',
}

const PRESS_NAME_ALIASES = {
  'KBS 뉴스': 'KBS',
  'MBC 뉴스': 'MBC',
  'SBS 뉴스': 'SBS',
  'YTN 뉴스': 'YTN',
  'TV조선 뉴스': 'TV조선',
}

const PRESS_CATEGORY_BY_NAME = {
  연합뉴스: '방송/통신사',
  뉴시스: '방송/통신사',
  뉴스1: '방송/통신사',
  KBS: '방송/통신사',
  MBC: '방송/통신사',
  SBS: '방송/통신사',
  YTN: '방송/통신사',
  한겨레: '종합지',
  경향신문: '종합지',
  조선일보: '종합지',
  중앙일보: '종합지',
  동아일보: '종합지',
  한국경제: '경제지',
  매일경제: '경제지',
  이데일리: '경제지',
  머니투데이: '경제지',
  데일리안: '인터넷/IT지',
  오마이뉴스: '인터넷/IT지',
}

const OBSERVED_PRESS_STORAGE_KEY = 'cheat-ft-observed-press-map'

function normalizePressName(value) {
  return String(value || '').replace(/\s+/g, '').toLowerCase()
}

function getRawPressOid(press) {
  const rawPress = String(press ?? '').trim()
  const oidMatch = rawPress.match(/^언론사\((\d{1,3})\)$/)
  const oid = oidMatch?.[1] || (/^\d{1,3}$/.test(rawPress) ? rawPress : '')
  return oid ? oid.padStart(3, '0') : ''
}

function getStoredObservedPressMap() {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(window.localStorage.getItem(OBSERVED_PRESS_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveObservedPressMap(map) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(OBSERVED_PRESS_STORAGE_KEY, JSON.stringify(map, null, 2))
}

function normalizeFallbackPressName(value) {
  const label = String(value ?? '').trim()
  if (!label || /^\d{1,3}$/.test(label) || /^언론사\(\d{1,3}\)$/.test(label)) return ''
  return PRESS_NAME_ALIASES[label] || label.replace(/\s+뉴스$/, '')
}

function exposeObservedPressHelpers() {
  if (typeof window === 'undefined' || window.cheatFtPressList) return

  window.cheatFtPressList = () => Object.entries(getStoredObservedPressMap())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([oid, name]) => `${oid} - ${name}`)
    .join('\n')

  window.cheatFtPressMap = () => getStoredObservedPressMap()
  window.cheatFtClearPressList = () => window.localStorage.removeItem(OBSERVED_PRESS_STORAGE_KEY)
}

export function getPressOid(press) {
  const rawPress = String(press ?? '').trim()
  const normalizedOid = getRawPressOid(rawPress)

  if (BACKEND_PRESS_BY_OID[normalizedOid]) return normalizedOid

  const pressLabel = PRESS_NAME_ALIASES[rawPress] || rawPress.replace(/\s+뉴스$/, '')
  const matchedOid = Object.entries(BACKEND_PRESS_BY_OID).find(
    ([, name]) => normalizePressName(name) === normalizePressName(pressLabel)
  )?.[0]

  return matchedOid || ''
}

export function recordObservedPress(press, fallbackName = '') {
  const rawPress = String(press ?? '').trim()
  const oid = getRawPressOid(press)
  if (!oid) return

  const knownName = BACKEND_PRESS_BY_OID[oid]
  const isFallbackOidLabel = /^언론사\(\d{1,3}\)$/.test(rawPress)
  if (!knownName && !isFallbackOidLabel) return

  const fallbackLabel = normalizeFallbackPressName(fallbackName)
  const label = knownName || fallbackLabel || `언론사(${oid})`
  const observedMap = getStoredObservedPressMap()

  if (observedMap[oid] === label) return

  observedMap[oid] = label
  saveObservedPressMap(observedMap)
  exposeObservedPressHelpers()
}

export function getPressLabel(press) {
  const rawPress = String(press ?? '').trim()
  const oid = getPressOid(rawPress)
  const pressName = oid ? BACKEND_PRESS_BY_OID[oid] : ''

  if (pressName) return pressName
  if (!rawPress) return '출처 확인중'

  return PRESS_NAME_ALIASES[rawPress] || rawPress.replace(/\s+뉴스$/, '')
}

export function getPressCategory(press) {
  const pressLabel = getPressLabel(press)
  const matchedName = Object.keys(PRESS_CATEGORY_BY_NAME).find((name) => normalizePressName(name) === normalizePressName(pressLabel))
  return matchedName ? PRESS_CATEGORY_BY_NAME[matchedName] : '기타 출처'
}

export function getPressLogoUrl(press) {
  const oid = getPressOid(press)
  return oid ? PRESS_LOGO_BY_OID[oid] || '' : ''
}

exposeObservedPressHelpers()
