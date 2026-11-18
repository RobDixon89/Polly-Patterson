import { defineComponentSchema } from '../../schema/define'
import { richTextFull, sectionFields } from '../../schema/fields'

export default defineComponentSchema({
  name: 'rich_text',
  display_name: 'Rich Text',
  group: 'Sections',
  schema: {
    content: richTextFull({ display_name: 'Content', required: true }),
    ...sectionFields(),
  },
})
