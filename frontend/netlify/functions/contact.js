/**
 * Contact form handler.
 *
 * Set these in Netlify -> Site settings -> Environment variables:
 *   RESEND_API_KEY   an API key from resend.com (free tier is plenty)
 *   CONTACT_TO       where messages land
 *   CONTACT_FROM     a verified sender on your domain, e.g. site@anujverma.dev
 *
 * Until those exist the endpoint returns 503 and the form falls back to
 * showing the direct email address, so nothing silently swallows a message.
 */

const MAX = { name: 120, email: 200, message: 5000 };

function clean(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  );
}

export async function handler(event) {
  const json = (status, body) => ({
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.error('Contact function is missing required environment variables.');
    return json(503, { error: 'Mail is not configured yet.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Malformed request body.' });
  }

  const name = clean(payload.name, MAX.name);
  const email = clean(payload.email, MAX.email);
  const message = clean(payload.message, MAX.message);
  const lens = payload.lens === '3D' ? '3D' : 'Systems';

  if (!name || !email || message.length < 20) {
    return json(400, { error: 'Name, a valid email and a message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json(400, { error: 'That email address is not valid.' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: email,
      subject: `[${lens}] Portfolio enquiry from ${name}`,
      html: `
        <p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
        <p><em>Lens: ${lens}</em></p>
        <hr />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    }),
  });

  if (!response.ok) {
    console.error('Resend rejected the message.', await response.text());
    return json(502, { error: 'Mail provider rejected the message.' });
  }

  return json(200, { ok: true });
}
