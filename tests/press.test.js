import test from 'node:test'
import assert from 'node:assert/strict'
import { PRESS_RELIABILITY_ENTRIES } from '../src/data/pressReliability.js'
import { getPressCategory, getPressLabel, getPressReliability } from '../src/utils/press.js'
import {
  getReliabilityColor,
  getReliabilityGaugeFillPercent,
  getReliabilityLabel,
  normalizeReliabilityScoreValue,
} from '../src/utils/reliability.js'

test('백엔드 oid를 언론사명과 신뢰도 기준으로 변환한다', () => {
  assert.equal(getPressLabel('144'), '스포츠경향')
  assert.equal(getPressCategory('언론사(144)'), '스포츠/연예지')
  assert.equal(getPressReliability('144').reliabilityLabel, '주의')
})

test('언론사 별칭으로 신뢰도 기준을 찾는다', () => {
  const reliability = getPressReliability('KBS 뉴스')

  assert.equal(reliability.name, 'KBS')
  assert.equal(reliability.category, '방송/통신사')
  assert.equal(reliability.reliabilityScore, 4.2)
})

test('새 백엔드 매핑도 신뢰도 기준으로 변환한다', () => {
  const reliability = getPressReliability('언론사(648)')

  assert.equal(reliability.name, '비즈워치')
  assert.equal(reliability.category, '경제지')
  assert.equal(reliability.reliabilityScore, 3.7)
  assert.equal(reliability.reliabilityLabel, '보통')
})

test('매핑에도 없는 언론사는 기타 출처로 처리한다', () => {
  const reliability = getPressReliability('언론사(999)')

  assert.equal(reliability.name, '언론사(999)')
  assert.equal(reliability.category, '기타 출처')
  assert.equal(reliability.reliabilityScore, null)
  assert.equal(reliability.reliabilityLabel, '확인중')
})

test('신뢰도 점수는 5점 기준으로 정규화한다', () => {
  assert.equal(normalizeReliabilityScoreValue(10), 5)
  assert.equal(normalizeReliabilityScoreValue(80), 4)
  assert.equal(normalizeReliabilityScoreValue('3.7 / 5'), 3.7)
})

test('신뢰도 라벨과 색상은 같은 기준을 쓴다', () => {
  assert.equal(getReliabilityLabel(3.9), '높음')
  assert.equal(getReliabilityColor(3.9), '#34a853')
  assert.equal(getReliabilityLabel(3.8), '보통')
  assert.equal(getReliabilityColor(3.8), '#fbbc04')
  assert.equal(getReliabilityLabel(3.2), '주의')
  assert.equal(getReliabilityColor(3.2), '#ea4335')
})

test('검증하기 게이지 채움은 5점 만점 기준으로 왼쪽에서 오른쪽으로 누적된다', () => {
  assert.equal(getReliabilityGaugeFillPercent(0), 0)
  assert.equal(getReliabilityGaugeFillPercent(2.5), 50)
  assert.equal(getReliabilityGaugeFillPercent(5), 100)
})

test('언론사 신뢰도 원본 라벨은 공통 기준과 일치한다', () => {
  for (const entry of PRESS_RELIABILITY_ENTRIES) {
    assert.equal(entry.reliabilityLabel, getReliabilityLabel(entry.reliabilityScore), entry.name)
  }
})
