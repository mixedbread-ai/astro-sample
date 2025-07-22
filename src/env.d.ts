/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MXBAI_API_KEY: string;
  readonly VECTOR_STORE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}