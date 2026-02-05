import React from 'react';

const variants = {
    default: {
        backgroundColor: '#F1F5F9',
        color: '#475569'
    },
    primary: {
        backgroundColor: 'rgba(227, 6, 19, 0.1)',
        color: '#E30613'
    },
    success: {
        backgroundColor: '#DCFCE7',
        color: '#166534'
    },
    warning: {
        backgroundColor: '#FEF3C7',
        color: '#92400E'
    },
    danger: {
        backgroundColor: '#FEE2E2',
        color: '#991B1B'
    },
    outline: {
        backgroundColor: 'transparent',
        color: '#64748B',
        border: '1px solid #E2E8F0'
    }
};

export const Badge = ({ children, variant = 'default', className = '' }) => {
    const styles = variants[variant] || variants.default;

    return (
        <span
            className={`badge ${className}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                ...styles
            }}
        >
            {children}
        </span>
    );
};
