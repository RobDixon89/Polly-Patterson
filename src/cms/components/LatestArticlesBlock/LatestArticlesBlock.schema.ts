import { defineComponentSchema } from '../../schema/define'
import { sectionFields, text, textarea } from '../../schema/fields'

// The four newest articles: the first as a full-width feature, the next three in a row, then a "view all" link to the
// article listing.
export default defineComponentSchema({
  name: 'latest_articles',
  display_name: 'Latest Articles',
  group: 'Sections',
  preview_field: 'title',
  schema: {
    title: text({ display_name: 'Title', required: true }),
    description: textarea({ display_name: 'Description', description: 'Optional. Shown under the title.', tooltip: true }),
    view_all_label: text({
      display_name: 'View All CTA Label',
      description: 'The text of the round button linking to all articles.',
      tooltip: true,
      required: true,
      default_value: 'View all',
    }),
    ...sectionFields(),
  },
})
