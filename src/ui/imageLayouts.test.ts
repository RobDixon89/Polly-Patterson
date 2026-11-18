import assert from 'node:assert/strict'
import { test } from 'node:test'
import { imageRowTiles, splitImageTiles } from './imageLayouts'

const ratios = (tiles: ReturnType<typeof splitImageTiles>) => tiles.map((tile) => `${tile.ratio.join(':')}${tile.wide ? ' wide' : ''}`)

test('split content fills its square frame for each count', () => {
  assert.deepEqual(ratios(splitImageTiles(0)), [])
  assert.deepEqual(ratios(splitImageTiles(1)), ['1:1 wide'])
  assert.deepEqual(ratios(splitImageTiles(2)), ['1:2', '1:2'])
  assert.deepEqual(ratios(splitImageTiles(3)), ['1:1', '1:1', '2:1 wide'])
  assert.deepEqual(ratios(splitImageTiles(4)), ['1:1', '1:1', '1:1', '1:1'])
  // More than four: the first four
  assert.equal(splitImageTiles(6).length, 4)
})

test('split content asks for half-width sizes for half tiles', () => {
  const [half] = splitImageTiles(4)
  const wide = splitImageTiles(3)[2]
  assert.equal(half.maxWidth, 640)
  assert.equal(wide.maxWidth, 1280)
})

test('an image row keeps one height: each image takes an equal share of a 16:9 row', () => {
  assert.deepEqual(imageRowTiles(0), [])
  assert.deepEqual(imageRowTiles(1).map((tile) => [tile.ratio.join(':'), tile.maxWidth]), [['16:9', 1600]])
  assert.deepEqual(imageRowTiles(2).map((tile) => [tile.ratio.join(':'), tile.maxWidth]), [['16:18', 800], ['16:18', 800]])
  assert.deepEqual(imageRowTiles(5).map((tile) => tile.ratio.join(':')), ['16:27', '16:27', '16:27'])
  // Side by side, the shares add back up to the row's shape
  for (const n of [1, 2, 3]) {
    const [w, h] = imageRowTiles(n)[0].ratio
    assert.equal((w / h) * n, 16 / 9)
  }
})
