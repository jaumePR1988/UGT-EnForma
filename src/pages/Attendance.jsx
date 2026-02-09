import React, { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { studentService } from '../services/studentService';
import { CourseAttendanceModal } from '../components/attendance/CourseAttendanceModal';

export const Attendance = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [stats, setStats] = useState({
        completedCourses: 0,
        certifiedStudents: 0,
        pendingStudents: 0
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [coursesData, studentsData] = await Promise.all([
                courseService.getCourses(),
                studentService.getStudents()
            ]);

            setCourses(coursesData);

            const certified = studentsData.filter(s => s.attended === true).length;
            const pending = studentsData.filter(s => s.status === 'registered' && !s.attended).length;

            setStats({
                completedCourses: coursesData.length,
                certifiedStudents: certified,
                pendingStudents: pending
            });
        } catch (error) {
            console.error("Error loading attendance data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getAiChurnRisk = (course) => {
        const enrolled = course.enrolledCount || 0;
        const capacity = course.capacity || 25;
        const ratio = enrolled / capacity;
        if (ratio < 0.4) return "ALT";
        if (ratio < 0.7) return "MITJÀ";
        return "BAIX";
    };

    const filteredCourses = courses.filter(course =>
        (course.name || course.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-slide-up">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <nav aria-label="Breadcrumb" className="flex text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        <ol className="inline-flex items-center space-x-2" style={{ listStyle: 'none' }}>
                            <li>Admin</li>
                            <li><span className="mx-1">/</span></li>
                            <li className="text-slate-600 dark:text-slate-300">Certificats</li>
                        </ol>
                    </nav>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Control d'Assistència i Diplomes</h2>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors bg-white dark:bg-slate-800">
                        <span className="material-icons-outlined text-lg">file_download</span>
                        EXPORTAR LLISTA
                    </button>
                    <button className="btn-premium flex items-center gap-2">
                        <span className="material-icons-outlined text-lg">verified</span>
                        GENERAR CERTIFICATS
                    </button>
                </div>
            </header>

            {/* Metrics Grid (Referència Usuari) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Cursos Actius', value: stats.completedCourses, icon: 'play_lesson', color: 'text-primary', bg: 'bg-red-50 dark:bg-red-900/20', trend: 'Actualitzat' },
                    { label: 'Alumnes Certificats', value: stats.certifiedStudents, icon: 'verified', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: 'Assistència confirmada' },
                    { label: "Taxa d'Assistència", value: '88%', icon: 'groups', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trend: 'Estable' }
                ].map((stat, i) => (
                    <div key={i} className="card p-6 flex flex-col transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                                <span className="material-icons-outlined">{stat.icon}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.trend}</span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-tight">{stat.label}</h3>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="card overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex gap-4 items-center bg-white dark:bg-slate-800/50">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Cerca per curs, codi o professor..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-container text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="table-header-cell">Curs & Resolució</th>
                                <th className="table-header-cell">Data Inici</th>
                                <th className="table-header-cell">Inscrits / Aforament</th>
                                <th className="table-header-cell text-right">Accions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan="5" className="p-10 text-center animate-pulse text-slate-400">Carregant dades...</td></tr>
                                ))
                            ) : filteredCourses.length === 0 ? (
                                <tr><td colSpan="5" className="p-10 text-center text-slate-400">No s'han trobat cursos actius.</td></tr>
                            ) : (
                                filteredCourses.map((course) => {
                                    const risk = getAiChurnRisk(course);
                                    return (
                                        <tr key={course.id} className="table-row group">
                                            <td className="table-cell">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-800 dark:text-white leading-snug">{course.name || course.title}</span>
                                                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">#{course.id.substring(0, 8).toUpperCase()}</span>
                                                </div>
                                            </td>
                                            <td className="table-cell text-slate-500 dark:text-slate-400">
                                                {course.startDate ? new Date(course.startDate).toLocaleDateString('ca-ES') : '---'}
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                                                    <span className="text-sm">{course.enrolledCount || 0}</span>
                                                    <span className="text-xs text-slate-400 font-normal">/ {course.capacity || 25}</span>
                                                </div>
                                            </td>
                                            <td className="table-cell text-right">
                                                <button
                                                    className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all border-none cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setIsAttendanceModalOpen(true);
                                                    }}
                                                >
                                                    GESTIONAR
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedCourse && (
                <CourseAttendanceModal
                    isOpen={isAttendanceModalOpen}
                    onClose={() => {
                        setIsAttendanceModalOpen(false);
                        loadData();
                    }}
                    course={selectedCourse}
                />
            )}
        </div>
    );
};
