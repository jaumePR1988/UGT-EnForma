import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Login = ({ onLogin }) => {
    const { t, i18n } = useTranslation();
    const { login, resetPassword } = useAuth();
    const { showNotification } = useNotifications();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    // Get error from navigation state (set by ProtectedRoute)
    const location = useLocation();
    const roleError = location.state?.error === 'no_access_permission';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);
            showNotification(t('login.success_message', 'Sessió iniciada correctament'), 'success');
            onLogin();
        } catch (error) {
            console.error("Login error:", error);
            showNotification(t('login.error_message', 'Error en l\'inici de sessió. Revisa les teves credencials.'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!forgotEmail) return;
        setIsSubmitting(true);
        try {
            await resetPassword(forgotEmail);
            showNotification(t('login.reset_email_sent', 'S\'ha enviat un correu de restabliment'), 'success');
            setIsForgotModalOpen(false);
        } catch (error) {
            console.error("Reset error:", error);
            showNotification(t('login.reset_error', 'No s\'ha trobat cap usuari amb aquest correu'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen font-sans">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-12 overflow-hidden">
                {/* Decorative background for branding */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="absolute -right-20 -top-20 text-white fill-current opacity-40" height="400" viewbox="0 0 200 200" width="400">
                        <path d="M100 0 C155 0 200 45 200 100 S155 200 100 200 0 155 0 100 45 0 100 0 Z"></path>
                    </svg>
                    <svg className="absolute -left-20 -bottom-20 text-white fill-current opacity-20" height="600" viewbox="0 0 200 200" width="600">
                        <rect height="120" transform="rotate(25)" width="120" x="40" y="40"></rect>
                    </svg>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1 shadow-inner">
                            <img src="/logo-ugt.png" alt="UGT Formació" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-2xl leading-tight">UGT <span className="text-white/70">Formació</span></h1>
                            <p className="text-[10px] uppercase tracking-widest text-white/60 font-black">{t('login.subtitle', 'Sindicat Global')}</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mb-12">
                    <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] max-w-lg mb-8 drop-shadow-lg">
                        {t('login.hero_title', 'Gestiona la formació amb eficiència')}
                    </h2>
                    <div className="h-2 w-24 bg-white rounded-full mb-8"></div>
                    <p className="text-white/80 text-xl max-w-md font-medium leading-relaxed">
                        {t('login.hero_description', 'Accedeix al panell de control per gestionar cursos, alumnes i certificacions de forma centralitzada.')}
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-white/50 text-xs font-bold uppercase tracking-widest">
                    <span>UGT Catalunya © 2026</span>
                    <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                    <span>Secretaria de Formació</span>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white text-slate-900 relative">
                {/* Subtle Decorative Background Pattern for the "blank" area */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#E30613 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
                </div>

                {/* Language Switcher */}
                <div className="absolute top-8 right-8 flex items-center gap-2 z-10">
                    <button
                        onClick={() => i18n.changeLanguage('ca')}
                        className={`w-8 h-8 rounded-full text-[10px] font-black transition-all ${i18n.language === 'ca' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                        CA
                    </button>
                    <button
                        onClick={() => i18n.changeLanguage('es')}
                        className={`w-8 h-8 rounded-full text-[10px] font-black transition-all ${i18n.language === 'es' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                        ES
                    </button>
                </div>

                <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="lg:hidden flex justify-center mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-lg p-1.5 ring-2 ring-white">
                                <img src="/logo-ugt.png" alt="UGT Formació" className="w-full h-full object-contain" />
                            </div>
                            <h1 className="text-slate-900 font-black text-xl uppercase tracking-tighter">UGT <span className="text-primary italic">Formació</span></h1>
                        </div>
                    </div>

                    <div className="bg-white p-8 lg:p-0 rounded-3xl lg:rounded-none">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-4xl font-black text-slate-900 mb-2 leading-none">{t('login.welcome_title', 'Hola de nou!')}</h2>
                            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">{t('login.welcome_message', 'Introdueix les teves credencials')}</p>
                        </div>

                        {roleError && (
                            <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                                <span className="material-icons-outlined text-red-600">lock_person</span>
                                <div>
                                    <p className="text-sm font-black text-red-900 uppercase tracking-wide">
                                        Accés restringit
                                    </p>
                                    <p className="text-xs text-red-700 leading-relaxed font-semibold mt-1">
                                        El compte és correcte, però no tens permisos d'accés (Admin/Docent). Contacta amb la Secretaria de Formació.
                                    </p>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1" htmlFor="email">{t('login.email_label')}</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <span className="material-icons-outlined text-[20px]">alternate_email</span>
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-semibold outline-none"
                                        id="email"
                                        placeholder="usuari@ugt.cat"
                                        required
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]" htmlFor="password">{t('login.password_label')}</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotModalOpen(true)}
                                        className="text-[10px] font-bold text-primary hover:underline transition-all"
                                    >
                                        {t('login.forgot_password', 'He oblidat la contrasenya')}
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <span className="material-icons-outlined text-[20px]">fingerprint</span>
                                    </div>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-semibold outline-none"
                                        id="password"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input className="peer h-5 w-5 opacity-0 absolute cursor-pointer" id="remember" type="checkbox" />
                                        <div className="h-5 w-5 border-2 border-slate-200 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                                        <span className="material-icons-outlined absolute text-white text-[16px] scale-0 peer-checked:scale-100 transition-transform">check</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors select-none">{t('login.remember_me')}</span>
                                </label>
                            </div>

                            <button
                                className="w-full bg-primary hover:bg-red-700 text-white font-black py-4.5 px-6 rounded-2xl shadow-xl shadow-red-500/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 overflow-hidden relative"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <span className="relative z-10">{isSubmitting ? t('common.loading', 'Entrant...') : t('login.submit_button', 'Inicia la Sessió')}</span>
                                {!isSubmitting && <span className="material-icons-outlined text-[20px] group-hover:translate-x-1 transition-transform relative z-10">rocket_launch</span>}
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                            </button>

                            <div className="pt-2">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                                    {t('login.activation_notice', 'Si ets un nou usuari, usa "He oblidat la contrasenya" per activar el teu compte')}
                                </p>
                            </div>
                        </form>

                        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            <span>Seguretat SSL 256bits</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Servidor Actiu</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
