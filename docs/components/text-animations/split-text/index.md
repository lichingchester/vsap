<script setup lang="ts">
import { useTemplateRef } from "vue";
import SplitText from '@/src/components/text-animations/split-text/SplitText.vue';
import Preview from '@/src/docs/text-animations/split-text/Preview.vue';
import ComponentTitle from '@/src/docs/ui/ComponentTitle.vue';

const splitManualPlayRef = useTemplateRef('splitManualPlayRef'); // Reference to the DOM element

// Define the method to be called on click
const handleClick = () => {
  if (splitManualPlayRef.value.isAnimationCompleted){
    splitManualPlayRef.value.reverse();
  }else{
    splitManualPlayRef.value.play();
  }
  console.log('Button was clicked!', splitManualPlayRef.value.animationCompleted);
};
</script>

<!-- # Split Text -->

<ComponentTitle>Split Text</ComponentTitle>

<Preview />

## Split Text

<!-- <SplitText text="Hello World!" class="text-8xl" type="words,chars" />
<SplitText text="The text in this paragraph is split by words and lines. Lines can be tricky to manage responsively. In this demo we are solving this with autoSplit:true and onSplit. autoSplit is used to Split the text automatically when the text element resizes. We are then using the onSplit callback to revert the old animation, then on the new Split, creating a new animation with the progress preserved. So this is all you need to have a responsive line animation that resplits on resize." mask="lines" type="lines" />
<button @click="handleClick">Toggle Animation</button>
<SplitText ref="splitManualPlayRef" text="Manual Play" class="text-8xl" is-manual-play /> -->

---

<!-- <button @click="handleClick">Toggle Animation</button>

<div class="h-[100vh] flex flex-col justify-end">
  <SplitText text="Hello World!" class="text-8xl" />
</div> -->

Certainly! Here’s a breakdown of what the SplitText.vue component does:

---

### Purpose

This Vue 3 component animates text by splitting it into characters, words, or lines and animating them as they enter the viewport using [GSAP](https://greensock.com/gsap/) and its plugins ([SplitText](https://greensock.com/SplitText/) and [ScrollTrigger](https://greensock.com/scrolltrigger/)).

---

### Key Features

- **Text Splitting:** Splits the given text into chars, words, or lines for animation.
- **Scroll Animation:** Animates the split text when it enters the viewport.
- **Customizable Animation:** Props allow you to control delay, duration, easing, split type, and animation styles.
- **Cleanup:** Properly cleans up GSAP timelines and split instances on unmount.

---

### Props

- `text`: The string to display and animate.
- `classes`: Extra CSS classes for the wrapper.
- `delay`: Delay between each letter/word/line animation (ms).
- `duration`: Duration of each animation (seconds).
- `ease`: Easing function for the animation.
- `splitType`: How to split the text (`chars`, `words`, `lines`, etc.).
- `from`: Initial animation state (e.g., `{ opacity: 0, y: 40 }`).
- `to`: Final animation state (e.g., `{ opacity: 1, y: 0 }`).
- `threshold`: How much of the element must be visible before animating.
- `rootMargin`: Offset for the scroll trigger.
- `textAlign`: Text alignment.

---

### How It Works

1. **Setup:**  
   On mount, the text is split using GSAP’s `SplitText` plugin according to `splitType`.

2. **Animation:**  
   A GSAP timeline is created. When the element scrolls into view (using `ScrollTrigger`), the split elements animate from the `from` state to the `to` state, staggered by `delay`.

3. **Reactivity:**  
   If any relevant prop changes, the animation resets and re-initializes.

4. **Cleanup:**  
   On unmount, all GSAP timelines, triggers, and split instances are killed and reverted to prevent memory leaks.

---

### Template

Renders a `<div>` with the provided text and applies the split/animation logic to it.

---

### Example Usage

```vue
<SplitText
  text="Animate me!"
  splitType="chars"
  :delay="80"
  :duration="0.5"
  ease="power2.out"
/>
```

---

Let me know if you want a more detailed explanation of any part!
