import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { studentService } from '../../services/studentService';
import { courseService } from '../../services/courseService';
import {
    ShieldCheck,
    Search,
    Download,
    GraduationCap,
    Calendar,
    User,
    Mail,
    Info,
    LayoutDashboard,
    History,
    FileCheck,
    Phone,
    LogOut,
    ChevronRight,
    CircleHelp,
    Bell,
    ExternalLink,
    FileText
} from 'lucide-react';

const StudentPortal = () => {
    const { t } = useTranslation();
    const [dni, setDni] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [enrollments, setEnrollments] = useState(null);
    const [courses, setCourses] = useState({});
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'history', 'certificates', 'contact'
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        setEnrollments(null);

        try {
            const data = await studentService.getStudentEnrollments(dni, email);

            if (data.length === 0) {
                setError(t('portal.no_enrollments') || 'No se han encontrado inscripciones para estos datos.');
                setLoading(false);
                return;
            }

            const courseIds = [...new Set(data.map(e => e.courseId))];
            const courseDetails = {};

            for (const cid of courseIds) {
                const c = await courseService.getCourseById(cid);
                if (c) courseDetails[cid] = c;
            }

            setCourses(courseDetails);
            setEnrollments(data);
        } catch (err) {
            console.error("Portal access error:", err);
            setError(t('portal.error') || 'Ha ocurrido un error al buscar tus datos.');
        } finally {
            setLoading(false);
        }
    };

    const calculateAttendance = (enrollment, course) => {
        if (!course) return { percentage: 0, eligible: false };
        const totalSessions = course.sessions?.length || 1;
        const count = enrollment.attendanceSessions ? enrollment.attendanceSessions.length : (enrollment.attended ? 1 : 0);
        const percentage = Math.round((count / totalSessions) * 100);
        const minPercentage = course.minAttendancePercentage || 80;
        return {
            percentage,
            eligible: percentage >= minPercentage,
            min: minPercentage
        };
    };

    const handleLogout = () => {
        setEnrollments(null);
        setCourses({});
        setError(null);
    };

    // Sidebar items configuration
    const sidebarItems = [
        { id: 'dashboard', label: 'Panell Principal', icon: <LayoutDashboard size={20} /> },
        { id: 'history', label: 'Historial', icon: <History size={20} /> },
        { id: 'certificates', label: 'Certificats', icon: <FileCheck size={20} /> },
        { id: 'contact', label: 'Contacte', icon: <Phone size={20} /> },
    ];

    if (enrollments) {
        const studentName = enrollments[0]?.fullName || 'Alumne/a';
        const filteredEnrollments = activeTab === 'history'
            ? enrollments.filter(e => courses[e.courseId]?.status === 'finished')
            : activeTab === 'certificates'
                ? enrollments.filter(e => e.certificateGenerated)
                : enrollments;

        return (
            <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-red-100">
                                <GraduationCap className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="font-black text-lg tracking-tight leading-none text-slate-800">Portal de l'Alumne</h1>
                                <p className="text-[10px] font-black uppercase text-primary tracking-widest mt-1">UGT FORMACIÓ</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 mt-4 space-y-1">
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === item.id
                                    ? 'bg-primary text-white shadow-xl shadow-red-200'
                                    : 'text-slate-500 hover:bg-red-50 hover:text-primary'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-50">
                        <div className="bg-slate-50 rounded-3xl p-4 flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-primary">
                                {studentName.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-black text-slate-800 truncate">{studentName}</p>
                                <p className="text-[10px] font-bold text-slate-400 truncate">{enrollments[0]?.dni}</p>
                            </div>
                            <button onClick={handleLogout} className="ml-auto text-slate-400 hover:text-red-600 transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top Bar (Mobile Optimized) */}
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 lg:z-10">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <LayoutDashboard size={24} className="text-slate-600" />
                            </button>
                            <h2 className="font-black text-xl text-slate-800 hidden md:block">
                                {sidebarItems.find(i => i.id === activeTab)?.label}
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                            </button>
                            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Benvingut,</span>
                                <span className="text-sm font-black text-slate-800">{studentName.split(' ')[0]}</span>
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Area */}
                    <main className="flex-1 p-8 lg:p-10 overflow-y-auto overflow-x-hidden">
                        {/* Welcome Hero Card */}
                        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-red-600 to-red-500 p-10 md:p-12 text-white shadow-2xl shadow-red-100 overflow-hidden mb-12">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl -ml-32 -mb-32"></div>
                            <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-20 hidden lg:block">
                                <GraduationCap size={200} strokeWidth={1} />
                            </div>

                            <div className="relative z-10 max-w-2xl">
                                <h3 className="text-4xl md:text-5xl font-black mb-4 leading-none">Hola, {studentName.split(' ')[0]}! 👋</h3>
                                <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed">
                                    Benvingut al teu espai de formació. Aquí podràs gestionar els teus cursos, consultar la teva assistència i descarregar certificats.
                                </p>
                            </div>
                        </div>

                        {/* Tab Contents */}
                        {activeTab === 'contact' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-8">
                                        <Mail size={32} />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Atenció a l'Alumne</h4>
                                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                        Tens algun dubte sobre els teus cursos o certificats? El nostre equip de gestió acadèmica t'ajudarà amb el que necessitis.
                                    </p>
                                    <a
                                        href="mailto:formacio@ugt.cat"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg shadow-slate-200"
                                    >
                                        Enviar Email
                                        <ExternalLink size={18} />
                                    </a>
                                </div>

                                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-8">
                                        <Phone size={32} />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Horari d'Atenció</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Dilluns - Dijous</span>
                                            <span className="text-sm font-bold text-slate-700">09:00 - 18:00</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Divendres</span>
                                            <span className="text-sm font-bold text-slate-700">09:00 - 14:00</span>
                                        </div>
                                    </div>
                                    <p className="mt-8 text-xs text-slate-400 font-bold tracking-tight bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                        📍 Rambla de Santa Mònica, 10, Barcelona
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Courses Grid */}
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <h4 className="flex items-center gap-3 text-2xl font-black text-slate-800 tracking-tight">
                                        <CircleHelp size={28} className="text-primary" />
                                        {activeTab === 'dashboard' ? 'Els meus cursos' : sidebarItems.find(i => i.id === activeTab)?.label}
                                    </h4>

                                    {/* Sub-filters for dashboard */}
                                    {activeTab === 'dashboard' && (
                                        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                                            <button
                                                onClick={() => setActiveTab('dashboard')}
                                                className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${activeTab === 'dashboard' ? 'text-white bg-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                Tots
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('history')}
                                                className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${activeTab === 'history' ? 'text-white bg-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                Finalitzats
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {filteredEnrollments.map(enroll => {
                                        const course = courses[enroll.courseId];
                                        const stats = calculateAttendance(enroll, course);
                                        const hasCertificate = enroll.certificateGenerated && enroll.certificateUrl;

                                        return (
                                            <div key={enroll.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/60 overflow-hidden hover:shadow-2xl hover:shadow-red-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                                                <div className="p-8 pb-4">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${enroll.status === 'Inscrit' || enroll.status === 'Pagat'
                                                                ? 'bg-emerald-50 text-emerald-600'
                                                                : 'bg-amber-50 text-amber-600'
                                                                }`}>
                                                                {enroll.status || 'Registrat'}
                                                            </span>
                                                            {course?.modality && (
                                                                <span className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">
                                                                    {course.modality}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <h5 className="text-2xl font-black text-slate-800 mb-6 group-hover:text-primary transition-colors leading-tight min-h-[3.5rem] line-clamp-2">
                                                        {course?.name || enroll.courseTitle || 'Curs sense títol'}
                                                    </h5>

                                                    <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-slate-100">
                                                                <Calendar size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inici</p>
                                                                <p className="text-sm font-bold text-slate-700">{course?.startDate ? new Date(course.startDate).toLocaleDateString() : '---'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500 border border-slate-100">
                                                                <User size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Professorat</p>
                                                                <p className="text-sm font-bold text-slate-700 truncate max-w-[100px]">{course?.instructor || 'Docent UGT'}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Attendance Progress */}
                                                    <div className="space-y-3 mb-8">
                                                        <div className="flex justify-between items-end">
                                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Assistència</p>
                                                            <p className={`text-sm font-black ${stats.eligible ? 'text-emerald-500' : 'text-amber-500'}`}>{stats.percentage}%</p>
                                                        </div>
                                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                                            <div
                                                                className={`h-full transition-all duration-700 ease-out rounded-full ${stats.eligible ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                                style={{ width: `${stats.percentage}%` }}
                                                            />
                                                        </div>
                                                        {!stats.eligible && stats.percentage > 0 && (
                                                            <p className="text-[10px] text-amber-500 font-bold italic">Mínim d'assistència requerit: {stats.min}%</p>
                                                        )}
                                                    </div>

                                                    {/* Files Section */}
                                                    <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <FileText size={16} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Documents i Justificants</span>
                                                        </div>

                                                        {hasCertificate ? (
                                                            <div className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-xl group/file transition-all hover:bg-red-50">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                                                        <FileCheck size={16} />
                                                                    </div>
                                                                    <p className="text-xs font-bold text-slate-700">Diploma Oficial.pdf</p>
                                                                </div>
                                                                <a href={enroll.certificateUrl} target="_blank" rel="noreferrer" className="p-2 text-red-500 hover:text-red-700">
                                                                    <Download size={18} />
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                                                                <p className="text-[11px] font-bold text-slate-400 italic">Encara no hi ha documents disponibles</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-8 pt-4 mt-auto">
                                                    {hasCertificate ? (
                                                        <a
                                                            href={enroll.certificateUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-200 transition-all hover:-translate-y-1"
                                                        >
                                                            Veure certificat
                                                            <ChevronRight size={18} />
                                                        </a>
                                                    ) : (
                                                        <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Curs en curs</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {filteredEnrollments.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                                        <Search size={48} className="mx-auto text-slate-200 mb-4" />
                                        <h5 className="text-xl font-black text-slate-400">No hi ha contingut disponible</h5>
                                        <p className="text-slate-400 text-sm mt-2">No s'han trobat registres per a aquesta secció.</p>
                                    </div>
                                )}
                            </>
                        )}

                        <footer className="mt-20 py-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 p-1.5 grayscale opacity-50">
                                    <img src="/logo-ugt.png" alt="UGT" className="w-full h-full object-contain" />
                                </div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">© {new Date().getFullYear()} UGT Catalunya - Sector EnForma</p>
                            </div>
                            <div className="flex items-center gap-8">
                                <button className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">Privacitat</button>
                                <button className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">Avís Legal</button>
                                <button className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">Configuració</button>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
            {/* Login Left Panel */}
            <div className="lg:w-7/12 bg-slate-50 relative flex flex-col justify-center p-12 lg:p-24 order-2 lg:order-1 overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/50 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-48 w-[40rem] h-[40rem] bg-indigo-50/50 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-lg">
                    <div className="mb-10 animate-in fade-in slide-in-from-left duration-700">
                        <div className="bg-primary w-20 h-2 bg-slate-900 rounded-full mb-8"></div>
                        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                            Benvingut al teu <span className="text-primary italic">espai</span> d'alumne.
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            Accedeix al teu historial de formació, consulta l'assistència i descarrega els teus certificats oficials de la UGT Catalunya.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                                <FileCheck size={20} />
                            </div>
                            <p className="text-sm font-black text-slate-800 tracking-tight">Certificats Oficials</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mt-1">Descarrega Directa</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                                <LayoutDashboard size={20} />
                            </div>
                            <p className="text-sm font-black text-slate-800 tracking-tight">Panell Personal</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase mt-1">Gestió a Temps Real</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Right Panel - Form */}
            <div className="lg:w-5/12 bg-white flex flex-col justify-center p-8 lg:p-16 order-1 lg:order-2 border-b lg:border-l border-slate-100">
                <div className="w-full max-w-sm mx-auto">
                    {/* Brand - NEW PROMINENT DESIGN */}
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl p-4 border border-slate-50 ring-8 ring-red-50/50 mb-6 group hover:scale-105 transition-transform duration-500">
                            <img src="/logo-ugt.png" alt="UGT" className="w-full h-full object-contain" />
                        </div>
                        <p className="text-xs font-black uppercase text-primary tracking-[0.4em] mb-1">UGT Catalunya</p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Sector EnForma</h2>
                    </div>

                    <div className="mb-10 text-center">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Portal de l'Alumne</p>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Identifica't i comença</h3>
                    </div>

                    {error && (
                        <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                                <Info size={14} />
                            </div>
                            <p className="text-xs text-red-800 font-bold leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSearch} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">DNI / NIE Identificador</label>
                            <div className="group relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    placeholder="12345678X"
                                    required
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-[6px] focus:ring-red-50 focus:border-red-500 transition-all text-slate-800 font-bold text-sm outline-none placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Correu Electrònic d'inscripció</label>
                            <div className="group relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="el-teu@correu.com"
                                    required
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-[6px] focus:ring-red-50 focus:border-red-500 transition-all text-slate-800 font-bold text-sm outline-none placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group bg-slate-900 hover:bg-black text-white py-5 rounded-[1.5rem] font-black text-sm shadow-2xl shadow-slate-200 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Accedir al meu espai</span>
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 flex items-center justify-between text-[10px] text-slate-300 font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span>Seguretat SSL 256bits</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CircleHelp size={14} />
                            <span className="hover:text-primary cursor-pointer transition-colors">Suport Alumnes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPortal;
