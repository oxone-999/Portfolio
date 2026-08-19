import { useEffect, useRef, useState } from 'react';

/**
 * Recreation of the app's whole UI — one window, four controls.
 *
 * Rebuilt from `app.py` rather than screenshotted, and restyled through this
 * site's tokens instead of the original's Segoe UI / Consolas / #2d7d46, because
 * nothing on this site hardcodes a colour. The client's name is removed from the
 * window title; everything else is what the Tk window actually contains.
 *
 * What's real, read from the source:
 *   - the window is 680x460 with the controls in this order: a bold heading, a
 *     one-line two-step instruction, a read-only path field beside a
 *     "Choose folder…" button, a determinate progress bar, a log pane, and the
 *     Run button beneath it
 *   - the path field starts on the literal string "(no folder selected)"
 *   - Run with no folder chosen pops a warning rather than doing nothing
 *   - the pipeline runs on a worker thread and reports back through a queue that
 *     the UI polls every 150 ms, which is why the log fills progressively
 *     instead of arriving all at once
 *   - the eleven progress lines and their percentages are the `_progress(...)`
 *     calls in `run_pipeline`, in order, verbatim
 *   - the log line format is `[{pct:3d}%] {msg}`
 *   - on success it writes a log file, prints the DONE summary, opens the output
 *     folder with os.startfile, and shows a modal
 *   - the two error paths are the ones `_friendly_error` special-cases: a source
 *     file missing, and a workbook still open in Excel
 *
 * A flaw preserved, because it is what the program does: the log file is written
 * *before* the DONE summary and output path are appended to the pane, so no
 * archived log contains the result of its own run. The nine logs in the app
 * folder all stop at the "Utilization:" line, which is how this was noticed
 * rather than guessed. Choosing "write log" below shows what lands on disk.
 *
 * The completion figures are sample values for that reason — the app has run
 * every month since January, and not one of those runs recorded its own leave
 * count. The leave total shown is the source feed's row count, which is the
 * number that line reports; the backfill count is invented and labelled.
 */

/** The `_progress(...)` ladder from run_pipeline, in source order. */
const STEPS = [
  [3, 'Discovering source files…'],
  [8, 'Loading workbooks…'],
  [20, 'Enriching HR (tenure, salary, department)…'],
  [28, 'Backfilling missing (terminated) employees from past data…'],
  [38, 'Building work-schedule lookup…'],
  [48, 'Building daily absence detail + # of events…'],
  [60, 'Computing period violations…'],
  [68, 'Rolling up to leave level…'],
  [74, 'Building summaries…'],
  [82, 'Writing styled Analysis + Utilization workbooks…'],
  [92, 'Archiving this month into past_data…'],
  [100, 'Done.'],
];

/** The folder the real runs point at, with the client's name taken out. */
const SOURCE = 'D:/…/present';
const OUT = 'D:/…/output/202606';

/** What the visitor can make happen — the three outcomes app.py handles. */
const OUTCOMES = [
  ['ok', 'Succeeds'],
  ['missing', 'A source file is missing'],
  ['locked', 'A workbook is open in Excel'],
];

/** `_friendly_error` — its exact wording, minus the appended exception text. */
const ERRORS = {
  missing: [
    'Could not find one of the 4 required source files in that folder:',
    '  • HRDATA  • Daily Absence  • Leave Details  • Work Schedule',
  ],
  locked: ['A workbook is open/locked (probably in Excel). Close it and run again.'],
};

/** Where each outcome stops. Discovery fails first; the write fails at 82%. */
const STOP_AT = { ok: STEPS.length, missing: 1, locked: 10 };

const pad = (n) => String(n).padStart(3, ' ');

