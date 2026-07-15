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

function normalizePressName(value) {
  return String(value || '').replace(/\s+/g, '').toLowerCase()
}

export function getPressLabel(press) {
  const rawPress = String(press ?? '').trim()
  const oidMatch = rawPress.match(/^언론사\((\d{1,3})\)$/)
  const oid = oidMatch?.[1] || (/^\d{1,3}$/.test(rawPress) ? rawPress : '')
  const normalizedOid = oid ? oid.padStart(3, '0') : ''
  const pressName = normalizedOid ? BACKEND_PRESS_BY_OID[normalizedOid] : ''

  if (pressName) return pressName
  if (!rawPress) return '출처 확인중'

  return PRESS_NAME_ALIASES[rawPress] || rawPress.replace(/\s+뉴스$/, '')
}

export function getPressCategory(press) {
  const pressLabel = getPressLabel(press)
  const matchedName = Object.keys(PRESS_CATEGORY_BY_NAME).find((name) => normalizePressName(name) === normalizePressName(pressLabel))
  return matchedName ? PRESS_CATEGORY_BY_NAME[matchedName] : '기타 출처'
}
