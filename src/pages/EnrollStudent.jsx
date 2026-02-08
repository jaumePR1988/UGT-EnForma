import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { studentService } from '../services/studentService';
import Sidebar from '../components/layout/Sidebar';

const EnrollStudent = ({ onNavigate, toggleDarkMode, courses = [], onSave, isEditMode = false }) => {
    const { studentId } = useParams();
    // Extended properties for mock courses to include custom fields configuration
    // In a real app, this would come from the backend/database
    const coursesWithConfig = courses.map(c => ({
        ...c,
        customFields: [
            { id: 'company', label: 'Empresa / Centre de treball', type: 'text', required: true },
            { id: 'observations', label: 'Observacions', type: 'textarea', required: false }
        ]
    }));

    // Example of specific configuration for demonstration (if we had IDs)
    // coursesWithConfig[0].customFields.push({ id: 'diet', label: 'Restriccions alimentàries', type: 'text', required: false });

    // Create mapping of IDs to courses for easier access
    const courseMap = coursesWithConfig.reduce((acc, course) => {
        acc[course.id] = course;
        return acc;
    }, {});

    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        dni: '',
        email: '',
        phone: '',
        federation: '',
        affiliate: '',
        // Dynamic fields will be added here
    });

    useEffect(() => {
        const loadStudentData = async () => {
            if (isEditMode && studentId) {
                try {
                    const student = await studentService.getStudentById(studentId);
                    if (student) {
                        setFormData({
                            name: student.fullName || '',
                            dni: student.dni || '',
                            email: student.email || '',
                            phone: student.phone || '',
                            federation: student.federation || '',
                            affiliate: student.affiliate || '',
                            ...student // Spread other fields
                        });
                        if (student.courseId) {
                            setSelectedCourseId(student.courseId);
                        }
                    }
                } catch (error) {
                    console.error("Error loading student:", error);
                    alert("Error carregant les dades de l'alumne.");
                }
            }
        };
        loadStudentData();
    }, [isEditMode, studentId]);

    const selectedCourse = coursesWithConfig.find(c => c.id.toString() === selectedCourseId);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare object for list view (Student.jsx expects fullName, courseTitle, etc)
        const studentToSave = {
            fullName: formData.name,
            email: formData.email,
            dni: formData.dni,
            courseId: selectedCourse?.id,
            courseTitle: selectedCourse?.name,
            isAffiliated: formData.affiliate === 'si',
            ...formData
        };

        // Remove 'id' if undefined to avoid Firestore errors, add only if editing
        if (isEditMode && studentId) {
            studentToSave.id = studentId;
        }

        if (onSave) {
            onSave(studentToSave);
        } else {
            console.log('Enrollment Data:', { course: selectedCourse, student: formData });
            onNavigate('students');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
            <Sidebar currentView="students" onNavigate={onNavigate} toggleDarkMode={toggleDarkMode} />

            <main className="lg:ml-64 p-6 lg:p-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{isEditMode ? 'Editar Alumne' : 'Inscripció Manual'}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{isEditMode ? 'Modifica les dades del participant' : 'Alta de nou participant i assignació a curs actiu'}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            className="flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                            onClick={() => onNavigate('students')}
                        >
                            <span className="material-icons-outlined mr-1 text-[20px]">arrow_back</span>
                            Tornar al llistat
                        </button>
                    </div>
                </header>

                <div className="max-w-4xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Course Selection - MOVED TO TOP */}
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="font-bold text-lg flex items-center">
                                    <span className="material-icons-outlined mr-2 text-primary">school</span>
                                    Seleccionar Curs
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Curs a inscriure</label>
                                    <div className="relative">
                                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                                        <select
                                            className="w-full pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm p-2.5"
                                            value={selectedCourseId}
                                            onChange={(e) => setSelectedCourseId(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecciona un curs actiu...</option>
                                            {coursesWithConfig.map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.name} - {course.location} ({course.status})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Selecciona el curs per carregar els camps específics del formulari d'inscripció.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Student Information - Only shows if course selected, or shows basic fields disabled? 
                            Better to show basic fields, and unlock rest when course selected.
                        */}
                        <div className={`bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300 ${!selectedCourseId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="font-bold text-lg flex items-center">
                                    <span className="material-icons-outlined mr-2 text-primary">person</span>
                                    Informació del Participant
                                </h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Base Standards Fields */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Nom i Cognoms</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm p-2.5"
                                        placeholder="Ex: Martí Jordà i Pou"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">DNI / NIE</label>
                                    <input
                                        name="dni"
                                        value={formData.dni}
                                        onChange={handleInputChange}
                                        className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm p-2.5"
                                        placeholder="12345678X"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Correu electrònic</label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm p-2.5"
                                        placeholder="alumne@exemple.cat"
                                        type="email"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Telèfon</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm p-2.5"
                                        placeholder="+34 600 000 000"
                                        type="tel"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Federació</label>
                                    <select
                                        name="federation"
                                        value={formData.federation}
                                        onChange={handleInputChange}
                                        className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm p-2.5"
                                    >
                                        <option value="">Selecciona federació...</option>
                                        <option value="fesp">FeSP (Serveis Públics)</option>
                                        <option value="fica">FICA (Indústria, Construcció i Agro)</option>
                                        <option value="smc">SMC (Serveis, Mobilitat i Consum)</option>
                                        <option value="altres">Altres</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Afiliat/da</label>
                                    <div className="flex items-center space-x-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                                name="affiliate"
                                                type="radio"
                                                value="si"
                                                checked={formData.affiliate === 'si'}
                                                onChange={handleInputChange}
                                            />
                                            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Sí</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                                name="affiliate"
                                                type="radio"
                                                value="no"
                                                checked={formData.affiliate === 'no'}
                                                onChange={handleInputChange}
                                            />
                                            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">No</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Dynamic Fields Section */}
                                {selectedCourse && selectedCourse.customFields && selectedCourse.customFields.map(field => (
                                    <div key={field.id} className="space-y-1 md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {field.label} {field.required && <span className="text-primary">*</span>}
                                        </label>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                name={field.id}
                                                value={formData[field.id] || ''}
                                                onChange={handleInputChange}
                                                className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm p-3 min-h-[80px]"
                                                required={field.required}
                                                placeholder={`Introdueix ${field.label.toLowerCase()}...`}
                                            />
                                        ) : (
                                            <input
                                                type={field.type}
                                                name={field.id}
                                                value={formData[field.id] || ''}
                                                onChange={handleInputChange}
                                                className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm p-2.5"
                                                required={field.required}
                                                placeholder={`Introdueix ${field.label.toLowerCase()}...`}
                                            />
                                        )}
                                    </div>
                                ))}

                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <button
                                className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                type="button"
                                onClick={() => onNavigate('students')}
                            >
                                Cancel·lar
                            </button>
                            <button
                                className={`bg-primary hover:bg-red-700 text-white px-8 py-2.5 rounded-lg font-bold transition-colors flex items-center shadow-md ${!selectedCourseId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={!selectedCourseId}
                            >
                                <span className="material-icons-outlined mr-2 text-[20px]">{isEditMode ? 'save' : 'how_to_reg'}</span>
                                {isEditMode ? 'Desar Canvis' : 'Confirmar Inscripció'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EnrollStudent;
