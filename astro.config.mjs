// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightMixedbread from './plugins/starlight-mixedbread/index.ts';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
        title: 'My Docs',
        social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
        plugins: [
            starlightMixedbread({
                apiKey: process.env.MXBAI_API_KEY || 'demo-key',
                storeId: process.env.STORE_ID || 'demo-store-id',
                maxResults: 8,
            }),
        ],
    }),
  ],
  adapter: vercel(),
});