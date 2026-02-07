import React from 'react';
import Sidebar from '../components/layout/Sidebar';

import { studentService } from '../services/studentService';

const Students = ({ onNavigate, toggleDarkMode, students, refreshStudents }) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    // Auto-refresh students when entering the page
    React.useEffect(() => {
        if (refreshStudents) refreshStudents();
    }, []);

    const filteredStudents = students ? students.filter(student => {
        const term = searchTerm.toLowerCase();
        return (
            (student.fullName && student.fullName.toLowerCase().includes(term)) ||
            (student.dni && student.dni.toLowerCase().includes(term)) ||
            (student.email && student.email.toLowerCase().includes(term))
        );
    }) : [];

    // ... existing formatDate and handleDelete ...

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        // Handle Firestore Timestamp or Date object/string
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString();
    };

    const handleDelete = async (studentId) => {
        if (window.confirm("Estàs segur que vols eliminar aquest alumne? Aquesta acció no es pot desfer.")) {
            try {
                await studentService.deleteStudent(studentId);
                if (refreshStudents) await refreshStudents();
            } catch (error) {
                console.error("Error deleting student:", error);
                alert("Error eliminant l'alumne.");
            }
        }
    };

    const handleExportCSV = () => {
        if (!filteredStudents || filteredStudents.length === 0) {
            alert("No hi ha dades per exportar.");
            return;
        }

        const headers = ["Nom i Cognoms", "DNI", "Email", "Telèfon", "Curs", "Empresa", "Federació", "Afiliat", "Data Inscripció", "Estat"];
        const csvContent = [
            headers.join(','),
            ...filteredStudents.map(s => [
                `"${s.fullName || ''}"`,
                `"${s.dni || ''}"`,
                `"${s.email || ''}"`,
                `"${s.phone || ''}"`,
                `"${s.courseTitle || ''}"`,
                `"${s.company || ''}"`,
                `"${s.federation || ''}"`,
                `"${s.isAffiliated ? 'Sí' : 'No'}"`,
                `"${s.registeredAt ? new Date(s.registeredAt.toDate ? s.registeredAt.toDate() : s.registeredAt).toLocaleDateString() : ''}"`,
                `"${s.status || ''}"`
            ].join(','))
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
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestió d'Alumnat</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Administració centralitzada de participants i inscripcions</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-72 transition-all text-sm"
                                placeholder="Buscar per nom, DNI o email..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            className="p-2 text-slate-400 hover:text-primary transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                            title="Actualitzar llista"
                            onClick={() => refreshStudents && refreshStudents()}
                        >
                            <span className="material-icons-outlined text-[20px]">refresh</span>
                        </button>
                        <button
                            className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                            onClick={() => onNavigate('enroll-student')}
                        >
                            <span className="material-icons-outlined mr-2 text-[20px]">person_add</span>
                            Inscriure Alumne
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Alumnes Actius</h3>
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
                    {/* Placeholder stats */}
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-60">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Noves Inscripcions</h3>
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
                            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Taxa d'Abandonament</h3>
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
                        <h2 className="font-bold text-lg">Llistat detallat d'alumnat</h2>
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-icons-outlined mr-1.5 text-[18px]">filter_list</span>
                                Filtres
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-icons-outlined mr-1.5 text-[18px]">download</span>
                                Exportar CSV
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumne/a</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Curs</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estat</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Accions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredStudents && filteredStudents.length > 0 ? (
                                    filteredStudents.map(student => (
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
                                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${student.status === 'registered' || student.status === 'Inscrit' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
                                                    }`}>
                                                    {student.status || 'Registrat'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="Veure perfil">
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
                                                        onClick={() => handleDelete(student.id)}
                                                    >
                                                        <span className="material-icons-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                            No s'han trobat alumnes que coincideixin amb la cerca.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Students;
