import {
  Suspense,
  lazy,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { entries, groupedEntries, type SandboxEntry } from "./discover";

function readParam(): string | null {
  return new URLSearchParams(location.search).get("variant");
}

export default function App() {
  const [key, setKey] = useState<string | null>(readParam);
  const groups = useMemo(groupedEntries, []);
  const active = useMemo(
    () => entries.find((e) => e.key === key) ?? null,
    [key],
  );

  function select(k: string) {
    setKey(k);
    const url = new URL(location.href);
    url.searchParams.set("variant", k);
    history.replaceState(null, "", url);
  }

  return (
    <div className="sb">
      <aside className="sb-side">
        <div className="sb-brand">
          react <span>sandbox</span>
        </div>
        {groups.map((g) => (
          <div key={g.title} className="sb-group">
            <div className="sb-group-title">{g.title}</div>
            {g.items.map((e) => (
              <button
                key={e.key}
                data-variant={e.key}
                className={"sb-item" + (e.key === key ? " is-active" : "")}
                onClick={() => select(e.key)}
              >
                {e.variant.label}
              </button>
            ))}
          </div>
        ))}
        {entries.length === 0 && (
          <div className="sb-group-title">no react variants found</div>
        )}
      </aside>
      <main className="sb-main">
        {active ? (
          <VariantView entry={active} />
        ) : (
          <div className="sb-empty">Select a variant&nbsp;→</div>
        )}
      </main>
    </div>
  );
}

function VariantView({ entry }: { entry: SandboxEntry }) {
  const { snippet, variant } = entry;
  const [replay, setReplay] = useState(0);
  // A fresh lazy() per entry so each variant is a clean code-split chunk.
  const Comp = useMemo(
    () => lazy(entry.load as () => Promise<{ default: ComponentType<any> }>),
    [entry.key],
  );
  const previewProps = (snippet.previewProps ?? {}) as Record<string, unknown>;
  const children = snippet.usage?.children;
  const prereqs = variant.prerequisites ?? [];

  return (
    <>
      <header className="sb-head">
        <div className="sb-head-title">
          <span className="sb-title">{snippet.title}</span>
          <span className="sb-variant">{variant.label}</span>
          <code className="sb-entry">{variant.entry}</code>
        </div>
        {snippet.replayable && (
          <button className="sb-replay" onClick={() => setReplay((n) => n + 1)}>
            ↻ Replay
          </button>
        )}
      </header>

      <section className="sb-stage" data-mount>
        <Suspense fallback={<div className="sb-loading">loading…</div>}>
          {/* key bump remounts one-shot effects on Replay / variant change */}
          <div key={`${entry.key}:${replay}`} className={snippet.previewClass}>
            <Comp {...previewProps}>{children}</Comp>
          </div>
        </Suspense>
      </section>

      {prereqs.length > 0 && (
        <footer className="sb-prereq">
          <span className="sb-prereq-label">Prerequisites</span>
          <ul>
            {prereqs.map((p, i) => (
              <li key={i}>
                {p.npm && (
                  <code>
                    npm i {p.npm}
                    {p.version ? `@${p.version}` : ""}
                  </code>
                )}
                {p.cdn && <code>{p.cdn}</code>}
                {p.note && <span className="sb-prereq-note">{p.note}</span>}
              </li>
            ))}
          </ul>
        </footer>
      )}
    </>
  );
}
