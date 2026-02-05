import React from 'react';

export const Table = ({ headers, children, className = '' }) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="table-container">
                <thead className="table-header">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                style={{
                                    textAlign: 'left',
                                    padding: '1rem 1.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748B',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
};

export const TableRow = ({ children, className = '', onClick }) => (
    <tr
        onClick={onClick}
        className={`table-row ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
        {children}
    </tr>
);

export const TableCell = ({ children, className = '' }) => (
    <td style={{ padding: '1rem 1.5rem' }} className={className}>
        {children}
    </td>
);
