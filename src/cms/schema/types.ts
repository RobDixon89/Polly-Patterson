/**
 * Storyblok component schema, as written in `<Name>Block.schema.ts` and compiled by `pnpm cms:schema`.
 *
 * Mirrors the JSON the Storyblok CLI pushes, minus the ids, timestamps and positions Storyblok assigns.
 * Field order in `schema` becomes the field order in the editor.
 */

export type SchemaFieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'markdown'
  | 'number'
  | 'boolean'
  | 'option'
  | 'options'
  | 'datetime'
  | 'asset'
  | 'multiasset'
  | 'multilink'
  | 'bloks'
  | 'table'
  | 'section'
  | 'tab'
  | 'custom'

export type SchemaOption = {
  name: string
  value: string
}

export type SchemaField = {
  type: SchemaFieldType
  display_name?: string
  description?: string
  /** Show the description as a tooltip rather than below the field */
  tooltip?: boolean
  required?: boolean
  translatable?: boolean
  default_value?: string | number | boolean
  options?: SchemaOption[]
  /** Any other Storyblok field setting (e.g. `filetypes`, `component_whitelist`, `regex`) */
  [setting: string]: unknown
}

export type ComponentSchema = {
  /**
   * Technical name: the ticket's snake_case name (e.g. `rich_text`); `src/cms/storyblok.ts` registers it.
   */
  name: string
  display_name?: string
  description?: string
  /** Name of a group in `modules/cms/schema/groups.ts` */
  group?: string
  /** Content type (a story root) rather than a nestable block */
  is_root?: boolean
  is_nestable?: boolean
  preview_field?: string | null
  color?: string | null
  icon?: string | null
  /**
   * Set to `false` to compile the schema for types but leave it out of `pnpm cms:push`, e.g. while a
   * field's settings are still being confirmed.
   */
  push?: boolean
  schema: Record<string, SchemaField>
}
