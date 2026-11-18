/**
 * Storyblok component groups (Block Library folders). The UUIDs are the groups in the space, so pushes keep components
 * in the same folders. Add a group here (with its UUID from the space) before referencing it from a schema.
 */
export const COMPONENT_GROUPS = [
  // Sections editors place in a free area, e.g. `rich_text`
  { name: 'Sections', uuid: '08c0d904-030d-4ff0-aede-af22e27b3264' },
  // Banners for a page's Banner field, e.g. `home_hero`
  { name: 'Banners', uuid: 'b861393b-5b57-4829-95bd-8188fcd8cd8a' },
  // Story roots, e.g. `page`, `article`, `global_settings`
  { name: 'Content types', uuid: 'a7230430-8fca-4fa4-bf76-ab110d9d6289' },
  // Blocks reused inside others, e.g. `nav_link`
  { name: 'Shared', uuid: '14469261-5777-4a12-8b84-205dc947c257' },
] as const

export type ComponentGroupName = (typeof COMPONENT_GROUPS)[number]['name']
