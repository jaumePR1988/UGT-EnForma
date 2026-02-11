import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LogOut, User, Bell, ChevronDown } from 'lucide-react';

export const Header = () => {
    const { user, role, logout } = useAuth();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const getDisplayName = () => {
        if (!user) return t('common.guest', 'Convidat');
        return user.displayName || user.email.split('@')[0];
    };

    const getRoleLabel = () => {
        if (role === 'admin') return t('common.admin', 'Administrador');
        if (role === 'teacher') return t('common.teacher', 'Docent');
        return '';
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
                {/* Search area or page context could go here if needed in future */}
            </div>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="p-2 text-slate-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                </button>

                {/* Profile & Logout */}
                <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-black text-slate-900 leading-none">{getDisplayName()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{getRoleLabel()}</p>
                    </div>

                    <div className="group relative">
                        <button className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md">
                            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">
                                {getDisplayName().charAt(0).toUpperCase()}
                            </div>
                            <ChevronDown size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('header.user_account')}</p>
                                <p className="text-xs font-bold text-slate-600 truncate mt-1">{user?.email}</p>
                            </div>

                            <div className="p-2">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-primary rounded-xl transition-all">
                                    <User size={18} />
                                    {t('header.profile')}
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <LogOut size={18} />
                                    {t('header.logout')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
