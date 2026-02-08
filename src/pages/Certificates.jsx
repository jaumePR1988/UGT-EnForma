import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import SignatureManager from '../components/certificates/SignatureManager';
import { generateCertificate } from '../utils/CertificateGenerator';
import { studentService } from '../services/studentService';

const Certificates = ({ onNavigate, toggleDarkMode, courses = [], students = [] }) => {
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [courseStudents, setCourseStudents] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const handleGeneratePDF = (student) => {
        if (!selectedSignature) {
            alert("Si us plau, selecciona una firma primer.");
            return;
        }

        const stats = calculateAttendance(student, selectedCourseId);
        if (!stats.eligible) {
            const confirmForce = window.confirm(
                `Aquest alumne té un ${stats.percentage}% d'assistència (Mínim: ${stats.minPercentage}%).\nVols generar el certificat igualment?`
            );
            if (!confirmForce) return;
        }

        const course = availableCourses.find(c => c.id === selectedCourseId);
        if (student && course) {
            generateCertificate(student, course, selectedSignature);
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
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="certificates" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestió de Certificats</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Emissió i seguiment de les titulacions oficials</p>
                    </div>
                </header>

                <div className="space-y-8">
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: Configuration */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Course Selector */}
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                                    <span className="material-icons-outlined mr-2 text-primary">school</span>
                                    Seleccionar Curs
                                </h3>
                                <select
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                >
                                    <option value="">-- Tria un curs --</option>
                                    {availableCourses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-2">
                                    Selecciona el curs per carregar la llista d'alumnes aptes.
                                </p>
                            </div>

                            {/* Signature Manager */}
                            <SignatureManager onSelectSignature={setSelectedSignature} />
                        </div>

                        {/* RIGHT COLUMN: Student List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                                        <span className="material-icons-outlined mr-2 text-primary">people</span>
                                        Llistat d'Alumnes
                                    </h3>
                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                                        {courseStudents.length} alumnes
                                    </span>
                                </div>

                                {loading ? (
                                    <div className="p-10 text-center text-slate-500">
                                        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full mb-2"></div>
                                        <p>Carregant dades...</p>
                                    </div>
                                ) : !selectedCourseId ? (
                                    <div className="p-10 text-center text-slate-400">
                                        <span className="material-icons-outlined text-4xl mb-2">arrow_back</span>
                                        <p>Selecciona un curs per començar</p>
                                    </div>
                                ) : courseStudents.length === 0 ? (
                                    <div className="p-10 text-center text-slate-500">
                                        <p>No s'han trobat alumnes registrats en aquest curs.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase">
                                                    <th className="px-6 py-3">Alumne</th>
                                                    <th className="px-6 py-3">DNI</th>
                                                    <th className="px-6 py-3">Assistència</th>
                                                    <th className="px-6 py-3 text-right">Accions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {courseStudents.map(student => (
                                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
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
                                                                                (Mín. {stats.minPercentage}%)
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

                                                                let title = "Generar PDF";
                                                                if (!selectedSignature) title = "Selecciona una firma primer";
                                                                else if (isForce) title = `Forçar generació (${stats.percentage}% < ${stats.minPercentage}%)`;

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
                                                                        {isForce ? 'Forçar PDF' : 'PDF'}
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
                            <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                                <span className="material-icons-outlined mr-2 text-slate-400">history</span>
                                Historial de Certificats Enviats
                            </h2>
                            <div className="relative">
                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">filter_list</span>
                                <input className="pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg outline-none w-48 transition-all" placeholder="Filtrar historial..." type="text" />
                            </div>
                        </div>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">task_alt</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Dret Laboral i Sindicalització</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">mail</span> 14 certificats enviats correctament
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Avui, 09:45</p>
                                        <button className="text-xs text-primary font-semibold hover:underline mt-1">Detalls</button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">task_alt</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Igualtat a l'Empresa</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">mail</span> 22 certificats enviats correctament
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Ahir, 16:30</p>
                                        <button className="text-xs text-primary font-semibold hover:underline mt-1">Detalls</button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-full">
                                            <span className="material-icons-outlined text-xl leading-none">warning</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Riscos Laborals Avançat</p>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                                                <span className="material-icons-outlined text-[12px] mr-1">mail</span> 8/10 enviats (2 errors)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">10 Juny, 11:20</p>
                                        <button className="text-xs text-primary font-semibold hover:underline mt-1 text-orange-600">Reintentar</button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-200 dark:border-slate-800">
                                <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center justify-center w-full">
                                    CARREGAR MÉS REGISTRES <span className="material-icons-outlined text-xs ml-1">expand_more</span>
                                </button>
                            </div>
                        </div>
                    </section>
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

export default Certificates;
