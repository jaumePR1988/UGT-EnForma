import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { CourseLinkConfig } from '../components/courses/CourseLinkConfig';
import { AttendanceQR } from '../components/attendance/AttendanceQR';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import Sidebar from '../components/layout/Sidebar';
import { useNotifications } from '../context/NotificationContext';
import { getBaseUrl } from '../utils/url';

export const Courses = ({ onNavigate, toggleDarkMode }) => {
    const { t, i18n } = useTranslation();
    const { showNotification } = useNotifications();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourseForLink, setSelectedCourseForLink] = useState(null);
    const [isLinkConfigOpen, setIsLinkConfigOpen] = useState(false);
    const [selectedCourseForQR, setSelectedCourseForQR] = useState(null);
    const [isQRConfigOpen, setIsQRConfigOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    // Finish Course Confirmation State
    const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState(false);
    const [courseToFinish, setCourseToFinish] = useState(null);

    // 'active' or 'archived'
    const [viewMode, setViewMode] = useState('active');

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
            showNotification("Error eliminant el curs", "error");
        } finally {
            setCourseToDelete(null);
            setIsDeleteDialogOpen(false); // Close modal
        }
    };

    const handleFinishCourse = (course) => {
        setCourseToFinish(course);
        setIsFinishConfirmOpen(true);
    };

    const confirmFinishCourse = async () => {
        if (!courseToFinish) return;
        try {
            // Update status to 'Finalitzat'
            await courseService.updateCourse(courseToFinish.id, { status: 'Finalitzat' });
            loadCourses(); // Refresh list
        } catch (error) {
            console.error("Error finishing course:", error);
            showNotification("Error al finalitzar el curs. Revisa la consola.", "error");
        } finally {
            setIsFinishConfirmOpen(false);
            setCourseToFinish(null);
        }
    };

    const copyLink = (id) => {
        const url = `${getBaseUrl()}/public/enroll/${id}`;
        navigator.clipboard.writeText(url);
        showNotification("Enllaç copiat al porta-retalls", "success");
    };

    const filteredCourses = courses.filter(course => {
        if (viewMode === 'active') {
            return course.status !== 'Finalitzat' && course.status !== 'Esborrany';
        } else if (viewMode === 'drafts') {
            return course.status === 'Esborrany';
        } else {
            return course.status === 'Finalitzat';
        }
    });

    return (
        <div className="space-y-8">
            <div className="animate-slide-up">
                {/* Professional Header & Breadcrumbs (Based on User Reference) */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <nav aria-label="Breadcrumb" className="flex text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                            <ol className="inline-flex items-center space-x-2" style={{ listStyle: 'none' }}>
                                <li>Admin</li>
                                <li><span className="mx-1">/</span></li>
                                <li className="text-slate-600">Cursos</li>
                            </ol>
                        </nav>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{t('courses.title')}</h2>
                    </div>
                    <div className="flex gap-4">
                        {/* Tabs */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('active')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'active'
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                {t('courses.tabs.active')}
                            </button>
                            <button
                                onClick={() => setViewMode('drafts')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'drafts'
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                {t('courses.tabs.drafts')}
                            </button>
                            <button
                                onClick={() => setViewMode('archived')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'archived'
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                {t('courses.tabs.archived')}
                            </button>
                        </div>

                        <button
                            className="btn-premium flex items-center gap-2"
                            onClick={() => navigate('/create-course')}
                        >
                            <span className="material-icons-outlined text-lg">add_circle</span>
                            {t('courses.new_button')}
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-pulse flex flex-col items-center gap-2">
                            <span className="material-icons-outlined text-4xl text-slate-200">school</span>
                            <p className="text-slate-400 font-medium">{t('courses.loading')}</p>
                        </div>
                    </div>
                ) : filteredCourses && filteredCourses.length > 0 ? (
                    /* Grid Layout (Hero Cards) */
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 bg-slate-50/50 dark:bg-transparent">
                        {filteredCourses.map((course) => (
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
                                            {/* Finish Course Button - Only for non-finished courses */}
                                            {course.status !== 'Finalitzat' && (
                                                <button
                                                    onClick={() => handleFinishCourse(course)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                                                    title="Finalitzar Curs"
                                                >
                                                    <span className="material-icons-outlined text-[20px]">check_circle</span>
                                                </button>
                                            )}
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
            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title={t('courses.delete_confirm_title')}
                message={t('courses.delete_confirm_message')}
                confirmText={t('common.delete')}
                cancelText={t('common.cancel')}
                type="danger"
            />

            {/* Finish Course Confirmation */}
            <ConfirmDialog
                isOpen={isFinishConfirmOpen}
                onClose={() => setIsFinishConfirmOpen(false)}
                onConfirm={confirmFinishCourse}
                title="⚠️ Finalitzar Curs Permanentment"
                message={`Estàs segur que vols marcar el curs "${courseToFinish?.title || courseToFinish?.name}" com a Finalitzat? \n\nAquesta acció és IRREVERSIBLE. El curs es mourà a l'arxiu i els alumnes a l'històric.`}
                confirmText="Sí, Finalitzar"
                cancelText="Cancel·lar"
                type="danger"
            />
        </div>
    );
};
