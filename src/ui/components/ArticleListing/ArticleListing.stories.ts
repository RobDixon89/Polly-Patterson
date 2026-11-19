import { articleCards } from '../../fixtures'
import ArticleListing from './ArticleListing.astro'

const hrefs = ['/articles', '/articles?page=2', '/articles?page=3']

// A full page of nine cards (ARTICLES_PER_PAGE), then the pagination
const articles = Array.from({ length: 9 }, (_, index) => ({ key: String(index), ...articleCards[index % articleCards.length] }))

export default {
  title: 'Sections/Article Listing',
  component: ArticleListing,
  args: {
    articles,
    emptyLabel: 'There are no articles yet.',
    page: 1,
    hrefs,
    pageLabels: hrefs.map((_, index) => `Page ${index + 1} of ${hrefs.length}`),
    label: 'Pages',
    previousLabel: 'Previous',
    nextLabel: 'Next',
  },
}

export const FirstPage = {}

export const MiddlePage = { args: { page: 2 } }

// One page: no pagination
export const SinglePage = { args: { articles: articles.slice(0, 4), hrefs: hrefs.slice(0, 1) } }

export const Empty = { args: { articles: [], hrefs: hrefs.slice(0, 1) } }
