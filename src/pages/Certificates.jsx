import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/layout/Sidebar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import SignatureManager from '../components/certificates/SignatureManager';
import { generateCertificate } from '../utils/CertificateGenerator';
import { studentService } from '../services/studentService';

const Certificates = ({ onNavigate, courses = [], students = [] }) => {
    const { t } = useTranslation();
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [courseStudents, setCourseStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        title: '',
        description: '',
        type: 'info',
        onConfirm: null,
        confirmText: t('common.accept') || 'D\'acord',
        cancelText: t('common.cancel') || 'Cancel·lar'
    });

    const closeConfirm = () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    };

    const showConfirm = (params) => {
        setConfirmConfig({
            isOpen: true,
            title: params.title,
            description: params.message || params.description,
            type: params.type || 'info',
            onConfirm: params.onConfirm || null,
            confirmText: params.confirmText || t('common.accept') || 'D\'acord',
            cancelText: params.cancelText || t('common.cancel') || 'Cancel·lar'
        });
    };

    const showModal = ({ title, message, type = 'info', onConfirm = null, confirmText, cancelText }) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type,
            onConfirm,
            confirmText: confirmText || t('common.accept'),
            cancelText: cancelText || t('common.cancel')
        });
    };

    const handleConfirmModal = () => {
        if (modalConfig.onConfirm) {
            modalConfig.onConfirm();
        }
        closeModal();
    };

    // 1. Identify courses that are finished (or all active courses for now)
    const availableCourses = courses || [];

    // Load students when a course is selected
    useEffect(() => {
        const fetchStudents = async () => {
            if (selectedCourseId) {
                setLoading(true);
                try {
                    const studentsData = await studentService.getStudentsByCourse(selectedCourseId);
                    // Filter only those who "Passed" (active/registered for now)
                    setCourseStudents(studentsData);
                } catch (error) {
                    console.error("Error loading students for certificate:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setCourseStudents([]);
            }
        };
        fetchStudents();
    }, [selectedCourseId]);

    const handleGeneratePDF = async (student) => {
        if (!selectedSignature) {
            showConfirm({
                title: t('certificates.modal.missing_signature_title') || 'Falta la firma',
                message: t('certificates.modal.missing_signature_message') || 'Si us plau, selecciona una firma abans de generar el certificat.',
                type: 'info'
            });
            return;
        }

        const stats = calculateAttendance(student, selectedCourseId);

        const proceedWithGeneration = async () => {
            const course = availableCourses.find(c => c.id === selectedCourseId);

            // 1. Calculate Total Hours if not present
            let totalHours = course.duration || course.totalHours || 0;
            if (!totalHours && course.sessions && course.sessions.length > 0) {
                totalHours = course.sessions.reduce((acc, session) => {
                    if (session.startTime && session.endTime) {
                        const [startH, startM] = session.startTime.split(':').map(Number);
                        const [endH, endM] = session.endTime.split(':').map(Number);
                        const startVal = startH + (startM / 60);
                        const endVal = endH + (endM / 60);
                        const duration = endVal - startVal;
                        return acc + (duration > 0 ? duration : 0);
                    }
                    return acc;
                }, 0);
                // Round to 1 decimal place if needed, or keep as float
                totalHours = Math.round(totalHours * 100) / 100;
            }

            // 2. Pre-load Signature as Data URL to ensure it appears in PDF
            let signatureToUse = { ...selectedSignature };
            if (selectedSignature.url && !selectedSignature.dataUrl) {
                try {
                    setLoading(true);
                    const dataUrl = await getDataUrl(selectedSignature.url);
                    signatureToUse.dataUrl = dataUrl;
                } catch (error) {
                    console.error("Error loading signature image", error);
                    showModal({
                        title: 'Error',
                        message: t('certificates.pdf_button.error_signature'),
                        type: 'error'
                    });
                    setLoading(false); // Ensure loading is stopped
                    return;
                } finally {
                    setLoading(false);
                }
            }

            if (student && course) {
                // Pass the calculated totalHours override
                const courseWithHours = { ...course, computedTotalHours: totalHours };
                generateCertificate(student, courseWithHours, signatureToUse);

                // NEW: Mark as generated in DB
                try {
                    await studentService.setCertificateGenerated(student.id);
                    // Update local state to reflect change immediately (optional if live reload is fast enough, but good UX)
                    setCourseStudents(prev => prev.map(s =>
                        s.id === student.id ? { ...s, certificateGenerated: true } : s
                    ));
                } catch (e) {
                    console.error("Failed to mark certificate as generated", e);
                }
            }
        };

        if (!stats.eligible) {
            showModal({
                title: t('certificates.modal.low_attendance_title') || 'Assistència Insuficient',
                message: t('certificates.pdf_button.warning_attendance', { percentage: stats.percentage, min: stats.minPercentage }),
                type: 'warning',
                onConfirm: proceedWithGeneration,
                confirmText: t('certificates.modal.force_generate') || 'Generar igualment',
                cancelText: t('common.cancel')
            });
        } else {
            await proceedWithGeneration();
        }
    };

    // Helper to convert URL to Data URL
    // Helper to convert URL to Data URL
    const getDataUrl = async (url) => {
        try {
            // Use proxy in development to avoid CORS
            let fetchUrl = url;
            if (import.meta.env.DEV) {
                fetchUrl = url.replace('https://firebasestorage.googleapis.com', '/firebase-storage');
                // Double encode %2F to %252F to survive proxy decoding
                fetchUrl = fetchUrl.replace(/%2F/g, '%252F');
            }

            const response = await fetch(fetchUrl);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);

            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Error loading image for PDF:", error);
            throw error;
        }
    };

    // Helper to calculate attendance (duplicated from CourseAttendanceModal for now to avoid large refactor)
    const calculateAttendance = (student, courseId) => {
        const course = availableCourses.find(c => c.id === courseId);
        if (!course) return { count: 0, percentage: 0, eligible: false };

        const totalSessions = course.sessions?.length || 1;
        const legacyAttended = student.attended ? 1 : 0;
        // If attendanceSessions exists, use its length. If not, use legacy boolean.
        const count = student.attendanceSessions ? student.attendanceSessions.length : legacyAttended;

        const percentage = Math.round((count / totalSessions) * 100);
        const minPercentage = course.minAttendancePercentage || 80;

        return {
            count,
            percentage,
            eligible: percentage >= minPercentage,
            minPercentage
        };
    };

    return (
        <div className="bg-background-light text-slate-900 min-h-screen transition-colors duration-200">
            <Sidebar currentView="certificates" onNavigate={onNavigate} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{t('certificates.title')}</h1>
                        <p className="text-slate-500 text-sm">{t('certificates.subtitle')}</p>
                    </div>
                </header>

                <div className="space-y-8">
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: Configuration */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Course Selector */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                                    <span className="material-icons-outlined mr-2 text-primary">school</span>
                                    {t('certificates.select_course')}
                                </h3>
                                <select
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                >
                                    <option value="">{t('certificates.select_course_placeholder')}</option>
                                    {availableCourses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-2">
                                    {t('certificates.select_course_help')}
                                </p>
                            </div>

                            {/* Signature Manager */}
                            <SignatureManager onSelectSignature={setSelectedSignature} />
                        </div>

                        {/* RIGHT COLUMN: Student List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 flex items-center">
                                        <span className="material-icons-outlined mr-2 text-primary">people</span>
                                        {t('certificates.student_list')}
                                    </h3>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
                                        {t('certificates.students_count', { count: courseStudents.length })}
                                    </span>
                                </div>

                                {loading ? (
                                    <div className="p-10 text-center text-slate-500">
                                        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full mb-2"></div>
                                        <p>{t('common.loading')}</p>
                                    </div>
                                ) : !selectedCourseId ? (
                                    <div className="p-10 text-center text-slate-400">
                                        <span className="material-icons-outlined text-4xl mb-2">arrow_back</span>
                                        <p>{t('certificates.select_course_start')}</p>
                                    </div>
                                ) : courseStudents.length === 0 ? (
                                    <div className="p-10 text-center text-slate-500">
                                        <p>{t('certificates.no_students')}</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                                                    <th className="px-6 py-3">{t('certificates.table.student')}</th>
                                                    <th className="px-6 py-3">{t('certificates.table.dni')}</th>
                                                    <th className="px-6 py-3">{t('certificates.table.attendance')}</th>
                                                    <th className="px-6 py-3 text-right">{t('certificates.table.actions')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {courseStudents.map(student => (
                                                    <tr key={student.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-4 font-medium text-slate-700">
                                                            {student.fullName}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                                                            {student.dni}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {(() => {
                                                                const stats = calculateAttendance(student, selectedCourseId);
                                                                return (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${stats.eligible
                                                                            ? 'bg-green-100 text-green-700'
                                                                            : 'bg-red-100 text-red-700'
                                                                            }`}>
                                                                            {stats.percentage}%
                                                                        </span>
                                                                        {!stats.eligible && (
                                                                            <span className="text-[10px] text-slate-400">
                                                                                ({t('certificates.min_attendance', { min: stats.minPercentage })})
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {(() => {
                                                                const stats = calculateAttendance(student, selectedCourseId);
                                                                // Only disable if no signature. Allow override for attendance.
                                                                const isDisabled = !selectedSignature;
                                                                const isForce = !stats.eligible;

                                                                let title = t('certificates.pdf_button.generate');
                                                                if (!selectedSignature) title = t('certificates.pdf_button.select_signature');
                                                                else if (isForce) title = t('certificates.pdf_button.force', { percentage: stats.percentage, min: stats.minPercentage });

                                                                return (
                                                                    <button
                                                                        onClick={() => handleGeneratePDF(student)}
                                                                        className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${isDisabled
                                                                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                                                            : isForce
                                                                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                                                                                : 'bg-primary text-white hover:bg-red-700 shadow-sm'
                                                                            }`}
                                                                        disabled={isDisabled}
                                                                        title={title}
                                                                    >
                                                                        <span className="material-icons-outlined text-sm mr-1">
                                                                            {isForce ? 'warning' : 'download'}
                                                                        </span>
                                                                        {isForce ? t('certificates.pdf_button.force_short') : t('certificates.pdf_button.pdf')}
                                                                    </button>
                                                                );
                                                            })()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center text-slate-800">
                                <span className="material-icons-outlined mr-2 text-slate-400">history</span>
                                {t('certificates.history.title')}
                            </h2>
                            <div className="relative">
                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">filter_list</span>
                                <input className="pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none w-48 transition-all" placeholder={t('certificates.history.filter')} type="text" />
                            </div>
                        </div>
                        <div className="bg-card-light rounded-xl border border-slate-200 shadow-sm">
                            <div className="divide-y divide-slate-100">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">task_alt</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">Dret Laboral i Sindicalització</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">mail</span> 14 {t('certificates.history.sent_success')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600">Avui, 09:45</p>
                                        <button className="text-xs text-primary font-semibold hover:underline mt-1">{t('certificates.history.details')}</button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">task_alt</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">Igualtat a l'Empresa</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">mail</span> 22 {t('certificates.history.sent_success')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600">Ahir, 16:30</p>
                                        <button className="text-xs text-primary font-semibold hover:underline mt-1">{t('certificates.history.details')}</button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-orange-50 text-orange-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">warning</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">Riscos Laborals Avançat</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">mail</span> {t('certificates.history.sent_partial', { sent: 8, total: 10, errors: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600">10 Juny, 11:20</p>
                                        <button className="text-xs text-primary font-semibold hover:underline mt-1 text-orange-600">{t('certificates.history.retry')}</button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
                                <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center justify-center w-full">
                                    {t('certificates.history.load_more')} <span className="material-icons-outlined text-xs ml-1">expand_more</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="mt-8 p-6 border-t border-slate-200 text-center">
                    <div className="flex flex-col items-center space-y-2">
                        <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale" src="/logo-ugt.png" />
                        <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
                    </div>
                </footer>
            </main>

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={closeConfirm}
                title={confirmConfig.title}
                description={confirmConfig.description}
                type={confirmConfig.type === 'error' ? 'danger' : confirmConfig.type}
                onConfirm={confirmConfig.onConfirm}
                confirmText={confirmConfig.confirmText}
                cancelText={confirmConfig.cancelText}
            />
        </div>
    );
};

export default Certificates;
