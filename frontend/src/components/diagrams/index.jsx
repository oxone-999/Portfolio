import PropTypes from 'prop-types';
import EventExchangePipeline from './EventExchangePipeline';
import EdgeViolationPipeline from './EdgeViolationPipeline';
import MultilingualStreamPipeline from './MultilingualStreamPipeline';
import ConsoleTemplatePipeline from './ConsoleTemplatePipeline';
import ReconMetamodelPipeline from './ReconMetamodelPipeline';
import CodeSearchIndexPipeline from './CodeSearchIndexPipeline';
import AppSpecCodegenPipeline from './AppSpecCodegenPipeline';
import SessionAttributionTimeline from './SessionAttributionTimeline';
import GdeltRiskRadarPipeline from './GdeltRiskRadarPipeline';
import CcwcSinglePassScan from './CcwcSinglePassScan';

/**
 * Diagrams are React components keyed by name, referenced from a project's
 * `diagram` field rather than embedded in its sanitised HTML body.
 *
 * That keeps them out of DOMPurify's way (which strips <svg>), lets them read
 * the site's theme tokens directly, and lets them honour prefers-reduced-motion
 * — none of which is possible for an <img>-referenced SVG.
 */
const REGISTRY = {
  'event-exchange-pipeline': EventExchangePipeline,
  'edge-violation-pipeline': EdgeViolationPipeline,
  'multilingual-stream-pipeline': MultilingualStreamPipeline,
  'console-template-pipeline': ConsoleTemplatePipeline,
  'recon-metamodel-pipeline': ReconMetamodelPipeline,
  'code-search-index-pipeline': CodeSearchIndexPipeline,
  'app-spec-codegen-pipeline': AppSpecCodegenPipeline,
  'session-attribution-timeline': SessionAttributionTimeline,
  'gdelt-risk-radar-pipeline': GdeltRiskRadarPipeline,
  'ccwc-single-pass-scan': CcwcSinglePassScan,
};

export default function Diagram({ name }) {
  if (!name) return null;
  const Component = REGISTRY[name];
  if (!Component) {
    console.warn(`No diagram registered as "${name}".`);
    return null;
  }
  return <Component />;
}

Diagram.propTypes = { name: PropTypes.string };
