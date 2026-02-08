import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { storageService } from '../services/storageService';
import { instructorService } from '../services/instructorService';
import Sidebar from '../components/layout/Sidebar';

const SidebarStep = ({ number, title, isActive, isCompleted, onClick }) => {
    let baseClasses = "flex items-center group cursor-pointer p-3 rounded-lg transition-all border-l-4";
    let activeClasses = "bg-white dark:bg-card-dark border-primary shadow-sm";
    let inactiveClasses = "hover:bg-white dark:hover:bg-card-dark border-transparent opacity-60"; // Inactive/Future

    const divClasses = isActive ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
    const circleClasses = isActive
        ? "w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mr-4"
        : "w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm mr-4";

    const textClasses = isActive
        ? "font-semibold text-slate-900 dark:text-white"
        : "font-medium text-slate-500";

    return (
        <div className={divClasses} onClick={onClick}>
            <div className={circleClasses}>{isCompleted && !isActive ? '✓' : number}</div>
            <span className={textClasses}>{title}</span>
        </div>
    );
};

const CreateCourse = ({ onBack, toggleDarkMode, onNavigate, onSave, isEditMode = false }) => {
    const { courseId } = useParams();
    const [step, setStep] = useState(1);
    const [activeSection, setActiveSection] = useState(1); // For Step 1 (Sub-steps 1 & 2)
    const [showPassword, setShowPassword] = useState(false);
    const [courseData, setCourseData] = useState({
        name: '',
        category: '',
        password: '',
        startDate: '',
        endDate: '',
        maxCapacity: 25,
        instructor: '',
        heroImage: null,
        description: '',
        name_es: '',
        description_es: '',
        isMultiSession: false,
        sessions: [],
        materials: [],
        links: [],
        customFields: [],
        enrollmentType: 'limited', // limited, unlimited, manual
        enableWaitlist: true,
        registrationDeadline: '',
        minAttendancePercentage: 80 // Default 80%
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const data = await instructorService.getInstructors();
                setInstructors(data);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };
        fetchInstructors();
    }, []);

    const generateSlug = (text) => {
        if (!text) return 'nou-curs';
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const courseSlug = generateSlug(courseData.name);

    useEffect(() => {
        const loadCourseData = async () => {
            if (isEditMode && courseId) {
                try {
                    const course = await courseService.getCourseById(courseId);
                    if (course) {
                        setCourseData(prev => ({
                            ...prev,
                            ...course,
                            // Ensure dates are formatted for input[type="date"] (YYYY-MM-DD)
                            startDate: course.startDate ? course.startDate.split('T')[0] : '',
                            endDate: course.endDate ? course.endDate.split('T')[0] : '',
                        }));
                    }
                } catch (error) {
                    console.error("Error loading course:", error);
                    alert("Error carregant les dades del curs.");
                }
            }
        };
        loadCourseData();
    }, [isEditMode, courseId]);

    // Recursive function to sanitize data for Firestore (removes Files)
    const sanitizeForFirestore = (obj) => {
        if (obj === null || obj === undefined) return null;
        if (obj instanceof File || obj instanceof Blob || (window.FileList && obj instanceof FileList)) {
            return null; // Remove files
        }
        if (Array.isArray(obj)) {
            return obj.map(item => sanitizeForFirestore(item));
        }
        if (typeof obj === 'object') {
            const newObj = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    newObj[key] = sanitizeForFirestore(obj[key]);
                }
            }
            return newObj;
        }
        return obj;
    };

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            console.log("Publishing course...", courseData);

            // 1. Shallow copy
            let finalCourseData = { ...courseData };

            // 2. Upload Hero Image if it's a Base64 string (newly selected)
            if (finalCourseData.heroImage && typeof finalCourseData.heroImage === 'string' && finalCourseData.heroImage.startsWith('data:')) {
                try {
                    const imagePath = `courses/hero_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    const downloadUrl = await storageService.uploadBase64(finalCourseData.heroImage, imagePath);
                    console.log("Image uploaded to Storage:", downloadUrl);
                    finalCourseData.heroImage = downloadUrl;
                } catch (uploadError) {
                    console.error("Image upload failed:", uploadError);
                    finalCourseData.heroImage = null;
                    alert("No s'ha pogut pujar la imatge. El curs es guardarà sense imatge de portada.");
                }
            }

            // 3. Deep sanitize 
            const sanitizedData = sanitizeForFirestore(finalCourseData);

            const newCourse = {
                ...sanitizedData,
                code: `CURS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                status: 'Pendent inici',
                students: 0,
                progress: 0
            };

            await onSave(newCourse);

        } catch (error) {
            console.error("FAILED to publish course:", error);
            alert("Error al publicar el curs: " + error.message);
        } finally {
            if (setIsSubmitting) setIsSubmitting(false);
        }
    };
    const publicLink = `${window.location.origin}/public/enroll/${courseSlug}`;

    const [isAddingField, setIsAddingField] = useState(false);
    const [newField, setNewField] = useState({ label: '', type: 'text', required: false });

    const addCustomField = () => {
        if (!newField.label) return;
        setCourseData(prev => ({
            ...prev,
            customFields: [...prev.customFields, { ...newField, id: Date.now() }]
        }));
        setNewField({ label: '', type: 'text', required: false });
        setIsAddingField(false);
    };

    const removeCustomField = (id) => {
        setCourseData(prev => ({ ...prev, customFields: prev.customFields.filter(f => f.id !== id) }));
    };

    const [isAddingLink, setIsAddingLink] = useState(false);
    const [newLink, setNewLink] = useState({ title: '', url: '' });

    const handleLinkChange = (e) => {
        const { name, value } = e.target;
        setNewLink(prev => ({ ...prev, [name]: value }));
    };

    const addLink = () => {
        if (!newLink.url) return;
        setCourseData(prev => ({
            ...prev,
            links: [...prev.links, { id: Date.now(), title: newLink.title || newLink.url, url: newLink.url }]
        }));
        setNewLink({ title: '', url: '' });
        setIsAddingLink(false);
    };

    const removeLink = (id) => {
        setCourseData(prev => ({ ...prev, links: prev.links.filter(l => l.id !== id) }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("La imatge és massa gran. Màxim 5MB per evitar problemes amb la base de dades.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourseData(prev => ({ ...prev, heroImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMaterialUpload = (e) => {
        const files = Array.from(e.target.files);
        const newMaterials = [];

        files.forEach(file => {
            if (file.size > 20 * 1024 * 1024) {
                alert(`El fitxer ${file.name} supera el límit de 20MB.`);
                return;
            }
            // For a real app, we'd upload this. For now, we store metadata and a fake URL or wait for a real backend upload.
            // We can simulate a "ready" state.
            newMaterials.push({
                id: Date.now() + Math.random(),
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
                file: file
            });
        });

        if (newMaterials.length > 0) {
            setCourseData(prev => ({ ...prev, materials: [...prev.materials, ...newMaterials] }));
        }
    };

    const removeMaterial = (id) => {
        setCourseData(prev => ({ ...prev, materials: prev.materials.filter(m => m.id !== id) }));
    };

    const handleSessionToggle = () => {
        setCourseData(prev => ({ ...prev, isMultiSession: !prev.isMultiSession }));
    };

    const addSession = () => {
        const newSession = {
            id: Date.now(),
            date: '',
            startTime: '09:00',
            endTime: '14:00',
            location: ''
        };
        setCourseData(prev => ({ ...prev, sessions: [...prev.sessions, newSession] }));
    };

    const removeSession = (id) => {
        setCourseData(prev => ({ ...prev, sessions: prev.sessions.filter(s => s.id !== id) }));
    };

    const updateSession = (id, field, value) => {
        setCourseData(prev => ({
            ...prev,
            sessions: prev.sessions.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const insertBold = (fieldName) => {
        const textarea = document.getElementById(fieldName);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = courseData[fieldName] || '';
        const selectedText = text.substring(start, end);

        // If something is selected, wrap it. If not, just insert ****
        const newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);

        setCourseData(prev => ({
            ...prev,
            [fieldName]: newText
        }));

        // Restore focus and position
        setTimeout(() => {
            textarea.focus();
            const newPos = selectedText ? end + 4 : start + 2;
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    // Common props for Sidebar to ensure consistency
    const sidebarProps = {
        currentView: "active-courses", // Highlight 'Active Courses' as parent context
        onNavigate: onNavigate,
        toggleDarkMode: toggleDarkMode
    };

    // Step 1: Dades Generals i Planificació
    if (step === 1) {
        return (
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
                <Sidebar {...sidebarProps} />

                <main className="lg:ml-64 p-6 lg:p-10">
                    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                        <div>
                            <nav aria-label="Breadcrumb" className="flex mb-2 text-sm text-slate-500">
                                <ol className="inline-flex items-center space-x-1">
                                    <li className="inline-flex items-center">
                                        <a className="hover:text-primary transition-colors" href="#" onClick={onBack}>Cursos Actius</a>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                                        <span className="font-medium text-slate-900 dark:text-white">Nou Curs</span>
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{isEditMode ? 'Editar Curs' : 'Crear Nou Curs'}</h1>
                            <p className="text-slate-500 dark:text-slate-400">Configura la nova acció formativa de la UGT de Catalunya</p>
                        </div>
                        {/* Header Controls Removed as per request */}
                    </header>

                    <div className="flex flex-col lg:flex-row gap-10">
                        <aside className="lg:w-72 shrink-0">
                            <nav className="sticky top-10 flex flex-col space-y-2">
                                <SidebarStep number="1" title="Dades Generals" isActive={activeSection === 1} onClick={() => { setActiveSection(1); document.getElementById('gen-info')?.scrollIntoView({ behavior: 'smooth' }); }} />
                                <SidebarStep number="2" title="Planificació" isActive={activeSection === 2} onClick={() => { setActiveSection(2); document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' }); }} />
                                <SidebarStep number="3" title="Docència i Documentació" isActive={false} />
                                <SidebarStep number="4" title="Inscripció" isActive={false} />
                            </nav>
                        </aside>

                        <div className="flex-1 max-w-4xl space-y-10">
                            <section id="gen-info" className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                                onClick={() => setActiveSection(1)} onFocus={() => setActiveSection(1)}>
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                    <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                                        <span className="material-icons-outlined mr-2 text-primary">info</span>
                                        1. Dades Generals
                                    </h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="nom_curs">Nom del Curs</label>
                                            <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" name="name" id="nom_curs" value={courseData.name} onChange={handleInputChange} placeholder="Ex: Taller de Mediació i Resolució de Conflictes" type="text" onFocus={() => setActiveSection(1)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="categoria">Categoria</label>
                                            <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" name="category" id="categoria" value={courseData.category} onChange={handleInputChange} onFocus={() => setActiveSection(1)}>
                                                <option value="">Selecciona una categoria</option>
                                                <option value="Dret Laboral">Dret Laboral</option>
                                                <option value="Prevenció de Riscos">Prevenció de Riscos</option>
                                                <option value="Habilitats Sindicals">Habilitats Sindicals</option>
                                                <option value="Igualtat i Gènere">Igualtat i Gènere</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="contrasenya">Contrasenya d'accés (opcional)</label>
                                            <div className="relative">
                                                <input
                                                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3 pr-10"
                                                    id="contrasenya"
                                                    name="password"
                                                    placeholder="••••••••"
                                                    type={showPassword ? "text" : "password"}
                                                    value={courseData.password}
                                                    onChange={handleInputChange}
                                                    onFocus={() => setActiveSection(1)}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    <span className="material-icons-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Hero / Portada</label>
                                        <div className="relative group border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 transition-colors hover:border-primary/50 text-center"
                                            onClick={() => setActiveSection(1)}>
                                            <div className="space-y-4">
                                                {courseData.heroImage ? (
                                                    <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden">
                                                        <img src={courseData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCourseData(prev => ({ ...prev, heroImage: null }));
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition"
                                                        >
                                                            <span className="material-icons-outlined text-sm">close</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                                                            <span className="material-icons-outlined text-slate-400 group-hover:text-primary text-3xl">add_photo_alternate</span>
                                                        </div>
                                                        <div>
                                                            <button className="text-primary font-bold hover:underline">Puja una imatge</button>
                                                            <span className="text-slate-500 dark:text-slate-400"> o arrossega i deixa anar</span>
                                                        </div>
                                                        <p className="text-xs text-slate-400">Format PNG, JPG o WEBP recomanat (màxim 5MB)</p>
                                                    </>
                                                )}
                                            </div>
                                            {!courseData.heroImage && (
                                                <input
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    type="file"
                                                    onChange={handleImageUpload}
                                                    accept="image/*"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Descripció del Curs</label>
                                            <button
                                                type="button"
                                                onClick={() => insertBold('description')}
                                                className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-colors"
                                                title="Afegeix negreta"
                                            >
                                                <span className="material-icons-outlined text-sm font-black">format_bold</span>
                                                NEGRETA
                                            </button>
                                        </div>
                                        <textarea
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3 min-h-[120px]"
                                            id="description"
                                            name="description"
                                            value={courseData.description}
                                            onChange={handleInputChange}
                                            placeholder="Escriu una descripció completa del curs..."
                                            onFocus={() => setActiveSection(1)}
                                        ></textarea>
                                        <p className="text-[10px] text-slate-400 mt-1">Pots utilitzar **text** per marcar paraules en negreta.</p>
                                    </div>

                                    {/* Secció de Traduccions */}
                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="material-icons-outlined text-sm">translate</span>
                                            Traduccions (Opcional)
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="name_es">Nombre del Curso (Castellano)</label>
                                                <input
                                                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3"
                                                    name="name_es"
                                                    id="name_es"
                                                    value={courseData.name_es || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Ej: Taller de Mediación y Resolución de Conflictos"
                                                    type="text"
                                                    onFocus={() => setActiveSection(1)}
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="description_es">Descripción (Castellano)</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => insertBold('description_es')}
                                                        className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-colors"
                                                    >
                                                        <span className="material-icons-outlined text-sm font-black">format_bold</span>
                                                        NEGRITA
                                                    </button>
                                                </div>
                                                <textarea
                                                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3 min-h-[100px]"
                                                    id="description_es"
                                                    name="description_es"
                                                    value={courseData.description_es || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Escribe la descripción completa en castellano..."
                                                    onFocus={() => setActiveSection(1)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section id="planning" className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                                onClick={() => setActiveSection(2)} onFocus={() => setActiveSection(2)}>
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                    <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                                        <span className="material-icons-outlined mr-2 text-primary">calendar_month</span>
                                        2. Planificació
                                    </h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 dark:text-white">Tipus de sessions</span>
                                            <span className="text-xs text-slate-500">Defineix si el curs té una o múltiples dates</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-medium text-slate-500">Sessió Única</span>
                                            <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                                                <input
                                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300"
                                                    id="toggle"
                                                    name="toggle"
                                                    type="checkbox"
                                                    checked={courseData.isMultiSession}
                                                    onChange={handleSessionToggle}
                                                />
                                                <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${courseData.isMultiSession ? 'bg-primary' : 'bg-slate-300'}`} htmlFor="toggle"></label>
                                            </div>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">Sessions Múltiples</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data d'inici</label>
                                            <div className="relative">
                                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">event</span>
                                                <input className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" type="date" name="startDate" value={courseData.startDate} onChange={handleInputChange} onFocus={() => setActiveSection(2)} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data de finalització</label>
                                            <div className="relative">
                                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">event</span>
                                                <input className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" type="date" name="endDate" value={courseData.endDate} onChange={handleInputChange} onFocus={() => setActiveSection(2)} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="num_places">Número de Places</label>
                                            <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" id="num_places" name="maxCapacity" value={courseData.maxCapacity} onChange={handleInputChange} type="number" onFocus={() => setActiveSection(2)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="min_attendance">
                                            Assistència Mínima per Certificat (%)
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3"
                                                id="min_attendance"
                                                name="minAttendancePercentage"
                                                value={courseData.minAttendancePercentage || 80}
                                                onChange={handleInputChange}
                                                type="number"
                                                min="0"
                                                max="100"
                                                onFocus={() => setActiveSection(2)}
                                            />
                                            <span className="text-xl font-bold text-slate-400">%</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">El percentatge d'assistència necessari per obtenir el diploma automàticament.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="professor">Professor/a</label>
                                        <select
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3"
                                            id="professor"
                                            name="instructor"
                                            value={courseData.instructor}
                                            onChange={handleInputChange}
                                            onFocus={() => setActiveSection(2)}
                                        >
                                            <option value="">Selecciona un docent</option>
                                            {instructors.map(inst => (
                                                <option key={inst.id} value={inst.name}>{inst.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={`space-y-4 ${!courseData.isMultiSession ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Llistat de Sessions</h3>
                                            <button
                                                className="text-xs font-bold text-primary flex items-center hover:opacity-80"
                                                onClick={() => { setActiveSection(2); addSession(); }}
                                                disabled={!courseData.isMultiSession}
                                            >
                                                <span className="material-icons-outlined text-sm mr-1">add_circle</span>
                                                AFEGIR SESSIÓ
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {courseData.sessions.length === 0 ? (
                                                <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                    Cap sessió afegida. Fes clic a "Afegir Sessió".
                                                </p>
                                            ) : (
                                                courseData.sessions.map((session, index) => (
                                                    <div key={session.id} className="flex flex-col sm:flex-row items-center p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg text-sm gap-2">
                                                        <div className="w-8 font-bold text-slate-400">{String(index + 1).padStart(2, '0')}</div>
                                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                                            <input
                                                                type="date"
                                                                className="p-2 border rounded bg-transparent dark:border-slate-700"
                                                                value={session.date}
                                                                onChange={(e) => updateSession(session.id, 'date', e.target.value)}
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="time"
                                                                    className="p-2 border rounded bg-transparent dark:border-slate-700 w-full"
                                                                    value={session.startTime}
                                                                    onChange={(e) => updateSession(session.id, 'startTime', e.target.value)}
                                                                />
                                                                <span className="self-center">-</span>
                                                                <input
                                                                    type="time"
                                                                    className="p-2 border rounded bg-transparent dark:border-slate-700 w-full"
                                                                    value={session.endTime}
                                                                    onChange={(e) => updateSession(session.id, 'endTime', e.target.value)}
                                                                />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder="Ubicació (Aula...)"
                                                                className="p-2 border rounded bg-transparent dark:border-slate-700"
                                                                value={session.location}
                                                                onChange={(e) => updateSession(session.id, 'location', e.target.value)}
                                                            />
                                                        </div>
                                                        <button
                                                            className="p-2 text-slate-400 hover:text-red-600 self-end sm:self-center"
                                                            onClick={() => removeSession(session.id)}
                                                        >
                                                            <span className="material-icons-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-between items-center pt-4">
                                <button className="px-8 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center" onClick={onBack}>
                                    <span className="material-icons-outlined mr-2">close</span>
                                    Cancel·lar
                                </button>
                                <div className="flex space-x-4">
                                    <button
                                        className="px-8 py-3 bg-primary hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-md flex items-center"
                                        onClick={() => setStep(2)}
                                    >
                                        Següent
                                        <span className="material-icons-outlined ml-2">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Step 2: Docència i Documentació
    if (step === 2) {
        return (
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
                <Sidebar {...sidebarProps} />

                <main className="lg:ml-64 p-6 lg:p-10">
                    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                        <div>
                            <nav aria-label="Breadcrumb" className="flex mb-2 text-sm text-slate-500">
                                <ol className="inline-flex items-center space-x-1">
                                    <li className="inline-flex items-center">
                                        <a className="hover:text-primary transition-colors" href="#" onClick={onBack}>Cursos Actius</a>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                                        <span className="font-medium text-slate-900 dark:text-white">Nou Curs</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                                        <span className="font-medium text-slate-900 dark:text-white">Docència i Documentació</span>
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{isEditMode ? 'Editar Curs' : 'Crear Nou Curs'}</h1>
                            <p className="text-slate-500 dark:text-slate-400">Configura l'equip docent i els materials del curs</p>
                        </div>
                        {/* Header Controls Removed as per request */}
                    </header>
                    <div className="flex flex-col lg:flex-row gap-10">
                        <aside className="lg:w-72 shrink-0">
                            <nav className="sticky top-10 flex flex-col space-y-2">
                                <SidebarStep number="1" title="Dades Generals" isActive={false} isCompleted={true} />
                                <SidebarStep number="2" title="Planificació" isActive={false} isCompleted={true} />
                                <SidebarStep number="3" title="Docència i Documentació" isActive={true} />
                                <SidebarStep number="4" title="Inscripció" isActive={false} />
                            </nav>
                        </aside>
                        <div className="flex-1 max-w-4xl space-y-10">
                            <section className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                    <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                                        <span className="material-icons-outlined mr-2 text-primary">groups</span>
                                        Equip Docent
                                    </h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="docent_principal">Docent Principal</label>
                                            <div className="relative">
                                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
                                                <select
                                                    className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3"
                                                    id="docent_principal"
                                                    name="instructor"
                                                    value={courseData.instructor}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Selecciona un docent</option>
                                                    {instructors.map(inst => (
                                                        <option key={inst.id} value={inst.name}>{inst.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="equip_docent">Equip Docent Auxiliar</label>
                                            <div className="relative">
                                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">group_add</span>
                                                <input className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" id="equip_docent" placeholder="Cerca i afegeix col·laboradors..." type="text" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                    <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                                        <span className="material-icons-outlined mr-2 text-primary">upload_file</span>
                                        Materials del Curs
                                    </h2>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div>
                                        <div className="relative group border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 transition-colors hover:border-primary/50 text-center">
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                                                    <span className="material-icons-outlined text-slate-400 group-hover:text-primary text-3xl">picture_as_pdf</span>
                                                </div>
                                                <div>
                                                    <button className="text-primary font-bold hover:underline">Adjunta fitxers</button>
                                                    <span className="text-slate-500 dark:text-slate-400"> o arrossega i deixa anar</span>
                                                </div>
                                                <p className="text-xs text-slate-400">Materials de lectura, guies i exercicis (PDF, DOCX, PPTX fins a 20MB)</p>
                                            </div>
                                            <input
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                multiple
                                                type="file"
                                                onChange={handleMaterialUpload}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Fitxers Seleccionats</h3>
                                        <div className="space-y-2">
                                            {courseData.materials.length === 0 ? (
                                                <p className="text-sm text-slate-400 italic">Cap fitxer seleccionat.</p>
                                            ) : (
                                                courseData.materials.map(material => (
                                                    <div key={material.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                                        <div className="flex items-center">
                                                            <span className="material-icons-outlined text-primary mr-3">description</span>
                                                            <div>
                                                                <p className="text-sm font-medium">{material.name}</p>
                                                                <p className="text-[10px] text-slate-400 uppercase">{material.size} • {material.type}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                                            onClick={() => removeMaterial(material.id)}
                                                        >
                                                            <span className="material-icons-outlined text-xl">delete</span>
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                    <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                                        <span className="material-icons-outlined mr-2 text-primary">link</span>
                                        Gestió de Continguts i Enllaços
                                    </h2>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Descripció o instruccions addicionals</label>
                                        <textarea className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3 min-h-[120px]" placeholder="Afegeix instruccions per als alumnes o una breu descripció dels materials..."></textarea>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Enllaços d'interès</h3>
                                            <button
                                                className="text-xs font-bold text-primary flex items-center hover:opacity-80"
                                                onClick={() => setIsAddingLink(true)}
                                            >
                                                <span className="material-icons-outlined text-sm mr-1">add_circle</span>
                                                AFEGIR ENLLAÇ
                                            </button>
                                        </div>

                                        {isAddingLink && (
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                                                <input
                                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm"
                                                    placeholder="Títol de l'enllaç (ex: Estatuts UGT)"
                                                    name="title"
                                                    value={newLink.title}
                                                    onChange={handleLinkChange}
                                                />
                                                <input
                                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm"
                                                    placeholder="URL (https://...)"
                                                    name="url"
                                                    value={newLink.url}
                                                    onChange={handleLinkChange}
                                                />
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        className="px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded"
                                                        onClick={() => setIsAddingLink(false)}
                                                    >
                                                        Cancel·lar
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 text-xs font-bold text-white bg-primary hover:bg-red-700 rounded"
                                                        onClick={addLink}
                                                    >
                                                        Afegir
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {courseData.links.length === 0 && !isAddingLink ? (
                                                <p className="text-sm text-slate-400 italic col-span-2">Cap enllaç afegit.</p>
                                            ) : (
                                                courseData.links.map(link => (
                                                    <div key={link.id} className="p-4 bg-white dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-between group">
                                                        <div className="flex items-center truncate overflow-hidden">
                                                            <span className="material-icons-outlined text-slate-400 mr-3 shrink-0">link</span>
                                                            <div className="truncate">
                                                                <p className="text-sm font-semibold truncate">{link.title}</p>
                                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 truncate hover:text-primary hover:underline">{link.url}</a>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all ml-2"
                                                            onClick={() => removeLink(link.id)}
                                                        >
                                                            <span className="material-icons-outlined text-xl">delete</span>
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="flex justify-between items-center pt-4">
                                <button
                                    className="px-8 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center"
                                    onClick={() => setStep(1)}
                                >
                                    <span className="material-icons-outlined mr-2">arrow_back</span>
                                    Enrere
                                </button>
                                <div className="flex space-x-4">
                                    <button
                                        className="px-8 py-3 bg-primary hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-md flex items-center"
                                        onClick={() => setStep(3)}
                                    >
                                        Següent
                                        <span className="material-icons-outlined ml-2">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Step 4: Inscripció
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar {...sidebarProps} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div>
                        <nav aria-label="Breadcrumb" className="flex mb-2 text-sm text-slate-500">
                            <ol className="inline-flex items-center space-x-1">
                                <li className="inline-flex items-center">
                                    <a className="hover:text-primary transition-colors" href="#" onClick={onBack}>Cursos Actius</a>
                                </li>
                                <li className="flex items-center">
                                    <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                                    <span className="font-medium text-slate-900 dark:text-white">Nou Curs</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                                    <span className="font-medium text-slate-900 dark:text-white">Inscripció</span>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pas 4: {isEditMode ? 'Desar Canvis' : 'Inscripció'}</h1>
                        <p className="text-slate-500 dark:text-slate-400">Finalitza la configuració del procés d'inscripció i publica el curs</p>
                    </div>
                    {/* Header Controls Removed as per request */}
                </header>

                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className="lg:w-72 shrink-0">
                        <nav className="sticky top-10 flex flex-col space-y-2">
                            <SidebarStep number="1" title="Dades Generals" isActive={false} isCompleted={true} />
                            <SidebarStep number="2" title="Planificació" isActive={false} isCompleted={true} />
                            <SidebarStep number="3" title="Docència i Documentació" isActive={false} isCompleted={true} />
                            <SidebarStep number="4" title="Inscripció" isActive={true} />
                        </nav>
                    </aside>

                    <div className="flex-1 max-w-4xl space-y-10">
                        <section className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                                    <span className="material-icons-outlined mr-2 text-primary">app_registration</span>
                                    4. Paràmetres d'Inscripció
                                </h2>
                            </div>
                            <div className="p-8 space-y-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data límit d'inscripció</label>
                                    <div className="relative">
                                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">event_busy</span>
                                        <input
                                            className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3"
                                            type="date"
                                            name="registrationDeadline"
                                            value={courseData.registrationDeadline}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-400 italic">Després d'aquesta data, el formulari quedarà tancat automàticament.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Control d'aforament</label>
                                    <div className="relative">
                                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">groups</span>
                                        <select
                                            className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3"
                                            name="enrollmentType"
                                            value={courseData.enrollmentType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="limited">Limitar per nombre de places ({courseData.maxCapacity})</option>
                                            <option value="unlimited">Sense límit d'inscripció</option>
                                            <option value="manual">Validació manual administrativa</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-white">Llista d'espera automàtica</span>
                                        <span className="text-xs text-slate-500">Permet seguir rebent inscripcions un cop esgotades les places</span>
                                    </div>
                                    <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300"
                                            id="espera"
                                            name="enableWaitlist"
                                            type="checkbox"
                                            checked={courseData.enableWaitlist}
                                            onChange={(e) => setCourseData(prev => ({ ...prev, enableWaitlist: e.target.checked }))}
                                        />
                                        <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${courseData.enableWaitlist ? 'bg-primary' : 'bg-slate-300'}`} htmlFor="espera"></label>
                                    </div>
                                </div>

                                {/* Fixed Fields Section */}
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Camps Fixes (Obligatoris)</h3>
                                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded">No editables</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-70">
                                        {['Nom', 'Primer Cognom', 'Segon Cognom', 'DNI / NIE', 'Empresa / Centre', 'Federació (Desplegable)', 'Afiliat/da (Sí/No)'].map((field, idx) => (
                                            <div key={idx} className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-lg">
                                                <span className="material-icons-outlined text-slate-400 mr-2 text-sm">lock</span>
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{field}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Fields Section */}
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Camps personalitzats addicionals</h3>
                                        <button
                                            className="text-xs font-bold text-primary flex items-center hover:opacity-80"
                                            onClick={() => setIsAddingField(true)}
                                        >
                                            <span className="material-icons-outlined text-sm mr-1">add_circle</span>
                                            AFEGIR CAMP
                                        </button>
                                    </div>

                                    {isAddingField && (
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <input
                                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm"
                                                    placeholder="Nom del camp (ex: Al·lèrgies)"
                                                    value={newField.label}
                                                    onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                                                />
                                                <select
                                                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm"
                                                    value={newField.type}
                                                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                                                >
                                                    <option value="text">Text Curt</option>
                                                    <option value="textarea">Text Llarg</option>
                                                    <option value="select">Desplegable</option>
                                                    <option value="checkbox">Casella (Sí/No)</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="req_field"
                                                    checked={newField.required}
                                                    onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                                                    className="rounded border-slate-300 text-primary focus:ring-primary mr-2"
                                                />
                                                <label htmlFor="req_field" className="text-sm text-slate-600 dark:text-slate-400">Marcar com a obligatori</label>
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    className="px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded"
                                                    onClick={() => setIsAddingField(false)}
                                                >
                                                    Cancel·lar
                                                </button>
                                                <button
                                                    className="px-3 py-1 text-xs font-bold text-white bg-primary hover:bg-red-700 rounded"
                                                    onClick={addCustomField}
                                                >
                                                    Afegir
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-2">
                                        {courseData.customFields.length === 0 && !isAddingField ? (
                                            <p className="text-sm text-slate-400 italic text-center py-4">No hi ha camps personalitzats.</p>
                                        ) : (
                                            courseData.customFields.map(field => (
                                                <div key={field.id} className="flex items-center p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                                                    <span className="material-icons-outlined text-slate-400 mr-3">drag_indicator</span>
                                                    <div className="flex-1 text-sm font-medium">
                                                        {field.label}
                                                        <span className="ml-2 text-[10px] text-slate-400 uppercase">({field.type})</span>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        {field.required && <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 uppercase">Obligatori</span>}
                                                        <button
                                                            className="p-1 text-slate-400 hover:text-red-600"
                                                            onClick={() => removeCustomField(field.id)}
                                                        >
                                                            <span className="material-icons-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Previsualització de l'enllaç públic</label>
                                    <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-3 group border border-slate-200 dark:border-slate-800">
                                        <span className="material-icons-outlined text-slate-400 mr-2 text-sm">link</span>
                                        <code className="text-xs text-primary font-mono flex-1 truncate">{publicLink}</code>
                                        <button
                                            className="ml-2 text-slate-500 hover:text-primary transition-colors"
                                            onClick={() => navigator.clipboard.writeText(publicLink)}
                                            title="Copiar enllaç"
                                        >
                                            <span className="material-icons-outlined text-sm">content_copy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </section>

                        <div className="flex justify-between items-center pt-4">
                            <button
                                className="px-8 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center"
                                onClick={() => setStep(2)}
                            >
                                <span className="material-icons-outlined mr-2">arrow_back</span>
                                Enrere
                            </button>
                            <div className="flex space-x-4">
                                <button className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Guardar Esborrany
                                </button>
                                <button
                                    className={`px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all shadow-md flex items-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'animate-pulse'}`}
                                    disabled={isSubmitting}
                                    onClick={handlePublish}
                                >
                                    {!isSubmitting && <span className="material-icons-outlined mr-2">publish</span>}
                                    {isSubmitting ? (isEditMode ? 'Desant...' : 'Publicant...') : (isEditMode ? 'Desar Canvis' : 'Publicar Curs')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
};

export default CreateCourse;
