import { articleImage } from '../../fixtures'
import ArticleCard from './ArticleCard.astro'

export default {
  title: 'Components/Article Card',
  component: ArticleCard,
  args: {
    title: 'An example article',
    description: 'This article has its own sections below the fixed banner.',
    href: '/articles/example-article',
    date: '10 November 2026',
    dateTime: '2026-11-10T00:00:00Z',
    image: articleImage,
  },
  parameters: { layout: 'padded' },
}

export const Default = {}

export const External = {
  args: { href: 'https://www.storyblok.com/docs', external: true, externalLabel: '(opens another site)' },
}
