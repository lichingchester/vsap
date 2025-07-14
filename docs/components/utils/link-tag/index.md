<script setup lang="ts">
import IconVue from "@/src/docs/components/ui/icons/IconVue.vue";
import IconNuxt from "@/src/docs/components/ui/icons/IconNuxt.vue";
</script>

# Link Tag

This is a versatile link component designed to ensure consistent link handling across both Vue and Nuxt applications.

In some cases, you may need the "Link" element to render as a `<div>` when no URL is provided in your dynamic data, and as an `<a>` tag when a URL is present. This component is intended to help manage these different scenarios according to your project’s requirements.

**Source Code**

```vue{5}
<LinkTag
  v-for="(product, index) in apiProducts"
  :key="index"
  :href="product.link"
  :no-link="product.link ? false : true"
  class="product-card"
>
  ...
</LinkTag>
```

**Output (when a URL is provided)**

```html
<a href="/product-a" class="product-card"> ... </a>
<a href="/product-b" class="product-card"> ... </a>
<a href="/product-c" class="product-card"> ... </a>
```

**Output (when no URL is provided)**

```html
<div class="product-card">...</div>
<div class="product-card">...</div>
<div class="product-card">...</div>
```

## Installation

### jsrepo

::: code-group

```bash [<div class="flex items-center gap-2"><IconVue class="size-4" />Vue</div>]
npx jsrepo add utils/link-tag
```

```bash [<div class="flex items-center gap-2"><IconNuxt class="size-4" />Nuxt</div>]
npx jsrepo add utils/link-tag-nuxt
```

:::

### Standalone

::: code-group

```bash [<div class="flex items-center gap-2"><IconVue class="size-4" />Vue</div>]
npx jsrepo add https://github.com/lichingchester/vsap/tree/main/utils/link-tag
```

```bash [<div class="flex items-center gap-2"><IconNuxt class="size-4" />Nuxt</div>]
npx jsrepo add https://github.com/lichingchester/vsap/tree/main/utils/link-tag-nuxt
```

:::

### Manually

#### <div class="flex items-center gap-2"><IconVue class="size-6" />Vue</div>

::: details Source Code

<<< @/../src/components/utils/link-tag/LinkTag.vue

:::

#### <div class="flex items-center gap-2"><IconNuxt class="size-6" />Nuxt</div>

::: details Source Code

<<< @/../src/components/utils/link-tag-nuxt/LinkTag.vue

:::

## Use Cases

### Standard Internal Link (with `RouterLink` / `NuxtLink`)

```vue
<template>
  <LinkTag href="/dashboard">Go to Dashboard</LinkTag>
</template>
```

### External Link (with `a` tag)

```vue
<template>
  <LinkTag href="https://example.com" external>Visit Example.com</LinkTag>
</template>
```

### New Tab Link

```vue
<template>
  <LinkTag href="https://example.com" new-tab> Open in New Tab </LinkTag>
</template>
```

### Not a Link (with `div` tag)

```vue
<template>
  <LinkTag noLink> This is a div, not a link </LinkTag>
</template>
```

### With Custom Attributes

```vue
<template>
  <LinkTag
    href="/products"
    :attributes="{
      class: 'custom-class',
      id: 'product-link',
      'data-test': 'product-navigation',
    }"
  >
    Products with Custom Attributes
  </LinkTag>
</template>
```

## API Reference

### Props

| Prop       | Type                  | Default | Description                                                                                                         |
| ---------- | --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| href       | `string`              | `""`    | URL or path to navigate to                                                                                          |
| noLink     | `boolean`             | `false` | When true, renders as `<div>` instead of a link                                                                     |
| external   | `boolean`             | `false` | When true, uses href directly instead of router; When false, renders as `<RouterLink>` in Vue; `<NuxtLink>` in Nuxt |
| newTab     | `boolean`             | `false` | When true, opens link in new tab                                                                                    |
| attributes | `Record<string, any>` | `{}`    | Additional attributes to pass to the element                                                                        |

## Framework-Specific Implementation

### Vue Version

The Vue version dynamically imports `vue-router` and falls back to a standard anchor tag if the router isn't available.

### Nuxt Version

The Nuxt version directly imports the `NuxtLink` component, which provides optimized navigation in Nuxt applications with features like prefetching.
