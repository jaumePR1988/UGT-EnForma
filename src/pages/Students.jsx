import React, { useEffect, useState, useCallback } from 'react';
import { studentService } from '../services/studentService';
import { RegistrationModal } from '../components/students/RegistrationModal';

export const Students = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);

    const loadStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await studentService.getStudents();
            setStudents(data);
            setFilteredStudents(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    useEffect(() => {
        const results = students.filter(student =>
            (student.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.surname?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (student.company?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(results);
    }, [searchTerm, students]);

    return (
        <div className="animate-slide-up">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <nav aria-label="Breadcrumb" className="flex text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        <ol className="inline-flex items-center space-x-2" style={{ listStyle: 'none' }}>
                            <li>Admin</li>
                            <li><span className="mx-1">/</span></li>
                            <li className="text-slate-600 dark:text-slate-300">Alumnat</li>
                        </ol>
                    </nav>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Base de Dades d'Alumnat</h2>
                </div>
                <div className="flex gap-3">
                    <button className="btn-premium flex items-center gap-2" onClick={() => setIsRegModalOpen(true)}>
                        <span className="material-icons-outlined text-lg">person_add</span>
                        AFEGIR ALUMNE
                    </button>
                </div>
            </header>

            <RegistrationModal
                isOpen={isRegModalOpen}
                onClose={() => setIsRegModalOpen(false)}
                onFinish={loadStudents}
            />

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-6 flex items-center gap-3 animate-pulse">
                    <span className="material-icons-outlined">error_outline</span>
                    <p className="text-sm font-medium flex-1">{error}</p>
                    <button onClick={loadStudents} className="text-sm font-bold underline bg-transparent border-none cursor-pointer">Reintentar</button>
                </div>
            )}

            <div className="card overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 justify-between items-center bg-white dark:bg-slate-800/50">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Cerca per nom, DNI o empresa..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors bg-white dark:bg-slate-800">
                            <span className="material-icons-outlined text-lg">filter_alt</span>
                            Filtres
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors bg-white dark:bg-slate-800">
                            <span className="material-icons-outlined text-lg">file_download</span>
                            Exportar
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-container text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="table-header-cell">Alumne & Identitat</th>
                                <th className="table-header-cell">Contacte</th>
                                <th className="table-header-cell">Empresa / Localitat</th>
                                <th className="table-header-cell">Estat Afiliació</th>
                                <th className="table-header-cell text-right">Accions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="5" className="p-4">
                                            <div className="animate-pulse flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                                                <div className="flex-1 h-3 bg-slate-100 rounded"></div>
                                                <div className="w-24 h-5 bg-slate-100 rounded-full"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-icons-outlined text-4xl text-slate-200">person_off</span>
                                            <p className="text-slate-500 font-medium">No hi ha alumnes que coincideixin amb la cerca</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="table-row group">
                                        <td className="table-cell">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
                                                    <span className="material-icons-outlined text-slate-400">person</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{student.name} {student.surname}</p>
                                                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">{student.dni || 'Sense DNI'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                    <span className="material-icons-outlined text-xs text-slate-400">mail</span>
                                                    {student.email}
                                                </div>
                                                {student.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                        <span className="material-icons-outlined text-xs text-slate-400">phone</span>
                                                        {student.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{student.company || 'Particular'}</span>
                                                <span className="text-[10px] text-slate-400 uppercase">{student.city || 'Sense localitat'}</span>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${student.isAffiliated
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                {student.isAffiliated ? 'Afiliat/da' : 'No Afiliat'}
                                            </span>
                                        </td>
                                        <td className="table-cell text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-primary transition-colors bg-transparent border-none cursor-pointer">
                                                    <span className="material-icons-outlined text-lg">edit</span>
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-primary transition-colors bg-transparent border-none cursor-pointer">
                                                    <span className="material-icons-outlined text-lg">more_vert</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
