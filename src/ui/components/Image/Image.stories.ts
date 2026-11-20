import { Device, from } from '../../../cms/utils/media'
import { DEVICES, FULL_SCREEN_SOURCES } from '../../devices'
import { storyblokWideImage, wideImage } from '../../fixtures'
import Image from './Image.astro'

// The Image component's options, on a Storyblok asset so the Image Service URLs are real. Inspect the <img> or
// <picture> to see the generated srcset; resize the canvas to see the browser pick a width (and, for Full screen, a crop).
export default {
  title: 'Components/Image',
  component: Image,
  args: { image: storyblokWideImage, sizes: '100vw' },
  parameters: { layout: 'padded' },
}

// Six widths from 480 to 2560, the original's shape
export const Default = {}

// Cropped to 1:1 around the focal point
export const Ratio = { args: { ratio: [1, 1], sizes: '400px' } }

// A card-sized image: four widths from 400 to 1200
export const CustomWidths = { args: { minWidth: 400, maxWidth: 1200, steps: 4, sizes: `${from(Device.Tablet)} 33vw, 100vw` } }

// A single width
export const OneWidth = { args: { minWidth: 800, maxWidth: 800, steps: 1, sizes: '800px' } }

// One crop and set of widths per device (ui/devices.ts): 9:16 on mobile, 3:4 on tablet, 16:9 on desktop, as section
// backgrounds use
export const FullScreen = { args: { sources: FULL_SCREEN_SOURCES } }

// Only the mobile definition, to compare its crop with Default
export const MobileCrop = {
  args: { ...DEVICES.mobile, media: undefined, sizes: '375px' },
}

// An image from anywhere but Storyblok (here public/img) is used as it is, without the Image Service
export const LocalFile = { args: { image: { ...wideImage, alt: 'Abstract placeholder pattern' } } }
