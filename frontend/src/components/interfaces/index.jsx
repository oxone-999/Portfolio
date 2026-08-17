import PropTypes from 'prop-types';
import EdgeAppConsole from './EdgeAppConsole';
import SportsConsole from './SportsConsole';
import TimeTrackerPopup from './TimeTrackerPopup';

/**
 * UI recreations, keyed by name and referenced from a project's `uiPreview`
 * field — same registry pattern as `../diagrams`, for the same reason: kept
 * out of DOMPurify's sanitised body, free to read the site's live theme
 * tokens, and free to be genuinely interactive rather than a static image.
 */
const REGISTRY = {
  'edge-app-console': EdgeAppConsole,
  'sports-console': SportsConsole,
  'time-tracker-popup': TimeTrackerPopup,
};

export default function InterfacePreview({ name }) {
  if (!name) return null;
  const Component = REGISTRY[name];
  if (!Component) {
    console.warn(`No interface preview registered as "${name}".`);
    return null;
  }
  return <Component />;
}

InterfacePreview.propTypes = { name: PropTypes.string };
