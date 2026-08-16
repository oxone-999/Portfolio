/**
 * Unlinked from any nav — this is what makes it "hidden" rather than secured.
 * Actual protection is Supabase Auth on the write path (see services/auth.js
 * and supabase/schema.sql's RLS policies), not the obscurity of this path.
 */
export const ADMIN_ROUTE = '/control-room/oxone-714-portfolio';
