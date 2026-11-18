declare namespace App {
  interface Locals {
    /** The request comes from the Storyblok Visual Editor */
    inEditor: boolean
    /** The content version to load */
    version: import('./cms/utils/stories').Version
    /** Fixed UI text (src/i18n) */
    t: import('./i18n').Translate
  }
}

interface ImportMetaEnv {
  readonly STORYBLOK_DELIVERY_API_TOKEN: string
}
