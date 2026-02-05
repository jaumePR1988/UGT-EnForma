import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { studentService } from '../../services/studentService';
import { Check, X, Users, Loader2, Save } from 'lucide-react';

export const CourseAttendanceModal = ({ isOpen, onClose, course }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && course) {
            loadStudents();
        }
    }, [isOpen, course]);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const data = await studentService.getStudentsByCourse(course.id);
            setStudents(data);
        } catch (error) {
            console.error("Error loading students for course:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAttendance = (studentId) => {
        setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, attended: !s.attended } : s
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Actualitzem cadascun dels alumnes que hagin canviat l'assistència
            const promises = students.map(s =>
                studentService.updateStudent(s.id, { attended: !!s.attended })
            );
            await Promise.all(promises);
            onClose();
        } catch (error) {
            console.error("Error saving attendance:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Gestió d'Assistència: ${course?.title}`}
            footer={
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={onClose} disabled={saving}>Tancar</Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving || loading}>
                        {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                        Desar Assistència
                    </Button>
                </div>
            }
        >
            <div className="min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="animate-spin mb-4" size={32} />
                        <p className="text-sm font-bold uppercase tracking-widest">Carregant llista d'alumnes...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                        <Users size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-bold">No hi ha alumnes inscrits en aquest curs.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-xl mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumne / Empresa</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assistència</span>
                        </div>
                        {students.map(student => (
                            <div
                                key={student.id}
                                className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${student.attended ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}
                            >
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{student.fullName || student.name || 'Alumne sense nom'}</p>
                                    <p className="text-[11px] text-slate-500 font-medium">{student.company || 'Àrea no especificada'}</p>
                                </div>
                                <button
                                    onClick={() => toggleAttendance(student.id)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${student.attended ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                        }`}
                                >
                                    {student.attended ? <Check size={20} strokeWidth={3} /> : <X size={20} />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};
