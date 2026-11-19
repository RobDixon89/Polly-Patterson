import { defineComponentSchema } from '../../schema/define'
import { link, option } from '../../schema/fields'
import { SOCIAL_NETWORKS } from '../../../ui/types'

// A social network link for the footer, in the order editors arrange them. Schema only: the footer renders it.
export default defineComponentSchema({
  name: 'social_link',
  display_name: 'Social Link',
  group: 'Shared',
  preview_field: 'network',
  schema: {
    network: option(
      SOCIAL_NETWORKS.map((value) => ({ name: value === 'youtube' ? 'YouTube' : value.charAt(0).toUpperCase() + value.slice(1), value })),
      { display_name: 'Network', required: true },
    ),
    link: link({ display_name: 'Link', required: true }),
  },
})
