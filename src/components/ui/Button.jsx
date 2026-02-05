import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    fullWidth = false,
    ...props
}) => {

    const sizeClasses = {
        sm: 'padding: 0.25rem 0.75rem; font-size: 0.75rem;',
        md: 'padding: 0.5rem 1rem; font-size: 0.875rem;',
        lg: 'padding: 0.75rem 1.5rem; font-size: 1rem;'
    };

    const variantClass = variant === 'ghost' ? 'btn-ghost' : 'btn-primary';

    const baseClass = `btn ${variantClass} ${className}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={baseClass}
            style={{
                width: fullWidth ? '100%' : 'auto',
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            {...props}
        >
            {children}
        </button>
    );
};
