import type { ComponentSchema } from './types'

/**
 * Declares a Storyblok component schema. Default-export the result from `<Name>Block.schema.ts`,
 * next to the adapter it describes.
 */
export const defineComponentSchema = (schema: ComponentSchema) => schema
