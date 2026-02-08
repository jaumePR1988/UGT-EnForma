import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { instructorService } from '../services/instructorService';
import { courseService } from '../services/courseService';
import { Button } from '../components/ui/Button'; // Assuming we can use this or standard button
import { Trash2, Plus, UserPlus } from 'lucide-react';

const Settings = ({ onNavigate, toggleDarkMode }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [instructors, setInstructors] = useState([]);
    const [newInstructorName, setNewInstructorName] = useState('');
    const [loadingInstructors, setLoadingInstructors] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'team') {
            loadInstructors();
        }
    }, [activeTab]);

    const loadInstructors = async () => {
        setLoadingInstructors(true);
        try {
            const data = await instructorService.getInstructors();
            setInstructors(data);
        } catch (error) {
            console.error("Error loading instructors:", error);
        } finally {
            setLoadingInstructors(false);
        }
    };

    const handleAddInstructor = async (e) => {
        e.preventDefault();
        if (!newInstructorName.trim()) return;

        try {
            await instructorService.addInstructor({ name: newInstructorName.trim() });
            setNewInstructorName('');
            loadInstructors();
        } catch (error) {
            alert("Error afegint instructor: " + error.message);
        } finally {
            setLoading(false); // Reset loading
        }
    };

    const handleDeleteInstructor = async (id) => {
        if (window.confirm("Estàs segur que vols eliminar aquest docent?")) {
            setLoading(true); // Set loading for delete instructor
            try {
                await instructorService.deleteInstructor(id);
                loadInstructors();
            } catch (error) {
                alert("Error eliminant instructor: " + error.message);
            } finally {
                setLoading(false); // Reset loading
            }
        }
    };

    const handleSyncCounts = async () => {
        if (!window.confirm("Això recalcularà el nombre d'alumnes de tots els cursos basant-se en les inscripcions reals. Vols continuar?")) return;

        setLoading(true);
        try {
            const result = await courseService.syncAllCourseCounts();
            alert(`Sincronització completada! S'han actualitzat ${result.updatedCourses} cursos.`);
        } catch (error) {
            console.error(error);
            alert("Error durant la sincronització: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'El Meu Perfil', icon: 'person' },
        { id: 'team', label: 'Equip Docent', icon: 'groups' },
        { id: 'notifications', label: 'Notificacions', icon: 'notifications' },
        { id: 'maintenance', label: 'Manteniment', icon: 'build' }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="settings" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Configuració</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona el teu perfil, preferències i equip.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Settings Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-6">
                            <nav className="flex flex-col p-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === tab.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <span className="material-icons-outlined text-[20px]">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="flex-1">

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                {/* Profile Card */}
                                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                                    <h2 className="text-lg font-bold mb-4">Informació Personal</h2>
                                    <div className="flex items-start space-x-6">
                                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-2xl font-bold border-2 border-white dark:border-slate-600 shadow-md">
                                            JP
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nom Complet</label>
                                                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm" defaultValue="Jaume Pedragosa" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                                                    <input type="email" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm" defaultValue="jaume@ugt.cat" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Càrrec</label>
                                                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm" defaultValue="Administrador" readOnly />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Departament</label>
                                                    <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm" defaultValue="Formació" readOnly />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                                                    Desar Canvis
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TEAM TAB */}
                        {activeTab === 'team' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-lg font-bold">Gestió d'Equip Docent</h2>
                                            <p className="text-sm text-slate-500">Afegeix o elimina instructors que poden impartir cursos.</p>
                                        </div>
                                    </div>

                                    {/* Add Instructor Form */}
                                    <form onSubmit={handleAddInstructor} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mb-6 flex gap-3 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nom del Docent</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ex: Maria García"
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm"
                                                value={newInstructorName}
                                                onChange={(e) => setNewInstructorName(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading || !newInstructorName.trim()}
                                            className="bg-primary hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center mb-[1px]"
                                        >
                                            {loading ? 'Afegint...' : 'Afegir'}
                                        </button>
                                    </form>

                                    {/* Instructors List */}
                                    <div className="space-y-2">
                                        {loadingInstructors ? (
                                            <p className="text-sm text-slate-500 text-center py-4">Carregant docents...</p>
                                        ) : instructors.length === 0 ? (
                                            <p className="text-sm text-slate-500 text-center py-4">No hi ha docents registrats.</p>
                                        ) : (
                                            instructors.map((instructor) => (
                                                <div key={instructor.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg group">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold">
                                                            {(instructor.name || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-sm">{instructor.name || 'Sense Nom'}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteInstructor(instructor.id)}
                                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                        title="Eliminar"
                                                    >
                                                        <span className="material-icons-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                                    <h2 className="text-lg font-bold mb-4">Preferències de Notificacions</h2>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Noves inscripcions', desc: 'Rep un email quan un alumne s\'inscrigui.' },
                                            { label: 'Resums setmanals', desc: 'Reb un resum de l\'activitat cada dilluns.' },
                                            { label: 'Alertes de sistema', desc: 'Notificacions importants sobre manteniment.' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0 border-slate-100 dark:border-slate-800">
                                                <div>
                                                    <p className="font-medium text-sm">{item.label}</p>
                                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MAINTENANCE TAB */}
                        {activeTab === 'maintenance' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                                    <h2 className="text-lg font-bold mb-4 flex items-center text-orange-600">
                                        <span className="material-icons-outlined mr-2">medical_services</span>
                                        Reparació de Dades
                                    </h2>
                                    <p className="text-sm text-slate-500 mb-6">
                                        Utilitza aquestes eines si detectes inconsistències en les dades, com ara comptadors d'alumnes incorrectes.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div>
                                                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Sincronitzar Comptadors d'Alumnes</h3>
                                                <p className="text-xs text-slate-500 mt-1">Recalcula el nombre total d'inscrits per a cada curs basant-se en els registres reals.</p>
                                            </div>
                                            <button
                                                onClick={handleSyncCounts}
                                                disabled={loading}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${loading ? 'bg-slate-200 text-slate-400' : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm'}`}
                                            >
                                                {loading ? 'Processant...' : 'Executar Sincronització'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
