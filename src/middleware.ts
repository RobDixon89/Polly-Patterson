import { isInEditor, storyblokPreviewMiddleware } from '@storyblok/astro'
import { defineMiddleware, sequence } from 'astro:middleware'
import { createTranslate } from './i18n'

// Per request: the content version (drafts only in the Visual Editor) and the strings
const context = defineMiddleware(async ({ locals, url }, next) => {
  locals.inEditor = isInEditor(url)
  locals.version = locals.inEditor ? 'draft' : 'published'
  locals.t = await createTranslate()
  const response = await next()
  if (locals.inEditor) {
    // Drafts are never cached or indexed
    response.headers.set('Cache-Control', 'no-store')
    response.headers.set('X-Robots-Tag', 'noindex')
  }
  return response
})

export const onRequest = sequence(storyblokPreviewMiddleware, context)
