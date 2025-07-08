<script setup lang="ts">
// Docs UI
import Preview from "@/src/docs/components/text-animations/split-text/Preview.vue";
import Showcases from "@/src/docs/components/text-animations/split-text/Showcases.vue";
</script>

# Split Text

<Preview>
  <template v-slot:usage> ```bash npx ``` </template>
</Preview>

## Installation

### jsrepo

```bash
npx jsrepo add text-animations/split-text
```

### Standalone

```bash
npx jsrepo add https://github.com/lichingchester/vsap/tree/main/text-animations/split-text
```

### Manually

::: details Source Code {open}

<<< @/../src/components/text-animations/split-text/SplitText.vue

:::

## API Reference

### Props

| Prop         | Type                                               | Default                | Description                                                                                                                 |
| ------------ | -------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| text         | `string`                                           |                        | Text content to be animated.                                                                                                |
| stagger      | `number`                                           | `0.05`                 | Delay between each element animation (in seconds)                                                                           |
| duration     | `number`                                           | `1`                    | Duration of each element animation (in seconds)                                                                             |
| ease         | `string`                                           | `power4.out`           | GSAP easing function [Official Doc](https://gsap.com/docs/v3/Eases)                                                         |
| type         | `string`                                           | `words`                | GSAP SplitText type option [Official Doc](https://gsap.com/docs/v3/Plugins/SplitText/#type)                                 |
| from         | `object`                                           | `{[key: string]: any}` | GSAP Tween Data for initial state [Official Doc](https://gsap.com/docs/v3/GSAP/Tween#data)                                  |
| to           | `object`                                           | `{[key: string]: any}` | GSAP Tween Data for end state [Official Doc](https://gsap.com/docs/v3/GSAP/Tween#data)                                      |
| start        | `string`                                           | `top 90%`              | Determines the starting position of the ScrollTrigger [Official Doc](https://gsap.com/docs/v3/Plugins/ScrollTrigger/#start) |
| mask         | `"lines"` \| `"words"` \| `"chars"` \| `undefined` | `undefined`            | GSAP SplitText Mask Option [Official Doc](https://gsap.com/docs/v3/Plugins/SplitText/#mask*)                                |
| isManualPlay | `boolean`                                          | `false`                | Whether to trigger animation manually instead of on scroll                                                                  |

### Emits

| Emit                | Payload | Description                      |
| ------------------- | ------- | -------------------------------- |
| animation-completed | `void`  | Emitted when animation completes |

### Expose

| Expose               | Type       | Description                                              |
| -------------------- | ---------- | -------------------------------------------------------- |
| play                 | `function` | Play the animation manually if `isManualPlay` is true    |
| reverse              | `function` | Reverse the animation manually if `isManualPlay` is true |
| isAnimationCompleted | `property` | Track animation completion state                         |

## Key Features

### Text Splitting

Splits the given text into chars, words, or lines for animation with GSAP SplitText plugin.

### Scroll Animation

Animates the split text when it enters the viewport by default with GSAP ScrollTrigger plugin, can disable by `isManualPlay` to `true`.

### Customizable Animation

Props allow you to control delay, duration, easing, split type, and animation styles.

Source code edit allow you to setup more complicated animation with GSAP Timeline:

```ts
// Build the animation sequence
timeline.set(animationTargets, {
  ...props.from,
  immediateRender: false,
  force3D: true,
});

// For more complex animations, you can add stagger effects here
timeline.to(animationTargets, {
  ...props.to,
  duration: props.duration,
  ease: props.ease,
  stagger: props.stagger,
  force3D: true,
});
```

### Responsive re-splitting

See https://gsap.com/docs/v3/Plugins/SplitText/#features

## Showcases

### Advanced GSAP Config

<Showcases case-name="AdvancedGsapConfig" />

```vue{6-13}
<template>
  <SplitText
    text="Hello World!"
    class="text-8xl text-center"
    type="chars,words"
    :from="{
      opacity: 0,
      y: 'random(150, 0)',
      x: 'random(-100, 100)',
      rotate: 'random(-180, 180)',
      visibility: 'hidden',
    }"
    :to="{ opacity: 1, y: 0, x: 0, rotate: 0, visibility: 'visible' }"
    ease="elastic.out(1,0.3)"
    :duration="2"
  />
</template>
```

### Mask

<Showcases case-name="Mask" />

```vue {5}
<SplitText
  text="Hello World!"
  class="text-8xl text-center"
  type="chars,words"
  mask="chars"
/>
```

### Manual Play

<Showcases case-name="Manual" />

```vue
<script setup lang="ts">
import { useTemplateRef } from "vue";

const isManualPlayRef = useTemplateRef("isManualPlayRef");

const play = () => {
  isManualPlayRef.play();
};

const reverse = () => {
  isManualPlayRef.reverse();
};
</script>

<template>
  <button @click="play">Play</button>
  <button @click="reverse">Reverse</button>

  <SplitText
    ref="isManualPlayRef"
    text="Hello World!"
    class="text-8xl text-center"
    type="chars,words"
    :from="{
      x: (index) => `random(['${index % 2 === 0 ? '0' : '100%, -100%'}])`,
      y: (index) => `random(['${index % 2 !== 0 ? '0' : '100%, -100%'}])`,
    }"
    :to="{
      x: 0,
      y: 0,
    }"
    mask="chars"
    ease="power3.inOut"
    is-manual-play
  />
</template>
```

### Absolute Position

<Showcases case-name="Absolute" />

```vue {4}
<template>
  <SplitText
    text="Hello World!"
    class="absolute left-3 bottom-3 text-8xl text-center"
    :from="{
      opacity: 0,
      y: '-200%',
    }"
    :to="{
      opacity: 1,
      y: 0,
    }"
    :duration="2"
    ease="power3.out"
    type="lines"
  />
</template>
```
