import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Link2, Lock, Unlock, Copy, Check, ExternalLink, ShieldAlert, Globe, Shield } from 'lucide-react';
import { courseService } from '../../services/courseService';

export const CourseLinkConfig = ({ isOpen, onClose, course }) => {
    const [config, setConfig] = useState({
        isPublic: false,
        requiresPassword: false,
        password: "",
    });
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (course) {
            setConfig({
                isPublic: course.isPublic || false,
                requiresPassword: course.requiresPassword || false,
                password: course.password || "",
            });
        }
    }, [course]);

    const publicUrl = `${window.location.origin}/public/register/${course?.id}`;

    const handleSave = async (newConfig) => {
        setSaving(true);
        try {
            await courseService.updateCourse(course.id, newConfig);
            setConfig(newConfig);
        } catch (error) {
            console.error("Error updating course link config", error);
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Configuració d'Accés Extern"
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="outline" onClick={onClose}>Tancar</Button>
                </div>
            }
        >
            <div className="space-y-6 py-2">
                {/* Header Info */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Curs Seleccionat</p>
                    <h3 className="text-lg font-black text-slate-900">{course?.title}</h3>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${config.isPublic ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Registre Públic</p>
                            <p className="text-[11px] text-slate-500">Permet inscripcions mitjançant enllaç extern</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleSave({ ...config, isPublic: !config.isPublic })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${config.isPublic ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {config.isPublic && (
                    <div className="space-y-4 animate-fade-in">
                        {/* URL Box */}
                        <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">URL DE REGISTRE</label>
                            <div className="flex items-center gap-3">
                                <code className="flex-1 text-xs text-blue-300 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                                    {publicUrl}
                                </code>
                                <div className="flex gap-1">
                                    <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
                                        {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                    </button>
                                    <a href={publicUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
                                        <ExternalLink size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Password Protection */}
                        <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${config.requiresPassword ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Shield size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">Protecció per Contrasenya</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={config.requiresPassword}
                                    onChange={() => handleSave({ ...config, requiresPassword: !config.requiresPassword })}
                                    className="w-4 h-4 rounded text-ugt-red focus:ring-ugt-red"
                                />
                            </div>

                            {config.requiresPassword && (
                                <div className="pt-2 space-y-2 animate-fade-in">
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Ex: UGT2026"
                                            value={config.password}
                                            onChange={(e) => setConfig({ ...config, password: e.target.value })}
                                            onBlur={() => handleSave(config)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium px-1 flex items-center gap-1">
                                        <ShieldAlert size={10} />
                                        Es demanarà aquesta contrasenya abans de mostrar el formulari.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {saving && (
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">
                        <div className="w-3 h-3 border-2 border-slate-200 border-t-ugt-red rounded-full animate-spin"></div>
                        Sincronitzant dades...
                    </div>
                )}
            </div>
        </Modal>
    );
};
