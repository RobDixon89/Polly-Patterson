import { articleCards } from '../../fixtures'
import LatestArticles from './LatestArticles.astro'

// The four newest articles: a feature card, three beneath, and the round "view all" button
export default {
  title: 'Sections/Latest Articles',
  component: LatestArticles,
  args: {
    title: 'Latest articles',
    description: 'News, stories and ideas from the team.',
    articles: articleCards,
    viewAllHref: '/articles',
    viewAllLabel: 'View all',
    theme: 'light',
  },
  argTypes: { theme: { control: 'inline-radio', options: ['light', 'dark'] } },
}

export const Light = {}

export const Dark = { args: { theme: 'dark' } }

// With fewer articles the row is shorter
export const TwoArticles = { args: { articles: articleCards.slice(0, 2) } }
