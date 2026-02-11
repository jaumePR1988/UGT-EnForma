import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {/* Notification Portal / Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full sm:w-auto">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        {...notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

const NotificationItem = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="text-emerald-500" size={20} />,
        error: <AlertCircle className="text-rose-500" size={20} />,
        warning: <AlertTriangle className="text-amber-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-white dark:bg-slate-800 border-emerald-100 dark:border-emerald-900/30 shadow-emerald-500/10',
        error: 'bg-white dark:bg-slate-800 border-rose-100 dark:border-rose-900/30 shadow-rose-500/10',
        warning: 'bg-white dark:bg-slate-800 border-amber-100 dark:border-amber-900/30 shadow-amber-500/10',
        info: 'bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900/30 shadow-blue-500/10',
    };

    return (
        <div className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-xl animate-slide-in-right ${bgColors[type]}`}>
            <div className="mt-0.5">{icons[type]}</div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                    {type === 'success' ? 'Èxit' : type === 'error' ? 'Error' : type === 'warning' ? 'Atenció' : 'Informació'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
