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
      { network: 'twitter', href: 'https://twitter.com', label: 'Twitter' },
      { network: 'instagram', href: 'https://www.instagram.com', label: 'Instagram' },
      { network: 'youtube', href: 'https://www.youtube.com', label: 'YouTube' },
    ],
    copyright: '© 2026 Storyblok Test. All rights reserved.',
    navLabel: 'Footer',
    socialLabel: 'Follow us',
  },
}

export const Default = {}
