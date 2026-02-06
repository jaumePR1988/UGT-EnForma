import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const Calendar = ({ onNavigate, toggleDarkMode, courses = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper to help parsing DD/MM/YYYY dates from courses
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('/');
        return new Date(year, month - 1, day);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        // Adjust standardgetDay() (0=Sun) to (0=Mon) for European start
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthNames = [
        "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
        "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
    ];

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${day.toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

        // Find courses starting on this day
        const dayCourses = courses.filter(c => c.startDate === dateString);

        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

        days.push(
            <div key={day} className={`h-32 border border-slate-100 dark:border-slate-800 p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'bg-white dark:bg-card-dark'}`}>
                <div className={`text-sm font-semibold mb-2 ${isToday ? 'text-blue-600 bg-blue-100 w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-700 dark:text-slate-300'}`}>
                    {day}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                    {dayCourses.map((course, idx) => (
                        <div
                            key={idx}
                            className="text-[10px] p-1.5 rounded border-l-2 bg-primary/10 border-primary text-slate-700 dark:text-slate-200 truncate cursor-pointer hover:bg-primary hover:text-white transition-colors"
                            title={course.name}
                        >
                            {course.name}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="calendar" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Calendari de Formació</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Planificació de cursos i esdeveniments ({courses.length} cursos actius)</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-sm"
                        >
                            Avui
                        </button>
                        <button
                            onClick={() => onNavigate('create-course')}
                            className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm shadow-sm"
                        >
                            <span className="material-icons-outlined mr-2">add</span>
                            Nou Esdeveniment
                        </button>
                    </div>
                </header>

                <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Calendar Controls */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2 capitalize text-slate-900 dark:text-white">
                            <span className="material-icons-outlined text-primary">calendar_month</span>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors text-slate-500 dark:text-slate-400">
                                <span className="material-icons-outlined">chevron_left</span>
                            </button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors text-slate-500 dark:text-slate-400">
                                <span className="material-icons-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                        {['Dl', 'Dm', 'Dx', 'Dj', 'Dv', 'Ds', 'Dg'].map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 bg-slate-200 dark:bg-slate-800 gap-[1px]">
                        {days}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Calendar;
