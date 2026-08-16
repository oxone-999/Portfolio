import PropTypes from 'prop-types';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-rule/20 bg-paper-2 p-6 shadow-2xl">
        <p className="mb-2 text-xs font-display font-bold uppercase tracking-[0.3em] text-ch">
          Confirmation Required
        </p>
        <h2 className="mb-3 text-2xl font-display font-bold uppercase tracking-tight text-ink">
          {title}
        </h2>
        <p className="text-sm leading-7 text-ink-2">{message}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="rounded-2xl border border-rule/20 bg-paper px-4 py-2 text-sm font-display font-bold uppercase tracking-wide text-ink transition-colors hover:bg-paper-3"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="rounded-2xl bg-flag px-4 py-2 text-sm font-display font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ConfirmDialog.defaultProps = {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
};