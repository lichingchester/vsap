# The setup section is Prerequisites, not Install — versioned, per-framework

The detail page's setup section was titled **Install** and, for any variant with
an npm **Prerequisite**, emitted a bare `npm i <pkg>`; tooling/CSS prerequisites
rendered as plain notes underneath the same heading
([[0011-detail-page-copy-artifact-model-and-console-layout]]). Three things were
wrong with that framing:

- **"Install" implies the component is installable.** tskr/ui is copy-paste —
  there is no package to `npm i`. A section titled *Install* with an `npm i` line
  reads as *"install the thing,"* the exact "no hidden dependencies, no implied
  install" that [[PRODUCT]] principle #3 forbids.
- **It mislabelled the notes.** [[CONTEXT]] already says tooling/CSS prerequisites
  *are not Install* — yet they lived under the "Install" heading.
- **A version-less `npm i gsap` is a thin setup guide, and it's meaningless for
  the HTML variant**, which pulls dependencies from a CDN, not npm.

We decided:

- **Rename the section Install → Prerequisites.** It names a *state the user
  checks* (what this snippet assumes you already have), not an *action they
  perform*. "Install" is demoted to the name of the copyable dependency command
  *inside* the section — the umbrella (Prerequisites) and the part (Install) now
  match the glossary instead of contradicting it.
- **Hide the section entirely when a variant needs nothing.** Absence of setup is
  communicated by absence of the section; the ad-hoc "No dependencies — self-
  contained" notes are deleted from metas (they were the only reason a
  needs-nothing variant rendered the section at all).
- **Dependency commands carry a known-good version, not a hard pin.**
  `npm i gsap@^3.12`, framed as the range the reference was written against. A new
  `version` field on `Prerequisite` feeds it. We deliberately do **not**
  reintroduce jsrepo-style exact pinning/resolution (dropped in
  [[0001-distribution-by-web-copy-paste]]): a hard `gsap@3.12.5` usually overstates
  the requirement and rots into a lie under manual upkeep, whereas a caret range /
  "written against" note stays true as the dependency patches.
- **Setup is per-framework.** npm (`npm i pkg@version`) for Vue/React; a CDN
  `<script>` line for the HTML variant, built from a new `cdn` field on
  `Prerequisite`. `renderInstall` selects the right form for the selected variant,
  so it never emits a bogus `npm i` under HTML. npm only — no pnpm/yarn/bun tabs
  (users translate `npm i` trivially).

## Consequences

- `Prerequisite` gains `version?` and `cdn?`. The rendered Install becomes an
  `{ code, lang, filename }` artifact so the HTML variant's `<script>` line is
  highlighted as HTML and the npm line as a terminal command.
- Metas must stop declaring "no dependencies" notes; a needs-nothing variant
  simply omits `prerequisites`.
- This refines [[0011-detail-page-copy-artifact-model-and-console-layout]]: Install
  is still a copy artifact, but nested under Prerequisites rather than a sibling
  section. It partially revisits [[0001-distribution-by-web-copy-paste]] — we bring
  back version *guidance*, never version *pinning/resolution*.
