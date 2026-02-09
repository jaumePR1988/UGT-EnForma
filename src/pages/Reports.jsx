import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { studentService } from '../services/studentService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = ({ onNavigate, toggleDarkMode, courses = [], students = [] }) => {
    const [timeRange, setTimeRange] = useState('yearly'); // 'weekly', 'monthly', 'yearly'
    const [certificateLogs, setCertificateLogs] = useState([]);

    // Fetch certificate logs
    useEffect(() => {
        const fetchLogs = async () => {
            const logs = await studentService.getCertificateLogs(1000);
            setCertificateLogs(logs);
        };
        fetchLogs();
    }, []);

    // --- Helper Functions ---
    const isInRange = (date, range) => {
        const d = new Date(date);
        const now = new Date();
        // Reset times to compare dates properly
        d.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        if (range === 'weekly') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
            return d >= startOfWeek;
        }
        if (range === 'monthly') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return d >= startOfMonth;
        }
        if (range === 'yearly') {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            return d >= startOfYear;
        }
        return true;
    };

    const formatDate = (seconds) => {
        if (!seconds) return new Date();
        return new Date(seconds * 1000);
    }

    const calculateDuration = (start, end) => {
        if (!start || !end) return 0;
        try {
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            const duration = (endH + endM / 60) - (startH + startM / 60);
            return duration > 0 ? duration : 0;
        } catch (e) {
            return 0;
        }
    };

    // --- KPIs Calculations ---

    // Filter students by registration date based on timeRange
    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const date = s.registeredAt?.seconds ? formatDate(s.registeredAt.seconds) : new Date(s.registeredAt || new Date());
            return isInRange(date, timeRange);
        });
    }, [students, timeRange]);

    const totalParticipants = filteredStudents.length;

    // Active vs Archived Courses
    const activeCoursesCount = courses.filter(c => c.status !== 'Finalitzat').length;
    const archivedCoursesCount = courses.filter(c => c.status === 'Finalitzat').length;

    // Total Hours (Realitzades per alumnes)
    const totalTrainingHours = useMemo(() => {
        let total = 0;
        courses.forEach(course => {
            // Students for this course
            const courseStudents = students.filter(s => s.courseId === course.id);
            if (!course.sessions || courseStudents.length === 0) return;

            course.sessions.forEach(session => {
                // If we want to filter by timeRange, we check session date
                let inRange = true;
                if (session.date) {
                    inRange = isInRange(new Date(session.date), timeRange);
                }

                // If session has no date but course is active, maybe we count it? 
                // For now, let's rely on date if available, or inclusion if not.
                // Actually, typically we only care about sessions that *happened* in agreement with the filter.

                if (inRange) {
                    const duration = calculateDuration(session.startTime, session.endTime);
                    if (duration > 0) {
                        // Count attendees for this session
                        // Data structure: student.attendanceSessions is an array of sessionIds
                        let attendeesCount = 0;
                        courseStudents.forEach(s => {
                            if (s.attendanceSessions && Array.isArray(s.attendanceSessions) && s.attendanceSessions.includes(session.id)) {
                                attendeesCount++;
                            } else if (s.attendance && s.attendance[session.id]) {
                                // Fallback for legacy object structure
                                attendeesCount++;
                            }
                        });
                        total += (duration * attendeesCount);
                    }
                }
            });
        });
        return total;
    }, [courses, students, timeRange]);

    // Affiliation Rate (of the students in range)
    const affiliatedCount = filteredStudents.filter(s => s.affiliate === 'si' || s.isAffiliated).length;
    const affiliationRate = totalParticipants > 0 ? Math.round((affiliatedCount / totalParticipants) * 100) : 0;

    // Certificates Issued (in range)
    const filteredCertificates = useMemo(() => {
        return certificateLogs.filter(log => {
            const date = log.createdAt?.seconds ? formatDate(log.createdAt.seconds) : new Date(log.createdAt);
            return isInRange(date, timeRange);
        });
    }, [certificateLogs, timeRange]);

    const totalCertificates = filteredCertificates.length;

    // --- Charts Data Preparation ---

    const enrollmentData = useMemo(() => {
        if (timeRange === 'yearly') {
            const months = ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'];
            const data = months.map(m => ({ name: m, participants: 0 }));
            filteredStudents.forEach(s => {
                const date = s.registeredAt?.seconds ? formatDate(s.registeredAt.seconds) : new Date(s.registeredAt || new Date());
                // Only count current year if 'yearly' implies 'this year'
                if (date.getFullYear() === new Date().getFullYear()) {
                    data[date.getMonth()].participants++;
                }
            });
            return data;
        } else if (timeRange === 'monthly') {
            const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
            const data = Array.from({ length: daysInMonth }, (_, i) => ({ name: `${i + 1}`, participants: 0 }));
            filteredStudents.forEach(s => {
                const date = s.registeredAt?.seconds ? formatDate(s.registeredAt.seconds) : new Date(s.registeredAt || new Date());
                if (date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
                    data[date.getDate() - 1].participants++;
                }
            });
            return data;
        } else {
            const days = ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'];
            const data = days.map(d => ({ name: d, participants: 0 }));
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            filteredStudents.forEach(s => {
                const date = s.registeredAt?.seconds ? formatDate(s.registeredAt.seconds) : new Date(s.registeredAt || new Date());
                if (date >= startOfWeek) {
                    data[date.getDay()].participants++;
                }
            });
            return data;
        }
    }, [filteredStudents, timeRange]);

    const courseStatusData = [
        { name: 'Actius', value: activeCoursesCount, color: '#10B981' },
        { name: 'Finalitzats', value: archivedCoursesCount, color: '#6B7280' }
    ];

    const affiliationData = [
        { name: 'Afiliats', value: affiliatedCount, color: '#E30613' },
        { name: 'No Afiliats', value: totalParticipants - affiliatedCount, color: '#94a3b8' }
    ];

    const certificatesChartData = useMemo(() => {
        if (timeRange === 'yearly') {
            const months = ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'];
            const data = months.map(m => ({ name: m, value: 0 }));
            filteredCertificates.forEach(log => {
                const date = log.createdAt?.seconds ? formatDate(log.createdAt.seconds) : new Date(log.createdAt);
                if (date.getFullYear() === new Date().getFullYear()) {
                    data[date.getMonth()].value++;
                }
            });
            return data;
        }
        return [];
    }, [filteredCertificates, timeRange]);


    const handleExportCSV = () => {
        const headers = ['Mètrica', 'Valor', 'Període'];
        const rows = [
            ['Total Participants', totalParticipants, timeRange],
            ['Hores Formació Realitzades', totalTrainingHours.toFixed(2), timeRange],
            ['Cursos Actius', activeCoursesCount, 'Actual'],
            ['Taxa Afiliació', `${affiliationRate}%`, timeRange],
            ['Certificats Emesos', totalCertificates, timeRange]
        ];

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `informe_formacio_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        try {
            const logoImg = new Image();
            logoImg.src = "/logo-ugt.png";
            doc.addImage(logoImg, "PNG", 14, 10, 30, 15);
        } catch (e) { }

        doc.setFontSize(20);
        doc.text("Informe de Formació", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Generat el: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });

        doc.line(14, 35, 196, 35);

        doc.setFontSize(14);
        doc.text("Resum Executiu", 14, 45);

        const summaryData = [
            ['Mètrica', 'Valor'],
            ['Període Analitzat', timeRange === 'yearly' ? 'Anual' : timeRange === 'monthly' ? 'Mensual' : 'Setmanal'],
            ['Participants Nous', totalParticipants],
            ['Hores Formació Realitzades', `${totalTrainingHours.toFixed(1)} h`],
            ['Certificats Emesos', totalCertificates],
            ['Taxa d\'Afiliació', `${affiliationRate}%`],
            ['Cursos Actius', activeCoursesCount]
        ];

        autoTable(doc, {
            startY: 50,
            head: [['Mètrica', 'Valor']],
            body: summaryData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [227, 6, 19] }
        });

        let finalY = doc.lastAutoTable.finalY + 15;
        doc.text("Detalls Addicionals", 14, finalY);
        doc.setFontSize(10);
        doc.text("Aquest informe recull dades sobre l'activitat formativa, incloent inscripcions, assistència i certificació.", 14, finalY + 7);

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Pàgina ${i} de ${pageCount}`, 196, 285, { align: "right" });
        }

        doc.save(`informe_ugt_${timeRange}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="reports" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Informes i Analítica</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Visió general del rendiment formatiu
                            <span className="ml-2 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-semibold uppercase">
                                {timeRange === 'weekly' ? 'Setmanal' : timeRange === 'monthly' ? 'Mensual' : 'Anual'}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setTimeRange('weekly')}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${timeRange === 'weekly' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Setmana
                            </button>
                            <button
                                onClick={() => setTimeRange('monthly')}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${timeRange === 'monthly' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Mes
                            </button>
                            <button
                                onClick={() => setTimeRange('yearly')}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${timeRange === 'yearly' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Any
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
                                title="Exportar CSV"
                            >
                                <span className="material-icons-outlined text-sm">table_view</span>
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm transition-colors shadow-sm"
                            >
                                <span className="material-icons-outlined text-sm mr-2">picture_as_pdf</span>
                                Exportar PDF
                            </button>
                        </div>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Participants</h3>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{totalParticipants}</span>
                            <span className="text-xs text-slate-400">
                                {timeRange === 'yearly' ? 'Nous enguany' : timeRange === 'monthly' ? 'Nous aquest mes' : 'Nous aquesta setmana'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-1 bg-indigo-500"></div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Hores Realitzades</h3>
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{Math.round(totalTrainingHours)}h</span>
                            <span className="text-[10px] text-slate-400 leading-tight">
                                Suma d'assistència x durada
                            </span>
                        </div>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-1 bg-red-600"></div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Taxa d'Afiliació</h3>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{affiliationRate}%</span>
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                                UGT
                            </span>
                        </div>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-1 bg-amber-500"></div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Certificats</h3>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{totalCertificates}</span>
                            <span className="text-xs text-slate-400">
                                Emesos (Període)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Enrollment Chart */}
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Inscripcions</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                        labelStyle={{ color: '#94a3b8' }}
                                    />
                                    <Area type="monotone" dataKey="participants" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorParticipants)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Certificates Chart */}
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Certificats Generats ({timeRange === 'yearly' ? 'Mensual' : 'Període'})</h3>
                        {timeRange === 'yearly' && (
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={certificatesChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                            itemStyle={{ color: '#f8fafc' }}
                                            labelStyle={{ color: '#94a3b8' }}
                                        />
                                        <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        {timeRange !== 'yearly' && (
                            <div className="h-80 flex items-center justify-center text-slate-400">
                                Dades gràfiques disponibles en vista anual.
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Affiliation Pie Chart */}
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Afiliació UGT (Període Seleccionat)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={affiliationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {affiliationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Course Status Pie Chart */}
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Estat dels Cursos Global</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={courseStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {courseStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reports;
