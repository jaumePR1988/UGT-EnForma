import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
    // Dark mode logic matching the reference's script behavior
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-card-light dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col">
            <div className="p-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">U</div>
                <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">UGT <span className="text-primary">Formació</span></span>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
                            : "flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    }
                >
                    <span className="material-icons-outlined mr-3">dashboard</span>
                    Tauler de Control
                </NavLink>

                <NavLink
                    to="/courses"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
                            : "flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    }
                >
                    <span className="material-icons-outlined mr-3">school</span>
                    Cursos Actius
                </NavLink>

                <NavLink
                    to="/students"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
                            : "flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    }
                >
                    <span className="material-icons-outlined mr-3">people</span>
                    Alumnat
                </NavLink>

                <NavLink
                    to="/attendance"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
                            : "flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    }
                >
                    <span className="material-icons-outlined mr-3">assignment</span>
                    Certificats
                </NavLink>

                <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
                            : "flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    }
                >
                    <span className="material-icons-outlined mr-3">analytics</span>
                    Informes
                </NavLink>
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    className="flex items-center w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={toggleDarkMode}
                >
                    <span className="material-icons-outlined mr-3">dark_mode</span>
                    Mode Nit
                </button>
            </div>
        </aside>
    );
};
