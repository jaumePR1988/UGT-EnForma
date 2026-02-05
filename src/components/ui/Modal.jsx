import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '1rem'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    width: '100%',
                    maxWidth: '550px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            color: '#94A3B8',
                            padding: '0.5rem',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    padding: '1.5rem',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        borderTop: '1px solid #E5E7EB',
                        backgroundColor: '#F9FAFB',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem'
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
