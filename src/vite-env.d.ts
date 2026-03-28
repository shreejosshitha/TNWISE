/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_ADMIN_API_URL?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
