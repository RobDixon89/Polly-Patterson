import { defineComponentSchema } from '../../schema/define'
import { link, navLinks, tab, text } from '../../schema/fields'

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
    footer_tab: tab('Footer', ['footer_links', 'twitter_url', 'instagram_url', 'youtube_url', 'substack_url', 'bluesky_url', 'copyright']),
    footer_links: navLinks({ display_name: 'Links' }),
    twitter_url: link({ display_name: 'Twitter URL' }),
    instagram_url: link({ display_name: 'Instagram URL' }),
    youtube_url: link({ display_name: 'YouTube URL' }),
    substack_url: link({ display_name: 'Substack URL' }),
    bluesky_url: link({ display_name: 'Bluesky URL' }),
    copyright: text({
      display_name: 'Copyright',
      description: '{year} is replaced with the current year, e.g. "© {year} Company Ltd".',
      tooltip: true,
    }),
  },
})
