import { defineComponentSchema } from '../../schema/define'
import { link, text } from '../../schema/fields'

// A link with its text, for the header and footer lists. Schema only: the header and footer render it.
export default defineComponentSchema({
  name: 'nav_link',
  display_name: 'Link',
  group: 'Shared',
  preview_field: 'text',
  schema: {
    text: text({ display_name: 'Text', required: true }),
    link: link({ display_name: 'Link', required: true, allow_target_blank: true }),
  },
})
