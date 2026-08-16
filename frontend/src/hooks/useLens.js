import { useLocation } from 'react-router-dom';
import { lensFromPath } from '../utils/lens';

/** The active lens, derived from the URL rather than from store state. */
export function useLens() {
  const { pathname } = useLocation();
  return lensFromPath(pathname);
}

export default useLens;
