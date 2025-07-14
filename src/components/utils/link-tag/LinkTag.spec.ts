import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import LinkTag from "./LinkTag.vue";

// Mock vue-router module
vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    RouterLink: {
      name: "RouterLink",
      props: ["to", "target"],
      template: '<a :href="to" :target="target"><slot /></a>',
    },
  };
});

describe("LinkTag", () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // FIXME: Test when RouterLink is available, facing issues with async import
  // it('renders RouterLink by default with correct "to" prop', async () => {
  //   wrapper = mount(LinkTag, {
  //     props: {
  //       href: "/dashboard",
  //     },
  //     slots: {
  //       default: "Link Text",
  //     },
  //   });

  //   await flushPromises();

  //   console.log("debugging LinkTag:", wrapper.html());
  //   console.log(wrapper.html());

  //   expect(wrapper.html()).toContain('href="/dashboard"');
  //   expect(wrapper.text()).toBe("Link Text");
  // });

  it("renders as a div when noLink is true", () => {
    wrapper = mount(LinkTag, {
      props: {
        href: "/dashboard",
        noLink: true,
      },
      slots: {
        default: "Not a Link",
      },
    });

    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.text()).toBe("Not a Link");
  });

  it("renders as an anchor tag when external is true", () => {
    wrapper = mount(LinkTag, {
      props: {
        href: "https://example.com",
        external: true,
      },
      slots: {
        default: "External Link",
      },
    });

    expect(wrapper.element.tagName).toBe("A");
    expect(wrapper.attributes("href")).toBe("https://example.com");
    expect(wrapper.text()).toBe("External Link");
  });

  it('adds target="_blank" when newTab is true', () => {
    wrapper = mount(LinkTag, {
      props: {
        href: "https://example.com",
        external: true,
        newTab: true,
      },
    });

    expect(wrapper.attributes("target")).toBe("_blank");
  });

  it("passes additional attributes to the rendered element", async () => {
    wrapper = mount(LinkTag, {
      props: {
        href: "/dashboard",
        external: true,
        attributes: {
          id: "custom-id",
          class: "custom-class",
          "data-test": "test-link",
        },
      },
    });

    await flushPromises();

    expect(wrapper.attributes("id")).toBe("custom-id");
    expect(wrapper.attributes("class")).toBe("custom-class");
    expect(wrapper.attributes("data-test")).toBe("test-link");
  });

  it("handles all props together correctly", async () => {
    wrapper = mount(LinkTag, {
      props: {
        href: "https://example.com",
        external: true,
        newTab: true,
        attributes: {
          rel: "noopener",
          class: "external-link",
        },
      },
      slots: {
        default: "External Link with Attributes",
      },
    });

    expect(wrapper.element.tagName).toBe("A");
    expect(wrapper.attributes("href")).toBe("https://example.com");
    expect(wrapper.attributes("target")).toBe("_blank");
    expect(wrapper.attributes("rel")).toBe("noopener");
    expect(wrapper.attributes("class")).toBe("external-link");
    expect(wrapper.text()).toBe("External Link with Attributes");
  });

  // FIXME: Test when RouterLink is available, facing issues with async import
  // it("falls back to ATag when RouterLink fails to load", async () => {
  //   // Create a local version with a failing router import
  //   vi.doMock("vue-router", () => {
  //     throw new Error("Router not available");
  //   });

  //   const { default: LinkTagFresh } = await import("./LinkTag.vue");

  //   wrapper = mount(LinkTagFresh, {
  //     props: {
  //       href: "/dashboard",
  //     },
  //   });

  //   // Reset the mock afterward
  //   vi.resetModules();

  //   await flushPromises();

  //   expect(wrapper.element.tagName).toBe("A");
  //   expect(wrapper.attributes("href")).toBe("/dashboard");
  // });
});
