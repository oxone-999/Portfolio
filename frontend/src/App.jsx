import { useEffect, Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import Work from './components/Work';
import CaseStudy from './components/CaseStudy';
import About from './components/About';
import Contact from './components/Contact';
import Log from './components/Log';
import ErrorBoundary from './components/ErrorBoundary';
import { Page, Eyebrow } from './components/Plate';

// Split out of the main bundle: the auth/CRUD UI (and its Supabase writer
// surface) has no reason to ship to every visitor of the public site.
const AdminPortal = lazy(() => import('./components/AdminPortal'));
import { ADMIN_ROUTE } from './utils/constants';
import { setIdentity } from './store/identitySlice';
import { lensFromPath, LENS_COPY, CRAFT } from './utils/lens';
import { usePortfolioContentLoader } from './hooks/usePortfolioContentLoader';

/**
 * The lens lives in the URL. This keeps three things in step with it:
 * the `data-lens` attribute that rebinds the channel accent, the Redux
 * mirror the admin portal reads, and the document title.
 */
function LensSync() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const lens = lensFromPath(pathname);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-lens',
      lens === CRAFT ? 'craft' : 'systems',
    );
    dispatch(setIdentity(lens));
  }, [lens, dispatch]);

  useEffect(() => {
    document.title = LENS_COPY[lens].title;
  }, [lens]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function NotFound() {
  return (
    <Page>
      <Eyebrow>404</Eyebrow>
      <h1 className="mb-5 text-[clamp(34px,6vw,58px)] leading-[1.02]">
        No plate at this address
      </h1>
      <p className="mb-8 max-w-[52ch] text-lg text-ink-2">
        The page you asked for isn&apos;t here. It may have moved during the
        rebuild — the work index is the best place to pick the thread back up.
      </p>
      <Link
        to="/work"
        className="inline-block border border-ch px-5 py-2.5 font-data text-[11px] uppercase tracking-[0.1em] text-ch transition-colors hover:bg-ch hover:text-paper"
      >
        Go to work
      </Link>
    </Page>
  );
}

function LensRoutes() {
  return (
    <>
      <Route index element={<Home />} />
      <Route path="work" element={<Work />} />
      <Route path="work/:slug" element={<CaseStudy />} />
      <Route path="log" element={<Log />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
    </>
  );
}

function AppContent() {
  usePortfolioContentLoader();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <LensSync />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-ch focus:bg-paper focus:px-4 focus:py-2 focus:font-data focus:text-[11px] focus:uppercase focus:tracking-[0.1em] focus:text-ch"
      >
        Skip to content
      </a>
      <NavBar />
      <div id="content" className="flex-grow">
        <ErrorBoundary>
          <Routes>
            <Route path="/">{LensRoutes()}</Route>
            <Route path="/3d">{LensRoutes()}</Route>
            <Route
              path={ADMIN_ROUTE}
              element={
                <Suspense fallback={null}>
                  <AdminPortal />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
