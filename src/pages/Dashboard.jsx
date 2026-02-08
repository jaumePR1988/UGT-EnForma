import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { feedbackService } from '../services/feedbackService';

const Dashboard = ({ onNavigate, toggleDarkMode, courses, students = [] }) => {
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

        const startMonth = startDate.toLocaleDateString('ca-ES', { month: 'long' });
        const endMonth = endOfWeek.toLocaleDateString('ca-ES', { month: 'long' });

        if (startMonth === endMonth) {
            return `${startDate.getDate()} - ${endOfWeek.getDate()} ${startMonth} ${startDate.getFullYear()}`;
        } else {
            return `${startDate.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth} ${startDate.getFullYear()}`;
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
            title: 'Nova inscripció',
            subtitle: `${s.fullName} s'ha inscrit a "${s.courseTitle || 'Un curs'}"`,
            date: s.registeredAt ? (s.registeredAt.seconds ? new Date(s.registeredAt.seconds * 1000) : new Date(s.registeredAt)) : new Date(),
            color: 'bg-green-500'
        }));

        const courseEvents = courses.map(c => ({
            type: 'course',
            title: 'Nou curs publicat',
            subtitle: `"${c.name}" ja és visible`,
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
        if (interval > 1) return `Fa ${Math.floor(interval)} anys`;
        interval = seconds / 2592000;
        if (interval > 1) return `Fa ${Math.floor(interval)} mesos`;
        interval = seconds / 86400;
        if (interval > 1) return `Fa ${Math.floor(interval)} dies`;
        interval = seconds / 3600;
        if (interval > 1) return `Fa ${Math.floor(interval)} hores`;
        interval = seconds / 60;
        if (interval > 1) return `Fa ${Math.floor(interval)} minuts`;
        return "Fa un moment";
    };
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="dashboard" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            {/* Main Content */}
            <main className="lg:ml-64 p-6 lg:p-10 transition-all duration-200">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Panell d'Administració</h1>
                        <p className="text-slate-500 dark:text-slate-400">Gestió global de la formació sindical</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-64 transition-all"
                                placeholder="Buscar cursos, alumnes..."
                                type="text"
                            />
                        </div>
                        <button
                            className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                            onClick={() => onNavigate && onNavigate('create-course')}
                        >
                            <span className="material-icons-outlined mr-2">add</span>
                            Nou Curs
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-primary rounded-lg">
                                <span className="material-icons-outlined">library_books</span>
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Cursos Actius</h3>
                        <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">{courses ? courses.length : 0}</p>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <span className="material-icons-outlined">groups</span>
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+5.4%</span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Inscripcions Totals</h3>
                        <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">{students.length}</p>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                                <span className="material-icons-outlined">pending_actions</span>
                            </div>
                            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Pendent</span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Certificats Pendents</h3>
                        <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">{pendingCertificates}</p>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                <span className="material-icons-outlined">star</span>
                            </div>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{totalFeedbacks} vots</span>
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Valoració Mitjana</h3>
                        <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">{averageRating}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="font-bold text-lg flex items-center text-slate-800 dark:text-white">
                                    <span className="material-icons-outlined mr-2 text-primary">calendar_month</span>
                                    Calendari Setmanal de Formació
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-400"
                                        onClick={() => setCurrentWeekStart(new Date(currentWeekStart.setDate(currentWeekStart.getDate() - 7)))}
                                    >
                                        <span className="material-icons-outlined">chevron_left</span>
                                    </button>
                                    <span className="text-sm font-medium px-2 text-slate-600 dark:text-slate-300 min-w-[200px] text-center capitalize">
                                        {formatWeekRange(currentWeekStart)}
                                    </span>
                                    <button
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-400"
                                        onClick={() => setCurrentWeekStart(new Date(currentWeekStart.setDate(currentWeekStart.getDate() + 7)))}
                                    >
                                        <span className="material-icons-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                            <div className="calendar-grid grid grid-cols-5 divide-x divide-slate-200 dark:divide-slate-800 user-select-none">
                                {/* Generate 5 days (Mon-Fri) based on currentWeekStart */}
                                {Array.from({ length: 5 }).map((_, index) => {
                                    const dayDate = new Date(currentWeekStart);
                                    dayDate.setDate(currentWeekStart.getDate() + index);

                                    const dayName = dayDate.toLocaleDateString('ca-ES', { weekday: 'short' });
                                    const dayNumber = dayDate.getDate();

                                    // FIXED: Match YYYY-MM-DD format from CreateCourse.jsx (Using Local Time)
                                    const comparisonDate = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;

                                    const daysCourses = courses ? courses.filter(c => c.startDate === comparisonDate) : [];

                                    return (
                                        <div key={index} className="flex flex-col">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800">
                                                {dayName} {dayNumber}
                                            </div>
                                            <div className="bg-white dark:bg-card-dark p-2 min-h-[180px] flex-1 space-y-2">
                                                {daysCourses.length > 0 ? daysCourses.map((course, idx) => (
                                                    <div key={idx} className={`border-l-4 p-2 text-xs rounded mb-2 shadow-sm ${course.category === 'Prevenció de Riscos' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                                                        course.category === 'Dret Laboral' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
                                                            course.category === 'Igualtat' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500' :
                                                                'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
                                                        }`}>
                                                        <p className={`font-bold truncate ${course.category === 'Prevenció de Riscos' ? 'text-red-700 dark:text-red-400' :
                                                            course.category === 'Dret Laboral' ? 'text-blue-700 dark:text-blue-400' :
                                                                course.category === 'Igualtat' ? 'text-purple-700 dark:text-purple-400' :
                                                                    'text-orange-700 dark:text-orange-400'
                                                            }`}>{course.name}</p>
                                                        <p className="text-[10px] text-slate-500 mt-1">09:00 - 14:00</p>
                                                    </div>
                                                )) : (
                                                    <div className="h-full flex items-center justify-center opacity-30">
                                                        <span className="text-[10px] text-slate-400 italic">Sense cursos</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Cursos en fase d'inscripció</h2>
                                <a className="text-primary text-sm font-medium hover:underline" href="#">Veure tots</a>
                            </div>
                            <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {courses && courses.filter(c => c.status === 'Pendent inici' || c.status === 'open').length > 0 ? (
                                        courses.filter(c => c.status === 'Pendent inici' || c.status === 'open').slice(0, 5).map(course => {
                                            const enrolledCount = students.filter(s => s.courseId === course.id).length;
                                            const capacity = course.maxCapacity || 25;
                                            const percent = Math.min(100, Math.round((enrolledCount / capacity) * 100));

                                            return (
                                                <div key={course.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
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
                                                            <h4 className="font-semibold text-sm text-slate-800 dark:text-white truncate max-w-[150px]">{course.name}</h4>
                                                            <p className="text-xs text-slate-500">{course.sessions && course.sessions.length > 0 ? course.sessions[0].location : 'Ubicació per definir'} · {capacity - enrolledCount} places disponibles</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-6">
                                                        <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                            <div className="bg-primary h-full" style={{ width: `${percent}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{percent}% ple</span>
                                                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                                            <span className="material-icons-outlined text-sm text-slate-500">more_vert</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-8 text-center text-slate-500">
                                            <p>No hi ha cursos en fase d'inscripció.</p>
                                            <button
                                                className="mt-2 text-primary font-medium text-sm hover:underline"
                                                onClick={() => onNavigate && onNavigate('create-course')}
                                            >
                                                Crear un curs ara
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="font-bold text-lg flex items-center text-slate-800 dark:text-white">
                                    <span className="material-icons-outlined mr-2 text-slate-400">bolt</span>
                                    Activitat Recents
                                </h2>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-6">
                                    {recentActivity.length > 0 ? (
                                        recentActivity.map((activity, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className={`w-2 h-2 mt-1.5 ${activity.color} rounded-full mr-4 flex-shrink-0`}></div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-white">{activity.title}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{activity.subtitle}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 uppercase">{getTimeAgo(activity.date)}</p>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-slate-400 italic text-center py-4">No hi ha activitat recent.</li>
                                    )}
                                </ul>
                                <button className="w-full mt-6 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                                    Veure tot l'historial
                                </button>
                            </div>
                        </div>
                        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Objectiu del Trimestre</h3>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-2xl font-bold text-slate-800 dark:text-white">{goalPercentage}%</span>
                                <span className="text-xs text-slate-500">{students.length} / {QUARTERLY_GOAL} alumnes</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full" style={{ width: `${goalPercentage}%` }}></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                                {goalPercentage >= 100 ? "Objectiu assolit! 🎉" : "Objectiu trimestral en curs."}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="lg:ml-64 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
                <div className="flex flex-col items-center space-y-2">
                    <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
                    <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
