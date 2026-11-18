import Pagination from './Pagination.astro'

const hrefs = ['/articles', '/articles?page=2', '/articles?page=3']

export default {
  title: 'Components/Pagination',
  component: Pagination,
  args: {
    page: 2,
    hrefs,
    pageLabels: hrefs.map((_, index) => `Page ${index + 1} of ${hrefs.length}`),
    label: 'Pages',
    previousLabel: 'Previous',
    nextLabel: 'Next',
  },
  parameters: { layout: 'padded' },
}

export const Middle = {}

export const First = { args: { page: 1 } }
