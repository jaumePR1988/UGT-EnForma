import React, { useEffect, useState } from 'react';
import { courseService } from '../services/courseService';
import { CourseLinkConfig } from '../components/courses/CourseLinkConfig';
import { AttendanceQR } from '../components/attendance/AttendanceQR';
import { CourseModal } from '../components/courses/CourseModal';

export const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourseForLink, setSelectedCourseForLink] = useState(null);
    const [isLinkConfigOpen, setIsLinkConfigOpen] = useState(false);
    const [selectedCourseForQR, setSelectedCourseForQR] = useState(null);
    const [isQRConfigOpen, setIsQRConfigOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState(null);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await courseService.getCourses();
            setCourses(data);
        } catch (error) {
            console.error("Failed to load courses", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-slide-up">
            {/* Professional Header & Breadcrumbs (Based on User Reference) */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <nav aria-label="Breadcrumb" className="flex text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        <ol className="inline-flex items-center space-x-2" style={{ listStyle: 'none' }}>
                            <li>Admin</li>
                            <li><span className="mx-1">/</span></li>
                            <li className="text-slate-600 dark:text-slate-300">Cursos</li>
                        </ol>
                    </nav>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestió del Catàleg Formatiu</h2>
                </div>
                <button
                    className="btn-premium flex items-center gap-2"
                    onClick={() => {
                        setCourseToEdit(null);
                        setIsCourseModalOpen(true);
                    }}
                >
                    <span className="material-icons-outlined text-lg">add_circle</span>
                    CREAR NOU CURS
                </button>
            </header>

            {/* Main Table Card */}
            <div className="card overflow-hidden">
                {/* Search & Filters Bar */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 justify-between items-center">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Cerca cursos, codis o professors..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors bg-white dark:bg-slate-800">
                            <span className="material-icons-outlined text-lg">filter_list</span>
                            Filtres
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-pulse flex flex-col items-center gap-2">
                            <span className="material-icons-outlined text-4xl text-slate-200">school</span>
                            <p className="text-slate-400 font-medium">Carregant cursos...</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-container text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="table-header-cell">Codi & Nom del Curs</th>
                                    <th className="table-header-cell">Professorat</th>
                                    <th className="table-header-cell">Data inici</th>
                                    <th className="table-header-cell">Distribució</th>
                                    <th className="table-header-cell">Estat</th>
                                    <th className="table-header-cell text-right">Accions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {courses.map((course) => (
                                    <tr key={course.id} className="table-row group">
                                        <td className="table-cell">
                                            <div className="flex flex-col">
                                                <span className="text-primary font-bold text-[10px] uppercase tracking-tight">{course.code || '#CURS-CAT'}</span>
                                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{course.title}</span>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                                    <span className="material-icons-outlined text-xs text-slate-400">person</span>
                                                </div>
                                                <span className="text-slate-600 dark:text-slate-400">{course.instructor || 'Sense assignar'}</span>
                                            </div>
                                        </td>
                                        <td className="table-cell text-slate-500 dark:text-slate-400 font-medium">
                                            {course.startDate ? new Date(course.startDate).toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex gap-1">
                                                <button
                                                    className="p-1.5 text-slate-400 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedCourseForLink(course);
                                                        setIsLinkConfigOpen(true);
                                                    }}
                                                    title="Enllaç de Registre"
                                                >
                                                    <span className="material-icons-outlined text-lg">link</span>
                                                </button>
                                                <button
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedCourseForQR(course);
                                                        setIsQRConfigOpen(true);
                                                    }}
                                                    title="QR Assistència"
                                                >
                                                    <span className="material-icons-outlined text-lg">qr_code_2</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${course.status === 'open'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                {course.status === 'open' ? 'Obert' : 'Tancat'}
                                            </span>
                                        </td>
                                        <td className="table-cell text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="p-1.5 text-slate-400 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                                                    onClick={() => {
                                                        setCourseToEdit(course);
                                                        setIsCourseModalOpen(true);
                                                    }}
                                                    title="Editar"
                                                >
                                                    <span className="material-icons-outlined text-lg">edit</span>
                                                </button>
                                                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors bg-transparent border-none cursor-pointer">
                                                    <span className="material-icons-outlined text-lg">more_vert</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Footer (Simulated) */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Mostrant {courses.length} cursos</span>
                    <div className="flex gap-2">
                        <button className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-colors cursor-pointer">
                            <span className="material-icons-outlined text-sm">chevron_left</span>
                        </button>
                        <button className="p-1.5 rounded bg-primary text-white border border-primary text-[10px] font-bold px-3">1</button>
                        <button className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-colors cursor-pointer">
                            <span className="material-icons-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {selectedCourseForLink && (
                <CourseLinkConfig
                    isOpen={isLinkConfigOpen}
                    onClose={() => setIsLinkConfigOpen(false)}
                    course={selectedCourseForLink}
                />
            )}

            {selectedCourseForQR && (
                <AttendanceQR
                    isOpen={isQRConfigOpen}
                    onClose={() => setIsQRConfigOpen(false)}
                    course={selectedCourseForQR}
                />
            )}

            {isCourseModalOpen && (
                <CourseModal
                    isOpen={isCourseModalOpen}
                    onClose={() => setIsCourseModalOpen(false)}
                    courseToEdit={courseToEdit}
                    onSave={async (data) => {
                        if (courseToEdit) {
                            await courseService.updateCourse(courseToEdit.id, data);
                        } else {
                            await courseService.addCourse(data);
                        }
                        await loadCourses();
                        setIsCourseModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};
