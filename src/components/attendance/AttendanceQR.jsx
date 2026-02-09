import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RefreshCw, Smartphone, CheckCircle, Users, Clock, Shield } from 'lucide-react';
import QRCode from "react-qr-code";

export const AttendanceQR = ({ isOpen, onClose, course, session }) => {
    if (!course) return null;
    const [qrValue, setQrValue] = useState("");
    const [scannedCount, setScannedCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minuts
    const [isRotating, setIsRotating] = useState(false);

    useEffect(() => {
        if (isOpen && course) {
            generateNewQR(session); // Use session prop if available
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        generateNewQR(session);
                        return 300;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOpen, course]);

    const generateNewQR = (specificSession = null) => {
        setIsRotating(true);
        // Simulem generació d'un token d'assistència signat
        const token = btoa(`${course.id}-${Date.now()}-${Math.random()}`);
        // Ensure the URL is absolute for scanning
        const baseUrl = window.location.origin;

        let url = `${baseUrl}/public/attendance/${course.id}?t=${token}`;

        // Add session ID if provided or if we can detect it from context
        const sessionId = specificSession?.id;
        if (sessionId) {
            url += `&sid=${sessionId}`;
        }

        setQrValue(url);
        setTimeLeft(300);
        setTimeout(() => setIsRotating(false), 500);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Control d'Assistència QR"
            footer={
                <div className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <Clock size={14} />
                        Caduca en: <span className="text-ugt-red">{formatTime(timeLeft)}</span>
                    </div>
                    <Button variant="outline" onClick={onClose}>Tancar Pantalla</Button>
                </div>
            }
        >
            <div className="flex flex-col items-center gap-8 py-4">
                {/* QR HEADER DISPLAY */}
                <div className="text-center">
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{course?.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">Escaneja amb el teu telèfon per confirmar la teva presència</p>
                </div>

                {/* DYNAMIC QR FRAME */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/10 to-blue-500/10 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white p-8 rounded-[2rem] shadow-premium border border-slate-100 flex flex-col items-center">
                        <div className={`p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 transition-all ${isRotating ? 'scale-95 opacity-50' : ''}`}>
                            <div className="w-56 h-56 flex items-center justify-center bg-white rounded-lg border border-slate-100 p-2">
                                {qrValue && (
                                    <QRCode
                                        size={256}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        value={qrValue}
                                        viewBox={`0 0 256 256`}
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => generateNewQR(session)}
                            className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-ugt-red transition-colors uppercase tracking-widest"
                        >
                            <RefreshCw size={14} className={isRotating ? 'animate-spin' : ''} />
                            Actualitzar Codi
                        </button>
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <div className="flex justify-center text-emerald-500 mb-1"><CheckCircle size={18} /></div>
                        <p className="text-lg font-black text-slate-900">{scannedCount}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Confirmats</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <div className="flex justify-center text-blue-500 mb-1"><Users size={18} /></div>
                        <p className="text-lg font-black text-slate-900">{course?.maxCapacity || 0}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Places</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <div className="flex justify-center text-amber-500 mb-1"><Shield size={18} /></div>
                        <p className="text-lg font-black text-slate-900">Actiu</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Seguretat</p>
                    </div>
                </div>

                {/* INSTRUCTIONS */}
                <div className="flex gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <Smartphone size={24} className="text-blue-600 shrink-0" />
                    <div>
                        <p className="text-[11px] text-blue-800 leading-relaxed">
                            <span className="font-bold">Important:</span> El codi s'actualitza cada 5 minuts per evitar fraus. Només és vàlid si s'escaneja presencialment a l'aula.
                        </p>
                        {session && (
                            <p className="text-[10px] text-blue-600 mt-1 font-bold italic">
                                S'està registrant l'assistència per a la sessió del {new Date(session.date).toLocaleDateString()}.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
