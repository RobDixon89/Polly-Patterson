import { createApiClient } from '@storyblok/api-client'
import { defineStoryblokBlocks } from '@storyblok/astro'
import ArticleBlock from './components/ArticleBlock/ArticleBlock.astro'
import ArticleListingBlock from './components/ArticleListingBlock/ArticleListingBlock.astro'
import GlobalSettingsBlock from './components/GlobalSettingsBlock/GlobalSettingsBlock.astro'
import HomeHeroBlock from './components/HomeHeroBlock/HomeHeroBlock.astro'
import InnerHeroBlock from './components/InnerHeroBlock/InnerHeroBlock.astro'
import LatestArticlesBlock from './components/LatestArticlesBlock/LatestArticlesBlock.astro'
import PageBlock from './components/PageBlock/PageBlock.astro'
import RichTextBlock from './components/RichTextBlock/RichTextBlock.astro'
import SplitContentBlock from './components/SplitContentBlock/SplitContentBlock.astro'

export const apiClient = createApiClient({
  accessToken: import.meta.env.STORYBLOK_DELIVERY_API_TOKEN,
  region: 'eu',
})

/** Extra props every block gets: the request's URL (for the article listing's page number and links). */
export type BlockExtraProps = { url: URL }

// One entry per block with an adapter, keyed by its technical name. `nav_link` and `social_link` (header and footer) and `image_row`
// (rich text) have none: what holds them renders them.
export const { StoryblokBlock } = defineStoryblokBlocks<BlockExtraProps>(() => ({
  components: {
    page: PageBlock,
    article_listing: ArticleListingBlock,
    article: ArticleBlock,
    global_settings: GlobalSettingsBlock,
    home_hero: HomeHeroBlock,
    inner_hero: InnerHeroBlock,
    rich_text: RichTextBlock,
    split_content: SplitContentBlock,
    latest_articles: LatestArticlesBlock,
  },
}))
