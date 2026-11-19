import { defineComponentSchema } from '../../schema/define'
import { ctas, richTextReduced, seoFields, sizedImage, text } from '../../schema/fields'

// The article listing: its fields fill the inner hero, and the articles in the same folder are listed below it.
export default defineComponentSchema({
  name: 'article_listing',
  display_name: 'Article Listing',
  group: 'Content types',
  is_root: true,
  is_nestable: false,
  preview_field: 'title',
  schema: {
    title: text({ display_name: 'Title', required: true }),
    introduction: richTextReduced({ display_name: 'Introduction' }),
    image: sizedImage([2560, 1000], { display_name: 'Image', description: 'Optional. The banner background. Recommended 2560 × 1000px.' }),
    ctas: ctas(2),
    ...seoFields(),
  },
})
