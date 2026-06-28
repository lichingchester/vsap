# The detail page is a copy-artifact console: Install · Source · Usage, generated Usage, a persisted variant preference

The snippet detail page is where the product's whole job happens — *find a
snippet, see it run, read its props, copy the source* ([[PRODUCT]]). The promoted
page from [[0008-design-directions-via-token-demo-harness]] did that thinly: one
"Usage" section showed the component **source** under variant tabs with a single
copy button, and the live playground drove the *preview* but **not** the copyable
code. We redesigned it (explored via a fresh throwaway `/demos` round, same
harness discipline as ADR-0008) and decided:

- **A variant exposes up to three copy artifacts: Install · Source · Usage.**
  Install is the npm line(s) for the selected variant (shown only when there are
  npm deps; tooling/CSS prerequisites stay as plain notes). Source is the
  component file you paste. Usage is the call-site example. Each appears only when
  it has content; the self-contained **HTML** variant collapses Source and Usage
  into one. Copying the source is the core job, so each artifact has its own copy
  button.
- **Usage is generated, not authored — so the playground controls drive it
  (props→code).** A snippet's `meta.ts` carries a `usage` descriptor (tag +
  children) and `controls`; a per-framework renderer formats the current prop
  values into Vue / React / HTML syntax. Because it takes plain prop values,
  moving a control updates both the live preview and the copied Usage, and the
  same value substitution works for every variant's syntax. Source stays static
  (it is the file, not a call of it).
- **The framework + styling choice is a single persisted preference, set in the
  header and at the code block — never in the page head.** It is stored as the
  two **axes** (not a concrete variant id, which differs per snippet),
  persisted to `localStorage` + the URL (`?fw=&style=`), and resolved per snippet
  to the nearest available variant, falling back to the **reference variant**
  with a quiet note when the exact combo is absent.
- **Layout: the "Console".** A stacked docs page with sticky mini-headers (mono,
  1rem, hairline-underlined per the Mono-Heading Rule, with an amber tick), an
  IDE code block (Shiki highlighting, line numbers, wrap toggle, filename tab +
  copy feedback), and a right-hand **scroll-progress** TOC rail. Reduced-motion
  and visible focus states throughout.

## Considered options

- **Layout.** Round 1 compared Stacked / Workbench-toggle / Console-two-column;
  Stacked won. Round 2 explored three stacked treatments — Ledger (numbered ruled
  headings + left-border TOC rail), Slab (label-tag headings + boxed dot TOC,
  selector in the code bar), and **Console** (sticky headers + progress TOC + IDE
  blocks). Console was chosen. Numbered "01/02" section markers (Ledger) were
  explicitly dropped — [[Impeccable (design tooling)]]'s detector and reference
  flag numbered section scaffolding as an AI tell unless the order carries
  meaning, which here it doesn't.
- **Authoring Usage per variant vs generating it.** Authoring gives full control
  of wording but adds a file per variant and can't be driven live by the
  controls without a templating layer anyway. Generation from `meta` delivers
  props→code for free and keeps authoring in one place. Chosen.
- **One global selector vs per-section selectors vs page-head selector.** A single
  persisted preference (header + code block) is one source of truth; per-section
  tabs desync, and a page-head selector clutters the masthead. Chosen the former;
  the page head carries only breadcrumb + title.

## Consequences

- **`meta.ts` grew** `usage`, `controls`, `previewProps`, `previewClass`
  (`SnippetMeta` in `src/snippets/types.ts`); both snippets populate them. The
  detail components live in `src/detail/` (docs-only, never copied) with the
  generator (`usage.ts`), the assembled view (`view.ts`), the persisted store
  (`variantPref.ts`), Shiki (`highlighter.ts`), and the `SnippetDetail` island.
- **A live preview component can't cross Astro's JSON island boundary**, so the
  reference component is resolved island-side from a small `previews.ts` registry
  keyed by snippet name; the page passes only serialisable `meta` + raw sources.
- **`shiki` is a new dev dependency** (client-side highlighting for the
  live-updating Usage). A small concession to the lean ethos, accepted because
  reading/copying code is the core job; it is dev-only and never shipped to users.
- **The props controls use the custom "Terminal" control kit**
  ([[0010-prop-controls-kit]]), not native inputs: `src/detail/Controls.vue` maps
  each `meta.controls` spec to a kit `Slider` / `ColorList` / `Toggle` /
  `TextField`. This supersedes that ADR's `GradientTextPlayground` retrofit — that
  component was removed with the Console promotion, so the kit's first real
  consumer is the detail page. (Adds `lucide-vue-next`, used by the kit.)
- **Removed:** the old `SnippetTabs`, `GradientTextPlayground`, `ApiTable.astro`,
  `OnThisPage.astro`, and the throwaway `/demos` harness (trail in git +
  [[0008-design-directions-via-token-demo-harness]]). No-drift (ADR-0004/0005)
  still holds: the preview mounts the live reference; code blocks `?raw`-show the
  files.
- **Tokens are unchanged** — this is a layout/IA change on the confirmed
  amber-on-charcoal system, so [[0008-design-directions-via-token-demo-harness]]
  and the `@theme` stand. `DESIGN.md`'s component section was refreshed for the
  new TOC (progress rail), code block, and variant selector.
