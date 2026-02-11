import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/layout/Sidebar';
import { feedbackService } from '../services/feedbackService';

const Dashboard = ({ onNavigate, toggleDarkMode, courses, students = [] }) => {
    const { t, i18n } = useTranslation();

    // Helper to get the Monday of the current week
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // If Sunday, go back 6 days, else go back to Mon (1)
        return new Date(d.setDate(diff));
    };

    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));

    const formatWeekRange = (startDate) => {
        const endOfWeek = new Date(startDate);
        endOfWeek.setDate(startDate.getDate() + 4); // Friday

        const locale = i18n.language === 'ca' ? 'ca-ES' : 'es-ES';
        const startMonth = startDate.toLocaleDateString(locale, { month: 'long' });
        const endMonth = endOfWeek.toLocaleDateString(locale, { month: 'long' });

        if (startMonth === endMonth) {
            return `${startDate.getDate()} - ${endOfWeek.getDate()} ${startMonth} ${startDate.getFullYear()} `;
        } else {
            return `${startDate.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth} ${startDate.getFullYear()} `;
        }
    };

    // --- Derived Data for Stats ---
    const pendingCertificates = 0; // Future feature

    // Feedback Stats State
    const [averageRating, setAverageRating] = useState('0.0');
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);

    useEffect(() => {
        loadFeedbackStats();
    }, []);

    const loadFeedbackStats = async () => {
        try {
            const stats = await feedbackService.getGlobalRatingStats();
            setAverageRating(stats.average);
            setTotalFeedbacks(stats.count);
        } catch (error) {
            console.error("Error loading feedback stats:", error);
        }
    };

    // --- Recent Activity Logic ---
    const getRecentActivity = () => {
        const studentEvents = students.map(s => ({
            type: 'registration',
            title: t('dashboard.activity.new_registration', 'Nova inscripció'),
            subtitle: `${s.fullName} ${t('dashboard.activity.registered_in', "s'ha inscrit a")} "${(i18n.language === 'es' && courses.find(c => c.id === s.courseId)?.name_es) || s.courseTitle || 'Un curs'}"`,
            date: s.registeredAt ? (s.registeredAt.seconds ? new Date(s.registeredAt.seconds * 1000) : new Date(s.registeredAt)) : new Date(),
            color: 'bg-green-500'
        }));

        const courseEvents = courses.map(c => ({
            type: 'course',
            title: t('dashboard.activity.new_course', 'Nou curs publicat'),
            subtitle: `"${(i18n.language === 'es' && c.name_es) || c.name}" ${t('dashboard.activity.is_visible', 'ja és visible')} `,
            date: c.createdAt ? (c.createdAt.seconds ? new Date(c.createdAt.seconds * 1000) : new Date(c.createdAt)) : new Date(),
            color: 'bg-blue-500'
        }));

        const allEvents = [...studentEvents, ...courseEvents];
        allEvents.sort((a, b) => b.date - a.date);
        return allEvents.slice(0, 5);
    };

    const recentActivity = getRecentActivity();

    // --- Goal Calculation ---
    const QUARTERLY_GOAL = 50; // Set a realistic goal for demo
    const goalPercentage = Math.min(100, Math.round((students.length / QUARTERLY_GOAL) * 100));

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return t('common.time_ago.years', 'Fa {{count}} anys', { count: Math.floor(interval) });
        interval = seconds / 2592000;
        if (interval > 1) return t('common.time_ago.months', 'Fa {{count}} mesos', { count: Math.floor(interval) });
        interval = seconds / 86400;
        if (interval > 1) return t('common.time_ago.days', 'Fa {{count}} dies', { count: Math.floor(interval) });
        interval = seconds / 3600;
        if (interval > 1) return t('common.time_ago.hours', 'Fa {{count}} hores', { count: Math.floor(interval) });
        interval = seconds / 60;
        if (interval > 1) return t('common.time_ago.minutes', 'Fa {{count}} minuts', { count: Math.floor(interval) });
        return t('common.time_ago.just_now', "Fa un moment");
    };
    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">{t('dashboard.title', "Panell de Control")}</h1>
                    <p className="text-slate-500 font-medium">{t('dashboard.subtitle', "Resum de l'activitat de la Secretaria de Formació")}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Enrollment Courses KPI */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <span className="material-icons-outlined text-[20px]">how_to_reg</span>
                        </div>
                    </div>
                    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{t('dashboard.kpi.enrollment_courses', "Cursos en Inscripció")}</h3>
                    <p className="text-2xl font-black mt-1 text-slate-800">
                        {courses ? courses.filter(c => c.status === 'open' || c.status === 'Pendent inici').length : 0}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <span className="material-icons-outlined text-[20px]">play_circle_outline</span>
                        </div>
                    </div>
                    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{t('dashboard.kpi.active_courses', "Cursos Actius")}</h3>
                    <p className="text-2xl font-black mt-1 text-slate-800">
                        {courses ? courses.filter(c => c.status === 'En curs' || c.status === 'active').length : 0}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <span className="material-icons-outlined text-[20px]">groups</span>
                        </div>
                    </div>
                    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{t('dashboard.kpi.total_registrations', "Inscripcions Totals")}</h3>
                    <p className="text-2xl font-black mt-1 text-slate-800">{students.length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-red-50 text-primary rounded-lg">
                            <span className="material-icons-outlined text-[20px]">pending_actions</span>
                        </div>
                    </div>
                    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{t('dashboard.kpi.pending_certificates', "Certificats Pendents")}</h3>
                    <p className="text-2xl font-black mt-1 text-slate-800">
                        {students.filter(s => {
                            const course = courses.find(c => c.id === s.courseId);
                            if (!course) {
                                console.warn("Student without course found:", s.id);
                                return false;
                            }
                            const totalSessions = course.sessions?.length || 1;
                            const attended = s.attendanceSessions?.length || (s.attended ? 1 : 0);
                            const progress = (attended / totalSessions) * 100;
                            const min = course.minAttendancePercentage || 80;
                            return progress >= min && !s.certificateGenerated;
                        }).length}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <span className="material-icons-outlined text-[20px]">star</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{totalFeedbacks} {t('dashboard.kpi.votes', "vots")}</span>
                    </div>
                    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{t('dashboard.kpi.avg_rating', "Valoració Mitjana")}</h3>
                    <p className="text-2xl font-black mt-1 text-slate-800">{averageRating}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="font-bold text-lg flex items-center text-slate-800">
                                <span className="material-icons-outlined mr-2 text-primary">calendar_month</span>
                                {t('dashboard.sections.weekly_calendar', "Calendari Setmanal de Formació")}
                            </h2>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-600"
                                    onClick={() => setCurrentWeekStart(new Date(currentWeekStart.setDate(currentWeekStart.getDate() - 7)))}
                                >
                                    <span className="material-icons-outlined">chevron_left</span>
                                </button>
                                <span className="text-sm font-medium px-2 text-slate-600 min-w-[200px] text-center capitalize">
                                    {formatWeekRange(currentWeekStart)}
                                </span>
                                <button
                                    className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-600"
                                    onClick={() => setCurrentWeekStart(new Date(currentWeekStart.setDate(currentWeekStart.getDate() + 7)))}
                                >
                                    <span className="material-icons-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        <div className="calendar-grid grid grid-cols-5 divide-x divide-slate-200 user-select-none">
                            {/* Generate 5 days (Mon-Fri) based on currentWeekStart */}
                            {Array.from({ length: 5 }).map((_, index) => {
                                const dayDate = new Date(currentWeekStart);
                                dayDate.setDate(currentWeekStart.getDate() + index);

                                const dayName = dayDate.toLocaleDateString(i18n.language === 'ca' ? 'ca-ES' : 'es-ES', { weekday: 'short' });
                                const dayNumber = dayDate.getDate();

                                // Format YYYY-MM-DD
                                const dateStr = `${dayDate.getFullYear()} -${String(dayDate.getMonth() + 1).padStart(2, '0')} -${String(dayDate.getDate()).padStart(2, '0')} `;

                                // Filter events for this day
                                const dayEvents = courses.reduce((acc, course) => {
                                    // 1. Start Date (Green)
                                    if (course.startDate === dateStr) {
                                        acc.push({ type: 'start', course, color: 'bg-green-100 text-green-700 border-green-500', label: 'Inici' });
                                    }
                                    // 2. End Date (Green)
                                    if (course.endDate === dateStr) {
                                        acc.push({ type: 'end', course, color: 'bg-green-100 text-green-700 border-green-500', label: 'Fi' });
                                    }
                                    // 3. Registration Deadline (Red)
                                    if (course.registrationDeadline === dateStr) {
                                        acc.push({ type: 'deadline', course, color: 'bg-red-100 text-red-700 border-red-500', label: 'Límit Inscripció' });
                                    }
                                    // 4. Sessions (Blue) - NOW CHECKING ALL SESSIONS
                                    if (course.sessions && course.sessions.length > 0) {
                                        const todaysSessions = course.sessions.filter(s => s.date === dateStr);
                                        todaysSessions.forEach(session => {
                                            acc.push({
                                                type: 'session',
                                                course,
                                                session,
                                                color: 'bg-blue-100 text-blue-700 border-blue-500',
                                                label: `Sessió: ${session.startTime} `
                                            });
                                        });
                                    }
                                    return acc;
                                }, []);

                                return (
                                    <div key={index} className="flex flex-col">
                                        <div className="bg-slate-50 p-3 text-center text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                                            {dayName} {dayNumber}
                                        </div>
                                        <div className="bg-white p-2 min-h-[180px] flex-1 space-y-2">
                                            {dayEvents.length > 0 ? dayEvents.map((event, idx) => (
                                                <div key={idx} className={`border - l - 4 p - 2 text - xs rounded mb - 2 shadow - sm ${event.color} `}>
                                                    <div className="flex justify-between items-start">
                                                        <p className="font-bold truncate" title={(i18n.language === 'es' && event.course.name_es) || event.course.name}>
                                                            {(i18n.language === 'es' && event.course.name_es) || event.course.name}
                                                        </p>
                                                    </div>
                                                    <p className="text-[10px] opacity-80 mt-1 font-semibold">{event.label}</p>
                                                </div>
                                            )) : (
                                                <div className="h-full flex items-center justify-center opacity-30">
                                                    <span className="text-[10px] text-slate-400 italic">{t('dashboard.sections.no_courses', "Sense activitat")}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Legend */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-4 text-xs text-slate-600 justify-center">
                            <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> {t('calendar.legend.start_end', 'Inici / Fi de Curs')}</div>
                            <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span> {t('calendar.legend.session', 'Sessió Lectiva')}</div>
                            <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span> {t('calendar.legend.deadline', 'Límit Inscripció')}</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="font-bold text-lg text-slate-800">{t('dashboard.sections.open_courses', "Cursos en fase d'inscripció")}</h2>
                            <a className="text-primary text-sm font-medium hover:underline" href="#">{t('dashboard.sections.view_all', "Veure tots")}</a>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-slate-200">
                            <div className="divide-y divide-slate-200">
                                {courses && courses.filter(c => c.status === 'Pendent inici' || c.status === 'open').length > 0 ? (
                                    courses.filter(c => c.status === 'Pendent inici' || c.status === 'open').map(course => {
                                        const enrolledCount = students.filter(s => s.courseId === course.id).length;
                                        const capacity = course.maxCapacity || 25;
                                        const available = capacity - enrolledCount;
                                        const percentFull = Math.min(100, Math.round((enrolledCount / capacity) * 100));
                                        const percentAvailable = 100 - percentFull;

                                        let availabilityColor = "text-green-600";
                                        if (percentAvailable < 10) availabilityColor = "text-red-600";
                                        else if (percentAvailable < 50) availabilityColor = "text-orange-500";

                                        return (
                                            <div key={course.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {course.heroImage ? (
                                                            <img src={course.heroImage} alt={course.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="material-icons-outlined text-slate-400">
                                                                {course.category === 'Dret Laboral' ? 'gavel' :
                                                                    course.category === 'Prevenció de Riscos' ? 'health_and_safety' :
                                                                        course.category === 'Igualtat i Gènere' ? 'people' : 'school'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-slate-800 truncate max-w-[150px]" title={(i18n.language === 'es' && course.name_es) || course.name}>
                                                            {(i18n.language === 'es' && course.name_es) || course.name}
                                                        </h4>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-slate-500">{course.sessions && course.sessions.length > 0 ? course.sessions[0].location : 'Ubicació per definir'}</span>
                                                            <span className={`text - sm font - bold ${availabilityColor} `}>
                                                                {t('dashboard.sections.spots_left', '{{spots}} places disponibles', { spots: available })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                        <div className={`h - full ${percentAvailable < 10 ? 'bg-red-500' : 'bg-primary'} `} style={{ width: `${percentFull}% ` }}></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600 min-w-[3rem] text-right">{percentFull}%</span>
                                                    <button
                                                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                                        onClick={() => onNavigate && onNavigate(`edit - course / ${course.id} `)}
                                                        title={t('common.edit', "Editar")}
                                                    >
                                                        <span className="material-icons-outlined text-sm text-slate-500">edit</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-slate-500">
                                        <p>{t('dashboard.sections.no_open_courses', "No hi ha cursos en fase d'inscripció.")}</p>
                                        <button
                                            className="mt-2 text-primary font-medium text-sm hover:underline"
                                            onClick={() => onNavigate && onNavigate('create-course')}
                                        >
                                            {t('dashboard.sections.create_course_now', "Crear un curs ara")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="font-bold text-lg flex items-center text-slate-800">
                                <span className="material-icons-outlined mr-2 text-slate-400">bolt</span>
                                {t('dashboard.sections.recent_activity', "Activitat Recents")}
                            </h2>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-6">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className={`w - 2 h - 2 mt - 1.5 ${activity.color} rounded - full mr - 4 flex - shrink - 0`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                                                <p className="text-xs text-slate-500 mt-1">{activity.subtitle}</p>
                                                <p className="text-[10px] text-slate-400 mt-1 uppercase">{getTimeAgo(activity.date)}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-slate-400 italic text-center py-4">{t('dashboard.sections.no_activity', "No hi ha activitat recent.")}</li>
                                )}
                            </ul>
                            <button
                                className="w-full mt-6 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors border border-dashed border-slate-300 rounded-lg"
                                onClick={() => onNavigate('active-courses')}
                            >
                                {t('dashboard.sections.view_all_history', "Veure tot l'historial")}
                            </button>
                        </div>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                        <h3 className="font-bold text-slate-800 mb-4">{t('dashboard.sections.quarterly_goal', "Objectiu del Trimestre")}</h3>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-2xl font-bold text-slate-800">{goalPercentage}%</span>
                            <span className="text-xs text-slate-500">{t('dashboard.sections.students_count', '{{count}} / {{goal}} alumnes', { count: students.length, goal: QUARTERLY_GOAL })}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${goalPercentage}% ` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                            {goalPercentage >= 100 ? t('dashboard.sections.goal_reached', "Objectiu assolit! 🎉") : t('dashboard.sections.goal_in_progress', "Objectiu trimestral en curs.")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
