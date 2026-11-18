import { defineComponentSchema } from '../../schema/define'
import { datetime, freeArea, link, seoFields, sizedImage, text, textarea, tab } from '../../schema/fields'

// An article. Its fields fill the listing card and the article's fixed inner hero; an article with an external URL
// links there from its card and shows no sections.
export default defineComponentSchema({
  name: 'article',
  display_name: 'Article',
  group: 'Content types',
  is_root: true,
  is_nestable: false,
  preview_field: 'title',
  schema: {
    title: text({ display_name: 'Title', required: true }),
    description: textarea({ display_name: 'Description', description: 'Shown on the card and under the title.', tooltip: true, required: true }),
    image: sizedImage([2560, 1000], { display_name: 'Image', required: true }),
    published_date: datetime({ display_name: 'Published Date', required: true, disable_time: true }),
    external_url: link({
      display_name: 'External URL',
      description: 'Optional. When set, the card links to this address and the article shows no sections.',
      tooltip: true,
      allow_target_blank: false,
    }),
    content_tab: tab('Content', ['body']),
    body: freeArea({ description: 'Sections shown below the banner. Not shown when the article has an External URL.' }),
    ...seoFields(),
  },
})
