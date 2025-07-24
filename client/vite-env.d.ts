/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // add other VITE_ variables here if you want
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
