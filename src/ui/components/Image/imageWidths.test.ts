import assert from 'node:assert/strict'
import { test } from 'node:test'
import { croppableWidth, imageWidths } from './imageWidths'

test('a crop is never wider than the original can supply', () => {
  // A 9:16 crop of a 2560 × 1000 image is limited by its height
  assert.equal(croppableWidth({ width: 2560, height: 1000 }, [9, 16]), 562)
  assert.equal(croppableWidth({ width: 2560, height: 1000 }, [16, 9]), 1777)
  assert.equal(croppableWidth({ width: 1600, height: 1600 }, [3, 4]), 1200)
  assert.equal(croppableWidth({ width: 2560, height: 1000 }), 2560)
  assert.equal(croppableWidth({}, [1, 1]), undefined)
})

test('spaces the widths evenly from min to max', () => {
  assert.deepEqual(imageWidths({ min: 400, max: 1600, steps: 4 }), [400, 800, 1200, 1600])
})

test('never goes past the original', () => {
  assert.deepEqual(imageWidths({ min: 400, max: 2560, steps: 3, original: 1000 }), [400, 700, 1000])
  assert.deepEqual(imageWidths({ min: 480, max: 2560, original: 300 }), [300])
})

test('one step is the largest width', () => {
  assert.deepEqual(imageWidths({ min: 400, max: 800, steps: 1 }), [800])
})

test('defaults to six widths from 480 to 2560', () => {
  assert.deepEqual(imageWidths(), [480, 896, 1312, 1728, 2144, 2560])
})
