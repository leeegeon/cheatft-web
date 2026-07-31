import { PRESS_RELIABILITY_BY_NAME } from '../data/pressReliability.js'

const BACKEND_PRESS_BY_OID = {
  '001': '연합뉴스',
  '002': '프레시안',
  '003': '뉴시스',
  '005': '국민일보',
  '008': '머니투데이',
  '009': '매일경제',
  '011': '서울경제',
  '014': '파이낸셜뉴스',
  '015': '한국경제',
  '016': '헤럴드경제',
  '018': '이데일리',
  '020': '동아일보',
  '021': '문화일보',
  '022': '세계일보',
  '023': '조선일보',
  '024': '매경이코노미',
  '025': '중앙일보',
  '028': '한겨레',
  '029': '디지털타임스',
  '030': '전자신문',
  '031': '아이뉴스24',
  '032': '경향신문',
  '036': '한겨레21',
  '047': '오마이뉴스',
  '050': '한경비즈니스',
  '052': 'YTN',
  '053': '주간조선',
  '055': 'SBS',
  '056': 'KBS',
  '057': 'MBN',
  '076': '스포츠조선',
  '079': '노컷뉴스',
  '081': '서울신문',
  '082': '부산일보',
  '088': '매일신문',
  '092': 'ZDNet Korea',
  '108': '스타뉴스',
  '109': 'OSEN',
  '119': '데일리안',
  '123': '조세일보',
  '138': '디지털데일리',
  '144': '스포츠경향',
  '214': 'MBC',
  '215': '한국경제TV',
  '241': '일간스포츠',
  '243': '이코노미스트',
  '277': '아시아경제',
  '296': '코메디닷컴',
  '366': '조선비즈',
  '374': 'SBS Biz',
  '382': '스포츠동아',
  '408': 'MBC연예',
  '410': 'MK스포츠',
  '417': '동행미디어 시대',
  '421': '뉴스1',
  '422': '연합뉴스TV',
  '437': 'JTBC',
  '448': 'TV조선',
  '449': '채널A',
  '468': '스포츠서울',
  '469': '한국일보',
  '609': '뉴스엔',
  '629': '더팩트',
  '648': '비즈워치',
  '654': '강원도민일보',
  '656': '대전일보',
  '658': '국제신문',
  '659': '전주MBC',
  '666': '경기일보',
}

