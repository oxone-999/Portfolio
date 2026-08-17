import { useMemo, useState } from 'react';

/**
 * Recreation of the extension's popup — the whole of its UI.
 *
 * Rebuilt from popup.html / popup.js / popup.css rather than screenshotted, and
 * restyled through this site's tokens instead of the original's hardcoded greys
 * and greens, because nothing here hardcodes a colour.
 *
 * What's real, read from the source: the panel is 30rem wide with the four
 * sections in this order (heading, date selector, scrolling domain list,
 * proportional share strip, "Top Five Tabs"); each list row is a favicon slot,
 * the domain, and a time pill; the strip is one segment per domain sized as that
 * domain's share of the selected day; the top five is that day's domains sorted
 * by time and cut to five.
 *
 * Flaws deliberately preserved, because they are what the UI was:
 *   - the favicon slot is empty — the line that set its src is commented out,
 *     and the element is still created, so every row renders a blank box
 *   - every duration is hours to three decimals, so a short visit reads 0.026 h
 *   - the domain list is in storage-key order, not sorted by time
 *   - a domain with no time on the selected date still renders, at 0.000 h
 *   - `newtab` appears as a website, because the domain is taken as a URL
 *     hostname and chrome://newtab/ has one
 *   - the dates are offered in the order the extension produces them — a
 *     lexicographic sort of locale date strings, so 1/2/2024 comes before
 *     9/16/2023 — and the popup opens on the first of those rather than today
 *
 * Flaws not reproduced, because they would only read as this recreation being
 * broken: re-selecting a date in the real popup appends a second chart and five
 * more top-five rows instead of replacing them, and the top-five container's
 * styling never applies because the stylesheet targets it as a class while the
 * markup gives it an id. Both are described in the implementation layer.
 *
 * All durations below are sample values.
 */

/** In the order the extension itself offers them: `.sort()` on locale strings. */
const DATES = ['1/2/2024', '9/16/2023', '9/17/2023'];

/** Storage shape: one key per domain, holding a day → seconds map. */
const STORE = [
  ['github.com', { '9/16/2023': 4210, '9/17/2023': 2680, '1/2/2024': 1520 }],
  ['youtube.com', { '9/16/2023': 1180, '9/17/2023': 3960, '1/2/2024': 640 }],
  ['stackoverflow.com', { '9/16/2023': 920, '9/17/2023': 410, '1/2/2024': 0 }],
  ['newtab', { '9/16/2023': 260, '9/17/2023': 145, '1/2/2024': 95 }],
  ['news.ycombinator.com', { '9/16/2023': 0, '9/17/2023': 780, '1/2/2024': 210 }],
  ['mail.google.com', { '9/16/2023': 340, '9/17/2023': 220, '1/2/2024': 1240 }],
];

/** The original's only format: seconds → hours, three decimals. */
const asHours = (s) => `${(s / 3600).toFixed(3)} h`;

/** The original picks a fresh random hex per bar per render, so colour carries
 *  no information while still changing. Graded channel opacity is the
 *  token-safe stand-in; the write-up covers why the original is worse. */
const SHADE = [0.85, 0.62, 0.46, 0.34, 0.24, 0.16];

export default function TimeTrackerPopup() {
  const [date, setDate] = useState(DATES[0]);

  const { rows, total, topFive } = useMemo(() => {
    const r = STORE.map(([domain, byDay]) => [domain, byDay[date] || 0]);
    const t = r.reduce((acc, [, s]) => acc + s, 0);
    const five = [...r].sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { rows: r, total: t, topFive: five };
  }, [date]);

  return (
    <figure className="my-8">
      <div className="flex justify-center border border-rule bg-paper-3 p-6">
        {/* 30rem is the popup's real width, from popup.css */}
        <div className="w-full max-w-[30rem] border border-rule bg-paper-2 p-5">
          <h1 className="font-display text-[20px] font-semibold text-ink">Time Spent</h1>

          <div className="mt-3 flex items-center gap-2">
            <label
              htmlFor="ttp-date"
              className="font-data text-[10px] uppercase tracking-[0.07em] text-ink-3"
            >
              Select Date:
            </label>
            <select
              id="ttp-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-rule bg-paper px-1.5 py-0.5 font-data text-[11px] text-ink"
            >
              {DATES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* #domain-list — 10rem tall and scrolling, in storage-key order */}
          <ul className="mt-3 h-40 divide-y divide-rule-soft overflow-y-auto border border-rule-soft">
            {rows.map(([domain, seconds]) => (
              <li key={domain} className="flex items-center justify-between gap-2 px-2.5 py-2">
                <span className="flex min-w-0 items-center gap-2">
                  {/* the favicon element, with no src — as shipped */}
                  <span
                    aria-hidden="true"
                    title="favicon element with no src"
                    className="inline-block h-5 w-5 shrink-0 border border-dashed border-ink-3 opacity-50"
                  />
                  <span className="truncate font-data text-[11.5px] text-ink">{domain}</span>
                </span>
                <span className="shrink-0 bg-ch-soft px-2 py-1 font-data text-[11px] font-semibold text-ch">
                  {asHours(seconds)}
                </span>
              </li>
            ))}
          </ul>

          {/* #chart — one segment per domain, sized as its share of the day */}
          <div className="mt-4 flex h-16 w-full overflow-hidden border border-rule bg-paper">
            {rows.map(([domain, seconds], i) => {
              const pct = total ? (seconds / total) * 100 : 0;
              if (!pct) return null;
              return (
                <span
                  key={domain}
                  className="group relative block bg-ch"
                  style={{ width: `${pct}%`, opacity: SHADE[i % SHADE.length] }}
                >
                  <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border border-rule bg-paper-2 px-1.5 py-0.5 font-data text-[9.5px] text-ink group-hover:block">
                    {domain}
                  </span>
                </span>
              );
            })}
          </div>

          <h2 className="mt-4 font-data text-[11px] font-bold uppercase tracking-[0.07em] text-ink-2">
            Top Five Tabs
          </h2>

          <div className="mt-2 space-y-1.5">
            {topFive.map(([domain, seconds]) => (
              <div
                key={domain}
                className="flex items-center justify-between border border-rule-soft bg-paper px-2.5 py-1.5"
              >
                <span className="truncate font-data text-[11px] text-ink">{domain}</span>
                <span className="shrink-0 font-data text-[11px] text-ink-2">
                  {asHours(seconds)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        Recreation of the popup at its real 30rem width — section order, row
        anatomy, the share strip and the top-five cut are taken from popup.html,
        popup.js and popup.css. Durations are sample values. Six flaws are
        preserved rather than tidied: the favicon slot is empty because the line
        setting it is commented out; every duration is hours to three decimals;
        the list is in storage order rather than sorted; a domain with no time
        that day still renders at 0.000 h; <code>newtab</code> is counted as a
        website; and the dates are in the extension&apos;s own lexicographic
        order, opening on 1/2/2024 rather than today.
      </figcaption>
    </figure>
  );
}
