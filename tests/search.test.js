import assert from 'node:assert/strict'
import test from 'node:test'

import { buildSearchPath, normalizeSearchQuery } from '../src/utils/search.js'

test('검색어 앞뒤 공백을 제거한다', () => {
  assert.equal(normalizeSearchQuery('  백신 검증  '), '백신 검증')
})

test('검색어를 공유 가능한 URL로 변환한다', () => {
  assert.equal(buildSearchPath('백신 검증'), '/search?q=%EB%B0%B1%EC%8B%A0%20%EA%B2%80%EC%A6%9D')
})

test('빈 검색어는 기본 검색 화면으로 이동한다', () => {
  assert.equal(buildSearchPath('   '), '/search')
})
