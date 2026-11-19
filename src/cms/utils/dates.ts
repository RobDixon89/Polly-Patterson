import { storyblokDateTime } from './blocks';

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// 'one' → 1st/21st/31st, 'two' → 2nd/22nd, 'few' → 3rd/23rd, 'other' → 4th, 11th, 12th, 13th…
const ORDINAL = new Intl.PluralRules('en-GB', { type: 'ordinal' });
const SUFFIXES: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: 'st',
  two: 'nd',
  few: 'rd',
  other: 'th',
};

/** A Storyblok date field as "17th November 2026", or undefined when it's empty. */
export const formatDate = (value: string | undefined): string | undefined => {
  const iso = storyblokDateTime(value);
  if (!iso) return undefined;
  return DATE_FORMAT.formatToParts(new Date(iso))
    .map(({ type, value }) =>
      type === 'day'
        ? `${value}${SUFFIXES[ORDINAL.select(Number(value))]}`
        : value,
    )
    .join('');
};
