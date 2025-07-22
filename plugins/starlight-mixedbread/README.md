# Starlight Mixedbread Plugin

A client-side search plugin for Astro Starlight using Mixedbread Vector Store, similar to the Algolia DocSearch plugin.

## Features

- 🔍 **Client-side search**: Search directly from the browser using Mixedbread's Vector Store API
- 🎨 **Starlight integration**: Seamlessly integrates with Starlight's design system
- ⚡ **Fast and responsive**: Optimized search experience with keyboard navigation
- 🌐 **Internationalization**: Supports Starlight's i18n system
- 🎯 **TypeScript support**: Fully typed for better development experience

## Installation

```bash
npm install @astrojs/starlight-mixedbread
```

## Setup

1. **Configure your Astro config**:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightMixedbread from '@astrojs/starlight-mixedbread';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      plugins: [
        starlightMixedbread({
          apiKey: 'your-mixedbread-api-key',
          vectorStoreId: 'your-vector-store-id',
        }),
      ],
    }),
  ],
});
```

2. **Environment variables** (recommended):

Create a `.env` file:

```
MXBAI_API_KEY=your-mixedbread-api-key
VECTOR_STORE_ID=your-vector-store-id
```

Then use in your config:

```js
starlightMixedbread({
  apiKey: process.env.MXBAI_API_KEY,
  vectorStoreId: process.env.VECTOR_STORE_ID,
}),
```

3. **Using a config module**:

For complex configurations, you can use a separate file:

```js
// astro.config.mjs
starlightMixedbread({
  clientOptionsModule: './src/config/mixedbread.ts',
}),
```

```typescript
// src/config/mixedbread.ts
import type { MixedbreadClientOptions } from '@astrojs/starlight-mixedbread';

export default {
  apiKey: process.env.MXBAI_API_KEY!,
  vectorStoreId: process.env.VECTOR_STORE_ID!,
  maxResults: 15,
  disableUserPersonalization: false,
} satisfies MixedbreadClientOptions;
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | - | **Required.** Your Mixedbread API key |
| `vectorStoreId` | `string` | - | **Required.** Your Vector Store ID |
| `maxResults` | `number` | `10` | Maximum number of search results to return |
| `baseUrl` | `string` | `'https://api.mixedbread.ai'` | Mixedbread API base URL |
| `disableUserPersonalization` | `boolean` | `false` | Disable recent searches and favorites |

## Keyboard Shortcuts

- **Ctrl/Cmd + K**: Open search modal
- **Arrow Keys**: Navigate results
- **Enter**: Select result
- **Escape**: Close modal

## Internationalization

Add translations to your Starlight i18n configuration:

```js
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { mixedbreadI18nSchema } from '@astrojs/starlight-mixedbread/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema({ extend: mixedbreadI18nSchema() }),
  }),
};
```

Then add translations in your language files:

```json
{
  "mixedbread.searchBox.resetButtonTitle": "Clear search",
  "mixedbread.searchBox.cancelButtonText": "Cancel",
  "mixedbread.noResultsScreen.noResultsText": "No results for",
  "mixedbread.footer.selectText": "to select"
}
```

## Setting Up Your Vector Store

1. **Create a Mixedbread account** at [mixedbread.ai](https://www.mixedbread.ai)

2. **Create a Vector Store** and upload your documentation

3. **Get your credentials**:
   - API Key from your account settings
   - Vector Store ID from your vector store

4. **Prepare your data**: Ensure your documents have proper metadata:
   ```json
   {
     "title": "Page Title",
     "url": "/path/to/page",
     "path": "Brief description or content preview"
   }
   ```

## Styling

The plugin uses CSS custom properties that follow Starlight's design tokens. You can customize the appearance by overriding these variables:

```css
:root {
  --mixedbread-modal-background: var(--sl-color-black);
  --mixedbread-hit-background-hover: var(--sl-color-gray-6);
  --mixedbread-text-color: var(--sl-color-white);
  /* ... more variables available in variables.css */
}
```

## Development

This plugin follows the same architecture as the official Starlight DocSearch plugin, providing:

- Virtual module system for configuration
- Custom element for the search interface  
- Direct integration with Starlight's component override system

## License

MIT