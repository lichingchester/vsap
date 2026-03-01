// declare module "#components" {
//   import { Component } from "vue";
//   export const NuxtLink: Component;
// }

declare module "#components" {
  import type { Component } from "vue";
  const NuxtLink: Component;
}
