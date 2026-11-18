import { defineComponentSchema } from '../../schema/define'
import { link, option, text } from '../../schema/fields'
import { BUTTON_VARIANTS } from '../../../ui/types'

// A call to action: a link drawn as a button. Schema only: the section holding it renders it.
export default defineComponentSchema({
  name: 'cta',
  display_name: 'CTA',
  group: 'Shared',
  preview_field: 'text',
  schema: {
    text: text({ display_name: 'Text', required: true }),
    link: link({ display_name: 'Link', required: true, allow_target_blank: true }),
    style: option([...BUTTON_VARIANTS], {
      display_name: 'Style',
      description: 'Primary is filled in the text colour; Outline is a border; Text is an underlined link. Defaults to Primary.',
      tooltip: true,
      default_value: BUTTON_VARIANTS[0],
    }),
  },
})
