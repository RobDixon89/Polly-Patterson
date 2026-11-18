import { defineComponentSchema } from '../../schema/define'
import { images } from '../../schema/fields'

// A row of up to three images, embedded in the Rich Text section's text. Schema only: the rich text renderer draws it.
export default defineComponentSchema({
  name: 'image_row',
  display_name: 'Image Row',
  group: 'Shared',
  schema: {
    images: images(3, { display_name: 'Images', required: true }),
  },
})
