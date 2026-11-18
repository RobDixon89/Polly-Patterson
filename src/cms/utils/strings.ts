// The Storyblok `strings` datasource: fixed UI text editors can change. Each entry's name is a key in
// src/i18n/en_GB.json (`pagination.next`) and its value the text; `src/i18n` merges them over the JSON defaults, so
// components use `t()`. Relative imports only: the sync script (scripts/cms-strings.ts) uses these too.

/** The datasource's slug in every space */
export const STRINGS_DATASOURCE = 'strings'

/** Nested messages, as in `en_GB.json` */
export type Messages = { [key: string]: string | Messages }

/** A datasource entry as the delivery API returns it */
export type StringsEntry = {
  name: string
  value: string
  /** The value for the requested dimension (language), when the datasource has dimensions */
  dimension_value?: string | null
}

/**
 * Nested messages as flat key → text pairs (`{ a: { b: 'x' } }` → `{ 'a.b': 'x' }`).
 */
export const flattenMessages = (messages: Messages, prefix = ''): Record<string, string> =>
  Object.entries(messages).reduce<Record<string, string>>(
    (flat, [key, value]) =>
      typeof value === 'string'
        ? { ...flat, [`${prefix}${key}`]: value }
        : { ...flat, ...flattenMessages(value, `${prefix}${key}.`) },
    {},
  )

/**
 * Datasource entries as flat key → text pairs. Empty values are left out, so clearing an entry in Storyblok falls back
 * to the JSON default; a dimension value wins over the default value.
 */
export const entriesToStrings = (entries: StringsEntry[]): Record<string, string> =>
  Object.fromEntries(
    entries.map((entry) => [entry.name, entry.dimension_value || entry.value] as const).filter(([, text]) => text),
  )

/** Replaces `{name}` placeholders with the given values; unknown placeholders stay as they are. */
export const format = (text: string, params: Record<string, string | number> = {}): string =>
  text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match))
