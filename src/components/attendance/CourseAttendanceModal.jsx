import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { studentService } from '../../services/studentService';
import { Check, X, Users, Loader2, Save, QrCode, ClipboardList, AlertCircle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const qrcodeRegionId = "html5qr-code-full-region";

const QRScanner = ({ onScanSuccess, onScanError }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            qrcodeRegionId,
            { fps: 10, qrbox: 250 },
            /* verbose= */ false
        );
        scanner.render(onScanSuccess, onScanError);

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
        };
    }, []);

    return <div id={qrcodeRegionId} className="w-full bg-black rounded-xl overflow-hidden shadow-lg border-2 border-slate-200" />;
};

export const CourseAttendanceModal = ({ isOpen, onClose, course }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'camera'
    const [scanFeedback, setScanFeedback] = useState(null); // { type: 'success' | 'error' | 'warning', message: string, studentName?: string }

    useEffect(() => {
        let unsubscribe = () => { };

        if (isOpen && course) {
            setLoading(true);
            setActiveTab('manual');
            setScanFeedback(null);

            // Subscribe to real-time updates
            try {
                // The service returns the unsubscribe function directly (or a promise resolving to it if async, but onSnapshot is sync-ish return)
                // My service implementation was synchronous return of onSnapshot.
                const sub = studentService.subscribeToStudentsByCourse(course.id, (data) => {
                    setStudents(data);
                    setLoading(false);
                });
                if (sub) unsubscribe = sub;
            } catch (error) {
                console.error("Error subscribing to course students:", error);
                setLoading(false);
            }
        }

        return () => {
            unsubscribe();
        };
    }, [isOpen, course]);

    // Helper: Determine the active session for "today"
    const getActiveSession = () => {
        if (!course?.sessions?.length) return null;
        const today = new Date().toISOString().split('T')[0];
        return course.sessions.find(s => s.date === today);
    };

    // Helper: Calculate stats
    const getStudentStats = (student) => {
        const totalSessions = course?.sessions?.length || 1;
        // Check new array 'attendanceSessions' OR legacy 'attended'
        const legacyAttended = student.attended ? 1 : 0;
        const sessionAttendedCount = student.attendanceSessions?.length || legacyAttended;
        // Avoid double counting if legacy and array exist (though they shouldn't conflict much)
        // If array exists, trust it. If not, trust legacy.
        const count = student.attendanceSessions ? student.attendanceSessions.length : legacyAttended;

        const percentage = Math.round((count / totalSessions) * 100);
        const activeSession = getActiveSession();
        const attendedToday = activeSession
            ? student.attendanceSessions?.includes(activeSession.id)
            : student.attended; // Fallback to legacy boolean if no sessions defined

        return { count, percentage, attendedToday };
    };

    // loadStudents removed as it is replaced by subscription

    const playSound = (type) => {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        if (type === 'success') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.1);
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(context.currentTime + 0.15);
        } else if (type === 'error') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, context.currentTime);
            oscillator.frequency.linearRampToValueAtTime(100, context.currentTime + 0.2);
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(context.currentTime + 0.3);
        } else if (type === 'warning') {
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(400, context.currentTime);
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(context.currentTime + 0.2);
        }

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
    };

    const handleScan = (decodedText) => {
        // Prevent re-scanning quickly if strictly needed, but let's allow "agile" re-scanning
        // decodedText should be the student ID
        const studentId = decodedText;
        const student = students.find(s => s.id === studentId);

        if (student) {
            if (student.attended) {
                setScanFeedback({
                    type: 'warning',
                    message: 'Ja marcat anteriorment',
                    studentName: student.fullName
                });
                playSound('warning');
            } else {
                // Mark as attended
                toggleAttendance(studentId, true); // Force true
                setScanFeedback({
                    type: 'success',
                    message: 'Assistència registrada correctament',
                    studentName: student.fullName
                });
                playSound('success');
                // Auto-save this single change for safety/utility? 
                // Currently toggleAttendance just updates local state. 
                // For agility, maybe we should trigger a background save or just rely on the final "Save" button?
                // The user asked for agility. If the crash happens, data loss.
                // Let's stick to local state for speed, but add a "Remember to Save" indicator if needed.
                // Or better: auto-save individual scans in background.
                studentService.updateStudent(studentId, { attended: true }).catch(console.error);
            }
        } else {
            setScanFeedback({
                type: 'error',
                message: 'No trobat en aquest curs',
                studentName: 'Codi desconegut'
            });
            playSound('error');
        }

        // Clear feedback after 3 seconds
        setTimeout(() => setScanFeedback(null), 3000);
    };

    const toggleAttendance = async (studentId) => {
        const student = students.find(s => s.id === studentId);
        const activeSession = getActiveSession();
        const stats = getStudentStats(student);
        const isAttending = !stats.attendedToday; // Toggle

        // Optimistic UI Update
        const updatedStudents = students.map(s => {
            if (s.id === studentId) {
                // Mock update for UI
                let newSessions = s.attendanceSessions || [];
                if (activeSession) {
                    if (isAttending) newSessions = [...newSessions, activeSession.id];
                    else newSessions = newSessions.filter(id => id !== activeSession.id);
                }
                return { ...s, attendanceSessions: newSessions, attended: isAttending };
            }
            return s;
        });
        setStudents(updatedStudents);

        // Server Update
        try {
            if (activeSession) {
                if (isAttending) {
                    await studentService.markSessionAttendance(studentId, activeSession.id);
                } else {
                    await studentService.removeSessionAttendance(studentId, activeSession.id);
                }
            } else {
                // Fallback for legacy courses without sessions
                await studentService.updateStudent(studentId, { attended: isAttending });
            }
        } catch (error) {
            console.error("Error updating attendance:", error);
            // Revert on error? For now just log.
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const promises = students.map(s =>
                studentService.updateStudent(s.id, { attended: !!s.attended })
            );
            await Promise.all(promises);
            onClose();
        } catch (error) {
            console.error("Error saving attendance:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Gestió d'Assistència: ${course?.title}`}
            maxWidth="3xl"
            footer={
                <div className="flex gap-2 justify-between w-full">
                    <span className="text-xs text-slate-400 flex items-center">
                        {students.filter(s => s.attended).length} / {students.length} assistents
                    </span>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose} disabled={saving}>Tancar</Button>
                        <Button variant="primary" onClick={handleSave} disabled={saving || loading}>
                            {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                            Desar
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="min-h-[400px]">
                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'manual' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <ClipboardList size={18} className="mr-2" />
                        Llistat Manual
                    </button>
                    <button
                        onClick={() => setActiveTab('camera')}
                        className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'camera' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <QrCode size={18} className="mr-2" />
                        Escanejar QR
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="animate-spin mb-4" size={32} />
                        <p className="text-sm font-bold uppercase tracking-widest">Carregant llista d'alumnes...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'manual' && (
                            students.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <Users size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-bold">No hi ha alumnes inscrits en aquest curs.</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-xl mb-4 sticky top-0 z-10">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumne / Empresa</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assistència</span>
                                    </div>
                                    {students.map(student => {
                                        const stats = getStudentStats(student);
                                        return (
                                            <div
                                                key={student.id}
                                                className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${stats.attendedToday ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{student.fullName || student.name || 'Alumne sense nom'}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                                                            {stats.percentage}% Assistència
                                                        </span>
                                                        {student.company && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 font-bold">{student.company}</span>}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleAttendance(student.id)}
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${stats.attendedToday
                                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                        }`}
                                                    title={getActiveSession() ? "Marcar assistència per sessió d'avui" : "Marcar assistència general"}
                                                >
                                                    {stats.attendedToday ? <Check size={20} strokeWidth={3} /> : <X size={20} />}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        )}

                        {activeTab === 'camera' && (
                            <div className="flex flex-col items-center justify-start h-full">
                                <div className="w-full max-w-sm mx-auto mb-6 relative">
                                    <QRScanner onScanSuccess={handleScan} onScanError={(err) => console.warn(err)} />

                                    {/* Scan Feedback Overlay */}
                                    {scanFeedback && (
                                        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20 rounded-xl animate-in fade-in zoom-in duration-200 border-4 ${scanFeedback.type === 'success' ? 'border-emerald-500' :
                                            scanFeedback.type === 'warning' ? 'border-amber-500' : 'border-red-500'
                                            }`}>
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${scanFeedback.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                                scanFeedback.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {scanFeedback.type === 'success' && <Check size={40} strokeWidth={4} />}
                                                {scanFeedback.type === 'warning' && <AlertCircle size={40} strokeWidth={3} />}
                                                {scanFeedback.type === 'error' && <X size={40} strokeWidth={4} />}
                                            </div>
                                            <h3 className={`text-xl font-black mb-1 ${scanFeedback.type === 'success' ? 'text-emerald-700' :
                                                scanFeedback.type === 'warning' ? 'text-amber-700' : 'text-red-700'
                                                }`}>
                                                {scanFeedback.type === 'success' ? 'ASSISTÈNCIA OK' :
                                                    scanFeedback.type === 'warning' ? 'JA REGISTRAT' : 'ERROR'}
                                            </h3>
                                            <p className="text-slate-600 font-bold text-center px-4">{scanFeedback.studentName}</p>
                                            <p className="text-xs text-slate-400 mt-2">{scanFeedback.message}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center text-slate-500 text-sm max-w-xs mx-auto">
                                    Enfoca el codi QR de l'alumne per marcar l'assistència automàticament.
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Modal>
    );
};
