/**
 * Breakpoints in pixels, mirroring `$bp-*` in `app/assets/scss/functions/_media.scss`.
 * Use with `from`, `until` and `between` to build media queries for JS (e.g. `useMediaQuery`).
 */
export const Device = {
  MobileSmall: 320,
  Mobile: 375,
  MobileLarge: 480,
  TabletSmall: 568,
  Tablet: 768,
  TabletLarge: 1024,
  DesktopSmall: 1280,
  Desktop: 1366,
  DesktopLarge: 1600,
  ActualDesktop: 1920,
  DesktopXL: 2560,
} as const

export type Device = (typeof Device)[keyof typeof Device]

/** Media query matching viewports at least `size` wide (mobile-first). */
export function from(size: Device): string {
  return `(min-width: ${size}px)`
}

/** Media query matching viewports narrower than `size`. */
export function until(size: Device): string {
  return `(max-width: ${size - 1}px)`
}

/** Media query matching viewports from `start` up to (but not including) `end`. */
export function between(start: Device, end: Device): string {
  return `${from(start)} and ${until(end)}`
}
