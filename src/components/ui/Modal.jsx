import React from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    if (!isOpen) return null;

    // Determine max width based on size prop
    const getMaxWidth = () => {
        switch (size) {
            case 'sm': return 'max-w-md';
            case 'lg': return 'max-w-4xl';
            case 'xl': return 'max-w-6xl';
            case 'full': return 'max-w-full m-4';
            case 'md':
            default: return 'max-w-2xl';
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            {/* Backdrop with blur and darker opacity */}
            <div
                className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal Panel */}
            <div className={`relative bg-white rounded-2xl shadow-2xl transform transition-all w-full ${getMaxWidth()} flex flex-col max-h-[90vh] overflow-hidden animate-scale-in`}>
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white truncate pr-4 tracking-tight">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-primary hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
                        aria-label="Close modal"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100/80 dark:border-slate-800/80 backdrop-blur-sm flex items-center justify-end gap-4 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    // Render to body/portal to avoid z-index stacking context issues
    return createPortal(modalContent, document.body);
};
