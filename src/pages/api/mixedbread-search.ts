import type { APIRoute } from 'astro';
import Mixedbread from '@mixedbread/sdk';

const mxbai = new Mixedbread({
  apiKey: import.meta.env.MXBAI_API_KEY,
});

export const GET: APIRoute = async ({ request, url }) => {
  if (!import.meta.env.MXBAI_API_KEY || !import.meta.env.VECTOR_STORE_ID) {
    return new Response(JSON.stringify({ error: 'Environment setup failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!url.searchParams.has('query')) {
    return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const query = url.searchParams.get('query')!;

  try {
    const response = await mxbai.vectorStores.search({
      query,
      vector_store_identifiers: [import.meta.env.VECTOR_STORE_ID],
      top_k: 10,
      search_options: {
        return_metadata: true,
      },
    });

    // Transform results to match the expected format
    const results = response.data.map((item: any, index: number) => ({
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
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
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