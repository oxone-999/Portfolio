/**
 * Node-side Supabase client for the content scripts.
 *
 * Reads .env.local (or real env vars) itself — Vite's import.meta.env
 * doesn't exist outside the bundler.
 *
 * Writes need an authenticated session, because RLS only allows anon to
 * read. Provide either:
 *   SUPABASE_SERVICE_ROLE_KEY  — bypasses RLS, server-side only, never
 *                                commit it and never expose it to the client
 * or
 *   SUPABASE_ADMIN_EMAIL + SUPABASE_ADMIN_PASSWORD — signs in as your
 *                                admin user and writes through normal RLS
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { ROOT, normalizeText } from './content.mjs';

function loadEnvFile() {
  for (const name of ['.env.local', '.env']) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

loadEnvFile();

export const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
export const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.SUPABASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SUPABASE_ADMIN_PASSWORD;

export function assertConfigured() {
  if (!SUPABASE_URL || !ANON_KEY) {
    console.error(
      'Supabase is not configured.\n' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env.local',
    );
    process.exit(1);
  }
}

/** Read-only client. Anon key is enough — RLS allows public select. */
export function readClient() {
  assertConfigured();
  return createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Write client. Prefers the service-role key, else signs in as the admin user. */
export async function writeClient() {
  assertConfigured();

  if (SERVICE_KEY) {
    return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  }

  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await client.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    if (error) {
      console.error(`Could not sign in as ${ADMIN_EMAIL}: ${error.message}`);
      process.exit(1);
    }
    return client;
  }

  console.error(
    'Writing needs credentials. Add ONE of these to frontend/.env.local:\n\n' +
      '  SUPABASE_SERVICE_ROLE_KEY=...        (Project Settings -> API Keys)\n' +
      '  — or —\n' +
      '  SUPABASE_ADMIN_EMAIL=you@example.com\n' +
      '  SUPABASE_ADMIN_PASSWORD=...          (the user you created in Authentication)\n\n' +
      'Both are gitignored. Reads work without them.',
  );
  process.exit(1);
}

export const hasWriteCredentials = Boolean(
  SERVICE_KEY || (ADMIN_EMAIL && ADMIN_PASSWORD),
);

/**
 * The client to use for reading everything, including private log drafts.
 *
 * RLS lets anon read only `kind = 'shipped'` log rows. Diffing with the anon
 * key would therefore report every private draft as "removed" on the live
 * side. So prefer an authenticated session whenever credentials exist, and
 * say so plainly when they don't.
 */
export async function fullReadClient() {
  if (hasWriteCredentials) return writeClient();
  return readClient();
}

function isMissingTableError(error) {
  return (
    error?.code === 'PGRST205' ||
    error?.code === '42P01' ||
    /could not find the table|relation .* does not exist/i.test(error?.message || '')
  );
}

export async function fetchLiveRows(client) {
  const [projects, skills, journey, log] = await Promise.all([
    client.from('projects').select('*').order('lens').order('sort_order'),
    client.from('skills').select('*').order('lens').order('sort_order'),
    client.from('journey').select('*').order('sort_order'),
    client.from('log').select('*').order('entry_date', { ascending: false }),
  ]);

  for (const res of [projects, skills, journey]) {
    if (res.error) throw res.error;
  }
  // The log table may not exist yet on a project that hasn't run the
  // migration. PostgREST reports that as PGRST205 ("Could not find the table
  // ... in the schema cache"), not the raw Postgres "relation does not exist".
  // Treat it as empty rather than failing the whole read.
  if (log.error && !isMissingTableError(log.error)) {
    throw log.error;
  }

  // Normalise line endings on read so diffs compare markup, not whitespace.
  return {
    projects: projects.data.map((r) => ({
      ...r,
      description: normalizeText(r.description),
      content: normalizeText(r.content),
    })),
    skills: skills.data,
    journey: journey.data,
    log: (log.data || []).map((r) => ({ ...r, body: normalizeText(r.body) })),
    logTableMissing: Boolean(log.error),
  };
}
