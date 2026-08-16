import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmDialog from './ConfirmDialog';
import { setPortfolioContent } from '../store/adminSlice';
import { getSession, onAuthStateChange, signIn, signOut } from '../services/auth';
import {
  deleteJourneyEntry,
  deleteProject,
  deleteSkill,
  fetchPortfolioContent,
  reseedFromBundledDefaults,
  saveJourneyEntry,
  saveProject,
  saveSkill,
} from '../services/portfolioContent';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const createProjectDraft = () => ({
  id: '',
  name: '',
  status: 'Completed',
  description: '',
  content: '',
  skillsText: '',
});

const createSkillDraft = () => ({ id: '', name: '', url: '' });

const createJourneyDraft = () => ({
  id: '',
  type: 'job',
  typeLabel: 'Full-time',
  title: '',
  organization: '',
  duration: '',
  logo: '',
});

const parseSkills = (value) =>
  value
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

/** Not-configured notice — shown instead of the whole portal. */
function NotConfigured() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 pb-24 pt-32">
      <p className="mb-2 font-data text-[10px] uppercase tracking-[0.1em] text-flag">
        Supabase not configured
      </p>
      <h1 className="mb-4 font-display text-[32px] font-semibold text-ink">
        The studio needs a backend
      </h1>
      <p className="text-[15px] leading-relaxed text-ink-2">
        Set <code className="font-data text-[13px]">VITE_SUPABASE_URL</code> and{' '}
        <code className="font-data text-[13px]">VITE_SUPABASE_ANON_KEY</code> in
        your environment, run <code className="font-data text-[13px]">supabase/schema.sql</code>{' '}
        in the Supabase SQL editor, and create an admin user under
        Authentication → Users. Until then the public site runs on the
        bundled default content and this portal stays locked.
      </p>
    </main>
  );
}

export default function AdminPortal() {
  if (!isSupabaseConfigured) return <NotConfigured />;
  return <AdminPortalConnected />;
}

