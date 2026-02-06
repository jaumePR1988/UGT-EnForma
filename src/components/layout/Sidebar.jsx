import React from 'react';

const Sidebar = ({ currentView, onNavigate, toggleDarkMode }) => {
    const navItems = [
        { id: 'dashboard', label: 'Tauler de Control', icon: 'dashboard' },
        { id: 'active-courses', label: 'Cursos Actius', icon: 'school' },
        { id: 'students', label: 'Alumnat', icon: 'people' },
        { id: 'certificates', label: 'Certificats', icon: 'assignment' },
        { id: 'reports', label: 'Informes', icon: 'analytics' },
        { id: 'calendar', label: 'Calendari', icon: 'calendar_month' }, // New
        { id: 'settings', label: 'Ajustes', icon: 'settings' },   // New
    ];

    return (
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
                            onNavigate(item.id);
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

            {/* Footer / Dark Mode Toggle */}
            <div className="p-4 border-t border-red-700/50 bg-red-800/20">
                <button
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                    onClick={toggleDarkMode}
                >
                    <span className="material-icons-outlined mr-3 text-xl">dark_mode</span>
                    Mode Nit
                </button>
                <div className="mt-4 text-center">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">UGT Catalunya © 2026</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
