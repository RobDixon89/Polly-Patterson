import { defineComponentSchema } from '../../schema/define'
import { blocks, navLinks, tab, text } from '../../schema/fields'

// The site-wide header and footer, held in one story (`global/settings`) the layout loads for every page.
export default defineComponentSchema({
  name: 'global_settings',
  display_name: 'Global Settings',
  group: 'Content types',
  is_root: true,
  is_nestable: false,
  schema: {
    header_tab: tab('Header', ['header_left_links', 'header_right_links']),
    header_left_links: navLinks({
      display_name: 'Left Navigation',
      description: 'Links to the left of the logo. On mobile they come first in the menu.',
      tooltip: true,
    }),
    header_right_links: navLinks({
      display_name: 'Right Navigation',
      description: 'Links to the right of the logo. On mobile they follow the left links in the menu.',
      tooltip: true,
    }),
    footer_tab: tab('Footer', ['footer_links', 'social_links', 'copyright']),
    footer_links: navLinks({ display_name: 'Links' }),
    social_links: blocks(['social_link'], {
      display_name: 'Social Links',
      description: 'Shown as icons, in this order. They open in a new tab.',
      tooltip: true,
    }),
    copyright: text({
      display_name: 'Copyright',
      description: '{year} is replaced with the current year, e.g. "© {year} Company Ltd".',
      tooltip: true,
    }),
  },
})
