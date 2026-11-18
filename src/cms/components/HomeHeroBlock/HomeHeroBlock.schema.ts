import { defineComponentSchema } from '../../schema/define'
import { richTextReduced, sectionFields, sizedImage, text } from '../../schema/fields'

export default defineComponentSchema({
  name: 'home_hero',
  display_name: 'Home Hero',
  group: 'Banners',
  preview_field: 'title',
  schema: {
    title: text({ display_name: 'Title', required: true }),
    introduction: richTextReduced({ display_name: 'Introduction' }),
    image: sizedImage([1600, 1600], { display_name: 'Image', required: true }),
    ...sectionFields(),
  },
})
