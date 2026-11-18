export type ImageWidthOptions = {
  /** The smallest generated width in px */
  min?: number
  /** The largest generated width in px; never more than the original */
  max?: number
  /** How many widths to generate, evenly spaced from `min` to `max` */
  steps?: number
  /** The original's width, when known */
  original?: number
}

/**
 * The widest crop of `ratio` the original can supply without upscaling: a tall crop of a wide image is limited by its
 * height. Undefined when the size is unknown.
 */
export const croppableWidth = (
  original: { width?: number; height?: number },
  ratio?: readonly [number, number],
): number | undefined => {
  if (!ratio || !original.width || !original.height) {
    return original.width
  }
  return Math.min(original.width, Math.floor((original.height * ratio[0]) / ratio[1]))
}

/** The widths for an image's `srcset`, smallest first, without duplicates. */
export const imageWidths = ({ min = 480, max = 2560, steps = 6, original }: ImageWidthOptions = {}): number[] => {
  const top = Math.min(max, original ?? max)
  const bottom = Math.min(min, top)
  const count = Math.max(1, Math.round(steps))
  if (count === 1 || bottom === top) {
    return [top]
  }
  const widths = Array.from({ length: count }, (_, index) => Math.round(bottom + ((top - bottom) * index) / (count - 1)))
  return [...new Set(widths)]
}
