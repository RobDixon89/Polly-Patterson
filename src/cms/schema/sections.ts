// The blocks editors can place: banners in a page's Banner field, the rest in free areas (`body`). One list for every
// content type and the renderer. Plain TS with no Astro imports, so the schema script can use it too.
//
// Add a block here once it has a schema in code (`pnpm cms:schema` rejects names without one).

export type FreeAreaSection = {
  /** The block's technical name */
  name: string
  /** A banner: placed in the page's own Banner field (`bannerField()`), never in a free area, so it's always first */
  banner?: boolean
}

export const FREE_AREA_SECTIONS: FreeAreaSection[] = [
  { name: 'home_hero', banner: true },
  { name: 'inner_hero', banner: true },
  { name: 'rich_text' },
]

/** The block names a free area allows: every section but the banners. */
export const freeAreaSectionNames = () =>
  FREE_AREA_SECTIONS.filter((section) => !section.banner).map((section) => section.name)

/** The banner blocks, for a page's Banner field. */
export const bannerSectionNames = () =>
  FREE_AREA_SECTIONS.filter((section) => section.banner).map((section) => section.name)
