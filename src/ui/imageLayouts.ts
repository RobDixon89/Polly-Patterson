// How a group of images is laid out and which sizes each one asks for, by how many there are. The crops make every
// arrangement fill its frame; the widths cover each tile at 2x density (the site is at most 1280px wide).

export type ImageTile = {
  /** The tile's crop, width / height */
  ratio: readonly [number, number]
  /** The tile's width on the page, for `sizes` */
  sizes: string
  minWidth: number
  maxWidth: number
  steps: number
  /** The tile spans the full width of its group */
  wide?: boolean
}

// Split Content: the images share a square frame beside the text (half the site width from tablet up, full width below)
const SPLIT_FULL = { sizes: '(min-width: 768px) 50vw, 100vw', minWidth: 480, maxWidth: 1280, steps: 4 }
const SPLIT_HALF = { sizes: '(min-width: 768px) 25vw, 50vw', minWidth: 320, maxWidth: 640, steps: 3 }

/**
 * Split Content's tiles: one image fills the square; two share it side by side (each 1:2); three are two squares above
 * one wide (2:1) image; four are a 2 × 2 grid of squares. Images past the fourth are left out.
 */
export const splitImageTiles = (count: number): ImageTile[] => {
  switch (Math.min(count, 4)) {
    case 1:
      return [{ ratio: [1, 1], ...SPLIT_FULL, wide: true }]
    case 2:
      return [0, 1].map(() => ({ ratio: [1, 2], ...SPLIT_HALF }))
    case 3:
      return [{ ratio: [1, 1], ...SPLIT_HALF }, { ratio: [1, 1], ...SPLIT_HALF }, { ratio: [2, 1], ...SPLIT_FULL, wide: true }]
    case 4:
      return [0, 1, 2, 3].map(() => ({ ratio: [1, 1], ...SPLIT_HALF }))
    default:
      return []
  }
}

/** An image row's shape, width / height: the same whatever the number of images, so the row's height never changes */
export const IMAGE_ROW_RATIO = [16, 9] as const

/**
 * An image row in rich text (at most 800px wide): always one 16:9 row, each image an equal share of its width at the
 * row's full height, so each image's crop is the row's ratio divided by the count (16:9, 8:9, 16:27). Images past the
 * third are left out.
 */
export const imageRowTiles = (count: number): ImageTile[] => {
  const n = Math.min(count, 3)
  const [width, height] = IMAGE_ROW_RATIO
  const tile: Record<number, ImageTile> = {
    1: { ratio: [width, height], sizes: '(min-width: 832px) 800px, 100vw', minWidth: 480, maxWidth: 1600, steps: 4 },
    2: { ratio: [width, height * 2], sizes: '(min-width: 832px) 400px, 50vw', minWidth: 320, maxWidth: 800, steps: 3 },
    3: { ratio: [width, height * 3], sizes: '(min-width: 832px) 267px, 33vw', minWidth: 240, maxWidth: 540, steps: 3 },
  }
  return n > 0 ? Array.from({ length: n }, () => tile[n]) : []
}
