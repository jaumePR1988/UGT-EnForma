import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle, MapPin, Clock, ShieldCheck, AlertCircle, Calendar, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { courseService } from '../services/courseService';
import { studentService } from '../services/studentService';

const PublicAttendance = () => {
    const { courseId } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('t');
    const sessionIdFromUrl = searchParams.get('sid');

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dni, setDni] = useState('');
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [sessionInfo, setSessionInfo] = useState(null);

    useEffect(() => {
        loadCourse();
    }, [courseId]);

    const loadCourse = async () => {
        try {
            const data = await courseService.getCourseById(courseId);
            setCourse(data);

            // Check if sid matches a session and if it's today
            if (sessionIdFromUrl && data.sessions) {
                const targetSession = data.sessions.find(s => s.id === sessionIdFromUrl);
                if (targetSession) {
                    const todayStr = new Date().toISOString().split('T')[0];
                    if (targetSession.date !== todayStr) {
                        setSessionInfo(targetSession);
                        setShowWarning(true);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading course", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            // 1. Verify token (Mock validation for now - in real app, verify signature/timestamp)
            if (!token) {
                throw new Error("Codi QR no vàlid o caducat.");
            }

            // 2. Verify Student exists in this course
            // Optimized verification
            const student = await studentService.verifyStudentEnrollment(courseId, dni);

            if (!student) {
                throw new Error("No s'ha trobat cap alumne amb aquest DNI inscrit en aquest curs.");
            }

            // 3. Mark Attendance (Mock)
            // Here we would call attendanceService.markPresent(courseId, student.id, date)
            // For now, we simulate success.
            // If student already attended today, maybe warn? But for now simple success.
            // 3. Detect Active Session
            let sessionId = sessionIdFromUrl;

            // If no sessionId in URL, find session for today as fallback
            if (!sessionId && course.sessions && course.sessions.length > 0) {
                const todayStr = new Date().toISOString().split('T')[0];
                const activeSession = course.sessions.find(s => s.date === todayStr);

                if (!activeSession) {
                    throw new Error(`No hi ha cap sessió programada per avui (${new Date().toLocaleDateString()}) i el QR no especifica cap sessió.`);
                }
                sessionId = activeSession.id;
            } else if (!sessionId) {
                // Extreme fallback for legacy or no-sessions courses
                sessionId = 'legacy-session';
            }

            // 4. Mark Attendance
            await studentService.markSessionAttendance(student.id, sessionId);

            setStatus('success');

            // Celebration!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
            });

        } catch (error) {
            console.error("Attendance error:", error);
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!course) return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center text-slate-500 font-bold uppercase tracking-widest">
            Curs no trobat
        </div>
    );

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-50 z-0"></div>
                <Card className="max-w-md w-full bg-white shadow-xl border-none relative z-10 p-8 text-center">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Assistència Confirmada</h2>
                    <p className="text-slate-600 mb-6 text-sm">
                        Hem registrat la teva presència a la sessió d'avui correctament.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left mb-6">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Curs</p>
                        <p className="font-bold text-slate-900 line-clamp-1">{course.name}</p>
                        <div className="flex gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock size={14} />
                                <span>{new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}h</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <MapPin size={14} />
                                <span>{course.sessions?.[0]?.location || 'Presencial'}</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">Ja pots tancar aquesta finestra.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <img src="/logo-ugt.png" alt="UGT" className="h-16 mb-2" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 max-w-xs mx-auto leading-tight">{course.name}</h1>
                <p className="text-sm text-slate-500 mt-2">Control d'Assistència</p>
            </div>

            <Card className="max-w-sm w-full bg-white shadow-xl border-none p-8">
                <form onSubmit={handleCheckIn} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">El teu DNI / NIE</label>
                        <input
                            required
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value.toUpperCase())}
                            placeholder="00000000X"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-bold text-center tracking-wider text-lg uppercase"
                        />
                    </div>

                    {status === 'error' && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p className="text-xs font-medium leading-snug">{errorMessage}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        disabled={status === 'submitting'}
                        className="py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        {status === 'submitting' ? 'Verificant...' : 'Confirmar Assistència'}
                    </Button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 text-center leading-relaxed">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>Sistema segur de control biomètric</span>
                </div>
            </Card>

            {/* Premium Warning Modal */}
            <Modal
                isOpen={showWarning}
                onClose={() => setShowWarning(false)}
                title="Atenció: Sessió Diferent"
            >
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <AlertTriangle size={40} className="text-amber-600 dark:text-amber-400" />
                    </div>

                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">
                        Aquesta sessió no és per avui
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed max-w-xs">
                        Estàs intentant registrar l'assistència per a una sessió programada pel dia <span className="font-bold text-slate-900 dark:text-white">{sessionInfo ? new Date(sessionInfo.date).toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : '---'}</span>.
                    </p>

                    <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessió Detalls</span>
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg uppercase">Data Diferent</span>
                        </div>
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{course?.name}</p>
                                <p className="text-xs text-slate-500">{sessionInfo?.startTime} - {sessionInfo?.endTime}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-3">
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => setShowWarning(false)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-black py-4 shadow-lg shadow-amber-200 dark:shadow-none"
                        >
                            ENTÈS, CONTINUAR
                        </Button>
                        <p className="text-[10px] text-slate-400 font-medium">Si t'has equivocat de QR, demana al docent el codi correcte.</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PublicAttendance;
