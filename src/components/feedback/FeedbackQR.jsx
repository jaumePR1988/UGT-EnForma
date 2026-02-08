import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Star, RefreshCw, Smartphone } from 'lucide-react';

export const FeedbackQR = ({ isOpen, onClose, course, session, type = 'session' }) => {
    // type: 'session' | 'course'
    const [qrValue, setQrValue] = useState("");

    useEffect(() => {
        if (isOpen && course) {
            const baseUrl = window.location.origin;
            // Construct public feedback URL
            // /public/feedback/session/:sessionId?c=courseId
            // /public/feedback/course/:courseId

            let url = "";
            if (type === 'session' && session) {
                // We use checking the session details, maybe we pass specific IDs
                // Use a simple ID for now. Ideally session has an ID.
                // Assuming session object has a date or some unique identifier we can rely on, or index.
                // For robustness, let's assume we pass a sessionId or construct one.
                const sessionId = session.id || `${course.id}_${session.date}_${session.startTime}`;
                url = `${baseUrl}/public/feedback/session/${encodeURIComponent(sessionId)}?c=${course.id}`;
            } else {
                url = `${baseUrl}/public/feedback/course/${course.id}`;
            }

            setQrValue(url);
        }
    }, [isOpen, course, session, type]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={type === 'course' ? "Valoració Final del Curs" : "Valoració de la Sessió"}
        >
            <div className="flex flex-col items-center gap-6 py-4 text-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {type === 'course' ? course.name : `Sessió: ${session?.date || 'Avui'}`}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Escaneja per valorar {type === 'course' ? 'el curs complet' : 'aquesta sessió'}
                    </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    {qrValue && (
                        <QRCode
                            size={200}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={qrValue}
                            viewBox={`0 0 256 256`}
                        />
                    )}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 flex items-start text-left gap-3">
                    <Star className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <div>
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">La teva opinió és important</p>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                            Ajuda'ns a millorar la formació amb una valoració ràpida i anònima.
                        </p>
                    </div>
                </div>

                <Button onClick={onClose} variant="primary">Tancar</Button>
            </div>
        </Modal>
    );
};
