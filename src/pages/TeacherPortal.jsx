import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { AttendanceQR } from '../components/attendance/AttendanceQR';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { courseService } from '../services/courseService';
import { instructorService } from '../services/instructorService';
import { CourseAttendanceModal } from '../components/attendance/CourseAttendanceModal';
import { CourseSessionsManager } from '../components/courses/CourseSessionsManager';
import { Modal } from '../components/ui/Modal';
import { Users, QrCode, Calendar, MapPin, Clock, ChevronRight, List } from 'lucide-react';

const TeacherPortal = ({ onNavigate, toggleDarkMode }) => {
    // State for instructors
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Attendance Modal State
    const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // QR Modal State
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    // Sessions Manager Modal State
    const [sessionsModalOpen, setSessionsModalOpen] = useState(false);

    useEffect(() => {
        loadInstructors();
    }, []);

    useEffect(() => {
        if (selectedInstructor) {
            loadCourses();
        } else {
            setCourses([]);
        }
    }, [selectedInstructor]);

    const loadInstructors = async () => {
        try {
            const data = await instructorService.getInstructors();
            setInstructors(data);
            if (data.length > 0) {
                setSelectedInstructor(data[0].name);
            }
        } catch (error) {
            console.error("Error loading instructors:", error);
        }
    };

    const loadCourses = async () => {
        setLoading(true);
        try {
            // Fetch all courses and filter by instructor (simulating backend filter)
            const allCourses = await courseService.getCourses();
            const teacherCourses = allCourses.filter(c =>
                c.instructor && c.instructor.toLowerCase().includes(selectedInstructor.toLowerCase().split(' ')[0].toLowerCase())
            );
            setCourses(teacherCourses);
        } catch (error) {
            console.error("Error loading courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAttendance = (course) => {
        setSelectedCourse(course);
        setAttendanceModalOpen(true);
    };

    const handleOpenQR = (course) => {
        setSelectedCourse(course);

        // Find if there is a session today to pass it to the QR
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const todaySession = course.sessions?.find(s => s.date === todayStr);
        setSelectedSession(todaySession || null);

        setQrModalOpen(true);
    };

    // Helper to find next session
    const getNextSession = (course) => {
        if (!course.sessions || course.sessions.length === 0) return null;

        const sortedSessions = [...course.sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
        const todayStr = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in most environments, but let's be safe
        const todayNum = new Date();
        const yNum = todayNum.getFullYear();
        const mNum = String(todayNum.getMonth() + 1).padStart(2, '0');
        const dNum = String(todayNum.getDate()).padStart(2, '0');
        const manualTodayStr = `${yNum}-${mNum}-${dNum}`;

        // Find first session today or in future
        const next = sortedSessions.find(s => s.date >= manualTodayStr);
        return next || sortedSessions[sortedSessions.length - 1]; // Return last if all finished
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="teachers" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Users size={32} />
                            </span>
                            Portal del Docent
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Gestiona les teves sessions formatives i l'assistència dels alumnes</p>
                    </div>

                    {/* Instructor Simulator */}
                    <div className="flex items-center gap-3 bg-white dark:bg-card-dark p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-2">Simular com a:</span>
                        <select
                            className="bg-transparent font-bold text-slate-800 dark:text-white outline-none cursor-pointer"
                            value={selectedInstructor}
                            onChange={(e) => setSelectedInstructor(e.target.value)}
                        >
                            {instructors.map(inst => (
                                <option key={inst.id} value={inst.name}>{inst.name}</option>
                            ))}
                        </select>
                    </div>
                </header>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                        Els meus Cursos Assignats
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <Users size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-lg font-medium text-slate-500">No tens cursos assignats actualment com a {selectedInstructor}.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 flex-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map(course => {
                                const nextSession = getNextSession(course);
                                const isToday = nextSession?.date === new Date().toISOString().split('T')[0];

                                return (
                                    <div key={course.id} className="relative flex flex-col h-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                                        <div className={`absolute top-0 left-0 w-full h-1 ${isToday ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg w-fit ${course.status === 'En curs' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {course.status || 'Programat'}
                                                    </span>
                                                    {course.sessions && (
                                                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
                                                            Sessió: {course.sessions.filter(s => s.date < new Date().toISOString().split('T')[0]).length}/{course.sessions.length}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-mono text-slate-400">{course.code}</span>
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight" title={course.name}>
                                                {course.name}
                                            </h3>

                                            <div className="space-y-3 mt-auto pt-4">
                                                <div className={`flex items-start gap-3 text-sm p-3 rounded-xl transition-colors ${isToday ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' : 'bg-slate-50 dark:bg-slate-800/50 border border-transparent'}`}>
                                                    <Calendar size={18} className={`mt-0.5 ${isToday ? 'text-red-600' : 'text-slate-400'}`} />
                                                    <div>
                                                        <p className={`font-bold text-sm ${isToday ? 'text-red-700 dark:text-red-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {nextSession ? new Date(nextSession.date).toLocaleDateString('ca-ES', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Sense dates'}
                                                            {isToday && <span className="ml-2 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded uppercase">Avui</span>}
                                                        </p>
                                                        {nextSession && (
                                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                                                                <Clock size={12} className="text-slate-400" />
                                                                <span>{nextSession.startTime} - {nextSession.endTime}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {nextSession?.location && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 px-2 text-right">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        <span className="truncate">{nextSession.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/30">
                                            {isToday ? (
                                                <Button
                                                    className="col-span-2 w-full flex items-center justify-center gap-2 text-xs font-black bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 dark:hover:shadow-none h-11 mb-1 animate-pulse"
                                                    onClick={() => handleOpenQR(course)}
                                                >
                                                    <QrCode size={18} />
                                                    QR ASSISTÈNCIA D'AVUI
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className="col-span-2 w-full flex items-center justify-center gap-2 text-xs font-bold border-slate-200 hover:bg-white hover:border-slate-300 transition-all h-9 mb-1"
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setSessionsModalOpen(true);
                                                    }}
                                                >
                                                    <List size={16} />
                                                    Gestionar Sessions i QRs
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center justify-center gap-2 text-xs font-bold border-slate-200 hover:bg-white hover:border-slate-300 transition-all h-9"
                                                onClick={() => {
                                                    if (isToday) {
                                                        setSelectedCourse(course);
                                                        setSessionsModalOpen(true);
                                                    } else {
                                                        handleOpenQR(course);
                                                    }
                                                }}
                                            >
                                                {isToday ? <List size={16} /> : <QrCode size={16} />}
                                                {isToday ? 'Programació' : 'QR Ràpid'}
                                            </Button>
                                            <Button
                                                className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-slate-900 text-white hover:bg-black transition-all shadow-md hover:shadow-lg h-9"
                                                onClick={() => handleOpenAttendance(course)}
                                            >
                                                <Users size={16} />
                                                Llistat
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="col-span-2 w-full flex items-center justify-center gap-2 text-xs font-bold border-red-100 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-all h-9 mt-1"
                                                onClick={async () => {
                                                    try {
                                                        const { generateCourseReport } = await import('../utils/CourseReportGenerator');
                                                        const { studentService } = await import('../services/studentService');
                                                        const { feedbackService } = await import('../services/feedbackService');

                                                        // Show simple loading feedback (could be better)
                                                        const originalText = document.activeElement.innerText;
                                                        document.activeElement.innerText = 'Generant...';

                                                        const students = await studentService.getStudentsByCourse(course.id);
                                                        const feedbackStats = await feedbackService.getCourseRatingStats(course.id);

                                                        await generateCourseReport(course, students, feedbackStats);
                                                        document.activeElement.innerText = originalText;
                                                    } catch (error) {
                                                        console.error("Error generating report:", error);
                                                        alert("Error al generar l'informe: " + error.message);
                                                    }
                                                }}
                                            >
                                                <span className="material-icons-outlined text-sm">picture_as_pdf</span>
                                                Informe Premium
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Attendance Modal (Reused) */}
            {selectedCourse && (
                <CourseAttendanceModal
                    isOpen={attendanceModalOpen}
                    onClose={() => setAttendanceModalOpen(false)}
                    course={selectedCourse}
                />
            )}

            {/* Premium QR Attendance Modal */}
            {selectedCourse && (
                <AttendanceQR
                    isOpen={qrModalOpen}
                    onClose={() => setQrModalOpen(false)}
                    course={selectedCourse}
                    session={selectedSession}
                />
            )}

            {/* Course Sessions Manager Modal */}
            {selectedCourse && (
                <CourseSessionsManager
                    isOpen={sessionsModalOpen}
                    onClose={() => setSessionsModalOpen(false)}
                    course={selectedCourse}
                />
            )}
        </div>
    );
};

export default TeacherPortal;
