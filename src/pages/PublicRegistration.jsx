import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { studentService } from '../services/studentService';
import { notificationService } from '../services/notificationService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Calendar, MapPin, CheckCircle, ArrowRight, ShieldCheck, Star, Lock, Users, Target, Clock, Info, Download, QrCode } from 'lucide-react';
import QRCode from "react-qr-code";

const renderDescription = (text) => {
    if (!text) return null;
    // Split by newlines first
    return text.split('\n').map((line, i) => (
        <span key={i}>
            {/* Split by **bold** tags */}
            {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
                }
                return part;
            })}
            <br />
        </span>
    ));
};

const PublicRegistration = () => {
    const { t, i18n } = useTranslation();
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registrationStatus, setRegistrationStatus] = useState('idle');
    const [showPasswordGate, setShowPasswordGate] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [registeredStudentId, setRegisteredStudentId] = useState(null);
    const [dniError, setDniError] = useState("");

    const validateDNI = (dni) => {
        const value = dni.trim().toUpperCase();
        if (!value) return false;

        // Regular expression for DNI (8 numbers + 1 letter) or NIE (X/Y/Z + 7 numbers + 1 letter)
        const dniRegex = /^[0-9]{8}[A-Z]$/;
        const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

        if (!dniRegex.test(value) && !nieRegex.test(value)) {
            return false;
        }

        // Logic to validate the control letter
        const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
        let number;

        if (dniRegex.test(value)) {
            number = parseInt(value.substring(0, 8), 10);
        } else {
            // NIE: Replace X with 0, Y with 1, Z with 2
            const prefix = value.charAt(0);
            const prefixVal = prefix === 'X' ? '0' : prefix === 'Y' ? '1' : '2';
            number = parseInt(prefixVal + value.substring(1, 8), 10);
        }

        const expectedLetter = letters[number % 23];
        return value.charAt(8) === expectedLetter;
    };


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
        setDniError("");

        const formData = new FormData(e.target);
        const dni = formData.get('dni');

        if (!validateDNI(dni)) {
            setDniError(t('public_registration.dni_invalid', 'DNI o NIE no és vàlid. Revisa la lletra.'));
            return;
        }

        setRegistrationStatus('submitting');

        // Logic: If spots are available -> 'Inscrit' (Confirmed)
        // If full and waitlist enabled -> 'registered' (Waitlist/Solicitant)
        // If full and no waitlist -> Button should be disabled anyway, but failsafe to 'registered'
        const isFull = course.students >= course.maxCapacity && course.enrollmentType === 'limited';
        const status = isFull ? 'registered' : 'Inscrit'; // 'Inscrit' = Confirmed Enrolled

        // Collect custom fields
        const customFieldData = {};
        if (course.customFields) {
            course.customFields.forEach(field => {
                const value = formData.get(`custom_${field.id}`);
                if (value) {
                    customFieldData[field.label] = value;
                }
            });
        }

        const studentData = {
            firstName: formData.get('firstName'),
            surname1: formData.get('surname1'),
            surname2: formData.get('surname2'),
            fullName: `${formData.get('firstName')} ${formData.get('surname1')} ${formData.get('surname2') || ''}`.trim(),
            email: formData.get('email'),
            dni: formData.get('dni'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            federation: formData.get('federation'),
            isAffiliated: formData.get('affiliate') === 'yes', // Converted to boolean for storage
            customFields: customFieldData,
            courseId: course.id,
            courseTitle: course.name, // Changed from title to name to match course object
            registrationDate: new Date().toISOString(),
            status: status
        };

        try {
            const result = await studentService.registerStudent(studentData);
            setRegisteredStudentId(result.id);
            setRegistrationStatus('success');

            // Send Welcome Email (Simulated)
            try {
                await notificationService.sendWelcomeEmail(studentData, course);
            } catch (emailErr) {
                console.warn("Could not send simulation email:", emailErr);
            }
        } catch (error) {
            console.error("Registration error", error);
            setRegistrationStatus('error');
        }
    };

    if (registrationStatus === 'success') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.ugt.cat/wp-content/uploads/2023/01/fons-web-ugt.jpg')] bg-cover bg-center opacity-5 pointer-events-none"></div>
                <Card className="max-w-md w-full bg-white shadow-2xl border-none relative z-10 overflow-hidden">
                    <div className="bg-emerald-500 h-2 w-full absolute top-0"></div>
                    <div className="p-8 text-center">
                        <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                            <CheckCircle size={40} className="text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-2 leading-tight">{t('public_registration.title_confirmed')}</h2>
                        <p className="text-slate-600 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                            {t('public_registration.message_confirmed')}
                        </p>

                        {/* Digital Ticket / QR Code */}
                        {registeredStudentId && (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-8 relative group cursor-pointer hover:border-emerald-200 transition-colors">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <QrCode size={12} />
                                        {t('public_registration.digital_ticket')}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm inline-block">
                                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }}>
                                        <QRCode
                                            size={256}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            value={registeredStudentId}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-wider">
                                    {t('public_registration.show_code')}
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <Button
                                fullWidth
                                className="bg-slate-900 text-white hover:bg-black font-bold py-4 rounded-xl shadow-lg hover:translate-y-px transition-all"
                                onClick={() => window.location.reload()}
                            >
                                {t('public_registration.back_to_home')}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">UGT</span>
                    </div>
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">{t('public_registration.loading_course')}</p>
            </div>
        </div>
    );

    if (showPasswordGate) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
                {/* Historical Background with Blur */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/6/6f/Manifestaci%C3%B3n_del_1_de_mayo_de_1890_en_Barcelona.jpg')",
                        filter: "blur(8px) brightness(0.4) sepia(0.5)"
                    }}
                ></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-red-900/80 to-slate-900/60 mix-blend-multiply"></div>

                <Card className="max-w-md w-full p-10 shadow-2xl border-none rounded-[2rem] relative z-10 bg-white/95 backdrop-blur-xl ring-1 ring-white/50">
                    <div className="text-center mb-8">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <img src="/logo-ugt.png" alt="UGT" className="h-16 h-auto drop-shadow-md" />
                        </div>

                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-600 shadow-inner">
                            <Lock size={28} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">{t('public_registration.access_protected')}</h2>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2">{course?.name}</p>
                    </div>
                    <form onSubmit={handleVerifyPassword} className="space-y-8">
                        <div className="space-y-2 text-left">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('public_registration.course_password')}</label>
                            <input
                                required
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full bg-slate-50/50 border-${passwordError ? 'red-200' : 'slate-200'} border rounded-xl focus:bg-white focus:border-red-500 px-5 py-4 outline-none transition-all text-center tracking-widest text-lg`}
                            />
                            {passwordError && <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1 justify-center"><span className="material-icons-outlined text-[10px]">error</span> {t('public_registration.password_error')}</p>}
                        </div>

                        {/* Centered Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="px-8 bg-red-600 hover:bg-red-700 text-white py-3 text-sm font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                {t('public_registration.access_form')}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        );
    }

    if (!course) return <div className="min-h-screen flex items-center justify-center p-20 text-center text-slate-400 font-bold uppercase tracking-widest">{t('public_registration.invalid_link')}</div>;

    if (course.status === 'Esborrany') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <Card className="max-w-md w-full p-8 text-center animate-slide-up">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                        <Info size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">{t('public_registration.not_available_title', 'Curs no disponible')}</h2>
                    <p className="text-slate-600 mb-8">
                        {t('public_registration.draft_message', 'Aquest curs encara es troba en fase de preparació i no admet inscripcions públiques.')}
                    </p>
                    <Button
                        fullWidth
                        onClick={() => window.location.href = 'https://ugt.cat'}
                        className="bg-slate-900 text-white"
                    >
                        {t('public_registration.back_to_web', 'Tornar a la web d\'UGT')}
                    </Button>
                </Card>
            </div>
        );
    }

    // Determine location display
    const locationDisplay = course.sessions && course.sessions.length > 0 && course.sessions[0].location
        ? course.sessions[0].location
        : 'Presencial - Sede Central (Rambla del Raval)';


    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Data per determinar';
        return new Date(dateString).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Calculate duration or sessions count
    const sessionsCount = course.sessions?.length || 0;
    const hasSessions = sessionsCount > 0;

    // Determine schedule display
    const scheduleDisplay = hasSessions
        ? `${course.sessions[0].startTime}h - ${course.sessions[0].endTime}h`
        : 'Horari a determinar';

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in font-sans pb-24">
            {/* Standard UGT Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                        <img src="/logo-ugt.png" alt="UGT Logo" className="h-8 md:h-10" />
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>
                        <div>
                            <h1 className="text-sm md:text-base font-black text-slate-900 leading-none tracking-tight">UGT <span className="text-red-600">Formació</span></h1>
                        </div>
                    </div>
                    {/* Language Switcher */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => i18n.changeLanguage('ca')}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${i18n.language === 'ca' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                        >
                            CA
                        </button>
                        <button
                            onClick={() => i18n.changeLanguage('es')}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${i18n.language === 'es' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                        >
                            ES
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Wrapper */}
            <div className="max-w-7xl mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* LEFT COLUMN: Course Info & Details (Span 7) */}
                <div className="lg:col-span-7 space-y-8 animate-slide-up">
                    {/* Course Header / Hero Image */}
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-video w-full group">
                        {course.heroImage ? (
                            <img src={course.heroImage} alt={course.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                <span className="text-slate-700 font-bold text-lg">Imatge no disponible</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <Badge className="bg-red-600 text-white border-none py-1.5 px-3 text-xs font-bold uppercase tracking-wider shadow-lg">
                                    INSCRIPCIÓ OBERTA
                                </Badge>
                                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                                    <Star size={12} fill="currentColor" />
                                    <span>Formació Premium</span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-md mb-2">
                                {i18n.language === 'es' && course.name_es ? course.name_es : course.name}
                            </h1>
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{t('public_registration.dates')}</h4>
                                <p className="text-slate-600 font-medium">
                                    {formatDate(course.startDate)}
                                    {course.endDate && course.endDate !== course.startDate && (
                                        <> - {formatDate(course.endDate)}</>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{t('public_registration.location')}</h4>
                                <p className="text-slate-600 font-medium text-sm line-clamp-2">{locationDisplay}</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{t('public_registration.schedule')}</h4>
                                <p className="text-slate-600 font-medium text-sm">{scheduleDisplay}</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                                <Target size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{t('public_registration.sessions')}</h4>
                                <p className="text-slate-600 font-medium text-sm">
                                    {sessionsCount > 1 ? t('public_registration.sessions_count_many', { count: sessionsCount }) : t('public_registration.sessions_count_one')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description Text */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                            {t('public_registration.description')}
                        </h3>
                        <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                            {renderDescription(
                                i18n.language === 'es' && course.description_es ? course.description_es : (course.description || t('public_registration.default_description'))
                            )}
                        </div>
                    </div>

                    {/* Sessions Calendar */}
                    {hasSessions && (
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Calendar size={20} className="text-red-600" />
                                {t('public_registration.calendar_sessions')}
                            </h3>
                            <div className="space-y-3">
                                {course.sessions.map((session, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row md:items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-red-200 transition-colors">
                                        <div className="flex items-center gap-3 md:w-1/3 mb-2 md:mb-0">
                                            <Badge className="bg-white text-slate-700 border border-slate-200 shadow-sm font-bold">
                                                {t('public_registration.session_n', { n: idx + 1 })}
                                            </Badge>
                                            <span className="font-bold text-slate-900">
                                                {new Date(session.date).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 md:flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-red-500" />
                                                <span className="font-medium">{session.startTime}h - {session.endTime}h</span>
                                            </div>
                                            {session.location && (
                                                <div className="flex items-center gap-1.5 hidden md:flex">
                                                    <MapPin size={14} className="text-red-500" />
                                                    <span className="truncate max-w-[150px]">{session.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Registration Form (Span 5 - Sticky) */}
                <div className="lg:col-span-5 sticky top-24 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <Card className="shadow-2xl border-none rounded-[2rem] bg-white overflow-hidden ring-1 ring-slate-100">
                        {/* Form Header */}
                        <div className="bg-red-600 p-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-black opacity-10 rotate-12 scale-150 transform translate-x-1/2"></div>
                            <h2 className="text-2xl font-black text-white relative z-10">{t('public_registration.register_now')}</h2>
                            <p className="text-white/80 text-sm mt-1 relative z-10 font-medium">{t('public_registration.secure_spot')}</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <form onSubmit={handleRegister} className="space-y-5">
                                {/* Name Fields */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('public_registration.form.name_surnames')} *</label>
                                    <input required name="firstName" type="text" placeholder={t('public_registration.form.first_name')} className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-medium mb-3" />
                                    <div className="flex gap-3">
                                        <input required name="surname1" type="text" placeholder={t('public_registration.form.surname1')} className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-medium" />
                                        <input name="surname2" type="text" placeholder={t('public_registration.form.surname2')} className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-medium" />
                                    </div>
                                </div>

                                {/* ID & Phone */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('public_registration.form.dni')} *</label>
                                        <input
                                            required
                                            name="dni"
                                            type="text"
                                            placeholder="00000000X"
                                            className={`w-full bg-slate-50 border ${dniError ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200'} rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-medium`}
                                        />
                                        {dniError && <p className="text-[10px] text-red-500 font-bold ml-1">{dniError}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('public_registration.form.phone')} *</label>
                                        <input required name="phone" type="tel" placeholder="600 000 000" className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-medium" />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('public_registration.form.email')} *</label>
                                    <input required name="email" type="email" placeholder="correu@exemple.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-medium" />
                                </div>

                                {/* Company & Federation */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('public_registration.form.company')} *</label>
                                    <input required name="company" type="text" placeholder="Centre de treball" className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('public_registration.form.federation')} *</label>
                                    <select required name="federation" className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all font-medium appearance-none text-sm">
                                        <option value="">{t('public_registration.form.select_placeholder', 'Selecciona...')}</option>
                                        <option value="Serveis Públics">{t('public_registration.form.federations.public_services')}</option>
                                        <option value="Indústria">{t('public_registration.form.federations.industry')}</option>
                                        <option value="Serveis">{t('public_registration.form.federations.services')}</option>
                                    </select>
                                </div>

                                {/* Affiliation Radio */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">{t('public_registration.form.is_affiliate')} *</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="radio" name="affiliate" value="yes" className="accent-red-600 w-4 h-4" required />
                                            <span className="text-sm font-semibold text-slate-700 group-hover:text-red-600 transition-colors">{t('public_registration.form.yes')}</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="radio" name="affiliate" value="no" className="accent-red-600 w-4 h-4" required />
                                            <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{t('public_registration.form.no')}</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Dynamic Custom Fields */}
                                {course.customFields && course.customFields.length > 0 && (
                                    <div className="space-y-4 border-t border-slate-100 pt-4">
                                        {course.customFields.map((field) => (
                                            <div key={field.id} className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                    {field.label} {field.required && '*'}
                                                </label>
                                                {field.type === 'textarea' ? (
                                                    <textarea
                                                        name={`custom_${field.id}`}
                                                        required={field.required}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-medium min-h-[80px] text-sm"
                                                        placeholder="Escriu aquí..."
                                                    ></textarea>
                                                ) : field.type === 'select' ? (
                                                    <select
                                                        name={`custom_${field.id}`}
                                                        required={field.required}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all font-medium appearance-none text-sm"
                                                    >
                                                        <option value="">Selecciona...</option>
                                                        <option value="opcio1">Opció 1</option>
                                                        <option value="opcio2">Opció 2</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        name={`custom_${field.id}`}
                                                        required={field.required}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 px-4 py-3 outline-none transition-all placeholder:text-slate-300 font-medium text-sm"
                                                        placeholder="Resposta..."
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Consent Checkbox */}
                                <div className="pt-2">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input type="checkbox" required className="mt-1 accent-red-600 w-4 h-4 rounded border-slate-300" />
                                        <span className="text-xs text-slate-500 leading-snug group-hover:text-slate-700 transition-colors select-none">
                                            {t('public_registration.form.privacy_policy')}
                                        </span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                {/* Submit Button - Premium Red & Centered */}
                                <Button
                                    type="submit"
                                    size="lg"
                                    fullWidth
                                    className={`py-4 text-lg font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/30 transition-all transform active:scale-[0.98] hover:-translate-y-1 ${course.students >= course.maxCapacity && course.enrollmentType === 'limited' && !course.enableWaitlist
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-2xl'
                                        }`}
                                    disabled={registrationStatus === 'submitting' || (course.students >= course.maxCapacity && course.enrollmentType === 'limited' && !course.enableWaitlist)}
                                >
                                    {registrationStatus === 'submitting' ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        course.students >= course.maxCapacity && course.enrollmentType === 'limited' && course.enableWaitlist
                                            ? t('public_registration.form.waitlist')
                                            : t('public_registration.form.submit')
                                    )}
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>

            </div>



            <footer className="py-10 bg-slate-900 text-slate-400 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo-ugt.png" alt="UGT" className="h-6 opacity-80" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-50">EnForma</span>
                    </div>
                    <p className="text-xs">© 2026 UGT de Catalunya. Tots els drets reservats.</p>
                </div>
            </footer>
        </div >
    );
};

export default PublicRegistration;
