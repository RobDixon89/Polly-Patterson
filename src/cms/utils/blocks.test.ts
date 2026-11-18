import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  anchorId,
  backgroundTint,
  imageModel,
  linkHref,
  linkModel,
  richTextHref,
  sectionId,
  sectionTheme,
  storyblokDateTime,
} from './blocks'
import type { StoryblokAsset, StoryblokMultilink } from '../types/gen/storyblok'

const base = { fieldtype: 'multilink', id: '', url: '', cached_url: '' } as const

test('anchorId makes URL-safe IDs', () => {
  assert.equal(anchorId('Our Story & Values'), 'our-story-values')
  assert.equal(anchorId('  Café Menu '), 'cafe-menu')
  assert.equal(sectionId(''), undefined)
  assert.equal(sectionId('Contact us'), 'contact-us')
})

test('backgroundTint falls back to medium', () => {
  assert.equal(backgroundTint('strong'), 'strong')
  assert.equal(backgroundTint('none'), 'none')
  assert.equal(backgroundTint(''), 'medium')
  assert.equal(backgroundTint('toString'), 'medium')
})

test('sectionTheme falls back to light', () => {
  assert.equal(sectionTheme('dark'), 'dark')
  assert.equal(sectionTheme(''), 'light')
  assert.equal(sectionTheme('purple'), 'light')
})

test('imageModel reads the size from the URL', () => {
  const asset = { filename: 'https://a.storyblok.com/f/1/1600x900/abc/hero.png', alt: 'Hero', focus: null } as StoryblokAsset
  assert.deepEqual(imageModel(asset), { src: asset.filename, alt: 'Hero', width: 1600, height: 900 })
  assert.equal(imageModel({ ...asset, filename: '' }), undefined)
})

test('linkHref resolves stories, URLs and emails', () => {
  const story = (cached_url: string, anchor?: string): StoryblokMultilink => ({ ...base, linktype: 'story', cached_url, anchor })
  assert.equal(linkHref(story('home')), '/')
  assert.equal(linkHref(story('articles/')), '/articles')
  assert.equal(linkHref(story('about', 'team')), '/about#team')
  assert.equal(linkHref(story('')), undefined)
  assert.equal(linkHref({ ...base, linktype: 'url', url: 'www.example.com' }), 'https://www.example.com')
  assert.equal(linkHref({ ...base, linktype: 'url', url: 'https://x.com' }), 'https://x.com')
  assert.equal(linkHref({ ...base, linktype: 'email', email: 'a@b.com' }), 'mailto:a@b.com')
})

test('richTextHref reads link marks', () => {
  assert.equal(richTextHref({ href: '/about', linktype: 'story', anchor: 'team' }), '/about#team')
  assert.equal(richTextHref({ href: 'home', linktype: 'story' }), '/')
  assert.equal(richTextHref({ href: 'example.com', linktype: 'url' }), 'https://example.com')
  assert.equal(richTextHref({ href: 'a@b.com', linktype: 'email' }), 'mailto:a@b.com')
})

test('linkModel needs text and a link', () => {
  const link: StoryblokMultilink = { ...base, linktype: 'url', url: 'https://x.com', target: '_blank' }
  assert.deepEqual(linkModel({ text: 'X', link }), { text: 'X', href: 'https://x.com', target: '_blank' })
  assert.equal(linkModel({ text: '', link }), undefined)
})

test('storyblokDateTime reads Storyblok dates as UTC', () => {
  assert.equal(storyblokDateTime('2026-11-17 09:30'), '2026-11-17T09:30:00Z')
  assert.equal(storyblokDateTime(''), undefined)
})
