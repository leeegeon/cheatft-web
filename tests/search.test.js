import assert from 'node:assert/strict'
import test from 'node:test'

import { buildNewsSourceSearchUrl, buildSearchPath, normalizeSearchQuery } from '../src/utils/search.js'

test('검색어 앞뒤 공백을 제거한다', () => {
  assert.equal(normalizeSearchQuery('  백신 검증  '), '백신 검증')
})

test('검색어를 공유 가능한 URL로 변환한다', () => {
  assert.equal(buildSearchPath('백신 검증'), '/search?q=%EB%B0%B1%EC%8B%A0%20%EA%B2%80%EC%A6%9D')
})

test('빈 검색어는 기본 검색 화면으로 이동한다', () => {
  assert.equal(buildSearchPath('   '), '/search')
})

test('기사 제목과 언론사로 네이버 뉴스 검색 URL을 만든다', () => {
  assert.equal(
    buildNewsSourceSearchUrl({ title: '정치적 편향 기사', press: '한겨레' }),
    'https://search.naver.com/search.naver?where=news&query=%ED%95%9C%EA%B2%A8%EB%A0%88%20%EC%A0%95%EC%B9%98%EC%A0%81%20%ED%8E%B8%ED%96%A5%20%EA%B8%B0%EC%82%AC'
  )
})
