# Distribution by web copy-paste, not jsrepo

The collection was distributed via the jsrepo CLI (`npx jsrepo add ...`), which copies snippet source into a user's project but requires a one-time `jsrepo.json` init and resolves per-snippet dependencies. We are dropping jsrepo entirely in favour of a plain web **"copy" button** on the site: the user copies source directly, with no CLI and no VSAP/tskr-specific setup.

The trade-off: we lose jsrepo's automatic dependency *resolution* and *version pinning*. Responsibility for installing the right packages (e.g. gsap, three) and tooling (Tailwind) shifts to the user, surfaced per-snippet via a **Prerequisites** block rather than promised away as "zero setup."

## Consequences

- `jsrepo-manifest.json` and `jsrepo-build-config.json` are retired.
- Every snippet must declare its Prerequisites (npm deps, assumed tooling, global CSS to add).
- The genuinely zero-setup path is the self-contained **native-CSS variant**, not the Tailwind reference.
