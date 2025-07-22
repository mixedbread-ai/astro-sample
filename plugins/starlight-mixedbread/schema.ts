import { z } from 'astro/zod';

/**
 * Schema for the Mixedbread Vector Search modal's strings.
 *
 * Add this to your `src/content.config.ts`:
 *
 * ```js
 * import { defineCollection } from 'astro:content';
 * import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
 * import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
 * import { mixedbreadI18nSchema } from '@astrojs/starlight-mixedbread/schema';
 *
 * export const collections = {
 * 		docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
 * 		i18n: defineCollection({
 * 			loader: i18nLoader(),
 * 			schema: i18nSchema({ extend: mixedbreadI18nSchema() }),
 * 		}),
 * };
 * ```
 */
export const mixedbreadI18nSchema = () =>
	z
		.object({
			// SEARCH BOX
			/** Default: `Clear the query` */
			'mixedbread.searchBox.resetButtonTitle': z.string(),
			/** Default: `Clear the query` */
			'mixedbread.searchBox.resetButtonAriaLabel': z.string(),
			/** Default: `Cancel` */
			'mixedbread.searchBox.cancelButtonText': z.string(),
			/** Default: `Cancel` */
			'mixedbread.searchBox.cancelButtonAriaLabel': z.string(),
			/** Default: `Search` */
			'mixedbread.searchBox.searchInputLabel': z.string(),

			// START SCREEN
			/** Default: `Recent` */
			'mixedbread.startScreen.recentSearchesTitle': z.string(),
			/** Default: `No recent searches` */
			'mixedbread.startScreen.noRecentSearchesText': z.string(),
			/** Default: `Save this search` */
			'mixedbread.startScreen.saveRecentSearchButtonTitle': z.string(),
			/** Default: `Remove this search from history` */
			'mixedbread.startScreen.removeRecentSearchButtonTitle': z.string(),
			/** Default: `Favorite` */
			'mixedbread.startScreen.favoriteSearchesTitle': z.string(),
			/** Default: `Remove this search from favorites` */
			'mixedbread.startScreen.removeFavoriteSearchButtonTitle': z.string(),

			// ERROR SCREEN
			/** Default: `Unable to fetch results` */
			'mixedbread.errorScreen.titleText': z.string(),
			/** Default: `You might want to check your network connection.` */
			'mixedbread.errorScreen.helpText': z.string(),

			// FOOTER
			/** Default: `to select` */
			'mixedbread.footer.selectText': z.string(),
			/** Default: `Enter key` */
			'mixedbread.footer.selectKeyAriaLabel': z.string(),
			/** Default: `to navigate` */
			'mixedbread.footer.navigateText': z.string(),
			/** Default: `Arrow up` */
			'mixedbread.footer.navigateUpKeyAriaLabel': z.string(),
			/** Default: `Arrow down` */
			'mixedbread.footer.navigateDownKeyAriaLabel': z.string(),
			/** Default: `to close` */
			'mixedbread.footer.closeText': z.string(),
			/** Default: `Escape key` */
			'mixedbread.footer.closeKeyAriaLabel': z.string(),

			// NO RESULTS SCREEN
			/** Default: `No results for` */
			'mixedbread.noResultsScreen.noResultsText': z.string(),
			/** Default: `Try searching for` */
			'mixedbread.noResultsScreen.suggestedQueryText': z.string(),
			/** Default: `Believe this query should return results?` */
			'mixedbread.noResultsScreen.reportMissingResultsText': z.string(),
			/** Default: `Let us know.` */
			'mixedbread.noResultsScreen.reportMissingResultsLinkText': z.string(),
		})
		.partial();