const PRESS_LOGO_BY_OID = {
  '001': 'https://mimgnews.pstatic.net/image/upload/office_logo/001/2025/03/07/logo_001_100_20250307145612.png',
  '002': 'https://mimgnews.pstatic.net/image/upload/office_logo/002/2025/03/07/logo_002_100_20250307145612.png',
  '003': 'https://mimgnews.pstatic.net/image/upload/office_logo/003/2025/03/07/logo_003_100_20250307145615.png',
  '005': 'https://mimgnews.pstatic.net/image/upload/office_logo/005/2025/03/07/logo_005_100_20250307145616.png',
  '008': 'https://mimgnews.pstatic.net/image/upload/office_logo/008/2025/03/07/logo_008_100_20250307145621.png',
  '009': 'https://mimgnews.pstatic.net/image/upload/office_logo/009/2025/03/07/logo_009_100_20250307145623.png',
  '011': 'https://mimgnews.pstatic.net/image/upload/office_logo/011/2025/03/07/logo_011_100_20250307145637.png',
  '014': 'https://mimgnews.pstatic.net/image/upload/office_logo/014/2025/03/07/logo_014_100_20250307145643.png',
  '015': 'https://mimgnews.pstatic.net/image/upload/office_logo/015/2025/03/07/logo_015_100_20250307145644.png',
  '016': 'https://mimgnews.pstatic.net/image/upload/office_logo/016/2025/03/07/logo_016_100_20250307145646.png',
  '018': 'https://mimgnews.pstatic.net/image/upload/office_logo/018/2025/03/07/logo_018_100_20250307145653.png',
  '020': 'https://mimgnews.pstatic.net/image/upload/office_logo/020/2025/03/07/logo_020_100_20250307145700.png',
  '021': 'https://mimgnews.pstatic.net/image/upload/office_logo/021/2025/03/07/logo_021_100_20250307145703.png',
  '022': 'https://mimgnews.pstatic.net/image/upload/office_logo/022/2025/03/20/logo_022_100_20250320162643.png',
  '023': 'https://mimgnews.pstatic.net/image/upload/office_logo/023/2025/03/07/logo_023_100_20250307145706.png',
  '024': 'https://mimgnews.pstatic.net/image/upload/office_logo/024/2025/03/07/logo_024_100_20250307145709.png',
  '025': 'https://mimgnews.pstatic.net/image/upload/office_logo/025/2025/03/07/logo_025_100_20250307145712.png',
  '028': 'https://mimgnews.pstatic.net/image/upload/office_logo/028/2025/03/07/logo_028_100_20250307145718.png',
  '029': 'https://mimgnews.pstatic.net/image/upload/office_logo/029/2025/04/14/logo_029_100_20250414154305.png',
  '030': 'https://mimgnews.pstatic.net/image/upload/office_logo/030/2025/03/07/logo_030_100_20250307145551.png',
  '031': 'https://mimgnews.pstatic.net/image/upload/office_logo/031/2025/03/07/logo_031_100_20250307145552.png',
  '032': 'https://mimgnews.pstatic.net/image/upload/office_logo/032/2025/03/07/logo_032_100_20250307145554.png',
  '036': 'https://mimgnews.pstatic.net/image/upload/office_logo/036/2025/03/07/logo_036_100_20250307145600.png',
  '047': 'https://mimgnews.pstatic.net/image/upload/office_logo/047/2025/04/22/logo_047_100_20250422155828.png',
  '050': 'https://mimgnews.pstatic.net/image/upload/office_logo/050/2025/03/07/logo_050_100_20250307145629.png',
  '052': 'https://mimgnews.pstatic.net/image/upload/office_logo/052/2025/03/07/logo_052_100_20250307145633.png',
  '053': 'https://mimgnews.pstatic.net/image/upload/office_logo/053/2025/03/07/logo_053_100_20250307145635.png',
  '055': 'https://mimgnews.pstatic.net/image/upload/office_logo/055/2025/03/26/logo_055_100_20250326142328.png',
  '056': 'https://mimgnews.pstatic.net/image/upload/office_logo/056/2025/03/07/logo_056_100_20250307145641.png',
  '057': 'https://mimgnews.pstatic.net/image/upload/office_logo/057/2025/06/27/logo_057_100_20250627104110.png',
  '076': 'https://mimgnews.pstatic.net/image/upload/office_logo/076/2025/07/10/logo_076_100_20250710182014.jpg',
  '079': 'https://mimgnews.pstatic.net/image/upload/office_logo/079/2025/04/24/logo_079_100_20250424111642.png',
  '081': 'https://mimgnews.pstatic.net/image/upload/office_logo/081/2025/03/07/logo_081_100_20250307145604.png',
  '082': 'https://mimgnews.pstatic.net/image/upload/office_logo/082/2026/01/26/logo_082_100_20260126154325.png',
  '088': 'https://mimgnews.pstatic.net/image/upload/office_logo/088/2025/03/07/logo_088_100_20250307145609.png',
  '092': 'https://mimgnews.pstatic.net/image/upload/office_logo/092/2025/03/07/logo_092_100_20250307145628.png',
  '108': 'https://mimgnews.pstatic.net/image/upload/office_logo/108/2025/07/10/logo_108_100_20250710182015.jpg',
  '109': 'https://mimgnews.pstatic.net/image/upload/office_logo/109/2025/07/10/logo_109_100_20250710182016.jpg',
  '119': 'https://mimgnews.pstatic.net/image/upload/office_logo/119/2025/03/07/logo_119_100_20250307145603.png',
  '123': 'https://mimgnews.pstatic.net/image/upload/office_logo/123/2025/03/07/logo_123_100_20250307145612.png',
  '138': 'https://mimgnews.pstatic.net/image/upload/office_logo/138/2026/07/02/logo_138_100_20260702151226.png',
  '144': 'https://mimgnews.pstatic.net/image/upload/office_logo/144/2025/07/10/logo_144_100_20250710182022.jpg',
  '214': 'https://mimgnews.pstatic.net/image/upload/office_logo/214/2025/03/07/logo_214_100_20250307145647.png',
  '215': 'https://mimgnews.pstatic.net/image/upload/office_logo/215/2025/03/07/logo_215_100_20250307145651.png',
  '241': 'https://mimgnews.pstatic.net/image/upload/office_logo/241/2026/05/08/logo_241_100_20260508145932.png',
  '243': 'https://mimgnews.pstatic.net/image/upload/office_logo/243/2025/03/07/logo_243_100_20250307145610.png',
  '277': 'https://mimgnews.pstatic.net/image/upload/office_logo/277/2025/03/12/logo_277_100_20250312105338.png',
  '296': 'https://mimgnews.pstatic.net/image/upload/office_logo/296/2025/03/07/logo_296_100_20250307145636.png',
  '366': 'https://mimgnews.pstatic.net/image/upload/office_logo/366/2025/03/07/logo_366_100_20250307145615.png',
  '374': 'https://mimgnews.pstatic.net/image/upload/office_logo/374/2025/03/07/logo_374_100_20250307145639.png',
  '382': 'https://mimgnews.pstatic.net/image/upload/office_logo/382/2025/07/10/logo_382_100_20250710182036.jpg',
  '408': 'https://mimgnews.pstatic.net/image/upload/office_logo/408/2025/07/10/logo_408_100_20250710182040.png',
  '410': 'https://mimgnews.pstatic.net/image/upload/office_logo/410/2025/07/10/logo_410_100_20250710182041.jpg',
  '417': 'https://mimgnews.pstatic.net/image/upload/office_logo/417/2026/03/27/logo_417_100_20260327112050.png',
  '421': 'https://mimgnews.pstatic.net/image/upload/office_logo/421/2025/03/07/logo_421_100_20250307145710.png',
  '422': 'https://mimgnews.pstatic.net/image/upload/office_logo/422/2025/03/07/logo_422_100_20250307145714.png',
  '437': 'https://mimgnews.pstatic.net/image/upload/office_logo/437/2026/03/05/logo_437_100_20260305143306.png',
  '448': 'https://mimgnews.pstatic.net/image/upload/office_logo/448/2025/03/07/logo_448_100_20250307145622.png',
  '449': 'https://mimgnews.pstatic.net/image/upload/office_logo/449/2025/03/07/logo_449_100_20250307145624.png',
  '468': 'https://mimgnews.pstatic.net/image/upload/office_logo/468/2025/07/10/logo_468_100_20250710182103.jpg',
  '469': 'https://mimgnews.pstatic.net/image/upload/office_logo/469/2025/03/07/logo_469_100_20250307145719.png',
  '609': 'https://mimgnews.pstatic.net/image/upload/office_logo/609/2025/07/10/logo_609_100_20250710182110.png',
  '629': 'https://mimgnews.pstatic.net/image/upload/office_logo/629/2025/03/07/logo_629_100_20250307145723.png',
  '648': 'https://mimgnews.pstatic.net/image/upload/office_logo/648/2025/03/07/logo_648_100_20250307145626.png',
  '654': 'https://mimgnews.pstatic.net/image/upload/office_logo/654/2025/04/03/logo_654_100_20250403123318.png',
  '656': 'https://mimgnews.pstatic.net/image/upload/office_logo/656/2025/03/07/logo_656_100_20250307145652.png',
  '658': 'https://mimgnews.pstatic.net/image/upload/office_logo/658/2025/03/11/logo_658_100_20250311140757.png',
  '659': 'https://mimgnews.pstatic.net/image/upload/office_logo/659/2025/03/07/logo_659_100_20250307145659.png',
  '666': 'https://mimgnews.pstatic.net/image/upload/office_logo/666/2025/03/07/logo_666_100_20250307145718.png',
}

