/**
 * Syncs the Storyblok `strings` datasource with the string keys in code.
 *
 *   pnpm cms:strings [--space <id>] [--dry-run]
 *
 * - creates the `strings` datasource if the space doesn't have it;
 * - adds every key in src/i18n/en_GB.json the datasource is missing, with its text as the value;
 * - removes entries whose key is no longer in en_GB.json;
 * - never changes an existing entry's value: once seeded, the copy is edited in Storyblok.
 *
 * So a new string starts in en_GB.json (its default and fallback) and appears for editors on the next sync. To change
 * the text of an existing string, edit it in Storyblok. Uses the management API with STORYBLOK_PERSONAL_TOKEN; the space
 * defaults to STORYBLOK_SPACE_ID.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import {
  STRINGS_DATASOURCE,
  flattenMessages,
  type Messages,
} from '../src/cms/utils/strings'

const root = resolve(import.meta.dirname, '..')
if (existsSync(join(root, '.env'))) {
  process.loadEnvFile(join(root, '.env'))
}

const args = process.argv.slice(2)
const flag = (name: string) => {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}
const dryRun = args.includes('--dry-run')

const space = flag('--space') || process.env.STORYBLOK_SPACE_ID
const token = process.env.STORYBLOK_PERSONAL_TOKEN
if (!space || !token) {
  throw new Error(
    'Set STORYBLOK_SPACE_ID (or pass --space) and STORYBLOK_PERSONAL_TOKEN',
  )
}

const base = `https://mapi.storyblok.com/v1/spaces/${space}`
const api = async <T = Record<string, unknown>>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> => {
  const res = await fetch(base + path, {
    method,
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`${method} ${path}: ${res.status} ${text.slice(0, 300)}`)
  }
  // Stay under the management API's rate limit
  await sleep(250)
  return (text ? JSON.parse(text) : {}) as T
}

type Datasource = { id: number; slug: string }
type Entry = { id: number; name: string; value: string }

// The keys in code, with their default text
const defaults = flattenMessages(
  JSON.parse(
    readFileSync(join(root, 'src/i18n/en_GB.json'), 'utf8'),
  ) as Messages,
)

// 1. The datasource
const { datasources } = await api<{ datasources: Datasource[] }>(
  'GET',
  '/datasources?per_page=100',
)
let datasource = datasources.find((d) => d.slug === STRINGS_DATASOURCE)
if (!datasource && !dryRun) {
  datasource = (
    await api<{ datasource: Datasource }>('POST', '/datasources', {
      datasource: { name: 'Strings', slug: STRINGS_DATASOURCE },
    })
  ).datasource
  console.log(`Created the ${STRINGS_DATASOURCE} datasource`)
}

// 2. Its entries
const entries: Entry[] = []
if (datasource) {
  for (let page = 1; ; page++) {
    const { datasource_entries: batch } = await api<{
      datasource_entries: Entry[]
    }>(
      'GET',
      `/datasource_entries?datasource_id=${datasource.id}&per_page=1000&page=${page}`,
    )
    entries.push(...batch)
    if (batch.length < 1000) {
      break
    }
  }
}
const existing = new Set(entries.map((entry) => entry.name))

// 3. Add the missing keys, remove the deleted ones
const missing = Object.keys(defaults).filter((key) => !existing.has(key))
const removed = entries.filter((entry) => !(entry.name in defaults))

console.log(
  `${Object.keys(defaults).length} keys in en_GB.json, ${entries.length} in Storyblok: ` +
    `${missing.length} to add, ${removed.length} to remove${dryRun ? ' (dry run)' : ''}`,
)
if (dryRun) {
  missing.forEach((key) => console.log(`  + ${key}`))
  removed.forEach((entry) => console.log(`  - ${entry.name}`))
} else if (datasource) {
  for (const key of missing) {
    await api('POST', '/datasource_entries', {
      datasource_entry: {
        name: key,
        value: defaults[key],
        datasource_id: datasource.id,
      },
    })
  }
  for (const entry of removed) {
    await api('DELETE', `/datasource_entries/${entry.id}`)
  }
  console.log(`Synced space ${space}`)
}
