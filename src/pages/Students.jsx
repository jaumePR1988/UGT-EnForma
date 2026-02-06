import React from 'react';
import Sidebar from '../components/layout/Sidebar';

const Students = ({ onNavigate, toggleDarkMode, students }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="students" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestió d'Alumnat</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Administració centralitzada de participants i inscripcions</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                            <input className="pl-10 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-72 transition-all text-sm" placeholder="Buscar per nom o DNI..." type="text" />
                        </div>
                        <button
                            className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                            onClick={() => onNavigate('enroll-student')}
                        >
                            <span className="material-icons-outlined mr-2 text-[20px]">person_add</span>
                            Inscriure Alumne
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Alumnes Actius</h3>
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-primary rounded-lg">
                                <span className="material-icons-outlined text-[20px]">groups</span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">{students ? students.length : 842}</p>
                        <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
                            <span className="material-icons-outlined text-[14px] mr-1">trending_up</span>
                            +3.2% vs mes anterior
                        </div>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Noves Inscripcions (Mes)</h3>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <span className="material-icons-outlined text-[20px]">assignment_ind</span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">128</p>
                        <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
                            <span className="material-icons-outlined text-[14px] mr-1">trending_up</span>
                            15 inscripcions avui
                        </div>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Taxa d'Abandonament</h3>
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                                <span className="material-icons-outlined text-[20px]">person_off</span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">4.2%</p>
                        <div className="flex items-center mt-2 text-xs text-slate-500 font-medium">
                            <span className="material-icons-outlined text-[14px] mr-1">horizontal_rule</span>
                            Estable des de maig
                        </div>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="font-bold text-lg">Llistat detallat d'alumnat</h2>
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-icons-outlined mr-1.5 text-[18px]">filter_list</span>
                                Filtres
                            </button>
                            <button className="flex items-center px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-icons-outlined mr-1.5 text-[18px]">download</span>
                                Exportar CSV
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumne/a</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Curs</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estat</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Accions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students ? students.map(student => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold mr-3">
                                                    {student.fullName ? student.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'AL'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{student.fullName}</p>
                                                    <p className="text-xs text-slate-500">{student.dni || student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium">{student.courseTitle}</p>
                                            <p className="text-xs text-slate-500">Inscrit: {student.registrationDate ? new Date(student.registrationDate).toLocaleDateString() : 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${student.status === 'registered' || student.status === 'Inscrit' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="Veure perfil">
                                                    <span className="material-icons-outlined text-[20px]">visibility</span>
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-green-600 transition-colors" title="Contactar WhatsApp">
                                                    <span className="material-icons-outlined text-[20px]">chat</span>
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Editar">
                                                    <span className="material-icons-outlined text-[20px]">edit</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <>
                                        <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold mr-3">JG</div>
                                                    <div>
                                                        <p className="font-semibold text-sm">Joan Garcia i Martí</p>
                                                        <p className="text-xs text-slate-500">46882231-K</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium">Dret Laboral I</p>
                                                <p className="text-xs text-slate-500">Inici: 10/06/2024</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">En curs</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="Veure perfil">
                                                        <span className="material-icons-outlined text-[20px]">visibility</span>
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors" title="Contactar WhatsApp">
                                                        <span className="material-icons-outlined text-[20px]">chat</span>
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Editar">
                                                        <span className="material-icons-outlined text-[20px]">edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Students;
