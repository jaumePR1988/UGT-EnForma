import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { AlertTriangle, Trash2, Info, CheckCircle2 } from 'lucide-react';

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    cancelText,
    type = 'danger' // danger, warning, info, success
}) => {
    const { t } = useTranslation();
    const _confirmText = confirmText || t('common.save') || 'Confirmar';
    const _cancelText = cancelText || t('common.cancel') || 'Cancel·lar';
    const isDanger = type === 'danger';
    const isWarning = type === 'warning';

    // Choose icons and colors based on type
    const getTypeConfig = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <Trash2 size={32} strokeWidth={2.5} />,
                    iconBg: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
                    confirmBtn: 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-red-900/20',
                    accentColor: 'text-red-600 dark:text-red-400',
                    alertBg: 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300'
                };
            case 'warning':
                return {
                    icon: <AlertTriangle size={32} strokeWidth={2.5} />,
                    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                    confirmBtn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200 dark:shadow-amber-900/20',
                    accentColor: 'text-amber-600 dark:text-amber-400',
                    alertBg: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-300'
                };
            case 'info':
                return {
                    icon: <Info size={32} strokeWidth={2.5} />,
                    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                    confirmBtn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/20',
                    accentColor: 'text-blue-600 dark:text-blue-400',
                    alertBg: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-300'
                };
            case 'success':
                return {
                    icon: <CheckCircle2 size={32} strokeWidth={2.5} />,
                    iconBg: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                    confirmBtn: 'bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-green-900/20',
                    accentColor: 'text-green-600 dark:text-green-400',
                    alertBg: 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300'
                };
            default:
                return {
                    icon: <Info size={32} strokeWidth={2.5} />,
                    iconBg: 'bg-slate-50 text-slate-600',
                    confirmBtn: 'bg-primary hover:bg-red-700',
                    accentColor: 'text-primary',
                    alertBg: 'bg-slate-50 border-slate-100 text-slate-800'
                };
        }
    };

    const config = getTypeConfig();

    const footer = (
        <>
            <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
                {_cancelText}
            </button>
            <button
                onClick={() => {
                    onConfirm();
                    onClose();
                }}
                className={`px-8 py-2.5 text-sm font-black text-white rounded-xl transition-all shadow-lg active:scale-95 ${config.confirmBtn}`}
            >
                {_confirmText}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={footer}
            size="sm"
        >
            <div className="flex flex-col items-center text-center py-6">
                {/* Modern Glass Icon Background with Premium Glow */}
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-sm border ${config.iconBg} border-white/20 relative overflow-hidden group scale-110`}>
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors duration-500"></div>
                    {/* Animated Glow */}
                    <div className={`absolute -inset-1 rounded-full blur-2xl opacity-20 animate-pulse ${config.accentColor.replace('text-', 'bg-')}`}></div>
                    <div className="relative z-10 animate-scale-in">
                        {config.icon}
                    </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                    {title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xs mx-auto mb-6">
                    {description}
                </p>

                {isDanger && (
                    <div className={`w-full p-4 rounded-2xl border ${config.alertBg} flex items-start gap-3 text-left animate-slide-up`}>
                        <div className="mt-1">
                            <AlertTriangle size={16} className="text-red-500 shrink-0" strokeWidth={3} />
                        </div>
                        <p className="text-xs font-bold leading-normal">
                            {t('confirm.irreversible')}
                        </p>
                    </div>
                )}

                {isWarning && !isDanger && (
                    <div className={`w-full p-4 rounded-2xl border ${config.alertBg} flex items-start gap-3 text-left animate-slide-up`}>
                        <div className="mt-1">
                            <Info size={16} className="text-amber-500 shrink-0" strokeWidth={3} />
                        </div>
                        <p className="text-xs font-bold leading-normal">
                            {t('confirm.review_data')}
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
