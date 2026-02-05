import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { studentService } from '../services/studentService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Calendar, MapPin, CheckCircle, ArrowRight, ShieldCheck, Star, Lock, Users, Target } from 'lucide-react';

export const PublicRegistration = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registrationStatus, setRegistrationStatus] = useState('idle');
    const [showPasswordGate, setShowPasswordGate] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);

    useEffect(() => {
        if (courseId) loadCourse();
    }, [courseId]);

    const loadCourse = async () => {
        try {
            const data = await courseService.getCourseById(courseId);
            setCourse(data);
            if (data.requiresPassword) {
                setShowPasswordGate(true);
            } else {
                setIsPasswordVerified(true);
            }
        } catch (error) {
            console.error("Error loading course", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPassword = (e) => {
        e.preventDefault();
        if (passwordInput === course.password) {
            setIsPasswordVerified(true);
            setShowPasswordGate(false);
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegistrationStatus('submitting');

        const formData = new FormData(e.target);
        const studentData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            courseId: course.id,
            courseTitle: course.title,
            registrationDate: new Date().toISOString(),
            status: 'Pendent'
        };

        try {
            await studentService.registerStudent(studentData);
            setRegistrationStatus('success');
        } catch (error) {
            console.error("Registration error", error);
            setRegistrationStatus('error');
        }
    };

    if (registrationStatus === 'success') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
                <Card className="max-w-xl w-full text-center py-16 shadow-premium border-t-8 border-emerald-500 rounded-[2.5rem]">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 ring-8 ring-emerald-50/50">
                            <CheckCircle size={48} className="text-emerald-500" />
                        </div>
                        <h2 className="text-4xl font-extrabold mb-4 text-slate-900 tracking-tight">¡Inscripció Completada!</h2>
                        <p className="text-xl text-slate-500 mb-12 px-12 leading-relaxed">
                            T'has inscrit correctament al curs <br />
                            <span className="font-bold text-slate-900 px-2 py-1 bg-slate-100 rounded-lg">{course?.title}</span>.
                        </p>
                        <div className="flex flex-col gap-4 w-full px-12">
                            <Button variant="primary" size="lg" className="grad-ugt py-5" onClick={() => window.location.reload()}>Finalitzar</Button>
                            <p className="text-sm text-slate-400 font-medium">L'administració de la UGT validarà la teva solicitud en breu.</p>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Validant Accés...</p>
            </div>
        </div>
    );

    if (showPasswordGate) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
                <Card className="max-w-md w-full p-10 shadow-premium border-none rounded-[2.5rem]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-ugt-red">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Accés Protegit</h2>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">{course?.title}</p>
                    </div>
                    <form onSubmit={handleVerifyPassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contrasenya del Curs</label>
                            <input
                                required
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full bg-slate-50 border-${passwordError ? 'red-200' : 'slate-100'} rounded-2xl focus:bg-white px-5 py-4 outline-none transition-all`}
                            />
                            {passwordError && <p className="text-[10px] text-red-500 font-bold ml-1">Contrasenya incorrecta. Revisa-la.</p>}
                        </div>
                        <Button type="submit" className="w-full grad-ugt py-4 text-lg font-black shadow-red">
                            Accedir al Formulari
                        </Button>
                    </form>
                </Card>
            </div>
        );
    }

    if (!course) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Enllaç no vàlid o curs no trobat.</div>;

    return (
        <div className="min-h-screen bg-white animate-fade-in">
            <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center glass px-6 py-3 rounded-2xl shadow-sm border border-white/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 grad-ugt rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-200">U</div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 leading-none tracking-tight">UGT <span className="text-ugt-red">EnForma.</span></h1>
                            <p className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase mt-0.5">Formació Sindical 2026</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-24">
                <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-24">
                    <div className="animate-slide-up">
                        <div className="flex items-center gap-2 mb-6">
                            <Badge variant="primary" className="py-1 px-4">CURS DISPONIBLE</Badge>
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                            {course.title}
                        </h1>
                        <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-xl">
                            {course.description || "Inscriu-te al programa de capacitació líder de la UGT Catalunya i transforma la teva carrera sindical amb eines pràctiques i coneixement expert."}
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 text-ugt-red flex items-center justify-center shadow-sm">
                                    <Calendar size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DATA D'INICI</p>
                                    <p className="text-sm font-bold text-slate-900">{course.startDate ? new Date(course.startDate).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Properament'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MODALITAT</p>
                                    <p className="text-sm font-bold text-slate-900">{course.location || 'Presencial - Sede Central'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <div className="absolute -inset-4 bg-gradient-to-tr from-ugt-red/20 to-blue-500/20 rounded-[3rem] blur-2xl opacity-50"></div>
                        <Card className="relative z-10 p-10 shadow-premium border-none rounded-[3rem] bg-white">
                            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Inscripció Digital</h2>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Places limitades per curs</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nom Complet</label>
                                        <input required name="fullName" type="text" placeholder="Joan Garcia" className="w-full bg-slate-50 border-slate-100 rounded-2xl focus:bg-white px-5 py-4 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Empresa / Àrea</label>
                                        <input required name="company" type="text" placeholder="Sector Metal" className="w-full bg-slate-50 border-slate-100 rounded-2xl focus:bg-white px-5 py-4 outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Correu Electrònic</label>
                                    <input required name="email" type="email" placeholder="correu@exemple.cat" className="w-full bg-slate-50 border-slate-100 rounded-2xl focus:bg-white px-5 py-4 outline-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Telèfon Mòbil</label>
                                    <input required name="phone" type="tel" placeholder="+34 600 000 000" className="w-full bg-slate-50 border-slate-100 rounded-2xl focus:bg-white px-5 py-4 outline-none" />
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl flex gap-3 items-start">
                                    <div className="mt-1">
                                        <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-ugt-red focus:ring-ugt-red cursor-pointer" />
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                        Entenc i accepto les <span className="text-slate-900 font-bold underline cursor-pointer">condicions del servei</span> i el tractament de dades per part de la UGT Catalunya.
                                    </p>
                                </div>

                                <Button type="submit" size="lg" className="w-full grad-ugt py-5 text-xl font-black shadow-red ring-8 ring-red-50 hover:scale-[1.02]" disabled={registrationStatus === 'submitting'}>
                                    {registrationStatus === 'submitting' ? 'Tramitant...' : 'Registrar-me ARA'}
                                    <ArrowRight size={22} strokeWidth={3} className="ml-2" />
                                </Button>
                            </form>
                        </Card>
                    </div>
                </section>

                <section className="bg-slate-900 py-32 text-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-8 relative z-10">
                        <div className="text-center mb-20">
                            <h3 className="text-4xl font-extrabold mb-4">Per què formar-te amb nosaltres?</h3>
                            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Professionals actius amb més de 20 anys d'experiència en l'àmbit laboral.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { title: 'Titulació Oficial', desc: 'Certificat per la UGT de Catalunya vàlid per a crèdits formatius.', icon: CheckCircle },
                                { title: 'Xarxa de Contactes', desc: 'Connecta amb delegats de tots els sectors productius del país.', icon: Users },
                                { title: 'Casos Reals', desc: 'Metodologia basada en resolució de conflictes laborals actuals.', icon: Target }
                            ].map((feat, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-ugt-red mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                                        <feat.icon size={36} />
                                    </div>
                                    <h4 className="text-xl font-bold mb-3">{feat.title}</h4>
                                    <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-20 bg-white border-t border-slate-50">
                <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
                    <div className="w-12 h-12 grad-ugt rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-6">U</div>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">UGT de Catalunya</p>
                    <p className="mt-8 text-slate-300 text-sm">© 2026 UGT EnForma. Política de Privadesa · Avís Legal</p>
                </div>
            </footer>
        </div>
    );
};
