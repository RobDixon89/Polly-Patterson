import assert from 'node:assert/strict'
import { test } from 'node:test'
import { entriesToStrings, flattenMessages, format } from './strings'

test('entriesToStrings leaves out empty values and prefers the dimension value', () => {
  assert.deepEqual(
    entriesToStrings([
      { name: 'pagination.next', value: 'Next' },
      { name: 'pagination.previous', value: '' },
      { name: 'article.read_more', value: 'Read more', dimension_value: 'Lire' },
      { name: 'article.empty', value: 'None', dimension_value: null },
    ]),
    { 'pagination.next': 'Next', 'article.read_more': 'Lire', 'article.empty': 'None' },
  )
})

test('flattenMessages turns nested messages into dot keys', () => {
  assert.deepEqual(flattenMessages({ a: { b: 'x', c: { d: 'y' } }, e: 'z' }), { 'a.b': 'x', 'a.c.d': 'y', e: 'z' })
})

test('format fills placeholders and leaves unknown ones', () => {
  assert.equal(format('© {year} Company', { year: 2026 }), '© 2026 Company')
  assert.equal(format('Page {page} of {total}', { page: 2 }), 'Page 2 of {total}')
})
