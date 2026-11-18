import { richTextDocument, squareImage, wideImage } from '../../fixtures'
import { BACKGROUND_TINTS } from '../../types'
import RichTextSection from './RichTextSection.astro'

// The Rich Text section in each theme, without and with a background image. The background fills the section with
// object-fit: cover under a tint of the theme's background colour.
export default {
  title: 'Sections/Rich Text',
  component: RichTextSection,
  args: { document: richTextDocument, theme: 'light' },
  argTypes: {
    theme: { control: 'inline-radio', options: ['light', 'dark'] },
    backgroundTint: { control: 'inline-radio', options: Object.keys(BACKGROUND_TINTS) },
  },
}

export const Light = {}

export const Dark = { args: { theme: 'dark' } }

export const LightWithBackground = { args: { backgroundImage: wideImage } }

export const DarkWithBackground = { args: { theme: 'dark', backgroundImage: wideImage } }

// A square image in a wide section: cover crops it rather than stretching it
export const SquareBackground = { args: { theme: 'dark', backgroundImage: squareImage } }

// The background tint: a gradient in the theme's background colour over the image, strongest at the bottom
export const TintNone = { args: { theme: 'dark', backgroundImage: wideImage, backgroundTint: 'none' } }

export const TintLight = { args: { theme: 'dark', backgroundImage: wideImage, backgroundTint: 'light' } }

export const TintStrong = { args: { theme: 'light', backgroundImage: wideImage, backgroundTint: 'strong' } }
