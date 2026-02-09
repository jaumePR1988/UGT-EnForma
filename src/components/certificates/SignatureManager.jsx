import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { storageService } from '../../services/storageService';
import { Modal } from '../ui/Modal';
import { useTranslation } from 'react-i18next';

const SignatureManager = ({ onSelectSignature }) => {
    const { t } = useTranslation();
    const [signatures, setSignatures] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [editingId, setEditingId] = useState(null); // Track which signature is being edited
    const [newSigData, setNewSigData] = useState({ name: '', role: '', file: null });

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null,
        confirmText: '',
        cancelText: ''
    });

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const showModal = ({ title, message, type = 'info', onConfirm = null }) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type,
            onConfirm,
            confirmText: t('common.accept'),
            cancelText: t('common.cancel')
        });
    };

    const handleConfirmModal = () => {
        if (modalConfig.onConfirm) modalConfig.onConfirm();
        closeModal();
    };

    // Sync signatures from Firestore
    useEffect(() => {
        const q = query(collection(db, 'signatures'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedSignatures = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSignatures(loadedSignatures);
        });
        return () => unsubscribe();
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewSigData({ ...newSigData, file: file });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validation: Name and Role are always required. File is required only for NEW signatures.
        if (!newSigData.name || !newSigData.role || (!editingId && !newSigData.file)) {
            showModal({
                title: t('common.error'),
                message: t('certificates.modal.missing_fields') || "Si us plau, completa tots els camps i selecciona un fitxer.",
                type: 'warning'
            });
            return;
        }

        setIsUploading(true);
        try {
            let downloadUrl = null;

            // 1. Upload new file if selected
            if (newSigData.file) {
                const path = `signatures/${Date.now()}_${newSigData.file.name}`;
                downloadUrl = await storageService.uploadFile(newSigData.file, path);
            }

            if (editingId) {
                // UPDATE existing
                const updateData = {
                    signerName: newSigData.name,
                    signerRole: newSigData.role,
                    updatedAt: serverTimestamp()
                };
                if (downloadUrl) {
                    updateData.url = downloadUrl;
                    updateData.fileName = newSigData.file.name;
                }

                await updateDoc(doc(db, 'signatures', editingId), updateData);

                // If the edited signature was selected, re-select to update parent
                if (selectedId === editingId && onSelectSignature) {
                    const updatedSig = signatures.find(s => s.id === editingId); // fetches old state, but close enough for ID
                    // Ideally we'd pass the new data, but parent mostly cares about ID or basic info.
                    // Let's pass the merged data to be safe
                    onSelectSignature({ id: editingId, ...updateData, url: downloadUrl || updatedSig?.url });
                }

            } else {
                // CREATE new
                const newSig = {
                    signerName: newSigData.name,
                    signerRole: newSigData.role,
                    fileName: newSigData.file.name,
                    url: downloadUrl,
                    createdAt: serverTimestamp()
                };

                const docRef = await addDoc(collection(db, 'signatures'), newSig);

                // Auto-select
                const savedSig = { id: docRef.id, ...newSig };
                setSelectedId(docRef.id);
                if (onSelectSignature) onSelectSignature(savedSig);
            }

            // Reset form
            resetForm();

        } catch (error) {
            console.error("Error saving signature:", error);
            showModal({
                title: t('common.error'),
                message: t('certificates.modal.upload_error') || "Error al guardar la firma.",
                type: 'error'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = (sig, e) => {
        e.stopPropagation();
        setEditingId(sig.id);
        setNewSigData({
            name: sig.signerName || sig.name || '',
            role: sig.signerRole || '',
            file: null // Don't pre-fill file input, show current image indicator instead if needed
        });
        setShowUploadForm(true);
    };

    const resetForm = () => {
        setNewSigData({ name: '', role: '', file: null });
        setEditingId(null);
        setShowUploadForm(false);
    };

    const handleSelect = (sig) => {
        setSelectedId(sig.id);
        if (onSelectSignature) onSelectSignature(sig);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        showModal({
            title: t('certificates.modal.delete_title') || 'Eliminar firma',
            message: t('certificates.modal.delete_confirm') || 'Estàs segur que vols eliminar aquesta firma?',
            type: 'warning',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, 'signatures', id));
                    if (selectedId === id) {
                        setSelectedId(null);
                        if (onSelectSignature) onSelectSignature(null);
                    }
                } catch (error) {
                    console.error("Error deleting signature:", error);
                    // We can show another modal or just log it, showcasing a modal is safer but tricky inside a modal callback without improved state management.
                    // For now keeping it simple as deletion failure is rare.
                }
            }
        });
    };

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center">
                    <span className="material-icons-outlined mr-2 text-primary">draw</span>
                    Gestió de Rúbriques
                </h3>
                <button
                    onClick={() => setShowUploadForm(true)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg font-medium transition-colors flex items-center"
                >
                    <span className="material-icons-outlined text-sm mr-1">add</span>
                    Nova
                </button>
            </div>

            {/* Upload Modal / Form */}
            {showUploadForm && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                    <form onSubmit={handleSave} className="space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                                {editingId ? 'Editar Firma' : 'Nova Firma'}
                            </h4>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nom del Signant</label>
                            <input
                                type="text"
                                className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                                placeholder="Ex: Josep M. Àlvarez"
                                value={newSigData.name}
                                onChange={(e) => setNewSigData({ ...newSigData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Càrrec / Rol</label>
                            <input
                                type="text"
                                className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                                placeholder="Ex: Secretari General"
                                value={newSigData.role}
                                onChange={(e) => setNewSigData({ ...newSigData, role: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                                {editingId ? "Actualitzar Imatge (Opcional)" : "Imatge de la Firma (PNG)"}
                            </label>
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                onChange={handleFileSelect}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded"
                            >
                                Cancel·lar
                            </button>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-red-700 rounded flex items-center"
                            >
                                {isUploading && <span className="material-icons-outlined animate-spin text-sm mr-2">refresh</span>}
                                {editingId ? 'Actualitzar' : 'Guardar Firma'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List of Signatures */}
            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {signatures.map(sig => (
                    <div
                        key={sig.id}
                        onClick={() => handleSelect(sig)}
                        className={`relative border rounded-lg p-3 cursor-pointer transition-all flex items-center space-x-3 group ${selectedId === sig.id
                            ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        <div className="w-12 h-12 bg-white rounded border border-slate-100 flex items-center justify-center shrink-0">
                            <img src={sig.url} alt="Firma" className="max-h-full max-w-full object-contain p-1" crossOrigin="anonymous" />
                        </div>
                        <div className="flex-1 min-w-0 pr-16">
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{sig.signerName || sig.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{sig.signerRole}</p>
                        </div>

                        {selectedId === sig.id && (
                            <div className="absolute top-2 right-2 text-primary">
                                <span className="material-icons-outlined text-lg">check_circle</span>
                            </div>
                        )}

                        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-900/80 rounded backdrop-blur-sm">
                            <button
                                onClick={(e) => handleEdit(sig, e)}
                                className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                title="Editar"
                            >
                                <span className="material-icons-outlined text-lg">edit</span>
                            </button>
                            <button
                                onClick={(e) => handleDelete(sig.id, e)}
                                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                title="Eliminar"
                            >
                                <span className="material-icons-outlined text-lg">delete</span>
                            </button>
                        </div>
                    </div>
                ))}

                {signatures.length === 0 && !showUploadForm && (
                    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                        <span className="material-icons-outlined text-slate-400 text-3xl mb-2">draw</span>
                        <p className="text-sm text-slate-500">No hi ha firmes configurades.</p>
                        <button onClick={() => setShowUploadForm(true)} className="text-primary text-xs font-bold hover:underline mt-1">
                            Afegir la primera firma
                        </button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                footer={
                    <div className="flex gap-2">
                        <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
                            {modalConfig.cancelText}
                        </button>
                        {modalConfig.onConfirm && (
                            <button
                                onClick={handleConfirmModal}
                                className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm ${modalConfig.type === 'error' ? 'bg-red-600' :
                                    modalConfig.type === 'warning' ? 'bg-amber-500' : 'bg-primary'
                                    }`}
                            >
                                {modalConfig.confirmText}
                            </button>
                        )}
                    </div>
                }
            >
                <p className="text-slate-600 p-4">{modalConfig.message}</p>
            </Modal>
        </div>
    );
};

export default SignatureManager;
