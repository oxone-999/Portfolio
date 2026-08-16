# Anuj Verma — Portfolio

React + Vite SPA, Tailwind v4, Supabase backend, deployed on Netlify.
All commands run from `frontend/`.

## Design direction: Signal Plate

An engineering plate, not a terminal. Ink on paper, hairline rules, a
marginal annotation rail beside each section, tabular figures. Serif display
type (Iowan Old Style / Palatino), system sans body, mono for data. No web
fonts — everything is system-resident.

**Two lenses, one board.** The portfolio has two identities and the accent
colour encodes which one you're reading:

- `/` — **systems** lens (SDE), teal channel. The default landing.
- `/3d` — **craft** lens (3D), ochre channel.

The lens is a **route**, not UI state, so each identity is linkable and
shareable. `data-lens` on `<html>` rebinds `--color-ch`.

### Non-negotiables

- **Never fabricate evidence.** No invented metrics, fake percentages,
  decorative fake source code, or unverifiable proficiency scores. An
  unmeasured metric renders as a visibly dashed empty slot — that is the
  design working, not a bug to paper over.
- **Theme at token level only.** Never use `dark:` utilities. Colours are
  defined in three blocks in `src/index.css` (`:root`, the
  `prefers-color-scheme` media query guarded with `:not([data-theme="light"])`,
  and `:root[data-theme="dark"]`) so all three viewer states resolve.
  A colour defined only inside a media or `[data-theme]` block is a bug.
- **One styling system.** Tailwind utilities driven by the tokens in
  `src/index.css`. No CSS Modules, no hardcoded `zinc-*`/hex values in
  components.

## Content pipeline

`frontend/content/portfolio.json` is the **single source of truth**.
Everything else is generated from it.

```
content/portfolio.json
   ├─ npm run content:check   validate offline (slugs, required fields)
   ├─ npm run content:diff    preview what would change on the live site
   ├─ npm run content:push    apply to Supabase (prompts, then verifies)
   ├─ npm run content:pull    Supabase → JSON (after admin-portal edits)
   ├─ npm run content:seed    regenerate supabase/seed.sql
   └─ npm run resume:build    regenerate public/resume.html
```

The résumé follows Anuj's existing CV structure: header, a Status/Skills/
Interests/Activities block, then Summary, Synopsis, Experience,
Accomplishments, Activities and Hobbies, Languages, Education. It is
generated — never hand-edit `public/resume.html`. For a PDF, open
`/resume.html` and print to PDF; don't check in a stale one.

Do not edit Supabase directly, do not hand-edit `supabase/seed.sql`, and do
not add per-type asset files. Edit the JSON and push.

**Line endings:** content is normalised to LF on both sides of the diff.
Without that, Windows CRLF in the database produces phantom diffs on every
project. See `normalizeText` in `scripts/lib/content.mjs`.

### Adding content

Use the **portfolio-curator** agent (`.claude/agents/portfolio-curator.md`).
It edits the JSON, validates, shows a diff, and waits for approval before
pushing. Anuj rarely uses the admin portal — the agent is the main path.

## Architecture

| Path | Role |
|---|---|
| `src/utils/lens.js` | Lens ↔ route mapping, slugs, per-lens copy |
| `src/components/Plate.jsx` | Layout primitives: `Page`, `Section`, `Metric`, `Tag` |
| `src/content/index.js` | Bundled fallback, derived from the JSON |
| `src/services/portfolioContent.js` | Supabase read/write for content |
| `src/services/auth.js` | Supabase Auth; no client-side signup by design |
| `netlify/functions/contact.js` | Contact form → Resend |

Case studies are **routed pages** (`/work/:slug`), never modals — they must
stay linkable and indexable.

## Working log

A private lab notebook that becomes public proof on promotion.

| `kind` | Visibility |
|---|---|
| `shipped` | Public — renders on `/log` |
| `learning`, `read`, `note` | Private drafts, Anuj only |

`sourceKind` survives promotion so the public log can badge an entry
"From a read" / "From learning".

**Privacy is enforced by RLS, not by the UI.** `supabase/schema.sql` grants
anon `select` on the log only `using (kind = 'shipped')` — drafts are
unreadable through the public API, not merely hidden client-side. Never
widen that policy to `using (true)`.

Because everything public is a dated, past-tense record, the page cannot go
stale: if Anuj stops writing it shows less, rather than showing an
out-of-date claim. That is deliberate — it is why there is no standing
"currently learning" list.

Existing projects need `supabase/migrations/001_add_log.sql` run once.

## Environment

`frontend/.env.local` (gitignored):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Content **writes** additionally need one of these, also in `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=            # server-side only, never expose to client
# or
SUPABASE_ADMIN_EMAIL=
SUPABASE_ADMIN_PASSWORD=
```

Netlify Functions need `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` set in
the Netlify dashboard.

The admin account is provisioned from the Supabase dashboard
(Authentication → Users), deliberately — there is no signup flow, so the
write path can't be self-served by anyone who finds the hidden route.

## Verifying

`npm run build` and `npm run lint` must both pass. There is no test suite;
verify UI changes by running the app and driving it, not by assuming.
Playwright is not a project dependency — install it in a scratch directory
if you need a headless browser.
