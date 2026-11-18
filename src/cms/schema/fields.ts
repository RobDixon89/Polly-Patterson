import { BACKGROUND_TINT_DEFAULT, BACKGROUND_TINTS, SECTION_THEMES } from '../../ui/types'
import { COMPONENT_GROUPS } from './groups'
import { bannerSectionNames, freeAreaSectionNames } from './sections'
import type { SchemaField, SchemaOption } from './types'

// Field builders for `<Name>Block.schema.ts`. Each returns a plain Storyblok field; pass any extra Storyblok setting
// through `settings`. Relative imports only: schemas are compiled outside Astro.

type Settings = Omit<SchemaField, 'type'>

const titleCase = (value: string) =>
  value
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const text = (settings: Settings = {}): SchemaField => ({ type: 'text', ...settings })

export const textarea = (settings: Settings = {}): SchemaField => ({ type: 'textarea', ...settings })

export const richText = (settings: Settings = {}): SchemaField => ({ type: 'richtext', ...settings })

/** Date and time, entered in the editor's time zone; Storyblok saves it in UTC, as `YYYY-MM-DD HH:mm`. */
export const datetime = (settings: Settings = {}): SchemaField => ({ type: 'datetime', ...settings })

export const boolean = (settings: Settings = {}): SchemaField => ({ type: 'boolean', ...settings })

/** Single-select dropdown. Options given as values get title-cased labels. */
export const option = (options: Array<string | SchemaOption>, settings: Settings = {}): SchemaField => ({
  type: 'option',
  use_uuid: true,
  options: options.map((item) => (typeof item === 'string' ? { name: titleCase(item), value: item } : item)),
  ...settings,
})

/** Image asset; alt text comes from the asset. */
export const image = (settings: Settings = {}): SchemaField => ({
  type: 'asset',
  filetypes: ['images'],
  ...settings,
})

export const link = (settings: Settings = {}): SchemaField => ({ type: 'multilink', ...settings })

/** Nested blocks, limited to the given component names. */
export const blocks = (allow: string[], settings: Settings = {}): SchemaField => ({
  type: 'bloks',
  restrict_type: '',
  restrict_components: true,
  component_whitelist: allow,
  ...settings,
})

/** A tab grouping the given keys (spread into the schema with its key, e.g. `seo_tab`). */
export const tab = (displayName: string, keys: string[]): SchemaField => ({
  type: 'tab',
  display_name: displayName,
  keys,
})

// Shared section fields ----------------------------------------------------------------------------------------

/**
 * The fields every section and banner has: `anchor_id` (made URL-safe with `anchorId()`), `theme` and
 * `background_image` (filled by `SectionWrapper`). Spread them
 * into the schema: `...sectionFields()`.
 */
export const sectionFields = (): Record<'anchor_id' | 'theme' | 'background_image' | 'background_tint', SchemaField> => ({
  anchor_id: text({
    display_name: 'Anchor ID',
    description: 'Optional. Lets other pages link to this section (e.g. "our-story" for /about#our-story).',
    tooltip: true,
  }),
  theme: option([...SECTION_THEMES], {
    display_name: 'Theme',
    description: 'Background and text colours for the section.',
    tooltip: true,
    default_value: SECTION_THEMES[0],
  }),
  background_image: image({
    display_name: 'Background Image',
    description:
      'Optional. Fills the section behind its content, cropped to the screen around the focal point. Recommended 4096 × 2304px, so the tall mobile crop stays sharp; keep the subject near the focal point.',
    tooltip: true,
  }),
  background_tint: option(
    Object.keys(BACKGROUND_TINTS).map((value) => ({ name: tintLabel(value as keyof typeof BACKGROUND_TINTS), value })),
    {
      display_name: 'Background Tint',
      description: `How strongly the background image is tinted with the theme's background colour, so the text stays readable. Only used with a background image. Defaults to ${tintLabel(BACKGROUND_TINT_DEFAULT)}.`,
      tooltip: true,
      default_value: BACKGROUND_TINT_DEFAULT,
    },
  ),
})

/** A background tint's label in the CMS: "None", or the name with its strength, e.g. "Medium (60%)" */
const tintLabel = (value: keyof typeof BACKGROUND_TINTS) =>
  value === 'none' ? 'None' : `${value.charAt(0).toUpperCase()}${value.slice(1)} (${BACKGROUND_TINTS[value]}%)`

/** An image's recommended upload size in px, `[width, height]` */
export type ImageSize = readonly [width: number, height: number]

/** An `image()` with its recommended upload size shown to editors. */
export const sizedImage = ([width, height]: ImageSize, settings: Settings = {}): SchemaField =>
  image({ description: `Recommended ${width} × ${height}px.`, tooltip: true, ...settings })

const SECTIONS_GROUP = COMPONENT_GROUPS.find(({ name }) => name === 'Sections')!.uuid

/**
 * Restricts a `bloks` field to these components. Storyblok reads an empty allow-list as "allow everything", so with
 * no components it restricts the field to the Sections group instead.
 */
