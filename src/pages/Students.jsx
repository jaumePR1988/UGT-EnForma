import React from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/layout/Sidebar';

import { studentService } from '../services/studentService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Modal } from '../components/ui/Modal';

// --- Helpers ---
const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // Handle Firestore Timestamp or Date object/string
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
};

const formatFederation = (federation, t) => {
    if (!federation) return '---';

    if (t) {
        const lowerVal = federation.toLowerCase().trim();
        // Check for specific federations to translate
        if (lowerVal === 'serveis públics' || lowerVal === 'servicios públicos') {
            return t('public_registration.form.federations.public_services');
        }
        if (lowerVal === 'indústria' || lowerVal === 'industria') {
            return t('public_registration.form.federations.industry');
        }
        if (lowerVal === 'serveis' || lowerVal === 'servicios') {
            return t('public_registration.form.federations.services');
        }
    }

    return federation.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// --- Student Detail Modal Component ---
const StudentDetailModal = ({ isOpen, onClose, student, attendanceStats }) => {
    const { t } = useTranslation();
    if (!student) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('students.detail.title')}
            className="max-w-2xl"
        >
            <div className="space-y-6">
                {/* Header Profile */}
                <div className="flex items-center space-x-4 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-2xl">
                        {student.fullName ? student.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'AL'}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{student.fullName}</h3>
                        <p className="text-slate-500 text-sm">{student.email}</p>
                        <div className="mt-2 flex gap-2">
                            <span className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-full ${student.status === 'registered' || student.status === 'Inscrit'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
                                }`}>
                                {t(`students.status_values.${(student.status || 'registered').toLowerCase()}`) || student.status}
                            </span>
                            {student.isAffiliated && (
                                <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-red-100 text-red-700 dark:bg-red-900/40">
                                    Afiliat/da
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Attendance Stats Highlight */}
                {attendanceStats && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-end mb-2">
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Assistència Global</h4>
                            <span className="text-2xl font-bold text-primary">{attendanceStats.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                            <div
                                className={`h-2.5 rounded-full ${attendanceStats.percentage >= 80 ? 'bg-green-500' :
                                    attendanceStats.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${attendanceStats.percentage}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-500 text-right">
                            {attendanceStats.attended} de {attendanceStats.total} sessions assistides
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-700 pb-1">
                            {t('students.detail.personal_info')}
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="block text-slate-500 text-xs">DNI / NIE</span>
                                <span className="font-medium">{student.dni || '---'}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs text-primary">Telèfon (WhatsApp)</span>
                                <a
                                    href={`https://wa.me/${student.phone?.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium hover:text-green-600 flex items-center gap-1"
                                >
                                    {student.phone || '---'}
                                    <span className="material-icons-outlined text-[14px]">open_in_new</span>
                                </a>
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs">Empresa / Centre</span>
                                <span className="font-medium">{student.company || '---'}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs">Federació</span>
                                <span className="font-medium">{formatFederation(student.federation, t)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Enrollment Info */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-700 pb-1">
                            {t('students.detail.enrollment_info')}
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="block text-slate-500 text-xs">Curs Inscrit</span>
                                <span className="font-medium text-primary">{student.courseTitle || 'Curs Desconegut'}</span>
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs">{t('students.detail.registered_at')}</span>
                                <span className="font-medium">{formatDate(student.registeredAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        Tancar
                    </button>
                    <a
                        href={`mailto:${student.email}`}
                        className="px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span className="material-icons-outlined text-[18px]">email</span>
                        Email
                    </a>
                </div>
            </div>
        </Modal>
    );
};

const Students = ({ onNavigate, toggleDarkMode, students, courses, refreshStudents }) => {
    // DEBUG: Check if courses are receiving data
    console.log("Students Page - Courses Prop:", courses);

    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [studentToDelete, setStudentToDelete] = React.useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 50;

    // Filter State
    const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
    const [filters, setFilters] = React.useState({
        courseId: '',
        status: '',
        federation: ''
    });

    // New: Show Archived Students toggle
    const [showArchived, setShowArchived] = React.useState(false);

    // Detail Modal State
    const [selectedStudent, setSelectedStudent] = React.useState(null);
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);

    // Refresh Animation State
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const handleRefresh = async () => {
        if (!refreshStudents) return;
        setIsRefreshing(true);
        try {
            await refreshStudents();
        } finally {
            // Ensure spinner shows for at least 500ms for visual feedback
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    // Helper to calculate attendance stats for a student
    const getAttendanceStats = (student) => {
        if (!courses || !student.courseId) return null;
        const course = courses.find(c => c.id === student.courseId);
        if (!course || !course.sessions || course.sessions.length === 0) return { attended: 0, total: 0, percentage: 0 };

        const totalSessions = course.sessions.length;
        let attendedCount = 0;

        // Check array
        if (student.attendanceSessions && Array.isArray(student.attendanceSessions)) {
            attendedCount = student.attendanceSessions.length;
        } else if (student.attendance) {
            // Legacy object check
            attendedCount = Object.keys(student.attendance).length;
        }

        const percentage = Math.round((attendedCount / totalSessions) * 100);
        return { attended: attendedCount, total: totalSessions, percentage };
    };


    // Auto-refresh students when entering the page
    React.useEffect(() => {
        handleRefresh();
    }, []);

    // Reset page when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    // Get unique federations for filter dropdown
    const uniqueFederations = React.useMemo(() => {
        if (!students) return [];
        const feds = students
            .map(s => s.federation)
            .filter(f => f && f.trim() !== '') // Filter empty
            .map(f => f.trim());

        // Case-insensitive unique set
        const uniqueSet = new Set(feds.map(f => f.toLowerCase()));
        return Array.from(uniqueSet).sort();
    }, [students]);

    // Robust Course List: Combine prop courses with any courses found in student data
    // This allows filtering even if the main course list fails to load or is empty
    const availableCourses = React.useMemo(() => {
        const courseMap = new Map();

        // 1. Add courses from prop
        if (courses) {
            courses.forEach(c => {
                // Course object usually has 'name', but check 'title' just in case
                const name = c.name || c.title || 'Curs sense nom';
                courseMap.set(c.id, name);
            });
        }

        // 2. Add courses found in student list (fallback)
        if (students) {
            students.forEach(s => {
                if (s.courseId && s.courseTitle && !courseMap.has(s.courseId)) {
                    courseMap.set(s.courseId, s.courseTitle);
                }
            });
        }

        return Array.from(courseMap.entries()).map(([id, title]) => ({ id, title }));
    }, [courses, students]);

    const filteredStudents = students ? students.filter(student => {
        // Text Search
        const term = searchTerm.toLowerCase();
        const matchesSearch = (
            (student.fullName && student.fullName.toLowerCase().includes(term)) ||
            (student.dni && student.dni.toLowerCase().includes(term)) ||
            (student.email && student.email.toLowerCase().includes(term))
        );

        // Advanced Filters
        const matchesCourse = filters.courseId ? student.courseId === filters.courseId : true;
        const matchesStatus = filters.status ? student.status === filters.status : true;
        const matchesFederation = filters.federation ? (student.federation && student.federation.toLowerCase() === filters.federation.toLowerCase()) : true;

        // Archive Filter - Default to hiding "Finalitzat" unless showArchived is true
        // If student status is 'Baixa', we treat it based on user preference? 
        // Logic: if showArchive is false, only 'registered', 'Inscrit', 'Pagat'.
        // If showArchive is true, show all including 'Finalitzat'? 
        // Student status doesn't have 'Finalitzat' usually, the Course does.
        // Let's rely on course status if possible, or assume all students are active unless status is 'Baixa'.
        // Wait, typical CRM behavior: hide 'Baixa' or old courses.
        // Let's stick to status filter. If status filter is empty, show all except maybe deleted?
        // Current implementation showed all. Let's keep it simple.

        // Re-implementing the "Archive" logic from previous user request on Certificates:
        // Actually, just showing all matches is fine, usually 'ShowArchived' implies courses that are done.
        // Let's filter out students whose COURSE is 'Finalitzat' if !showArchived.
        let isCourseActive = true;
        if (!showArchived && courses) {
            const course = courses.find(c => c.id === student.courseId);
            if (course && course.status === 'Finalitzat') {
                isCourseActive = false;
            }
        }

        return matchesSearch && matchesCourse && matchesStatus && matchesFederation && isCourseActive;
    }) : [];

    // Pagination Logic
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    const handleDelete = async () => {
        if (!studentToDelete) return;
        try {
            await studentService.deleteStudent(studentToDelete);
            setIsDeleteDialogOpen(false);
            setStudentToDelete(null);
            handleRefresh();
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Error al eliminar l'alumne.");
        }
    };

    const handleGeneratePDF = async () => {
        // ... (PDF generation implementation same as before)
        const doc = new jsPDF();
        // ... (simplified for brevity, previous logic holds)
        // But let's restore the logic properly to not break the file.

        // 1. Header Background
        doc.setFillColor(220, 38, 38);
        doc.rect(0, 0, 210, 25, 'F');

        // 2. Logo & Title
        const logoUrl = '/logo-ugt.png';
        const date = new Date().toLocaleDateString();

        try {
            // Load logo asynchronously
            const imgData = await fetch(logoUrl).then(res => res.blob()).then(blob => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            });
            doc.addImage(imgData, 'PNG', 14, 5, 20, 15);
        } catch (error) {
            console.error("Error loading logo for PDF:", error);
        }

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('UGT EnForma - Informe d\'Alumnat', 40, 16);

        // Date
        doc.setFontSize(10);
        doc.text(date, 180, 16);

        // 2. Filter Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        let filterText = `Total Alumnes: ${filteredStudents.length}`;
        if (filters.courseId) {
            const course = courses.find(c => c.id === filters.courseId);
            filterText += ` | Curs: ${course ? (course.name || course.title) : 'Desconegut'}`;
        }
        if (filters.status) filterText += ` | Estat: ${filters.status}`;
        if (filters.federation) filterText += ` | Federació: ${formatFederation(filters.federation, t)}`;

        doc.text(filterText, 14, 30);

        // 3. Table
        const tableColumn = ["Nom", "DNI", "Curs", "Federació", "Assistència", "Estat"];
        const tableRows = filteredStudents.map(student => {
            const stats = getAttendanceStats(student);
            const attendanceStr = stats ? `${stats.attended}/${stats.total} (${stats.percentage}%)` : '---';

            return [
                student.fullName,
                student.dni || '---',
                student.courseTitle || '---',
                formatFederation(student.federation, t),
                attendanceStr,
                student.status
            ];
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'striped',
            headStyles: { fillColor: [220, 38, 38] }, // Red UGT
            styles: { fontSize: 8, cellPadding: 2 },
        });

        doc.save(`informe_alumnat_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleExportCSV = () => {
        if (!filteredStudents || filteredStudents.length === 0) {
            alert("No hi ha dades per exportar.");
            return;
        }

        const headers = ["Nom i Cognoms", "DNI", "Email", "Telèfon", "Curs", "Empresa", "Federació", "Afiliat", "Data Inscripció", "Assistència (%)", "Sessions Assistides", "Total Sessions", "Estat"];
        const csvContent = [
            headers.join(','),
            ...filteredStudents.map(s => {
                const stats = getAttendanceStats(s);
                return [
                    `"${s.fullName || ''}"`,
                    `"${s.dni || ''}"`,
                    `"${s.email || ''}"`,
                    `"${s.phone || ''}"`,
                    `"${s.courseTitle || ''}"`,
                    `"${s.company || ''}"`,
                    `"${formatFederation(s.federation, t)}"`,
                    `"${s.isAffiliated ? 'Sí' : 'No'}"`,
                    `"${s.registeredAt ? new Date(s.registeredAt.toDate ? s.registeredAt.toDate() : s.registeredAt).toLocaleDateString() : ''}"`,
                    `"${stats ? stats.percentage + '%' : ''}"`,
                    `"${stats ? stats.attended : ''}"`,
                    `"${stats ? stats.total : ''}"`,
                    `"${s.status || ''}"`
                ].join(',')
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `alumnes_ugt_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="students" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t('students.title')}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{t('students.subtitle')}</p>

                        {/* Archive Tabs */}
                        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setShowArchived(false)}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${!showArchived
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                Actius
                            </button>
                            <button
                                onClick={() => setShowArchived(true)}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${showArchived
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                Històric
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-72 transition-all text-sm"
                                placeholder={t('students.search_placeholder')}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className={`p-2 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg ${isFiltersOpen ? 'text-primary border-primary' : 'text-slate-400 hover:text-primary'}`}
                            title={isFiltersOpen ? t('students.filters.hide') : t('students.filters.show')}
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        >
                            <span className="material-icons-outlined text-[20px]">filter_list</span>
                        </button>

                        <button
                            className="p-2 text-slate-400 hover:text-primary transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group"
                            title="Actualitzar llista"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <span className={`material-icons-outlined text-[20px] ${isRefreshing ? 'animate-spin text-primary' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
                                refresh
                            </span>
                        </button>
                        <button
                            className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                            onClick={() => onNavigate('enroll-student')}
                        >
                            <span className="material-icons-outlined mr-2 text-[20px]">person_add</span>
                            {t('students.new_button')}
                        </button>
                    </div>

                    {/* Archive Toggle */}
                    <div className="flex items-center ml-4">
                        <label className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showArchived}
                                onChange={(e) => setShowArchived(e.target.checked)}
                                className="form-checkbox h-4 w-4 text-primary rounded border-slate-300 focus:ring-primary"
                            />
                            <span>Veure alumnes de cursos finalitzats</span>
                        </label>
                    </div>
                </header>

                {/* Filters Panel logic... (Omitted as it was already correct) */}
                {isFiltersOpen && (
                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                {t('students.filters.course_label')}
                            </label>
                            <select
                                className="w-full p-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                value={filters.courseId}
                                onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
                            >
                                <option value="" className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100">{t('students.filters.all_courses')}</option>
                                {availableCourses.map(course => (
                                    <option key={course.id} value={course.id} className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100">
                                        {course.name || course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                {t('students.filters.status_label')}
                            </label>
                            <select
                                className="w-full p-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="" className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100">{t('students.filters.all_statuses')}</option>
                                <option value="registered" className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100">{t('students.status_values.registered')}</option>
                                <option value="Inscrit" className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100">{t('students.status_values.inscrit')}</option>
                                <option value="Pagat" className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100">{t('students.status_values.pagat')}</option>
                                <option value="Baixa" className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100">{t('students.status_values.baixa')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                {t('students.filters.federation_label')}
                            </label>
                            <select
                                className="w-full p-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                value={filters.federation}
                                onChange={(e) => setFilters({ ...filters, federation: e.target.value })}
                            >
                                <option value="" className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100">Totes les federacions</option>
                                {uniqueFederations.map(fed => (
                                    <option key={fed} value={fed} className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-gray-100">{formatFederation(fed, t)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ courseId: '', status: '', federation: '' })}
                                className="w-full p-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white border border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-outlined text-[18px]">filter_alt_off</span>
                                {t('students.filters.clear')}
                            </button>
                        </div>
                    </div>
                )}


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stats ... (same, just simplified for file writing) */}
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('students.stats.active')}</h3>
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-primary rounded-lg">
                                <span className="material-icons-outlined text-[20px]">groups</span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">{students ? students.length : 0}</p>
                        <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
                            <span className="material-icons-outlined text-[14px] mr-1">trending_up</span>
                            Dades actualitzades
                        </div>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-60">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('students.stats.new')}</h3>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <span className="material-icons-outlined text-[20px]">assignment_ind</span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">-</p>
                        <div className="flex items-center mt-2 text-xs text-slate-500 font-medium">
                            Calculant...
                        </div>
                    </div>
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-60">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('students.stats.drop')}</h3>
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                                <span className="material-icons-outlined text-[20px]">person_off</span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold">0%</p>
                        <div className="flex items-center mt-2 text-xs text-slate-500 font-medium">
                            Dada estimada
                        </div>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="font-bold text-lg">Llistat detallat d'alumnat</h2>
                            {(filters.courseId || filters.status || filters.federation) && (
                                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                                    Filtres Actius
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-icons-outlined mr-1.5 text-[18px]">download</span>
                                Exportar CSV
                            </button>
                            <button
                                onClick={handleGeneratePDF}
                                className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                            >
                                <span className="material-icons-outlined mr-1.5 text-[18px]">picture_as_pdf</span>
                                Informe PDF
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumne/a</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Curs</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Federació</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Assistència</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estat</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Accions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {currentStudents && currentStudents.length > 0 ? (
                                    currentStudents.map(student => {
                                        const stats = getAttendanceStats(student);
                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold mr-3">
                                                            {student.fullName ? student.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'AL'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm">{student.fullName}</p>
                                                            <p className="text-xs text-slate-500">{student.dni || student.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium">{student.courseTitle || 'Curs Desconegut'}</p>
                                                    <p className="text-xs text-slate-500">Inscrit: {formatDate(student.registeredAt)}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                                        {formatFederation(student.federation, t)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {stats && stats.total > 0 ? (
                                                        <div className="flex flex-col items-center">
                                                            <span className={`text-xs font-bold ${stats.percentage === 100 ? 'text-green-600' :
                                                                stats.percentage >= 80 ? 'text-emerald-500' :
                                                                    stats.percentage >= 50 ? 'text-yellow-600' : 'text-red-500'
                                                                }`}>
                                                                {stats.attended}/{stats.total} ({stats.percentage}%)
                                                            </span>
                                                            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-500 ${stats.percentage === 100 ? 'bg-green-500' :
                                                                        stats.percentage >= 80 ? 'bg-emerald-400' :
                                                                            stats.percentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                                                        }`}
                                                                    style={{ width: `${stats.percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">---</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full 
                                                    ${student.status === 'Inscrit' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                                                            student.status === 'registered' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' :
                                                                student.status === 'Pagat' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                                                                    'bg-slate-100 text-slate-700 dark:bg-slate-800'
                                                        }`}>
                                                        {t(`students.status_values.${(student.status || 'registered').toLowerCase()}`) || student.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                            title="Veure perfil"
                                                            onClick={() => {
                                                                setSelectedStudent(student);
                                                                setIsDetailOpen(true);
                                                            }}
                                                        >
                                                            <span className="material-icons-outlined text-[20px]">visibility</span>
                                                        </button>
                                                        <button
                                                            className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                                                            title="Contactar WhatsApp"
                                                            onClick={() => window.open(`https://wa.me/${student.phone}`, '_blank')}
                                                        >
                                                            <span className="material-icons-outlined text-[20px]">chat</span>
                                                        </button>
                                                        <button
                                                            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                                            title="Editar"
                                                            onClick={() => onNavigate(`edit-student/${student.id}`)}
                                                        >
                                                            <span className="material-icons-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button
                                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                            title="Eliminar"
                                                            onClick={() => {
                                                                setStudentToDelete(student.id);
                                                                setIsDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <span className="material-icons-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                            No s'han trobat alumnes que coincideixin amb la cerca.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                {filteredStudents.length > itemsPerPage && (
                    <div className="flex items-center justify-between mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            {t('students.pagination.showing', {
                                start: startIndex + 1,
                                end: Math.min(startIndex + itemsPerPage, filteredStudents.length),
                                total: filteredStudents.length
                            })}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('students.pagination.prev')}
                            </button>
                            <div className="flex items-center px-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {currentPage} / {totalPages}
                                </span>
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('students.pagination.next')}
                            </button>
                        </div>
                    </div>
                )}

                <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDelete}
                    title={t('confirm.delete_student_title')}
                    description={t('confirm.delete_student_desc')}
                    confirmText={t('confirm.yes_delete')}
                    cancelText={t('common.cancel')}
                />

                <StudentDetailModal
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    student={selectedStudent}
                    attendanceStats={selectedStudent ? getAttendanceStats(selectedStudent) : null}
                />
            </main>
        </div>
    );
};

export default Students;
