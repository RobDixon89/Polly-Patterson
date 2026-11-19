import { wideImage } from '../../fixtures';
import InnerHero from './InnerHero.astro';

const ctas = [
  { text: 'Find out more', href: '/about', variant: 'primary' },
  { text: 'Get in touch', href: '/contact', variant: 'outline' },
];

export default {
  title: 'Banners/Inner Hero',
  component: InnerHero,
  args: {
    title: 'About us',
    description: 'An inner page banner with a background image.',
    backgroundImage: wideImage,
    theme: 'dark',
  },
  argTypes: { theme: { control: 'inline-radio', options: ['light', 'dark'] } },
};

export const Dark = {};

export const Light = { args: { theme: 'light' } };

export const Article = {
  args: {
    eyebrow: '10th November 2026',
    title: 'An example article',
    tag: 'article',
  },
};

export const NoImage = { args: { backgroundImage: undefined } };

// Up to two CTAs under the introduction (the Inner Hero block and the article listing)
export const WithCtas = { args: { ctas } };

export const WithCtasLight = { args: { ctas, theme: 'light' } };
