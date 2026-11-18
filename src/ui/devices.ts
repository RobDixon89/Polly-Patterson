// Device definitions for images that fill the screen (section backgrounds). Each crops the image to a typical screen
// shape around the editor's focal point and asks for widths that cover that screen at its usual pixel density.
// Media queries match the breakpoints in styles/functions/_media.scss ($bp-tablet, $bp-desktop-small).

export type ImageSource = {
  /** When the browser uses this source; the last source is the fallback, so it has none */
  media?: string
  /** Crop to this width / height ratio */
  ratio?: readonly [number, number]
  /** The smallest generated width in px */
  minWidth?: number
  /** The largest generated width in px (never past the original's) */
  maxWidth?: number
  /** How many widths to generate */
  steps?: number
}

export const DEVICES = {
  // Portrait phones, up to 430px wide at 3x
  mobile: { media: '(max-width: 767px)', ratio: [9, 16], minWidth: 480, maxWidth: 1290, steps: 4 },
  // Tablets in either orientation, up to 1024px wide at 2x; a portrait crop still covers a landscape screen
  tablet: { media: '(max-width: 1279px)', ratio: [3, 4], minWidth: 768, maxWidth: 2048, steps: 4 },
  // Laptops and desktops, up to 1440px wide at 2x
  desktop: { ratio: [16, 9], minWidth: 1280, maxWidth: 2880, steps: 5 },
} as const satisfies Record<string, ImageSource>

/** Every device, smallest first, for `Image`'s `sources` */
export const FULL_SCREEN_SOURCES: readonly ImageSource[] = [DEVICES.mobile, DEVICES.tablet, DEVICES.desktop]
