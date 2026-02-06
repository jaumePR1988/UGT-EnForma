import React from 'react';
import Sidebar from '../components/layout/Sidebar';

const Certificates = ({ onNavigate, toggleDarkMode }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="certificates" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestió de Certificats</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Emissió i seguiment de les titulacions oficials</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="bg-primary hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center shadow-sm">
                            <span className="material-icons-outlined mr-2 text-[20px]">dynamic_feed</span>
                            Generar en Bloc
                        </button>
                    </div>
                </header>

                <div className="space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                                <span className="material-icons-outlined mr-2 text-primary">pending_actions</span>
                                Cursos Pendents de Certificació
                            </h2>
                            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider">3 cursos pendents</span>
                        </div>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nom del Curs</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Data Finalització</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Alumnes a Certificar</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Accions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900/30 text-primary flex items-center justify-center mr-3">
                                                        <span className="material-icons-outlined text-lg">gavel</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 dark:text-white">Delegats Prevenció I</p>
                                                        <p className="text-xs text-slate-500">Barcelona · Presencial</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center text-sm text-slate-600 dark:text-slate-400">12/06/2024</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-bold">18</span>
                                            </td>
                                            <td className="px-6 py-5 text-right space-x-2">
                                                <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                    <span className="material-icons-outlined text-sm mr-1.5">picture_as_pdf</span> Generar PDF
                                                </button>
                                                <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-md hover:bg-red-700 transition-colors">
                                                    <span className="material-icons-outlined text-sm mr-1.5">send</span> Enviar Email
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mr-3">
                                                        <span className="material-icons-outlined text-lg">language</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 dark:text-white">Anglès per a la Negociació</p>
                                                        <p className="text-xs text-slate-500">Online</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center text-sm text-slate-600 dark:text-slate-400">14/06/2024</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-bold">12</span>
                                            </td>
                                            <td className="px-6 py-5 text-right space-x-2">
                                                <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                    <span className="material-icons-outlined text-sm mr-1.5">picture_as_pdf</span> Generar PDF
                                                </button>
                                                <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-md hover:bg-red-700 transition-colors">
                                                    <span className="material-icons-outlined text-sm mr-1.5">send</span> Enviar Email
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mr-3">
                                                        <span className="material-icons-outlined text-lg">psychology</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 dark:text-white">Taller de Resolució de Conflictes</p>
                                                        <p className="text-xs text-slate-500">Tarragona · Presencial</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center text-sm text-slate-600 dark:text-slate-400">15/06/2024</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-bold">25</span>
                                            </td>
                                            <td className="px-6 py-5 text-right space-x-2">
                                                <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                    <span className="material-icons-outlined text-sm mr-1.5">picture_as_pdf</span> Generar PDF
                                                </button>
                                                <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-md hover:bg-red-700 transition-colors">
                                                    <span className="material-icons-outlined text-sm mr-1.5">send</span> Enviar Email
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                                <span className="material-icons-outlined mr-2 text-slate-400">history</span>
                                Historial de Certificats Enviats
                            </h2>
                            <div className="relative">
                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">filter_list</span>
                                <input className="pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg outline-none w-48 transition-all" placeholder="Filtrar historial..." type="text" />
                            </div>
                        </div>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">task_alt</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Dret Laboral i Sindicalització</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">mail</span> 14 certificats enviats correctament
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Avui, 09:45</p>
                                        <button className="text-xs text-primary font-semibold hover:underline mt-1">Detalls</button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">task_alt</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Igualtat a l'Empresa</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">mail</span> 22 certificats enviats correctament
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Ahir, 16:30</p>
                                        <button className="text-xs text-primary font-semibold hover:underline mt-1">Detalls</button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">warning</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Riscos Laborals Avançat</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">mail</span> 8/10 enviats (2 errors)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">10 Juny, 11:20</p>
                                        <button className="text-xs text-primary font-semibold hover:underline mt-1 text-orange-600">Reintentar</button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-200 dark:border-slate-800">
                                <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center justify-center w-full">
                                    CARREGAR MÉS REGISTRES <span className="material-icons-outlined text-xs ml-1">expand_more</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="mt-8 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
                    <div className="flex flex-col items-center space-y-2">
                        <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
                        <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Certificates;
