import React, { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { studentService } from '../services/studentService';

export const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [stats, setStats] = useState({
        coursesCount: 0,
        studentsCount: 0,
        uniqueStudents: 0,
        certificatesCount: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [courses, students] = await Promise.all([
                    courseService.getCourses(),
                    studentService.getStudents()
                ]);

                const uniqueDnis = new Set(students.map(s => s.dni).filter(Boolean));
                const certified = students.filter(s => s.attended === true).length;

                setStats({
                    coursesCount: courses.length,
                    studentsCount: students.length,
                    uniqueStudents: uniqueDnis.size || students.length,
                    certificatesCount: certified
                });

                setAiAnalysis({
                    summary: `L'activitat formativa registra ${courses.length} cursos i ${certified} certificats a ${uniqueDnis.size || students.length} alumnes únics. La demanda en 'Dret Laboral' es manté crítica.`,
                    tip: "Recomanació IA: Incrementar oferta de 'Prevenció' un 15% per cobrir el risc d'abandonament."
                });
            } catch (error) {
                console.error("Error loading stats:", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="animate-slide-up">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <nav aria-label="Breadcrumb" className="flex text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        <ol className="inline-flex items-center space-x-2" style={{ listStyle: 'none' }}>
                            <li>Admin</li>
                            <li><span className="mx-1">/</span></li>
                            <li className="text-slate-600 dark:text-slate-300">Informes</li>
                        </ol>
                    </nav>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analítica i Rendiment</h2>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors bg-white dark:bg-slate-800">
                        <span className="material-icons-outlined text-lg">calendar_today</span>
                        Aquest Trimestre
                    </button>
                    <button className="btn-premium flex items-center gap-2">
                        <span className="material-icons-outlined text-lg">file_download</span>
                        EXPORTAR ANÀLISI
                    </button>
                </div>
            </header>



            {/* Stats Grid (Referència Dashboard) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Cursos Actius', value: stats.coursesCount, icon: 'play_lesson', color: 'text-primary', bg: 'bg-red-50 dark:bg-red-900/20' },
                    { label: 'Certificats Emesos', value: stats.certificatesCount, icon: 'verified', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                    { label: 'Alumnes Únics', value: stats.uniqueStudents, icon: 'groups', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Satisfacció', value: '4.8/5', icon: 'stars', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' }
                ].map((stat, i) => (
                    <div key={i} className="card p-6 flex flex-col transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                                <span className="material-icons-outlined">{stat.icon}</span>
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+4%</span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">{stat.label}</h3>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-icons-outlined text-primary">pie_chart</span>
                        Distribució de Demanda
                    </h3>
                    <div className="space-y-5">
                        {[
                            { name: 'Dret Laboral', value: 45, color: 'bg-primary' },
                            { name: 'Salut i Prevenció', value: 30, color: 'bg-blue-600' },
                            { name: 'Habilitats Sindicals', value: 15, color: 'bg-amber-600' },
                            { name: 'Altres', value: 10, color: 'bg-slate-400' }
                        ].map((cat, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
                                    <span className="text-xs font-black text-slate-800 dark:text-white">{cat.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`${cat.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${cat.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-icons-outlined text-blue-600">bar_chart</span>
                        Evolució d'Inscripcions
                    </h3>
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {[30, 50, 40, 75, 45, 85, 65].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="relative w-full">
                                    <div className={`w-full rounded-t-md transition-all duration-500 group-hover:opacity-80 ${i === 5 ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} style={{ height: `${h}%`, minHeight: '8px' }}></div>
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {Math.round(h * 1.5)}
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">M{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
