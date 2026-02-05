import React from 'react';

export const Card = ({ children, title, actions, onClick, className = '', style = {}, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        ...style
      }}
      {...props}
    >
      {(title || actions) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          {title && (
            <h2 style={{ fontSize: '1.125rem' }}>{title}</h2>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};
