import { wideImage } from '../../fixtures'
import InnerHero from './InnerHero.astro'

export default {
  title: 'Components/Inner Hero',
  component: InnerHero,
  args: {
    title: 'About us',
    description: 'An inner page banner with a background image.',
    backgroundImage: wideImage,
    theme: 'dark',
  },
  argTypes: { theme: { control: 'inline-radio', options: ['light', 'dark'] } },
}

export const Dark = {}

export const Light = { args: { theme: 'light' } }

export const Article = { args: { eyebrow: '10 November 2026', title: 'An example article' } }

export const NoImage = { args: { backgroundImage: undefined } }
