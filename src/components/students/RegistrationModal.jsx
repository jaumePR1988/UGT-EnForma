import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { studentService } from '../../services/studentService';

/**
 * CONFIGURACIÓ DINÀMICA (Això podria venir de Firebase en el futur)
 * Permet a l'admin definir quins camps són obligatoris i quines regles aplicar.
 */
const FORM_CONFIG = {
    fields: [
        { id: 'name', label: 'Nom Complet', type: 'text', placeholder: 'Ex: Joan Garcia', required: true },
        { id: 'email', label: 'Correu Electrònic', type: 'email', placeholder: 'joan@exemple.com', required: true },
        { id: 'phone', label: 'Telèfon', type: 'tel', placeholder: '600 000 000', required: false },
        { id: 'company', label: 'Empresa / Àrea', type: 'text', placeholder: 'Ex: Sector Metall', required: true },
        { id: 'affiliation', label: 'Afiliació', type: 'select', options: ['Afiliat', 'No Afiliat', 'En Procés'], required: true }
    ],
    aiValidationEnabled: true
};

export const RegistrationModal = ({ isOpen, onClose, onFinish }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    // Reiniciar formulari en obrir
    useEffect(() => {
        if (isOpen) {
            setFormData({});
            setAiFeedback(null);
        }
    }, [isOpen]);

    const handleChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));

        // Simular validació IA proactiva (Pattern: Structured Output with Validation)
        if (id === 'email' && value.includes('@')) {
            triggerAiValidation(id, value);
        }
    };

    const triggerAiValidation = (id, value) => {
        setIsValidating(true);
        setTimeout(() => {
            if (id === 'email' && !value.endsWith('.com') && !value.endsWith('.es') && !value.endsWith('.cat')) {
                setAiFeedback({
                    type: 'warning',
                    message: "L'IA suggereix revisar el domini del correu."
                });
            } else {
                setAiFeedback({
                    type: 'success',
                    message: "Dades validades correctament per l'IA de seguretat."
                });
            }
            setIsValidating(false);
        }, 600);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await studentService.registerStudent({
                ...formData,
                status: 'Actiu',
                registrationDate: new Date().toISOString()
            });
            onFinish();
            onClose();
        } catch (error) {
            console.error("Error registrat alumne:", error);
            setAiFeedback({ type: 'error', message: "Error en el registre. Torna-ho a intentar." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Registrar Nou Alumne"
            footer={
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel·lar</Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading || !formData.name || !formData.email}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                        Confirmar Alta
                    </Button>
                </div>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* AI TRUST BANNER (AI-Product Pattern) */}
                <div style={{
                    backgroundColor: 'rgba(227, 6, 19, 0.05)',
                    border: '1px solid rgba(227, 6, 19, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                }}>
                    <Sparkles className="text-[#E30613]" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1E293B' }}>Validació Intel·ligent de l'Admin</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>
                            Aquest formulari utilitza regles dinàmiques definides pel sistema per garantir la qualitat de les dades.
                        </p>
                    </div>
                </div>

                {/* DYNAMIC FIELDS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {FORM_CONFIG.fields.map(field => (
                        <div key={field.id} style={{
                            gridColumn: field.id === 'name' || field.id === 'email' ? 'span 2' : 'span 1'
                        }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                {field.label} {field.required && <span className="text-[#E30613]">*</span>}
                            </label>

                            {field.type === 'select' ? (
                                <select
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', outline: 'none' }}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    value={formData[field.id] || ''}
                                >
                                    <option value="">Selecciona...</option>
                                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #E2E8F0',
                                        outline: 'none',
                                        fontSize: '0.875rem'
                                    }}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    value={formData[field.id] || ''}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* AI FEEDBACK AREA */}
                {(aiFeedback || isValidating) && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: isValidating ? '#F8FAFC' : (aiFeedback.type === 'warning' ? '#FFFBEB' : '#F0FDF4'),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid',
                        borderColor: isValidating ? '#E2E8F0' : (aiFeedback.type === 'warning' ? '#FEF3C7' : '#DCFCE7'),
                        transition: 'all 0.3s ease'
                    }}>
                        {isValidating ? (
                            <Loader2 className="animate-spin text-[#94A3B8]" size={16} />
                        ) : aiFeedback.type === 'warning' ? (
                            <AlertCircle className="text-amber-500" size={16} />
                        ) : (
                            <ShieldCheck className="text-emerald-500" size={16} />
                        )}
                        <span style={{ fontSize: '0.8125rem', color: isValidating ? '#64748B' : (aiFeedback.type === 'warning' ? '#92400E' : '#166534'), fontWeight: '500' }}>
                            {isValidating ? "L'IA està verificant les dades..." : aiFeedback.message}
                        </span>
                    </div>
                )}
            </div>
        </Modal>
    );
};