export default function LeaveRefreshRunner() {
  const [folder, setFolder] = useState(null);
  const [outcome, setOutcome] = useState('ok');
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);
  const [warned, setWarned] = useState(false);
  const [wrote, setWrote] = useState(false);
  const logRef = useRef(null);

  /* The real UI polls its worker queue every 150 ms; this advances on the same
     interval so the log fills at the rate the original's does. */
  useEffect(() => {
    if (!running) return undefined;
    const limit = STOP_AT[outcome];
    if (step >= limit) {
      setRunning(false);
      if (outcome !== 'ok') setFailed(true);
      return undefined;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 150);
    return () => clearTimeout(t);
  }, [running, step, outcome]);

  /* `failed` and the completion block are appended after the last step, so
     scrolling on `step` alone would leave them below the fold. */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [step, running, failed]);

  const start = () => {
    if (!folder) {
      setWarned(true);
      return;
    }
    setWarned(false);
    setFailed(false);
    setWrote(false);
    setStep(0);
    setRunning(true);
  };

  const reset = () => {
    setStep(0);
    setRunning(false);
    setFailed(false);
    setWrote(false);
  };

  const pct = step === 0 ? 0 : STEPS[Math.min(step, STEPS.length) - 1][0];
  const done = !running && step >= STEPS.length && outcome === 'ok';

  return (
    <figure className="my-8">
      <div className="border border-rule bg-paper-3 p-6">
        {/* 680x460 is the real geometry, from root.geometry("680x460") */}
        <div className="mx-auto w-full max-w-[42.5rem] border border-rule bg-paper-2 p-4">
          <h3 className="text-center font-display text-[17px] font-semibold text-ink">
            Intermittent FMLA — Monthly Run
          </h3>
          <p className="mt-1 text-center font-data text-[10px] text-ink-3">
            1) Choose the folder with this month&rsquo;s 4 source files. &nbsp; 2) Click Run.
          </p>

          <div className="mt-3 flex items-stretch gap-2">
            <div
              className="flex-1 truncate border border-rule bg-paper px-2 py-1 font-data text-[11px] text-ink-3"
              title={folder || undefined}
            >
              {folder || '(no folder selected)'}
            </div>
            <button
              type="button"
              onClick={() => {
                setFolder(SOURCE);
                setWarned(false);
                reset();
              }}
              className="border border-rule bg-paper px-2.5 py-1 font-data text-[11px] text-ink transition-colors hover:border-ch hover:text-ch"
            >
              Choose folder…
            </button>
          </div>

          {/* ttk.Progressbar, determinate, maximum=100 */}
          <div className="mt-3 h-3 w-full border border-rule bg-paper">
            <div
              className="h-full bg-ch transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* the Text pane — Consolas 9, height 14 */}
          <div
            ref={logRef}
            className="mt-3 h-[13rem] overflow-y-auto border border-rule bg-paper p-2 font-data text-[10.5px] leading-[1.5] text-ink"
          >
            {step === 0 && !failed ? (
              <p className="text-ink-3">
                {running ? '' : 'The log fills here, one line per stage.'}
              </p>
            ) : null}

            {step > 0 ? <p>Source: {folder}</p> : null}

            {STEPS.slice(0, step).map(([p, msg]) => (
              <p key={p}>
                [{pad(p)}%] {msg}
              </p>
            ))}

            {failed ? (
              <p className="mt-1 text-[color:var(--color-flag)]">ERROR — see popup.</p>
            ) : null}

            {done ? (
              <>
                <p className="mt-2">Analysis: {OUT}/Intermittent_FMLA_Analysis_202606.xlsx</p>
                <p>Utilization: {OUT}/Intermittent_FMLA_Utilization_Trend_202606.xlsx</p>
                {/* Everything below this line is appended AFTER the log file is
                    written, which is why no archived log contains it. */}
                <p className="mt-2 text-[color:var(--color-good)]">
                  DONE — month 202606 | leaves 1,738 | backfilled emps 6
                </p>
                <p className="text-[color:var(--color-good)]">Output: {OUT}</p>
              </>
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={running ? undefined : start}
              disabled={running}
              className={`border px-6 py-1 font-data text-[11px] tracking-wide transition-colors ${
                running
                  ? 'cursor-default border-rule bg-paper text-ink-3 opacity-70'
                  : 'border-ch bg-ch text-paper hover:opacity-90'
              }`}
            >
              {running ? 'Running…' : 'Run'}
            </button>
            {done || failed ? (
              <button
                type="button"
                onClick={reset}
                className="border border-rule bg-paper px-3 py-1 font-data text-[11px] text-ink transition-colors hover:border-ch hover:text-ch"
              >
                Clear
              </button>
            ) : null}
          </div>

          {/* messagebox.showwarning — Run pressed with no folder chosen */}
          {warned ? (
            <div className="mt-3 border border-flag bg-flag-soft px-3 py-2">
              <p className="font-data text-[10px] uppercase tracking-[0.07em] text-flag">
                Pick a folder
              </p>
              <p className="mt-1 font-data text-[11px] text-ink">
                Choose the source-file folder first.
              </p>
            </div>
          ) : null}

          {/* messagebox.showerror, worded by _friendly_error */}
          {failed ? (
            <div className="mt-3 border border-flag bg-flag-soft px-3 py-2">
              <p className="font-data text-[10px] uppercase tracking-[0.07em] text-flag">
                Run failed
              </p>
              {ERRORS[outcome].map((line) => (
                <p key={line} className="mt-1 whitespace-pre font-data text-[11px] text-ink">
                  {line}
                </p>
              ))}
            </div>
          ) : null}

          {/* messagebox.showinfo, plus the os.startfile that opens the folder */}
          {done ? (
            <div className="mt-3 border border-ch bg-ch-soft px-3 py-2">
              <p className="font-data text-[10px] uppercase tracking-[0.07em] text-ch">Done</p>
              <p className="mt-1 font-data text-[11px] text-ink">
                Finished month 202606. Files in: {OUT}
              </p>
              <p className="mt-1 font-data text-[10px] text-ink-3">
                The real app also opens that folder in Explorer at this point.
              </p>
            </div>
          ) : null}
        </div>

        {/* ---- controls that belong to the recreation, not to the app ---- */}
        <div className="mx-auto mt-4 flex w-full max-w-[42.5rem] flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-3">
          <span className="font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
            Make it
          </span>
          {OUTCOMES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setOutcome(key);
                reset();
              }}
              className={`border px-2 py-0.5 font-data text-[10.5px] transition-colors ${
                outcome === key
                  ? 'border-ch bg-ch text-paper'
                  : 'border-rule bg-paper text-ink hover:border-ch hover:text-ch'
              }`}
            >
              {label}
            </button>
          ))}

          {done ? (
            <button
              type="button"
              onClick={() => setWrote((v) => !v)}
              className="ml-auto border border-rule bg-paper px-2 py-0.5 font-data text-[10.5px] text-ink transition-colors hover:border-ch hover:text-ch"
            >
              {wrote ? 'Hide the log file' : 'Show what the log file saved'}
            </button>
          ) : null}
        </div>

        {/* The preserved flaw, made visible rather than described. */}
        {done && wrote ? (
          <div className="mx-auto mt-3 w-full max-w-[42.5rem] border border-flag bg-paper p-3">
            <p className="font-data text-[10px] uppercase tracking-[0.07em] text-flag">
              run_202606_&lt;timestamp&gt;.log — as written to disk
            </p>
            <div className="mt-2 font-data text-[10.5px] leading-[1.5] text-ink-3">
              <p>Source: {folder}</p>
              {STEPS.map(([p, msg]) => (
                <p key={`f:${p}`}>
                  [{pad(p)}%] {msg}
                </p>
              ))}
              <p className="mt-2">Analysis: {OUT}/Intermittent_FMLA_Analysis_202606.xlsx</p>
              <p>Utilization: {OUT}/Intermittent_FMLA_Utilization_Trend_202606.xlsx</p>
            </div>
            <p className="mt-2 font-data text-[10px] uppercase tracking-[0.07em] text-flag">
              The DONE line is missing — the file is written before it is appended
            </p>
            <p className="mt-1 font-data text-[10px] text-ink-3">
              So no archived run records its own leave count or backfill total. All nine
              logs in the app folder stop exactly here.
            </p>
          </div>
        ) : null}
      </div>

      <figcaption className="mt-2.5 font-data text-[10px] uppercase tracking-[0.07em] text-ink-3">
        A recreation, not a capture — rebuilt from <code>app.py</code> and
        restyled through this site&rsquo;s tokens, with the client&rsquo;s name
        removed from the window title. The control order, the geometry, the
        &ldquo;(no folder selected)&rdquo; placeholder, the twelve progress lines
        and their percentages, the log format and both error wordings are the
        program&rsquo;s own. Paths are elided and the completion figures are
        sample values: the leave total is the source feed&rsquo;s row count, the
        backfill count is invented, and neither can be quoted from a real run —
        because the log file is written before those lines are appended, which is
        the flaw the last control demonstrates.
      </figcaption>
    </figure>
  );
}
