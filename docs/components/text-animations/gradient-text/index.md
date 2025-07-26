<script setup lang="ts">
// Docs UI
import Preview from "@/src/docs/components/text-animations/gradient-text/Preview.vue";
import Showcases from "@/src/docs/components/text-animations/gradient-text/Showcases.vue";
</script>

# Gradient Text

<Preview>
  <template v-slot:usage> ```bash npx ``` </template>
</Preview>

## Installation

### jsrepo

```bash
npx jsrepo add text-animations/gradient-text
```

### Standalone

```bash
npx jsrepo add https://github.com/lichingchester/vsap/tree/main/text-animations/gradient-text
```

### Manually

::: details Source Code

<<< @/../src/components/text-animations/gradient-text/GradientText.vue

:::

## Showcases

### Rainbow Flow

<Showcases case-name="Rainbow Flow" />

::: details Usage

```vue
<template>
  <GradientText
    :colors="[
      '#ff0000 0%',
      '#ff8000 16%',
      '#ffff00 33%',
      '#80ff00 50%',
      '#00ff80 66%',
      '#0080ff 83%',
      '#ff0000 100%',
    ]"
    :animationSpeed="4"
    :degree="45"
    gradientType="linear"
    class="text-8xl text-center font-bold"
  >
    Rainbow Flow
  </GradientText>
</template>
```

:::

### Ocean Waves

<Showcases case-name="Ocean Waves" />

::: details Usage

```vue
<template>
  <GradientText
    :colors="[
      '#0ea5e9 0%',
      '#06b6d4 25%',
      '#0891b2 50%',
      '#0e7490 75%',
      '#0ea5e9 100%',
    ]"
    :animationSpeed="6"
    :degree="90"
    gradientType="linear"
    class="text-8xl text-center font-bold"
  >
    Ocean Waves
  </GradientText>
</template>
```

:::

### Cyber Neon

<Showcases case-name="Cyber Neon" />

::: details Usage

```vue
<template>
  <GradientText
    :colors="[
      '#00ff41 0%',
      '#00d4aa 25%',
      '#ff0080 50%',
      '#8000ff 75%',
      '#00ff41 100%',
    ]"
    :animationSpeed="2"
    :degree="0"
    gradientType="linear"
    class="text-8xl text-center font-bold"
  >
    CYBER NEON
  </GradientText>
</template>
```

:::

### Fire Flame

<Showcases case-name="Fire Flame" />

::: details Usage

```vue
<template>
  <GradientText
    :colors="[
      '#ff4500 0%',
      '#ff6347 20%',
      '#ffa500 40%',
      '#ffff00 60%',
      '#ff4500 80%',
      '#ff4500 100%',
    ]"
    :animationSpeed="1.5"
    :degree="270"
    gradientType="linear"
    class="text-8xl text-center font-bold"
  >
    Fire Flame
  </GradientText>
</template>
```

:::

## Props

| Prop             | Type                   | Default                             | Description                                                    |
| ---------------- | ---------------------- | ----------------------------------- | -------------------------------------------------------------- |
| `colors`         | `string[]`             | `["#ffaa40", "#9c40ff", "#ffaa40"]` | Array of color strings with percentages (e.g., `"#ff0000 0%"`) |
| `animationSpeed` | `number`               | `8`                                 | Animation duration in seconds                                  |
| `degree`         | `number`               | `90`                                | Gradient angle in degrees (0-360) for linear gradients         |
| `gradientType`   | `"linear" \| "radial"` | `"linear"`                          | Type of gradient to use                                        |
| `showBorder`     | `boolean`              | `false`                             | Whether to show animated border (not yet implemented)          |
| `class`          | `string`               | `undefined`                         | Additional CSS classes                                         |

## Usage

The GradientText component creates animated gradient text effects with customizable colors, speeds, and directions.

### Basic Usage

```vue
<template>
  <GradientText> Hello World! </GradientText>
</template>
```

### Custom Colors

```vue
<template>
  <GradientText :colors="['#ff0000 0%', '#00ff00 50%', '#0000ff 100%']">
    Custom Colors
  </GradientText>
</template>
```

### Different Gradient Types

```vue
<template>
  <!-- Linear gradient -->
  <GradientText gradientType="linear" :degree="45">
    Linear Gradient
  </GradientText>

  <!-- Radial gradient -->
  <GradientText gradientType="radial"> Radial Gradient </GradientText>
</template>
```

### Animation Speed

```vue
<template>
  <!-- Fast animation -->
  <GradientText :animationSpeed="1"> Fast Animation </GradientText>

  <!-- Slow animation -->
  <GradientText :animationSpeed="10"> Slow Animation </GradientText>
</template>
```
