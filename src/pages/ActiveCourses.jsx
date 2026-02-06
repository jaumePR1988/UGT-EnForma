import React from 'react';
import Sidebar from '../components/layout/Sidebar';

const ActiveCourses = ({ onNavigate, toggleDarkMode, courses }) => {
    const copyLink = (courseId) => {
        const url = `${window.location.origin}/public/enroll/${courseId}`;
        navigator.clipboard.writeText(url);
        alert("Enllaç d'inscripció pública copiat!");
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="active-courses" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Cursos Actius</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Gestió i seguiment de les formacions en curs</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm" onClick={() => onNavigate('create-course')}>
                            <span className="material-icons-outlined mr-2 text-[20px]">add</span>
                            Nou Curs
                        </button>
                    </div>
                </header>

                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Codi</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nom del Curs</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estat</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumnes</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Inici</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progrés</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Accions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {courses && courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-slate-500">{course.code}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-white">{course.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${course.status === 'En curs' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                                course.status === 'Finalitzat' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-blue-300' :
                                                    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                                                }`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{course.students}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{course.startDate}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mr-2 max-w-[80px]">
                                                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                                </div>
                                                <span className="text-xs text-slate-500 font-medium">{course.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => copyLink(course.id)}
                                                className="text-slate-400 hover:text-blue-600 transition-colors mr-3"
                                                title="Copiar enllaç públic"
                                            >
                                                <span className="material-icons-outlined text-[20px]">share</span>
                                            </button>
                                            <button className="text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-icons-outlined text-[20px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!courses || courses.length === 0) && (
                            <div className="p-12 text-center text-slate-500">
                                <span className="material-icons-outlined text-4xl mb-2 text-slate-300">school</span>
                                <p>No hi ha cursos actius en aquest moment.</p>
                            </div>
                        )}
                    </div>
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

export default ActiveCourses;
