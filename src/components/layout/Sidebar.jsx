import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ currentView, onNavigate }) => {
    const { t, i18n } = useTranslation();
    const { isAdmin, isTeacher } = useAuth();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ca' ? 'es' : 'ca';
        i18n.changeLanguage(newLang);
    };

    const allItems = [
        { id: 'dashboard', label: t('sidebar.dashboard', 'Tauler de Control'), icon: 'dashboard', roles: ['admin'] },
        { id: 'active-courses', label: t('sidebar.active_courses', 'Cursos Actius'), icon: 'school', roles: ['admin'] },
        { id: 'students', label: t('sidebar.students', 'Alumnat'), icon: 'people', roles: ['admin'] },
        { id: 'certificates', label: t('sidebar.certificates', 'Certificats'), icon: 'assignment', roles: ['admin'] },
        { id: 'reports', label: t('sidebar.reports', 'Informes'), icon: 'analytics', roles: ['admin'] },
        { id: 'teachers', label: t('sidebar.teachers', 'Docència'), icon: 'co_present', roles: ['admin', 'teacher'] },
        { id: 'calendar', label: t('sidebar.calendar', 'Calendari'), icon: 'calendar_month', roles: ['admin', 'teacher'] },
        { id: 'users', label: t('sidebar.users', 'Usuaris'), icon: 'admin_panel_settings', roles: ['admin'] },
        { id: 'settings', label: t('sidebar.settings', 'Ajustes'), icon: 'settings', roles: ['admin'] }
    ];

    const navItems = allItems.filter(item =>
        (isAdmin && item.roles.includes('admin')) ||
        (isTeacher && item.roles.includes('teacher'))
    );

    return (
        <>
            {/* Mobile Header with Language Switcher */}
            <div className="lg:hidden bg-[#E30613] text-white p-4 flex justify-between items-center shadow-md mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center p-1">
                        <img src="/logo-ugt.png" alt="UGT" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">UGT <span className="opacity-80 font-normal">Formació</span></span>
                </div>
                <button
                    onClick={toggleLanguage}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors backdrop-blur-sm border border-white/10"
                >
                    {i18n.language === 'ca' ? 'ES' : 'CA'}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#E30613] text-white border-r border-[#E30613] z-50 hidden lg:flex flex-col shadow-xl">
                {/* Header */}
                <div className="p-6 flex items-center gap-3 border-b border-red-700/50">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center p-1">
                        <img src="/logo-ugt.png" alt="UGT" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white">UGT <span className="opacity-80 font-normal">Formació</span></span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (onNavigate) onNavigate(item.id);
                            }}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${currentView === item.id
                                ? 'bg-white text-[#E30613] font-bold shadow-md'
                                : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
                                }`}
                        >
                            <span className={`material-icons-outlined mr-3 text-2xl transition-colors ${currentView === item.id ? 'text-[#E30613]' : 'text-white/80 group-hover:text-white'
                                }`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Footer / Language Switcher */}
                <div className="p-4 border-t border-red-700/50 bg-red-800/20">
                    <button
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                        onClick={toggleLanguage}
                    >
                        <span className="material-icons-outlined mr-3 text-xl">translate</span>
                        {i18n.language === 'ca' ? 'Castellano' : 'Català'}
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">UGT Catalunya © 2026</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
