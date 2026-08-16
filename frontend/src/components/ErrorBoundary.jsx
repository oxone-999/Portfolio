import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portfolio section failed to render.', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto w-full max-w-[1080px] px-6 pb-28 pt-32">
          <div className="max-w-[58ch] border-l-2 border-flag bg-flag-soft px-6 py-5">
            <p className="mb-2 font-data text-[10px] uppercase tracking-[0.1em] text-flag">
              Render failed
            </p>
            <h2 className="mb-3 font-display text-[26px] font-semibold leading-tight text-ink">
              This section couldn&apos;t load.
            </h2>
            <p className="text-[15px] leading-relaxed text-ink-2">
              Reload the page to try again. If it keeps failing, the content for
              this section is likely malformed — check the entry in the studio,
              or reset to defaults.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 border border-ch px-5 py-2 font-data text-[11px] uppercase tracking-[0.1em] text-ch transition-colors hover:bg-ch hover:text-paper"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