function AdminPortalConnected() {
  const dispatch = useDispatch();
  const content = useSelector((state) => state.admin.content);

  const [authStatus, setAuthStatus] = useState('checking'); // checking | out | in
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const [activeSection, setActiveSection] = useState('projects');
  const [activeMode, setActiveMode] = useState('SDE');
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [projectDraft, setProjectDraft] = useState(createProjectDraft());
  const [skillDraft, setSkillDraft] = useState(createSkillDraft());
  const [journeyDraft, setJourneyDraft] = useState(createJourneyDraft());
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    onConfirm: null,
  });

  useEffect(() => {
    getSession()
      .then((session) => setAuthStatus(session ? 'in' : 'out'))
      .catch(() => setAuthStatus('out'));
    return onAuthStateChange((session) => setAuthStatus(session ? 'in' : 'out'));
  }, []);

  const projectItems = useMemo(() => content.projects?.[activeMode] || [], [content.projects, activeMode]);
  const skillItems = useMemo(() => content.skills?.[activeMode] || [], [content.skills, activeMode]);
  const journeyItems = useMemo(() => content.journey || [], [content.journey]);

  const openConfirmation = ({ title, message, confirmLabel = 'Confirm', onConfirm }) => {
    setConfirmState({ isOpen: true, title, message, confirmLabel, onConfirm });
  };

  const closeConfirmation = () =>
    setConfirmState({ isOpen: false, title: '', message: '', confirmLabel: 'Confirm', onConfirm: null });

  const handleConfirmedAction = () => {
    const action = confirmState.onConfirm;
    closeConfirmation();
    if (action) action();
  };

  const showFeedback = (message, tone = 'success') => setFeedback({ message, tone });

  const resetDrafts = () => {
    setProjectDraft(createProjectDraft());
    setSkillDraft(createSkillDraft());
    setJourneyDraft(createJourneyDraft());
  };

  /** Every mutation refetches from Supabase after it settles — the DB is the
   * single source of truth, so the admin view can't drift from what
   * visitors see. */
  async function refresh() {
    const fresh = await fetchPortfolioContent();
    dispatch(setPortfolioContent(fresh));
  }

  async function withBusy(action, successMessage) {
    setBusy(true);
    try {
      await action();
      await refresh();
      if (successMessage) showFeedback(successMessage);
    } catch (error) {
      console.error('Admin action failed.', error);
      showFeedback(error.message || 'That action failed. Nothing was saved.', 'flag');
    } finally {
      setBusy(false);
    }
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');

    if (!email.trim() || !password) {
      setAuthError('Enter both an email and a password.');
      return;
    }

    setAuthBusy(true);
    try {
      await signIn(email.trim(), password);
      setPassword('');
    } catch (error) {
      setAuthError(error.message || 'Sign-in failed.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = () => {
    openConfirmation({
      title: 'Log out of the studio?',
      message: 'This ends your Supabase session on this device.',
      confirmLabel: 'Log out',
      onConfirm: async () => {
        await signOut();
        showFeedback('Signed out.', 'info');
      },
    });
  };

  const handleProjectSave = (event) => {
    event.preventDefault();
    if (!projectDraft.name.trim() || !projectDraft.description.trim()) {
      showFeedback('Project name and short description are required.', 'flag');
      return;
    }

    withBusy(
      () =>
        saveProject({
          id: projectDraft.id || undefined,
          mode: activeMode,
          name: projectDraft.name,
          status: projectDraft.status,
          description: projectDraft.description,
          content: projectDraft.content,
          skills: parseSkills(projectDraft.skillsText),
        }),
      `Project saved for ${activeMode} mode.`,
    );
    setProjectDraft(createProjectDraft());
  };

  const handleSkillSave = (event) => {
    event.preventDefault();
    if (!skillDraft.name.trim()) {
      showFeedback('Skill name is required.', 'flag');
      return;
    }

    withBusy(
      () => saveSkill({ id: skillDraft.id || undefined, mode: activeMode, name: skillDraft.name, url: skillDraft.url }),
      `Skill saved for ${activeMode} mode.`,
    );
    setSkillDraft(createSkillDraft());
  };

  const handleJourneySave = (event) => {
    event.preventDefault();
    if (!journeyDraft.title.trim() || !journeyDraft.duration.trim()) {
      showFeedback('Journey title and duration are required.', 'flag');
      return;
    }

    withBusy(() => saveJourneyEntry({ id: journeyDraft.id || undefined, ...journeyDraft }), 'Journey entry saved.');
    setJourneyDraft(createJourneyDraft());
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = 'portfolio-content.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(downloadUrl);
    showFeedback('Portfolio data exported as JSON.');
  };

  const feedbackTone = feedback?.tone || 'success';
  const feedbackClass =
    feedbackTone === 'flag'
      ? 'border-flag bg-flag-soft text-flag'
      : feedbackTone === 'info'
        ? 'border-ch bg-ch-soft text-ch'
        : 'border-good bg-ch-soft text-good';

  if (authStatus === 'checking') {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-6 pb-24 pt-32">
        <p className="font-data text-[11px] uppercase tracking-[0.1em] text-ink-3">Checking session…</p>
      </main>
    );
  }

  if (authStatus === 'out') {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 pb-24">
        <p className="mb-2 font-data text-[10px] uppercase tracking-[0.14em] text-ch">Studio</p>
        <h1 className="mb-4 font-display text-[32px] font-semibold text-ink">Sign in</h1>
        <p className="mb-8 text-[14.5px] text-ink-2">
          One admin account, provisioned from the Supabase dashboard. There is no
          signup here by design.
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              className="w-full border border-rule bg-paper-2 px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block font-data text-[10px] uppercase tracking-[0.1em] text-ink-3">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              className="w-full border border-rule bg-paper-2 px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-ch"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {authError ? <p className="font-data text-[11px] text-flag">{authError}</p> : null}
          <button
            type="submit"
            disabled={authBusy}
            className="border border-ch px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-ch transition-colors hover:bg-ch hover:text-paper disabled:opacity-50"
          >
            {authBusy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </main>
    );
  }

  const renderInventory = () => {
    const items = activeSection === 'projects' ? projectItems : activeSection === 'skills' ? skillItems : journeyItems;

    return (
      <div className="space-y-2.5">
        {items.map((item) => (
          <article key={item.id} className="border border-rule bg-paper p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-data text-[13px] font-medium text-ink">
                  {item.name || item.title}
                </h3>
                <p className="mt-0.5 font-data text-[10px] uppercase tracking-[0.09em] text-ch">
                  {item.status || item.typeLabel || ''}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  className="border border-rule px-2.5 py-1.5 font-data text-[10px] uppercase tracking-[0.08em] text-ink transition-colors hover:border-ch hover:text-ch"
                  onClick={() => {
                    if (activeSection === 'projects') {
                      setProjectDraft({
                        id: item.id,
                        name: item.name,
                        status: item.status,
                        description: item.description,
                        content: item.content || '',
                        skillsText: (item.skills || []).join(', '),
                      });
                    } else if (activeSection === 'skills') {
                      setSkillDraft({ id: item.id, name: item.name, url: item.url || '' });
                    } else {
                      setJourneyDraft(item);
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="border border-flag px-2.5 py-1.5 font-data text-[10px] uppercase tracking-[0.08em] text-flag transition-colors hover:bg-flag-soft"
                  onClick={() =>
                    openConfirmation({
                      title: `Delete this ${activeSection === 'journey' ? 'entry' : activeSection.slice(0, -1)}?`,
                      message: `${item.name || item.title} will be removed for every visitor immediately.`,
                      confirmLabel: 'Delete',
                      onConfirm: () => {
                        const remover =
                          activeSection === 'projects'
                            ? () => deleteProject(item.id)
                            : activeSection === 'skills'
                              ? () => deleteSkill(item.id)
                              : () => deleteJourneyEntry(item.id);
                        withBusy(remover, `Deleted ${item.name || item.title}.`);
                      },
                    })
                  }
                >
                  Delete
                </button>
              </div>
            </div>
            {item.description ? <p className="mt-2 text-[13px] leading-snug text-ink-2">{item.description}</p> : null}
          </article>
        ))}
        {items.length === 0 ? (
          <p className="border border-rule bg-paper p-4 text-[13.5px] text-ink-2">Nothing here yet.</p>
        ) : null}
      </div>
    );
  };

  const field =
    'w-full border border-rule bg-paper px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-ch';
  const label = 'mb-1.5 block font-data text-[10px] uppercase tracking-[0.09em] text-ink-3';

  const renderEditor = () => {
    if (activeSection === 'projects') {
      return (
        <form onSubmit={handleProjectSave} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={label}>Name</label>
              <input className={field} value={projectDraft.name} onChange={(e) => setProjectDraft((d) => ({ ...d, name: e.target.value }))} />
            </div>
            <div>
              <label className={label}>Status</label>
              <select className={field} value={projectDraft.status} onChange={(e) => setProjectDraft((d) => ({ ...d, status: e.target.value }))}>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>
          <div>
            <label className={label}>Short description</label>
            <textarea rows="3" className={field} value={projectDraft.description} onChange={(e) => setProjectDraft((d) => ({ ...d, description: e.target.value }))} />
          </div>
          <div>
            <label className={label}>Skills (comma-separated)</label>
            <input className={field} placeholder="React, Node.js, Kafka" value={projectDraft.skillsText} onChange={(e) => setProjectDraft((d) => ({ ...d, skillsText: e.target.value }))} />
          </div>
          <div>
            <label className={label}>Case study body (HTML, sanitised before render)</label>
            <textarea rows="12" className={`${field} font-data text-[13px]`} value={projectDraft.content} onChange={(e) => setProjectDraft((d) => ({ ...d, content: e.target.value }))} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={busy} className="border border-ch bg-ch px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-paper disabled:opacity-50">
              {busy ? 'Saving…' : 'Save project'}
            </button>
            <button type="button" className="border border-rule px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-ink" onClick={() => setProjectDraft(createProjectDraft())}>
              Clear
            </button>
          </div>
        </form>
      );
    }

    if (activeSection === 'skills') {
      return (
        <form onSubmit={handleSkillSave} className="space-y-4">
          <div>
            <label className={label}>Name</label>
            <input className={field} value={skillDraft.name} onChange={(e) => setSkillDraft((d) => ({ ...d, name: e.target.value }))} />
          </div>
          <div>
            <label className={label}>Icon URL</label>
            <input className={field} placeholder="/images/react.png" value={skillDraft.url} onChange={(e) => setSkillDraft((d) => ({ ...d, url: e.target.value }))} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={busy} className="border border-ch bg-ch px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-paper disabled:opacity-50">
              {busy ? 'Saving…' : 'Save skill'}
            </button>
            <button type="button" className="border border-rule px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-ink" onClick={() => setSkillDraft(createSkillDraft())}>
              Clear
            </button>
          </div>
        </form>
      );
    }

    return (
      <form onSubmit={handleJourneySave} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Type label</label>
            <input className={field} value={journeyDraft.typeLabel} onChange={(e) => setJourneyDraft((d) => ({ ...d, typeLabel: e.target.value }))} />
          </div>
          <div>
            <label className={label}>Duration</label>
            <input className={field} placeholder="2024 - Present" value={journeyDraft.duration} onChange={(e) => setJourneyDraft((d) => ({ ...d, duration: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className={label}>Title</label>
          <input className={field} value={journeyDraft.title} onChange={(e) => setJourneyDraft((d) => ({ ...d, title: e.target.value }))} />
        </div>
        <div>
          <label className={label}>Organization</label>
          <input className={field} value={journeyDraft.organization} onChange={(e) => setJourneyDraft((d) => ({ ...d, organization: e.target.value }))} />
        </div>
        <div>
          <label className={label}>Logo URL</label>
          <input className={field} value={journeyDraft.logo} onChange={(e) => setJourneyDraft((d) => ({ ...d, logo: e.target.value }))} />
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busy} className="border border-ch bg-ch px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-paper disabled:opacity-50">
            {busy ? 'Saving…' : 'Save entry'}
          </button>
          <button type="button" className="border border-rule px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-ink" onClick={() => setJourneyDraft(createJourneyDraft())}>
            Clear
          </button>
        </div>
      </form>
    );
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1200px] px-6 pb-24 pt-28">
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={handleConfirmedAction}
        onCancel={closeConfirmation}
      />

      <div className="mb-8 flex flex-col gap-4 border-b border-rule pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 font-data text-[10px] uppercase tracking-[0.14em] text-ch">Studio</p>
          <h1 className="font-display text-[34px] font-semibold text-ink">Content</h1>
          <p className="mt-2 max-w-[52ch] text-[14px] text-ink-2">
            Changes here write straight to Supabase and are live for every
            visitor immediately — there is no separate publish step.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className="border border-rule px-4 py-2 font-data text-[10px] uppercase tracking-[0.09em] text-ink" onClick={handleExport}>
            Export JSON
          </button>
          <button
            type="button"
            className="border border-flag px-4 py-2 font-data text-[10px] uppercase tracking-[0.09em] text-flag"
            onClick={() =>
              openConfirmation({
                title: 'Reseed from bundled defaults?',
                message:
                  'This deletes every project, skill and journey entry currently live and replaces them with the data baked into this build. This affects what every visitor sees, immediately, and cannot be undone from here.',
                confirmLabel: 'Reseed',
                onConfirm: () => {
                  resetDrafts();
                  withBusy(reseedFromBundledDefaults, 'Reseeded from bundled defaults.');
                },
              })
            }
          >
            Reseed defaults
          </button>
          <button type="button" className="border border-ch bg-ch px-4 py-2 font-data text-[10px] uppercase tracking-[0.09em] text-paper" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {feedback ? (
        <div className={`mb-6 border px-4 py-3 font-data text-[12.5px] ${feedbackClass}`}>{feedback.message}</div>
      ) : null}

      <div className="flex flex-col gap-4 border-b border-rule pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'projects', label: 'Projects' },
            { id: 'skills', label: 'Skills' },
            { id: 'journey', label: 'Journey' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              className={`border px-3.5 py-1.5 font-data text-[10.5px] uppercase tracking-[0.09em] ${
                activeSection === s.id ? 'border-ch bg-ch text-paper' : 'border-rule text-ink-2'
              }`}
              onClick={() => setActiveSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        {activeSection !== 'journey' ? (
          <div className="flex gap-2">
            {['SDE', '3D'].map((mode) => (
              <button
                key={mode}
                type="button"
                className={`border px-3.5 py-1.5 font-data text-[10.5px] uppercase tracking-[0.09em] ${
                  activeMode === mode ? 'border-ch bg-ch text-paper' : 'border-rule text-ink-2'
                }`}
                onClick={() => setActiveMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="border border-rule bg-paper-2 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-data text-[10px] uppercase tracking-[0.09em] text-ch">Inventory</span>
            <button
              type="button"
              className="border border-rule px-3 py-1 font-data text-[10px] uppercase tracking-[0.08em] text-ink"
              onClick={() => {
                if (activeSection === 'projects') setProjectDraft(createProjectDraft());
                else if (activeSection === 'skills') setSkillDraft(createSkillDraft());
                else setJourneyDraft(createJourneyDraft());
              }}
            >
              Add new
            </button>
          </div>
          <div className="max-h-[60vh] space-y-2.5 overflow-y-auto">{renderInventory()}</div>
        </div>

        <div className="border border-rule bg-paper-2 p-5">
          <span className="font-data text-[10px] uppercase tracking-[0.09em] text-ch">Editor</span>
          <div className="mt-4">{renderEditor()}</div>
        </div>
      </div>
    </main>
  );
}
