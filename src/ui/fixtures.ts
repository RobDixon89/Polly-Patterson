// Shared story data: placeholder images from public/img and a short rich text document. Stories use these local files;
// only the Image stories use the Storyblok copies (`storyblok*`), to show the Image Service options.
import type { StoryblokRichtext } from '../cms/types/gen/storyblok'
import type { ImageModel } from './types'

export const squareImage: ImageModel = { src: '/img/placeholder-square.jpg', alt: 'Abstract placeholder pattern', width: 1600, height: 1600 }

export const wideImage: ImageModel = { src: '/img/placeholder-wide.jpg', alt: '', width: 2560, height: 1000 }

export const articleImage: ImageModel = { src: '/img/placeholder-article.jpg', alt: '', width: 2560, height: 1000 }

/** The same placeholder in the Storyblok space, for the Image stories */
export const storyblokWideImage: ImageModel = {
  src: 'https://a.storyblok.com/f/295396215774562/2560x1000/2bb2b75043/placeholder-wide.jpg',
  alt: 'Abstract placeholder pattern',
  width: 2560,
  height: 1000,
  // Left of centre, so the crops show the focal point at work
  focus: '700x400:701x401',
}

export const richTextDocument: StoryblokRichtext = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'A heading' }] },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'A paragraph with ' },
        { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
        { type: 'text', text: ' and a ' },
        { type: 'text', text: 'link', marks: [{ type: 'link', attrs: { href: 'https://www.storyblok.com', linktype: 'url' } }] },
        { type: 'text', text: '.' },
      ],
    },
    { type: 'paragraph', content: [{ type: 'text', text: 'Large text.', marks: [{ type: 'styled', attrs: { class: 'body-lg' } }] }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Small text.', marks: [{ type: 'styled', attrs: { class: 'body-sm' } }] }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Extra small text.', marks: [{ type: 'styled', attrs: { class: 'body-xs' } }] }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'A paragraph in the H4 style.', marks: [{ type: 'styled', attrs: { class: 'h4-style' } }] }] },
    { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A quote.' }] }] },
    {
      type: 'bullet_list',
      content: [
        { type: 'list_item', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'First item' }] }] },
        { type: 'list_item', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Second item' }] }] },
      ],
    },
    { type: 'horizontal_rule' },
    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'A smaller heading' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }] },
  ],
}
