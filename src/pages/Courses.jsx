import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { CourseLinkConfig } from '../components/courses/CourseLinkConfig';
import { AttendanceQR } from '../components/attendance/AttendanceQR';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import Sidebar from '../components/layout/Sidebar';

export const Courses = ({ onNavigate, toggleDarkMode }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourseForLink, setSelectedCourseForLink] = useState(null);
    const [isLinkConfigOpen, setIsLinkConfigOpen] = useState(false);
    const [selectedCourseForQR, setSelectedCourseForQR] = useState(null);
    const [isQRConfigOpen, setIsQRConfigOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

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

    const handleDelete = async () => {
        if (!courseToDelete) return;
        try {
            await courseService.deleteCourse(courseToDelete);
            loadCourses();
        } catch (error) {
            alert("Error eliminant el curs");
        } finally {
            setCourseToDelete(null);
        }
    };

    const copyLink = (id) => {
        const url = `${window.location.origin}/register/${id}`;
        navigator.clipboard.writeText(url);
        alert('Enllaç copiat al porta-retalls');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="active-courses" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
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
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('courses.title')}</h2>
                        </div>
                        <button
                            className="btn-premium flex items-center gap-2"
                            onClick={() => navigate('/create-course')}
                        >
                            <span className="material-icons-outlined text-lg">add_circle</span>
                            {t('courses.new_button')}
                        </button>
                    </header>

                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="animate-pulse flex flex-col items-center gap-2">
                                <span className="material-icons-outlined text-4xl text-slate-200">school</span>
                                <p className="text-slate-400 font-medium">{t('courses.loading')}</p>
                            </div>
                        </div>
                    ) : courses && courses.length > 0 ? (
                        courses.length <= 6 ? (
                            /* Grid Layout (Hero Cards) */
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 bg-slate-50/50 dark:bg-transparent">
                                {courses.map((course) => (
                                    <div key={course.id} className="bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col">
                                        {/* Hero Image */}
                                        <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                            {course.heroImage ? (
                                                <img src={course.heroImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                    <span className="material-icons-outlined text-6xl">school</span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                                {course.code || '#CURS'}
                                            </div>
                                            <div className="absolute bottom-4 left-4">
                                                <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full shadow-sm ${course.status === 'open' ? 'bg-green-600 text-white' :
                                                    course.status === 'En curs' ? 'bg-blue-600 text-white' :
                                                        'bg-slate-500 text-white'
                                                    }`}>
                                                    {course.status === 'open' ? t('courses.status.open') :
                                                        course.status === 'En curs' ? t('courses.status.in_progress') :
                                                            course.status === 'Finalitzat' ? t('courses.status.finished') :
                                                                course.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 line-clamp-2 min-h-[3.5rem] leading-tight">
                                                {i18n.language === 'es' && course.name_es ? course.name_es : (course.title || course.name)}
                                            </h3>

                                            <div className="space-y-3 mb-6 flex-1">
                                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                    <span className="material-icons-outlined text-[18px] mr-3 text-slate-400">calendar_today</span>
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">{course.startDate}</span>
                                                    <span className="mx-2 text-slate-400">→</span>
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">{course.endDate || '---'}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                    <span className="material-icons-outlined text-[18px] mr-3 text-slate-400">list_alt</span>
                                                    <span>{t('courses.sessions_count', { count: course.sessions?.length || 0 })}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                    <span className="material-icons-outlined text-[18px] mr-3 text-slate-400">person</span>
                                                    <span className="truncate">{course.instructor || t('courses.no_instructor')}</span>
                                                </div>
                                            </div>

                                            {/* Actions Bar */}
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCourseForLink(course);
                                                            setIsLinkConfigOpen(true);
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-primary hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                        title="Enllaç de Registre"
                                                    >
                                                        <span className="material-icons-outlined text-[20px]">link</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCourseForQR(course);
                                                            setIsQRConfigOpen(true);
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                        title="QR Assistència"
                                                    >
                                                        <span className="material-icons-outlined text-[20px]">qr_code_2</span>
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/edit-course/${course.id}`)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                                        title="Editar curs"
                                                    >
                                                        <span className="material-icons-outlined text-[20px]">edit</span>
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setCourseToDelete(course.id);
                                                        setIsDeleteDialogOpen(true);
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                    title="Eliminar Curs"
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
                            <div className="overflow-x-auto">
                                <table className="table-container text-left w-full">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                                            <th className="table-header-cell">{t('courses.table.code_name')}</th>
                                            <th className="table-header-cell">{t('courses.table.instructor')}</th>
                                            <th className="table-header-cell">{t('courses.table.start_date')}</th>
                                            <th className="table-header-cell">{t('courses.table.distribution')}</th>
                                            <th className="table-header-cell">{t('courses.table.status')}</th>
                                            <th className="table-header-cell text-right">{t('courses.table.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {courses.map((course) => (
                                            <tr key={course.id} className="table-row group">
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
                                                            {course.heroImage ? (
                                                                <img src={course.heroImage} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                    <span className="material-icons-outlined text-lg">image</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-primary font-bold text-[10px] uppercase tracking-tight">{course.code || '#CURS'}</span>
                                                            <span className="text-sm font-semibold text-slate-800 dark:text-white">
                                                                {i18n.language === 'es' && course.name_es ? course.name_es : (course.title || course.name)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="table-cell text-slate-600 dark:text-slate-400">{course.instructor || '---'}</td>
                                                <td className="table-cell text-slate-600 dark:text-slate-400">{course.startDate}</td>
                                                <td className="table-cell">
                                                    <div className="flex gap-1">
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            onClick={() => {
                                                                setSelectedCourseForLink(course);
                                                                setIsLinkConfigOpen(true);
                                                            }}
                                                        >
                                                            <span className="material-icons-outlined text-lg">link</span>
                                                        </button>
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                                                            onClick={() => {
                                                                setSelectedCourseForQR(course);
                                                                setIsQRConfigOpen(true);
                                                            }}
                                                        >
                                                            <span className="material-icons-outlined text-lg">qr_code_2</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="table-cell">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${course.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {course.status === 'open' ? t('courses.status.open') :
                                                            course.status === 'En curs' ? t('courses.status.in_progress') :
                                                                course.status === 'Finalitzat' ? t('courses.status.finished') :
                                                                    course.status}
                                                    </span>
                                                </td>
                                                <td className="table-cell text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            onClick={() => navigate(`/edit-course/${course.id}`)}
                                                        >
                                                            <span className="material-icons-outlined text-lg">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setCourseToDelete(course.id);
                                                                setIsDeleteDialogOpen(true);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <span className="material-icons-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : (
                        <div className="p-20 text-center text-slate-400">
                            <span className="material-icons-outlined text-4xl mb-2">school</span>
                            <p>No s'han trobat cursos actius.</p>
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

                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    title={t('confirm.delete_course_title')}
                    description={t('confirm.delete_course_desc')}
                    confirmText={t('confirm.yes_delete')}
                    cancelText={t('common.cancel')}
                />
            </main>
        </div>
    );
};
