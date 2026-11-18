import SiteFooter from './SiteFooter.astro'

export default {
  title: 'Layout/Site Footer',
  component: SiteFooter,
  args: {
    links: [
      { text: 'About', href: '/about' },
      { text: 'Articles', href: '/articles' },
    ],
    social: [
      { network: 'twitter', href: 'https://twitter.com', label: 'Twitter (opens in a new tab)' },
      { network: 'instagram', href: 'https://www.instagram.com', label: 'Instagram (opens in a new tab)' },
      { network: 'youtube', href: 'https://www.youtube.com', label: 'YouTube (opens in a new tab)' },
      { network: 'substack', href: 'https://substack.com', label: 'Substack (opens in a new tab)' },
      { network: 'bluesky', href: 'https://bsky.app', label: 'Bluesky (opens in a new tab)' },
    ],
    copyright: '© 2026 Storyblok Test. All rights reserved.',
    navLabel: 'Footer',
    socialLabel: 'Follow us',
  },
}

export const Default = {}
