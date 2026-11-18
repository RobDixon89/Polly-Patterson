import Button from './Button.astro';

// A button, or a link drawn as one. Links to other sites, or opening in a new tab, get the external icon. Hover or tab
// to each to see its state: primary deepens, outline gains a semi-transparent fill.
export default {
  title: 'Components/Button',
  component: Button,
  args: { variant: 'primary', slots: { default: 'Find out more' } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'outline', 'text'] },
  },
  parameters: { layout: 'padded' },
};

export const Primary = { args: { href: '/about' } };

export const Outline = { args: { variant: 'outline', href: '/about' } };

export const Text = { args: { variant: 'text', href: '/about' } };

export const ExternalLink = {
  args: {
    href: 'https://www.storyblok.com',
    externalLabel: '(opens another site)',
    slots: { default: 'Visit Storyblok' },
  },
};

export const NewTab = {
  args: {
    variant: 'outline',
    href: '/articles',
    target: '_blank',
    externalLabel: '(opens in a new tab)',
    slots: { default: 'Articles' },
  },
};

// No href: a <button>
export const AsButton = { args: { slots: { default: 'Submit' } } };

// Text with an external link: the underlined label keeps the external icon

export const TextExternal = {
  args: { variant: 'text', href: 'https://www.storyblok.com', externalLabel: '(opens another site)', slots: { default: 'Visit Storyblok' } },
}
