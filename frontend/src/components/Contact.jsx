import { useState } from 'react';
import { Page, Section, Eyebrow } from './Plate';
import { SYSTEMS } from '../utils/lens';
import { useLens } from '../hooks/useLens';

const EMAIL = 'anujverma11062002@gmail.com';
const ENDPOINT = '/.netlify/functions/contact';

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Tell me who you are.';
  if (!email.trim()) errors.email = 'I need an address to reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
    errors.email = 'That address is missing something — check the domain.';
  if (message.trim().length < 20)
    errors.message = 'A little more detail helps me give a useful reply.';
  return errors;
}

export default function Contact() {
  const lens = useLens();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | failed

  const set = (key) => (event) => {
    setForm((f) => ({ ...f, [key]: event.target.value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setState('sending');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lens }),
      });
      if (!response.ok) throw new Error(`Endpoint returned ${response.status}`);
      setState('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form failed to send.', error);
      setState('failed');
    }
  }

  const field =
    'w-full border border-rule bg-paper-2 px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ch';
  const label =
    'mb-1.5 block font-data text-[10px] uppercase tracking-[0.1em] text-ink-3';

  return (
    <Page>
      <header>
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mb-5 max-w-[16ch] text-[clamp(34px,5.6vw,56px)] leading-[1.02]">
          {lens === SYSTEMS ? 'Start a conversation' : 'Commission work'}
        </h1>
        <p className="max-w-[54ch] text-[18px] leading-relaxed text-ink-2">
          {lens === SYSTEMS
            ? 'Hiring, or want the architecture detail behind any of these systems? The tradeoffs are more interesting than the diagrams.'
            : 'Tell me the engine, the poly budget and the deadline, and I’ll tell you honestly whether I’m the right person.'}
        </p>
      </header>

      <Section label="Message" note="Goes straight to my inbox.">
        {state === 'sent' ? (
          <div className="border-l-2 border-good bg-paper-2 px-5 py-4">
            <p className="mb-1 font-data text-[10px] uppercase tracking-[0.1em] text-good">
              Sent
            </p>
            <p className="text-[15px] text-ink-2">
              Thanks — I&apos;ll reply within a couple of days. If it&apos;s
              urgent,{' '}
              <a href={`mailto:${EMAIL}`} className="text-ch underline">
                email me directly
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="max-w-[46rem]">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={label} htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className={field}
                  value={form.name}
                  onChange={set('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name ? (
                  <p id="name-error" className="mt-1.5 font-data text-[11px] text-flag">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label className={label} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={field}
                  value={form.email}
                  onChange={set('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email ? (
                  <p id="email-error" className="mt-1.5 font-data text-[11px] text-flag">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <label className={label} htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows="7"
                className={`${field} resize-y leading-relaxed`}
                value={form.message}
                onChange={set('message')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message ? (
                <p id="message-error" className="mt-1.5 font-data text-[11px] text-flag">
                  {errors.message}
                </p>
              ) : null}
            </div>

            {state === 'failed' ? (
              <div className="mt-5 border-l-2 border-flag bg-flag-soft px-4 py-3.5">
                <p className="mb-1 font-data text-[10px] uppercase tracking-[0.1em] text-flag">
                  Didn&apos;t send
                </p>
                <p className="text-[14.5px] text-ink-2">
                  The form couldn&apos;t reach the server. Your message is still
                  in the box — try again, or{' '}
                  <a href={`mailto:${EMAIL}`} className="text-ch underline">
                    email me directly
                  </a>
                  .
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={state === 'sending'}
              className="mt-6 border border-ch px-6 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-ch transition-colors hover:bg-ch hover:text-paper disabled:opacity-50"
            >
              {state === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}
      </Section>

      <Section label="Direct" note="If forms aren't your thing.">
        <ul className="border-t border-rule">
          {[
            { label: 'Email', value: EMAIL, url: `mailto:${EMAIL}` },
            { label: 'GitHub', value: 'oxone-999', url: 'https://github.com/oxone-999' },
            {
              label: 'LinkedIn',
              value: 'anuj-verma-b430431b1',
              url: 'https://www.linkedin.com/in/anuj-verma-b430431b1/',
            },
            {
              label: 'ArtStation',
              value: 'anujverma',
              url: 'https://www.artstation.com/anujverma',
            },
          ].map((row) => (
            <li
              key={row.label}
              className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 border-b border-rule-soft py-3"
            >
              <span className="rail-label">{row.label}</span>
              <a
                href={row.url}
                target={row.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="min-w-0 truncate font-data text-[13px] text-ink transition-colors hover:text-ch"
              >
                {row.value}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}
