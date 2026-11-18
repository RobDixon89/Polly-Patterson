// Helpers that map Storyblok fields to the UI's models. Relative
// imports only, so `node --test` can run them.
import {
  BACKGROUND_TINT_DEFAULT,
  BACKGROUND_TINTS,
  SECTION_THEMES,
  type BackgroundTint,
  type ImageModel,
  type LinkModel,
  type SectionTheme,
} from '../../ui/types'
import type { StoryblokAsset, StoryblokMultilink } from '../types/gen/storyblok'

/** Lower-case, hyphenated text for anchor IDs: "Our Story & Values" → "our-story-values". */
export const anchorId = (text: string): string =>
  text
    .normalize('NFKD')
    // Drop the accents NFKD splits off (é → e)
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join('-')

/** A section's `anchor_id` as its `id`, or undefined when empty. */
export const sectionId = (value: string | undefined): string | undefined => anchorId(value ?? '') || undefined

/** A `theme` field's value as a section theme, defaulting to the first. */
export const sectionTheme = (value: string | undefined): SectionTheme =>
  SECTION_THEMES.includes(value as SectionTheme) ? (value as SectionTheme) : SECTION_THEMES[0]

/** A `background_tint` field's value, defaulting to medium for unset or unknown values. */
export const backgroundTint = (value: string | undefined): BackgroundTint =>
  value && Object.hasOwn(BACKGROUND_TINTS, value) ? (value as BackgroundTint) : BACKGROUND_TINT_DEFAULT

/**
 * An asset field as an `ImageModel`, or undefined when it's empty. Storyblok asset URLs carry the size
 * (`/f/<space>/<width>x<height>/…`), which reserves the image's space.
 */
export const imageModel = (asset: StoryblokAsset | undefined | null): ImageModel | undefined => {
  if (!asset?.filename) {
    return undefined
  }
  const size = /\/(\d+)x(\d+)\//.exec(asset.filename)
  return {
    src: asset.filename,
    alt: asset.alt ?? '',
    ...(size ? { width: Number(size[1]), height: Number(size[2]) } : {}),
    ...(asset.focus ? { focus: asset.focus } : {}),
  }
}

/**
 * A multilink field's address: a story's path from its full slug (`home` is `/`, a folder's start page drops its
 * trailing slash), a URL as it is (`www.x.com` gets `https://`), an email as `mailto:`. Undefined when it's empty.
 */
export const linkHref = (field: StoryblokMultilink | undefined): string | undefined => {
  if (!field) {
    return undefined
  }
  const anchor = 'anchor' in field && field.anchor ? `#${field.anchor}` : ''
  if (field.linktype === 'story') {
    // `story` is there when the request resolves links; `cached_url` holds the full slug otherwise
    const story = field.story && 'full_slug' in field.story ? field.story.full_slug : field.cached_url
    const slug = (story ?? '').replace(/\/$/, '')
    if (!slug && !anchor) {
      return undefined
    }
    return `${slug === 'home' ? '/' : `/${slug}`}${anchor}`
  }
  if (field.linktype === 'email') {
    return field.email ? `mailto:${field.email}` : undefined
  }
  const url = field.url || field.cached_url
  if (!url) {
    return undefined
  }
  return /^(https?:|mailto:|tel:|\/|#)/.test(url) ? url : `https://${url}`
}

/** A rich text link mark's attributes as an address, the same way as `linkHref` (story links hold the full slug). */
export const richTextHref = (attrs: {
  href?: string | null
  linktype?: string | null
  anchor?: string | null
}): string | undefined => {
  const href = attrs.href ?? ''
  return linkHref({
    fieldtype: 'multilink',
    id: '',
    linktype: (attrs.linktype ?? 'url') as 'url',
    url: href,
    cached_url: href.replace(/^\//, ''),
    anchor: attrs.anchor ?? undefined,
    email: href.replace(/^mailto:/, ''),
  } as StoryblokMultilink)
}

/** Whether an address is on another site (absolute or protocol-relative). */
export const isExternal = (href: string): boolean => /^(https?:)?\/\//.test(href)

/** A `nav_link` block (or any text + link pair) as a `LinkModel`, or undefined when either is empty. */
export const linkModel = (block: { text?: string; link?: StoryblokMultilink }): LinkModel | undefined => {
  const href = linkHref(block.link)
  if (!block.text || !href) {
    return undefined
  }
  return { text: block.text, href, ...(block.link?.target === '_blank' ? { target: '_blank' as const } : {}) }
}

/**
 * A `datetime()` field as an ISO date string. Storyblok saves it in UTC as `YYYY-MM-DD HH:mm`.
 * @returns The ISO string, or undefined when it's empty or not a date
 */
export const storyblokDateTime = (value: string | undefined): string | undefined => {
  const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/.exec(value ?? '')
  return match ? `${match[1]}T${match[2]}:00Z` : undefined
}
