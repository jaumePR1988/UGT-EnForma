import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/layout/Sidebar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import SignatureManager from '../components/certificates/SignatureManager';
import { generateCertificate, generateMassCertificates } from '../utils/CertificateGenerator';
import { studentService } from '../services/studentService';
import { notificationService } from '../services/notificationService';
import { Modal } from '../components/ui/Modal';

const Certificates = ({ onNavigate, courses = [], students = [] }) => {
    const { t } = useTranslation();
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [courseStudents, setCourseStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    // Mass Selection State
    const [selectedStudents, setSelectedStudents] = useState([]);

    // History State
    const [certificateLogs, setCertificateLogs] = useState([]);

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

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null,
        confirmText: '',
        cancelText: ''
    });

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

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

    // Filter courses based on 'showArchived'
    const availableCourses = (courses || []).filter(c => {
        if (showArchived) return true;
        return c.status !== 'Finalitzat';
    });

    // Load logs on mount
    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        const logs = await studentService.getCertificateLogs();
        setCertificateLogs(logs);
    };

    // Load students when a course is selected
    useEffect(() => {
        const fetchStudents = async () => {
            if (selectedCourseId) {
                setLoading(true);
                try {
                    const studentsData = await studentService.getStudentsByCourse(selectedCourseId);
                    // Filter only those who "Passed" (active/registered for now)
                    setCourseStudents(studentsData);
                    setSelectedStudents([]); // Reset selection
                } catch (error) {
                    console.error("Error loading students for certificate:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setCourseStudents([]);
                setSelectedStudents([]);
            }
        };
        fetchStudents();
    }, [selectedCourseId]);

    // Selection Handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(courseStudents.map(s => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    // Common Logic to Prepare Data for Generation
    const prepareGenerationData = async () => {
        if (!selectedSignature) {
            showConfirm({
                title: t('certificates.modal.missing_signature_title') || 'Falta la firma',
                message: t('certificates.modal.missing_signature_message') || 'Si us plau, selecciona una firma abans de generar el certificat.',
                type: 'info'
            });
            return null;
        }

        const course = availableCourses.find(c => c.id === selectedCourseId);
        if (!course) return null;

        // 1. Calculate Total Hours
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
            totalHours = Math.round(totalHours * 100) / 100;
        }

        const courseWithHours = { ...course, computedTotalHours: totalHours };

        // 2. Pre-load Signature
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
                setLoading(false);
                return null;
            } finally {
                setLoading(false);
            }
        }

        return { courseWithHours, signatureToUse };
    };

    // Single Generation
    const handleGeneratePDF = async (student) => {
        const data = await prepareGenerationData();
        if (!data) return;
        const { courseWithHours, signatureToUse } = data;

        const stats = calculateAttendance(student, selectedCourseId);

        const proceed = async (isOverride = false) => {
            const doc = generateCertificate(student, courseWithHours, signatureToUse);
            await logGeneration(student, courseWithHours, signatureToUse, doc, isOverride);
        };

        if (!stats.eligible) {
            showModal({
                title: 'Assistència Insuficient',
                message: `L'alumne té un ${stats.percentage}% d'assistència (Mínim: ${stats.min}%). Si generes el certificat ara, quedarà desbloquejat al seu Portal de l'Alumne de forma permanent. Vols continuar?`,
                type: 'warning',
                onConfirm: () => proceed(true),
                confirmText: t('certificates.modal.force_generate') || 'Generar igualment',
                cancelText: t('common.cancel')
            });
        } else {
            await proceed(false);
        }
    };

    // Mass Generation
    const handleGenerateSelected = async () => {
        if (selectedStudents.length === 0) return;

        const data = await prepareGenerationData();
        if (!data) return;
        const { courseWithHours, signatureToUse } = data;

        const studentsToGenerate = courseStudents.filter(s => selectedStudents.includes(s.id));

        // Check if any have low attendance
        const lowAttendanceStudents = studentsToGenerate.filter(s => !calculateAttendance(s, selectedCourseId).eligible);

        const proceed = async () => {
            // 1. Generate the MASSIVE PDF for the Admin to download
            generateMassCertificates(studentsToGenerate, courseWithHours, signatureToUse);

            // 2. Generate and upload INDIVIDUAL PDFs for each student's portal
            // We do this in parallel to be efficient
            setLoading(true);
            try {
                const uploadPromises = studentsToGenerate.map(async (s) => {
                    const stats = calculateAttendance(s, selectedCourseId);
                    await logGeneration(s, courseWithHours, signatureToUse, null, !stats.eligible);
                });
                await Promise.all(uploadPromises);
            } finally {
                setLoading(false);
                setSelectedStudents([]);
            }
        };

        if (lowAttendanceStudents.length > 0) {
            showModal({
                title: 'Atenció: Alumnes sense assistència mínima',
                message: `Hi ha ${lowAttendanceStudents.length} alumnes seleccionats que no compleixen el mínim d'assistència. Vols generar els certificats igualment?`,
                type: 'warning',
                onConfirm: proceed,
                confirmText: 'Generar igualment',
                cancelText: 'Cancel·lar'
            });
        } else {
            await proceed();
        }
    };

    const logGeneration = async (student, course, signature, doc = null, isOverride = false) => {
        try {
            setLoading(true);

            // 1. Silent generation if doc is missing
            let pdfDoc = doc;
            if (!pdfDoc) {
                pdfDoc = generateCertificate(student, course, signature, false);
            }

            // 2. Upload to Cloud Storage
            const pdfBlob = pdfDoc.output('blob');
            const downloadUrl = await studentService.uploadCertificate(student.id, course.id, pdfBlob);

            // 3. Mark as override if applicable
            if (isOverride) {
                await studentService.updateStudent(student.id, { attendanceOverride: true });
            }

            // 4. Standard logging
            await studentService.logCertificate({
                studentName: student.fullName,
                courseName: course.name || course.title,
                signatureUsed: signature.signerName || signature.name,
                generatedBy: 'Admin',
                isOverride: isOverride
            });

            // 4. Automated email notification via Firestore queue
            // Now we can use the REAL storage URL from downloadUrl
            await notificationService.sendCertificateEmail(student, course, downloadUrl);

            // Update local state
            setCourseStudents(prev => prev.map(s =>
                s.id === student.id ? { ...s, certificateGenerated: true, certificateUrl: downloadUrl } : s
            ));
            loadLogs(); // Refresh logs
        } catch (e) {
            console.error("Failed to log and upload generation", e);
            showNotification(t('common.error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    // Helper to convert URL to Data URL
    // Helper to convert URL to Data URL with retry logic
    const getDataUrl = async (url) => {
        // Helper to fetch with specific options
        const fetchImage = async (fetchUrl, options = {}) => {
            try {
                const response = await fetch(fetchUrl, options);
                if (!response.ok) throw new Error(`Status: ${response.status} ${response.statusText}`);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                // Propagate error to be caught by strategy runner
                throw error;
            }
        };

        // Strategy 1: Proxy with Double Encoding (Best for some dev environments)
        if (import.meta.env.DEV) {
            try {
                console.log("Strategy 1: Proxy Double Encoded");
                let proxyUrl = url.replace('https://firebasestorage.googleapis.com', '/firebase-storage');
                proxyUrl = proxyUrl.replace(/%2F/g, '%252F');
                return await fetchImage(proxyUrl);
            } catch (e1) {
                console.warn("Strategy 1 failed:", e1.message);
                try {
                    console.log("Strategy 2: Proxy Single Encoded");
                    let proxyUrl = url.replace('https://firebasestorage.googleapis.com', '/firebase-storage');
                    return await fetchImage(proxyUrl);
                } catch (e2) {
                    console.warn("Strategy 2 failed:", e2.message);
                    // Fallthrough to direct
                }
            }
        }

        // Strategy 3: Direct (Production / Fallback)
        try {
            console.log("Strategy 3: Direct Fetch (CORS Mode)");
            // Explicitly request CORS to ensure browser handles it right
            return await fetchImage(url, { mode: 'cors', credentials: 'omit' });
        } catch (e3) {
            console.error("All signature fetch strategies failed.", e3);
            throw e3;
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
        <div className="space-y-8">
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
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 mb-3"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                            >
                                <option value="">{t('certificates.select_course_placeholder')}</option>
                                {availableCourses.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} {c.status === 'Finalitzat' ? '(Arxivat)' : ''}
                                    </option>
                                ))}
                            </select>

                            <div className="flex items-center mb-1">
                                <input
                                    type="checkbox"
                                    id="showArchived"
                                    checked={showArchived}
                                    onChange={(e) => setShowArchived(e.target.checked)}
                                    className="rounded border-slate-300 text-primary focus:ring-primary mr-2"
                                />
                                <label htmlFor="showArchived" className="text-xs text-slate-600 cursor-pointer select-none">
                                    Veure cursos arxivats
                                </label>
                            </div>
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
                                <div className="flex items-center gap-3">
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
                                        {t('certificates.students_count', { count: courseStudents.length })}
                                    </span>
                                    {selectedStudents.length > 0 && (
                                        <button
                                            onClick={handleGenerateSelected}
                                            className="bg-primary hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center shadow-sm"
                                        >
                                            <span className="material-icons-outlined text-sm mr-1">file_download</span>
                                            Generar ({selectedStudents.length})
                                        </button>
                                    )}
                                </div>
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
                                                <th className="px-6 py-3 w-10">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={courseStudents.length > 0 && selectedStudents.length === courseStudents.length}
                                                        className="rounded border-slate-300 text-primary focus:ring-primary"
                                                    />
                                                </th>
                                                <th className="px-6 py-3">{t('certificates.table.student')}</th>
                                                <th className="px-6 py-3">{t('certificates.table.dni')}</th>
                                                <th className="px-6 py-3">{t('certificates.table.attendance')}</th>
                                                <th className="px-6 py-3 text-right">{t('certificates.table.actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {courseStudents.map(student => (
                                                <tr key={student.id} className="hover:bg-slate-50">
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents.includes(student.id)}
                                                            onChange={() => handleSelectStudent(student.id)}
                                                            className="rounded border-slate-300 text-primary focus:ring-primary"
                                                        />
                                                    </td>
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
                            {certificateLogs && certificateLogs.length > 0 ? certificateLogs.map(log => (
                                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">task_alt</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{log.courseName}</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">person</span> {log.studentName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600">
                                            {log.createdAt?.toDate ? log.createdAt.toDate().toLocaleDateString() : 'Avui'}
                                        </p>
                                        <p className="text-[10px] text-slate-400">{log.signatureUsed}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No hi ha registres recents.
                                </div>
                            )}
                        </div>
                        {certificateLogs.length >= 50 && (
                            <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
                                <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center justify-center w-full">
                                    {t('certificates.history.load_more')} <span className="material-icons-outlined text-xs ml-1">expand_more</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>

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

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                footer={
                    <div className="flex gap-2">
                        <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
                            {modalConfig.cancelText}
                        </button>
                        {/* Only show confirm button if onConfirm is present */}
                        {modalConfig.onConfirm && (
                            <button
                                onClick={handleConfirmModal}
                                className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm ${modalConfig.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                                    modalConfig.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                                        'bg-primary hover:bg-blue-700'
                                    }`}
                            >
                                {modalConfig.confirmText}
                            </button>
                        )}
                    </div>
                }
            >
                <div className="p-4 text-slate-600">
                    {modalConfig.message}
                </div>
            </Modal>
        </div>
    );
};

export default Certificates;
