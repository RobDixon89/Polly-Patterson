import { richTextDocument, squareImage, wideImage } from '../../fixtures'
import HomeHero from './HomeHero.astro'

const ctas = [
  { text: 'Find out more', href: '/about', variant: 'primary' },
  { text: 'Read the articles', href: '/articles', variant: 'outline' },
]

// The home page banner: title, introduction and up to two CTAs beside a square image
export default {
  title: 'Banners/Home Hero',
  component: HomeHero,
  args: {
    title: 'Welcome to Storyblok Test',
    introduction: { type: 'doc', content: richTextDocument.content?.slice(1, 2) },
    image: squareImage,
    ctas,
    theme: 'light',
  },
  argTypes: { theme: { control: 'inline-radio', options: ['light', 'dark'] } },
}

export const Light = {}

export const Dark = { args: { theme: 'dark' } }

export const WithBackgroundImage = { args: { theme: 'dark', backgroundImage: wideImage } }

export const OneCta = { args: { ctas: ctas.slice(0, 1) } }

export const NoCtas = { args: { ctas: [] } }
