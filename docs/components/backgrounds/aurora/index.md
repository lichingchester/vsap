<script setup lang="ts">
// Docs UI
import Preview from "@/src/docs/components/backgrounds/aurora/Preview.vue";
import Showcases from "@/src/docs/components/backgrounds/aurora/Showcases.vue";
</script>

# Aurora

<Preview>
  <template v-slot:usage> ```bash npx ``` </template>
</Preview>

## Installation

### jsrepo

```bash
npx jsrepo add backgrounds/aurora
```

### Standalone

```bash
npx jsrepo add https://github.com/lichingchester/vsap/tree/main/backgrounds/aurora
```

### Manually

::: details Source Code

<<< @/../src/components/backgrounds/aurora/Aurora.vue

:::

## Showcases

### Ocean

<Showcases case-name="Ocean" />

::: details Usage

```vue
<template>
  <Aurora
    baseColor="#173564"
    auroraColor1="#00aaff"
    auroraColor2="#5c53a2"
    :speed="1.0"
    :intensity="5.9"
    :densityX="1.9"
    :densityY="4.9"
    :verticalFalloff="1.9"
    :opacity="1"
    :noiseAmplitude="0.5"
  />
</template>
```

:::

### Stage Curtain

<Showcases case-name="Stage Curtain" />

::: details Usage

```vue
<template>
  <Aurora
    baseColor="#0a1d2d"
    auroraColor1="#A500B5"
    auroraColor2="#FF6F61"
    :speed="1.0"
    :intensity="2.6"
    :densityX="10"
    :densityY="0.2"
    :verticalFalloff="0.5"
    :opacity="1"
    :noiseAmplitude="0.1"
  />
</template>
```

:::

## API Reference

### Props

| Prop            | Type     | Default     | Description                                                                                    |
| --------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------- |
| baseColor       | `string` | `"#1b1b1b"` | Background color behind the aurora effect.                                                     |
| auroraColor1    | `string` | `"#00ff00"` | Primary color of the aurora.                                                                   |
| auroraColor2    | `string` | `"#0000ff"` | Secondary color of the aurora, blended with the primary.                                       |
| speed           | `number` | `1.0`       | Animation speed multiplier. Higher values create faster movement.                              |
| intensity       | `number` | `3.0`       | Intensity of the aurora effect. Higher values create more vibrant, pronounced colors.          |
| densityX        | `number` | `2.5`       | Horizontal density. Higher values create more detailed horizontal patterns.                    |
| densityY        | `number` | `0.0`       | Vertical density. Higher values create more detailed vertical patterns.                        |
| verticalFalloff | `number` | `1.0`       | Controls how quickly the effect fades toward the bottom. Higher values create sharper falloff. |
| opacity         | `number` | `1.0`       | Overall opacity of the aurora effect.                                                          |
| noiseAmplitude  | `number` | `0.3`       | Strength of the noise distortion. Higher values create more dramatic wave patterns.            |
| resolution      | `number` | `1.0`       | Rendering resolution multiplier. Lower values improve performance but reduce quality.          |

## Key Features

### Fully Customizable

Extensive props for adjusting colors, intensity, movement, and visual characteristics.

### Immersive Backgrounds

Perfect for creating atmospheric website backgrounds.

### Full-Screen or Container-Bound

Can fill entire viewport or be contained within specific elements.
