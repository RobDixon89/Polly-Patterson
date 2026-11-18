import { richTextDocument } from '../../fixtures'
import RichText from './RichText.astro'

// Every element and style option the Rich Text section offers (the reduced fields offer a subset)
export default {
  title: 'Components/Rich Text',
  component: RichText,
  args: { document: richTextDocument },
  parameters: { layout: 'padded' },
}

export const Default = {}
