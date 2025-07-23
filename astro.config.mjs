// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightMixedbread from './plugins/starlight-mixedbread/index.ts';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
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
