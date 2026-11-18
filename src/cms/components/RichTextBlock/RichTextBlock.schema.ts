import { defineComponentSchema } from '../../schema/define'
import { richTextWithEmbeds, sectionFields } from '../../schema/fields'

export default defineComponentSchema({
  name: 'rich_text',
  display_name: 'Rich Text',
  group: 'Sections',
  schema: {
    content: richTextWithEmbeds({ display_name: 'Content', required: true }),
    ...sectionFields(),
  },
})
