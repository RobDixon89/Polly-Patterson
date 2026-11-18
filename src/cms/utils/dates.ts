import { storyblokDateTime } from './blocks'

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** A Storyblok date field as "17 November 2026", or undefined when it's empty. */
export const formatDate = (value: string | undefined): string | undefined => {
  const iso = storyblokDateTime(value)
  return iso ? DATE_FORMAT.format(new Date(iso)) : undefined
}
