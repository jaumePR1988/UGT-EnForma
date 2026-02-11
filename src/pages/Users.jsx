import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../services/userService';
import { notificationService } from '../services/notificationService';
import { useNotifications } from '../context/NotificationContext';
import {
    UserPlus,
    Search,
    MoreHorizontal,
    Edit2,
    Trash2,
    Shield,
    User,
    CheckCircle2,
    XCircle,
    Mail,
    UserCircle
} from 'lucide-react';

const Users = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotifications();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'teacher',
        active: true
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error loading users:", error);
            showNotification(t('common.error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, {
                    name: formData.name,
                    role: formData.role,
                    active: formData.active
                });
                showNotification(t('common.save'), 'success');
            } else {
                // Now we just save as invitation by email
                await userService.saveInvitation({
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    active: true
                });
                showNotification(t('common.save'), 'success');
            }
            setIsModalOpen(false);
            loadUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            showNotification(t('common.error'), 'error');
        }
    };

    const handleDelete = async (uid) => {
        if (window.confirm(t('users.modal.delete_confirm'))) {
            try {
                await userService.deleteUser(uid);
                showNotification(t('common.save'), 'success');
                loadUsers();
            } catch (error) {
                showNotification(t('common.error'), 'error');
            }
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'teacher',
            active: user.active !== false
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'teacher',
            active: true
        });
        setIsModalOpen(true);
    };

    const handleSendInvite = async (user) => {
        try {
            const success = await notificationService.sendInvitationEmail(user, {
                subject: t('users.invite_subject'),
                body: t('users.invite_body')
            });

            if (success) {
                showNotification(t('users.modal.invite_sent', 'Invitació enviada correctament'), 'success');
            } else {
                throw new Error('Email failed');
            }
        } catch (error) {
            console.error("Error sending invite email:", error);
            showNotification(t('common.error'), 'error');

            // Fallback to mailto if automatic fail
            const subject = t('users.invite_subject', 'Bienvenido/a a UGT EnForma');
            const role = t(`users.roles.${user.role}`);
            const link = window.location.origin;
            let body = t('users.invite_body', 'Hola %NAME%, te hemos dado de alta...')
                .replace('%NAME%', user.name)
                .replace('%ROLE%', role)
                .replace('%LINK%', link);

            window.location.href = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-500/20">
                            <Shield size={28} />
                        </span>
                        {t('users.title')}
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">{t('users.subtitle')}</p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="bg-primary hover:bg-red-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-red-500/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 group"
                >
                    <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                    {t('users.new_button')}
                </button>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Filters Area */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder={t('dashboard.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('users.table.name')}</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('users.table.role')}</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('users.table.status')}</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">{t('users.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-8 py-6">
                                            <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all">
                                                    <UserCircle size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800">{user.name || '---'}</p>
                                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-1">
                                                        <Mail size={12} />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-600">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${user.role === 'admin'
                                                ? 'bg-amber-50 border-amber-100 text-amber-700'
                                                : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                                                }`}>
                                                {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                                                {t(`users.roles.${user.role}`)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${user.active !== false
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {user.active !== false ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {user.active !== false ? t('users.status.active') : t('users.status.inactive')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleSendInvite(user)}
                                                    className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title={t('users.modal.fields.send_invite', 'Enviar Invitación')}
                                                >
                                                    <Mail size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2.5 text-slate-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all"
                                                    title={t('common.edit')}
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title={t('confirm.yes_delete')}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium">
                                        {t('courses.no_courses')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                {editingUser ? <Edit2 className="text-primary" /> : <UserPlus className="text-primary" />}
                                {editingUser ? t('users.modal.edit_title') : t('users.modal.create_title')}
                            </h2>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('users.modal.fields.name')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('users.modal.fields.email')}</label>
                                <input
                                    type="email"
                                    required
                                    disabled={!!editingUser}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-5 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium ${editingUser ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('users.modal.fields.role')}</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                        className={`px-4 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${formData.role === 'teacher' ? 'border-primary bg-red-50 shadow-lg shadow-red-500/10' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <User className={formData.role === 'teacher' ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'} />
                                        <span className={`text-sm font-black ${formData.role === 'teacher' ? 'text-slate-800' : 'text-slate-400'}`}>{t('users.roles.teacher')}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'admin' })}
                                        className={`px-4 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${formData.role === 'admin' ? 'border-primary bg-red-50 shadow-lg shadow-red-500/10' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <Shield className={formData.role === 'admin' ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'} />
                                        <span className={`text-sm font-black ${formData.role === 'admin' ? 'text-slate-800' : 'text-slate-400'}`}>{t('users.roles.admin')}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all active:scale-95"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 bg-primary hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-500/30 transition-all active:scale-95"
                                >
                                    {t('common.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