const allowOnly = (names: string[]): SchemaField =>
  names.length
    ? blocks(names)
    : {
        type: 'bloks',
        restrict_type: 'groups',
        restrict_components: true,
        component_group_whitelist: [SECTIONS_GROUP],
      }

/** A free area (`body`): the sections from `FREE_AREA_SECTIONS`, never banners. */
export const freeArea = (settings: Settings = {}): SchemaField => ({
  ...allowOnly(freeAreaSectionNames()),
  display_name: 'Sections',
  description: 'Sections shown in this area, in order.',
  tooltip: true,
  ...settings,
})

/**
 * A page's Banner field (`banner`): at most one banner, shown above the sections. Banners have their own field because
 * Storyblok can't fix a block's position within one field: this way a banner is always first.
 */
export const bannerField = (settings: Settings = {}): SchemaField => ({
  ...allowOnly(bannerSectionNames()),
  display_name: 'Banner',
  description: 'Optional. The banner at the top of the page, above the sections. One at most.',
  tooltip: true,
  maximum: 1,
  ...settings,
})

// Rich text ----------------------------------------------------------------------------------------------------

/**
 * The rich text style options: the content-style classes (src/styles/mixins/_content-styles.scss). Editors apply them
 * from the toolbar's style menu; a style covering a whole paragraph is moved onto the `<p>` (`RichText`). The heading
 * styles give a heading's look to text that isn't a heading.
 */
export const CONTENT_STYLE_OPTIONS: SchemaOption[] = [
  { name: 'H1 style', value: 'h1-style' },
  { name: 'H2 style', value: 'h2-style' },
  { name: 'H3 style', value: 'h3-style' },
  { name: 'H4 style', value: 'h4-style' },
  { name: 'H5 style', value: 'h5-style' },
  { name: 'H6 style', value: 'h6-style' },
  { name: 'Large', value: 'body-lg' },
  { name: 'Default', value: 'body' },
  { name: 'Small', value: 'body-sm' },
  { name: 'Extra small', value: 'body-xs' },
].map((style) => ({ _uid: `content-style-${style.value}`, ...style }))

/** The body sizes only, for reduced rich text (an introduction can't take a heading's look) */
const BODY_STYLE_OPTIONS = CONTENT_STYLE_OPTIONS.filter((style) => style.value.startsWith('body'))

/** The full toolbar, for the Rich Text section: headings, inline formatting, quotes, rules, links, lists and styles. */
export const RICH_TEXT_TOOLBAR_FULL = [
  'paragraph',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'bold',
  'italic',
  'quote',
  'hrule',
  'link',
  'list',
  'olist',
  'style',
]

/** The reduced toolbar, for short copy such as a banner's introduction: inline formatting, links and body sizes. */
export const RICH_TEXT_TOOLBAR_REDUCED = ['paragraph', 'bold', 'italic', 'link', 'style']

/** The Rich Text section's field: the full toolbar and every content style. */
export const richTextFull = (settings: Settings = {}): SchemaField =>
  richText({
    customize_toolbar: true,
    toolbar: RICH_TEXT_TOOLBAR_FULL,
    style_options: CONTENT_STYLE_OPTIONS,
    allow_target_blank: true,
    ...settings,
  })

/** Rich text in any other component (an introduction): the reduced toolbar and the body sizes. */
export const richTextReduced = (settings: Settings = {}): SchemaField =>
  richText({
    customize_toolbar: true,
    toolbar: RICH_TEXT_TOOLBAR_REDUCED,
    style_options: BODY_STYLE_OPTIONS,
    allow_target_blank: true,
    ...settings,
  })

// Page fields --------------------------------------------------------------------------------------------------

/** The page SEO fields on a tab (spread into the schema): title, description, share image and robots. */
export const seoFields = (): Record<'seo_tab' | 'meta_title' | 'meta_description' | 'og_image' | 'robots', SchemaField> => ({
  seo_tab: tab('SEO', ['meta_title', 'meta_description', 'og_image', 'robots']),
  meta_title: text({
    display_name: 'Meta Title',
    description: 'Page title for browser tabs and search results; falls back to the title or story name. Keep it under 60 characters.',
    tooltip: true,
  }),
  meta_description: textarea({
    display_name: 'Meta Description',
    description: 'Short page description for search results. Keep it under 160 characters.',
    tooltip: true,
  }),
  og_image: sizedImage([1200, 630], { display_name: 'Share Image' }),
  robots: option(
    [
      { name: 'Index the page and follow links', value: 'index, follow' },
      { name: 'Index the page, ignore links', value: 'index, nofollow' },
      { name: 'Hide the page, follow links', value: 'noindex, follow' },
      { name: 'Hide the page and ignore links', value: 'noindex, nofollow' },
    ],
    {
      display_name: 'Robots',
      description: 'How search engines treat the page. Defaults to index, follow.',
      tooltip: true,
      default_value: 'index, follow',
    },
  ),
})

/** A list of `nav_link` blocks (text + link). */
export const navLinks = (settings: Settings = {}): SchemaField => blocks(['nav_link'], settings)
