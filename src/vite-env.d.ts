/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // 这里可以继续加自定义变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
