# Example Usage

Here are some examples of how to use the Starlight Mixedbread plugin.

## Basic Setup

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightMixedbread from '@astrojs/starlight-mixedbread';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Documentation',
      plugins: [
        starlightMixedbread({
          apiKey: process.env.MXBAI_API_KEY,
          vectorStoreId: process.env.VECTOR_STORE_ID,
          maxResults: 8,
        }),
      ],
    }),
  ],
});
```

## Advanced Configuration

```js
// astro.config.mjs
export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      plugins: [
        starlightMixedbread({
          clientOptionsModule: './src/search-config.ts',
        }),
      ],
    }),
  ],
});
```

```typescript
// src/search-config.ts
import type { MixedbreadClientOptions } from '@astrojs/starlight-mixedbread';

export default {
  apiKey: process.env.MXBAI_API_KEY!,
  vectorStoreId: process.env.VECTOR_STORE_ID!,
  maxResults: 15,
  baseUrl: 'https://api.mixedbread.ai',
  disableUserPersonalization: false,
} satisfies MixedbreadClientOptions;
```

## Content Configuration with Translations

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { mixedbreadI18nSchema } from '@astrojs/starlight-mixedbread/schema';

export const collections = {
  docs: defineCollection({ 
    loader: docsLoader(), 
    schema: docsSchema() 
  }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema({ 
      extend: mixedbreadI18nSchema() 
    }),
  }),
};
```

## Custom Translations

```json
// src/content/i18n/en.json
{
  "search.label": "Search documentation",
  "mixedbread.searchBox.resetButtonTitle": "Clear search",
  "mixedbread.searchBox.cancelButtonText": "Cancel",
  "mixedbread.footer.selectText": "to select",
  "mixedbread.footer.navigateText": "to navigate", 
  "mixedbread.footer.closeText": "to close",
  "mixedbread.noResultsScreen.noResultsText": "No results found for",
  "mixedbread.errorScreen.titleText": "Search failed",
  "mixedbread.errorScreen.helpText": "Please check your connection and try again"
}
```

## Environment Variables

```bash
# .env
MXBAI_API_KEY=your_mixedbread_api_key_here
VECTOR_STORE_ID=your_vector_store_id_here
```

## Custom CSS Styling

```css
/* src/styles/custom.css */
:root {
  /* Customize modal appearance */
  --mixedbread-modal-background: #1a1a1a;
  --mixedbread-modal-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  
  /* Customize search results */
  --mixedbread-hit-background-hover: #2d3748;
  --mixedbread-hit-color: #e2e8f0;
  
  /* Customize search box */
  --mixedbread-searchbox-background: #2d3748;
  --mixedbread-text-color: #fff;
  --mixedbread-muted-color: #a0aec0;
}

/* Custom result styling */
.mixedbread-hit {
  transition: all 0.2s ease-in-out;
}

.mixedbread-hit:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

This plugin provides a complete client-side search solution that mimics the DocSearch experience while using Mixedbread's powerful vector search capabilities.