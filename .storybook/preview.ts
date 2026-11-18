import '../src/styles/index.scss'

// shortcut: on Windows the Storybook Astro renderer gives component scripts a bare drive path (`src="C:/Users/…"`),
// which the browser treats as a blocked file:// URL, so no component script runs (e.g. the header's menu button).
// Rewrite those to Vite's /@fs/ form before the script loads; remove this once @storybook-astro/renderer fixes it.
const setAttribute = Element.prototype.setAttribute
Element.prototype.setAttribute = function (name: string, value: string) {
  const fixed = this instanceof HTMLScriptElement && name === 'src' && /^[A-Za-z]:\//.test(value) ? `/@fs/${value}` : value
  setAttribute.call(this, name, fixed)
}

export default {
  parameters: { layout: 'fullscreen' },
}
