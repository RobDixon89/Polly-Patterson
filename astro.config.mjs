// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// The Visual Editor needs HTTPS: with mkcert certificates in certs/ (see README), the dev server serves
// https://localhost:4321/, the space's preview URL. Without them it falls back to HTTP.
const cert = new URL('./certs/localhost.crt', import.meta.url)
const key = new URL('./certs/localhost.pem', import.meta.url)
// DEV_HTTP=1 forces HTTP, for tools that don't trust the local certificate
const https =
  !process.env.DEV_HTTP && existsSync(cert) && existsSync(key)
    ? { cert: readFileSync(cert), key: readFileSync(key) }
    : undefined

export default defineConfig({
  output: 'server',
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Crete Round',
      cssVariable: '--font-heading',
      weights: [400],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Varta',
      cssVariable: '--font-body',
      weights: [300, 400, 500, 700],
      styles: ['normal'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  vite: {
    server: { https },
    // A plugin rather than `resolve.alias`, so Storybook's Astro renderer (which loads plugins from here) gets it too
    plugins: [
      {
        name: 'styles-alias',
        config: () => ({
          resolve: { alias: { '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)) } },
        }),
      },
    ],
  },
})
