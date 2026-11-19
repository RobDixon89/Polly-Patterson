// The content lookups: one function per content type, so routes and adapters never build API queries themselves.
import type { Story } from '@storyblok/api-client'
import { apiClient } from '../storyblok'
import { imageModel, isExternal, linkHref, storyblokDateTime } from './blocks'
import { formatDate } from './dates'
import type { Article, GlobalSettings } from '../types/gen/components/storyblok-components'

/** Draft content in the Visual Editor (the access token is the space's preview token), published content otherwise. */
export type Version = 'draft' | 'published'

/** The global settings story (header and footer) */
export const GLOBAL_SETTINGS_SLUG = 'global/settings'

/** Articles per listing page */
export const ARTICLES_PER_PAGE = 9

/** The folder holding the articles, whose start page is the article listing (Latest Articles links there) */
export const ARTICLES_FOLDER = 'articles'

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
export const listArticles = async (
  folder: string,
  page: number,
  version: Version,
  perPage = ARTICLES_PER_PAGE,
  /** Leave out articles marked "Exclude from Latest Articles" */
  latestOnly = false,
): Promise<ArticlePage> => {
  const { data, response } = await apiClient.stories.list({
    query: {
      version,
      starts_with: `${folder.replace(/\/$/, '')}/`,
      content_type: 'article',
      sort_by: 'content.published_date:desc',
      per_page: perPage,
      page,
      resolve_links: 'url',
      // The card only needs the fields above the sections
      excluding_fields: 'body',
      // `not_in` also keeps articles saved before the checkbox existed (no value)
      ...(latestOnly && { filter_query: { exclude_from_latest: { not_in: 'true' } } }),
    },
  })
  const total = Number(response.headers.get('total')) || 0
  return { articles: data?.stories ?? [], pages: Math.max(1, Math.ceil(total / perPage)) }
}

/** An article's content, typed */
export const articleContent = (story: Story) => story.content as Article

/** An article's type tag (a value from the `article-types` datasource); articles saved before it existed are "article" */
export const articleType = (article: Article) => String(article.type || 'article')

/** An article story as `ArticleCard` props: an article with an external URL links there */
export const articleCard = (story: Story) => {
  const article = articleContent(story)
  const href = linkHref(article.external_url) ?? `/${story.full_slug}`
  return {
    title: article.title || story.name,
    description: article.description,
    type: articleType(article),
    href,
    external: isExternal(href),
    date: formatDate(article.published_date),
    dateTime: storyblokDateTime(article.published_date),
    image: imageModel(article.image),
  }
}
