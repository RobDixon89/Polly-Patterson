import { defineComponentSchema } from '../../schema/define'
import { ctas, richTextReduced, sectionFields, text } from '../../schema/fields'

export default defineComponentSchema({
  name: 'inner_hero',
  display_name: 'Inner Hero',
  group: 'Banners',
  preview_field: 'title',
  schema: {
    title: text({ display_name: 'Title', required: true }),
    introduction: richTextReduced({ display_name: 'Introduction' }),
    ctas: ctas(2),
    ...sectionFields(),
  },
})
