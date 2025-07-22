# Mixedbread Search Plugin Demo

This demo showcases the Starlight Mixedbread plugin integration.

## 🚀 What's Included

- **Local Plugin**: The plugin is installed locally in `./plugins/starlight-mixedbread/`
- **Client-side Search**: Search runs entirely in the browser using Mixedbread's Vector Store API
- **Starlight Integration**: Seamlessly replaces the default search with Mixedbread search
- **Environment Configuration**: Uses `.env` file for API credentials

## 🎯 Features Demonstrated

- **Search Button**: Click the search icon or press `Ctrl/Cmd + K`
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select, Escape to close
- **Vector Search**: Powered by Mixedbread's semantic search capabilities
- **Starlight Theming**: Matches Starlight's design system

## ⚙️ Configuration

The plugin is configured in `astro.config.mjs`:

```javascript
import starlightMixedbread from './plugins/starlight-mixedbread/index.ts';

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightMixedbread({
          apiKey: process.env.MXBAI_API_KEY || 'demo-key',
          vectorStoreId: process.env.VECTOR_STORE_ID || 'demo-store-id',
          maxResults: 8,
        }),
      ],
    }),
  ],
});
```

## 🔧 Environment Setup

Copy `.env.example` to `.env` and update with your Mixedbread credentials:

```bash
# Mixedbread API Configuration
MXBAI_API_KEY=your_mixedbread_api_key_here
VECTOR_STORE_ID=your_vector_store_id_here
```

## 🧪 Testing

- **Development**: `bun run dev`
- **Build**: `bun run build`
- **Preview**: `bun run preview`

## 📁 Plugin Structure

```
plugins/starlight-mixedbread/
├── index.ts              # Main plugin entry point
├── MixedbreadSearch.astro # Search component
├── schema.ts             # I18n schema definitions
├── variables.css         # CSS custom properties
├── virtual.d.ts          # TypeScript declarations
└── package.json          # Plugin metadata
```

## 🌐 How It Works

1. **Plugin Registration**: Starlight loads the plugin and replaces the default Search component
2. **Configuration**: Virtual modules expose config to the client-side component
3. **Search Interface**: Custom element handles search modal and keyboard interactions
4. **Vector Search**: Mixedbread SDK performs semantic search against your vector store
5. **Results**: Search results are displayed with Starlight styling

The plugin follows the exact same architecture as the official Algolia DocSearch plugin, ensuring compatibility and maintainability.

## 🎨 Customization

Customize the appearance by overriding CSS custom properties:

```css
:root {
  --mixedbread-modal-background: var(--sl-color-black);
  --mixedbread-hit-background-hover: var(--sl-color-gray-6);
  --mixedbread-text-color: var(--sl-color-white);
}
```

This demo provides a complete working example of client-side vector search integration with Astro Starlight!