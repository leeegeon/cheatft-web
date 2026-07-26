import test from 'node:test'
import assert from 'node:assert/strict'
import { getPressCategory, getPressLabel, getPressReliability } from '../src/utils/press.js'

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

test('기준표에 없는 언론사는 확인중으로 처리한다', () => {
  const reliability = getPressReliability('언론사(366)')

  assert.equal(reliability.category, '기타 출처')
  assert.equal(reliability.reliabilityScore, null)
  assert.equal(reliability.reliabilityLabel, '확인중')
})
