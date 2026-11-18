/**
 * Storyblok schema in code
 *
 *   pnpm cms:schema                 compile every <Name>Block.schema.ts and regenerate src/cms/types/gen
 *                                   (offline; no space or login needed)
 *   pnpm cms:push [--space <id>]    compile and push the schemas to a space (default: STORYBLOK_SPACE_ID)
 *
 * Pushes create or update components; they never delete one. Schemas with `push: false` compile for types but are not
 * pushed. Pushed schemas must use snake_case technical names and field keys. `cms:push` needs the Storyblok CLI logged
 * in: `pnpm storyblok login` with a personal access token.
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { COMPONENT_GROUPS } from '../src/cms/schema/groups'
import type { ComponentSchema } from '../src/cms/schema/types'

const root = resolve(import.meta.dirname, '..')
const componentsDir = join(root, 'src/cms/components')
const outDir = join(root, '.storyblok/schema')
const typesDir = join(root, 'src/cms/types/gen')

const args = process.argv.slice(2)
const command = args[0]
const flag = (name: string) => {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}

if (existsSync(join(root, '.env'))) {
  process.loadEnvFile(join(root, '.env'))
}

// The space only matters for `push`. Compiling and generating types run offline, where the CLI just needs a folder
// name for its local layout.
const space = flag('--space') || process.env.STORYBLOK_SPACE_ID || (command === 'push' ? '' : 'local')
const region = process.env.STORYBLOK_REGION || 'eu'

if (!space) {
  throw new Error('No Storyblok space to push to: set STORYBLOK_SPACE_ID or pass --space <id>')
}

// Run the project's Storyblok CLI with the current Node binary (no PATH lookup, no shell)
const storyblokCli = join(root, 'node_modules/storyblok/dist/index.mjs')

const storyblok = (cliArgs: string[]) =>
  execFileSync(process.execPath, [storyblokCli, '-p', outDir, '--region', region, '--no-ui-enabled', ...cliArgs], {
    cwd: root,
    stdio: 'inherit',
  })

const loadSchemas = async () => {
  const schemas: ComponentSchema[] = []
  for (const entry of await readdir(componentsDir, { withFileTypes: true })) {
    const file = join(componentsDir, entry.name, `${entry.name}.schema.ts`)
    if (entry.isDirectory() && existsSync(file)) {
      const module = (await import(file)) as { default: ComponentSchema }
      schemas.push(module.default)
    }
  }
  return schemas
}

// Names are unique and groups exist in groups.ts; returns the set of names
const checkNamesAndGroups = (schemas: ComponentSchema[]) => {
  const names = new Set<string>()
  for (const schema of schemas) {
    if (names.has(schema.name)) {
      throw new Error(`Duplicate Storyblok component name: ${schema.name}`)
    }
    names.add(schema.name)
    if (schema.group && !COMPONENT_GROUPS.some((g) => g.name === schema.group)) {
      throw new Error(`${schema.name}: unknown group "${schema.group}" (add it to src/cms/schema/groups.ts)`)
    }
  }
  return names
}

const SNAKE_CASE = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/
const checkSnakeCase = (schema: ComponentSchema) => {
  if (!SNAKE_CASE.test(schema.name)) {
    throw new Error(`${schema.name}: technical names are snake_case (e.g. rich_text), or set push: false`)
  }
  const badKeys = Object.keys(schema.schema).filter((key) => !SNAKE_CASE.test(key))
  if (badKeys.length) {
    throw new Error(`${schema.name}: field keys are snake_case: ${badKeys.join(', ')}`)
  }
}

// Code is the source of truth: nested-block fields may only allow components defined in code
const checkAllowLists = (schema: ComponentSchema, names: Set<string>) => {
  for (const [key, field] of Object.entries(schema.schema)) {
    const allowed = Array.isArray(field.component_whitelist) ? (field.component_whitelist as string[]) : []
    // Storyblok reads an empty allow-list as "allow everything"
    if (field.type === 'bloks' && field.restrict_components && field.restrict_type !== 'groups' && !allowed.length) {
      throw new Error(`${schema.name}.${key} restricts components but allows none, which Storyblok treats as allowing all`)
    }
    const unknown = allowed.filter((name) => !names.has(name))
    if (unknown.length) {
      throw new Error(`${schema.name}.${key} allows components with no schema in code: ${unknown.join(', ')}`)
    }
    // A tab's keys must be fields of this schema
    const missing = field.type === 'tab' ? ((field.keys as string[]) ?? []).filter((k) => !(k in schema.schema)) : []
    if (missing.length) {
      throw new Error(`${schema.name}.${key} tab lists unknown fields: ${missing.join(', ')}`)
    }
  }
}

const validate = (schemas: ComponentSchema[]) => {
  const names = checkNamesAndGroups(schemas)
  schemas.filter((schema) => schema.push !== false).forEach(checkSnakeCase)
  schemas.forEach((schema) => checkAllowLists(schema, names))
}

// Storyblok's component JSON: positions follow field order, groups resolve to their UUIDs
const toStoryblok = ({ group, push: _push, schema, ...component }: ComponentSchema) => ({
  ...component,
  component_group_uuid: COMPONENT_GROUPS.find((g) => g.name === group)?.uuid ?? null,
  schema: Object.fromEntries(Object.entries(schema).map(([key, field], pos) => [key, { ...field, pos }])),
})

const compile = async (schemas: ComponentSchema[]) => {
  const dir = join(outDir, 'components', space)
  await rm(join(outDir, 'components'), { recursive: true, force: true })
  await mkdir(dir, { recursive: true })
  // One file, sorted by name, so the generated types don't depend on the OS's directory order
  const sorted = [...schemas].sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
  await Promise.all([
    writeFile(join(dir, 'components.json'), JSON.stringify(sorted.map(toStoryblok), null, 2)),
    // Only the groups these schemas use (as their group or in a field's group restriction)
    writeFile(
      join(dir, 'groups.json'),
      JSON.stringify(
        COMPONENT_GROUPS.filter(
          ({ name, uuid }) =>
            schemas.some((schema) => schema.group === name) ||
            schemas.some((schema) =>
              Object.values(schema.schema).some((field) =>
                (field.component_group_whitelist as string[] | undefined)?.includes(uuid),
              ),
            ),
        ).map(({ name, uuid }) => ({ name, uuid, parent_id: null, parent_uuid: null })),
        null,
        2,
      ),
    ),
    writeFile(join(dir, 'tags.json'), '[]'),
  ])
}

const generateTypes = async () => {
  storyblok(['types', 'generate', '--space', space])
  await rm(typesDir, { recursive: true, force: true })
  await mkdir(typesDir, { recursive: true })
  await cp(join(outDir, 'types', 'storyblok.d.ts'), join(typesDir, 'storyblok.d.ts'))
  await cp(join(outDir, 'types', space), join(typesDir, 'components'), { recursive: true })
}

const schemas = await loadSchemas()
validate(schemas)

if (command === 'compile') {
  await compile(schemas)
  await generateTypes()
  console.log(`Compiled ${schemas.length} schemas and regenerated src/cms/types/gen`)
} else if (command === 'push') {
  const pushable = schemas.filter((schema) => schema.push !== false)
  const held = schemas.filter((schema) => schema.push === false).map((s) => s.name)
  await compile(pushable)
  const heldNote = held.length ? ` (held back: ${held.join(', ')})` : ''
  console.log(`Pushing ${pushable.length} schemas to space ${space}${heldNote}`)
  storyblok(['components', 'push', '--space', space, '--from', space, '--separate-files'])
} else {
  throw new Error('Usage: cms-schema.ts compile | push [--space <id>]')
}
