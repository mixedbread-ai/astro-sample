# Example Usage

Here are examples of how to use the Starlight Mixedbread plugin.

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
          storeId: process.env.STORE_ID,
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
  storeId: process.env.STORE_ID!,
  maxResults: 15,
  baseUrl: 'https://api.mixedbread.ai',
  disableUserPersonalization: false,
} satisfies MixedbreadClientOptions;
```

## API Endpoint Setup

Create the search API endpoint that the plugin will call:

```typescript
// src/pages/api/search.ts
import type { APIRoute } from 'astro';
import Mixedbread from '@mixedbread/sdk';

export const prerender = false;

const mxbai = new Mixedbread({
  apiKey: import.meta.env.MXBAI_API_KEY,
});

export const GET: APIRoute = async ({ request, url }) => {
  // Validate environment variables
  if (!import.meta.env.MXBAI_API_KEY || !import.meta.env.STORE_ID) {
    return new Response(JSON.stringify({ error: 'Environment setup failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get search query
  const query = url.searchParams.get('query');
  if (!query) {
    return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Search the store
    const response = await mxbai.stores.search({
      query,
      store_identifiers: [import.meta.env.STORE_ID],
      top_k: 10,
      search_options: {
        return_metadata: true,
      },
    });

    // Transform results to match expected format
    const results = response.data.map((item, index) => ({
      id: `result-${index}`,
      title: item.generated_metadata?.title || 'Untitled',
      content: item.generated_metadata?.path || item.text || '',
      url: item.generated_metadata?.url || '#',
      score: item.score || 0,
    }));

    return new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ error: 'Search failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

## Environment Variables

```bash
# .env
MXBAI_API_KEY=your_mixedbread_api_key_here
STORE_ID=your_store_id_here
```

## Custom CSS Styling

You can customize the search interface by overriding CSS variables:

```css
/* src/styles/custom.css */
:root {
  /* Modal appearance */
  --mixedbread-modal-background: var(--sl-color-black);
  --mixedbread-modal-border: var(--sl-color-gray-5);
  
  /* Search results */
  --mixedbread-hit-background: transparent;
  --mixedbread-hit-background-hover: var(--sl-color-gray-6);
  --mixedbread-hit-border: rgba(255, 255, 255, 0.05);
  --mixedbread-hit-color: var(--sl-color-white);
  
  /* Search box */
  --mixedbread-searchbox-border: var(--sl-color-gray-5);
  --mixedbread-input-color: var(--sl-color-white);
  --mixedbread-input-placeholder: var(--sl-color-gray-3);
  
  /* States */
  --mixedbread-loading-color: var(--sl-color-gray-3);
  --mixedbread-error-color: #ef4444;
  --mixedbread-accent-color: var(--sl-color-accent);
}
```

## Usage Tip

**Store Setup**: Ensure your Mixedbread store contains documents with proper metadata:
   ```json
   {
     "title": "Page Title",
     "url": "/docs/page-path",
     "path": "Brief description or breadcrumb"
   }
   ```

This plugin provides a complete client-side search solution that integrates seamlessly with Starlight!
