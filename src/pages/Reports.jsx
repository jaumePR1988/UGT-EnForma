import React, { useState, useMemo } from 'react';
import Sidebar from '../components/layout/Sidebar';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const Reports = ({ onNavigate, toggleDarkMode, courses = [], students = [] }) => {
    // Mock Data for Charts (Keep existing mock data)
    const [timeRange, setTimeRange] = useState('monthly');

    const totalParticipants = students ? students.length : 0;

    // Calculate total hours from sessions
    const totalHours = useMemo(() => {
        if (!courses) return 0;
        return courses.reduce((acc, course) => {
            if (!course.sessions || course.sessions.length === 0) return acc;
            const courseHours = course.sessions.reduce((sAcc, session) => {
                if (!session.startTime || !session.endTime) return sAcc;
                const [startH, startM] = session.startTime.split(':').map(Number);
                const [endH, endM] = session.endTime.split(':').map(Number);
                const duration = (endH + (endM || 0) / 60) - (startH + (startM || 0) / 60);
                return sAcc + (duration > 0 ? duration : 0);
            }, 0);
            return acc + courseHours;
        }, 0);
    }, [courses]);

    // Group students by month for Enrollment Chart
    const enrollmentData = useMemo(() => {
        if (!students) return [];
        const months = ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'];
        const data = new Array(12).fill(0).map((_, i) => ({ name: months[i], participants: 0 }));

        students.forEach(student => {
            let date = new Date();
            if (student.registeredAt && student.registeredAt.seconds) {
                date = new Date(student.registeredAt.seconds * 1000);
            } else if (student.registeredAt) {
                date = new Date(student.registeredAt);
            }
            const month = date.getMonth();
            data[month].participants += 1;
        });

        // Filter to showing reasonable range or all? Showing all 12 months for now or just relevant
        // Let's rotate to start from current month - 5? simpler to just show Jan-Dec or active months
        // For simplicity, just show Jan-Jun as in mock or full year if needed. 
        // Let's return sliced data for current visualization if needed, or full 12.
        // Mock showed 6 months. Let's return standard view.
        return data.filter(d => d.participants > 0 || d.name === months[new Date().getMonth()]);
    }, [students]);

    // Course Type Distribution
    const courseTypeData = useMemo(() => {
        if (!courses) return [];
        const counts = courses.reduce((acc, course) => {
            const cat = course.category || 'Altres';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        const colors = ['#E30613', '#FF7F50', '#FFA07A', '#8884d8', '#82ca9d'];
        return Object.keys(counts).map((key, index) => ({
            name: key,
            value: counts[key],
            color: colors[index % colors.length]
        }));
    }, [courses]);

    const satisfactionDistributionData = [
        { category: 'Excel·lent (5)', count: Math.round(totalParticipants * 0.4) },
        { category: 'Notable (4)', count: Math.round(totalParticipants * 0.3) },
        { category: 'Bé (3)', count: Math.round(totalParticipants * 0.2) },
        { category: 'Suficient (2)', count: Math.round(totalParticipants * 0.08) },
        { category: 'Insuficient (1)', count: Math.round(totalParticipants * 0.02) },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="reports" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Informes i Analítica</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Visualització de dades claus de la formació</p>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-card-dark p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setTimeRange('weekly')}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${timeRange === 'weekly' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Setmanal
                        </button>
                        <button
                            onClick={() => setTimeRange('monthly')}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${timeRange === 'monthly' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setTimeRange('yearly')}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${timeRange === 'yearly' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            Anual
                        </button>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Participants</h3>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{totalParticipants}</span>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                <span className="material-icons-outlined text-[14px] mr-1">trending_up</span> +12%
                            </span>
                        </div>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Hores Impartides</h3>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{Math.round(totalHours)}h</span>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                <span className="material-icons-outlined text-[14px] mr-1">trending_up</span> +8%
                            </span>
                        </div>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Cost per Alumne</h3>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">42€</span>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                <span className="material-icons-outlined text-[14px] mr-1">trending_down</span> -2%
                            </span>
                        </div>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Taxa de Finalització</h3>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">94%</span>
                            <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                                <span className="material-icons-outlined text-[14px] mr-1">remove</span> 0%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Enrollment Chart */}
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Evolució d'Inscripcions</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#E30613" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#E30613" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                        formatter={(value) => [`${value} Participants`, 'Inscripcions']}
                                    />
                                    <Area type="monotone" dataKey="participants" stroke="#E30613" strokeWidth={3} fillOpacity={1} fill="url(#colorParticipants)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Course Type Distribution */}
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Tipologia de Cursos</h3>
                        <div className="h-80 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={courseTypeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {courseTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Satisfacció de l'Alumnat <span className="text-xs font-normal text-slate-500">(Dades simulades)</span></h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={satisfactionDistributionData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                <Bar dataKey="count" fill="#E30613" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
