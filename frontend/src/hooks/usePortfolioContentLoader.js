import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPortfolioContent, setContentStatus } from '../store/adminSlice';
import { fetchPortfolioContent } from '../services/portfolioContent';

/**
 * Runs once at the app root. Bundled defaults are already in the store
 * (see adminSlice's initialState), so the site renders immediately either
 * way — this just swaps in live Supabase content when it arrives.
 */
export function usePortfolioContentLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;
    dispatch(setContentStatus('loading'));

    fetchPortfolioContent()
      .then((content) => {
        if (!cancelled) dispatch(setPortfolioContent(content));
      })
      .catch((error) => {
        console.error('Failed to load portfolio content from Supabase.', error);
        if (!cancelled) dispatch(setContentStatus('error'));
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);
}
