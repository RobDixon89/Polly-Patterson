// The content lookups: one function per content type, so routes and adapters never build API queries themselves.
import type { Story } from '@storyblok/api-client'
import { apiClient } from '../storyblok'
import type { Article, GlobalSettings } from '../types/gen/components/storyblok-components'

/** Draft content in the Visual Editor (the access token is the space's preview token), published content otherwise. */
export type Version = 'draft' | 'published'

/** The global settings story (header and footer) */
export const GLOBAL_SETTINGS_SLUG = 'global/settings'

/** Articles per listing page */
export const ARTICLES_PER_PAGE = 9

/**
 * A story by its full slug, or undefined when there's none. A folder's start page (`articles/`) is also found by the
 * folder's path (`articles`).
 */
export const getStory = async (slug: string, version: Version): Promise<Story | undefined> => {
  const query = { version, resolve_links: 'url' as const }
  const { data } = await apiClient.stories.get(slug, { query })
  if (data?.story || slug.endsWith('/')) {
    return data?.story
  }
  return (await apiClient.stories.get(`${slug}/`, { query })).data?.story
}

/** The header and footer content, or undefined when the story doesn't exist yet. */
export const getGlobalSettings = async (version: Version): Promise<GlobalSettings | undefined> =>
  (await getStory(GLOBAL_SETTINGS_SLUG, version))?.content as GlobalSettings | undefined

export type ArticlePage = {
  articles: Story[]
  /** The number of pages (at least 1) */
  pages: number
}

/** One page of a folder's articles, newest first. */
export const listArticles = async (folder: string, page: number, version: Version): Promise<ArticlePage> => {
  const { data, response } = await apiClient.stories.list({
    query: {
      version,
      starts_with: `${folder.replace(/\/$/, '')}/`,
      content_type: 'article',
      sort_by: 'content.published_date:desc',
      per_page: ARTICLES_PER_PAGE,
      page,
      resolve_links: 'url',
      // The card only needs the fields above the sections
      excluding_fields: 'body',
    },
  })
  const total = Number(response.headers.get('total')) || 0
  return { articles: data?.stories ?? [], pages: Math.max(1, Math.ceil(total / ARTICLES_PER_PAGE)) }
}

/** An article's content, typed */
export const articleContent = (story: Story) => story.content as Article
