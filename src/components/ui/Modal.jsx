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
            <div className={`relative bg-white rounded-2xl shadow-2xl transform transition-all w-full ${getMaxWidth()} flex flex-col max-h-[90vh] overflow-hidden`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-slate-900 truncate pr-4">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    // Render to body/portal to avoid z-index stacking context issues
    return createPortal(modalContent, document.body);
};
