import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import SplitText from "./SplitText.vue";

// Mock GSAP and its plugins
vi.mock("gsap", () => {
  const timeline = {
    set: vi.fn().mockReturnThis(),
    to: vi.fn().mockReturnThis(),
    play: vi.fn(),
    reverse: vi.fn(),
    kill: vi.fn(),
  };

  return {
    gsap: {
      registerPlugin: vi.fn(),
      set: vi.fn(),
      timeline: vi.fn(() => timeline),
      killTweensOf: vi.fn(),
    },
    ScrollTrigger: {
      getAll: vi.fn(() => []),
      create: vi.fn(),
    },
    SplitText: vi.fn().mockImplementation(() => ({
      chars: ["char1", "char2"],
      words: ["word1", "word2"],
      lines: ["line1"],
      revert: vi.fn(),
    })),
  };
});

describe("SplitText", () => {
  let wrapper: any;

  beforeEach(() => {
    // Create a fresh wrapper before each test
    document.body.innerHTML = "";
  });

  afterEach(() => {
    // Clean up after each test
    wrapper?.unmount();
  });

  it("renders with the correct text", () => {
    wrapper = mount(SplitText, {
      props: {
        text: "Hello World",
      },
    });

    expect(wrapper.text()).toBe("Hello World");
  });

  it("applies custom classes when provided", () => {
    wrapper = mount(SplitText, {
      props: {
        text: "Hello World",
        classes: "custom-class",
      },
    });

    expect(wrapper.classes()).toContain("custom-class");
  });

  it("exposes play and reverse methods", () => {
    wrapper = mount(SplitText, {
      props: {
        text: "Hello World",
        isManualPlay: true,
      },
    });

    expect(typeof wrapper.vm.play).toBe("function");
    expect(typeof wrapper.vm.reverse).toBe("function");
  });

  it("emits animation-completed event when animation completes", async () => {
    wrapper = mount(SplitText, {
      props: {
        text: "Hello World",
      },
    });

    // Access the timeline created in the component
    const timeline = wrapper.vm.timeline;

    // Manually trigger the onComplete callback that would fire when animation completes
    if (timeline && timeline.vars && timeline.vars.onComplete) {
      timeline.vars.onComplete();
    }

    // Check if the event was emitted
    expect(wrapper.emitted("animation-completed")).toBeTruthy();
  });

  it("reinitializes when text prop changes", async () => {
    wrapper = mount(SplitText, {
      props: {
        text: "Hello World",
      },
    });

    // Spy on initializeSplitText method
    const initSpy = vi.spyOn(wrapper.vm, "initializeSplitText");

    // Change the text prop
    await wrapper.setProps({ text: "New Text" });

    // Check if initialization function was called
    expect(initSpy).toHaveBeenCalled();
    expect(wrapper.text()).toBe("New Text");
  });
});
