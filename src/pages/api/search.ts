import type { APIContext } from "astro";
import { mxbai } from "../../search/lib/mxbai";
import type { SearchResult } from "../../search/lib/types";

interface SearchMetadata {
  title?: string;
  path?: string;
  source_url?: string;
  [key: string]: any;
}

export async function GET({ url }: APIContext) {
  if (!import.meta.env.MXBAI_API_KEY || !import.meta.env.VECTOR_STORE_ID) {
    return new Response(
      JSON.stringify({ error: "Environment setup failed" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const query = url.searchParams.get("query");

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Query is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const res = await mxbai.vectorStores.search({
    query,
    vector_store_identifiers: [import.meta.env.VECTOR_STORE_ID],
    top_k: 10,
    search_options: {
      return_metadata: true,
    },
  });

  const results: SearchResult[] = res.data.map((item, index) => {
    const metadata = item.generated_metadata as SearchMetadata;
    const url = metadata?.url || metadata?.source_url || "";
    const title = metadata?.title || "Untitled";

    const breadcrumb = metadata.breadcrumb
      ? metadata.breadcrumb
      : metadata?.path?.split("/") || [];

    return {
      id: `${item.file_id}-${index}`,
      url: url,
      type: "page",
      title,
      description: metadata?.description || "",
      score: item.score,
      breadcrumb,
    };
  });

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};