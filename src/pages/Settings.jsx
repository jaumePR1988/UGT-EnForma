import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/layout/Sidebar';
import { instructorService } from '../services/instructorService';
import { courseService } from '../services/courseService';
import { Button } from '../components/ui/Button'; // Assuming we can use this or standard button
import { Trash2, Plus, UserPlus, RefreshCw } from 'lucide-react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useNotifications } from '../context/NotificationContext';

const Settings = ({ onNavigate, toggleDarkMode }) => {
    const { t } = useTranslation();
    const { showNotification } = useNotifications();
    const [activeTab, setActiveTab] = useState('profile');
    const [instructors, setInstructors] = useState([]);
    const [newInstructorName, setNewInstructorName] = useState('');
    const [newInstructorEmail, setNewInstructorEmail] = useState('');
    const [loadingInstructors, setLoadingInstructors] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'danger', onConfirm: () => { }, title: '', description: '', confirmText: '' });

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
            await instructorService.addInstructor({
                name: newInstructorName.trim(),
                email: newInstructorEmail.trim()
            });
            setNewInstructorName('');
            setNewInstructorEmail('');
            loadInstructors();
        } catch (error) {
            showNotification("Error afegint instructor: " + error.message, "error");
        } finally {
            setLoading(false); // Reset loading
        }
    };

    const handleDeleteInstructor = (id) => {
        setConfirmConfig({
            isOpen: true,
            type: 'danger',
            title: t('confirm.delete_teacher_title'),
            description: t('confirm.delete_teacher_desc'),
            confirmText: t('confirm.yes_delete'),
            onConfirm: async () => {
                setLoading(true);
                try {
                    await instructorService.deleteInstructor(id);
                    loadInstructors();
                } catch (error) {
                    showNotification("Error eliminant instructor: " + error.message, "error");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleSyncCounts = () => {
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: t('confirm.sync_counts_title'),
            description: t('confirm.sync_counts_desc'),
            confirmText: t('confirm.yes_continue'),
            onConfirm: async () => {
                setLoading(true);
                try {
                    const result = await courseService.syncAllCourseCounts();
                    showNotification(`Sincronització completada! S'han actualitzat ${result.updatedCourses} cursos.`, "success");
                } catch (error) {
                    console.error(error);
                    showNotification("Error durant la sincronització: " + error.message, "error");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const tabs = [
        { id: 'profile', label: t('settings.tabs.profile'), icon: 'person' },
        { id: 'team', label: t('settings.tabs.team'), icon: 'groups' },
        { id: 'notifications', label: t('settings.tabs.notifications'), icon: 'notifications' },
        { id: 'maintenance', label: t('settings.tabs.maintenance'), icon: 'build' }
    ];

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t('settings.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('settings.subtitle')}</p>
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
                                        <h2 className="text-lg font-bold">{t('settings.team.title')}</h2>
                                        <p className="text-sm text-slate-500">{t('settings.team.subtitle')}</p>
                                    </div>
                                </div>

                                {/* Add Instructor Form */}
                                <form onSubmit={handleAddInstructor} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 items-end">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nom del Docent</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ex: Joan Garcia"
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm"
                                            value={newInstructorName}
                                            onChange={(e) => setNewInstructorName(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email (per a l'inici de sessió)</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="Ex: joan@ugt.cat"
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm"
                                            value={newInstructorEmail}
                                            onChange={(e) => setNewInstructorEmail(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !newInstructorName.trim() || !newInstructorEmail.trim()}
                                        className="bg-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 h-[42px]"
                                    >
                                        {loading ? t('settings.team.adding') : t('settings.team.add_button')}
                                    </button>
                                </form>

                                {/* Instructors List */}
                                <div className="space-y-2">
                                    {loadingInstructors ? (
                                        <p className="text-sm text-slate-500 text-center py-4">{t('settings.team.loading')}</p>
                                    ) : instructors.length === 0 ? (
                                        <p className="text-sm text-slate-500 text-center py-4">{t('settings.team.no_instructors')}</p>
                                    ) : (
                                        instructors.map((instructor) => (
                                            <div key={instructor.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg group">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-black">
                                                        {(instructor.name || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-slate-800 dark:text-white leading-tight">{instructor.name || 'Sense Nom'}</span>
                                                        <span className="text-[11px] text-slate-400 font-medium">{instructor.email || 'Sense email'}</span>
                                                    </div>
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

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                description={confirmConfig.description}
                confirmText={confirmConfig.confirmText}
                cancelText={t('common.cancel')}
                type={confirmConfig.type}
            />
        </div>
    );
};

export default Settings;
