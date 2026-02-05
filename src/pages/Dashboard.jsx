import React from 'react';

export const Dashboard = () => {
    return (
        <div className="p-0 lg:p-2 animate-fade-in">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Panell d'Administració</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gestió global de la formació sindical</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            className="pl-10 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-64 transition-all"
                            placeholder="Buscar cursos, alumnes..."
                            type="text"
                        />
                    </div>
                    <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                        <span className="material-icons-outlined mr-2">add</span>
                        Nou Curs
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1: Cursos Actius */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-primary rounded-lg">
                            <span className="material-icons-outlined">library_books</span>
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Cursos Actius</h3>
                    <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">42</p>
                </div>

                {/* Card 2: Inscripcions Totals */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            <span className="material-icons-outlined">groups</span>
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+5.4%</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Inscripcions Totals</h3>
                    <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">1,284</p>
                </div>

                {/* Card 3: Certificats Pendents */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                            <span className="material-icons-outlined">pending_actions</span>
                        </div>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Pendent</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Certificats Pendents</h3>
                    <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">156</p>
                </div>

                {/* Card 4: Valoració Mitjana */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                            <span className="material-icons-outlined">star</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Mitjana</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Valoració Mitjana</h3>
                    <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">4.8/5</p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Calendar & Active Courses) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Weekly Calendar */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="font-bold text-lg flex items-center text-slate-800 dark:text-white">
                                <span className="material-icons-outlined mr-2 text-primary">calendar_month</span>
                                Calendari Setmanal de Formació
                            </h2>
                            <div className="flex items-center space-x-2">
                                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-400">
                                    <span className="material-icons-outlined">chevron_left</span>
                                </button>
                                <span className="text-sm font-medium px-2 text-slate-600 dark:text-slate-300">Setmana 24 - Juny 2024</span>
                                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-400">
                                    <span className="material-icons-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        <div className="calendar-grid">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dl 10</div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dm 11</div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dx 12</div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dj 13</div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dv 14</div>

                            <div className="bg-white dark:bg-card-dark p-2 min-h-[160px] relative text-left">
                                <div className="bg-primary/10 border-l-4 border-primary p-2 text-xs rounded mb-2">
                                    <p className="font-bold text-primary">Delegats Prevenció</p>
                                    <p className="text-[10px] text-slate-500">09:00 - 14:00</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-card-dark p-2 min-h-[160px] text-left">
                                <div className="bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 p-2 text-xs rounded mb-2">
                                    <p className="font-bold text-blue-700 dark:text-blue-300">Dret Laboral I</p>
                                    <p className="text-[10px] text-slate-500">10:30 - 13:30</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-card-dark p-2 min-h-[160px] text-left">
                                <div className="bg-orange-100 dark:bg-orange-900/40 border-l-4 border-orange-500 p-2 text-xs rounded mb-2">
                                    <p className="font-bold text-orange-700 dark:text-orange-300">Tècniques Negociació</p>
                                    <p className="text-[10px] text-slate-500">16:00 - 20:00</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-card-dark p-2 min-h-[160px] text-left">
                                <div className="bg-primary/10 border-l-4 border-primary p-2 text-xs rounded mb-2">
                                    <p className="font-bold text-primary">Delegats Prevenció</p>
                                    <p className="text-[10px] text-slate-500">09:00 - 14:00</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-card-dark p-2 min-h-[160px] text-left">
                                <div className="bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500 p-2 text-xs rounded mb-2">
                                    <p className="font-bold text-green-700 dark:text-green-300">Taller Habilitats</p>
                                    <p className="text-[10px] text-slate-500">09:00 - 12:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Courses List */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="font-bold text-lg text-slate-800 dark:text-white">Cursos en fase d'inscripció</h2>
                            <a className="text-primary text-sm font-medium hover:underline" href="#">Veure tots</a>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                        <span className="material-icons-outlined text-slate-400">gavel</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Igualtat a l'empresa</h4>
                                        <p className="text-xs text-slate-500">Edició Barcelona · 25 places disponibles</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[80%]"></div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">80% ple</span>
                                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                        <span className="material-icons-outlined text-sm text-slate-500">more_vert</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                        <span className="material-icons-outlined text-slate-400">language</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Anglès Nivell A2 (Bàsic)</h4>
                                        <p className="text-xs text-slate-500">Online · 4 places disponibles</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[92%]"></div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">92% ple</span>
                                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                        <span className="material-icons-outlined text-sm text-slate-500">more_vert</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                        <span className="material-icons-outlined text-slate-400">terminal</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Ofimàtica de Gestió</h4>
                                        <p className="text-xs text-slate-500">Tarragona · 12 places disponibles</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[45%]"></div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">45% ple</span>
                                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                        <span className="material-icons-outlined text-sm text-slate-500">more_vert</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Activity & Goals) */}
                <div className="space-y-6">
                    {/* Activity Feed */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="font-bold text-lg flex items-center text-slate-800 dark:text-white">
                                <span className="material-icons-outlined mr-2 text-slate-400">bolt</span>
                                Activitat Recents
                            </h2>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-6">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Nova inscripció</p>
                                        <p className="text-xs text-slate-500 mt-1">Joan Garcia s'ha inscrit a "Dret Laboral I"</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase">Fa 5 minuts</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 mt-1.5 bg-primary rounded-full mr-4 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Certificat Generat</p>
                                        <p className="text-xs text-slate-500 mt-1">Es can generar 15 certificats del curs "Salut Laboral"</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase">Fa 42 minuts</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Nou curs publicat</p>
                                        <p className="text-xs text-slate-500 mt-1">"Intel·ligència Artificial per a Delegats" ja és visible</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase">Fa 2 hores</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 mt-1.5 bg-orange-400 rounded-full mr-4 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">Modificació d'Horari</p>
                                        <p className="text-xs text-slate-500 mt-1">Aula canviada per al curs de Negociació del dijous</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase">Fa 5 hores</p>
                                    </div>
                                </li>
                            </ul>
                            <button className="w-full mt-6 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                                Veure tot l'historial
                            </button>
                        </div>
                    </div>

                    {/* Goal Tracker */}
                    <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Objectiu del Trimestre</h3>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">78%</span>
                            <span className="text-xs text-slate-500">1,560 / 2,000 alumnes</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[78%]"></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                            Estem un 5% per sobre de l'objectiu respecte al mateix període de l'any anterior.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer added to match code.html completely */}
            <footer className="mt-8 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
                <div className="flex flex-col items-center space-y-2">
                    <img
                        alt="UGT Catalunya Logo"
                        className="h-8 opacity-50 grayscale dark:invert"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaFPezJpHwmZAoLzF_OgCg05G3WTDBNdBIGoy8BxuVHPlpQvVew1pn8wGXFJ_BxS1tHwO8ov8236tYbSVyKCbVGtNiuGOc00gHWpUQuIWxfE4Cmts47MoprjIuRcuTfz-Aqq5TM8eVEHLX36_KUewdnitMcJXI_qXqvklgnypPPXfWW6qfOgX94lyVT9WyFxuWmu67bxeSXJwFH5s_-mOpgOKHzyMeVKWy7jxJZ83vCv41JYyXnzRpMB1PXS6xgvC_cRYVI9qR9Wpg"
                    />
                    <p className="text-xs text-slate-400">© 2024 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
                </div>
            </footer>
        </div>
    );
};
