import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { storageService } from '../../services/storageService';

const SignatureManager = ({ onSelectSignature }) => {
    const [signatures, setSignatures] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [newSigData, setNewSigData] = useState({ name: '', role: '', file: null });

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

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newSigData.file || !newSigData.name || !newSigData.role) {
            alert("Si us plau, completa tots els camps i selecciona un fitxer.");
            return;
        }

        setIsUploading(true);
        try {
            // 1. Upload to Storage
            const path = `signatures/${Date.now()}_${newSigData.file.name}`;
            const downloadUrl = await storageService.uploadFile(newSigData.file, path);

            // 2. Add to Firestore
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

            // Reset form
            setNewSigData({ name: '', role: '', file: null });
            setShowUploadForm(false);

        } catch (error) {
            console.error("Error uploading signature:", error);
            alert("Error al pujar la firma.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSelect = (sig) => {
        setSelectedId(sig.id);
        if (onSelectSignature) onSelectSignature(sig);
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Eliminar aquesta firma?')) {
            try {
                await deleteDoc(doc(db, 'signatures', id));
                if (selectedId === id) {
                    setSelectedId(null);
                    if (onSelectSignature) onSelectSignature(null);
                }
            } catch (error) {
                console.error("Error deleting signature:", error);
                alert("Error al eliminar.");
            }
        }
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
                    <form onSubmit={handleUpload} className="space-y-3">
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
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Imatge de la Firma (PNG)</label>
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
                                onClick={() => setShowUploadForm(false)}
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
                                Guardar Firma
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
                        className={`relative border rounded-lg p-3 cursor-pointer transition-all flex items-center space-x-3 ${selectedId === sig.id
                            ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        <div className="w-12 h-12 bg-white rounded border border-slate-100 flex items-center justify-center shrink-0">
                            <img src={sig.url} alt="Firma" className="max-h-full max-w-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{sig.signerName || sig.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{sig.signerRole}</p>
                        </div>

                        {selectedId === sig.id && (
                            <div className="absolute top-2 right-2 text-primary">
                                <span className="material-icons-outlined text-lg">check_circle</span>
                            </div>
                        )}

                        <button
                            onClick={(e) => handleDelete(sig.id, e)}
                            className="absolute bottom-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                            title="Eliminar"
                        >
                            <span className="material-icons-outlined text-lg">delete</span>
                        </button>
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
        </div>
    );
};

export default SignatureManager;
