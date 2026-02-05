import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
    Sparkles, ArrowRight, ArrowLeft, Check, Layout, Brain,
    MapPin, Zap, Info, ShieldCheck, QrCode, Link as LinkIcon,
    Lock, Users, Calendar, Globe, Eye
} from 'lucide-react';
import { courseDraftService } from '../../services/courseDraftService';
import { Badge } from '../ui/Badge';

export const CourseModal = ({ isOpen, onClose, onSave, courseToEdit = null }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
        startDate: '',
        capacity: 25,
        location: '',
        status: 'open',
        objectives: [],
        requiresPassword: false,
        password: '',
        registrationFields: ['fullName', 'email', 'phone', 'company']
    });
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccessAnim, setShowSuccessAnim] = useState(false);

    useEffect(() => {
        if (courseToEdit) {
            setFormData({
                ...formData,
                ...courseToEdit
            });
        }
    }, [courseToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleIaMagic = async () => {
        if (!formData.title) return;
        setIsGenerating(true);
        try {
            const result = await courseDraftService.generateContent(formData.title);
            setFormData(prev => ({
                ...prev,
                title: result.title,
                description: result.description,
                category: result.category,
                objectives: result.objectives
            }));
            const logistics = courseDraftService.suggestLogistics(result.category);
            setFormData(prev => ({
                ...prev,
                capacity: logistics.capacity,
                location: logistics.location
            }));
        } catch (error) {
            console.error("Error generating content", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSave(formData);
            setShowSuccessAnim(true);
            setTimeout(() => {
                onClose();
                setShowSuccessAnim(false);
            }, 2000);
        } catch (error) {
            console.error("Error saving course", error);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const StepIndicator = () => (
        <div className="flex items-center justify-between mb-10 px-4">
            {[
                { n: 1, label: 'Idea', icon: Brain },
                { n: 2, label: 'Logística', icon: MapPin },
                { n: 3, label: 'Registre', icon: Users },
                { n: 4, label: 'Resum', icon: Eye }
            ].map((s, i) => (
                <React.Fragment key={s.n}>
                    <div className="flex flex-col items-center gap-2 group">
                        <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 ${step === s.n ? 'bg-ugt-red text-white shadow-xl shadow-red-100 scale-110' :
                                step > s.n ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'
                            }`}>
                            {step > s.n ? <Check size={20} strokeWidth={3} /> : <s.icon size={20} />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${step === s.n ? 'text-ugt-red' : 'text-slate-400'}`}>
                            {s.label}
                        </span>
                    </div>
                    {i < 3 && (
                        <div className={`flex-1 h-[3px] mx-4 mb-6 rounded-full transition-all duration-700 ${step > s.n ? 'bg-emerald-500' : 'bg-slate-50'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            title={courseToEdit ? "Edició de Curs" : "Nou Curs Experience"}
            footer={
                <div className="flex justify-between items-center w-full px-2">
                    <div className="flex gap-2">
                        {step > 1 && (
                            <Button variant="ghost" onClick={prevStep} className="text-slate-500 font-bold hover:bg-slate-50 border-none">
                                <ArrowLeft size={18} className="mr-2" /> Tornar
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="font-bold text-slate-400 border-none">Cancel·lar</Button>
                        {step < 4 ? (
                            <Button variant="primary" onClick={nextStep} className="grad-ugt px-10 font-black py-4 rounded-2xl shadow-red relative group overflow-hidden">
                                <span className="relative z-10 flex items-center">
                                    Següent <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleSubmit} disabled={loading} className="grad-ugt px-12 font-black py-4 rounded-2xl shadow-red">
                                {loading ? 'Publicant...' : 'Publicar ARA'}
                            </Button>
                        )}
                    </div>
                </div>
            }
        >
            <div className="py-2">
                <StepIndicator />

                <div className="animate-fade-in min-h-[420px]">
                    {step === 1 && (
                        <div className="space-y-8 animate-slide-up">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <Zap size={14} className="text-ugt-red" /> Títol o Conceptes Clau
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="title"
                                        autoFocus
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Ex: Prevenció de riscos o Salut Mental..."
                                        className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[2rem] text-xl font-bold outline-none focus:bg-white focus:border-red-100 focus:ring-8 focus:ring-red-50/30 transition-all placeholder:text-slate-300"
                                    />
                                    {!formData.description && (
                                        <button
                                            onClick={handleIaMagic}
                                            disabled={!formData.title || isGenerating}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                            title="Generar contingut amb IA"
                                        >
                                            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoria</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['General', 'Jurídic', 'Sindical', 'Salut'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setFormData({ ...formData, category: cat })}
                                                className={`px-5 py-3 rounded-[1.25rem] text-sm font-bold border-2 transition-all ${formData.category === cat
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105'
                                                        : 'bg-white text-slate-500 border-slate-50 hover:border-slate-200'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Objectius IA</label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.objectives && formData.objectives.length > 0 ? (
                                            formData.objectives.slice(0, 3).map((obj, i) => (
                                                <Badge key={i} variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100 py-1 px-3">
                                                    {obj}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-slate-300 font-bold italic p-2 border border-dashed border-slate-100 rounded-lg">Fes clic a l'espurna per generar-los</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripció del Programa</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-sm font-medium outline-none focus:bg-white focus:border-red-50 transition-all resize-none leading-relaxed"
                                    placeholder="Redacta la descripció o deixa que la IA ho faci..."
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-slide-up">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Calendar size={14} className="text-ugt-red" /> Data d'Inici Prevista
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        required
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-red-50"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Users size={14} className="text-ugt-red" /> Aforament Màxim
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="5"
                                            max="100"
                                            name="capacity"
                                            value={formData.capacity}
                                            onChange={handleChange}
                                            className="flex-1 accent-ugt-red"
                                        />
                                        <span className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-900 border border-slate-200">
                                            {formData.capacity}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Modalitat i Ubicació</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setFormData({ ...formData, location: 'Presencial' })}
                                        className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all ${formData.location.includes('Presencial') || !formData.location.includes('Zoom') && !formData.location.includes('Teams')
                                                ? 'border-ugt-red bg-red-50/30' : 'border-slate-50 bg-slate-50/50'
                                            }`}
                                    >
                                        <MapPin size={32} className={formData.location.includes('Presencial') ? 'text-ugt-red' : 'text-slate-300'} />
                                        <span className={`text-xs font-black uppercase tracking-widest ${formData.location.includes('Presencial') ? 'text-ugt-red' : 'text-slate-500'}`}>Presencial</span>
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, location: 'Online (Zoom / Teams)' })}
                                        className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all ${formData.location.includes('Online') ? 'border-blue-500 bg-blue-50/30' : 'border-slate-50 bg-slate-50/50'
                                            }`}
                                    >
                                        <Globe size={32} className={formData.location.includes('Online') ? 'text-blue-500' : 'text-slate-300'} />
                                        <span className={`text-xs font-black uppercase tracking-widest ${formData.location.includes('Online') ? 'text-blue-500' : 'text-slate-500'}`}>Online / Híbrid</span>
                                    </button>
                                </div>
                            </div>

                            <div className="relative group">
                                <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Adreça de la seu o enllaç de videoconferència..."
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-sm font-bold outline-none focus:bg-white focus:border-red-50"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-slide-up">
                            <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500 rounded-xl">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-widest">Seguretat i Accés</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Configura qui i com es pot inscriure</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Lock size={18} className="text-slate-400" />
                                        <span className="text-sm font-bold">Protegir amb contrasenya</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="requiresPassword"
                                        checked={formData.requiresPassword}
                                        onChange={handleChange}
                                        className="w-6 h-6 rounded-lg accent-emerald-500 cursor-pointer"
                                    />
                                </div>

                                {formData.requiresPassword && (
                                    <input
                                        type="text"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Estableix una contrasenya d'accés..."
                                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white font-bold outline-none focus:bg-white/20 transition-all placeholder:text-slate-500"
                                    />
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Camps del Formulari d'Inscripció</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'fullName', label: 'Nom Complet', fixed: true },
                                        { id: 'email', label: 'Email', fixed: true },
                                        { id: 'phone', label: 'Telèfon', fixed: false },
                                        { id: 'company', label: 'Empresa', fixed: false },
                                        { id: 'dni', label: 'DNI / NIE', fixed: false },
                                        { id: 'notes', label: 'Observacions', fixed: false }
                                    ].map(field => (
                                        <div key={field.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <span className="text-xs font-bold text-slate-700">{field.label}</span>
                                            {field.fixed ? (
                                                <Badge variant="secondary" className="bg-slate-200 text-slate-500 text-[9px]">OBLIGATORI</Badge>
                                            ) : (
                                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-ugt-red" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 animate-slide-up">
                            <div className="text-center space-y-2 mb-4">
                                <h3 className="text-2xl font-black text-slate-900">¡Tot a punt!</h3>
                                <p className="text-sm text-slate-500 font-medium">Revisa el resum i publica el curs per activar el registre.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Títol del curs</p>
                                        <p className="text-lg font-black text-slate-900 leading-tight">{formData.title}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</p>
                                            <p className="text-sm font-bold text-slate-700">{formData.startDate || 'Propera'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aforament</p>
                                            <p className="text-sm font-bold text-slate-700">{formData.capacity} places</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicació</p>
                                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <MapPin size={14} className="text-ugt-red" /> {formData.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 relative group">
                                    <div className="w-32 h-32 bg-white rounded-2xl shadow-premium flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
                                        <QrCode size={64} className="text-slate-900" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">QR d'Assistència</p>
                                    <p className="text-[9px] text-slate-300 font-bold mt-1">(Es generarà en publicar)</p>

                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed">
                                        <div className="flex flex-col items-center gap-2">
                                            <Lock size={20} className="text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Publica per activar</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-[1.5rem] border border-blue-100">
                                <div className="p-3 bg-blue-600 text-white rounded-xl">
                                    <Globe size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-blue-900">Enllaç Públic de Registre</p>
                                    <p className="text-[11px] text-blue-700 font-medium">https://ugt-enforma.cat/reg/...</p>
                                </div>
                                <Button variant="ghost" size="sm" className="bg-white/50 border-none">
                                    <LinkIcon size={16} className="text-blue-600" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Pantalla d'èxit final */}
            {showSuccessAnim && (
                <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in rounded-3xl">
                    <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 animate-bounce">
                        <Check size={48} strokeWidth={4} />
                    </div>
                    <h2 className="text-3xl font-black mt-8 text-slate-900">Curs Publicat!</h2>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">L'oferta ja és visible per als delegats</p>
                </div>
            )}
        </Modal>
    );
};

const Loader2 = ({ className, size }) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