const PRESS_NAME_ALIASES = {
  'KBS 뉴스': 'KBS',
  'MBC 뉴스': 'MBC',
  'SBS 뉴스': 'SBS',
  'YTN 뉴스': 'YTN',
  'TV조선 뉴스': 'TV조선',
  '한국경제TV 뉴스': '한국경제TV',
  'SBS Biz 뉴스': 'SBS Biz',
  '동행미디어 시대': '동행미디어',
}

const PRESS_CATEGORY_FALLBACK_BY_NAME = {
  노컷뉴스: '인터넷/IT지',
  스포츠조선: '스포츠/연예지',
  스타뉴스: '스포츠/연예지',
  OSEN: '스포츠/연예지',
  일간스포츠: '스포츠/연예지',
  스포츠동아: '스포츠/연예지',
  MBC연예: '스포츠/연예지',
  MK스포츠: '스포츠/연예지',
  스포츠서울: '스포츠/연예지',
  뉴스엔: '스포츠/연예지',
  연합뉴스TV: '방송/통신사',
  비즈워치: '경제지',
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

function findReliabilityByName(pressLabel) {
  return Object.values(PRESS_RELIABILITY_BY_NAME).find(
    (entry) => normalizePressName(entry.name) === normalizePressName(pressLabel)
  ) || null
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

  if (pressName) return PRESS_NAME_ALIASES[pressName] || pressName
  if (!rawPress) return '출처 확인중'

  return PRESS_NAME_ALIASES[rawPress] || rawPress.replace(/\s+뉴스$/, '')
}

export function getPressCategory(press) {
  const pressLabel = getPressLabel(press)
  return findReliabilityByName(pressLabel)?.category || PRESS_CATEGORY_FALLBACK_BY_NAME[pressLabel] || '기타 출처'
}

export function getPressLogoUrl(press) {
  const oid = getPressOid(press)
  return oid ? PRESS_LOGO_BY_OID[oid] || '' : ''
}

export function getPressReliability(press) {
  const pressLabel = getPressLabel(press)
  const reliability = findReliabilityByName(pressLabel)

  if (!reliability) {
    return {
      name: pressLabel,
      category: getPressCategory(press),
      reliabilityScore: null,
      reliabilityLabel: '확인중',
      rationaleSummary: '아직 신뢰도 기준표에 없는 출처입니다. 원문과 다른 언론사 보도를 함께 확인하세요.',
      aiReferenceStars: null,
    }
  }

  return reliability
}

exposeObservedPressHelpers()
