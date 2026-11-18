// Shared UI types. Plain TS with no Astro imports: the schema builders (compiled outside Astro) use them too.

/** Section themes, applied by `SectionWrapper` through `data-section-theme`. Keep in sync with `mixins/_theme.scss`; the first is the default. */
export const SECTION_THEMES = ['light', 'dark'] as const;
export type SectionTheme = (typeof SECTION_THEMES)[number];

/** An image for the `Image` component */
export type ImageModel = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** The editor's focal point (`x1:y1:x2:y2`), which centres crops */
  focus?: string;
};

/** A link with its text, for navigation lists */
export type LinkModel = {
  text: string;
  href: string;
  target?: '_blank';
};

/**
 * How strongly a background image is tinted with the section's background colour, as the strongest point of the
 * gradient (`SectionWrapper`); keys are the CMS option values.
 */
export const BACKGROUND_TINTS = {
  none: 0,
  subtle: 20,
  light: 35,
  medium: 60,
  strong: 85,
  heavy: 100,
} as const;
export type BackgroundTint = keyof typeof BACKGROUND_TINTS;
export const BACKGROUND_TINT_DEFAULT: BackgroundTint = 'medium';

/** Button styles: `primary` is filled in the text colour (the opposite of the section background); `outline` is a border */
export const BUTTON_VARIANTS = ['primary', 'outline', 'text'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

/** A call to action: a link drawn as a button */
export type CtaModel = LinkModel & {
  variant: ButtonVariant;
  /** Screen reader text after the label when the link opens another site or a new tab, e.g. "(opens in a new tab)" */
  externalLabel?: string;
};
