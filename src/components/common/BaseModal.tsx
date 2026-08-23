import React from 'react';

export interface BaseModalProps {
  isOpen?: boolean;
  title: string;
  subtitle?: string;
  error?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

export default function BaseModal({
  isOpen = true,
  title,
  subtitle,
  error,
  isSubmitting = false,
  submitLabel = 'Save',
  submittingLabel = 'Saving...',
  onClose,
  onSubmit,
  children,
}: BaseModalProps) {
  if (!isOpen) {
    return null;
  }

  // const handleBackdropClick = () => {
  //   if (!isSubmitting) {
  //     onClose();
  //   }
  // };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs"
      // onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        className="bg-white w-full max-w-xl max-h-[90vh] rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 id="modal-title" className="text-base font-bold text-slate-900">
              {title}
            </h3>

            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Content Body / Form */}
        <form
          onSubmit={onSubmit}
          className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-73px)]"
        >
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700"
            >
              {error}
            </div>
          )}

          {children}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 border-t border-slate-100 pt-5 mt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 text-xs font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            {onSubmit && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {submittingLabel}
                  </>
                ) : (
                  submitLabel
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
