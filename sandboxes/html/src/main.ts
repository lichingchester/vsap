import "./style.css";
import {
  entries,
  groupedEntries,
  type HtmlEntry,
  type Variant,
} from "./discover";

const app = document.getElementById("app")!;

// ── sidebar ────────────────────────────────────────────────────────────────
const side = document.createElement("aside");
side.className = "sb-side";
side.innerHTML = `<div class="sb-brand">html <span>sandbox</span></div>`;
for (const g of groupedEntries()) {
  const grp = document.createElement("div");
  grp.className = "sb-group";
  const title = document.createElement("div");
  title.className = "sb-group-title";
  title.textContent = g.title;
  grp.appendChild(title);
  for (const e of g.items) {
    const btn = document.createElement("button");
    btn.className = "sb-item";
    btn.dataset.variant = e.key;
    btn.textContent = e.variant.label;
    btn.addEventListener("click", () => select(e.key));
    grp.appendChild(btn);
  }
  side.appendChild(grp);
}
if (entries.length === 0) {
  const empty = document.createElement("div");
  empty.className = "sb-group-title";
  empty.textContent = "no html variants found";
  side.appendChild(empty);
}

// ── main / stage ─────────────────────────────────────────────────────────────
const head = document.createElement("header");
head.className = "sb-head";

const stage = document.createElement("section");
stage.className = "sb-stage";
stage.dataset.mount = ""; // [data-mount] — the smoke test's assertion target
const frame = document.createElement("iframe");
frame.className = "sb-frame";
frame.title = "preview";
stage.appendChild(frame);

const prereq = document.createElement("footer");
prereq.className = "sb-prereq";
prereq.hidden = true;

const main = document.createElement("main");
main.className = "sb-main";
main.append(head, stage, prereq);

app.append(side, main);

// ── wrap a fragment in a minimal document so inline/CDN <script> executes ────
function documentFor(fragment: string, title: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    html, body { margin: 0; height: 100%; }
    body {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 4rem 2rem;
      background: #0e0e11;
      color: #ececf1;
      font-family: system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body>
${fragment}
</body>
</html>`;
}

function renderPrereqs(prereqs: Variant["prerequisites"]): string {
  const items = (prereqs ?? [])
    .map((p) => {
      const parts: string[] = [];
      if (p.npm)
        parts.push(`<code>npm i ${p.npm}${p.version ? "@" + p.version : ""}</code>`);
      if (p.cdn) parts.push(`<code>${p.cdn}</code>`);
      if (p.note) parts.push(`<span class="sb-prereq-note">${p.note}</span>`);
      return `<li>${parts.join(" ")}</li>`;
    })
    .join("");
  return `<span class="sb-prereq-label">Prerequisites</span><ul>${items}</ul>`;
}

function select(key: string) {
  const e: HtmlEntry | undefined = entries.find((x) => x.key === key);

  for (const b of side.querySelectorAll<HTMLElement>(".sb-item")) {
    b.classList.toggle("is-active", b.dataset.variant === key);
  }

  const url = new URL(location.href);
  if (e) url.searchParams.set("variant", key);
  else url.searchParams.delete("variant");
  history.replaceState(null, "", url);

  if (!e) {
    head.innerHTML = "";
    frame.removeAttribute("srcdoc");
    prereq.hidden = true;
    return;
  }

  head.innerHTML =
    `<div class="sb-head-title">` +
    `<span class="sb-title">${e.snippet.title}</span>` +
    `<span class="sb-variant">${e.variant.label}</span>` +
    `<code class="sb-entry">${e.variant.entry}</code>` +
    `</div>`;
  frame.srcdoc = documentFor(e.html, e.snippet.title);

  const ps = e.variant.prerequisites ?? [];
  if (ps.length) {
    prereq.hidden = false;
    prereq.innerHTML = renderPrereqs(ps);
  } else {
    prereq.hidden = true;
  }
}

// ── initial selection from ?variant= (deep-link contract for the smoke test) ──
const initial = new URLSearchParams(location.search).get("variant");
if (initial && entries.some((e) => e.key === initial)) {
  select(initial);
} else {
  head.innerHTML = `<div class="sb-head-title"><span class="sb-variant">Select a variant&nbsp;→</span></div>`;
}
