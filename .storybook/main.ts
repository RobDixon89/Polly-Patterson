import type { StorybookConfig } from '@storybook-astro/framework'

// The framework reads astro.config.mjs, so the fonts and the `@styles` alias come from there
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|ts)'],
  framework: { name: '@storybook-astro/framework', options: {} },
}

export default config
