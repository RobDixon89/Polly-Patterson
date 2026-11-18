import { defineComponentSchema } from '../../schema/define'
import { bannerField, freeArea, seoFields } from '../../schema/fields'

export default defineComponentSchema({
  name: 'page',
  display_name: 'Page',
  group: 'Content types',
  is_root: true,
  is_nestable: false,
  schema: {
    banner: bannerField(),
    body: freeArea(),
    ...seoFields(),
  },
})
