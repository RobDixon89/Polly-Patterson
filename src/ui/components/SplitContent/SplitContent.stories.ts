import {
  articleImage,
  richTextDocument,
  squareImage,
  wideImage,
} from '../../fixtures';
import SplitContent from './SplitContent.astro';

const images = [wideImage, articleImage, squareImage, wideImage];

// Text beside 1–4 images in a square frame: one fills it, two share it side by side, three are two squares above a
// wide image, four are a 2 × 2 grid. Images sit left by default; FourImagesRight shows the right alignment.
export default {
  title: 'Sections/Split Content',
  component: SplitContent,
  args: {
    title: 'Split content',
    content: { type: 'doc', content: richTextDocument.content?.slice(1, 3) },
    images: images.slice(0, 1),
    alignment: 'left',
    theme: 'light',
  },
  argTypes: {
    alignment: { control: 'inline-radio', options: ['left', 'right'] },
    theme: { control: 'inline-radio', options: ['light', 'dark'] },
  },
};

const ctas = [
  { text: 'Find out more', href: '/about', variant: 'primary' },
  {
    text: 'Storyblok docs',
    href: 'https://www.storyblok.com/docs',
    target: '_blank',
    variant: 'outline',
    externalLabel: '(opens in a new tab)',
  },
];

export const OneImage = {};

export const TwoImages = { args: { images: images.slice(0, 2) } };

export const ThreeImages = {
  args: { images: images.slice(0, 3), backgroundImage: squareImage },
};

export const FourImagesRight = {
  args: {
    images,
    alignment: 'right',
    theme: 'dark',
    ctas: [ctas[0], { ...ctas[1], variant: 'text' }],
  },
};

// Two CTAs: a primary link and an outline link that opens in a new tab (so it shows the external icon), in each theme
export const WithCtas = { args: { images: images.slice(0, 2), ctas } };

export const WithCtasDark = {
  args: { images: images.slice(0, 2), ctas, alignment: 'right', theme: 'dark' },
};
