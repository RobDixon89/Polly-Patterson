import { defineComponentSchema } from '../../schema/define'
import { ctas, images, option, richTextFull, sectionFields, text } from '../../schema/fields'

// Text beside up to four images: one fills the image side; two share it side by side; three are two squares above
// one wide image; four are a 2 × 2 grid of squares.
export default defineComponentSchema({
  name: 'split_content',
  display_name: 'Split Content',
  group: 'Sections',
  preview_field: 'title',
  schema: {
    title: text({ display_name: 'Title', required: true }),
    content: richTextFull({ display_name: 'Content' }),
    ctas: ctas(2),
    images: images(4, { display_name: 'Images', required: true }),
    image_alignment: option(['left', 'right'], {
      display_name: 'Image Alignment',
      description: 'Which side the images sit on, from tablet width up. On mobile they always come after the text.',
      tooltip: true,
      default_value: 'left',
    }),
    ...sectionFields(),
  },
})
