import SiteHeader from './SiteHeader.astro'

// Below 1024px the links move into the menu tray
export default {
  title: 'Layout/Site Header',
  component: SiteHeader,
  args: {
    siteName: 'Storyblok Test',
    leftLinks: [
      { text: 'Home', href: '/' },
      { text: 'About', href: '/about' },
    ],
    rightLinks: [
      { text: 'Articles', href: '/articles' },
      { text: 'Our story', href: '/about#our-story' },
    ],
    currentPath: '/about',
    navLabel: 'Main',
    menuLabel: 'Menu',
  },
}

export const Default = {}
