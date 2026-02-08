import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import { courseService } from '../services/courseService';

const ActiveCourses = ({ onNavigate, toggleDarkMode, courses, refreshCourses }) => {
    const copyLink = (courseId) => {
        const url = `${window.location.origin}/public/enroll/${courseId}`;
        navigator.clipboard.writeText(url);
        alert("Enllaç d'inscripció pública copiat!");
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Estàs segur que vols eliminar aquest curs? Aquesta acció no es pot desfer.")) {
            try {
                await courseService.deleteCourse(courseId);
                // Trigger refresh if the function is provided
                if (refreshCourses) {
                    await refreshCourses();
                }
            } catch (error) {
                alert("Error eliminant el curs: " + error.message);
            }
        }
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

                {/* Conditional Layout */}
                {courses && courses.length > 0 ? (
                    courses.length <= 6 ? (
                        /* Grid Layout (Hero Cards) */
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {courses.map((course) => (
                                <div key={course.id} className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                    {/* Hero Image */}
                                    <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                        {course.heroImage ? (
                                            <img src={course.heroImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                <span className="material-icons-outlined text-6xl">school</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 text-xs font-mono bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                                            {course.code}
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full shadow-sm ${course.status === 'En curs' ? 'bg-blue-600 text-white' :
                                                course.status === 'Finalitzat' ? 'bg-green-600 text-white' :
                                                    'bg-orange-500 text-white'
                                                }`}>
                                                {course.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 line-clamp-2 min-h-[3.5rem] leading-tight">
                                            {course.name}
                                        </h3>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <span className="material-icons-outlined text-[18px] mr-2 text-slate-400">calendar_today</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{course.startDate}</span>
                                                <span className="mx-2 text-slate-400">→</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{course.endDate || 'TBD'}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <span className="material-icons-outlined text-[18px] mr-2 text-slate-400">list_alt</span>
                                                <span>{course.sessions?.length || 0} sessions programades</span>
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <span className="material-icons-outlined text-[18px] mr-2 text-slate-400">group</span>
                                                <span>{course.students || 0} alumnes inscrits</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inscripcions</span>
                                                <span className="text-sm font-bold text-primary">{course.progress || 0}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => copyLink(course.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                    title="Copiar enllaç públic"
                                                >
                                                    <span className="material-icons-outlined text-[20px]">share</span>
                                                </button>
                                                <button
                                                    onClick={() => onNavigate(`edit-course/${course.id}`)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                    title="Editar curs"
                                                >
                                                    <span className="material-icons-outlined text-[20px]">edit</span>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                                                title="Eliminar curs"
                                            >
                                                <span className="material-icons-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Table Layout (Standard) */
                        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[40%]">Curs</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estat</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumnes</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Inici</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progrés</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Accions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {courses.map((course) => (
                                            <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
                                                            {course.heroImage ? (
                                                                <img src={course.heroImage} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                    <span className="material-icons-outlined text-lg">image</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-mono text-slate-500 mb-0.5">{course.code}</div>
                                                            <div className="text-sm font-semibold text-slate-800 dark:text-white">{course.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
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
                                                    <button
                                                        onClick={() => onNavigate(`edit-course/${course.id}`)}
                                                        className="text-slate-400 hover:text-primary transition-colors mr-3"
                                                        title="Editar curs"
                                                    >
                                                        <span className="material-icons-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course.id)}
                                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                                        title="Eliminar curs"
                                                    >
                                                        <span className="material-icons-outlined text-[20px]">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
                        <span className="material-icons-outlined text-4xl mb-2 text-slate-300">school</span>
                        <p>No hi ha cursos actius en aquest moment.</p>
                    </div>
                )}

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
