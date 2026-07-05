/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Displayed site version — latest `v*` tag → package.json → "dev".
   *  Injected at build by astro.config (vite.define). */
  readonly PUBLIC_APP_VERSION: string;
}
