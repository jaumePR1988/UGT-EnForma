import React from 'react';
import Sidebar from '../components/layout/Sidebar';

const Settings = ({ onNavigate, toggleDarkMode }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="settings" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ajustes del Sistema</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Configuració general de l'aplicació i del compte</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Settings */}
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Perfil d'Usuari</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-400">
                                        JD
                                    </div>
                                    <button className="text-sm text-primary font-medium hover:underline">Canviar foto</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nom Complet</label>
                                        <input type="text" defaultValue="Joan Domènech" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Correu Electrònic</label>
                                        <input type="email" defaultValue="jdomenech@ugt.cat" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Notificacions</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-white text-sm">Avisos de nous cursos</p>
                                        <p className="text-xs text-slate-500">Rebre una notificació quan es publiqui un nou curs.</p>
                                    </div>
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-primary" />
                                        <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer checked:bg-primary"></label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-white text-sm">Resum setmanal</p>
                                        <p className="text-xs text-slate-500">Rebre un resum de l'activitat cada dilluns.</p>
                                    </div>
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input type="checkbox" name="toggle2" id="toggle2" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-primary" />
                                        <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer checked:bg-primary"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Informació del Sistema</h2>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-slate-500">Versió</span>
                                    <span className="font-mono text-slate-700 dark:text-slate-300">v2.4.0</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-500">Entorn</span>
                                    <span className="text-green-600 font-medium">Producció</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-500">Última actualització</span>
                                    <span className="text-slate-700 dark:text-slate-300">06/02/2026</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
