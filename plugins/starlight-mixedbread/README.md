# Starlight Mixedbread Plugin

A client-side search plugin for Astro Starlight using Mixedbread's Vector Store API.

## Features

- 🔍 **Client-side search**: Search through your API endpoint powered by Mixedbread's Vector Store
- 🎨 **Starlight integration**: Seamlessly replaces the default search with a custom implementation
- ⚡ **Fast and responsive**: Debounced search with loading states and keyboard navigation
- ♿ **Accessible**: Full screen reader support with ARIA labels and live regions
- ⌨️ **Keyboard navigation**: Arrow keys with boundary stops, Tab support, and Escape to close
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
          apiKey: process.env.MXBAI_API_KEY,
          vectorStoreId: process.env.VECTOR_STORE_ID,
        }),
      ],
    }),
  ],
});
```

2. **Environment variables**:

Create a `.env` file:

```
MXBAI_API_KEY=your-mixedbread-api-key
VECTOR_STORE_ID=your-vector-store-id
```

3. **Create the API endpoint**:

```typescript
// src/pages/api/search.ts
import type { APIRoute } from 'astro';
import Mixedbread from '@mixedbread/sdk';

export const prerender = false;

const mxbai = new Mixedbread({
  apiKey: import.meta.env.MXBAI_API_KEY,
});

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('query');
  
  if (!query) {
    return new Response(JSON.stringify({ error: 'Query required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await mxbai.vectorStores.search({
      query,
      vector_store_identifiers: [import.meta.env.VECTOR_STORE_ID],
      top_k: 10,
    });

    const results = response.data.map((item, index) => ({
      id: `result-${index}`,
      title: item.generated_metadata?.title || 'Untitled',
      content: item.generated_metadata?.path || item.text || '',
      url: item.generated_metadata?.url || '#',
      score: item.score || 0,
    }));

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Search failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | - | **Required.** Your Mixedbread API key |
| `vectorStoreId` | `string` | - | **Required.** Your Vector Store ID |
| `maxResults` | `number` | `10` | Maximum number of search results to return |
| `baseUrl` | `string` | `'https://api.mixedbread.ai'` | Mixedbread API base URL |
| `disableUserPersonalization` | `boolean` | `false` | Disable recent searches and favorites |

## Using a Config Module

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

## Keyboard Shortcuts

- **Ctrl/Cmd + K**: Open search modal
- **Arrow Up/Down**: Navigate results
- **Enter**: Select result
- **Escape**: Close modal


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

The plugin uses CSS custom properties that follow Starlight's design tokens. You can customize the appearance by overriding these variables in your `variables.css`:

```css
:root {
  --mixedbread-modal-background: var(--sl-color-black);
  --mixedbread-hit-background-hover: var(--sl-color-gray-6);
  --mixedbread-hit-color: var(--sl-color-white);
  /* ... more variables available in variables.css */
}
```

## Development

This plugin provides:

- Virtual module system for configuration
- Custom element for the search interface  
- Direct integration with Starlight's component override system
- Fully accessible search experience

## License

MIT