import PropTypes from 'prop-types';

/**
 * Signal Plate layout primitives.
 *
 * The page is a measured plate: a narrow annotation rail runs down the left
 * with a hairline rule across the top of every section, and content sits in a
 * single column beside it. On small screens the rail folds up above the content.
 */

export function Page({ children, className = '' }) {
  return (
    <main className={`mx-auto w-full max-w-[1080px] px-6 pb-28 pt-28 ${className}`}>
      {children}
    </main>
  );
}
Page.propTypes = { children: PropTypes.node, className: PropTypes.string };

export function Section({ label, note, children, className = '' }) {
  return (
    <section className={`mt-16 grid items-start gap-4 md:grid-cols-[132px_minmax(0,1fr)] md:gap-8 ${className}`}>
      <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 border-rule pt-1 md:flex-col md:gap-2.5 md:border-t">
        {label ? <span className="rail-label text-ch">{label}</span> : null}
        {note ? (
          <p className="hidden text-[10.5px] leading-snug text-ink-3 md:block font-data">
            {note}
          </p>
        ) : null}
      </div>
      <div className="min-w-0 border-t border-rule pt-1 md:border-t-0">{children}</div>
    </section>
  );
}
Section.propTypes = {
  label: PropTypes.string,
  note: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

/**
 * A hero metric. Unmeasured values render visibly unfilled rather than
 * shipping an adjective — the design refuses to fake evidence.
 */
export function Metric({ figure, unit, label, source }) {
  const unfilled = figure === null || figure === undefined || figure === '';

  return (
    <div className="bg-paper-2 px-4 py-4">
      <span
        className={
          unfilled
            ? 'font-display text-[32px] font-semibold leading-none tracking-tight text-ink-3 border-b-2 border-dashed border-ch pb-0.5 inline-block'
            : 'font-display text-[32px] font-semibold leading-none tracking-tight text-ink data tabular-nums block'
        }
      >
        {unfilled ? '——' : figure}
        {!unfilled && unit ? (
          <span className="ml-1 font-data text-[13px] font-normal tracking-normal text-ink-3">
            {unit}
          </span>
        ) : null}
      </span>
      <span className="mt-2 block font-data text-[9.5px] uppercase tracking-[0.1em] text-ink-3">
        {label}
      </span>
      {source ? (
        <span className="mt-1.5 block font-data text-[9.5px] tracking-wide text-ch">
          {source}
        </span>
      ) : null}
    </div>
  );
}
Metric.propTypes = {
  figure: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  label: PropTypes.string.isRequired,
  source: PropTypes.string,
};

export function MetricRow({ children }) {
  return (
    <div className="grid gap-px border border-rule bg-rule [grid-template-columns:repeat(auto-fit,minmax(168px,1fr))]">
      {children}
    </div>
  );
}
MetricRow.propTypes = { children: PropTypes.node };

/** Status chip. Colour carries state, never decoration. */
export function Tag({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'text-ink-3 border-ink-3',
    channel: 'text-ch border-ch',
    active: 'text-flag border-flag',
    done: 'text-good border-good',
  };
  return (
    <span
      className={`inline-block border px-1.5 py-0.5 font-data text-[9px] uppercase tracking-[0.09em] ${tones[tone] || tones.neutral}`}
    >
      {children}
    </span>
  );
}
Tag.propTypes = { tone: PropTypes.string, children: PropTypes.node };

export function Eyebrow({ children }) {
  return (
    <div className="mb-5 flex items-center gap-2.5 font-data text-[11px] uppercase tracking-[0.16em] text-ch">
      {children}
      <span className="h-px flex-1 bg-rule" aria-hidden="true" />
    </div>
  );
}
Eyebrow.propTypes = { children: PropTypes.node };
