import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Calendar, Clock, MapPin, QrCode, Star, CheckCircle } from 'lucide-react';
import { AttendanceQR } from '../attendance/AttendanceQR';
import { FeedbackQR } from '../feedback/FeedbackQR';

export const CourseSessionsManager = ({ isOpen, onClose, course }) => {
    const [selectedSessionForAttendance, setSelectedSessionForAttendance] = useState(null);
    const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState(null);
    const [showFinalFeedbackQR, setShowFinalFeedbackQR] = useState(false);

    if (!course || !course.sessions) return null;

    // Sort sessions by date
    const sessions = [...course.sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const today = new Date().toISOString().split('T')[0];

    const isPastSession = (date) => date < today;
    const isTodaySession = (date) => date === today;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={`Gestió de Sessions: ${course.name}`}
                className="max-w-4xl"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Total Sessions</h4>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{sessions.length}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-1">Completades</h4>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                {sessions.filter(s => s.date < today).length}
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h4 className="text-sm font-bold text-slate-500 mb-1">Propera Sessió</h4>
                            <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
                                {sessions.find(s => s.date >= today)?.date || 'Curs finalitzat'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {sessions.map((session, index) => {
                            const isLastSession = index === sessions.length - 1;
                            const status = isPastSession(session.date) ? 'completed' : isTodaySession(session.date) ? 'today' : 'upcoming';

                            return (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl border transition-all ${status === 'today'
                                        ? 'bg-white dark:bg-card-dark border-blue-500 shadow-md ring-1 ring-blue-500/20'
                                        : status === 'completed'
                                            ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75'
                                            : 'bg-white dark:bg-card-dark border-slate-200 dark:border-slate-700'
                                        }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${status === 'today' ? 'bg-blue-100 text-blue-700' :
                                                    status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {status === 'today' ? 'Avui' : status === 'completed' ? 'Realitzada' : 'Pendent'}
                                                </span>
                                                <h4 className="font-bold text-slate-800 dark:text-white">Sessió {index + 1}</h4>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {new Date(session.date).toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {session.startTime} - {session.endTime}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} />
                                                    {session.location || 'Ubicació per definir'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                onClick={() => setSelectedSessionForAttendance(session)}
                                            >
                                                <QrCode size={16} />
                                                <span className="hidden sm:inline">Assistència</span>
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex items-center gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-200 dark:hover:border-yellow-800 hover:text-yellow-700 dark:hover:text-yellow-400"
                                                onClick={() => setSelectedSessionForFeedback(session)}
                                            >
                                                <Star size={16} />
                                                <span className="hidden sm:inline">Valorar</span>
                                            </Button>

                                            {isLastSession && (
                                                <Button
                                                    size="sm"
                                                    className="bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-900 flex items-center gap-2 ml-2"
                                                    onClick={() => setShowFinalFeedbackQR(true)}
                                                >
                                                    <CheckCircle size={16} />
                                                    <span className="hidden sm:inline">Valoració Final</span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Modal>

            {/* Reutilizamos el modal de QR de asistencia existente por ahora, pasando la sesión si es necesario */}
            {selectedSessionForAttendance && (
                <AttendanceQR
                    isOpen={!!selectedSessionForAttendance}
                    onClose={() => setSelectedSessionForAttendance(null)}
                    course={course}
                    session={selectedSessionForAttendance} // Pasamos la sesión específica
                />
            )}

            {/* Feedback QR for specific session */}
            {selectedSessionForFeedback && (
                <FeedbackQR
                    isOpen={!!selectedSessionForFeedback}
                    onClose={() => setSelectedSessionForFeedback(null)}
                    course={course}
                    session={selectedSessionForFeedback}
                    type="session"
                />
            )}

            {/* Final Course Feedback QR */}
            {showFinalFeedbackQR && (
                <FeedbackQR
                    isOpen={showFinalFeedbackQR}
                    onClose={() => setShowFinalFeedbackQR(false)}
                    course={course}
                    session={sessions[sessions.length - 1]} // Pass last session context
                    type="course"
                />
            )}
        </>
    );
};
