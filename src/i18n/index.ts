// Fixed UI text: the defaults in en_GB.json, with the Storyblok `strings` datasource merged over them so editors can
// change the copy. Add a key to en_GB.json when a component needs it, then run `pnpm cms:strings` to add it to the
// datasource (it never overwrites an editor's text).
import { apiClient } from '../cms/storyblok'
import { STRINGS_DATASOURCE, entriesToStrings, flattenMessages, format, type StringsEntry } from '../cms/utils/strings'
import defaults from './en_GB.json'

const DEFAULTS = flattenMessages(defaults)

export type StringKey = string
export type Translate = (key: StringKey, params?: Record<string, string | number>) => string

/**
 * The datasource's values. The API client caches published requests for a minute, so an edit shows within about a
 * minute. Never fails a page: when Storyblok can't be reached the defaults apply.
 */
const loadStrings = async (): Promise<Record<string, string>> => {
  try {
    const { data } = await apiClient.datasourceEntries.list({
      query: { datasource: STRINGS_DATASOURCE, per_page: 1000 },
    })
    return entriesToStrings((data?.datasource_entries ?? []) as StringsEntry[])
  } catch {
    return {}
  }
}

/** A `t()` for this request: the datasource's text, else the default, with `{name}` placeholders filled. */
export const createTranslate = async (): Promise<Translate> => {
  const strings = await loadStrings()
  return (key, params) => format(strings[key] ?? DEFAULTS[key] ?? key, params)
}
